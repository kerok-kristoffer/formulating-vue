import Ingredient from './Ingredient'

class Phase {

    public description: string
    public searchIngredient: string

    constructor(
        public id: number,
        public name: string,
        public ingredients: Ingredient[]
        ) {
    }

    equals(phase :Phase) :boolean {
        if (phase.name !== this.name) {
            return false;
        }
        if (phase.description != this.description) {
            return false;
        }
        if (phase.ingredients.length !== this.ingredients.length) {
            return false;
        }
        for (let i = 0; i < this.ingredients.length ; i++) {
            const ingredient = this.ingredients[i] as Ingredient;
            if (!ingredient.equalsFormulaIngredient(phase.ingredients[i] as Ingredient)) {
                console.log("ingredients not equal")
                return false;
            }
        }
        return true;
    }

    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient)
    }

    removeIngredientByIndex(index: number) :Ingredient {
        return this.ingredients.splice(index, 1)[0]
    }

    getIngredientbyId(index: number) :Ingredient {
        console.log(index)
        return this.ingredients[index]
    }

    getIngredients() :Ingredient[] {
        return this.ingredients
    }

    updateIngredientOrder() :void {
        this.orderIngredientsByPercentage(this.ingredients)
    }

    getOrderedIngredients() :Ingredient[] {
        return this.ingredients.slice().sort( (a: Ingredient, b: Ingredient) => {
            return a.percentage < b.percentage ? 1 : -1
        })
        return this.orderIngredientsByPercentage(this.ingredients)
    }

    private orderIngredientsByPercentage = (unorderedIngredients :Ingredient[]) :Ingredient[]  => {
        return unorderedIngredients.sort( (a: Ingredient, b: Ingredient) => {
                return a.percentage < b.percentage ? 1 : -1
            })
    }

    updateIngredientOrderByName() :void {
        this.orderIngredientsByName(this.ingredients)
    }

    orderIngredientsByName = (unorderedIngredients :Ingredient[]) :Ingredient[]  => {
        return unorderedIngredients.sort( (a: Ingredient, b: Ingredient) => {
                return a.name.localeCompare(b.name)
            })
    }

}

export default Phase