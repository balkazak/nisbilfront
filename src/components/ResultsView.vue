<template>
  <div>
    <h2 class="title-lg">{{ t("resultsView.title") }}</h2>
    <div class="table-container header-section">
      <table class="styled-table">
        <thead>
          <tr>
            <th>{{ t("resultsView.thStudent") }}</th>
            <th>{{ t("resultsView.thTest") }}</th>
            <th>{{ t("resultsView.thType") }}</th>
            <th>{{ t("resultsView.thScore") }}</th>
            <th>{{ t("resultsView.thDate") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in results" :key="r.id">
            <td>
              {{ r.User ? r.User.username : t("resultsView.unknownUser") }}
            </td>
            <td>{{ r.Test ? r.Test.title : t("resultsView.deletedTest") }}</td>
            <td>
              <span v-if="r.Test" class="category-tag" :class="r.Test.category">
                {{ r.Test.category === "bil" ? "BIL" : "Standard" }}
              </span>
              <span v-else>-</span>
            </td>
            <td>
              <span
                class="score-badge"
                :class="getScoreClass(r.score, r.max_score)"
              >
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

<script setup>
import { ref, onMounted } from "vue";
import api from "../api";
import { useLanguage } from "../composables/useLanguage";

const { t } = useLanguage();
const results = ref([]);

const getScoreClass = (score, max) => {
  if (max === 0) return "poor";
  const percentage = (score / max) * 100;
  if (percentage >= 80) return "good";
  if (percentage >= 50) return "average";
  return "poor";
};

onMounted(async () => {
  const res = await api.get("/results");
  results.value = res.data;
});
</script>

<style scoped>
.title-lg {
  font-size: 1.5rem;
  margin-bottom: 20px;
}
.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}
.styled-table {
  width: 100%;
  border-collapse: collapse;
}
.styled-table th {
  background: #f8f9fa;
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #555;
}
.styled-table td {
  padding: 15px;
  border-bottom: 1px solid #eee;
}
.score-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
}
.score-badge.good {
  background: #e8f5e9;
  color: #2e7d32;
}
.score-badge.average {
  background: #fff8e1;
  color: #fbc02d;
}
.score-badge.poor {
  background: #ffebee;
  color: #c62828;
}

.category-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
}

.category-tag.bil {
  background: #fff1f2;
  color: #be123c;
  border: 1px solid #fecdd3;
}

.category-tag.standard {
  background: #f0f9ff;
  color: #0369a1;
  border: 1px solid #bae6fd;
}
</style>
