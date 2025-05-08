import { nextTick } from 'vue'
import {userData} from "../stores/userData";

export async function selectNextInputOnEnterClick(
  event: KeyboardEvent,
  ingredientKey: number | undefined,
  phaseKey: number | undefined,
  ingredientInputs: Record<string, HTMLElement>,
  idPrefix: string
) {

  if (ingredientKey === undefined || phaseKey === undefined) {
    console.error('ingredientKey or phaseKey is undefined')
    return
  }

  event.preventDefault()
  await nextTick()

  const nextIngredientKey = ingredientKey + 1
  const nextElementId = `${idPrefix}-${phaseKey}-${nextIngredientKey}`
  let nextElement = document.getElementById(nextElementId) as HTMLElement

  if (!nextElement) { // attempt to find input in the next phase
    const nextPhaseKey = phaseKey + 1
    const nextElementId = `${idPrefix}-${nextPhaseKey}-0`
    nextElement = document.getElementById(nextElementId) as HTMLElement
  }

  if (!nextElement) { // attempt to find input in next category
    // set idPrefix to next in the list
    let nextIdPrefix = idPrefixes[(idPrefixes.indexOf(idPrefix) + 1)]
    const nextPhaseKey = 0
    const nextElementId = `${nextIdPrefix}-${nextPhaseKey}-0`
    nextElement = document.getElementById(nextElementId) as HTMLElement
  }

  if (nextElement) {
    if (nextElement instanceof HTMLInputElement) {
      const isVisible = nextElement.offsetParent !== null;
      if (isVisible) {
        nextElement.focus();
        nextElement.select();
      } else {
        // console.warn('nextElement is not visible');
      }
    } else {
      // console.warn('nextElement is not an HTMLInputElement');
    }
  }
  // blur the current element if it exists
  const currentElementId = `${idPrefix}-${phaseKey}-${ingredientKey}`
  const currentElement = document.getElementById(currentElementId) as HTMLElement
  if (currentElement) {
    currentElement.blur()
  }
}

export const idPrefixes = [
  "ingredient-input",
  "ingredient-cost",
  "ingredient-mob-input",
  "ingredient-mob-cost"
]
