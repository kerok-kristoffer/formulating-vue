import { FormulaService } from './formulaService'
import { IngredientService } from './ingredientService'

export class BackendGateway {
  private readonly ingredientService: IngredientService
  private readonly formulaService: FormulaService

  constructor(apiUrl: string) {
    this.ingredientService = new IngredientService(apiUrl)
    this.formulaService = new FormulaService(apiUrl)
  }

  getIngredientService(): IngredientService {
    return this.ingredientService
  }

  getFormulaService(): FormulaService {
    return this.formulaService
  }
}
