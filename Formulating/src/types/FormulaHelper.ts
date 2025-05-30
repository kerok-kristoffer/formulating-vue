import Phase from '../types/Phase';
import Ingredient from '../types/Ingredient';
import Formula from "./Formula";
import Units from "./Units";
import {userData} from "../stores/userData";
import FormulaFactory from "./FormulaFactory";
import {useAccountStore} from "../stores/account";

export default class FormulaHelper {

  /**
   * Updates the ingredient properties in the formula phase with the latest ingredient properties from the ingredient list.
   * @param phase
   * @param ingredients
   */
  static updateIngredientProperties(phase: Phase, ingredients: Ingredient[]): void {
    phase.ingredients.forEach((ingredient) => {
      const latestIngredient = ingredients.find((i: Ingredient) => i.ingredient_id === ingredient.ingredient_id);
      if (latestIngredient) {
        if (userData().debug) {
          console.log('updating formula ingredient: ', latestIngredient)
          console.log('tags: ' + latestIngredient.tags)
        }
        ingredient.name = latestIngredient.name
        ingredient.inci = latestIngredient.inci
        ingredient.tags = latestIngredient.tags

        let isPromptForUpdatingIngredientCostChoiceImplemented = false;

        if ((!ingredient.cost || ingredient.cost === 0) && latestIngredient.cost !== 0 && isPromptForUpdatingIngredientCostChoiceImplemented) {
          console.log('setting ingredient cost to ' + latestIngredient.cost)
          ingredient.cost = latestIngredient.cost
        }
      } else {
        if (userData().debug) {
          console.error('Ingredient not found in ingredient list: ', ingredient)
        }
      }
    });
  }

  /**
   * Overrides values of the current formula with the values of the wanted formula.
   * @param currentFormula
   * @param wantedFormula
   * @param unit
   */
  static restoreFormula(currentFormula: Formula, wantedFormula: Formula, unit: Units): void {
    if (userData().debug) {
      console.log('resetting all values for ' + currentFormula.name)
    }
    currentFormula.name = wantedFormula.name
    currentFormula.totalWeight = wantedFormula.totalWeight
    currentFormula.totalWeightInOunces = wantedFormula.totalWeightInOunces
    currentFormula.phases = wantedFormula.phases
    currentFormula.updated_at = wantedFormula.updated_at
    currentFormula.created_at = wantedFormula.created_at
    currentFormula.description = wantedFormula.description
    currentFormula.saveStatus = wantedFormula.saveStatus
    currentFormula.updateWeights(unit)
    currentFormula.updateCost(unit)

  }

  static async submitFormula(formula :Formula) {

    if (formula.name == undefined || formula.name == "") {
      useAccountStore().notify("Formula name is required", "error")
      return
    }

    if(formula.saveStatus !== 'new') {
      await this.updateFormula(formula)
      userData().setDisplayFormula(formula, "updateFormula FormulaHelper 89")
      userData().setCachedFormula(formula)
      userData().formulaList.updateFormulaInList(formula)
      useAccountStore().notify(formula.name + " formula updated", "success")
      return
    }

    FormulaHelper.submitNewFormula(formula)
  }

  static submitNewFormula(formula :Formula) {
    if (userData().debug) {
      console.log("submitting new formula: " + formula.name)
    }
    if (formula.id == undefined || formula.id != 0) {
      if (userData().debug) {
        console.error("formulaId should be 0 for new formulas")
      }
      formula.id = 0;
    }

    userData().api.getFormulaService().createFormula(formula).then(response => {

      useAccountStore().notify(userData().displayFormula.name + " saved", "success")
      userData().displayFormula.saveStatus = 'saved'
      userData().displayFormula.id = response.id
      userData().formulaList.addFormula(userData().getReactiveDisplayFormula())

      userData().setCachedFormula(userData().getReactiveDisplayFormula())
    }).catch(error => {
      useAccountStore().notify("Error saving formula: " + error, "error")
    })
  }

