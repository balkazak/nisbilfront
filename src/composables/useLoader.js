import { ref } from 'vue';

const isLoading = ref(true);
const progress = ref(0);
const statusMessage = ref('Инициализация квантовой платформы...');

const statusSteps = [
  'Инициализация квантовой платформы...',
  'Загрузка интерактивных модулей НИШ & БИЛ...',
  'Подключение базы знаний 15 000+ задач...',
  'Калибровка персонального трекера...',
  'Система готова к взлёту!'
];

let intervalId = null;

export function useLoader() {
  const startInitialLoad = () => {
    isLoading.value = true;
    progress.value = 0;
    statusMessage.value = statusSteps[0];

    let currentStep = 0;
    const totalDuration = 1200; // 1.2s smooth WOW experience on initial entrance
    const stepInterval = 25;
    const totalSteps = totalDuration / stepInterval;
    let stepCount = 0;

    clearInterval(intervalId);
    intervalId = setInterval(() => {
      stepCount++;
      // Non-linear easing for natural high-tech feel
      const rawProgress = Math.min(100, Math.round((stepCount / totalSteps) * 100));
      progress.value = rawProgress;

      const messageIndex = Math.min(
        statusSteps.length - 1,
        Math.floor((rawProgress / 100) * statusSteps.length)
      );
      statusMessage.value = statusSteps[messageIndex];

      if (rawProgress >= 100) {
        clearInterval(intervalId);
        setTimeout(() => {
          isLoading.value = false;
        }, 350);
      }
    }, stepInterval);
  };

  const triggerFastNav = () => {
    isLoading.value = true;
    progress.value = 30;
    statusMessage.value = 'Синхронизация данных...';

    clearInterval(intervalId);
    let current = 30;
    intervalId = setInterval(() => {
      current += 15;
      progress.value = Math.min(100, current);
      if (current >= 100) {
        clearInterval(intervalId);
        setTimeout(() => {
          isLoading.value = false;
        }, 200);
      }
    }, 40);
  };

  const showLoader = (msg = 'Загрузка данных...') => {
    isLoading.value = true;
    progress.value = 50;
    statusMessage.value = msg;
  };

  const hideLoader = () => {
    progress.value = 100;
    setTimeout(() => {
      isLoading.value = false;
    }, 200);
  };

  return {
    isLoading,
    progress,
    statusMessage,
    startInitialLoad,
    triggerFastNav,
    showLoader,
    hideLoader
  };
}
