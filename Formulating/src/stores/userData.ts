import { defineStore } from 'pinia'
import IngredientList from '../types/IngredientList'
import Formula from '../types/Formula'
import FormulaList from '../types/FormulaList'
import { BackendGateway } from '../types/api/backendGateway'
import Ingredient from '../types/Ingredient'
import Cookies from 'js-cookie'
import Units from '../types/Units'
import FormulaFactory from '../types/FormulaFactory'
import FormulaHelper from '../types/FormulaHelper'
import Alert from '../types/Alert'
import Settings from '../types/Settings'
import { reactive } from 'vue'

const ingredientList = reactive(new IngredientList())
const api = new BackendGateway('')
const formulaList = new FormulaList()
const displayFormulaList = false
const debug = false

let showTutorial = true
if (Cookies.get('hideTutorial') == 'true') {
  showTutorial = false
}

const alert = new Alert('test', (yesClicked) => {
  if (yesClicked) {
    if (debug) {
      console.log('yes clicked!', 'success')
    }
  } else {
    if (debug) {
      console.log('no clicked!', 'failure')
    }
  }
})
const dragIngredient = null as Ingredient | null
// let cookieFormula = Cookies.get('cachedFormula')
let cookieFormula = localStorage.getItem('cachedFormula')
// let dirtyCookieFormula = Cookies.get('dirtyCachedFormula')
const dirtyCookieFormula = localStorage.getItem('dirtyCachedFormula')
let cachedFormula = null as Formula | null
let displayFormula = null as Formula | null
let cachedUnit: Units = Cookies.get('preferredUnits')
if (cachedUnit === 'Oz') {
  if (debug) {
    console.log('found cached units in cookies' + cachedUnit)
  }
} else {
  cachedUnit = 'g'
}
if (dirtyCookieFormula) {
  cookieFormula = dirtyCookieFormula
}
if (cookieFormula) {
  if (debug) {
    console.log('found cached formula in cookies' + cookieFormula)
  }
  cachedFormula = JSON.parse(cookieFormula)
  displayFormula = FormulaFactory.createFormulaFromData(cachedFormula)

  displayFormula.updateWeights(cachedUnit)
  displayFormula.updateCost(cachedUnit)
  if (debug) {
    console.log('displayFormula loaded and updated with weights and costs')
  }
} else {
  if (debug) {
    console.log('no cached formula found in cookies')
  }
  cachedFormula = null // TODO should this be null or defaultFormula? what are pros and cons?
  displayFormula = FormulaFactory.createDefaultFormula()
}

const settings = new Settings()
settings.load()

