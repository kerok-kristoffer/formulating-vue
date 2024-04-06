import Units from "./Units";
import Tag from "./Tag";

class Ingredient {
    percentage: number = 0;
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
        public cost: number,
        public tags: Tag[],
        ) {
            if (tags === null) {
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
        if (ingredient.tags.length !== this.tags.length) {
            return false;
        }
        for (let i = 0; i < this.tags.length ; i++) {
            console.log("comparing " + ingredient.tags[i].name + " to " + this.tags[i].name);
            if (ingredient.tags[i].name != this.tags[i].name) {
                return false;
            }

        }
        return true;
    }

    isDirty() :boolean {
        return this.dirty
    }

    setDirty(dirty :boolean) {
        this.dirty = dirty;
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
                return this.cost * 0.03527396 // verify conversion
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
                this.cost = cost / 0.03527396
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
        return new Ingredient(this.id, this.ingredient_id, this.name, this.inci, this.cost, Array.from(this.tags));
    }
        
}

export default Ingredient