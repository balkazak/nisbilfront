<template>
  <div class="student-dashboard" :class="{ 'sidebar-open': isSidebarOpen }">
    <div v-if="isSidebarOpen" class="sidebar-overlay" @click="isSidebarOpen = false"></div>
    <aside class="sidebar">
      <div class="logo-area">nis-bil.online</div>
      <nav>
        <button @click="selectView('courses')" :class="{active: currentView === 'courses'}">Мои Курсы</button>
        <button @click="selectView('tests')" :class="{active: currentView === 'tests'}">Тесты</button>
        <button @click="selectView('results')" :class="{active: currentView === 'results'}">Мои Результаты</button>
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

    </main>
  </div>
</template>

<script>
import api from '../api';
import TestRunner from '../components/TestRunner.vue';

export default {
  components: { TestRunner },
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
      isSidebarOpen: false
    };
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
    left: -260px;
    top: 0;
    bottom: 0;
    z-index: 1001;
    transition: left 0.3s ease;
  }
  .sidebar-open .sidebar {
    left: 0;
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
</style>
