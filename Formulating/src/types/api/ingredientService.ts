import Ingredient from "../Ingredient";
import {BaseApiService} from "./baseApiService";
import {toRefs} from "vue";
import {userData} from "../../stores/userData";

export class IngredientService extends BaseApiService{

    private pageSize: number = 750;

    constructor(apiUrl: string) {
        super(apiUrl)
    }

    async getIngredients() {
        if (userData().debug) {
            console.log(this.pageSize);
        }
        return this.get('users/ingredients?page_id=1&page_size' + this.pageSize)
    }

    async createIngredient(newIngredient: Ingredient) {
        return this.post('users/ingredients', newIngredient);
    }

    async deleteIngredient(ingredientToDelete: Ingredient) {
        return this.delete('users/ingredients/', ingredientToDelete.ingredient_id)
    }

    updateIngredient(ingredient :Ingredient) {
        let ingredientRef = toRefs(ingredient); // TODO investigate if this is actually necessary!
        let updateIngredient = new Ingredient(
            ingredientRef.ingredient_id.value,
            ingredientRef.ingredient_id.value,
            ingredientRef.name.value,
            ingredientRef.inci.value,
            ingredientRef.percentage.value,
            ingredientRef.cost.value,
            ingredientRef.tags.value);
        return this.update('users/ingredients/' + updateIngredient.ingredient_id, updateIngredient)
    }

}