<template>
  <section>
    <h1>Rejestracja</h1>
    <form @submit.prevent="submit">
      <label>
        Imię
        <input type="text" v-model="name" required />
      </label>
      <label>
        E-mail
        <input type="email" v-model="email" required />
      </label>
      <label>
        Hasło
        <input type="password" v-model="password" required minlength="6" />
      </label>
      <button type="submit">Zarejestruj</button>
    </form>
    <div class="message" v-if="message">{{ message }}</div>
  </section>
</template>

<script>
import { auth } from '../api';

export default {
  name: 'Register',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      message: '',
    };
  },
  methods: {
    async submit() {
      this.message = '';
      try {
        await auth.register({ name: this.name, email: this.email, password: this.password });
        this.message = 'Konto zostało utworzone. Możesz się zalogować.';
        this.name = this.email = this.password = '';
      } catch (ex) {
        this.message = ex.message || 'Nie udało się zarejestrować.';
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
  background: #3a9d23;
  color: white;
  cursor: pointer;
}
.message {
  margin-top: 12px;
  color: #0c4f0e;
}
</style>
