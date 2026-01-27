<template>
  <div class="calculator-page">
    <MainHeader />

    <main class="container">
      <div class="hero-section animate-fade-in-up">
        <h1>{{ t("calculator.title") }}</h1>
        <p>{{ t("calculator.subtitle") }}</p>
      </div>

      <div class="main-grid">
        <!-- Input Form Section -->
        <div class="card form-card animate-fade-in-up delay-1">
          <div class="tabs">
            <button
              :class="{ active: activeTab === 'nzm' }"
              @click="activeTab = 'nzm'"
            >
              {{ t("calculator.nzm") }}
            </button>
            <button
              :class="{ active: activeTab === 'bil' }"
              @click="activeTab = 'bil'"
            >
              {{ t("calculator.bil") }}
            </button>
          </div>

          <div v-if="activeTab === 'nzm'" class="tab-content">
            <div class="form-grid">
              <div
                class="form-group"
                v-for="field in nzmFields"
                :key="field.id"
              >
                <label>{{ t(`calculator.${field.id}`) }}</label>
                <input
                  type="number"
                  v-model.number="nzmValues[field.id]"
                  :placeholder="t('calculator.enterScore')"
                  :max="field.max"
                  min="0"
                />
                <span class="max-hint">max: {{ field.max }}</span>
              </div>
            </div>
            <div class="form-actions">
              <button class="btn-primary" @click="calculateNzm">
                {{ t("calculator.check") }}
              </button>
              <button class="btn-secondary" @click="resetNzm">
                {{ t("calculator.clear") }}
              </button>
            </div>
          </div>

          <div v-if="activeTab === 'bil'" class="tab-content">
            <div class="form-group">
              <label>{{ t("calculator.bilScore") }}</label>
              <input
                type="number"
                v-model.number="bilScoreValue"
                :placeholder="t('calculator.enterBilScore')"
                min="0"
              />
            </div>
            <div class="form-actions">
              <button class="btn-primary" @click="calculateBil">
                {{ t("calculator.check") }}
              </button>
              <button class="btn-secondary" @click="resetBil">
                {{ t("calculator.clear") }}
              </button>
            </div>
          </div>
        </div>

        <!-- Results Section -->
        <div
          class="card results-card animate-fade-in-up delay-2"
          v-if="showResults"
        >
          <div class="results-header">
            <h2>{{ t("calculator.results") }}</h2>
            <div class="score-summary">
              <p v-if="activeTab === 'nzm'">
                {{ t("calculator.totalScore") }}:
                <span>{{ totalScore?.toFixed(1) }}</span>
              </p>
              <p v-if="activeTab === 'bil'">
                {{ t("calculator.bilScore") }}: <span>{{ bilScoreValue }}</span>
              </p>
              <p class="available-count">
                {{ t("calculator.availableSchools") }}
                {{ activeTab.toUpperCase() }}:
                <span class="count-badge">{{ availableCount }}</span>
                {{ t("calculator.from") }} {{ totalCount }}
              </p>
            </div>
          </div>

          <div class="table-container">
            <table class="results-table">
              <thead>
                <tr>
                  <th>{{ t("calculator.school") }}</th>
                  <th>{{ t("calculator.percentage") }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="school in currentResults" :key="school.name">
                  <td>{{ school.name }}</td>
                  <td>
                    <span
                      class="tag"
                      :class="getPercentageColor(school.percentage)"
                    >
                      {{ school.percentage }}%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Initial Placeholder -->
        <div class="card placeholder-card animate-fade-in-up delay-2" v-else>
          <div class="placeholder-content">
            <span class="placeholder-icon">📊</span>
            <h3>{{ t("calculator.enterScores") }}</h3>
            <p>{{ t("calculator.fillForm") }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useToast } from "../composables/useToast";
import MainHeader from "../components/MainHeader.vue";
import { useLanguage } from "../composables/useLanguage";

const toast = useToast();
const { t } = useLanguage();

const nzmSchools = [
  { name: "Almaty FM", totalMin: 1261 },
  { name: "Almaty XB", totalMin: 1207 },
  { name: "Aqtau XB", totalMin: 1094 },
  { name: "Aqtobe FM", totalMin: 1113 },
  { name: "Astana IB", totalMin: 1270 },
  { name: "Astana FM", totalMin: 1255 },
  { name: "Atyrau FM", totalMin: 1084 },
  { name: "Karagandy XB", totalMin: 1013 },
  { name: "Kokwetau FM", totalMin: 1027 },
  { name: "Kostanay FM", totalMin: 936 },
  { name: "Kyzylorda FM", totalMin: 1016 },
  { name: "Oral FM", totalMin: 1040 },
  { name: "Oskemen FM", totalMin: 970 },
  { name: "Pavlodar FM", totalMin: 1022 },
  { name: "Petropavl FM", totalMin: 894 },
  { name: "Semei FM", totalMin: 903 },
  { name: "Shymkent FM", totalMin: 1126 },
  { name: "Shymkent XB", totalMin: 1091 },
  { name: "Taldyqorgan", totalMin: 1065 },
  { name: "Taraz", totalMin: 1048 },
  { name: "Turkistan", totalMin: 1080 },
];

const bilSchools = [
  { name: "Астана ұлдар БИЛ", totalMin: 206 },
  { name: "Алматы ерлер БИЛ", totalMin: 196 },
  { name: "Астана қыздар БИЛ", totalMin: 171 },
  { name: "Шымкент ерлер БИЛ", totalMin: 170 },
  { name: "Ақтөбе ерлер БИЛ", totalMin: 169 },
  { name: "Құлсары ерлер БИЛ", totalMin: 167 },
  { name: "Түркістан ерлер БИЛ", totalMin: 161 },
  { name: "Атырау ерлер БИЛ", totalMin: 161 },
  { name: "Есік ерлер БИЛ", totalMin: 158 },
  { name: "Тараз қыздар БИЛ", totalMin: 154 },
  { name: "Шымкент қыздар БИЛ", totalMin: 154 },
  { name: "Талдықорған ерлер БИЛ", totalMin: 148 },
  { name: "Тараз ерлер БИЛ", totalMin: 146 },
  { name: "Көкшетау ерлер БИЛ", totalMin: 145 },
  { name: "Ақтау ерлер БИЛ", totalMin: 143 },
  { name: "Қызылорда ерлер БИЛ", totalMin: 143 },
  { name: "Атырау қыздар БИЛ", totalMin: 142 },
  { name: "Қарағанды ерлер БИЛ", totalMin: 139 },
  { name: "Түркістан қыздар БИЛ", totalMin: 135 },
  { name: "Орал ерлер БИЛ", totalMin: 133 },
  { name: "Өскемен ерлер БИЛ", totalMin: 130 },
  { name: "Қостанай ерлер БИЛ (RUS)", totalMin: 129 },
  { name: "Қарағанды қыздар БИЛ", totalMin: 125 },
  { name: "Павлодар ерлер БИЛ", totalMin: 125 },
  { name: "Қызылорда қыздар БИЛ", totalMin: 123 },
  { name: "Павлодар қыздар БИЛ", totalMin: 110 },
  { name: "Жаңаөзен ерлер БИЛ", totalMin: 110 },
  { name: "Көкшетау қыздар БИЛ", totalMin: 105 },
  { name: "Семей ерлер БИЛ", totalMin: 100 },
  { name: "Қызылорда БИЛ физмат", totalMin: 96 },
  { name: "Қостанай ерлер БИЛ (KAZ)", totalMin: 96 },
  { name: "Жезқазған ерлер БИЛ", totalMin: 91 },
  { name: "Петропавл БИЛ", totalMin: 91 },
  { name: "Екібастұз БИЛ", totalMin: 91 },
  { name: "Щучинск IT БИЛ", totalMin: 90 },
  { name: "Арыс ерлер БИЛ", totalMin: 73 },
];

const activeTab = ref("nzm");
const nzmValues = reactive({
  mathematics: null,
  numericalCharacteristics: null,
  naturalScience: null,
  kazakh: null,
  russian: null,
  english: null,
});
const bilScoreValue = ref(null);
const nzmResults = ref([]);
const bilResults = ref([]);
const showResults = ref(false);

const nzmFields = [
  { id: "mathematics", max: 400 },
  { id: "numericalCharacteristics", max: 300 },
  { id: "naturalScience", max: 200 },
  { id: "kazakh", max: 200 },
  { id: "russian", max: 200 },
  { id: "english", max: 200 },
];

const totalScore = computed(() => {
  if (activeTab.value === "nzm") {
    return Object.values(nzmValues).reduce(
      (a, b) => (Number(a) || 0) + (Number(b) || 0),
      0,
    );
  }
  return bilScoreValue.value;
});

const currentResults = computed(() => {
  return activeTab.value === "nzm" ? nzmResults.value : bilResults.value;
});

const availableCount = computed(() => {
  return currentResults.value.filter((s) => s.percentage >= 60).length;
});

const totalCount = computed(() => {
  return activeTab.value === "nzm" ? nzmSchools.length : bilSchools.length;
});

const getNzmPercentage = (score, min) => {
  const diff = score - min;
  if (diff >= 30) return 100;
  if (diff >= 25) return 90;
  if (diff >= 20) return 85;
  if (diff >= 15) return 80;
  if (diff >= 11) return 75;
  if (diff >= 6) return 70;
  if (diff >= 1) return 65;
  if (diff === 0) return 60;
  if (diff >= -5) return 50;
  if (diff >= -10) return 40;
  if (diff >= -15) return 30;
  if (diff >= -20) return 20;
  if (diff >= -25) return 10;
  if (diff >= -30) return 5;
  return 0;
};

const getBilPercentage = (score, min) => {
  const diff = score - min;
  if (diff >= 15) return 100;
  if (diff >= 12) return 90;
  if (diff >= 9) return 85;
  if (diff >= 6) return 80;
  if (diff >= 3) return 75;
  if (diff >= 1) return 70;
  if (diff === 0) return 60;
  if (diff >= -3) return 50;
  if (diff >= -6) return 40;
  if (diff >= -9) return 30;
  if (diff >= -11) return 20;
  if (diff >= -13) return 10;
  if (diff >= -15) return 5;
  return 0;
};

const calculateNzm = () => {
  const total = totalScore.value;
  nzmResults.value = nzmSchools
    .map((school) => ({
      ...school,
      percentage: getNzmPercentage(total, school.totalMin),
    }))
    .sort((a, b) => b.percentage - a.percentage);
  showResults.value = true;
};

const calculateBil = () => {
  const score = bilScoreValue.value;
  bilResults.value = bilSchools
    .map((school) => ({
      ...school,
      percentage: getBilPercentage(score, school.totalMin),
    }))
    .sort((a, b) => b.percentage - a.percentage);
  showResults.value = true;
};

const getPercentageColor = (p) => {
  if (p >= 80) return "green";
  if (p >= 60) return "blue";
  if (p >= 40) return "orange";
  if (p >= 20) return "volcano";
  return "red";
};

const resetNzm = () => {
  Object.keys(nzmValues).forEach((k) => (nzmValues[k] = null));
  showResults.value = false;
};

const resetBil = () => {
  bilScoreValue.value = null;
  showResults.value = false;
};
</script>

<style scoped>
.calculator-page {
  font-family: "Inter", sans-serif;
  background-color: #f8fafc;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.hero-section {
  text-align: center;
  margin-bottom: 40px;
}
.hero-section h1 {
  font-size: 2.5rem;
  color: #1e293b;
  margin-bottom: 10px;
  font-weight: 800;
}
.hero-section p {
  color: #64748b;
  font-size: 1.1rem;
}

.main-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  align-items: start;
}

