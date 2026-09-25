<template>
  <div class="test-runner-container">
    <!-- Result Screen -->
    <div v-if="showResult" class="result-screen animate-fade-in">
      <div class="result-container">
        <!-- Top Score Summary Card -->
        <div class="result-card">
          <div class="result-icon">🏆</div>
          <h2>{{ t("testRunner.completed") }}</h2>
          <p class="result-subtitle">{{ t("testRunner.yourResult") }}</p>
          <div class="score-display">
            <span class="score-value">{{ resultData.score }}</span>
            <span class="score-total">/ {{ resultData.max_score }}</span>
          </div>
          <p class="motivational-text" v-if="percentage >= 80">
            {{ t("testRunner.excellent") }}
          </p>
          <p class="motivational-text" v-else-if="percentage >= 50">
            {{ t("testRunner.good") }}
          </p>
          <p class="motivational-text" v-else>{{ t("testRunner.improve") }}</p>

          <div v-if="resultData.earnedCoins" class="earned-coins animate-fade-in">
            <span class="coin-ani">+{{ resultData.earnedCoins }} 🟡</span>
            <p>
              {{
                format(t("testRunner.earnedCoins"), {
                  coins: resultData.earnedCoins,
                })
              }}
            </p>
          </div>

          <!-- Quick Stat Pills -->
          <div class="review-stats-grid">
            <div class="stat-pill stat-correct">
              <span class="stat-icon">✅</span>
              <div class="stat-text">
                <span class="stat-count">{{ correctCount }}</span>
                <span class="stat-label">{{ t("testRunner.correctCount") }}</span>
              </div>
            </div>
            <div class="stat-pill stat-error">
              <span class="stat-icon">❌</span>
              <div class="stat-text">
                <span class="stat-count">{{ errorCount }}</span>
                <span class="stat-label">{{ t("testRunner.errorCount") }}</span>
              </div>
            </div>
            <div class="stat-pill stat-unanswered">
              <span class="stat-icon">⚠️</span>
              <div class="stat-text">
                <span class="stat-count">{{ unansweredCount }}</span>
                <span class="stat-label">{{ t("testRunner.unansweredCount") }}</span>
              </div>
            </div>
          </div>

          <div class="flex gap-4 justify-center mt-6">
            <button @click="finish" class="btn-primary btn-lg">
              {{
                isStandalone
                  ? t("testRunner.backToStandalone")
                  : t("testRunner.backToLesson")
              }}
            </button>
          </div>
        </div>

        <!-- Detailed Questions Breakdown & Answers -->
        <div v-if="questionsReview.length > 0" class="review-section mt-8">
          <div class="review-header">
            <h3 class="review-title">📝 {{ t("testRunner.reviewTitle") }}</h3>
            <!-- Filter Pills -->
            <div class="review-filters">
              <button
                type="button"
                class="filter-pill"
                :class="{ active: reviewFilter === 'all' }"
                @click="reviewFilter = 'all'"
              >
                {{ t("testRunner.allQuestions") }} ({{ questionsReview.length }})
              </button>
              <button
                type="button"
                class="filter-pill filter-pill-error"
                :class="{ active: reviewFilter === 'errors' }"
                @click="reviewFilter = 'errors'"
              >
                ❌ {{ t("testRunner.onlyErrors") }} ({{ errorCount }})
              </button>
              <button
                type="button"
                class="filter-pill filter-pill-correct"
                :class="{ active: reviewFilter === 'correct' }"
                @click="reviewFilter = 'correct'"
              >
                ✅ {{ t("testRunner.onlyCorrect") }} ({{ correctCount }})
              </button>
            </div>
          </div>

          <!-- Question Cards -->
          <div class="review-list">
            <div
              v-for="(q, qIndex) in filteredQuestionsReview"
              :key="q.id"
              class="review-card"
              :class="{
                'status-correct': q.isCorrect,
                'status-error': !q.isCorrect && q.userAnswer !== null,
                'status-unanswered': q.userAnswer === null
              }"
            >
              <div class="review-card-header">
                <div class="review-q-title">
                  <span class="review-q-num">Вопрос #{{ q.order || qIndex + 1 }}</span>
                  <span
                    v-if="test.category === 'nis' || q.question_type"
                    class="nis-badge"
                    :class="q.question_type === 'sandyk_sippattama' ? 'badge-sandyk' : 'badge-standard'"
                  >
                    {{ q.question_type === 'sandyk_sippattama' ? '📗 ' + (t("testManagement.questionTypeSandyk") || 'Сандық сипаттама (+5)') : '📘 ' + (t("testManagement.questionTypeStandard") || 'Стандарт (+10)') }}
                  </span>
                </div>
                <div class="review-status-badge">
                  <span v-if="q.isCorrect" class="badge-status badge-success">
                    ✅ {{ t("testRunner.correctStatus") }} (+{{ getQuestionScore(q) }})
                  </span>
                  <span v-else-if="q.userAnswer !== null" class="badge-status badge-danger">
                    ❌ {{ t("testRunner.errorStatus") }} {{ test.category === 'bil' ? '(-1)' : '' }}
                  </span>
                  <span v-else class="badge-status badge-warning">
                    ⚠️ {{ t("testRunner.notAnsweredStatus") }}
                  </span>
                </div>
              </div>

              <!-- Question Content -->
              <p class="review-q-text">{{ q.text }}</p>
              <div v-if="q.image_url" class="review-image-wrap">
                <img :src="q.image_url" class="review-q-image" alt="Question Image" />
              </div>

              <!-- Options Review -->
              <div class="review-options-list">
                <div
                  v-for="(opt, optIdx) in q.options"
                  :key="optIdx"
                  class="review-option"
                  :class="{
                    'is-correct-target': optIdx === q.correct_option_index,
                    'is-user-wrong': optIdx === q.userAnswer && !q.isCorrect,
                    'is-user-correct': optIdx === q.userAnswer && q.isCorrect
                  }"
                >
                  <div class="option-marker">
                    <span v-if="optIdx === q.correct_option_index">✓</span>
                    <span v-else-if="optIdx === q.userAnswer && !q.isCorrect">✕</span>
                    <span v-else>{{ String.fromCharCode(65 + optIdx) }}</span>
                  </div>

                  <div class="review-opt-body">
                    <span v-if="opt.text" class="review-opt-text">{{ opt.text }}</span>
                    <img v-if="opt.image_url" :src="opt.image_url" class="review-opt-image" alt="Option Image" />
                  </div>

                  <!-- Tag labels -->
                  <div class="review-option-tag">
                    <span
                      v-if="optIdx === q.correct_option_index && optIdx === q.userAnswer"
                      class="tag-pill tag-correct"
                    >
                      ✓ {{ t("testRunner.yourCorrectAnswerBadge") }}
                    </span>
                    <span
                      v-else-if="optIdx === q.correct_option_index"
                      class="tag-pill tag-correct"
                    >
                      ✓ {{ t("testRunner.correctAnswerBadge") }}
                    </span>
                    <span
                      v-else-if="optIdx === q.userAnswer && !q.isCorrect"
                      class="tag-pill tag-wrong"
                    >
                      ✕ {{ t("testRunner.yourWrongAnswerBadge") }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Finish Action -->
          <div class="flex justify-center mt-8 pb-10">
            <button @click="finish" class="btn-primary btn-lg">
              {{
                isStandalone
                  ? t("testRunner.backToStandalone")
                  : t("testRunner.backToLesson")
              }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Test Taking Screen -->
    <div v-else class="test-content">
      <div class="header sticky-header">
        <div class="flex justify-between items-center mb-2 header-top">
          <h3 class="test-title">{{ test.title }}</h3>
          <div class="flex gap-3 align-center">
            <div v-if="test.category === 'bil'" class="scoring-info desktop-only">
              {{ t("testRunner.scoringBIL") }}
            </div>
            <div v-else-if="test.category === 'nis'" class="scoring-info scoring-nis desktop-only">
              {{ t("testRunner.scoringNIS") }}
            </div>
            <div
              v-if="timeLeft !== null"
              class="timer-badge"
              :class="{ warning: timeLeft < 60 }"
            >
              ⏳ {{ formatTime(timeLeft) }}
            </div>
          </div>
        </div>

        <div v-if="test.category === 'bil'" class="scoring-info mobile-only mb-2">
          {{ t("testRunner.scoringBIL") }}
        </div>
        <div v-else-if="test.category === 'nis'" class="scoring-info scoring-nis mobile-only mb-2">
          {{ t("testRunner.scoringNIS") }}
        </div>

        <!-- Sticky Question Navigator Bar -->
        <div class="question-nav-strip" v-if="test.Questions && test.Questions.length > 0">
          <div class="nav-progress-row">
            <span class="nav-count-text">
              {{ t("testRunner.progress") }}: <strong>{{ answeredCount }}</strong> / {{ test.Questions.length }}
            </span>
            <span class="nav-pct-badge">{{ Math.round((answeredCount / (test.Questions.length || 1)) * 100) }}%</span>
          </div>
          <div class="question-chips-row">
            <button
              v-for="(q, idx) in test.Questions"
              :key="'chip-' + q.id"
              type="button"
              class="q-chip"
              :class="{
                'chip-answered': answers[q.id] !== undefined && answers[q.id] !== null,
                'chip-active': currentQuestionIndex === idx
              }"
              @click="scrollToQuestion(q.id, idx)"
            >
              {{ idx + 1 }}
            </button>
          </div>
        </div>
      </div>

      <div class="questions-list">
        <div
          v-for="(question, index) in test.Questions"
          :key="question.id"
          :id="'q_' + question.id"
          class="question-block animate-slide-up"
          :style="{ animationDelay: index * 0.03 + 's' }"
        >
          <div class="q-content">
            <div class="q-header-row">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="q-number"
                  >{{ t("testRunner.question") }} {{ index + 1 }}</span
                >
                <span
                  v-if="test.category === 'nis'"
                  class="nis-badge"
                  :class="question.question_type === 'sandyk_sippattama' ? 'badge-sandyk' : 'badge-standard'"
                >
                  {{ question.question_type === 'sandyk_sippattama' ? '📗 ' + (t("testManagement.questionTypeSandyk") || 'Сандық сипаттама (+5)') : '📘 ' + (t("testManagement.questionTypeStandard") || 'Стандарт (+10)') }}
                </span>
              </div>
              <span
                v-if="answers[question.id] !== undefined && answers[question.id] !== null"
                class="q-answered-tag"
              >
                ✓ {{ t("dashboard.submitted") || "Отвечено" }}
              </span>
            </div>
            <p class="q-text">{{ question.text }}</p>
            <div v-if="question.image_url" class="q-image-container">
              <img
                :src="question.image_url"
                class="q-image"
                alt="Question Image"
              />
            </div>
          </div>

          <div class="options-list">
            <label
              v-for="(opt, oIndex) in question.options"
              :key="oIndex"
              class="option-label"
              :class="{ selected: answers[question.id] === oIndex }"
            >
              <div class="option-letter-badge">
                {{ String.fromCharCode(65 + oIndex) }}
              </div>
              <div class="radio-wrapper">
                <input
                  type="radio"
                  :name="'q_' + question.id"
                  :value="oIndex"
                  v-model="answers[question.id]"
                />
                <div class="custom-radio"></div>
              </div>
              <div class="opt-content">
                <span v-if="opt.text" class="opt-text">{{ opt.text }}</span>
                <img
                  v-if="opt.image_url"
                  :src="opt.image_url"
                  class="opt-image"
                  alt="Option Image"
                />
              </div>
            </label>
          </div>
        </div>
      </div>

      <div class="footer-actions">
        <button @click="submitTest" class="btn-primary btn-xl">
          {{ t("testRunner.finishBtn") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import api from "../api";
import { useToast } from "../composables/useToast";
import { useLanguage } from "../composables/useLanguage";

const props = defineProps(["testId", "isStandalone"]);
const emit = defineEmits(["completed", "cancel"]);

const toast = useToast();
const { t, format } = useLanguage();

const test = ref({ Questions: [] });
const answers = ref({});
const timeLeft = ref(null);
const timer = ref(null);
const showResult = ref(false);
const resultData = ref(null);
const questionsReview = ref([]);
const reviewFilter = ref("all");
const currentQuestionIndex = ref(0);

const answeredCount = computed(() => {
  if (!test.value.Questions) return 0;
  return Object.values(answers.value).filter((val) => val !== undefined && val !== null).length;
});

const scrollToQuestion = (questionId, index) => {
  currentQuestionIndex.value = index;
  const el = document.getElementById("q_" + questionId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};

const percentage = computed(() => {
  if (!resultData.value || !resultData.value.max_score) return 0;
  return (resultData.value.score / resultData.value.max_score) * 100;
});

const correctCount = computed(() => {
  return questionsReview.value.filter((q) => q.isCorrect).length;
});

const errorCount = computed(() => {
  return questionsReview.value.filter((q) => !q.isCorrect && q.userAnswer !== null).length;
});

const unansweredCount = computed(() => {
  return questionsReview.value.filter((q) => q.userAnswer === null).length;
});

const filteredQuestionsReview = computed(() => {
  if (reviewFilter.value === "errors") {
    return questionsReview.value.filter((q) => !q.isCorrect);
  }
  if (reviewFilter.value === "correct") {
    return questionsReview.value.filter((q) => q.isCorrect);
  }
  return questionsReview.value;
});

const getQuestionScore = (q) => {
  if (q.points_awarded !== undefined) return q.points_awarded;
  if (q.question_type === 'sandyk_sippattama') return 5;
  if (test.value?.category === 'nis') return 10;
  if (test.value?.category === 'bil') return 4;
  return q.score_value || 1;
};

const formatTime = (s) => {
  const m = Math.floor(s / 60);
  const sc = s % 60;
  return `${m}:${sc < 10 ? "0" : ""}${sc}`;
};

const submitTest = async () => {
  if (timer.value) clearInterval(timer.value);

  const user = localStorage.getItem("user");

  try {
    if (user && props.testId !== "trial") {
      const res = await api.post("/results", {
        testId: test.value.id,
        details: answers.value,
      });
      resultData.value = res.data;
      questionsReview.value = res.data.questionsReview || [];

      // Update local storage coins if earned
      if (res.data.totalCoins !== undefined) {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        userData.coins = res.data.totalCoins;
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } else {
      // Trial test evaluation
      const res = await api.post("/results/trial", {
        details: answers.value,
      });
      resultData.value = res.data;
      questionsReview.value = res.data.questionsReview || [];
    }
    showResult.value = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error("Error submitting test:", err);
    toast.error(t("testRunner.error") + ": " + (err.response?.data?.message || err.message));
  }
};

const finish = () => {
  emit("completed");
};

onMounted(async () => {
  try {
    let res;
    if (props.testId === "trial") {
      res = await api.get("/tests/trial");
    } else {
      res = await api.get(`/tests/${props.testId}`);
    }
    test.value = res.data;
    if (test.value.time_limit) {
      timeLeft.value = test.value.time_limit * 60;
      timer.value = setInterval(() => {
        timeLeft.value--;
        if (timeLeft.value <= 0) {
          submitTest();
        }
      }, 1000);
    }
  } catch (err) {
    toast.error(t("testRunner.error"));
  }
});

onBeforeUnmount(() => {
  if (timer.value) clearInterval(timer.value);
});
</script>

<style scoped>
.test-runner-container {
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: 50px;
}

/* Result Screen */
.result-screen {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 400px;
  width: 100%;
}
.result-container {
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
}
.result-card {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  animation: scaleUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.result-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}
.result-subtitle {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 10px;
}
.score-display {
  font-size: 3rem;
  font-weight: 800;
  color: var(--primary-color);
  margin-bottom: 10px;
}
.score-total {
  font-size: 1.5rem;
  color: #999;
  font-weight: 500;
}
.motivational-text {
  font-size: 1.2rem;
  color: #333;
  font-weight: 600;
}

/* Quick Stat Pills */
.review-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 24px;
  text-align: left;
}
.stat-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}
.stat-pill.stat-correct {
  background: #ecfdf5;
  border-color: #a7f3d0;
}
.stat-pill.stat-error {
  background: #fef2f2;
  border-color: #fecaca;
}
.stat-pill.stat-unanswered {
  background: #fffbeb;
  border-color: #fde68a;
}
.stat-icon {
  font-size: 1.3rem;
}
.stat-text {
  display: flex;
  flex-direction: column;
}
.stat-count {
  font-size: 1.3rem;
  font-weight: 800;
  color: #111827;
  line-height: 1.1;
}
.stat-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
}

/* Review Section */
.review-section {
  margin-top: 35px;
}
.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  background: white;
  padding: 18px 24px;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}
.review-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}
.review-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.filter-pill {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  padding: 8px 14px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #374151;
}
.filter-pill:hover {
  background: #e5e7eb;
}
.filter-pill.active {
  background: #ff2e93;
  color: white;
  border-color: #ff2e93;
  box-shadow: 0 0 12px rgba(255, 46, 147, 0.4);
}
.filter-pill-error.active {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}
.filter-pill-correct.active {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

/* Question Review Cards */
.review-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.review-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  border: 1px solid #e5e7eb;
  border-left: 6px solid #9ca3af;
  text-align: left;
}
.review-card.status-correct {
  border-left-color: #10b981;
}
.review-card.status-error {
  border-left-color: #ef4444;
}
.review-card.status-unanswered {
  border-left-color: #f59e0b;
}
.review-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.review-q-num {
  font-size: 0.85rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
}
.badge-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
}
.badge-success {
  background: #d1fae5;
  color: #065f46;
}
.badge-danger {
  background: #fee2e2;
  color: #991b1b;
}
.badge-warning {
  background: #fef3c7;
  color: #92400e;
}
.review-q-text {
  font-size: 1.05rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
  line-height: 1.5;
}
.review-image-wrap {
  margin-bottom: 16px;
  max-width: 100%;
  border-radius: 8px;
  overflow: hidden;
}
.review-q-image {
  max-width: 100%;
  max-height: 350px;
  border-radius: 8px;
  object-fit: contain;
}

