import Ingredient from './Ingredient';
import Tag from "./Tag";
import {userData} from "../stores/userData";

export default class IngredientBuilder {
    static buildToList(ingredients :any[], list :Ingredient[]) {
        for (const i in ingredients) {
            const ing = ingredients[i]
            const ingredient = this.fromData(ing);
            list.push(ingredient);
        }
    }
    private ingredient: Ingredient;
    constructor() {
        this.ingredient = this.buildRaw();
    }

    data(ing: any) :IngredientBuilder {
        // console.log("building ingredient from data: " + ing.name)
        this.ingredient = new Ingredient(ing.Id, ing.Id, ing.name, ing.inci, ing.percentage, ing.cost, ing.info, ing.tags);
        return this
    }

    setTags(tags: Tag[]) :IngredientBuilder {
        this.ingredient.tags = Array.isArray(tags) ? Array.from(tags) : []
        return this;
    }

    static fromData(ing :any) :Ingredient {
      return new Ingredient(ing.Id, ing.Id, ing.name, ing.inci, ing.percentage, ing.cost, ing.info, ing.tags);
    }

    private buildRaw() :Ingredient {
        return new Ingredient(0, 0, "", "", 0, 0, "", []);
    }

    public setName(name: string) :IngredientBuilder {
        this.ingredient.name = name;
        return this;
    }

    public setInci(inci: string) :IngredientBuilder {
        this.ingredient.inci = inci;
        return this;
    }

    public setCost(cost: number) :IngredientBuilder {
        this.ingredient.cost = cost;
        return this;
    }

    public setIngredientId(ingredientId: number) :IngredientBuilder {
        this.ingredient.ingredient_id = ingredientId;
        return this;
    }

    public setInfo(info: string) :IngredientBuilder {
        this.ingredient.info = info; // todo dirty check notices info, but info is not displayed in edit window, investigate!
        return this;
    }

    public setId(id: number) :IngredientBuilder {
        this.ingredient.id = id;
        return this;
    }

    public build() :Ingredient {
        return this.ingredient;
    }


    static buildToListWithTags(data: any[], ingredients: Ingredient[], tags: Tag[]) {

        let tagNames = new Set()
        for (let i in data) {
            const ing = data[i]
            if (userData().debug) {
                console.log("building ingredient " + ing.name)
            }
            ingredients.push(new IngredientBuilder().data(ing).setId(Number(i)).build())

            for (let i in ing.tags) {
                let tag = ing.tags[i]

                if(!tagNames.has(tag.name)) {
                    tagNames.add(tag.name)
                    tags.push(tag)

                } else {
                    ing.tags[i] = tags.find((t) => {return t.name == tag.name})
                }
            }
            tags.sort((t1, t2) => {return  t1.name.toLowerCase() > t2.name.toLowerCase() ? 1 : -1 });
        }
    }
}