import Units from './Units'
import Phase from './Phase'
import Ingredient from './Ingredient'
import FormulaSaveStatus from './FormulaSaveStatus'

class Formula {
    public totalWeight: number
    public totalWeightInOunces: number
    public description: string
    public allocatedPercentage: number
    public estimatedCost: number
    measurement: Units
    id: number
    

    constructor(
        public name: string,
        public phases: Phase[],
        weightInGrams: number,
        public saveStatus: FormulaSaveStatus,
        public created_at: string,
        public updated_at: string
        ) {
        this.setWeight(weightInGrams, 'g')
        this.description = "";
    }

    setWeight(weight :number, unit :Units) :void {

        this.totalWeight = Number(weight)
        this.measurement = unit

        this.updateWeights(unit)
    }

    getWeight(unit :Units) :number {
        switch (unit) {
            case 'g':
                return this.totalWeight
            case 'Oz':
                return this.totalWeightInOunces
            default:
                return -1
        }
    }

    getAllocatedPercentagesRemaining() :Number {
        return 100 - this.allocatedPercentage
    }

    updateWeights(unit :Units) :void {

        switch (unit) {
            case 'g':
                this.totalWeightInOunces = Number((Math.round(this.totalWeight / 28.35 * 100) / 100).toFixed(2))
                break;

            case 'Oz':
                this.totalWeight = Number((Math.round(this.totalWeightInOunces * 28.35 * 100) / 100).toFixed(2))
                break;
        
            default:
                return;
        }

        if(this.phases === undefined) {
            console.log("phases are undefined")
            return
        }
        this.allocatedPercentage = 0
        this.phases.forEach(p => {
            p.ingredients.forEach(ingredient => {
                let ingredientWeight = this.totalWeight * Number(ingredient.percentage) * 0.01
                ingredient.setWeight(ingredientWeight, 'g')
                if(ingredient.percentage) {
                    this.allocatedPercentage += Number(ingredient.percentage)
                }
            })
        })
    }

    updateCost(unit :Units) :void {
        this.estimatedCost = 0
        
        this.phases.forEach(p => {
            p.ingredients.forEach(ingredient => {
                let ingredientWeight = this.totalWeight * ingredient.percentage * 0.01
                let ingredientCost = Number(ingredientWeight * ingredient.cost * 0.001)
                
                if(ingredient.cost) {
                    this.estimatedCost += ingredientCost
                }
            })
        })

    }

    getInciList() :string[] {

        let ingredientList :Ingredient[] = []
        let incis: string[] = []

        this.phases.forEach(p => {
            ingredientList = ingredientList.concat(p.ingredients)
        })

        ingredientList.sort((a, b) => b.percentage - a.percentage)

        ingredientList.forEach(i => {
            
            if (!i.inci || i.inci == "") {
                return
            }
            incis.push(i.inci)
        })

        return incis
    }

    hasIngredient(ingredient :Ingredient) :boolean {

        for (let i = 0; i < this.phases.length; i++) {
            let phasesWithIngredient = this.phases[i].ingredients.filter(ing => {
                return ing.ingredient_id == ingredient.ingredient_id;
            })
            if (phasesWithIngredient.length > 0) {
                return true;
            }
        }
        return false;
    }

}

export default Formula