/* Options Review Items */
.review-options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.review-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fafafa;
  transition: all 0.2s;
}
.review-option.is-correct-target {
  border: 2px solid #10b981;
  background: #ecfdf5;
  color: #065f46;
  font-weight: 600;
}
.review-option.is-user-wrong {
  border: 2px solid #ef4444;
  background: #fef2f2;
  color: #991b1b;
  font-weight: 600;
}
.option-marker {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 800;
  background: #e5e7eb;
  color: #4b5563;
  flex-shrink: 0;
}
.is-correct-target .option-marker {
  background: #10b981;
  color: white;
}
.is-user-wrong .option-marker {
  background: #ef4444;
  color: white;
}
.review-opt-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.review-opt-image {
  max-height: 120px;
  object-fit: contain;
  border-radius: 6px;
}
.tag-pill {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
}
.tag-correct {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}
.tag-wrong {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}
.motivational-text {
  font-size: 1.2rem;
  color: #333;
  font-weight: 600;
}

.test-content {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
}

/* Test Header */
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 16px 20px;
  border-radius: 14px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
}
.sticky-header {
  position: sticky;
  top: 10px;
  z-index: 100;
}
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
}
.test-title {
  font-size: 1.35rem;
  color: #1e293b;
  margin: 0;
  font-weight: 700;
  line-height: 1.3;
  flex: 1;
  min-width: 0;
  word-break: normal;
  overflow-wrap: break-word;
}
.timer-badge {
  font-size: 1.1rem;
  font-weight: bold;
  background: #fdf2f8;
  color: var(--primary-color);
  padding: 8px 16px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(230, 45, 149, 0.15);
}
.timer-badge.warning {
  background: #ffebee;
  color: #c62828;
  animation: pulse-red 1s infinite;
}

