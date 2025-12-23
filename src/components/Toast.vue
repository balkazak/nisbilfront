<template>
  <Transition name="toast">
    <div v-if="state.visible" class="toast-card" :class="state.type">
      <div class="toast-icon">
        <span v-if="state.type === 'success'">✓</span>
        <span v-else-if="state.type === 'error'">✕</span>
        <span v-else>ℹ</span>
      </div>
      <div class="toast-message">{{ state.message }}</div>
    </div>
  </Transition>
</template>

<script>
import { useToast } from '../composables/useToast';

export default {
  setup() {
    const { state } = useToast();
    return { state };
  }
};
</script>

<style scoped>
.toast-card {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  z-index: 9999;
  min-width: 300px;
  border-left: 5px solid #00bfff;
}

.toast-card.success { border-left-color: #22c55e; }
.toast-card.error { border-left-color: #ef4444; }

.toast-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: bold;
  font-size: 0.9rem;
}

.success .toast-icon { background: #dcfce7; color: #166534; }
.error .toast-icon { background: #fee2e2; color: #991b1b; }
.info .toast-icon { background: #e0f2fe; color: #0369a1; }

.toast-message {
  font-size: 0.95rem;
  font-weight: 500;
  color: #1e293b;
}

/* Animations */
.toast-enter-active, .toast-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}
.toast-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
