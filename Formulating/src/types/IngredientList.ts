import Ingredient from './Ingredient'
import axios from 'axios'
import Tag from './Tag'
import { userData } from '../stores/userData'

class IngredientList {
  public ingredients: Ingredient[]
  private filteredIngredients: Ingredient[]
  public highlightIngredient: Ingredient
  private highlightIngredientRegretCopy: Ingredient
  private defaultPage: 1
  private defaultPageSize: 750
  public tags: Tag[]
  private tagFilters: Tag[] = []
  private highlightIndex = 0

  constructor() {
    this.ingredients = []
    this.filteredIngredients = []
    this.tags = []
  }

  clear() {
    this.ingredients = []
    this.filteredIngredients = []
    this.tags = []
    this.tagFilters = []
    this.highlightIngredient = null
    this.highlightIngredientRegretCopy = null
    this.highlightIndex = 0
  }

  async populateWithTags(): Promise<void> {
    // TODO replace direct call with api function in userData
    if (userData().debug) {
      console.log('populating ingredient list with tags')
    }
    try {
      await axios.get('users/ingredients?page_id=1&page_size=750').then((response: any) => {
        const data = response.data
        const tagNames = new Set()
        this.ingredients = []
        this.tags = []
        for (const i in data) {
          const ing = data[i]
          const ingredient = new Ingredient(
            Number(i),
            ing.Id,
            ing.Name,
            ing.Inci,
            ing.percentage,
            ing.cost,
            ing.tags
          )
          this.ingredients.push(ingredient)

          for (const i in ing.tags) {
            const tag = ing.tags[i]

            if (!tagNames.has(tag.name)) {
              tagNames.add(tag.name)
              this.tags.push(tag)
            } else {
              ing.tags[i] = this.tags.find((t) => {
                return t.name == tag.name
              })
            }
          }
          this.tags.sort((t1, t2) => {
            return t1.name.toLowerCase() > t2.name.toLowerCase() ? 1 : -1
          })
        }
        this.ingredients.sort((t1, t2) => {
          return t1.name.toLowerCase() > t2.name.toLowerCase() ? 1 : -1
        })
        if (userData().debug) {
          console.log('populated ingredient list with tags:' + this.ingredients.length)
        }
        return Promise.resolve()
      })
    } catch (error) {
      console.error(error)
      throw error
    }
    return Promise.resolve()
  }

  populateWithList(list: Ingredient[]) {
    if (userData().debug) {
      console.log('populating with list' + list.length)
    }
    this.ingredients = []
    this.tags = []
    const tagNames = new Set()
    for (const i in list) {
      const ing = list[i]
      if (userData().debug) {
        console.log('adding ingredient: ' + ing.name)
      }
      const ingredient = new Ingredient(
        Number(i),
        ing.ingredient_id,
        ing.name,
        ing.inci,
        ing.percentage,
        ing.cost,
        ing.tags
      )
      this.ingredients.push(ingredient)

      for (const i in ing.tags) {
        const tag = ing.tags[i]

        if (!tagNames.has(tag.name)) {
          if (userData().debug) {
            console.log('adding tag: ' + tag.name)
          }
          tagNames.add(tag.name)
          this.tags.push(tag)
        } else {
          ing.tags[i] = this.tags.find((t) => {
            return t.name == tag.name
          })
        }
      }
      this.tags.sort((t1, t2) => {
        return t1.name.toLowerCase() > t2.name.toLowerCase() ? 1 : -1
      })
    }
  }

  toggleFilter(tag: Tag) {
    if (tag.isActive) {
      this.removeFilter(tag)
      tag.isActive = false
    } else {
      this.tagFilters.push(tag)
      tag.isActive = true
    }
    this.filterIngredientList()
  }

  removeFilter(tag: Tag) {
    for (const i in this.tagFilters) {
      if (this.tagFilters[i].name == tag.name) {
        this.tagFilters.splice(Number(i), 1)
      }
    }
  }

  hasActiveTag(ingredient: Ingredient) {
    for (const i in ingredient.tags) {
      const tag = ingredient.tags[i]
      if (tag.isActive) {
        return true
      }
    }
    return false
  }

  filterIngredientList() {
    this.filteredIngredients = this.ingredients.filter(this.hasActiveTag)
    if (this.filteredIngredients.length == 0) {
      this.filteredIngredients = this.ingredients
    }
  }

  getFilteredIngredients(): Ingredient[] {
    if (this.filteredIngredients.length == 0) {
      this.filteredIngredients = this.ingredients
    }
    return this.filteredIngredients
  }

  setHighlightIngredient(ing: Ingredient) {
    if (userData().debug) {
      console.log('highlighting ingredient: ' + ing.name)
      console.log(ing)
    }
    this.highlightIngredientRegretCopy = ing.copy()
    this.highlightIngredient = ing
  }

  public updateHighlightIngredientCopy() {
    this.highlightIngredientRegretCopy = this.highlightIngredient.copy()
  }

  getHighlightIngredient(): Ingredient {
    return this.highlightIngredient
  }

  getHighlightIngredientCopy(): Ingredient {
    return this.highlightIngredientRegretCopy
  }

  isHighlightIngredientDirty(): boolean {
    return !this.getHighlightIngredient().equals(this.getHighlightIngredientCopy())
  }

  getHighlightIndex(): number {
    return this.highlightIndex
  }

  setHighlightIndex(index: number) {
    this.highlightIndex = index
  }

  restoreHighlightIngredient(): Ingredient {
    this.highlightIngredient = this.highlightIngredientRegretCopy
    this.ingredients[this.getHighlightIndex()] = this.highlightIngredient
    return this.highlightIngredient
  }

  async publishHighlightedIngredient() {
    if (userData().debug) {
      console.log('publishing ingredient: ' + this.getHighlightIngredient().name)
      console.log(this.getHighlightIngredient().cost)
    }
    await userData()
      .api.getIngredientService()
      .updateIngredient(this.getHighlightIngredient())
      .then((response) => {
        if (userData().debug) {
          console.log('published ingredient: ' + this.highlightIngredient.name)
        }
        this.updateHighlightIngredientCopy()
      })
  }

  highlightNextIngredient(): Ingredient {
    this.setHighlightIndex((this.getHighlightIndex() + 1) % this.ingredients.length)
    if (userData().debug) {
      console.log('highligtIndex ' + this.getHighlightIndex())
      console.log('highlighting ingredient: ' + this.ingredients[this.getHighlightIndex()].name)
    }

    this.setHighlightIngredient(this.ingredients[this.getHighlightIndex()])
    return this.getHighlightIngredient()
  }

  highlightPreviousIngredient(): Ingredient {
    this.setHighlightIndex(
      this.getHighlightIndex() === 0 ? this.ingredients.length - 1 : this.getHighlightIndex() - 1
    )

    this.setHighlightIngredient(this.ingredients[this.getHighlightIndex()])
    return this.getHighlightIngredient()
  }

  removeIngredient(ingredient: Ingredient) {
    const indexToRemove = this.ingredients.indexOf(ingredient)
    if (indexToRemove !== -1) {
      this.ingredients.splice(indexToRemove, 1)
    }
  }

  refreshIngredient(ingredient: Ingredient) {
    const index = this.ingredients.findIndex((i) => i.ingredient_id === ingredient.ingredient_id)
    if (index !== -1) {
      this.ingredients.splice(index, 1, ingredient)
    }
  }
}

export default IngredientList
