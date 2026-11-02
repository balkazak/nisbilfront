<template>
  <div class="app-root">
    <GlobalLoader v-if="!maintenanceMode" />
    <router-view v-slot="{ Component }">
      <Transition name="page-fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
    <Toast />
  </div>
</template>

<script>
import Toast from './components/Toast.vue';
import GlobalLoader from './components/GlobalLoader.vue';

const maintenanceMode = true;

export default {
  name: 'App',
  components: { Toast, GlobalLoader },
  data() {
    return {
      maintenanceMode,
    };
  },
};
</script>

<style>
/* Page transition */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
