<template>
  <div class="trial-test-page">
    <MainHeader v-if="!isStarted" />

    <main class="container" :class="{ 'full-width': isStarted }">
      <div v-if="!isStarted" class="trial-card animate-fade-in-up">
        <h1 class="title">{{ t("trial.title") }}</h1>
        <p class="description">{{ t("trial.description") }}</p>

        <div class="test-info">
          <div class="info-item">
            <span class="icon">⏱</span>
            <span>{{ t("trial.duration") }}</span>
          </div>
          <div class="info-item">
            <span class="icon">📝</span>
            <span>{{ t("trial.questions") }}</span>
          </div>
          <div class="info-item">
            <span class="icon">📊</span>
            <span>{{ t("trial.result") }}</span>
          </div>
        </div>

        <div class="action-area">
          <p class="cta">{{ t("trial.ready") }}</p>
          <button @click="startTrial" class="btn-start-trial">
            {{ t("trial.startBtn") }}
          </button>
        </div>
      </div>

      <div v-else class="test-runner-wrapper animate-fade-in">
        <TestRunner testId="trial" @completed="onCompleted" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import MainHeader from "../components/MainHeader.vue";
import TestRunner from "../components/TestRunner.vue";
import { useLanguage } from "../composables/useLanguage";

const { t } = useLanguage();
const router = useRouter();
const isStarted = ref(false);

const startTrial = () => {
  isStarted.value = true;
};

const onCompleted = () => {
  isStarted.value = false;
  router.push("/");
};
</script>

<style scoped>
.trial-test-page {
  font-family: 'Onest', sans-serif;
  background-color: #070a14;
  min-height: 100vh;
  color: #f1f5f9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
  display: flex;
  justify-content: center;
}

.container.full-width {
  max-width: 100%;
  padding: 20px;
}

.test-runner-wrapper {
  width: 100%;
}

.trial-card {
  background: rgba(18, 24, 43, 0.85);
  border: 1.5px solid rgba(255, 46, 147, 0.35);
  padding: 60px 40px;
  border-radius: 32px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(255, 46, 147, 0.2);
  max-width: 800px;
  width: 100%;
  text-align: center;
  backdrop-filter: blur(20px);
}

.title {
  font-family: 'Onest', sans-serif;
  font-size: 3rem;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #ffffff 20%, #ff2e93 60%, #ff007a 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  filter: drop-shadow(0 0 20px rgba(255, 46, 147, 0.4));
}

.description {
  font-size: 1.15rem;
  color: #cbd5e1;
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
  color: #e2e8f0;
  background: rgba(255, 255, 255, 0.04);
  padding: 18px 24px;
  border-radius: 18px;
  border: 1px solid rgba(255, 46, 147, 0.2);
}

.icon {
  font-size: 2.2rem;
  filter: drop-shadow(0 0 10px rgba(255, 46, 147, 0.5));
}

.action-area {
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.cta {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: #ffffff;
}

.btn-start-trial {
  padding: 18px 54px;
  font-size: 1.15rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ff2e93 0%, #ff007a 50%, #9333ea 100%);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 0 25px rgba(255, 46, 147, 0.6);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-start-trial:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 0 35px rgba(255, 46, 147, 0.8);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease forwards;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .trial-card {
    padding: 40px 20px;
  }
  .title {
    font-size: 2.2rem;
  }
  .test-info {
    gap: 20px;
  }
  .info-item {
    font-size: 0.9rem;
  }
}
</style>
