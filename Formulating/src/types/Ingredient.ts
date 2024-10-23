import Units from "./Units";
import Tag from "./Tag";

class Ingredient {
    phase: number
    weightInGrams: number // ide complains on import if set to private, fix!
    weightInOunces: number
    formula_ingredient_id: number = 0
    private dirty: boolean;

    constructor(
        public id: number,
        public ingredient_id: number,
        public name: string,
        public inci: string,
        public percentage: number,
        public cost: number,
        public tags: Tag[],
        ) {
            if (tags === null || tags === undefined) {
                this.tags = []
            }
            this.dirty = false;
        }

    equals(ingredient :Ingredient) :boolean {
        if (ingredient.name !== this.name) {
            return false;
        }
        if (ingredient.inci !== this.inci) {
            return false;
        }
        if (ingredient.cost !== this.cost) {
            return false;
        }
        if (!Array.isArray(this.tags) || !Array.isArray(ingredient.tags) || this.tags.length !== ingredient.tags.length) {
            console.log("tags length not equal")
            console.log(this.tags)
            console.log(ingredient.tags)
            return false;
        }
        for (let i = 0; i < this.tags.length ; i++) {
            if (ingredient.tags[i].name != this.tags[i].name) {
                return false;
            }

        }
        return true;
    }

    equalsFormulaIngredient(ingredient :Ingredient) :boolean { // TODO replace this workaround by implementing a formulaIngredient class that naturally ignores tags.
        if (ingredient.name !== this.name) {
            return false;
        }
        if (ingredient.inci !== this.inci) {
            return false;
        }
        if (ingredient.cost !== this.cost) {
            return false;
        }
        console.log("ingredient percentage")
        console.log(ingredient.percentage)
        console.log(this.percentage)
        if (ingredient.percentage !== this.percentage) {
            return false;
        }
        return true;
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

    getCost(unit :Units) :number {
        switch (unit) {
            case 'g':
                return this.cost
            case 'Oz':
                return this.formatWeight(this.cost * 0.03527)
            default:
                return -1
        }
    }

    setCost(cost :number, unit :Units) :void {
        switch (unit) {
            case 'g':
                this.cost = cost
                break;
            case 'Oz':
                this.cost = this.formatWeight(cost / 0.03527)
                break;
            default:
                break;
        }
    }

    formatWeight(weight :number) :number {
        return Number((Math.round(weight * 100) /100).toFixed(2))
    }

    addTag(tag :string) {
        
        let newTag = new Tag(0, tag)
        this.tags.push(newTag)
    }
        
    removeTag(index :number) {
        this.tags.splice(index, 1)
    }
        
    removeLastTag() {
        this.removeTag(this.tags.length - 1)
    }

    copy() :Ingredient{
        return new Ingredient(this.id,
            this.ingredient_id,
            this.name,
            this.inci,
            this.percentage,
            this.cost,
            Array.isArray( this.tags) ? Array.from(this.tags) : [])
    }
        
}

export default Ingredient