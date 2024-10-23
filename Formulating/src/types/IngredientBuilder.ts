import Ingredient from './Ingredient';
import Tag from "./Tag";

export default class IngredientBuilder {
    static buildToList(ingredients :any[], list :Ingredient[]) {
        for (let i in ingredients) {
            let ing = ingredients[i]
            let ingredient = this.build(ing);
            list.push(ingredient);
        }
    }

    static build(ing :any) :Ingredient {
      return new Ingredient(ing.Id, ing.Id, ing.name, ing.inci, ing.percentage, ing.cost, ing.tags);
    }

    static buildToListWithTags(data: any[], ingredients: Ingredient[], tags: Tag[]) {

        let tagNames = new Set()
        for (let i in data) {
            let ing = data[i]
            console.log("building ingredient " + ing.name)
            ingredients.push(IngredientBuilder.build(ing))
            // let ingredient = new Ingredient(Number(i), ing.Id, ing.Name, ing.Inci, ing.cost, ing.tags)
            // this.ingredients.push(ingredient)

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