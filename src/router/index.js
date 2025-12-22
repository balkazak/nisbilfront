import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';

import StudentDashboard from '../views/StudentDashboard.vue';

import Landing from '../views/Landing.vue';

const routes = [
    { path: '/', component: Landing },
    { path: '/login', component: Login },
    { path: '/dashboard', component: Dashboard },
    { path: '/student-dashboard', component: StudentDashboard },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
