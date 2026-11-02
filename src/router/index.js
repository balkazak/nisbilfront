import { createRouter, createWebHistory } from 'vue-router';
import MaintenanceView from '@/views/MaintenanceView.vue';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';

import StudentDashboard from '../views/StudentDashboard.vue';
import Landing from '../views/Landing.vue';
import TrialTest from '../views/TrialTest.vue';
import Calculator from '../views/Calculator.vue';
import Tariffs from '../views/Tariffs.vue';

const MAINTENANCE_MODE = false;

const routes = MAINTENANCE_MODE
    ? [
        {
            path: '/:pathMatch(.*)*',
            component: MaintenanceView,
        },
    ]
    : [
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
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
            };
        }
        if (savedPosition) {
            return savedPosition;
        }
        return { top: 0, behavior: 'smooth' };
    }
});

export default router;
