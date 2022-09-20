import Ingredient from './Ingredient'

class Phase {

    public description: string

    constructor(
        public id: number,
        public name: string,
        public ingredients: Ingredient[]
        ) {
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

    updateIngredientOrder() :void {
        this.orderIngredientsByPercentage(this.ingredients)
    }

    orderIngredientsByPercentage = (unorderedIngredients :Ingredient[]) :Ingredient[]  => {
        return unorderedIngredients.sort( (a: Ingredient, b: Ingredient) => {
                return a.percentage < b.percentage ? 1 : -1
            })
    }

}

export default Phase