import { createRouter, createWebHistory } from 'vue-router';

import CreateUser from '../Views/Components/CreateUser.vue';
import UsageDetails from '../Views/Components/UsageDetails.vue';
import ManageUsage from "@/Views/Components/ManageUsage.vue";

const routes = [
    {
        path: '/',
        component: CreateUser
    },
    {
        path: '/usage',
        component: UsageDetails
    },
    {
        path: '/manageUsage',
        component: ManageUsage
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
