import IngredientProperties from "./IngredientProperties"
import Units from "./Units";

class Ingredient {
    percentage: number
    phase: number
    weightInGrams: number // ide complains on import if set to private, fix!
    weightInOunces: number

    constructor(
        public id: number | string,
        public ingredient_id: number,
        public name: string,
        public inci: string,
        ) {
        }

        setWeight(weight :number, unit :Units) :void {

            switch (unit) {
                case 'g':
                    this.weightInGrams = weight
                    this.weightInOunces = this.formatWeight(weight / 28.35)
                    break;
    
                case 'Oz':
                    this.weightInGrams = this.formatWeight(weight * 28.35)
                    this.weightInOunces = weight
                    break;
            
                default:
                    break;
            }
    
        }
    
        getWeight(unit :Units) :number {
            switch (unit) {
                case 'g':
                    return this.weightInGrams
                case 'Oz':
                    return this.weightInOunces
                default:
                    return -1
            }
        }

        formatWeight(weight :number) :number {
            return Number((Math.round(weight * 100) /100).toFixed(2))
        }
}

export default Ingredient