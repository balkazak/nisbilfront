<template>
  <div class="analytics-root fade-in">
    <!-- DETAIL VIEW: Topic Analysis for a Specific Test Result -->
    <div v-if="selectedResultId">
      <div class="analytics-top-bar">
        <button type="button" class="btn-back-analytics" @click="backToList">
          &larr; {{ t("testAnalytics.backToList") }}
        </button>
        <button
          v-if="detailData && detailData.questionsReview?.length"
          type="button"
          class="btn-review-all"
          @click="openAllQuestionsModal"
        >
          📝 {{ t("testAnalytics.allQuestionsReview") }}
        </button>
      </div>

      <div v-if="loadingDetail" class="analytics-loading card">
        <div class="spinner"></div>
      </div>

      <div v-else-if="detailData" class="analysis-content">
        <!-- Title & Summary Header -->
        <div class="analysis-hero card">
          <div class="analysis-hero-left">
            <h2 class="analysis-page-title">
              {{ t("testAnalytics.topicAnalysisTitle") }}
            </h2>
            <div class="analysis-test-meta">
              <span class="analysis-test-name">{{ detailData.Test?.title || t("dashboard.test") }}</span>
              <span v-if="detailData.category === 'nis'" class="badge-nis">НИШ</span>
              <span v-else-if="detailData.category === 'bil'" class="badge-bil">БИЛ</span>
              <span class="analysis-date">
                📅 {{ formatDate(detailData.completed_at || detailData.createdAt) }}
              </span>
            </div>
          </div>

          <div class="analysis-summary-pills">
            <div class="summary-metric">
              <span class="metric-label">{{ t("testAnalytics.scoreLabel") }}</span>
              <span class="metric-value primary">{{ detailData.score }} / {{ detailData.max_score }}</span>
            </div>
            <div class="summary-metric">
              <span class="metric-label">{{ t("testAnalytics.accuracyLabel") }}</span>
              <span class="metric-value" :class="getPercentTextClass(overallAccuracy)">
                {{ overallAccuracy }}%
              </span>
            </div>
            <div class="summary-metric">
              <span class="metric-label">{{ t("testAnalytics.correctLabel") }}</span>
              <span class="metric-value text-green">{{ totalCorrect }}</span>
            </div>
            <div class="summary-metric">
              <span class="metric-label">{{ t("testAnalytics.wrongLabel") }}</span>
              <span class="metric-value text-red">{{ totalWrong }}</span>
            </div>
          </div>
        </div>

        <!-- Weak Topics Highlight Card -->
        <div
          v-if="topicAnalysis.length > 0"
          class="weak-topics-card card"
          :class="{ 'all-strong': weakTopics.length === 0 }"
        >
          <div class="weak-header">
            <span class="weak-icon">{{ weakTopics.length > 0 ? "🎯" : "🏆" }}</span>
            <h4>{{ t("testAnalytics.weakTopicsTitle") }}</h4>
          </div>
          <div v-if="weakTopics.length > 0" class="weak-chips">
            <button
              v-for="item in weakTopics"
              :key="'weak-' + item.subcategoryId"
              type="button"
              class="weak-chip"
              @click="openTopicQuestions(item, item.categoryName)"
            >
              <span class="weak-chip-name">{{ getLocalizedName(item) }}</span>
              <span class="weak-chip-pct">{{ item.percentage }}%</span>
            </button>
          </div>
          <p v-else class="weak-empty-text">
            {{ t("testAnalytics.weakTopicsEmpty") }}
          </p>
        </div>

        <!-- Filter & Sort Bar -->
        <div v-if="topicAnalysis.length > 0" class="analysis-toolbar">
          <div class="filter-group">
            <button
              type="button"
              class="toolbar-pill"
              :class="{ active: topicFilter === 'all' }"
              @click="topicFilter = 'all'"
            >
              {{ t("testAnalytics.filterAll") }}
            </button>
            <button
              type="button"
              class="toolbar-pill pill-danger"
              :class="{ active: topicFilter === 'weak' }"
              @click="topicFilter = 'weak'"
            >
              {{ t("testAnalytics.filterWeak") }} ({{ weakTopics.length }})
            </button>
          </div>

          <div class="sort-group">
            <button
              type="button"
              class="toolbar-pill"
              :class="{ active: topicSort === 'strong' }"
              @click="topicSort = 'strong'"
            >
              ↓ {{ t("testAnalytics.sortStrongFirst") }}
            </button>
            <button
              type="button"
              class="toolbar-pill"
              :class="{ active: topicSort === 'weak' }"
              @click="topicSort = 'weak'"
            >
              ↑ {{ t("testAnalytics.sortWeakFirst") }}
            </button>
          </div>
        </div>

        <!-- Category Tables (Matching Reference Design) -->
        <div v-if="filteredTopicGroups.length > 0" class="category-sections">
          <div
            v-for="group in filteredTopicGroups"
            :key="group.categoryId"
            class="category-block card"
          >
            <div class="category-block-header">
              <h3 class="category-section-title">{{ getLocalizedName(group) }}</h3>
              <span class="category-avg-badge" :class="getBadgeClass(group.percentage)">
                {{ group.correctCount }}/{{ group.totalQuestions }} ({{ group.percentage }}%)
              </span>
            </div>

            <div class="topic-table-wrap">
              <table class="topic-table">
                <thead>
                  <tr>
                    <th class="col-idx">#</th>
                    <th class="col-topic">{{ t("testAnalytics.thTopic") }}</th>
                    <th class="col-num">{{ t("testAnalytics.thQuestions") }}</th>
                    <th class="col-num">{{ t("testAnalytics.thCorrect") }}</th>
                    <th class="col-num">{{ t("testAnalytics.thWrong") }}</th>
                    <th class="col-bar">{{ t("testAnalytics.thPercent") }}</th>
                    <th class="col-action"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(sub, sIdx) in group.subcategories"
                    :key="sub.subcategoryId"
                    class="topic-row"
                    @click="openTopicQuestions(sub, getLocalizedName(group))"
                  >
                    <td class="col-idx font-bold">{{ sIdx + 1 }}</td>
                    <td class="col-topic">{{ getLocalizedName(sub) }}</td>
                    <td class="col-num">{{ sub.total }}</td>
                    <td class="col-num text-green font-semibold">{{ sub.correct }}</td>
                    <td class="col-num text-red font-semibold">{{ sub.wrong }}</td>
                    <td class="col-bar">
                      <div class="progress-bar-track">
                        <div
                          class="progress-bar-striped"
                          :class="getBarColorClass(sub.percentage)"
                          :style="{ width: sub.percentage > 0 ? sub.percentage + '%' : '0%' }"
                        >
                          <span v-if="sub.percentage >= 18" class="bar-pct-inside">
                            {{ sub.percentage }}%
                          </span>
                        </div>
                        <span v-if="sub.percentage < 18" class="bar-pct-outside" :class="{ 'is-zero': sub.percentage === 0 }">
                          {{ sub.percentage }}%
                        </span>
                      </div>
                    </td>
                    <td class="col-action">
                      <button
                        type="button"
                        class="btn-row-arrow"
                        :title="t('testAnalytics.viewTopicQuestions')"
                        @click.stop="openTopicQuestions(sub, getLocalizedName(group))"
                      >
                        &rarr;
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div v-else class="empty-analytics card">
          <p>{{ t("testAnalytics.noTopicData") }}</p>
        </div>
      </div>
    </div>

    <!-- LIST VIEW: Student's Standalone Test Results History -->
    <div v-else>
      <div class="list-header">
        <div>
          <h2 class="title-lg">{{ t("testAnalytics.pageTitle") }}</h2>
          <p class="subtitle-text">{{ t("testAnalytics.pageSubtitle") }}</p>
        </div>
      </div>

      <div v-if="loadingList" class="analytics-loading card">
        <div class="spinner"></div>
      </div>

      <div v-else-if="results.length === 0" class="empty-state card">
        <div class="empty-icon">📊</div>
        <h3>{{ t("testAnalytics.emptyTitle") }}</h3>
        <p>{{ t("testAnalytics.emptySubtitle") }}</p>
        <button type="button" class="btn-primary mt-4" @click="emit('go-to-tests')">
          {{ t("testAnalytics.goToTests") }}
        </button>
      </div>

      <div v-else class="results-cards-list">
        <div
          v-for="item in results"
          :key="item.id"
          class="result-history-card card"
          @click="openResultDetail(item.id)"
        >
          <div class="rh-main">
            <div class="rh-title-row">
              <h3 class="rh-title">{{ item.Test?.title || t("dashboard.test") }}</h3>
              <span v-if="item.Test?.category === 'nis'" class="badge-nis">НИШ</span>
              <span v-else-if="item.Test?.category === 'bil'" class="badge-bil">БИЛ</span>
            </div>
            <div class="rh-meta-row">
              <span>📅 {{ formatDate(item.completed_at || item.createdAt) }}</span>
              <span v-if="item.totalQuestions > 0">
                📝 {{ t("testAnalytics.questionsCount") }}: <strong>{{ item.totalQuestions }}</strong>
              </span>
              <span v-if="item.totalQuestions > 0" class="text-green">
                ✅ {{ item.correctCount }}
              </span>
              <span v-if="item.totalQuestions > 0" class="text-red">
                ❌ {{ item.wrongCount }}
              </span>
            </div>
          </div>

          <div class="rh-right">
            <div class="rh-score-block">
              <span class="rh-score">{{ item.score }} / {{ item.max_score }}</span>
              <span class="rh-pct-pill" :class="getBadgeClass(item.percentage)">
                {{ item.percentage }}%
              </span>
            </div>
            <button type="button" class="btn-open-analysis">
              📊 {{ t("testAnalytics.openAnalysis") }} &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Questions Review for a Selected Topic or All Questions -->
    <div
      v-if="showQuestionsModal"
      class="modal-overlay"
      @click.self="showQuestionsModal = false"
    >
      <div class="card modal-topic-review">
        <div class="modal-topic-header">
          <div>
            <span v-if="modalTopicCategory" class="modal-cat-tag">{{ modalTopicCategory }}</span>
            <h3>{{ modalTitle }}</h3>
          </div>
          <button type="button" class="btn-close-modal" @click="showQuestionsModal = false">
            &times;
          </button>
        </div>

        <div class="modal-questions-list">
          <div
            v-for="(q, qIdx) in modalQuestions"
            :key="q.id"
            class="review-q-card"
            :class="{
              'is-correct': q.isCorrect,
              'is-wrong': !q.isCorrect && q.userAnswer !== null,
              'is-skipped': q.userAnswer === null
            }"
          >
            <div class="review-q-top">
              <span class="review-q-num">{{ t("testRunner.question") }} #{{ q.order || qIdx + 1 }}</span>
              <span v-if="q.isCorrect" class="q-status-pill ok">✅ {{ t("testRunner.correctStatus") }}</span>
              <span v-else-if="q.userAnswer !== null" class="q-status-pill err">❌ {{ t("testRunner.errorStatus") }}</span>
              <span v-else class="q-status-pill warn">⚠️ {{ t("testRunner.notAnsweredStatus") }}</span>
            </div>

            <p class="review-q-text">{{ q.text }}</p>
            <div v-if="q.image_url" class="review-q-img-wrap">
              <img :src="q.image_url" class="review-q-img" alt="Question" />
            </div>

            <div class="review-opts">
              <div
                v-for="(opt, oIdx) in q.options"
                :key="oIdx"
                class="review-opt-row"
                :class="{
                  'opt-correct': oIdx === q.correct_option_index,
                  'opt-user-wrong': oIdx === q.userAnswer && !q.isCorrect
                }"
              >
                <span class="opt-letter">
                  <template v-if="oIdx === q.correct_option_index">✓</template>
                  <template v-else-if="oIdx === q.userAnswer && !q.isCorrect">✕</template>
                  <template v-else>{{ String.fromCharCode(65 + oIdx) }}</template>
                </span>
                <div class="opt-body">
                  <span v-if="opt.text">{{ opt.text }}</span>
                  <img v-if="opt.image_url" :src="opt.image_url" class="opt-img" alt="Option" />
                </div>
                <span
                  v-if="oIdx === q.correct_option_index && oIdx === q.userAnswer"
                  class="opt-tag tag-ok"
                >
                  {{ t("testRunner.yourCorrectAnswerBadge") }}
                </span>
                <span
                  v-else-if="oIdx === q.correct_option_index"
                  class="opt-tag tag-ok"
                >
                  {{ t("testRunner.correctAnswerBadge") }}
                </span>
                <span
                  v-else-if="oIdx === q.userAnswer && !q.isCorrect"
                  class="opt-tag tag-err"
                >
                  {{ t("testRunner.yourWrongAnswerBadge") }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-topic-footer">
          <button type="button" class="btn-primary" @click="showQuestionsModal = false">
            {{ t("testAnalytics.close") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import api from "../api";
import { useLanguage } from "../composables/useLanguage";
import { useToast } from "../composables/useToast";

const props = defineProps({
  initialResultId: {
    type: [Number, String],
    default: null,
  },
});

const emit = defineEmits(["go-to-tests", "clear-initial"]);

const { t, currentLang } = useLanguage();
const toast = useToast();

const results = ref([]);
const loadingList = ref(false);

const selectedResultId = ref(props.initialResultId || null);
const detailData = ref(null);
const loadingDetail = ref(false);

const topicFilter = ref("all"); // 'all' | 'weak'
const topicSort = ref("strong"); // 'strong' | 'weak'

const showQuestionsModal = ref(false);
const modalTitle = ref("");
const modalTopicCategory = ref("");
const modalQuestions = ref([]);

const getLocalizedName = (item) => {
  if (!item) return "";
  return currentLang.value === "kk"
    ? item.name_kk || item.name_ru || ""
    : item.name_ru || item.name_kk || "";
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleString(currentLang.value === "kk" ? "kk-KZ" : "ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const fetchResultsList = async () => {
  loadingList.value = true;
  try {
    const res = await api.get("/results/me?standalone=true");
    results.value = Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  } finally {
    loadingList.value = false;
  }
};

const openResultDetail = async (resultId) => {
  selectedResultId.value = resultId;
  loadingDetail.value = true;
  detailData.value = null;
  topicFilter.value = "all";
  topicSort.value = "strong";
  try {
    const res = await api.get(`/results/${resultId}/review`);
    detailData.value = res.data;
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
    selectedResultId.value = null;
  } finally {
    loadingDetail.value = false;
  }
};

const backToList = () => {
  selectedResultId.value = null;
  detailData.value = null;
  emit("clear-initial");
  fetchResultsList();
};

const topicAnalysis = computed(() => {
  return detailData.value?.topicAnalysis || [];
});

const totalCorrect = computed(() => {
  const list = detailData.value?.questionsReview || [];
  return list.filter((q) => q.isCorrect).length;
});

const totalWrong = computed(() => {
  const list = detailData.value?.questionsReview || [];
  return list.filter((q) => !q.isCorrect).length;
});

const overallAccuracy = computed(() => {
  const total = totalCorrect.value + totalWrong.value;
  if (total === 0) return 0;
  return Math.round((totalCorrect.value / total) * 100);
});

const weakTopics = computed(() => {
  const list = [];
  for (const cat of topicAnalysis.value) {
    for (const sub of cat.subcategories || []) {
      if (sub.percentage < 50) {
        list.push({
          ...sub,
          categoryName: getLocalizedName(cat),
        });
      }
    }
  }
  return list.sort((a, b) => a.percentage - b.percentage || b.wrong - a.wrong);
});

const filteredTopicGroups = computed(() => {
  return topicAnalysis.value
    .map((group) => {
      let subs = [...(group.subcategories || [])];
      if (topicFilter.value === "weak") {
        subs = subs.filter((s) => s.percentage < 50);
      }
      if (topicSort.value === "weak") {
        subs.sort((a, b) => a.percentage - b.percentage || b.wrong - a.wrong);
      } else {
        subs.sort((a, b) => b.percentage - a.percentage || b.total - a.total);
      }
      return {
        ...group,
        subcategories: subs,
      };
    })
    .filter((group) => group.subcategories.length > 0);
});

const getBarColorClass = (pct) => {
  if (pct >= 75) return "bar-green";
  if (pct >= 40) return "bar-yellow";
  if (pct > 0) return "bar-red";
  return "bar-zero";
};

const getBadgeClass = (pct) => {
  if (pct >= 75) return "badge-green";
  if (pct >= 40) return "badge-yellow";
  return "badge-red";
};

const getPercentTextClass = (pct) => {
  if (pct >= 75) return "text-green";
  if (pct >= 40) return "text-amber";
  return "text-red";
};

const openTopicQuestions = (sub, categoryName) => {
  const allQ = detailData.value?.questionsReview || [];
  const idSet = new Set(sub.questionIds || []);
  modalQuestions.value = allQ.filter(
    (q) => idSet.has(q.id) || q.subcategoryId === sub.subcategoryId,
  );
  modalTopicCategory.value = categoryName || "";
  modalTitle.value = `${getLocalizedName(sub)} (${sub.correct}/${sub.total} — ${sub.percentage}%)`;
  showQuestionsModal.value = true;
};

const openAllQuestionsModal = () => {
  modalQuestions.value = detailData.value?.questionsReview || [];
  modalTopicCategory.value = detailData.value?.Test?.title || "";
  modalTitle.value = t("testAnalytics.allQuestionsReview");
  showQuestionsModal.value = true;
};

watch(
  () => props.initialResultId,
  (newId) => {
    if (newId) {
      openResultDetail(newId);
    }
  },
);

onMounted(() => {
  if (props.initialResultId) {
    openResultDetail(props.initialResultId);
  } else {
    fetchResultsList();
  }
});
</script>

<style scoped>
.analytics-root {
  max-width: 1120px;
  margin: 0 auto;
}

.list-header {
  margin-bottom: 22px;
}
.title-lg {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 6px;
}
.subtitle-text {
  color: #64748b;
  margin: 0;
  font-size: 0.95rem;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.05);
  border: 1px solid #f1f5f9;
}

.analytics-loading {
  padding: 50px;
  display: flex;
  justify-content: center;
}
.spinner {
  width: 36px;
  height: 36px;
  border: 4px solid #f1f5f9;
  border-top-color: #ff2e93;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Empty State */
.empty-state {
  padding: 56px 24px;
  text-align: center;
}
.empty-icon {
  font-size: 3.2rem;
  margin-bottom: 12px;
}
.empty-state h3 {
  margin: 0 0 8px;
  color: #1e293b;
  font-size: 1.25rem;
}
.empty-state p {
  color: #64748b;
  margin: 0;
}

/* Results History Cards */
.results-cards-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.result-history-card {
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}
.result-history-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  border-color: #fbcfe8;
}
.rh-main {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.rh-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.rh-title {
  margin: 0;
  font-size: 1.12rem;
  font-weight: 700;
  color: #0f172a;
}
.rh-meta-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 0.88rem;
  color: #64748b;
}
.rh-right {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-shrink: 0;
}
.rh-score-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}
.rh-score {
  font-size: 1.05rem;
  font-weight: 800;
  color: #1e293b;
}
.rh-pct-pill {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
}
.btn-open-analysis {
  background: linear-gradient(135deg, #ff2e93, #ff007a);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(255, 46, 147, 0.25);
  transition: opacity 0.2s;
}
.btn-open-analysis:hover {
  opacity: 0.92;
}

/* Top Bar in Detail Mode */
.analytics-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}
.btn-back-analytics {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #334155;
  padding: 9px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-back-analytics:hover {
  border-color: #ff2e93;
  color: #ff2e93;
}
.btn-review-all {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  color: #1e293b;
  padding: 9px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-review-all:hover {
  background: #eef2ff;
  border-color: #818cf8;
  color: #3730a3;
}

/* Analysis Hero Header */
.analysis-hero {
  padding: 22px 26px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}
.analysis-page-title {
  margin: 0 0 8px;
  font-size: 1.6rem;
  font-weight: 800;
  color: #d97706;
}
.analysis-test-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.analysis-test-name {
  font-weight: 700;
  color: #0f172a;
  font-size: 1.05rem;
}
.analysis-date {
  color: #64748b;
  font-size: 0.88rem;
}
.analysis-summary-pills {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.summary-metric {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 88px;
}
.metric-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}
.metric-value {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f172a;
}
.metric-value.primary {
  color: #ff2e93;
}

/* Weak Topics Highlight Card */
.weak-topics-card {
  padding: 16px 22px;
  margin-bottom: 18px;
  border-left: 5px solid #ef4444;
  background: #fff8f8;
}
.weak-topics-card.all-strong {
  border-left-color: #16a34a;
  background: #f0fdf4;
}
.weak-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.weak-header h4 {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 700;
  color: #1e293b;
}
.weak-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.weak-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid #fecaca;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 0.83rem;
  font-weight: 600;
  color: #991b1b;
  cursor: pointer;
  transition: all 0.18s;
}
.weak-chip:hover {
  background: #fee2e2;
}
.weak-chip-pct {
  background: #dc2626;
  color: #ffffff;
  border-radius: 999px;
  padding: 2px 7px;
  font-size: 0.74rem;
  font-weight: 800;
}
.weak-empty-text {
  margin: 0;
  color: #166534;
  font-weight: 600;
  font-size: 0.92rem;
}

/* Filter & Sort Toolbar */
.analysis-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}
.filter-group,
.sort-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.toolbar-pill {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 7px 14px;
  font-size: 0.84rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.18s;
}
.toolbar-pill:hover {
  border-color: #94a3b8;
}
.toolbar-pill.active {
  background: #0d9488;
  color: #ffffff;
  border-color: #0d9488;
}
.toolbar-pill.pill-danger.active {
  background: #dc2626;
  border-color: #dc2626;
}

/* Category Section Tables (Reference Design) */
.category-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.category-block {
  padding: 20px 24px;
  overflow: hidden;
}
.category-block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
.category-section-title {
  margin: 0;
  font-size: 1.28rem;
  font-weight: 800;
  color: #0d9488;
}
.category-avg-badge {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 800;
}

.topic-table-wrap {
  width: 100%;
  overflow-x: auto;
}
.topic-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;
}
.topic-table th {
  text-align: left;
  font-size: 0.82rem;
  font-weight: 700;
  color: #334155;
  padding: 10px 12px;
  border-bottom: 2px solid #e2e8f0;
  background: #ffffff;
}
.topic-table td {
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.9rem;
  color: #334155;
  vertical-align: middle;
}
.topic-row {
  cursor: pointer;
  transition: background 0.15s;
}
.topic-row:nth-child(even) {
  background: #f8fafc;
}
.topic-row:hover {
  background: #f0fdfa;
}
.col-idx {
  width: 42px;
  color: #0f172a;
}
.col-topic {
  min-width: 220px;
  font-weight: 500;
  color: #1e293b;
}
.col-num {
  width: 96px;
  text-align: center !important;
}
.col-bar {
  width: 34%;
  min-width: 180px;
}
.col-action {
  width: 48px;
  text-align: right !important;
}

/* Striped Progress Bar (matching screenshots) */
.progress-bar-track {
  position: relative;
  width: 100%;
  height: 18px;
  background: #edf2f7;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.progress-bar-striped {
  height: 100%;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.45s ease;
  background-image: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.18) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.18) 50%,
    rgba(255, 255, 255, 0.18) 75%,
    transparent 75%,
    transparent
  );
  background-size: 16px 16px;
}
.bar-green {
  background-color: #43a047;
}
.bar-yellow {
  background-color: #f5b82e;
}
.bar-red {
  background-color: #dc3545;
}
.bar-zero {
  width: 4px !important;
  background-color: #dc3545;
  border-radius: 6px 0 0 6px;
}
.bar-pct-inside {
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 800;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
  white-space: nowrap;
}
.bar-pct-outside {
  margin-left: 8px;
  font-size: 0.74rem;
  font-weight: 800;
  color: #dc2626;
}
.bar-pct-outside.is-zero {
  color: #991b1b;
}

