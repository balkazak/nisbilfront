<template>
  <div class="student-dashboard" :class="{ 'sidebar-open': isSidebarOpen }">
    <div v-if="isSidebarOpen" class="sidebar-overlay" @click="isSidebarOpen = false"></div>
    <aside class="sidebar">
      <div class="logo-area">nis-bil.online</div>
      <nav>
        <button @click="$router.push('/')">Главная</button>
        <button @click="selectView('courses')" :class="{active: currentView === 'courses'}">Мои Курсы</button>
        <button @click="selectView('tests')" :class="{active: currentView === 'tests'}">Тесты</button>
        <button @click="selectView('results')" :class="{active: currentView === 'results'}">Мои Результаты</button>
        <button @click="selectView('trial-test')" :class="{active: currentView === 'trial-test'}">Пробный тест</button>
        <button @click="selectView('calculator')" :class="{active: currentView === 'calculator'}">Калькулятор</button>
        <button @click="selectView('tariffs')" :class="{active: currentView === 'tariffs'}">Тарифы</button>
      </nav>
      <div style="margin-top: auto; padding: 20px;">
        <button @click="logout" class="btn-logout">Выйти</button>
      </div>
    </aside>

    <main class="content">
      <header class="mobile-header">
        <button class="hamburger" @click="isSidebarOpen = !isSidebarOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div class="mobile-logo">nis-bil.online</div>
      </header>
      <!-- Course List -->
      <div v-if="currentView === 'courses' && !activeCourse && !activeTestId" class="fade-in">
        <h2 class="title-lg">Доступные Курсы</h2>
        <div class="course-grid">
           <div v-for="course in courses" :key="course.id" class="card course-card animate-scale" @click="openCourse(course)">
             <div class="card-content">
               <h3>{{ course.title }}</h3>
               <p>{{ course.description }}</p>
             </div>
             <button class="btn-start">Начать &rarr;</button>
           </div>
        </div>
      </div>

      <!-- Test List -->
      <div v-if="currentView === 'tests' && !activeTestId" class="fade-in">
          <h2 class="title-lg">Доступные Тесты</h2>
          <div class="course-grid">
             <div v-for="test in standaloneTests" :key="test.id" class="card course-card animate-scale" @click="openStandaloneTest(test)">
                 <div class="card-content">
                     <h3>{{ test.title }}</h3>
                     <p>{{ test.description || 'Без описания' }}</p>
                     <div style="margin-top: 10px;">
                        <span class="badge-blue" v-if="test.time_limit">⏱ {{ test.time_limit }} мин</span>
                        <span class="badge-blue" v-else>Без таймера</span>
                     </div>
                 </div>
                 <button class="btn-start">Пройти &rarr;</button>
             </div>
             <div v-if="standaloneTests.length === 0" style="color: #666;">
                 Нет доступных тестов.
             </div>
          </div>
      </div>

      <!-- Standalone Test Runner -->
      <div v-if="activeTestId" class="fade-in" style="height: 100%;">
          <button @click="activeTestId = null; showTest = false" class="btn-back">&larr; Вернуться к тестам</button>
          <TestRunner :testId="activeTestId" :isStandalone="true" @completed="onTestCompleted" @cancel="onTestCancel" />
      </div>

      <!-- Course Player -->
      <div v-if="activeCourse" class="course-player fade-in">
         <button @click="activeCourse = null" class="btn-back">&larr; Вернуться к курсам</button>
         
         <div class="player-layout">
            <!-- Sidebar Lessons -->
            <div class="lesson-sidebar card">
              <h3 class="sidebar-title">{{ activeCourse.title }}</h3>
              <ul class="lesson-nav">
                <li v-for="lesson in activeCourse.Lessons" :key="lesson.id" 
                    :class="{ active: currentLesson?.id === lesson.id }"
                    @click="currentLesson = lesson; showTest = false;">
                   <span class="icon-play">▶</span>
                   {{ lesson.title }}
                </li>
              </ul>
            </div>

            <!-- Main Content -->
            <div class="video-area card" v-if="currentLesson">
               <!-- Video Video -->
               <div v-if="!showTest" class="fade-in">
                  <h3 class="lesson-title">{{ currentLesson.title }}</h3>
                   <div v-for="(url, index) in currentLesson.video_urls" :key="'vid-'+index" class="video-block mb-4">
                       <h4 v-if="currentLesson.video_urls.length > 1" class="text-gray-500 text-sm mb-2">Видео {{ index + 1 }}</h4>
                       <div class="video-container">
                           <iframe width="100%" height="100%" :src="getEmbedUrl(url)" frameborder="0" allowfullscreen></iframe>
                       </div>
                   </div>
                   
                   <div class="actions-bar">
                      <button v-if="currentLesson.Test" @click="startTest" class="btn-primary animate-pulse">
                          {{ currentLesson.solution_video_urls && currentLesson.solution_video_urls.length > 0 ? 'Пройти Тест (Сдано)' : 'Пройти Тест' }}
                      </button>
                      
                      <!-- Unlocked Solution -->
                      <button v-if="currentLesson.solution_video_urls && currentLesson.solution_video_urls.length > 0" 
                              @click="showSolution = !showSolution" 
                              class="btn-secondary">
                         {{ showSolution ? 'Скрыть Разбор' : 'Посмотреть Разбор' }}
                      </button>

                      <!-- Locked Solution -->
                      <button v-else-if="currentLesson.has_solution" disabled class="btn-disabled" title="Сначала пройдите тест">
                         🔒 Разбор (Пройдите тест)
                      </button>
                   </div>

                   <div v-if="showSolution" class="solution-container fade-in mt-4 border-t pt-4">
                      <h4 class="font-bold text-lg mb-4">Видео Разбор</h4>
                      <div v-for="(solUrl, sIdx) in currentLesson.solution_video_urls" :key="'sol-'+sIdx" class="video-block mb-4">
                          <h5 v-if="currentLesson.solution_video_urls.length > 1" class="text-sm text-gray-500 mb-1">Разбор {{ sIdx + 1 }}</h5>
                          <div class="video-container secondary">
                             <iframe width="100%" height="100%" :src="getEmbedUrl(solUrl)" frameborder="0" allowfullscreen></iframe>
                          </div>
                      </div>
                   </div>
               </div>

               <!-- Test Runner (Lesson Attached) -->
               <div v-if="showTest" class="fade-in">
                  <TestRunner :testId="currentLesson.Test.id" :isStandalone="false" @completed="onTestCompleted" @cancel="showTest = false" />
               </div>
            </div>
         </div>
      </div>
      
      <!-- My Results -->
      <div v-if="currentView === 'results'" class="fade-in">
         <h2 class="title-lg">Мой Прогресс</h2>
         <div class="card">
           <table class="styled-table">
              <thead>
                 <tr>
                    <th>Тест</th>
                    <th>Результат</th>
                    <th>Дата</th>
                 </tr>
              </thead>
              <tbody>
                 <tr v-for="res in myResults" :key="res.id">
                    <td>{{ res.Test.title }}</td>
                    <td><span class="score-badge">{{ res.score }} / {{ res.max_score }}</span></td>
                    <td>{{ new Date(res.createdAt).toLocaleDateString() }}</td>
                 </tr>
              </tbody>
           </table>
         </div>
      </div>

      <!-- Trial Test -->
      <div v-if="currentView === 'trial-test'" class="fade-in">
         <h2 class="title-lg">Пробный Тест</h2>
         <div class="card" style="padding: 40px; text-align: center;">
            <p style="font-size: 1.2rem; margin-bottom: 20px;">Хотите проверить свои силы? Пробный тест поможет вам оценить уровень знаний.</p>
            <div style="display: flex; justify-content: center; gap: 30px; margin-bottom: 30px;">
               <div class="badge-blue">⏱ 20 мин</div>
               <div class="badge-blue">📝 15 вопр.</div>
            </div>
            <button class="btn-primary" @click="alert('В разработке')">Начать Тест</button>
         </div>
      </div>

      <!-- Calculator -->
      <div v-if="currentView === 'calculator'" class="fade-in">
         <h2 class="title-lg">Калькулятор поступления</h2>
         <div class="card" style="padding: 30px; border-radius: 20px;">
            <div class="tabs" style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
               <button :class="{ active: calcTab === 'nzm' }" @click="calcTab = 'nzm'" class="tab-btn">НЗМ</button>
               <button :class="{ active: calcTab === 'bil' }" @click="calcTab = 'bil'" class="tab-btn">БИЛ</button>
            </div>

            <div class="calc-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
               <!-- Inputs -->
               <div class="calc-inputs" style="background: #fdfdfd; padding: 20px; border-radius: 12px; border: 1px solid #f0f0f0;">
                  <div v-if="calcTab === 'nzm'" class="form-grid" style="display: grid; grid-template-columns: 1fr; gap: 15px;">
                     <div class="form-group" v-for="field in nzmFields" :key="field.id">
                        <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 5px;">{{ t_calc(field.id) }}</label>
                        <input type="number" v-model.number="nzmValues[field.id]" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ddd;" :placeholder="'max: ' + field.max" />
                     </div>
                     <button @click="calculateNzm" class="btn-primary" style="margin-top: 10px;">Рассчитать</button>
                  </div>
                  <div v-if="calcTab === 'bil'" class="form-group">
                     <label style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 5px;">Общий балл БИЛ</label>
                     <input type="number" v-model.number="bilScoreValue" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ddd; margin-bottom: 15px;" placeholder="Введите балл" />
                     <button @click="calculateBil" class="btn-primary" style="width: 100%;">Рассчитать</button>
                  </div>
               </div>

               <!-- Results -->
               <div class="calc-results" v-if="calcShowResults">
                  <h3 style="margin-bottom: 15px;">Вероятность поступления</h3>
                  <div style="max-height: 400px; overflow-y: auto;">
                     <table style="width: 100%; border-collapse: collapse;">
                        <tr v-for="s in (calcTab === 'nzm' ? nzmResults : bilResults)" :key="s.name">
                           <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-size: 0.9rem;">{{ s.name }}</td>
                           <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">
                              <span class="tag" :class="getPercentageColor(s.percentage)">{{ s.percentage }}%</span>
                           </td>
                        </tr>
                     </table>
                  </div>
               </div>
               <div v-else style="display: flex; align-items: center; justify-content: center; color: #999; text-align: center;">
                  Введите баллы и нажмите "Рассчитать"
               </div>
            </div>
         </div>
      </div>

      <!-- Tariffs -->
      <div v-if="currentView === 'tariffs'" class="fade-in">
         <h2 class="title-lg">Тарифы</h2>
         <div class="pricing-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 15px; max-width: 1000px; margin: 0 auto;">
            <div v-for="plan in pricingPlans" :key="plan.id"
                 class="card pricing-item" 
                 :class="{ active: selectedTariff === plan.id }"
                 @click="selectTariff(plan.id)"
                 style="padding: 15px; cursor: pointer; transition: 0.3s; border: 2px solid transparent;">
               <h3 style="margin-bottom: 5px; font-size: 1.1rem;">{{ plan.name }}</h3>
               <div style="font-size: 0.8rem; text-decoration: line-through; color: #ef4444; margin-bottom: 2px;" v-if="plan.originalPrice">{{ plan.originalPrice.toLocaleString() }} ₸</div>
               <div style="font-size: 1.3rem; font-weight: 800; color: #00bfff; margin-bottom: 10px;">{{ plan.price.toLocaleString() }} ₸</div>
               <ul style="list-style: none; padding: 0; margin-bottom: 10px; text-align: left; font-size: 0.8rem; color: #666;">
                  <li v-for="(feat, idx) in plan.features.included" :key="idx" style="margin-bottom: 3px;">✓ {{ feat }}</li>
               </ul>
            </div>
         </div>
         
         <div v-if="selectedTariff" class="card" style="margin-top: 25px; padding: 25px; max-width: 500px; margin-left: auto; margin-right: auto;">
            <h3 style="margin-bottom: 15px; text-align: center; font-size: 1.1rem;">Заявка на тариф: {{ selectedTariffName }}</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
               <input type="tel" v-model="appPhone" @input="formatPhone" placeholder="+7 (700) 000-00-00" style="padding: 10px; border: 1px solid #ddd; border-radius: 8px;" />
               <textarea v-model="appComment" placeholder="Комментарий (необязательно)" style="padding: 10px; border: 1px solid #ddd; border-radius: 8px;" rows="2"></textarea>
               <button class="btn-primary" style="background: #00bfff; border: none; padding: 12px; font-weight: bold;" @click="submitApp">Отправить заявку</button>
            </div>
         </div>
      </div>

    </main>
  </div>
