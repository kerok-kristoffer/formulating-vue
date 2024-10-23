import {BaseApiService} from "./baseApiService";
import Formula from "../Formula";
import {ApiResponse} from "./baseApiService";

export class FormulaService extends BaseApiService {
    constructor(apiUrl: string) {
        super(apiUrl);
    }

    async getFormulas(): Promise<ApiResponse<Formula[]>> {
        return this.get('users/formulas');
    }

    async createFormula(newFormula: Formula): Promise<ApiResponse<Formula>> {
        return this.post('users/formulas', newFormula);
    }

    async updateFormula(formula: Formula): Promise<ApiResponse<Formula>> {
        return this.update('users/formulas/' + formula.id, formula);
    }

    async deleteFormula(formula: Formula): Promise<ApiResponse<Formula>> {
        return this.delete('users/formulas/', formula.id);
    }
}