/* Questions */
.questions-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.question-block {
  background: white;
  padding: 30px;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  transition: transform 0.2s;
}
.question-block:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
}

.q-content {
  margin-bottom: 25px;
}
.q-number {
  display: block;
  font-size: 0.85rem;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 8px;
  letter-spacing: 1px;
}
.q-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #222;
  line-height: 1.5;
  margin-bottom: 15px;
}
.q-image-container {
  margin-top: 15px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #eee;
  display: inline-block;
}
.q-image {
  max-width: 100%;
  max-height: 400px;
  display: block;
}

/* Options */
.options-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
.option-label {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}
.option-label:hover {
  background: #fff;
  border-color: rgba(230, 45, 149, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.option-label.selected {
  background: #fdf2f8;
  border-color: var(--primary-color);
  box-shadow: 0 4px 12px var(--primary-glow);
}

.radio-wrapper {
  min-width: 24px;
  margin-right: 15px;
  margin-top: 2px;
  position: relative;
}
.option-label input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}
.custom-radio {
  width: 22px;
  height: 22px;
  border: 2px solid #ccc;
  border-radius: 50%;
  position: relative;
  transition: 0.2s;
  background: white;
}
.option-label:hover .custom-radio {
  border-color: var(--primary-color);
}
.option-label.selected .custom-radio {
  border-color: var(--primary-color);
  background: var(--primary-color);
}
.option-label.selected .custom-radio::after {
  content: "";
  position: absolute;
  top: 6px;
  left: 6px;
  width: 6px;
  height: 6px;
  background: white;
  border-radius: 50%;
}

.opt-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  align-items: flex-start;
}
.opt-text {
  font-size: 1.05rem;
  font-weight: 500;
  color: #444;
  line-height: 1.4;
}
.opt-image {
  width: auto;
  max-width: 100%;
  border-radius: 8px;
  border: 1px solid #ddd;
  object-fit: contain;
  max-height: 300px;
}

