import Ingredient from "./Ingredient";
import axios from 'axios';
import Tag from "./Tag";
import {userData} from "../stores/userData";

class IngredientList {

    public ingredients: Ingredient[];
    private highlightIngredient: Ingredient;
    private highlightIngredientRegretCopy: Ingredient;
    private defaultPage: 1;
    private defaultPageSize: 750;
    public tags: Tag[];
    private tagFilters: Tag[] = [];
    private highlightIndex = 0;

    populate() {
        this.defaultPage = 1;
        this.defaultPageSize = 750;

        let url = 'users/ingredients?page_id=' + this.defaultPage + '&page_size=' + this.defaultPageSize
        axios.get(url).catch(error => {
            console.log(error)
        }).then((response :any) => {
            this.ingredients = []
            for (let i in response.data) {
                let ing = response.data[i]
                let ingredient = new Ingredient(ing.Id, ing.Id, ing.Name, ing.Inci, ing.cost, ing.tags)
                this.ingredients.push(ingredient)
            }
        });
    }

    async populateWithTags() { // TODO replace direct call with api function in userData
        await axios.get('users/ingredients?page_id=1&page_size=750').catch(error => {
            console.log(error)
        })
            .then((response :any) => {
            let data = response.data
            let tagNames = new Set()
            this.ingredients = []
            this.tags = []
            for (let i in data) {
                let ing = data[i]
                let ingredient = new Ingredient(Number(i), ing.Id, ing.Name, ing.Inci, ing.cost, ing.tags)
                this.ingredients.push(ingredient)

                for (const i in ing.tags) {
                    let tag = ing.tags[i]

                    if(!tagNames.has(tag.name)) {
                        tagNames.add(tag.name)
                        this.tags.push(tag)

                    } else {
                        ing.tags[i] = this.tags.find((t) => {return t.name == tag.name})
                    }
                }
                this.tags.sort((t1, t2) => {return  t1.name.toLowerCase() > t2.name.toLowerCase() ? 1 : -1 });
            }
            this.ingredients.sort((t1, t2) => {return  t1.name.toLowerCase() > t2.name.toLowerCase() ? 1 : -1 });
        });
    }

    private filteredIngredients: Ingredient[];

    toggleFilter(tag :Tag) {
        if(tag.isActive) {
            this.removeFilter(tag)
            tag.isActive = false
        } else {
            this.tagFilters.push(tag)
            tag.isActive = true
        }
        this.filterIngredientList()
    }

    removeFilter(tag :Tag) {
        for (const i in this.tagFilters) {
            if(this.tagFilters[i].name == tag.name) {
                this.tagFilters.splice(Number(i), 1)
            }
        }
    }

    hasActiveTag(ingredient :Ingredient) {
        for (const i in ingredient.tags) {
            let tag = ingredient.tags[i]
            if (tag.isActive) {
                return true
            }
        }
        return false
    }

    filterIngredientList() {
        this.filteredIngredients = this.ingredients.filter(this.hasActiveTag)
        if (this.filteredIngredients.length == 0) {
            this.filteredIngredients = this.ingredients;
        }
    }

    getFilteredIngredients() :Ingredient[] {
        return this.filteredIngredients;
    }

    setHighlightIngredient(ing :Ingredient) {
        this.highlightIngredientRegretCopy = ing.copy();
        this.highlightIngredient = ing;
    }

    getHighlightIngredient() :Ingredient {
        return this.highlightIngredient;
    }

    getHighlightIngredientCopy() :Ingredient {
        return this.highlightIngredientRegretCopy;
    }

    isHighlightIngredientDirty() :boolean {
        return !this.getHighlightIngredient().equals(this.getHighlightIngredientCopy());
    }

    getHighlightIndex() :number {
        return this.highlightIndex;
    }

    setHighlightIndex(index :number) {
        this.highlightIndex = index;
    }

    restoreHighlightIngredient() :Ingredient {
        this.highlightIngredient = this.highlightIngredientRegretCopy;
        this.ingredients[this.getHighlightIndex()] = this.highlightIngredient;
        return this.highlightIngredient;
    }

    publishHighlightedIngredient() {
        userData().api.getIngredientService().updateIngredient(this.getHighlightIngredient()).then(response => {
            console.log("updated ingredient: " + response);
        })
    }

    highlightNextIngredient() :Ingredient {
        this.setHighlightIndex((this.getHighlightIndex() +1) % this.ingredients.length);

        this.setHighlightIngredient(this.ingredients[this.getHighlightIndex()]);
        return this.getHighlightIngredient();
    }

    highlightPreviousIngredient() :Ingredient {

        this.setHighlightIndex(this.getHighlightIndex() === 0 ? this.ingredients.length - 1 : this.getHighlightIndex() - 1);

        this.setHighlightIngredient(this.ingredients[this.getHighlightIndex()]);
        return this.getHighlightIngredient();
    }

    removeIngredient(ingredient :Ingredient) {
        let indexToRemove = this.ingredients.indexOf(ingredient)
        if(indexToRemove !== -1) {
            this.ingredients.splice(indexToRemove, 1);
        }
    }
}

export default IngredientList