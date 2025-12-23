import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';

import StudentDashboard from '../views/StudentDashboard.vue';
import Landing from '../views/Landing.vue';
import TrialTest from '../views/TrialTest.vue';
import Calculator from '../views/Calculator.vue';
import Tariffs from '../views/Tariffs.vue';

const routes = [
    { path: '/', component: Landing },
    { path: '/login', component: Login },
    { path: '/dashboard', component: Dashboard },
    { path: '/student-dashboard', component: StudentDashboard },
    { path: '/trial-test', component: TrialTest },
    { path: '/calculator', component: Calculator },
    { path: '/tariffs', component: Tariffs },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