.card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  padding: 30px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 10px;
}
.tabs button {
  background: none;
  border: none;
  padding: 10px 20px;
  font-weight: 700;
  color: #94a3b8;
  cursor: pointer;
  border-radius: 10px;
  transition: 0.3s;
}
.tabs button.active {
  background: #00bfff;
  color: white;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}
.form-group label {
  font-weight: 600;
  color: #475569;
  font-size: 0.9rem;
}
.form-group input {
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  outline: none;
  transition: 0.3s;
  font-size: 1rem;
}
.form-group input:focus {
  border-color: #00bfff;
  box-shadow: 0 0 0 3px rgba(0, 191, 255, 0.1);
}
.max-hint {
  font-size: 0.75rem;
  color: #94a3b8;
  position: absolute;
  right: 10px;
  bottom: -18px;
}

.form-actions {
  display: flex;
  gap: 15px;
  margin-top: 40px;
}

.btn-primary {
  flex: 2;
  padding: 14px;
  background: #00bfff;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 191, 255, 0.3);
}

.btn-secondary {
  flex: 1;
  padding: 14px;
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
}

.results-header {
  margin-bottom: 25px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 15px;
}
.results-header h2 {
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 15px;
  font-weight: 800;
}
.score-summary {
  background: #f8fafc;
  padding: 15px;
  border-radius: 12px;
}
.score-summary p {
  margin: 5px 0;
  color: #64748b;
  font-weight: 500;
}
.score-summary span {
  color: #00bfff;
  font-weight: 800;
  font-size: 1.2rem;
}
.count-badge {
  background: #dcfce7;
  color: #166534;
  padding: 2px 8px;
  border-radius: 6px;
}

.table-container {
  max-height: 500px;
  overflow-y: auto;
}
.results-table {
  width: 100%;
  border-collapse: collapse;
}
.results-table th {
  text-align: left;
  padding: 12px;
  color: #94a3b8;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.results-table td {
  padding: 15px 12px;
  border-bottom: 1px solid #f1f5f9;
  font-weight: 600;
  color: #334155;
}

.tag {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 700;
}
.tag.green {
  background: #dcfce7;
  color: #166534;
}
.tag.blue {
  background: #e0f2fe;
  color: #0369a1;
}
.tag.orange {
  background: #ffedd5;
  color: #9a3412;
}
.tag.volcano {
  background: #fee2e2;
  color: #991b1b;
}
.tag.red {
  background: #fef2f2;
  color: #dc2626;
}

.placeholder-card {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}
.placeholder-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  display: block;
  opacity: 0.2;
}
.placeholder-card h3 {
  color: #475569;
  margin-bottom: 10px;
  font-weight: 700;
}
.placeholder-card p {
  color: #94a3b8;
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
.delay-1 {
  animation-delay: 0.1s;
}
.delay-2 {
  animation-delay: 0.2s;
}

@media (max-width: 992px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