export const userData = defineStore('data', {
  state: () => ({
    api: api,
    ingredientList: ingredientList,
    formulaList: formulaList,
    displayFormula: displayFormula,
    cachedFormula: cachedFormula,
    preferredUnits: cachedUnit,
    settings: settings,
    alert: alert,
    displayFormulaList: displayFormulaList,
    debug: debug,
    dragIngredient: dragIngredient,
    showTutorial: showTutorial,
  }),
  getters: {},
  actions: {
    async initLists() {
      ingredientList
        .populateWithTags()
        .then(() => {
          if (this.debug) {
            console.log('ingredient list populated with tags from userData init')
          }

          displayFormula.phases.forEach((phase) => {
            FormulaHelper.updateIngredientProperties(phase, ingredientList.ingredients)
          })
          this.updateDisplayFormulaWeightsAndCosts()
          return Promise.resolve()
        })
        .catch((error) => {
          if (this.debug) {
            console.log('error populating ingredient list with tags from userData init')
          }
          return Promise.reject(error)
        })

      formulaList
        .populate()
        .then(() => {
          if (this.debug) {
            console.log('formula list populated from userData init')
          }
          return Promise.resolve()
        })
        .catch((error) => {
          if (this.debug) {
            console.log('error populating formula list from userData init')
          }
          return Promise.reject(error)
        })

      return Promise.resolve()
    },
    hideTutorial() {
      Cookies.set('hideTutorial', true)
      this.showTutorial = false
    },
    resetTutorial() {
      Cookies.set('hideTutorial', false)
      this.showTutorial = true
    },
    attemptSetDisplayFormula(formula: Formula) {
      const cookiesFormula = this.getCachedFormula()
      if (this.debug) {
        console.log('attempting to set display formula' + formula.name)
      }

      if (cookiesFormula && !this.displayFormula.equals(cookiesFormula)) {
        this.triggerAlert('Save changes made to formula?', (yesClicked) => {
              FormulaHelper.handleDirtyFormulaAlertResponse(yesClicked, false, formula)
        })
      } else {
        if (this.debug) {
          console.log('no changes made to formula, redirecting')
        }
        this.setDisplayFormula(formula, 'attemptSetDisplayFormula, 127')
        this.setCachedFormula(formula)
      }
    },
    setDisplayFormula(formula: Formula, from: string) {
      if (this.debug) {
        console.log('setting display formula ' + formula.name + ', from: ' + from)
      }
      formula.phases.forEach((phase) => {
        FormulaHelper.updateIngredientProperties(phase, this.ingredientList.ingredients)
      })
      formula.updateCost(this.settings.preferredUnits)
      this.displayFormula = formula
    },
    setCachedFormula(formula: Formula) {
      if (this.debug) {
        console.log('setting cached formula ' + formula.name)
      }
      this.cachedFormula = FormulaFactory.createFormulaFromData(formula)
      localStorage.setItem('cachedFormula', JSON.stringify(formula))
      // Cookies.set('cachedFormula', JSON.stringify(formula))
      if (this.debug) {
        console.log('cached formula set to ' + formula.name)
      }
      this.clearDirtyCachedFormula()
    },
    setDirtyCachedFormula(formula: Formula) {
      localStorage.setItem('dirtyCachedFormula', JSON.stringify(formula))
      // Cookies.set('dirtyCachedFormula', JSON.stringify(formula))
    },
    clearDirtyCachedFormula() {
      localStorage.removeItem('dirtyCachedFormula')
      // Cookies.remove('dirtyCachedFormula')
    },
    getDirtyCachedFormula(): Formula {
      const formulaData = localStorage.getItem('dirtyCachedFormula')
      if (typeof formulaData == 'string') {
        return FormulaFactory.createFormulaFromData(
            JSON.parse(formulaData)
        )
      }
      return FormulaFactory.createDefaultFormula()
    },
    getCachedFormula(): Formula {
      const cachedFormula = localStorage.getItem('cachedFormula')

      if (cachedFormula) {
        return FormulaFactory.createFormulaFromData(JSON.parse(cachedFormula))
      }

      if (Cookies.get('cachedFormula') != undefined) {
        // return FormulaFactory.createFormulaFromData(JSON.parse(Cookies.get('cachedFormula')))
      } else {
        if (this.debug) {
          console.log('no cached formula found in cookies')
        }
        return null
      }

      // return this.cachedFormula // TODO this should now work as expected
      // since I am setting cachedFormula to a new Formula object with the FormulaFactory
    },
    getReactiveDisplayFormula(): Formula {
      return this.displayFormula
    },
    resetDisplayFormula() { // todo rename to restore?
      this.displayFormula = FormulaFactory.createFormulaFromData(this.getCachedFormula())
    },
    setCachedIngredients(ingredients: Ingredient[]) {
      this.cachedIngredients = ingredients
    },
    setPreferredUnit(unit: Units) {
      this.settings.preferredUnits = unit
      Cookies.set('preferredUnits', unit)
    },
    toggleFormulaListPanel() {
      // if not pinned!
      this.displayFormulaList = !this.displayFormulaList
    },
    async refreshIngredientList() {
      this.ingredientList.clear()
      await this.ingredientList.populateWithTags()
    },
    triggerAlert(message: string, callback: Function) {
      this.alert = new Alert(message, callback)
      this.alert.show()
    },
    setDragIngredient(ingredient: Ingredient) {
      this.dragIngredient = ingredient
    },
    getDragIngredient() {
      return this.dragIngredient
    },
    updateDisplayFormulaWeightsAndCosts() {
      this.displayFormula.updateWeights(this.settings.preferredUnits)
      this.displayFormula.updateCost(this.settings.preferredUnits)
    }
  }
})
