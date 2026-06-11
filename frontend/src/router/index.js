import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import ArticleForm from '../views/ArticleForm.vue';
import ArticleDetail from '../views/ArticleDetail.vue';
import { auth } from '../api';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/articles/new', name: 'new-article', component: ArticleForm, meta: { requiresAuth: true } },
  { path: '/articles/:id/edit', name: 'edit-article', component: ArticleForm, meta: { requiresAuth: true } },
  { path: '/articles/:id', name: 'article-detail', component: ArticleDetail },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !auth.isAuthenticated()) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
