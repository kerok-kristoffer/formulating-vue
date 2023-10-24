import axios from 'axios'
import Formula from "./Formula";
import Phase from "./Phase";
import Ingredient from "./Ingredient";

class FormulaList {
    public formulas: Formula[];

  async populate() {
    await axios.get('users/formulas?page_id=1&page_size=50').then((response) => {
      let data = response.data

        this.formulas = []

      for (const i in data) {
        let formulaData = data[i]
        this.addToFormulaListFromApiData(formulaData)
      }
      this.formulas.sort((t1, t2) => {
        return t1.name.toLowerCase() > t2.name.toLowerCase() ? 1 : -1
      })
    })
  }

    addToFormulaListFromApiData(formulaData :Formula) {
        // Can these be cast to Formulas without all of this looping through individual sub components?
        let formulaPhases = [] as Phase[];
        for (let j in formulaData.phases) { // TODO: move this to a FormulaFactory?
            let phase = formulaData.phases[j]
            let phaseIngredients = [] as Ingredient[];

            for (let k in phase.ingredients) {
                let phaseIngredient = phase.ingredients[k]
                let newIngredient = new Ingredient(
                    phaseIngredient.id,
                    phaseIngredient.ingredient_id,
                    phaseIngredient.name,
                    phaseIngredient.inci,
                    Number(phaseIngredient.cost),
                    []
                )
                newIngredient.percentage = phaseIngredient.percentage
                newIngredient.setWeight(phaseIngredient.weightInGrams, 'g')
                newIngredient.formula_ingredient_id = phaseIngredient.id
                phaseIngredients.push(newIngredient)
            }

            let storedPhase = new Phase(phase.id, phase.name, phaseIngredients)
            storedPhase.description = phase.description

            formulaPhases.push(storedPhase)
        }

        let formula = new Formula(formulaData.name, formulaPhases, formulaData.totalWeight, 'saved', formulaData.created_at, formulaData.updated_at)
        formula.description = formulaData.description
        formula.id = formulaData.id
        this.formulas.push(formula)
    }
}

export default FormulaList
