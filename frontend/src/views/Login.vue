<template>
  <section>
    <h1>Logowanie</h1>
    <form @submit.prevent="submit">
      <label>
        E-mail
        <input type="email" v-model="email" required />
      </label>
      <label>
        Hasło
        <input type="password" v-model="password" required minlength="6" />
      </label>
      <button type="submit">Zaloguj</button>
    </form>
    <div class="message" v-if="message">{{ message }}</div>
  </section>
</template>

<script>
import { auth } from '../api';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      message: '',
    };
  },
  methods: {
    async submit() {
      this.message = '';
      try {
        await auth.login({ email: this.email, password: this.password });
        this.$emit('authenticated');
        this.$router.push({ name: 'home' });
      } catch (ex) {
        this.message = ex.message || 'Nie udało się zalogować';
      }
    },
  },
};
</script>

<style>
label {
  display: block;
  margin-bottom: 12px;
}
input {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #bbb;
  margin-top: 6px;
}
button {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: #4a76f5;
  color: white;
  cursor: pointer;
}
.message {
  margin-top: 12px;
  color: #a00;
}
</style>
