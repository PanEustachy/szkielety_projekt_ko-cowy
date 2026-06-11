<template>
  <section>
    <div v-if="error" class="alert">{{ error }}</div>
    <div v-else-if="!article">Ładowanie artykułu...</div>
    <div v-else>
      <h1>{{ article.title }}</h1>
      <p class="meta">
        Autor: {{ article.author?.name || 'Nieznany' }} | Publikacja: {{ formatDate(article.publicationDate) }}
      </p>
      <p class="meta">Kategorie: {{ article.categories.join(', ') || 'Brak' }}</p>
      <p class="meta">Tagi: {{ article.tags.join(', ') || 'Brak' }}</p>
      <div class="content">{{ article.content }}</div>
      <div class="vote-row">
        <button @click="rate(1)" :disabled="!canRate || article.userVote !== null">👍</button>
        <span>{{ article.upVotes }}</span>
        <button @click="rate(-1)" :disabled="!canRate || article.userVote !== null">👎</button>
        <span>{{ article.downVotes }}</span>
      </div>
      <div v-if="article.userVote !== null" class="vote-note">
        Twój głos: <strong>{{ article.userVote === 1 ? '👍' : '👎' }}</strong>
      </div>
      <div class="actions" v-if="canEditArticle">
        <router-link :to="{ name: 'edit-article', params: { id: article.id } }">Edytuj</router-link>
        <button @click="removeArticle">Usuń</button>
      </div>
      <div class="message" v-if="message">{{ message }}</div>
    </div>
  </section>
</template>

<script>
import { articles, auth } from '../api';

export default {
  name: 'ArticleDetail',
  data() {
    return {
      article: null,
      error: null,
      message: '',
    };
  },
  computed: {
    canRate() {
      return auth.isAuthenticated() && this.article?.userVote === null;
    },
    canEditArticle() {
      const user = auth.user;
      return (
        user &&
        (user.role === 'admin' || (user.role === 'editor' && user.id === this.article?.authorId))
      );
    },
  },
  async created() {
    await this.loadArticle();
  },
  methods: {
    async loadArticle() {
      try {
        this.article = await articles.get(this.$route.params.id);
        if (this.article.userVote === undefined) {
          this.article.userVote = null;
        }
      } catch (ex) {
        this.error = ex.message || 'Nie udało się załadować artykułu.';
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('pl-PL');
    },
    async rate(value) {
      this.message = '';
      try {
        const result = await articles.rate(this.article.id, value);
        this.article.upVotes = result.upVotes;
        this.article.downVotes = result.downVotes;
        this.article.userVote = value;
      } catch (ex) {
        this.message = ex.message || 'Nie udało się ocenić artykułu.';
      }
    },
    async removeArticle() {
      if (!confirm('Czy na pewno chcesz usunąć ten artykuł?')) {
        return;
      }
      try {
        await articles.remove(this.article.id);
        this.$router.push({ name: 'home' });
      } catch (ex) {
        this.message = ex.message || 'Nie udało się usunąć artykułu.';
      }
    },
  },
};
</script>

<style>
.alert {
  color: #a00;
}
.meta {
  color: #555;
  margin-bottom: 10px;
}
.content {
  margin: 20px 0;
  line-height: 1.8;
}
.vote-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}
.vote-note {
  margin-bottom: 14px;
  color: #1f7a1f;
  font-weight: 600;
}
.vote-row button {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #999;
  background: #fff;
  cursor: pointer;
}
.actions {
  display: flex;
  gap: 12px;
}
.actions button,
.actions a {
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background: #ef4444;
  color: #fff;
  cursor: pointer;
  text-decoration: none;
}
.message {
  color: #a00;
  margin-top: 12px;
}
</style>
