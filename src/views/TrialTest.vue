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
  font-family: "Inter", sans-serif;
  background-color: #f0f8ff;
  min-height: 100vh;
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
  background: white;
  padding: 60px;
  border-radius: 32px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
  max-width: 800px;
  width: 100%;
  text-align: center;
}

.title {
  font-size: 3rem;
  margin-bottom: 20px;
  background: -webkit-linear-gradient(45deg, #333, #00bfff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
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
  background: #00bfff;
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 191, 255, 0.3);
  transition: all 0.3s;
}

.btn-start-trial:hover {
  background: #009acd;
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(0, 191, 255, 0.4);
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
