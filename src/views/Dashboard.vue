<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div class="logo-area">nis-bil.online</div>
      <nav>
        <button @click="currentTab = 'courses'" :class="{ active: currentTab === 'courses' }">Курсы</button>
        <button @click="currentTab = 'tests'" :class="{ active: currentTab === 'tests' }">Тесты</button>
        <button @click="currentTab = 'users'" :class="{ active: currentTab === 'users' }">Пользователи</button>
        <button @click="currentTab = 'results'" :class="{ active: currentTab === 'results' }">Результаты</button>
      </nav>
      <div style="margin-top: auto;">
        <button @click="logout" class="btn-logout">Выйти</button>
      </div>
    </aside>
    <main class="content">
      <header class="top-bar">
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
