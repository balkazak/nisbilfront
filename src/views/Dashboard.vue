<template>
  <div class="dashboard-layout" :class="{ 'sidebar-open': isSidebarOpen }">
    <div
      v-if="isSidebarOpen"
      class="sidebar-overlay"
      @click="isSidebarOpen = false"
    ></div>
    <aside class="sidebar">
      <div class="logo-area">nis-bil.online</div>
      <nav>
        <button @click="router.push('/')">{{ t("nav.main") }}</button>
        <button
          v-if="user.role === 'admin'"
          @click="selectTab('courses')"
          :class="{ active: currentTab === 'courses' }"
        >
          {{ t("admin.courses") }}
        </button>
        <button
          v-if="user.role === 'admin'"
          @click="selectTab('tests')"
          :class="{ active: currentTab === 'tests' }"
        >
          {{ t("admin.tests") }}
        </button>
        <button
          @click="selectTab('users')"
          :class="{ active: currentTab === 'users' }"
        >
          {{ t("admin.users") }}
        </button>
        <button
          v-if="user.role === 'admin'"
          @click="selectTab('results')"
          :class="{ active: currentTab === 'results' }"
        >
          {{ t("admin.results") }}
        </button>
      </nav>
      <div style="margin-top: auto">
        <button @click="logout" class="btn-logout">
          {{ t("dashboard.logout") }}
        </button>
      </div>
    </aside>
    <main class="content">
      <header class="top-bar">
        <button class="hamburger" @click="isSidebarOpen = !isSidebarOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h3>
          {{ t("admin.welcome") }}, {{ user.username }} ({{ translatedRole }})
        </h3>
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

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import UserManagement from "../components/UserManagement.vue";
import CourseManagement from "../components/CourseManagement.vue";
import TestManagement from "../components/TestManagement.vue";
import ResultsView from "../components/ResultsView.vue";
import { useLanguage } from "../composables/useLanguage";

const router = useRouter();
const { t } = useLanguage();

const user = ref(JSON.parse(localStorage.getItem("user") || "{}"));
const currentTab = ref(user.value.role === "admin" ? "courses" : "users");
const isSidebarOpen = ref(false);

const translatedRole = computed(() => {
  return t(`admin.role.${user.value.role}`) || user.value.role;
});

const selectTab = (tab) => {
  currentTab.value = tab;
  isSidebarOpen.value = false;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/");
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
  color: #00bfff;
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
  border: none;
  cursor: pointer;
}
.sidebar nav button:hover {
  background: #f0f9ff;
  color: #00bfff;
}
.sidebar nav button.active {
  background: #00bfff;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 191, 255, 0.3);
}
.content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
  background-color: #f8fafc;
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
  background-color: #00bfff;
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
    background: rgba(0, 0, 0, 0.5);
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
  padding: 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}
.btn-logout:hover {
  background: #ffe0e0;
}
.fade-in {
  animation: fadeIn 0.4s ease;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
