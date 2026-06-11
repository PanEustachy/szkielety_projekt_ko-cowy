<template>
  <section>
    <h1>{{ isEdit ? 'Edytuj artykuł' : 'Nowy artykuł' }}</h1>
    <form @submit.prevent="submit">
      <label>
        Tytuł
        <input type="text" v-model="form.title" required />
      </label>
      <label>
        Treść
        <textarea v-model="form.content" required rows="8"></textarea>
      </label>
      <label>
        Kategorie (oddziel przecinkami)
        <input type="text" v-model="form.categories" />
      </label>
      <label>
        Tagi (oddziel przecinkami)
        <input type="text" v-model="form.tags" />
      </label>
      <button type="submit">Zapisz</button>
    </form>
    <div class="message" v-if="message">{{ message }}</div>
  </section>
</template>

<script>
import { articles, auth } from '../api';

export default {
  name: 'ArticleForm',
  data() {
    return {
      form: {
        title: '',
        content: '',
        tags: '',
        categories: '',
      },
      message: '',
      isEdit: false,
      loading: false,
    };
  },
  async created() {
    const { id } = this.$route.params;
    this.isEdit = Boolean(id);
    if (this.isEdit) {
      await this.loadArticle(id);
    }
  },
  methods: {
    async loadArticle(id) {
      try {
        const article = await articles.get(id);
        this.form.title = article.title;
        this.form.content = article.content;
        this.form.tags = article.tags.join(', ');
        this.form.categories = article.categories.join(', ');
        if (!['admin', 'editor'].includes(auth.user?.role) || (auth.user.role === 'editor' && auth.user.id !== article.authorId)) {
          this.message = 'Nie masz uprawnień do edycji tego artykułu.';
          this.$router.push({ name: 'home' });
        }
      } catch (ex) {
        this.message = ex.message || 'Błąd ładowania artykułu.';
      }
    },
    async submit() {
      try {
        this.message = '';
        const payload = {
          title: this.form.title,
          content: this.form.content,
          tags: this.form.tags.split(',').map((item) => item.trim()).filter(Boolean),
          categories: this.form.categories.split(',').map((item) => item.trim()).filter(Boolean),
        };
        if (this.isEdit) {
          await articles.update(this.$route.params.id, payload);
        } else {
          await articles.create(payload);
        }
        this.$router.push({ name: 'home' });
      } catch (ex) {
        this.message = ex.message || 'Nie udało się zapisać artykułu.';
      }
    },
  },
};
</script>

<style>
label {
  display: block;
  margin-bottom: 14px;
}
input,
textarea {
  width: 100%;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #bbb;
  margin-top: 6px;
}
button {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #fff;
  cursor: pointer;
}
.message {
  margin-top: 14px;
  color: #a00;
}
</style>
