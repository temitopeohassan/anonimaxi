'use client'

import * as React from 'react'
import type { ToastActionElement, ToastProps } from '@/components/ui/toast'

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType['ADD_TOAST']
      toast: ToasterToast
    }
  | {
      type: ActionType['UPDATE_TOAST']
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType['DISMISS_TOAST']
      toastId?: ToasterToast['id']
    }
  | {
      type: ActionType['REMOVE_TOAST']
      toastId?: ToasterToast['id']
    }

interface State {
  toasts: ToasterToast[]
}

export function useToast() {
  const [state, setState] = React.useState<State>({ toasts: [] })

  const toast = React.useCallback(({ ...props }: Omit<ToasterToast, 'id'>) => {
    const id = genId()

    setState((state) => ({
      ...state,
      toasts: [{ ...props, id }, ...state.toasts].slice(0, TOAST_LIMIT),
    }))

    setTimeout(() => {
      setState((state) => ({
        ...state,
        toasts: state.toasts.filter((t) => t.id !== id),
      }))
    }, TOAST_REMOVE_DELAY)
  }, [])

  return {
    toast,
    toasts: state.toasts,
  }
} 