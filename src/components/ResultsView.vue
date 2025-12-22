<template>
  <div>
    <h2 class="title-lg">История и Статистика</h2>
    <div class="table-container header-section">
      <table class="styled-table">
        <thead>
          <tr>
            <th>Ученик</th>
            <th>Тест</th>
            <th>Баллы</th>
            <th>Дата</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in results" :key="r.id">
            <td>{{ r.User ? r.User.username : 'Неизвестно' }}</td>
            <td>{{ r.Test ? r.Test.title : 'Удаленный тест' }}</td>
            <td>
              <span class="score-badge" :class="getScoreClass(r.score, r.max_score)">
                {{ r.score }} / {{ r.max_score }}
              </span>
            </td>
            <td>{{ new Date(r.createdAt).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import api from '../api';
export default {
  data() { return { results: [] }; },
  mounted() {
    api.get('/results').then(res => this.results = res.data);
  },
  methods: {
    getScoreClass(score, max) {
      const percentage = (score / max) * 100;
      if (percentage >= 80) return 'good';
      if (percentage >= 50) return 'average';
      return 'poor';
    }
  }
};
</script>

<style scoped>
.title-lg { font-size: 1.5rem; margin-bottom: 20px; }
.table-container { background: white; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); overflow: hidden; }
.styled-table { width: 100%; border-collapse: collapse; }
.styled-table th { background: #f8f9fa; padding: 15px; text-align: left; font-weight: 600; color: #555; }
.styled-table td { padding: 15px; border-bottom: 1px solid #eee; }
.score-badge { padding: 4px 10px; border-radius: 12px; font-weight: 600; font-size: 0.9rem; }
.score-badge.good { background: #e8f5e9; color: #2e7d32; }
.score-badge.average { background: #fff8e1; color: #fbc02d; }
.score-badge.poor { background: #ffebee; color: #c62828; }
</style>
