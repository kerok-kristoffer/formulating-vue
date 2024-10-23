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
    

    constructor(
        public id: number,
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

    equals(formula :Formula) :boolean {
        if (formula.name !== this.name) {
            console.log("name not equal, " + formula.name + ", vs " + this.name)
            return false;
        }
        if (formula.totalWeight !== this.totalWeight) {
            console.log("totalWeight not equal")
            return false;
        }
        if (formula.totalWeightInOunces !== this.totalWeightInOunces) {
            console.log("totalWeightInOunces not equal")
            return false;
        }
        if (formula.phases.length !== this.phases.length) {
            console.log("phases length not equal")
            return false;
        }
        if(formula.description != this.description) {
            console.log("description not equal")
            console.log("cached:" + formula.description)
            console.log("display:" + this.description)
            return false;
        }
        if (formula.allocatedPercentage !== this.allocatedPercentage) {
            console.log("allocatedPercentage not equal")
            return false;
        }
        if (formula.estimatedCost !== this.estimatedCost) {
            console.log("estimatedCost not equal")

            console.log("cached" + formula.estimatedCost)
            console.log("display" + this.estimatedCost)
            return false;
        }

        for (let i = 0; i < this.phases.length ; i++) {
            const phase = this.phases[i] as Phase;
            if (!phase.equals(formula.phases[i] as Phase)) {
                console.log("phases not equal")
                return false;
            }
        }
        return true;
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

        this.phases.forEach(p => {
            ingredientList = ingredientList.concat(p.ingredients)
        })

        return ingredientList
            .filter((i) => i.inci != undefined && i.inci != "")
            .sort((a, b) => b.percentage - a.percentage)
            .map((i) => i.inci)
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

    getIngredientList() :Ingredient[] {
        let ingredients :Ingredient[] = []
        console.log("getting ingredient list from Formula " + this.name)
        this.phases.forEach(p => {
            ingredients = ingredients.concat(p.ingredients)
            p.ingredients.forEach(i => {
                console.log(i.tags)
            })
        })
        return ingredients
    }


    moveIngredientFromPhaseToPhase(ingredientIndex: number, fromPhaseKey: number, toPhase: Phase): void {
        const fromPhase = this.phases[fromPhaseKey];
        if (fromPhase) {
            const ingredient = fromPhase.removeIngredientByIndex(ingredientIndex);
            if (ingredient) {
                toPhase.addIngredient(ingredient);
                toPhase.updateIngredientOrder();
            }
        }
    }

    toString(): string {
        let formulaString = `Formula: ${this.name}\n`;
        formulaString += `ID: ${this.id}\n`;
        formulaString += `Description: ${this.description}\n`;
        formulaString += `Total Weight: ${this.totalWeight} ${this.measurement}\n`;
        formulaString += `Total Weight in Ounces: ${this.totalWeightInOunces}\n`;
        formulaString += `Allocated Percentage: ${this.allocatedPercentage}\n`;
        formulaString += `Estimated Cost: ${this.estimatedCost}\n`;
        formulaString += `Created At: ${this.created_at}\n`;
        formulaString += `Updated At: ${this.updated_at}\n`;
        formulaString += `Save Status: ${this.saveStatus}\n`;

        this.phases.forEach((phase, phaseIndex) => {
            formulaString += `\nPhase ${phaseIndex + 1}:\n`;
            phase.ingredients.forEach((ingredient, ingredientIndex) => {
                formulaString += `  Ingredient ${ingredientIndex + 1}:\n`;
                formulaString += `    ID: ${ingredient.id}\n`;
                formulaString += `    Name: ${ingredient.name}\n`;
                formulaString += `    INCI: ${ingredient.inci}\n`;
                formulaString += `    Percentage: ${ingredient.percentage}\n`;
                formulaString += `    Cost: ${ingredient.cost}\n`;
                formulaString += `    Tags: ${ingredient.tags.map(tag => tag.name).join(', ')}\n`;
            });
        });

        return formulaString;
    }
}

export default Formula