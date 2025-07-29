import { nextTick } from 'vue'

export function useFocusManagement() {
  const focusElement = async (
    element: HTMLElement | string | null
  ): Promise<boolean> => {
    await nextTick()

    let targetElement: HTMLElement | null = null

    if (typeof element === 'string') {
      targetElement = document.getElementById(element)
    } else {
      targetElement = element
    }

    if (targetElement && typeof targetElement.focus === 'function') {
      try {
        targetElement.focus()
        return true
      } catch (error) {
        console.warn('Failed to focus element:', error)
        return false
      }
    }
    return false
  }

  return {
    focusElement,
  }
}
