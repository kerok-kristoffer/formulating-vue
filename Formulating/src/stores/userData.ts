import { defineStore } from 'pinia'
import IngredientList from '../types/IngredientList'
import Formula from "../types/Formula";
import FormulaList from "../types/FormulaList";
import {BackendGateway} from "../types/api/backendGateway";
import Ingredient from "../types/Ingredient";
import Cookies from "js-cookie";
import Units from "../types/Units";
import FormulaFactory from "../types/FormulaFactory";
import FormulaHelper from "../types/FormulaHelper";
import Alert from "../types/Alert";
import Settings from "../types/Settings";
import {watch} from "vue";

let ingredientList = new IngredientList()
let api = new BackendGateway('')
let formulaList = new FormulaList()
let displayFormulaList = false
let debug = false

let alert = new Alert("test", (yesClicked) => {
    if(yesClicked) {
        console.log("yes clicked!", "success")
    } else {
        console.log("no clicked!", "failure")
    }
})
let dragIngredient = null as Ingredient | null
let cookieFormula = Cookies.get('cachedFormula')
let dirtyCookieFormula = Cookies.get('dirtyCachedFormula')
let cachedFormula = null as Formula | null
let displayFormula = null as Formula | null
let cachedUnit :Units = Cookies.get('preferredUnits')
if (cachedUnit === 'Oz') {
    console.log("found cached units in cookies" + cachedUnit)
} else {
    cachedUnit = 'g'
}
if(dirtyCookieFormula) {
    cookieFormula = dirtyCookieFormula
}
if (cookieFormula) {
    console.log("found cached formula in cookies" + cookieFormula)
    cachedFormula = JSON.parse(cookieFormula)
    displayFormula = FormulaFactory.createFormulaFromData(cachedFormula)

    displayFormula.updateWeights(cachedUnit)
    displayFormula.updateCost(cachedUnit)
    console.log("displayFormula loaded and updated with weights and costs")

} else {
    console.log("no cached formula found in cookies")
    cachedFormula = null // TODO should this be null or defaultFormula? what are pros and cons?
    displayFormula = FormulaFactory.createDefaultFormula()
}

let settings = new Settings()
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
      dragIngredient: dragIngredient
  }),
  getters: {
  },
    actions: {
      async initLists() {

          ingredientList.populateWithTags().then( () => {
              console.log("ingredient list populated with tags from userData init")

              displayFormula.phases.forEach(phase => {
                  FormulaHelper.updateIngredientProperties(phase, ingredientList.ingredients);
              })
              this.updateDisplayFormulaWeightsAndCosts()
              return Promise.resolve()
          }).catch((error) => {
              console.log("error populating ingredient list with tags from userData init")
              return Promise.reject(error)
          });

          formulaList.populate().then(() => {
                console.log("formula list populated from userData init")
                return Promise.resolve()
          }).catch((error) => {
                console.log("error populating formula list from userData init")
                return Promise.reject(error)
          })

          return Promise.resolve();
      },
      attemptSetDisplayFormula(formula :Formula) {
          let cookiesFormula = this.getCachedFormula()
          console.log("attempting to set display formula" + formula.name)

          if (cookiesFormula && !this.displayFormula.equals(cookiesFormula)) {
              this.triggerAlert("Save changes made to formula?",
                  (yesClicked) => FormulaHelper.handleDirtyFormulaAlertResponse(yesClicked, false, formula))
          } else {
              console.log("no changes made to formula, redirecting")
              this.setDisplayFormula(formula, "attemptSetDisplayFormula, 112");
              this.setCachedFormula(formula);
          }
      },
      setDisplayFormula(formula :Formula, from :string) {
          console.log("setting display formula " + formula.name + ", from: "  + from)
          formula.phases.forEach(phase => {
              FormulaHelper.updateIngredientProperties(phase, this.ingredientList.ingredients);
          });
          formula.updateCost(this.settings.preferredUnits)
          this.displayFormula = formula
      },
    setCachedFormula(formula :Formula) {
        console.log("setting cached formula " + formula.name)
        this.cachedFormula = FormulaFactory.createFormulaFromData(formula);
        Cookies.set('cachedFormula', JSON.stringify(formula))
        this.clearDirtyCachedFormula()
    },
    setDirtyCachedFormula(formula :Formula) {
      Cookies.set('dirtyCachedFormula', JSON.stringify(formula))
    },
    clearDirtyCachedFormula() {
      Cookies.remove('dirtyCachedFormula')
    },
    getCachedFormula() :Formula {
          if (Cookies.get('cachedFormula') != undefined) {
              return FormulaFactory.createFormulaFromData(JSON.parse(Cookies.get('cachedFormula')))
          } else {
              console.log("no cached formula found in cookies")
              return null
          }

      // return this.cachedFormula // TODO this should now work as expected
        // since I am setting cachedFormula to a new Formula object with the FormulaFactory
    },
    getReactiveDisplayFormula() :Formula {
        return this.displayFormula
    },
    resetDisplayFormula() {
      this.displayFormula = FormulaFactory.createFormulaFromData(this.getCachedFormula())
    },
    setCachedIngredients(ingredients :Ingredient[]) {
        this.cachedIngredients = ingredients
    },
    setPreferredUnit(unit :Units) {
        this.settings.preferredUnits = unit
        Cookies.set('preferredUnits', unit)
    },
    toggleFormulaListPanel() {
          // if not pinned!
      this.displayFormulaList = !this.displayFormulaList
    },
    async refreshIngredientList() {
      this.ingredientList = new IngredientList()
        await this.ingredientList.populate()
    },
    triggerAlert(message :string, callback :Function) {
        this.alert = new Alert(message, callback)
        this.alert.show()
    },
    setDragIngredient(ingredient :Ingredient) {
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