    /**
     * Sends an update request to the server to update the formula.
     * @param formula
     */
  static async updateFormula(formula :Formula) {

    if (formula.name == undefined || formula.name == "") {
      useAccountStore().notify("Formula name is required", "error")
      return
    }

    await userData().api.getFormulaService().updateFormula(formula).then( (response) => {

    }).catch( (error) => {
      if (userData().debug) {
        console.error("error updating formula", error)
      }

    }).finally( () => {
      if (userData().debug) {
        console.log("formula updated finally")
      }
    })
  }

    /**
     * Duplicates a formula and sends it to the server.
     * @param formula
     */
  static duplicateFormula(formula :Formula) {
    let duplicate = FormulaFactory.duplicateFormula(formula)

    userData().api.getFormulaService().createFormula(duplicate).then( (response) => {
      if (userData().debug) {
        console.log(response)
      }
      duplicate = FormulaFactory.createFormulaFromData(response)
      userData().formulaList.addFormula(duplicate)
      if (userData().debug) {
        console.log("formula duplicated successfully" + duplicate.toString())
      }

    }).catch( (error) => {
      if (userData().debug) {
        console.error("error duplicating formula", error)
      }
      duplicate = null
    })
    return duplicate
  }

    /**
     * Deletes a formula from the server.
     * @param formula
     */
  static deleteFormula(formula :Formula) {
    return userData().api.getFormulaService().deleteFormula(formula)
  }

  static weightUpdate(formula :Formula, unit :Units) {
    formula.updateWeights(unit)
    formula.updateCost(unit)
  }

  static updateIngredientWeight(formula: Formula, formulaUnit: Units, ingredient: Ingredient) {
    let ingredientWeight = formula.getWeight(formulaUnit) * ingredient.percentage * 0.01
    ingredient.setWeight(ingredientWeight, formulaUnit)

    formula.updateWeights(formulaUnit)
    formula.updateCost(formulaUnit)
  }

  static removePhase(formula: Formula, phaseIndex :number) {
    // TODO consider adding an alert to confirm deletion if phase has ingredients
    formula.phases.splice(phaseIndex, 1)
    formula.updateWeights(formula.measurement)
    formula.updateCost(formula.measurement)
  }

  static addPhase(formula: Formula) {
    formula.phases.push(FormulaFactory.createEmptyPhase())
  }

  static async handleDirtyFormulaAlertResponse(
    saveChanges: boolean,
    pinListView: boolean,
    clickedFormula: Formula
  ) {
    if (saveChanges) {
      await this.saveDetectedChangesToFormula(clickedFormula);
    } else {
      await this.discardChangesToFormula();
    }
    if (pinListView) {
     userData().toggleFormulaListPanel()
    }
    userData().setDisplayFormula(clickedFormula, "handleDirtyFormulaAlertResponse, FormulaHelper 159")
    userData().setCachedFormula(clickedFormula)
  }

  private static async discardChangesToFormula() {
    if (userData().displayFormula === null || userData().displayFormula === undefined) {
      return
    }
    if (userData().displayFormula.saveStatus === 'new') {
        userData().setDisplayFormula(FormulaFactory.createDefaultFormula(), "discardChangesToFormula FormulaHelper 171")
        userData().setCachedFormula(userData().displayFormula)
        return
    }
    const userDisplayFormula = FormulaFactory.createFormulaFromData(userData().displayFormula)
    userDisplayFormula.description = userData().displayFormula.description
    userDisplayFormula.updateWeights(userData().settings.preferredUnits)

    userDisplayFormula.updateCost(userData().settings.preferredUnits) // TODO this should really not be needed

    const resetFormula = userData().formulaList.resetFormulaToCookieFormula(userDisplayFormula)

    if (userData().debug) {
      console.log("resetting display formula resetFormula " + resetFormula.name)
    }
    userData().resetDisplayFormula()
  }

  private static async saveDetectedChangesToFormula(clickedFormula: Formula) {
    await this.updateFormula(userData().getReactiveDisplayFormula())
    // await this.submitFormula(userData().getReactiveDisplayFormula());
    userData().formulaList.updateFormulaInList(userData().getReactiveDisplayFormula())
    if (userData().debug) {
      console.log("done saving changes to formula: " + userData().getReactiveDisplayFormula().name)
    }
  }

  public static formatDecimal(value: number): number {
    return Number((Math.round(value * 100) / 100).toFixed(2))
  }

}