.btn-row-arrow {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: none;
  background: #28a745;
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s, transform 0.15s;
}
.btn-row-arrow:hover {
  background: #218838;
  transform: translateX(2px);
}

/* Badges & Helpers */
.badge-green {
  background: #dcfce7;
  color: #166534;
}
.badge-yellow {
  background: #fef3c7;
  color: #92400e;
}
.badge-red {
  background: #fee2e2;
  color: #991b1b;
}
.badge-nis {
  background: #ede9fe;
  color: #5b21b6;
  border: 1px solid #c4b5fd;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.74rem;
  font-weight: 800;
}
.badge-bil {
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.74rem;
  font-weight: 800;
}
.text-green {
  color: #16a34a;
}
.text-amber {
  color: #d97706;
}
.text-red {
  color: #dc2626;
}
.font-bold {
  font-weight: 700;
}
.font-semibold {
  font-weight: 600;
}

.empty-analytics {
  padding: 36px;
  text-align: center;
  color: #64748b;
}

/* Topic Questions Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
}
.modal-topic-review {
  width: 100%;
  max-width: 780px;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow: hidden;
}
.modal-topic-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 16px;
}
.modal-topic-header h3 {
  margin: 4px 0 0;
  font-size: 1.15rem;
  color: #0f172a;
}
.modal-cat-tag {
  display: inline-block;
  font-size: 0.74rem;
  font-weight: 700;
  color: #0d9488;
  background: #f0fdfa;
  border: 1px solid #99f6e4;
  padding: 2px 8px;
  border-radius: 6px;
}
.btn-close-modal {
  background: none;
  border: none;
  font-size: 1.6rem;
  line-height: 1;
  color: #64748b;
  cursor: pointer;
}
.modal-questions-list {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-right: 4px;
}
.review-q-card {
  border: 1px solid #e2e8f0;
  border-left: 5px solid #94a3b8;
  border-radius: 12px;
  padding: 16px;
  background: #ffffff;
}
.review-q-card.is-correct {
  border-left-color: #16a34a;
}
.review-q-card.is-wrong {
  border-left-color: #dc2626;
}
.review-q-card.is-skipped {
  border-left-color: #f59e0b;
}
.review-q-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.review-q-num {
  font-size: 0.8rem;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
}
.q-status-pill {
  font-size: 0.78rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
}
.q-status-pill.ok {
  background: #dcfce7;
  color: #166534;
}
.q-status-pill.err {
  background: #fee2e2;
  color: #991b1b;
}
.q-status-pill.warn {
  background: #fef3c7;
  color: #92400e;
}
.review-q-text {
  margin: 0 0 12px;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.5;
}
.review-q-img-wrap {
  margin-bottom: 12px;
}
.review-q-img {
  max-width: 100%;
  max-height: 280px;
  border-radius: 8px;
  object-fit: contain;
}
.review-opts {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.review-opt-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}
.review-opt-row.opt-correct {
  border: 2px solid #16a34a;
  background: #f0fdf4;
  color: #166534;
  font-weight: 600;
}
.review-opt-row.opt-user-wrong {
  border: 2px solid #dc2626;
  background: #fef2f2;
  color: #991b1b;
  font-weight: 600;
}
.opt-letter {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #334155;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 800;
  flex-shrink: 0;
}
.opt-correct .opt-letter {
  background: #16a34a;
  color: #ffffff;
}
.opt-user-wrong .opt-letter {
  background: #dc2626;
  color: #ffffff;
}
.opt-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.opt-img {
  max-height: 110px;
  object-fit: contain;
  border-radius: 6px;
}
.opt-tag {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
  white-space: nowrap;
}
.tag-ok {
  background: #dcfce7;
  color: #166534;
}
.tag-err {
  background: #fee2e2;
  color: #991b1b;
}
.modal-topic-footer {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .result-history-card {
    flex-direction: column;
    align-items: flex-start;
  }
  .rh-right {
    width: 100%;
    justify-content: space-between;
  }
  .rh-score-block {
    align-items: flex-start;
  }
  .analysis-hero {
    padding: 18px;
  }
  .category-block {
    padding: 16px;
  }
}
</style>

