import Units from './Units'
import Phase from './Phase'
import FormulaSaveStatus from './FormulaSaveStatus'

class Formula {
    public totalWeight: number
    public totalWeightInOunces: number
    public description: string
    public allocatedPercentage: number
    measurement: Units
    id: number
    

    constructor(
        public name: string,
        public phases: Phase[],
        weightInGrams: number,
        public saveStatus: FormulaSaveStatus
        ) {
        this.setWeight(weightInGrams, 'g')
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
                let ingredientWeight = this.totalWeight * ingredient.percentage * 0.01
                ingredient.setWeight(ingredientWeight, 'g')
                this.allocatedPercentage += ingredient.percentage
            })
        })
    }
}

export default Formula