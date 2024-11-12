import axios from 'axios'
import Formula from "./Formula";
import Phase from "./Phase";
import Ingredient from "./Ingredient";
import FormulaFactory from "./FormulaFactory";
import FormulaHelper from "./FormulaHelper";
import {userData} from "../stores/userData";

class FormulaList {
    public formulas: Formula[];

  async populate() {
    await axios.get('users/formulas?page_id=1&page_size=50').then((response) => {
      let data = response.data

        this.formulas = []

        if (data === null) {
            if (userData().debug) {
                console.log("no formulas found")
            }
            return
        }

        if (userData().debug) {
            console.log("formulas found: " + data.length)
        }
      for (const i in data) {
        let formulaData = data[i]
        this.addToFormulaListFromApiData(formulaData)
      }
      this.sort();
    })
  }

  public removeFormula(formula: Formula) {
      for (let i in this.formulas) {
          if (this.formulas[i].id == formula.id) {
              if (userData().debug) {
                  console.log("deleting:" + formula.id + " at: " + i);
              }
              this.formulas.splice(Number(i), 1)
              break;
          }
      }
  }

  public resetFormulaToCookieFormula(formula: Formula) {
      let formulaToReset = this.getFormulaById(formula.id)

        if (formulaToReset == null) {
            console.error("could not find formula to reset")
            return
        }
        let cookieFormula = userData().getCachedFormula()

      if (!cookieFormula) {
            console.error("could not find cookie formula")
          return
      }
        FormulaHelper.restoreFormula(formulaToReset, cookieFormula, userData().settings.preferredUnits)

      return formulaToReset
  }

  public updateFormulaInList(formula: Formula) {
        for (let i in this.formulas) {
            if (this.formulas[i].id == formula.id) {
                this.formulas[i] = formula
                break
            }
        }

        this.sort()
  }

  public getFormulaById(id: number) {
    for (let i in this.formulas) {
        if (this.formulas[i].id == id) {
            return this.formulas[i]
        }
    }
    return null
  }


    public sort() {
        this.formulas.sort((t1, t2) => {
            return t1.name.toLowerCase() > t2.name.toLowerCase() ? 1 : -1
        })
    }



    public addToFormulaListFromApiData(formulaData :Formula) {
        let formula = FormulaFactory.createFormulaFromData(formulaData)
        formula.id = formulaData.id
        this.addFormula(formula)
    }

    public addFormula(newFormula: Formula) {
        this.formulas.push(newFormula)
        this.sort()
    }
}

export default FormulaList
