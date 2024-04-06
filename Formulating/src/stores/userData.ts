import { defineStore } from 'pinia'
import IngredientList from '../types/IngredientList'
import Formula from "../types/Formula";
import FormulaList from "../types/FormulaList";
import {BackendGateway} from "../types/api/backendGateway";

let ingredientList = new IngredientList()
let api = new BackendGateway('')
let formulaList = new FormulaList()


export const userData = defineStore('data', {
  state: () => ({
      api: api,
      ingredientList: ingredientList,
      formulaList: formulaList,
      cachedFormula: null as Formula | null,
  }),
  getters: {
  },
    actions: {
    setCachedFormula(formula :Formula) {
        this.cachedFormula = formula;
    },
    async refreshIngredientList() {
      this.ingredientList = new IngredientList()
    }
  }
})
