interface IngredientProperties {
    id: number | string
    name: string
    inci: string
    percentage: number
    amountInGrams: number // todo: refactor at some point to have wrapper calculate instead of storing here?
    amountInOz: number
    phase: number
}

export default IngredientProperties