</template>

<script>
import api from '../api';
import TestRunner from '../components/TestRunner.vue';
import { useToast } from '../composables/useToast';

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

export default {
  components: { TestRunner },
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      currentView: 'courses',
      courses: [],
      myResults: [],
      standaloneTests: [],
      activeCourse: null,
      currentLesson: null,
      activeTestId: null, // For standalone tests
      showTest: false,
      showSolution: false,
      isSidebarOpen: false,
      calcTab: 'nzm',
      nzmValues: { mathematics: null, numericalCharacteristics: null, naturalScience: null, kazakh: null, russian: null, english: null },
      bilScoreValue: null,
      nzmResults: [],
      bilResults: [],
      calcShowResults: false,
      nzmFields: [
        { id: 'mathematics', max: 400 },
        { id: 'numericalCharacteristics', max: 300 },
        { id: 'naturalScience', max: 200 },
        { id: 'kazakh', max: 200 },
        { id: 'russian', max: 200 },
        { id: 'english', max: 200 }
      ],
      selectedTariff: null,
      appPhone: '',
      appComment: '',
      pricingPlans: [
        {
          id: "bil_online",
          name: "БИЛ Online",
          duration: "5 месяцев",
          price: 69000,
          originalPrice: 125000,
          features: {
            included: [
              "Подготовка к БИЛ",
              "2 эфира в неделю",
              "Доступ 24/7",
              "Система кураторства",
              "Конкурсные тесты",
              "Доп. материалы"
            ]
          }
        },
        {
          id: "nzm_online",
          name: "НЗМ Online",
          duration: "3 месяца",
          price: 42000,
          originalPrice: 75000,
          features: {
            included: [
              "Подготовка к НЗМ",
              "2 эфира в неделю",
              "Доступ 24/7",
              "Система кураторства",
              "Конкурсные тесты",
              "Доп. материалы"
            ]
          }
        },
        {
          id: "math_package",
          name: "Математика (БИЛ-НЗМ)",
          duration: "1 год",
          price: 19000,
          originalPrice: 53000,
          features: {
            included: [
              "Доступ 24/7",
              "53 видео-урока",
              "Тесты к темам",
              "Доступ на 1 год"
            ]
          }
        },
        {
          id: "logic_package",
          name: "Логика (БИЛ)",
          duration: "1 год",
          price: 14900,
          originalPrice: 20000,
          features: {
            included: [
              "Доступ 24/7",
              "20 видео-уроков",
              "Тесты к темам",
              "Доступ на 1 год"
            ]
          }
        },
        {
          id: "bil_bundle",
          name: "БИЛ Пакет",
          duration: "1 год",
          price: 29900,
          originalPrice: 76000,
          features: {
            included: [
              "Доступ 24/7",
              "20 видео-уроков",
              "Тесты к темам",
              "Доступ на 1 год"
            ]
          }
        }
      ]
    };
  },
  computed: {
    selectedTariffName() {
      const plan = this.pricingPlans.find(p => p.id === this.selectedTariff);
      return plan ? plan.name : '';
    }
  },
  mounted() {
    this.fetchCourses();
    this.fetchResults();
    this.fetchStandaloneTests();
  },
  methods: {
    selectView(view) {
      this.currentView = view;
      this.isSidebarOpen = false;
      this.activeCourse = null;
      this.activeTestId = null;
    },
    async fetchCourses() {
       const res = await api.get('/courses');
       this.courses = res.data;
    },
    async fetchResults() {
       const res = await api.get('/results/me');
       this.myResults = res.data;
    },
    async fetchStandaloneTests() {
       // Fetch only standalone tests
       const res = await api.get('/tests?is_standalone=true');
       this.standaloneTests = res.data;
    },
    async openCourse(course) {
       const res = await api.get(`/courses/${course.id}`);
       this.activeCourse = res.data;
       if (this.activeCourse.Lessons.length > 0) {
          this.currentLesson = this.activeCourse.Lessons[0];
       }
    },
    getEmbedUrl(url) {
       if (!url) return '';
       const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
       const match = url.match(regExp);
       return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
    },
    startTest() { this.showTest = true; },
    openStandaloneTest(test) {
        this.activeTestId = test.id;
        this.showTest = true;
    },
    async onTestCompleted() {
       this.showTest = false;
       this.activeTestId = null;
       await this.fetchResults();
       
       // Refresh course data to unlock solutions if we are in a course
       if (this.activeCourse) {
           await this.openCourse(this.activeCourse); 
           // Ensure currentLesson is preserved if possible or reset to the same one
           if (this.currentLesson) {
               const found = this.activeCourse.Lessons.find(l => l.id === this.currentLesson.id);
               if (found) this.currentLesson = found;
           }
       }
    },
    onTestCancel() {
        this.showTest = false;
        this.activeTestId = null;
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
    t_calc(key) {
      const map = {
        mathematics: 'Математика',
        numericalCharacteristics: 'Числовые хар-ки',
        naturalScience: 'Естествознание',
        kazakh: 'Казахский язык',
        russian: 'Русский язык',
        english: 'Английский язык'
      };
      return map[key] || key;
    },
    selectTariff(id) {
      this.selectedTariff = id;
    },
    formatPhone(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.startsWith('7')) value = value.slice(1);
      
      let formatted = '+7 ';
      if (value.length > 0) formatted += '(' + value.substring(0, 3);
      if (value.length >= 4) formatted += ') ' + value.substring(3, 6);
      if (value.length >= 7) formatted += '-' + value.substring(6, 8);
      if (value.length >= 9) formatted += '-' + value.substring(8, 10);
      
      this.appPhone = formatted.trim();
      e.target.value = this.appPhone;
    },
    async submitApp() {
      if (!this.appPhone) {
        this.toast.error('Введите номер телефона');
        return;
      }
      console.log('Application:', { tariff: this.selectedTariff, phone: this.appPhone, comment: this.appComment });
      await new Promise(r => setTimeout(r, 1000));
      this.toast.success('Заявка принята!');
      this.selectedTariff = null;
      this.appPhone = '';
      this.appComment = '';
    },
    calculateNzm() {
      const total = Object.values(this.nzmValues).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
      this.nzmResults = nzmSchools.map(school => ({
        ...school,
        percentage: this.getNzmPercentage(total, school.totalMin)
      })).sort((a, b) => b.percentage - a.percentage);
      this.calcShowResults = true;
    },
    calculateBil() {
      const score = this.bilScoreValue;
      this.bilResults = bilSchools.map(school => ({
        ...school,
        percentage: this.getBilPercentage(score, school.totalMin)
      })).sort((a, b) => b.percentage - a.percentage);
      this.calcShowResults = true;
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
    }
  }
};
</script>

