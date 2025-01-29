import Formula from './Formula'
import Phase from './Phase'
import Ingredient from './Ingredient'

class FormulaFactory {
  static createFormulaFromData(data: any): Formula {
    if (!this.isValidFormulaData(data)) {
      throw new Error('Invalid formula data')
    }
    // TODO  implement Phase and Ingredient Factories and use them wherever I am currently instantiating these objects directly.
    // TODO should probably have one for fromData, and one for a new clean object
    const phases = data.phases
      ? data.phases.map((phaseData: any) => this.createPhaseFromData(phaseData))
      : []
    const formula = new Formula(
      data.id,
      data.name,
      phases,
      data.totalWeight,
      data.saveStatus,
      data.created_at,
      data.updated_at
    )
    formula.description = data.description
    formula.estimatedCost = data.estimatedCost
    return formula
  }

  static duplicateFormula(formula: Formula): Formula {
    console.log('Duplicating formula', formula.name)
    const duplicate = this.createFormulaFromData(formula)
    duplicate.id = 0
    duplicate.name = formula.name + ' (copy)'
    this.setFormulaIngredientIdsToZero(duplicate)
    duplicate.saveStatus = 'new'

    return duplicate
  }

  static setFormulaIngredientIdsToZero(formula: Formula) {
    console.log('Setting formula ingredient ids to zero', formula.name)
    formula.phases.forEach((phase: Phase) => {
      phase.ingredients.forEach((ingredient: Ingredient) => {
        ingredient.id = 0
      })
    })
  }

  static createPhaseFromData(data: any): Phase {
    if (!this.isValidPhaseData(data)) {
      throw new Error('Invalid phase data')
    }
    const ingredients = data.ingredients
      ? data.ingredients
          .filter((i: never) => i !== null)
          .map((ingredientData: any) => this.createIngredientFromData(ingredientData))
      : []
    const phase = new Phase(data.id, data.name, ingredients)
    phase.description = data.description
    return phase
  }

  static createIngredientFromData(data: any): Ingredient {
    if (!this.isValidIngredientData(data)) {
      throw new Error('Invalid ingredient data')
    }
    return new Ingredient(
      data.id,
      data.ingredient_id,
      data.name,
      data.inci,
      data.percentage,
      data.cost,
      data.tags
    )
  }

  static createEmptyPhase(): Phase {
    return new Phase(0, '', [])
  }

  static createDefaultFormula(): Formula {
    const defaultEmptyPhases = [this.createEmptyPhase()]
    return new Formula(0, '', defaultEmptyPhases, 100, 'new', '', '')
  }

  static createIngredientFromAPIData(data: any, optionalId: number): Ingredient {
    if (!this.isValidIngredientAPIData(data)) {
      throw new Error('Invalid ingredient data')
    }
    console.log('creating ingredient from API data: ' + data) // data.Id seems to not be correct here, it seems to be same as ingredient_id)
    return new Ingredient(optionalId, data.Id, data.Name, data.Inci, 0, data.cost, data.tags)
  }

  private static isValidIngredientAPIData(data: any): boolean {
    if (data.tags === null) {
      // workaround for bad Ingredients on load
      data.tags = []
    }

    const isValidApiData =
      data &&
      typeof data.Id == 'number' &&
      typeof data.Name == 'string' &&
      typeof data.Inci == 'string' &&
      typeof data.cost == 'number' &&
      (data.tags == undefined || Array.isArray(data.tags))

    return isValidApiData
  }

  private static isValidFormulaData(data: any): boolean {
    if (!Array.isArray(data.phases)) {
      console.log('Invalid formula data, phases is not an array', data)
      data.phases = []
    }
    const b =
      data &&
      typeof data.name === 'string' &&
      Array.isArray(data.phases) &&
      typeof data.totalWeight === 'number'
    if (!b) {
      console.log('Invalid formula data', data)
    }
    return b
  }

  private static isValidPhaseData(data: any): boolean {
    if (!Array.isArray(data.ingredients)) {
      // workaround for bad Phases on load
      data.ingredients = []
    }

    const isValid =
      data &&
      typeof data.id === 'number' &&
      typeof data.name === 'string' &&
      Array.isArray(data.ingredients)
    if (!isValid) {
      console.log('Invalid phase data', data)
    }
    return isValid
  }

  private static isValidIngredientData(data: any): boolean {
    if (data.tags === null) {
      // workaround for bad Ingredients on load
      data.tags = []
    }

    if (!data.ingredient_id) {
      // workaround for bad Ingredients on load
      data.ingredient_id = 0
    }

    const isValid =
      data &&
      typeof data.id === 'number' &&
      typeof data.ingredient_id === 'number' &&
      typeof data.name === 'string' &&
      typeof data.inci === 'string' &&
      typeof data.cost === 'number' &&
      (data.tags == undefined || Array.isArray(data.tags))

    return isValid
  }
}

export default FormulaFactory
