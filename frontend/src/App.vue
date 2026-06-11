<template>
  <div class="app-shell">
    <header>
      <nav>
        <router-link to="/">Blog</router-link>
        <router-link to="/articles/new" v-if="canEdit">Nowy artykuł</router-link>
        <router-link to="/login" v-if="!isAuthenticated">Logowanie</router-link>
        <router-link to="/register" v-if="!isAuthenticated">Rejestracja</router-link>
        <button v-if="isAuthenticated" @click="logout">Wyloguj</button>
      </nav>
      <div class="user-info" v-if="isAuthenticated">
        Zalogowany jako: <strong>{{ user.name }}</strong> ({{ user.role }})
      </div>
    </header>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import { auth } from './api';

export default {
  name: 'App',
  computed: {
    user() {
      return auth.user;
    },
    isAuthenticated() {
      return auth.isAuthenticated();
    },
    canEdit() {
      return this.isAuthenticated && ['admin', 'editor'].includes(this.user?.role);
    },
  },
  methods: {
    logout() {
      auth.logout();
      this.$router.push({ name: 'home' });
    },
  },
};
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f5f5f5;
}
.app-shell {
  max-width: 980px;
  margin: 0 auto;
  padding: 16px;
}
header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}
nav {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
nav a,
nav button {
  padding: 8px 12px;
  border: 1px solid #bbb;
  border-radius: 6px;
  background: #fff;
  color: #333;
  text-decoration: none;
  cursor: pointer;
}
nav button:hover,
nav a:hover {
  background: #eef;
}
.user-info {
  color: #555;
}
main {
  background: #fff;
  padding: 24px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}
</style>