<style scoped>
.student-dashboard { display: flex; height: 100vh; background: var(--bg-color); }
.sidebar { width: 260px; background: linear-gradient(180deg, var(--primary-color) 0%, #009ACD 100%); color: white; display: flex; flex-direction: column; padding: 20px; box-shadow: 2px 0 10px rgba(0,0,0,0.1); }

.mobile-header {
  display: none;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: white;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 100;
}
.hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
}
.hamburger span {
  display: block;
  width: 25px;
  height: 3px;
  background-color: var(--primary-color);
  border-radius: 3px;
}
.mobile-logo {
  font-weight: 800;
  color: var(--primary-color);
}

@media (max-width: 992px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1001;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  .sidebar-open .sidebar {
    transform: translateX(0);
  }
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 1000;
  }
  .mobile-header {
    display: flex;
  }
  .player-layout {
    flex-direction: column;
    height: auto;
  }
  .lesson-sidebar {
    width: 100%;
    max-height: 300px;
  }
}

@media (max-width: 480px) {
  .content { padding: 15px; }
  .title-lg { font-size: 1.5rem; }
  .course-card { height: auto; min-height: 180px; }
  .video-area { padding: 15px; }
  .actions-bar { flex-direction: column; }
}

.logo-area { font-size: 1.4rem; font-weight: 800; text-align: center; margin-bottom: 40px; color: white; }
.sidebar nav button { background: rgba(255,255,255,0.1); color: white; width: 100%; text-align: left; padding: 12px 15px; margin-bottom: 10px; border-radius: 8px; font-weight: 500; transition: 0.3s; }
.sidebar nav button:hover, .sidebar nav button.active { background: white; color: var(--primary-color); transform: translateX(5px); }
.btn-logout { background: rgba(0,0,0,0.2); color: white; width: 100%; padding: 10px; border-radius: 8px; }
.btn-logout:hover { background: #ff4d4d; }

.content { flex: 1; padding: 30px; overflow-y: auto; }
.title-lg { font-size: 2rem; margin-bottom: 25px; color: #333; }
.course-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; }
.course-card { background: white; border-radius: 12px; height: 200px; display: flex; flex-direction: column; justify-content: space-between; cursor: pointer; transition: transform 0.3s; padding: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
.course-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
.btn-start { background: transparent; color: var(--primary-color); font-weight: bold; text-align: right; margin-top: auto; }

.player-layout { display: flex; gap: 20px; height: calc(100vh - 100px); }
.lesson-sidebar { width: 300px; background: white; border-radius: 12px; padding: 20px; overflow-y: auto; }
.sidebar-title { font-size: 1.1rem; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px; }
.lesson-nav { list-style: none; padding: 0; }
.lesson-nav li { padding: 12px; cursor: pointer; border-radius: 8px; margin-bottom: 5px; font-size: 0.95rem; display: flex; align-items: center; gap: 8px; color: #555; }
.lesson-nav li:hover { background: #f5f5f5; }
.lesson-nav li.active { background: var(--secondary-color); color: var(--primary-color); font-weight: 600; }
.icon-play { font-size: 0.8rem; }

.video-area { flex: 1; background: white; border-radius: 12px; padding: 25px; overflow-y: auto; display: flex; flex-direction: column; }
.video-container { width: 100%; aspect-ratio: 16/9; background: #000; border-radius: 8px; overflow: hidden; margin-bottom: 20px; }
.video-container.secondary { aspect-ratio: 16/9; margin-top: 10px; }
.actions-bar { display: flex; gap: 15px; }
.btn-back { background: none; color: #666; margin-bottom: 15px; font-weight: 500; }
.btn-back:hover { color: var(--primary-color); }
.btn-primary.animate-pulse { animation: pulse 2s infinite; }

.styled-table { width: 100%; border-collapse: collapse; }
.styled-table th { text-align: left; padding: 15px; color: #777; border-bottom: 1px solid #eee; }
.styled-table td { padding: 15px; border-bottom: 1px solid #eee; }
.score-badge { font-weight: bold; color: var(--primary-color); }

.fade-in { animation: fadeIn 0.5s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(0, 191, 255, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(0, 191, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(0, 191, 255, 0); } }
.badge-blue { background: #e3f2fd; color: #1565c0; padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600; }
.mb-4 { margin-bottom: 1rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.pt-4 { padding-top: 1rem; }
.border-t { border-top: 1px solid #eee; }
.text-sm { font-size: 0.875rem; }
.text-gray-500 { color: #6b7280; }
.font-bold { font-weight: 700; }
.text-lg { font-size: 1.125rem; }
.btn-disabled { background: #e0e0e0; color: #999; border: 1px solid #ccc; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: not-allowed; }

.pricing-item { transition: transform 0.3s; border: 2px solid transparent !important; }
.pricing-item:hover { transform: translateY(-5px); }
.pricing-item.active { border-color: #00bfff !important; background: #f0f9ff; }
.pricing-item.popular.active { border-color: #00bfff !important; }

.tab-btn {
  background: none;
  border: none;
  padding: 10px 20px;
  font-weight: 700;
  color: #94a3b8;
  cursor: pointer;
  border-radius: 10px;
  transition: 0.3s;
}
.tab-btn.active {
  background: var(--primary-color);
  color: white;
}

.tag {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  display: inline-block;
}
.tag.green { background: #dcfce7; color: #166534; }
.tag.blue { background: #e0f2fe; color: #0369a1; }
.tag.orange { background: #ffedd5; color: #9a3412; }
.tag.volcano { background: #fee2e2; color: #991b1b; }
.tag.red { background: #fef2f2; color: #dc2626; }
</style>