/* Buttons */
.footer-actions {
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
}
.btn-primary {
  background: linear-gradient(135deg, #ff2e93 0%, #ff007a 50%, #9333ea 100%);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 4px 15px rgba(255, 46, 147, 0.4);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 46, 147, 0.6);
}
.btn-lg {
  padding: 15px 40px;
  font-size: 1.1rem;
}
.btn-xl {
  padding: 18px 50px;
  font-size: 1.2rem;
  width: 100%;
  border-radius: 16px;
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.5s ease;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.animate-slide-up {
  animation: slideUp 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
  opacity: 0;
  transform: translateY(30px);
}
@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes pulse-red {
  0% {
    box-shadow: 0 0 0 0 rgba(198, 40, 40, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(198, 40, 40, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(198, 40, 40, 0);
  }
}
@keyframes scaleUp {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Responsive */
@media (min-width: 768px) {
  .btn-xl {
    width: auto;
  }
}

.scoring-info {
  font-size: 0.9rem;
  font-weight: 600;
  color: #ef4444;
  background: #fee2e2;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #fecaca;
}

.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .mobile-only {
    display: block;
  }
  .desktop-only {
    display: none;
  }
}

.earned-coins {
  margin-top: 20px;
  background: #fdf6b2;
  padding: 15px;
  border-radius: 12px;
  border: 2px dashed #eab308;
  color: #854d0e;
}

.coin-ani {
  font-size: 1.5rem;
  font-weight: 800;
  display: block;
  margin-bottom: 5px;
}

/* Question Navigator Strip */
.question-nav-strip {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  padding: 10px 14px;
  margin-top: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
}

.nav-progress-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.88rem;
  color: #64748b;
  width: 100%;
  min-width: 0;
}

.nav-count-text strong {
  color: #E62D95;
}

.nav-pct-badge {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 800;
  color: #E62D95;
  background: #fdf2f8;
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid rgba(230, 45, 149, 0.2);
}

.question-chips-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 2px 2px 8px 2px;
  scrollbar-width: thin;
  -webkit-overflow-scrolling: touch;
}

.q-chip {
  min-width: 34px;
  height: 34px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  color: #64748b;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.q-chip:hover {
  border-color: #E62D95;
  color: #E62D95;
}

.q-chip.chip-answered {
  background: #dcfce7;
  border-color: #86efac;
  color: #166534;
}

.q-chip.chip-active {
  background: var(--gradient-color);
  border-color: transparent;
  color: white;
  box-shadow: 0 0 10px rgba(230, 45, 149, 0.5);
}

.q-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.q-answered-tag {
  font-size: 0.76rem;
  font-weight: 700;
  color: #166534;
  background: #dcfce7;
  padding: 2px 8px;
  border-radius: 6px;
}

/* Option Letter Badge */
.option-letter-badge {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f1f5f9;
  color: #475569;
  font-weight: 800;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
  transition: all 0.2s;
}

.option-label.selected .option-letter-badge {
  background: var(--gradient-color);
  color: white;
  box-shadow: 0 0 10px rgba(230, 45, 149, 0.5);
}

.option-label.selected {
  background: #fff5f9 !important;
  border-color: #E62D95 !important;
  box-shadow: 0 4px 16px rgba(230, 45, 149, 0.15) !important;
}

/* Mobile Options Grid & Header */
@media (max-width: 640px) {
  .options-list {
    grid-template-columns: 1fr !important;
    gap: 12px !important;
  }
  .option-label {
    padding: 14px 16px !important;
  }
  .header {
    padding: 12px 14px !important;
    border-radius: 12px;
    margin-bottom: 16px;
  }
  .sticky-header {
    top: 0;
  }
  .header-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .test-title {
    font-size: 1.15rem;
    width: 100%;
  }
  .review-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

.scoring-info.scoring-nis {
  background: #f5f3ff;
  border: 1px solid #ddd6fe;
  color: #5b21b6;
}

.nis-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.2px;
}

.nis-badge.badge-standard {
  background: #fdf2f8;
  color: #db2777;
  border: 1px solid #fbcfe8;
}

.nis-badge.badge-sandyk {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.review-q-title {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
