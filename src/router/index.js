import { createRouter, createWebHistory } from "vue-router";
import LoginView from '../views/login/login-view.vue'

const routes = [
    {
        path: '/',
        name: 'Login',
        component: LoginView
    },
    {
        path: '/sign-up',
        name: 'Sign Up',
        component: () => import(/* webpackChuckName: "signup" */ '../views/signup/signup-view.vue')
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import(/* webpackChuckName: "home" */ '../views/home/home-view.vue')
    },
    {
        path: '/error-page',
        name: 'Error Page',
        props: {errorCode: 403, errorMessage: 'Not Allowed'},
        component: () => import(/* webpackChuckName: "error" */ '../views/error-page/error-view.vue')
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})
export default router;