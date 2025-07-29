import { ref } from 'vue'

export interface NotificationAction {
  label: string
  action: () => void
  primary?: boolean
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  actions?: NotificationAction[]
  persistent?: boolean
  timeout?: number
}

const notifications = ref<Notification[]>([])

export function useNotifications() {
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 11)
    const newNotification: Notification = {
      id,
      timeout: notification.persistent ? 0 : 5000,
      ...notification
    }
    
    notifications.value.push(newNotification)
    
    // Auto-remove if not persistent
    if (!notification.persistent && newNotification.timeout) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.timeout)
    }
    
    return id
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearAll = () => {
    notifications.value = []
  }

  const showSuccess = (title: string, message: string, timeout = 5000) => {
    return addNotification({
      type: 'success',
      title,
      message,
      timeout
    })
  }

  const showError = (title: string, message: string, actions?: NotificationAction[]) => {
    return addNotification({
      type: 'error',
      title,
      message,
      actions,
      persistent: true
    })
  }

  const showWarning = (title: string, message: string, timeout = 7000) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      timeout
    })
  }

  const showInfo = (title: string, message: string, timeout = 5000) => {
    return addNotification({
      type: 'info',
      title,
      message,
      timeout
    })
  }

  return {
    notifications: notifications.value,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}