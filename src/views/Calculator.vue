<template>
  <div class="calculator-page">
    <MainHeader />

    <main class="container">
      <div class="hero-section animate-fade-in-up">
        <h1>{{ t('calculator') }}</h1>
        <p>{{ t('subtitle') }}</p>
      </div>

      <div class="main-grid">
        <!-- Input Form Section -->
        <div class="card form-card animate-fade-in-up delay-1">
          <div class="tabs">
            <button :class="{ active: activeTab === 'nzm' }" @click="activeTab = 'nzm'">{{ t('nzm') }}</button>
            <button :class="{ active: activeTab === 'bil' }" @click="activeTab = 'bil'">{{ t('bil') }}</button>
          </div>

          <div v-if="activeTab === 'nzm'" class="tab-content">
            <div class="form-grid">
              <div class="form-group" v-for="field in nzmFields" :key="field.id">
                <label>{{ t(field.id) }}</label>
                <input 
                  type="number" 
                  v-model.number="nzmValues[field.id]" 
                  :placeholder="t('enterScore')"
                  :max="field.max"
                  min="0"
                />
                <span class="max-hint">max: {{ field.max }}</span>
              </div>
            </div>
            <div class="form-actions">
              <button class="btn-primary" @click="calculateNzm">{{ t('check') }}</button>
              <button class="btn-secondary" @click="resetNzm">{{ t('clear') }}</button>
            </div>
          </div>

          <div v-if="activeTab === 'bil'" class="tab-content">
            <div class="form-group">
              <label>{{ t('bilScore') }}</label>
              <input 
                type="number" 
                v-model.number="bilScoreValue" 
                :placeholder="t('enterBilScore')"
                min="0"
              />
            </div>
            <div class="form-actions">
              <button class="btn-primary" @click="calculateBil">{{ t('check') }}</button>
              <button class="btn-secondary" @click="resetBil">{{ t('clear') }}</button>
            </div>
          </div>
        </div>

        <!-- Results Section -->
        <div class="card results-card animate-fade-in-up delay-2" v-if="showResults">
          <div class="results-header">
            <h2>{{ t('results') }}</h2>
            <div class="score-summary">
              <p v-if="activeTab === 'nzm'">{{ t('totalScore') }}: <span>{{ totalScore?.toFixed(1) }}</span></p>
              <p v-if="activeTab === 'bil'">{{ t('bilScore') }}: <span>{{ bilScoreValue }}</span></p>
              <p class="available-count">
                {{ t('availableSchools') }} {{ activeTab.toUpperCase() }}: 
                <span class="count-badge">{{ availableCount }}</span> {{ t('from') }} {{ totalCount }}
              </p>
            </div>
          </div>

          <div class="table-container">
            <table class="results-table">
              <thead>
                <tr>
                  <th>{{ t('school') }}</th>
                  <th>{{ t('percentage') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="school in currentResults" :key="school.name">
                  <td>{{ school.name }}</td>
                  <td>
                    <span class="tag" :class="getPercentageColor(school.percentage)">
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
            <h3>{{ t('enterScores') }}</h3>
            <p>{{ t('fillForm') }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
const nzmSchools = [
  { name: "Almaty FM", total: 1322.3, totalMin: 1261 },
  { name: "Almaty XB", total: 1278.9, totalMin: 1207 },
  { name: "Aqtau XB", total: 1189.2, totalMin: 1094 },
  { name: "Aqtobe FM", total: 1212.5, totalMin: 1113 },
  { name: "Astana IB", total: 1339.9, totalMin: 1270 },
  { name: "Astana FM", total: 1322.4, totalMin: 1255 },
  { name: "Atyrau FM", total: 1181.2, totalMin: 1084 },
  { name: "Karagandy XB", total: 1120.9, totalMin: 1013 },
  { name: "Kokwetau FM", total: 1142.1, totalMin: 1027 },
  { name: "Kostanay FM", total: 1054.6, totalMin: 936 },
  { name: "Kyzylorda FM", total: 1129.6, totalMin: 1016 },
  { name: "Oral FM", total: 1158.1, totalMin: 1040 },
  { name: "Oskemen FM", total: 1096.7, totalMin: 970 },
  { name: "Pavlodar FM", total: 1137.6, totalMin: 1022 },
  { name: "Petropavl FM", total: 1030.2, totalMin: 894 },
  { name: "Semei FM", total: 1054.1, totalMin: 903 },
  { name: "Shymkent FM", total: 1247.3, totalMin: 1126 },
  { name: "Shymkent XB", total: 1188.9, totalMin: 1091 },
  { name: "Taldyqorgan", total: 1170, totalMin: 1065 },
  { name: "Taraz", total: 1141.2, totalMin: 1048 },
  { name: "Turkistan", total: 1175.6, totalMin: 1080 },
];

const bilSchools = [
  { name: "Астана ұлдар БИЛ", total: 206, totalMin: 206 },
  { name: "Алматы ерлер БИЛ", total: 196, totalMin: 196 },
  { name: "Астана қыздар БИЛ", total: 171, totalMin: 171 },
  { name: "Шымкент ерлер БИЛ", total: 170, totalMin: 170 },
  { name: "Ақтөбе ерлер БИЛ", total: 169, totalMin: 169 },
  { name: "Құлсары ерлер БИЛ", total: 167, totalMin: 167 },
  { name: "Түркістан ерлер БИЛ", total: 161, totalMin: 161 },
  { name: "Атырау ерлер БИЛ", total: 161, totalMin: 161 },
  { name: "Есік ерлер БИЛ", total: 158, totalMin: 158 },
  { name: "Тараз қыздар БИЛ", total: 154, totalMin: 154 },
  { name: "Шымкент қыздар БИЛ", total: 154, totalMin: 154 },
  { name: "Талдықорған ерлер БИЛ", total: 148, totalMin: 148 },
  { name: "Тараз ерлер БИЛ", total: 146, totalMin: 146 },
  { name: "Көкшетау ерлер БИЛ", total: 145, totalMin: 145 },
  { name: "Ақтау ерлер БИЛ", total: 143, totalMin: 143 },
  { name: "Қызылорда ерлер БИЛ", total: 143, totalMin: 143 },
  { name: "Атырау қыздар БИЛ", total: 142, totalMin: 142 },
  { name: "Қарағанды ерлер БИЛ", total: 139, totalMin: 139 },
  { name: "Түркістан қыздар БИЛ", total: 135, totalMin: 135 },
  { name: "Орал ерлер БИЛ", total: 133, totalMin: 133 },
  { name: "Өскемен ерлер БИЛ", total: 130, totalMin: 130 },
  { name: "Қостанай ерлер БИЛ (RUS)", total: 129, totalMin: 129 },
  { name: "Қарағанды қыздар БИЛ", total: 125, totalMin: 125 },
  { name: "Павлодар ерлер БИЛ", total: 125, totalMin: 125 },
  { name: "Қызылорда қыздар БИЛ", total: 123, totalMin: 123 },
  { name: "Павлодар қыздар БИЛ", total: 110, totalMin: 110 },
  { name: "Жаңаөзен ерлер БИЛ", total: 110, totalMin: 110 },
  { name: "Көкшетау қыздар БИЛ", total: 105, totalMin: 105 },
  { name: "Семей ерлер БИЛ", total: 100, totalMin: 100 },
  { name: "Қызылорда БИЛ физмат", total: 96, totalMin: 96 },
  { name: "Қостанай ерлер БИЛ (KAZ)", total: 96, totalMin: 96 },
  { name: "Жезқазған ерлер БИЛ", total: 91, totalMin: 91 },
  { name: "Петропавл БИЛ", total: 91, totalMin: 91 },
  { name: "Екібастұз БИЛ", total: 91, totalMin: 91 },
  { name: "Щучинск IT БИЛ", total: 90, totalMin: 90 },
  { name: "Арыс ерлер БИЛ", total: 73, totalMin: 73 },
];

const translations = {
  ru: {
    calculator: "Калькулятор",
    back: "Назад",
    subtitle: "С этим результатом куда я могу поступить на грант?",
    nzm: "НЗМ",
    bil: "БИЛ",
    mathematics: "Математика (400)",
    numericalCharacteristics: "Числовые хар-ки (300)",
    naturalScience: "Естествознание (200)",
    kazakh: "Казахский язык (200)",
    russian: "Русский язык (200)",
    english: "Английский язык (200)",
    enterScore: "Балл",
    check: "Проверить",
    clear: "Очистить",
    results: "Результаты расчета",
    totalScore: "Общий балл",
    availableSchools: "Доступно школ",
    from: "из",
    enterScores: "Введите ваши баллы",
    fillForm: "Заполните форму для расчета вероятности поступления",
    school: "Школа",
    percentage: "Вероятность",
    bilScore: "Балл БИЛ",
    enterBilScore: "Введите ваш балл БИЛ",
    tariffs: "Тарифы"
  },
  kz: {
    calculator: "Калькулятор",
    back: "Артқа",
    subtitle: "Осы нәтижеммен қайда грантқа түсе аламын?",
    nzm: "НЗМ",
    bil: "БИЛ",
    mathematics: "Математика (400)",
    numericalCharacteristics: "Сандық сипаттамалар (300)",
    naturalScience: "Жаратылыстану (200)",
    kazakh: "Қазақ тілі (200)",
    russian: "Орыс тілі (200)",
    english: "Ағылшын тілі (200)",
    enterScore: "Балл",
    check: "Тексеру",
    clear: "Тазалау",
    results: "Есептеу нәтижелері",
    totalScore: "Жалпы балл",
    availableSchools: "Қолжетімді мектептер",
    from: "дан",
    enterScores: "Баллдарыңызды енгізіңіз",
    fillForm: "Түсу ықтималдығын есептеу үшін форманы толтырыңыз",
    school: "Мектеп",
    percentage: "Ықтималдық",
    bilScore: "БИЛ баллы",
    enterBilScore: "БИЛ баллыңызды енгізіңіз",
    tariffs: "Тарифтер"
  }
};

import { useToast } from '../composables/useToast';
import MainHeader from '../components/MainHeader.vue';

export default {
  components: { MainHeader },
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      language: 'ru',
      activeTab: 'nzm',
      nzmValues: {
        mathematics: null,
        numericalCharacteristics: null,
        naturalScience: null,
        kazakh: null,
        russian: null,
        english: null
      },
      bilScoreValue: null,
      nzmResults: [],
      bilResults: [],
      showResults: false,
      nzmFields: [
        { id: 'mathematics', max: 400 },
        { id: 'numericalCharacteristics', max: 300 },
        { id: 'naturalScience', max: 200 },
        { id: 'kazakh', max: 200 },
        { id: 'russian', max: 200 },
        { id: 'english', max: 200 }
      ]
    };
  },
  computed: {
    totalScore() {
      if (this.activeTab === 'nzm') {
        return Object.values(this.nzmValues).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
      }
      return this.bilScoreValue;
    },
    currentResults() {
      return this.activeTab === 'nzm' ? this.nzmResults : this.bilResults;
    },
    availableCount() {
      return this.currentResults.filter(s => s.percentage >= 60).length;
    },
    totalCount() {
      return this.activeTab === 'nzm' ? nzmSchools.length : bilSchools.length;
    }
  },
  methods: {
    t(key) {
      return translations[this.language][key] || key;
    },
    calculateNzm() {
      const total = this.totalScore;
      this.nzmResults = nzmSchools.map(school => ({
        ...school,
        percentage: this.getNzmPercentage(total, school.totalMin)
      })).sort((a, b) => b.percentage - a.percentage);
      this.showResults = true;
    },
    calculateBil() {
      const score = this.bilScoreValue;
      this.bilResults = bilSchools.map(school => ({
        ...school,
        percentage: this.getBilPercentage(score, school.totalMin)
      })).sort((a, b) => b.percentage - a.percentage);
      this.showResults = true;
    },
    getNzmPercentage(score, min) {
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
    },
    getBilPercentage(score, min) {
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
    },
    getPercentageColor(p) {
      if (p >= 80) return 'green';
      if (p >= 60) return 'blue';
      if (p >= 40) return 'orange';
      if (p >= 20) return 'volcano';
      return 'red';
    },
    resetNzm() {
      Object.keys(this.nzmValues).forEach(k => this.nzmValues[k] = null);
      this.showResults = false;
    },
    resetBil() {
      this.bilScoreValue = null;
      this.showResults = false;
    }
  }
};
</script>

<style scoped>
.calculator-page {
  font-family: 'Inter', sans-serif;
  background-color: #f8fafc;
  min-height: 100vh;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 40px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo { font-size: 1.4rem; font-weight: 800; color: var(--primary-color); }

.nav-link {
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 20px;
  transition: 0.3s;
}

.nav-link:hover { background: #f1f5f9; color: var(--primary-color); }

.lang-switch {
  background: #f1f5f9;
  border: none;
  padding: 5px 12px;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  margin-right: 20px;
}

.container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }

.hero-section { text-align: center; margin-bottom: 40px; }
.hero-section h1 { font-size: 2.5rem; color: #1e293b; margin-bottom: 10px; }
.hero-section p { color: #64748b; font-size: 1.1rem; }

.main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; align-items: start; }

.card { background: white; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); padding: 30px; }

.tabs { display: flex; gap: 10px; margin-bottom: 30px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px; }
.tabs button { 
  background: none; border: none; padding: 10px 20px; font-weight: 700; color: #94a3b8; cursor: pointer; border-radius: 10px; transition: 0.3s;
}
.tabs button.active { background: var(--primary-color); color: white; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-group { display: flex; flex-direction: column; gap: 8px; position: relative; }
.form-group label { font-weight: 600; color: #475569; font-size: 0.9rem; }
.form-group input { 
  padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; outline: none; transition: 0.3s; font-size: 1rem;
}
.form-group input:focus { border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(0, 191, 255, 0.1); }
.max-hint { font-size: 0.75rem; color: #94a3b8; position: absolute; right: 10px; bottom: -18px; }

.form-actions { display: flex; gap: 15px; margin-top: 40px; }

.btn-primary { 
  flex: 2; padding: 14px; background: var(--primary-color); color: white; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s;
}
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0, 191, 255, 0.3); }

.btn-secondary { 
  flex: 1; padding: 14px; background: #f1f5f9; color: #475569; border: none; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s;
}

.results-header { margin-bottom: 25px; border-bottom: 1px solid #f1f5f9; padding-bottom: 15px; }
.results-header h2 { font-size: 1.5rem; color: #1e293b; margin-bottom: 15px; }
.score-summary { background: #f8fafc; padding: 15px; border-radius: 12px; }
.score-summary p { margin: 5px 0; color: #64748b; font-weight: 500; }
.score-summary span { color: var(--primary-color); font-weight: 800; font-size: 1.2rem; }
.count-badge { background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 6px; }

.table-container { max-height: 500px; overflow-y: auto; }
.results-table { width: 100%; border-collapse: collapse; }
.results-table th { text-align: left; padding: 12px; color: #94a3b8; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; }
.results-table td { padding: 15px 12px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #334155; }

.tag { padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; font-weight: 700; }
.tag.green { background: #dcfce7; color: #166534; }
.tag.blue { background: #e0f2fe; color: #0369a1; }
.tag.orange { background: #ffedd5; color: #9a3412; }
.tag.volcano { background: #fee2e2; color: #991b1b; }
.tag.red { background: #fef2f2; color: #dc2626; }

.placeholder-card { display: flex; align-items: center; justify-content: center; min-height: 400px; text-align: center; }
.placeholder-icon { font-size: 4rem; margin-bottom: 20px; display: block; opacity: 0.2; }
.placeholder-card h3 { color: #475569; margin-bottom: 10px; }
.placeholder-card p { color: #94a3b8; }

@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fadeInUp 0.6s ease forwards; }
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }

@media (max-width: 992px) {
  .main-grid { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .form-grid { grid-template-columns: 1fr; }
  .navbar { padding: 15px 20px; }
  .logo { font-size: 1.1rem; }
}
</style>
