<template>
  <div class="trial-test-page">
    <MainHeader />

    <main class="container">
      <div class="trial-card animate-fade-in-up">
        <h1 class="title">Пробный Тест</h1>
        <p class="description">
          Хотите проверить свои силы перед покупкой курса? Наш пробный тест поможет вам оценить ваш текущий уровень знаний и познакомиться с форматом обучения.
        </p>

        <div class="test-info">
          <div class="info-item">
            <span class="icon">⏱</span>
            <span>20 минут</span>
          </div>
          <div class="info-item">
            <span class="icon">📝</span>
            <span>15 вопросов</span>
          </div>
          <div class="info-item">
            <span class="icon">📊</span>
            <span>Мгновенный результат</span>
          </div>
        </div>

        <div class="action-area">
          <p class="cta">Готовы начать?</p>
          <button @click="startTrial" class="btn-start-trial">Начать Бесплатно</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useToast } from '../composables/useToast';
import MainHeader from '../components/MainHeader.vue';

export default {
  components: { MainHeader },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    startTrial() {
      this.toast.info('Пробный тест находится в разработке.');
    }
  }
};
</script>

<style scoped>
.trial-test-page {
  font-family: 'Inter', sans-serif;
  background-color: var(--secondary-color);
  min-height: 100vh;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary-color);
  background: -webkit-linear-gradient(45deg, var(--primary-color), #007bb5);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-link {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s;
}

.nav-link:hover {
  background: var(--primary-color);
  color: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
  display: flex;
  justify-content: center;
}

.trial-card {
  background: white;
  padding: 60px;
  border-radius: 32px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.05);
  max-width: 800px;
  width: 100%;
  text-align: center;
}

.title {
  font-size: 3rem;
  margin-bottom: 20px;
  background: -webkit-linear-gradient(45deg, #333, var(--primary-color));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.description {
  font-size: 1.25rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 40px;
}

.test-info {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 50px;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #444;
}

.icon {
  font-size: 2.5rem;
}

.action-area {
  padding-top: 30px;
  border-top: 1px solid #eee;
}

.cta {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #333;
}

.btn-start-trial {
  padding: 18px 50px;
  font-size: 1.2rem;
  font-weight: 800;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 191, 255, 0.3);
  transition: all 0.3s;
}

.btn-start-trial:hover {
  background: #009ACD;
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 191, 255, 0.4);
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease forwards;
}

@media (max-width: 768px) {
  .navbar { padding: 15px 20px; }
  .logo { font-size: 1.2rem; }
  .trial-card { padding: 40px 20px; }
  .title { font-size: 2.2rem; }
  .test-info { gap: 20px; }
  .info-item { font-size: 0.9rem; }
}
</style>
