import Formula from './Formula';
import Phase from './Phase';
import Ingredient from './Ingredient';

class FormulaFactory {
  static createFormulaFromData(data: any): Formula {
    if (!this.isValidFormulaData(data)) {
      throw new Error('Invalid formula data');
    }
    // TODO  implement Phase and Ingredient Factories and use them wherever I am currently instantiating these objects directly.
    // TODO should probably have one for fromData, and one for a new clean object
    const phases = data.phases ? data.phases.map((phaseData: any) => this.createPhaseFromData(phaseData)) : [];
    let formula = new Formula(data.id, data.name, phases, data.totalWeight, data.saveStatus, data.created_at, data.updated_at);
    formula.description = data.description;
    formula.estimatedCost = data.estimatedCost;
    return formula;
  }

  static duplicateFormula(formula: Formula): Formula {
    console.log('Duplicating formula', formula.name);
    let duplicate = this.createFormulaFromData(formula);
    duplicate.id = 0;
    duplicate.name = formula.name + ' (copy)';
    this.setFormulaIngredientIdsToZero(duplicate);
    duplicate.saveStatus = 'new';

    return duplicate;
  }

  static setFormulaIngredientIdsToZero(formula: Formula){
    console.log('Setting formula ingredient ids to zero', formula.name);
    formula.phases.forEach((phase: Phase) => {
      phase.ingredients.forEach((ingredient: Ingredient) => {
        ingredient.id = 0;
      });
    });
  }

  static createPhaseFromData(data: any): Phase {
    if (!this.isValidPhaseData(data)) {
      throw new Error('Invalid phase data');
    }
    const ingredients = data.ingredients ? data.ingredients.map((ingredientData: any) => this.createIngredientFromData(ingredientData)) : [];
    let phase = new Phase(data.id, data.name, ingredients);
    phase.description = data.description;
    return phase;
  }

  static createIngredientFromData(data: any): Ingredient {
    if (!this.isValidIngredientData(data)) {
      throw new Error('Invalid ingredient data');
    }
    return new Ingredient(data.id, data.ingredient_id, data.name, data.inci, data.percentage, data.cost, data.tags);
  }

  static createEmptyPhase(): Phase {
    return new Phase(0, 'New Phase', []);
  }

  static createDefaultFormula(): Formula {
    const defaultEmptyPhases = [this.createEmptyPhase()];
    return new Formula( 0, "", defaultEmptyPhases, 100, 'new', '', '');
  }

  private static isValidFormulaData(data: any): boolean {
    if (!Array.isArray(data.phases)) {
        console.log('Invalid formula data, phases is not an array', data);
        data.phases = [];
    }
    let b = data &&
        typeof data.name === 'string' &&
        Array.isArray(data.phases) &&
        typeof data.totalWeight === 'number';
    if (!b) {
        console.log('Invalid formula data', data);
    }
    return b;
  }

  private static isValidPhaseData(data: any): boolean {

    if(!Array.isArray(data.ingredients)){ // workaround for bad Phases on load
      data.ingredients = []
    }

    let isValid = data && typeof data.id === 'number' && typeof data.name === 'string' && Array.isArray(data.ingredients);
    if (!isValid) {
      console.log('Invalid phase data', data);
    }
    return isValid;
  }

  private static isValidIngredientData(data: any): boolean {
    let isValid = data &&
        typeof data.id === 'number' &&
        typeof data.ingredient_id === 'number' &&
        typeof data.name === 'string' &&
        typeof data.inci === 'string' &&
        typeof data.cost === 'number' &&
        (data.tags == undefined || Array.isArray(data.tags));
    if (!isValid) {
      console.log('Invalid ingredient data', data);
    }
    return isValid;
  }
}

export default FormulaFactory;