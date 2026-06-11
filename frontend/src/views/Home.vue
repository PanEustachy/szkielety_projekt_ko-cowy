<template>
  <section>
    <div class="page-header">
      <h1>Lista artykułów</h1>
      <router-link v-if="canEdit" class="primary-button" to="/articles/new">Nowy artykuł</router-link>
    </div>
    <div v-if="error" class="alert">{{ error }}</div>
    <div v-if="articles.length === 0">Brak artykułów do wyświetlenia.</div>
    <ul class="article-list">
      <li v-for="article in articles" :key="article.id" class="article-card">
        <h2>
          <router-link :to="{ name: 'article-detail', params: { id: article.id } }">
            {{ article.title }}
          </router-link>
        </h2>
        <p>{{ summarize(article.content) }}</p>
        <p class="meta">
          Autor: {{ article.author?.name || 'Nieznany' }} | Publikacja: {{ formatDate(article.publicationDate) }}
        </p>
        <p class="meta">
          Kategorie: {{ article.categories.join(', ') || 'Brak' }} | Tagii: {{ article.tags.join(', ') || 'Brak' }}
        </p>
        <p class="votes">
          👍 {{ article.upVotes }} | 👎 {{ article.downVotes }}
        </p>
        <div class="card-actions" v-if="canEditArticle(article)">
          <router-link :to="{ name: 'edit-article', params: { id: article.id } }">Edytuj</router-link>
          <button @click="deleteArticle(article.id)">Usuń</button>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import { articles, auth } from '../api';

export default {
  name: 'Home',
  data() {
    return {
      articles: [],
      error: null,
    };
  },
  computed: {
    canEdit() {
      return auth.isAuthenticated() && ['admin', 'editor'].includes(auth.user?.role);
    },
  },
  async created() {
    try {
      this.articles = await articles.list();
    } catch (ex) {
      this.error = ex.message || 'Nie udało się pobrać artykułów.';
    }
  },
  methods: {
    summarize(text) {
      return text.length > 180 ? text.slice(0, 180) + '...' : text;
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('pl-PL');
    },
    canEditArticle(article) {
      const user = auth.user;
      return (
        user &&
        (user.role === 'admin' || (user.role === 'editor' && article.authorId === user.id))
      );
    },
    async deleteArticle(id) {
      if (!confirm('Czy na pewno chcesz usunąć ten artykuł?')) {
        return;
      }
      try {
        await articles.remove(id);
        this.articles = this.articles.filter((item) => item.id !== id);
      } catch (ex) {
        this.error = ex.message || 'Nie udało się usunąć artykułu.';
      }
    },
  },
};
</script>

<style>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  margin-bottom: 18px;
}
.primary-button {
  padding: 10px 16px;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  text-decoration: none;
  border: none;
}
.article-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 18px;
}
.article-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 18px;
  background: #fafafa;
}
.article-card h2 {
  margin: 0 0 8px;
}
.article-card p {
  margin: 8px 0;
}
.meta {
  color: #666;
  font-size: 0.93rem;
}
.votes {
  margin-top: 12px;
  font-weight: 600;
}
.card-actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
}
.card-actions a,
.card-actions button {
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  color: white;
  text-decoration: none;
  cursor: pointer;
}
.card-actions a {
  background: #10b981;
}
.card-actions button {
  background: #ef4444;
}
.alert {
  color: #a00;
  margin-bottom: 14px;
}
</style>

<style>
.article-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 18px;
}
.article-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 18px;
  background: #fafafa;
}
.article-card h2 {
  margin: 0 0 8px;
}
.article-card p {
  margin: 8px 0;
}
.meta {
  color: #666;
  font-size: 0.93rem;
}
.votes {
  margin-top: 12px;
  font-weight: 600;
}
.alert {
  color: #a00;
  margin-bottom: 14px;
}
</style>
