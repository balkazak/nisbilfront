<template>
  <div class="dashboard-layout" :class="{ 'sidebar-open': isSidebarOpen }">
    <div v-if="isSidebarOpen" class="sidebar-overlay" @click="isSidebarOpen = false"></div>
    <aside class="sidebar">
      <div class="logo-area">nis-bil.online</div>
      <nav>
        <button @click="selectTab('courses')" :class="{ active: currentTab === 'courses' }">Курсы</button>
        <button @click="selectTab('tests')" :class="{ active: currentTab === 'tests' }">Тесты</button>
        <button @click="selectTab('users')" :class="{ active: currentTab === 'users' }">Пользователи</button>
        <button @click="selectTab('results')" :class="{ active: currentTab === 'results' }">Результаты</button>
      </nav>
      <div style="margin-top: auto;">
        <button @click="logout" class="btn-logout">Выйти</button>
      </div>
    </aside>
    <main class="content">
      <header class="top-bar">
        <button class="hamburger" @click="isSidebarOpen = !isSidebarOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h3>Добро пожаловать, {{ user.username }} ({{ translatedRole }})</h3>
      </header>
      
      <div v-if="currentTab === 'users'" class="fade-in">
        <UserManagement />
      </div>
      <div v-if="currentTab === 'courses'" class="fade-in">
        <CourseManagement />
      </div>
      <div v-if="currentTab === 'tests'" class="fade-in">
        <TestManagement />
      </div>
       <div v-if="currentTab === 'results'" class="fade-in">
        <ResultsView />
      </div>
    </main>
  </div>
</template>

<script>
import UserManagement from '../components/UserManagement.vue';
import CourseManagement from '../components/CourseManagement.vue';
import TestManagement from '../components/TestManagement.vue';
import ResultsView from '../components/ResultsView.vue';

export default {
  components: { UserManagement, CourseManagement, TestManagement, ResultsView },
  data() {
    return {
      currentTab: 'courses',
      isSidebarOpen: false,
      user: JSON.parse(localStorage.getItem('user') || '{}')
    };
  },
  computed: {
    translatedRole() {
       const roles = { 'admin': 'Админ', 'teacher': 'Учитель', 'student': 'Ученик' };
       return roles[this.user.role] || this.user.role;
    }
  },
  methods: {
    selectTab(tab) {
      this.currentTab = tab;
      this.isSidebarOpen = false;
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
.dashboard-layout {
  display: flex;
  height: 100vh;
}
.sidebar {
  width: 260px;
  background-color: #ffffff;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  padding: 20px;
}
.logo-area {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 40px;
  text-align: center;
}
.sidebar nav button {
  background: transparent;
  color: #555;
  width: 100%;
  text-align: left;
  margin-bottom: 10px;
  padding: 12px 15px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
}
.sidebar nav button:hover {
  background: var(--secondary-color);
  color: var(--primary-color);
}
.sidebar nav button.active {
  background: var(--primary-color);
  color: white;
  box-shadow: 0 4px 10px rgba(0, 191, 255, 0.3);
}
.content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  background-color: var(--bg-color);
}
.top-bar {
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 15px;
}
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}
.hamburger span {
  display: block;
  width: 25px;
  height: 3px;
  background-color: var(--primary-color);
  border-radius: 3px;
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
  .hamburger {
    display: flex;
  }
}

@media (max-width: 480px) {
  .content {
    padding: 15px;
  }
  .top-bar h3 {
    font-size: 1rem;
  }
}

.btn-logout {
  background: #fff0f0;
  color: #ff4d4d;
  width: 100%;
  font-weight: 600;
}
.btn-logout:hover {
  background: #ffe0e0;
}
.fade-in { animation: fadeIn 0.4s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
