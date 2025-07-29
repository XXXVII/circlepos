<template>
  <div class="notification-container">
    <!-- Screen reader announcements -->
    <div 
      role="status" 
      aria-live="polite" 
      aria-atomic="true"
      class="sr-only"
      v-if="lastSuccessMessage"
    >
      {{ lastSuccessMessage }}
    </div>
    
    <div 
      role="alert" 
      aria-live="assertive" 
      aria-atomic="true"
      class="sr-only"
      v-if="lastErrorMessage"
    >
      {{ lastErrorMessage }}
    </div>

    <div
      v-for="notification in notifications"
      :key="notification.id"
      :class="['notification', `notification--${notification.type}`]"
      :role="notification.type === 'error' ? 'alert' : 'status'"
      :aria-labelledby="`notification-title-${notification.id}`"
      :aria-describedby="`notification-message-${notification.id}`"
      :data-notification-id="notification.id"
      @keydown="handleNotificationKeydown($event, notification.id)"
      tabindex="0"
    >
      <div class="notification-content">
        <div class="notification-header">
          <h3 
            :id="`notification-title-${notification.id}`"
            class="notification-title"
          >
            {{ notification.title }}
          </h3>
          <button
            @click="removeNotification(notification.id)"
            class="close-btn"
            :aria-label="`Close ${notification.title} notification`"
          >
            ×
          </button>
        </div>
        <p 
          :id="`notification-message-${notification.id}`"
          class="notification-message"
        >
          {{ notification.message }}
        </p>
        
        <div v-if="notification.actions" class="notification-actions">
          <button
            v-for="action in notification.actions"
            :key="action.label"
            @click="action.action"
            :class="['action-btn', { 'action-btn--primary': action.primary }]"
            :aria-label="`${action.label} for ${notification.title}`"
          >
            {{ action.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useNotifications } from '@/composables/useNotifications'
const { notifications, removeNotification } = useNotifications()

// Screen reader announcements
const lastSuccessMessage = ref('')
const lastErrorMessage = ref('')

// Watch for new notifications to announce them
watch(notifications, async (newNotifications, oldNotifications) => {
  if (newNotifications.length > (oldNotifications?.length || 0)) {
    const latestNotification = newNotifications[newNotifications.length - 1]
    
    const message = `${latestNotification.title}. ${latestNotification.message}`
    if (latestNotification.type === 'error') {
      lastErrorMessage.value = `Error: ${message}`
      setTimeout(() => {
        lastErrorMessage.value = ''
      }, 1000)
    } else {
      lastSuccessMessage.value = message
      setTimeout(() => {
        lastSuccessMessage.value = ''
      }, 1000)
    }

    // Focus the new notification for keyboard users
    await nextTick()
    const notificationElement = document.querySelector(`[data-notification-id="${latestNotification.id}"]`) as HTMLElement
    if (notificationElement) {
      notificationElement.focus()
    }
  }
})

const handleNotificationKeydown = (event: KeyboardEvent, notificationId: string) => {
  if (event.key === 'Escape') {
    removeNotification(notificationId)
    event.preventDefault()
  }
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  max-width: 400px;
}

.notification {
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  background: white;
  border-left: 4px solid;
  animation: slideIn 0.3s ease-out;
  margin-bottom: 0.75rem;
}

.notification:last-child {
  margin-bottom: 0;
}

.notification--success {
  border-left-color: #27ae60;
  background: #f8fff9;
}

.notification--error {
  border-left-color: #e74c3c;
  background: #fff8f8;
}

.notification--warning {
  border-left-color: #f39c12;
  background: #fffcf8;
}

.notification--info {
  border-left-color: #3498db;
  background: #f8fcff;
}

.notification-content {
  position: relative;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.notification-title {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.3;
}

.notification-message {
  margin: 0 0 1rem 0;
  color: #5a6c7d;
  font-size: 0.95rem;
  line-height: 1.4;
}

.notification-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  color: #5a6c7d;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #f8f9fa;
  border-color: #bbb;
}

.action-btn--primary {
  background: #3498db;
  border-color: #3498db;
  color: white;
}

.action-btn--primary:hover {
  background: #2980b9;
  border-color: #2980b9;
}

.close-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.1);
  color: #5a6c7d;
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.2);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 480px) {
  .notification-container {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }

  .notification {
    padding: 1.25rem;
  }

  .notification-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>