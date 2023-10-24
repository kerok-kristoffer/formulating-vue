import {BaseApiService} from "./baseApiService";
import Formula from "../Formula";
import {ApiResponse} from "./baseApiService";

export class FormulaService extends BaseApiService {
    constructor(apiUrl: string) {
        super(apiUrl);
    }

    async getFormulas(): Promise<ApiResponse<Formula[]>> {
        return this.makeRequest<Formula[]>('formulas', 'GET');
    }

    async createFormula(newFormula: Formula): Promise<ApiResponse<Formula>> {
        return this.makeRequest<Formula>('formulas', 'POST', newFormula);
    }
}