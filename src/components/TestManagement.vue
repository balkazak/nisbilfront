<template>
  <div>
    <div class="flex justify-between items-center header-section">
      <h2 class="title-lg">
        {{ isTrialView ? t("admin.trialTests") : t("testManagement.title") }}
      </h2>
      <button v-if="isAdmin" @click="openCreateModal" class="btn-primary">
        + {{ t("testManagement.newBtn") }}
      </button>
    </div>

    <!-- Test List -->
    <div class="course-grid">
      <div v-for="test in tests" :key="test.id" class="card course-card">
        <div class="flex justify-between items-start">
          <h3>{{ test.title }}</h3>
          <div class="flex items-center gap-2">
            <span v-if="test.is_trial" class="category-tag-mini trial-badge">{{
              t("testManagement.trialTag")
            }}</span>
            <span v-if="test.category === 'bil'" class="category-tag bil"
              >BIL</span
            >
            <span v-else-if="test.category === 'nis'" class="category-tag nis"
              >НИШ</span
            >
          </div>
        </div>
        <p v-if="test.description">{{ test.description }}</p>
        <p class="text-muted" v-else>{{ t("testManagement.noDescription") }}</p>
        <div>
          <span class="badge-blue" v-if="test.time_limit"
            >⏱ {{ test.time_limit }} {{ t("testManagement.minutes") }}</span
          >
          <span class="badge-gray" v-else>{{
            t("testManagement.noTimer")
          }}</span>
        </div>
        <div class="flex gap-2 mt-auto">
          <button @click="editTest(test)" class="btn-outline grow">
            {{ t("testManagement.editBtn") }}
          </button>
          <button
            v-if="isAdmin"
            @click="handleDelete(test)"
            class="btn-delete"
            :title="t('testManagement.deleteBtn')"
          >
            🗑
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Test Modal -->
    <div v-if="showTestModal" class="modal-overlay">
      <div class="card modal-xl animate-scale-up">
        <div class="modal-header">
          <h3>
            {{
              isEditing
                ? t("testManagement.editTitle")
                : t("testManagement.createTitle")
            }}
          </h3>
          <button @click="showTestModal = false" class="btn-close">
            &times;
          </button>
        </div>

        <form @submit.prevent="saveTest" class="modal-body">
          <div class="form-section">
            <div class="form-row">
              <div class="input-group full-width">
                <label>{{ t("testManagement.testName") }}</label>
                <input
                  v-model="currentTest.title"
                  :placeholder="t('testManagement.testName')"
                  class="input-field"
                  required
                />
              </div>
              <div class="input-group">
                <label>{{ t("testManagement.timeLimit") }}</label>
                <input
                  type="number"
                  v-model="currentTest.time_limit"
                  :placeholder="t('testManagement.noTimer')"
                  class="input-field"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="input-group">
                <label>{{ t("testManagement.descriptionLabel") }}</label>
                <textarea
                  v-model="currentTest.description"
                  :placeholder="t('testManagement.descriptionLabel')"
                  class="input-field"
                  rows="2"
                ></textarea>
              </div>
              <div class="input-group">
                <label>{{ t("testManagement.categoryLabel") }}</label>
                <select v-model="currentTest.category" class="input-field">
                  <option value="standard">
                    {{ t("testManagement.categoryStandard") }}
                  </option>
                  <option value="bil">
                    {{ t("testManagement.categoryBIL") }}
                  </option>
                  <option value="nis">
                    {{ t("testManagement.categoryNIS") }}
                  </option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="input-group-row">
                <input
                  type="checkbox"
                  v-model="currentTest.is_trial"
                  id="isTrialCheck"
                />
                <label for="isTrialCheck">{{
                  t("testManagement.isTrial")
                }}</label>
              </div>
              <div class="input-group">
                <label>{{ t("testManagement.coinPrice") }}</label>
                <input
                  type="number"
                  v-model="currentTest.coin_price"
                  :placeholder="t('testManagement.coinPrice')"
                  class="input-field"
                />
              </div>
            </div>
          </div>

          <div class="questions-section">
            <div class="questions-toolbar flex justify-between items-center mb-4 flex-wrap gap-2">
              <div class="flex items-center gap-2">
                <h4 class="questions-count-title">
                  {{ t("testManagement.questionsCount") }} ({{ currentTest.questions.length }})
                </h4>
                <button
                  type="button"
                  class="btn-toggle-view"
                  @click="toggleAllCollapse"
                >
                  {{ isAllCollapsed ? '▼ ' + (t("dashboard.showLessons") || "Развернуть все") : '▲ ' + (t("dashboard.hideLessons") || "Свернуть все") }}
                </button>
              </div>

              <div class="flex gap-2 items-center flex-wrap">
                <button
                  type="button"
                  @click="showBulkImportModal = true"
                  class="btn-bulk-import"
                  title="Быстрый импорт вопросов из текста"
                >
                  📋 Импорт из текста
                </button>
                <button
                  type="button"
                  @click="addFiveQuestions"
                  class="btn-secondary btn-sm"
                  title="Добавить сразу 5 пустых вопросов"
                >
                  +5 вопросов
                </button>
                <button
                  type="button"
                  @click="addQuestion"
                  class="btn-primary btn-sm"
                >
                  + {{ t("testManagement.addQuestion") }}
                </button>
              </div>
            </div>

            <div
              v-for="(q, index) in currentTest.questions"
              :key="index"
              class="question-card"
              :class="{ 'card-collapsed': collapsedQuestions[index] }"
            >
              <div class="question-header">
                <div class="q-header-left" @click="toggleQuestion(index)">
                  <span class="collapse-icon">{{ collapsedQuestions[index] ? '▶' : '▼' }}</span>
                  <span class="q-number">{{ t("testRunner.question") }} {{ index + 1 }}</span>
                  <span v-if="q.text" class="q-preview-text">{{ q.text }}</span>
                  <span
                    v-if="currentTest.category === 'nis'"
                    class="nis-pill-sm"
                    :class="q.question_type === 'sandyk_sippattama' ? 'sandyk' : 'standard'"
                  >
                    {{ q.question_type === 'sandyk_sippattama' ? 'Сандық (+5)' : 'Стандарт (+10)' }}
                  </span>
                  <span class="q-correct-badge">
                    Ответ: <strong>{{ String.fromCharCode(65 + (q.correct_option_index || 0)) }}</strong>
                  </span>
                </div>

                <div class="question-header-actions flex gap-1 items-center">
                  <button
                    type="button"
                    @click.stop="moveQuestion(index, -1)"
                    :disabled="index === 0"
                    class="btn-icon-step"
                    title="Переместить выше"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    @click.stop="moveQuestion(index, 1)"
                    :disabled="index === currentTest.questions.length - 1"
                    class="btn-icon-step"
                    title="Переместить ниже"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    @click.stop="duplicateQuestion(index)"
                    class="btn-icon-step"
                    title="Дублировать вопрос"
                  >
                    📋
                  </button>
                  <button
                    type="button"
                    @click.stop="removeQuestion(index)"
                    class="btn-icon-danger"
                    :title="t('testManagement.removeQuestion')"
                  >
                    🗑
                  </button>
                </div>
              </div>

              <!-- Question Form Body (Collapsible) -->
              <div v-show="!collapsedQuestions[index]" class="question-body animate-fade-in">
                <!-- NIS Question Type Selector -->
                <div v-if="currentTest.category === 'nis'" class="nis-type-selector">
                  <label class="nis-type-label">{{ t("testManagement.questionTypeLabel") }}</label>
                  <div class="nis-type-buttons">
                    <button
                      type="button"
                      class="nis-type-btn"
                      :class="{ active: (q.question_type || 'standard') === 'standard' }"
                      @click="q.question_type = 'standard'"
                    >
                      📘 {{ t("testManagement.questionTypeStandard") }}
                    </button>
                    <button
                      type="button"
                      class="nis-type-btn"
                      :class="{ active: q.question_type === 'sandyk_sippattama' }"
                      @click="q.question_type = 'sandyk_sippattama'"
                    >
                      📗 {{ t("testManagement.questionTypeSandyk") }}
                    </button>
                  </div>
                </div>

                <div class="question-main">
                  <input
                    v-model="q.text"
                    :placeholder="t('testManagement.enterQuestion')"
                    class="input-field q-input"
                    :required="!q.image_url"
                  />

                  <div class="image-uploader">
                    <label
                      class="upload-btn"
                      :class="{ 'has-image': q.image_url }"
                    >
                      <span v-if="!q.image_url">{{
                        t("testManagement.addPhoto")
                      }}</span>
                      <span v-else>{{ t("testManagement.replacePhoto") }}</span>
                      <input
                        type="file"
                        @change="uploadImage($event, q)"
                        accept="image/*"
                        hidden
                      />
                    </label>
                    <div v-if="q.image_url" class="image-preview">
                      <img :src="q.image_url" alt="Preview" />
                      <button
                        type="button"
                        @click="q.image_url = ''"
                        class="btn-remove-img"
                      >
                        &times;
                      </button>
                    </div>
                  </div>
                </div>

                <div class="options-grid">
                  <div
                    v-for="(opt, oIndex) in q.options"
                    :key="oIndex"
                    class="option-item"
                    :class="{ correct: q.correct_option_index === oIndex }"
                  >
                    <div
                      class="option-marker"
                      @click="q.correct_option_index = oIndex"
                      title="Кликните, чтобы выбрать этот вариант как верный"
                    >
                      <div class="radio-circle"></div>
                      <span>{{ String.fromCharCode(65 + oIndex) }}</span>
                    </div>
                    <div class="option-content">
                      <input
                        v-model="opt.text"
                        :placeholder="
                          t('testManagement.variant') + ' ' + (oIndex + 1)
                        "
                        class="input-field opt-input"
                      />

                      <div class="mini-uploader">
                        <label class="mini-upload-btn">
                          <span v-if="!opt.image_url">📷</span>
                          <span v-else>🔄</span>
                          <input
                            type="file"
                            @change="uploadImage($event, opt)"
                            accept="image/*"
                            hidden
                          />
                        </label>
                        <img
                          v-if="opt.image_url"
                          :src="opt.image_url"
                          class="mini-preview"
                        />
                        <button
                          v-if="opt.image_url"
                          type="button"
                          @click="opt.image_url = ''"
                          class="mini-remove"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex gap-3 mt-4">
              <button type="button" @click="addQuestion" class="btn-add-question grow">
                + {{ t("testManagement.addQuestion") }}
              </button>
              <button type="button" @click="addFiveQuestions" class="btn-secondary">
                +5 вопросов
              </button>
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              @click="showTestModal = false"
              class="btn-secondary"
            >
              {{ t("testManagement.cancel") }}
            </button>
            <button type="submit" class="btn-primary">
              {{ t("testManagement.save") }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal for Bulk Text Import -->
    <div v-if="showBulkImportModal" class="modal-overlay" @click.self="showBulkImportModal = false">
      <div class="modal-content modal-md animate-scale-up">
        <div class="modal-header">
          <h3>📋 Быстрый импорт вопросов из текста</h3>
          <button class="btn-close" @click="showBulkImportModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <p class="bulk-instructions">
            Вставьте вопросы с вариантами ответов. Система автоматически разберёт их.
            <br />
            <strong>Пример формата:</strong>
          </p>
          <pre class="bulk-example">
1. Столица Казахстана?
A) Алматы
B) Астана
C) Шымкент
D) Караганда
Ответ: B

2. Сколько будет 7 * 8?
A) 54
B) 56
C) 64
D) 49
Ответ: B</pre>
          <textarea
            v-model="bulkText"
            class="input-field bulk-textarea"
            rows="10"
            placeholder="Вставьте сюда текст с вопросами..."
          ></textarea>
        </div>
        <div class="modal-footer">
          <button type="button" @click="showBulkImportModal = false" class="btn-secondary">
            Отмена
          </button>
          <button type="button" @click="parseBulkText" class="btn-primary">
            Распознать и добавить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../api";
import { useToast } from "../composables/useToast";
import { useLanguage } from "../composables/useLanguage";

const props = defineProps({
  isTrialView: {
    type: Boolean,
    default: false,
  },
});

const toast = useToast();
const { t } = useLanguage();

const allTests = ref([]);
const tests = computed(() => {
  if (props.isTrialView) {
    return allTests.value.filter((t) => t.is_trial);
  }
  return allTests.value;
});
const showTestModal = ref(false);
const isEditing = ref(false);
const currentUser = ref(JSON.parse(localStorage.getItem("user") || "{}"));
const currentTest = ref({
  id: null,
  title: "",
  description: "",
  time_limit: null,
  is_standalone: true,
  category: "standard",
  is_trial: false,
  coin_price: 0,
  questions: [],
});

const isAdmin = computed(() => currentUser.value.role === "admin");

const fetchTests = async () => {
  const res = await api.get("/tests?is_standalone=true");
  allTests.value = res.data;
};

const createEmptyQuestion = () => {
  return {
    text: "",
    image_url: "",
    options: [
      { text: "", image_url: "" },
      { text: "", image_url: "" },
      { text: "", image_url: "" },
      { text: "", image_url: "" },
    ],
    correct_option_index: 0,
    question_type: "standard",
  };
};

const openCreateModal = () => {
  isEditing.value = false;
  currentTest.value = {
    id: null,
    title: "",
    description: "",
    time_limit: null,
    is_standalone: true,
    category: "standard",
    is_trial: props.isTrialView,
    coin_price: 0,
    questions: [createEmptyQuestion()],
  };
  showTestModal.value = true;
};

const addQuestion = () => {
  currentTest.value.questions.push(createEmptyQuestion());
};

const removeQuestion = (index) => {
  currentTest.value.questions.splice(index, 1);
};

const collapsedQuestions = ref({});
const isAllCollapsed = ref(false);
const showBulkImportModal = ref(false);
const bulkText = ref("");

const toggleQuestion = (index) => {
  collapsedQuestions.value[index] = !collapsedQuestions.value[index];
};

const toggleAllCollapse = () => {
  isAllCollapsed.value = !isAllCollapsed.value;
  currentTest.value.questions.forEach((_, idx) => {
    collapsedQuestions.value[idx] = isAllCollapsed.value;
  });
};

const duplicateQuestion = (index) => {
  const original = currentTest.value.questions[index];
  const copy = JSON.parse(JSON.stringify(original));
  copy.text = copy.text ? `${copy.text} (Копия)` : "";
  currentTest.value.questions.splice(index + 1, 0, copy);
  toast.success("Вопрос продублирован");
};

const moveQuestion = (index, dir) => {
  const newIndex = index + dir;
  if (newIndex < 0 || newIndex >= currentTest.value.questions.length) return;
  const questions = [...currentTest.value.questions];
  const [removed] = questions.splice(index, 1);
  questions.splice(newIndex, 0, removed);
  currentTest.value.questions = questions;
  
  // also swap collapsed states
  const prevA = collapsedQuestions.value[index];
  const prevB = collapsedQuestions.value[newIndex];
  collapsedQuestions.value[index] = prevB;
  collapsedQuestions.value[newIndex] = prevA;
};

const addFiveQuestions = () => {
  for (let i = 0; i < 5; i++) {
    currentTest.value.questions.push(createEmptyQuestion());
  }
  toast.success("Добавлено 5 вопросов");
};

const parseBulkText = () => {
  if (!bulkText.value.trim()) {
    toast.error("Вставьте текст с вопросами");
    return;
  }
  
  // Parse format:
  // 1. Question text
  // A) Option A
  // B) Option B
  // C) Option C
  // D) Option D
  // Ответ: A (or Answer: A)
  const lines = bulkText.value.split("\n").map(l => l.trim()).filter(Boolean);
  const parsedQuestions = [];
  let currentQ = null;

  for (const line of lines) {
    // Detect question start: "1." or "1)" or "Вопрос 1:"
    const qMatch = line.match(/^(\d+[\.\)]|Вопрос\s*\d+[:\.]?)\s*(.*)/i);
    // Detect options: "A)" or "А)" or "a." or "1)"
    const optMatch = line.match(/^([A-Da-dА-Яа-яA-Z])[\.\)]\s*(.*)/i);
    // Detect answer: "Ответ: A" or "Правильный ответ: A" or "Answer: A"
    const ansMatch = line.match(/^(?:Ответ|Правильный ответ|Answer|Жауабы)[:\s]*([A-Da-dА-Да-д])/i);

    if (ansMatch && currentQ) {
      const letter = ansMatch[1].toUpperCase();
      const map = { 'A': 0, 'А': 0, 'B': 1, 'В': 1, 'Б': 1, 'C': 2, 'С': 2, 'D': 3, 'Д': 3 };
      if (map[letter] !== undefined) {
        currentQ.correct_option_index = map[letter];
      }
    } else if (optMatch && currentQ && currentQ.options.length < 6) {
      currentQ.options.push({ text: optMatch[2].trim(), image_url: "" });
    } else if (qMatch) {
      if (currentQ) {
        // Pad options to 4 if needed
        while (currentQ.options.length < 4) {
          currentQ.options.push({ text: "", image_url: "" });
        }
        parsedQuestions.push(currentQ);
      }
      currentQ = {
        text: qMatch[2] ? qMatch[2].trim() : line,
        image_url: "",
        options: [],
        correct_option_index: 0,
      };
    } else if (currentQ && currentQ.options.length === 0) {
      // Continuation of question text
      currentQ.text += " " + line;
    }
  }

  if (currentQ) {
    while (currentQ.options.length < 4) {
      currentQ.options.push({ text: "", image_url: "" });
    }
    parsedQuestions.push(currentQ);
  }

  if (parsedQuestions.length > 0) {
    // If the only question was 1 empty question, replace it
    if (
      currentTest.value.questions.length === 1 &&
      !currentTest.value.questions[0].text &&
      !currentTest.value.questions[0].image_url
    ) {
      currentTest.value.questions = parsedQuestions;
    } else {
      currentTest.value.questions.push(...parsedQuestions);
    }
    toast.success(`Импортировано вопросов: ${parsedQuestions.length}`);
    bulkText.value = "";
    showBulkImportModal.value = false;
  } else {
    toast.error("Не удалось распознать вопросы. Проверьте формат текста.");
  }
};

const editTest = async (test) => {
  const res = await api.get(`/tests/${test.id}`);
  const data = res.data;
  currentTest.value = {
    ...data,
    questions: data.Questions || data.questions || [],
  };
  isEditing.value = true;
  showTestModal.value = true;
};

const uploadImage = async (event, targetObject) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    targetObject.image_url = res.data.url;
    toast.success(t("testManagement.addPhoto"));
  } catch (err) {
    toast.error("Error: " + err.message);
  }
};

const saveTest = async () => {
  try {
    const payload = {
      title: currentTest.value.title,
      description: currentTest.value.description,
      time_limit: currentTest.value.time_limit,
      is_standalone: currentTest.value.is_standalone,
      category: currentTest.value.category,
      is_trial: currentTest.value.is_trial,
      coin_price: currentTest.value.coin_price || 0,
      questions: currentTest.value.questions.map((q) => ({
        text: q.text,
        image_url: q.image_url,
        options: q.options.map((o) => ({
          text: o.text,
          image_url: o.image_url,
        })),
        correct_option_index: q.correct_option_index,
        question_type: q.question_type || 'standard',
      })),
    };

    if (isEditing.value) {
      await api.put(`/tests/${currentTest.value.id}`, payload);
      toast.success(t("testManagement.successUpdated"));
    } else {
      await api.post("/tests", payload);
      toast.success(t("testManagement.successCreated"));
    }

    showTestModal.value = false;
    fetchTests();
  } catch (err) {
    toast.error("Error: " + (err.response?.data?.message || err.message));
  }
};

const handleDelete = async (test) => {
  if (!confirm(`${t("testManagement.confirmDelete")} "${test.title}"?`)) return;
  try {
    await api.delete(`/tests/${test.id}`);
    toast.success(t("testManagement.successDeleted"));
    fetchTests();
  } catch (err) {
    toast.error("Error: " + (err.response?.data?.message || err.message));
  }
};

onMounted(fetchTests);
</script>

<style scoped>
.header-section {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eaeaea;
}
.title-lg {
  font-size: 1.8rem;
  color: #333;
  font-weight: 700;
}
.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
.course-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 220px;
  border-top: 4px solid var(--primary-color);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}
.text-muted {
  color: #888;
  font-size: 0.9rem;
  font-style: italic;
}

.category-tag {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 800;
}
.category-tag.bil {
  background: #fee2e2;
  color: #ef4444;
  border: 1px solid #fecaca;
}
.category-tag-mini {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 800;
}
.trial-badge {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #dcfce7;
}

.input-group-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.input-group-row input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}
.input-group-row label {
  cursor: pointer;
  font-weight: 600;
  color: #475569;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
}
.modal-xl {
  width: 95%;
  max-width: 1000px;
  height: 90vh;
  background: #fdfdfd;
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  padding: 20px 30px;
  background: white;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header h3 {
  margin: 0;
  color: #333;
  font-weight: 700;
}
.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: #999;
  cursor: pointer;
  line-height: 1;
}
.btn-close:hover {
  color: #333;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.modal-footer {
  padding: 20px 30px;
  background: white;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.form-section {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  border: 1px solid #f0f0f0;
}
.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}
.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
.input-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.input-field {
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: 0.3s;
  background: #fafafa;
  width: 100%;
}
.input-field:focus {
  border-color: var(--primary-color);
  outline: none;
  background: white;
  box-shadow: 0 0 0 3px var(--primary-glow);
}
.full-width {
  flex: 2;
}

.questions-section {
  flex: 1;
}
.question-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid #eee;
  margin-bottom: 25px;
  transition: transform 0.2s;
}
.question-card:hover {
  border-color: rgba(230, 45, 149, 0.25);
}

.question-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.q-number {
  font-weight: 700;
  color: var(--primary-color);
  font-size: 1.1rem;
}
.btn-icon-danger {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fee2e2;
  color: #ef4444;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.2s;
  flex-shrink: 0;
}
.btn-icon-danger:hover {
  background: #fecaca;
  transform: scale(1.1);
}
.btn-delete {
  background: #fee2e2;
  color: #ef4444;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.2s;
  flex-shrink: 0;
}
.btn-delete:hover {
  background: #fecaca;
  transform: scale(1.05);
}
.grow {
  flex: 1;
}

.question-main {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.q-input {
  flex: 1;
  font-weight: 500;
  font-size: 1.1rem;
}

.image-uploader {
  display: flex;
  align-items: center;
  gap: 10px;
}
.upload-btn {
  background: #f1f5f9;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
  transition: 0.2s;
  border: 1px dashed #cbd5e1;
  display: inline-block;
  white-space: nowrap;
}
.upload-btn:hover {
  background: #e2e8f0;
  border-color: #94a3b8;
}
.upload-btn.has-image {
  background: #fdf2f8;
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.image-preview {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.btn-remove-img {
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}
.option-item {
  background: #f8fafc;
  padding: 10px 15px;
  border-radius: 10px;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: 0.2s;
}
.option-item:hover {
  background: white;
  border-color: #e2e8f0;
}
.option-item.correct {
  background: #f0fdf4;
  border-color: #4caf50;
}

.option-marker {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: #64748b;
}
.radio-circle {
  width: 22px;
  height: 22px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  position: relative;
  transition: 0.2s;
  background: white;
}
.option-item.correct .radio-circle {
  border-color: #4caf50;
  background: #4caf50;
}
.option-item.correct .radio-circle::after {
  content: "✔";
  color: white;
  position: absolute;
  font-size: 12px;
  top: 0px;
  left: 4px;
}

.option-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}
.opt-input {
  padding: 8px 12px;
  font-size: 0.95rem;
  background: white;
}

.mini-uploader {
  display: flex;
  align-items: center;
  gap: 5px;
}
.mini-upload-btn {
  cursor: pointer;
  font-size: 1.2rem;
  opacity: 0.6;
  transition: 0.2s;
}
.mini-upload-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}
.mini-preview {
  width: 30px;
  height: 30px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ddd;
}
.mini-remove {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-weight: bold;
}

.btn-add-question {
  width: 100%;
  padding: 15px;
  background: white;
  border: 2px dashed #cbd5e1;
  color: #64748b;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
}
.btn-add-question:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: var(--primary-light);
}

.btn-outline {
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}
.btn-outline:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: var(--primary-light);
}

.badge-blue {
  background: #fdf2f8;
  color: var(--primary-color);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}
.badge-gray {
  background: #f1f5f9;
  color: #64748b;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
}

.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}
@keyframes scaleUp {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.questions-toolbar {
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}
.questions-count-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
}
.btn-toggle-view {
  background: white;
  border: 1px solid #cbd5e1;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: 0.2s;
}
.btn-toggle-view:hover {
  background: #f1f5f9;
  color: #0f172a;
}
.btn-bulk-import {
  background: #fdf2f8;
  border: 1px solid #fbcfe8;
  color: #db2777;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
}
.btn-bulk-import:hover {
  background: #fce7f3;
  color: #be185d;
}
.q-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
  flex: 1;
  min-width: 0;
}
.collapse-icon {
  font-size: 0.75rem;
  color: #94a3b8;
  transition: 0.2s;
}
.q-preview-text {
  font-size: 0.9rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 320px;
}
.q-correct-badge {
  font-size: 0.75rem;
  background: #dcfce7;
  color: #15803d;
  padding: 2px 8px;
  border-radius: 6px;
  white-space: nowrap;
}
.btn-icon-step {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  cursor: pointer;
  transition: 0.2s;
}
.btn-icon-step:hover:not(:disabled) {
  background: #e2e8f0;
  color: #0f172a;
}
.btn-icon-step:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.card-collapsed {
  padding: 14px 20px !important;
  margin-bottom: 12px !important;
  background: #fafafa;
}
.card-collapsed .question-header {
  margin-bottom: 0 !important;
}

.modal-md {
  width: 90%;
  max-width: 600px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
}
.bulk-instructions {
  font-size: 0.9rem;
  color: #475569;
  margin-bottom: 10px;
  line-height: 1.5;
}
.bulk-example {
  background: #f8fafc;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.8rem;
  color: #334155;
  border: 1px dashed #cbd5e1;
  margin-bottom: 14px;
  max-height: 140px;
  overflow-y: auto;
}
.bulk-textarea {
  font-family: monospace;
  font-size: 0.88rem;
  line-height: 1.5;
  resize: vertical;
}

@media (max-width: 992px) {
  .course-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
  .modal-xl {
    width: 96%;
    height: 96vh;
    border-radius: 16px;
  }
  .modal-body {
    padding: 16px;
    gap: 16px;
  }
  .modal-header, .modal-footer {
    padding: 14px 18px;
  }
  .form-section {
    padding: 16px;
  }
  .form-row {
    flex-direction: column;
    gap: 12px;
  }
  .question-card {
    padding: 16px;
  }
  .question-main {
    flex-direction: column;
    gap: 12px;
  }
  .options-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  .q-preview-text {
    max-width: 140px;
  }
  .questions-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
}

/* NIS Question Type Selector */
.nis-type-selector {
  background: linear-gradient(135deg, #eff6ff 0%, #fdf4ff 100%);
  border: 1px solid #c7d2fe;
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 12px;
}
.nis-type-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: #4338ca;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 8px;
}
.nis-type-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.nis-type-btn {
  flex: 1;
  min-width: 140px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  background: white;
  color: #475569;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}
.nis-type-btn:hover {
  border-color: #818cf8;
  color: #4338ca;
}
.nis-type-btn.active {
  background: linear-gradient(135deg, #4338ca, #6366f1);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(67, 56, 202, 0.3);
}
.category-tag.nis {
  background: #ede9fe;
  color: #5b21b6;
  border: 1px solid #c4b5fd;
}

.nis-pill-sm {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 6px;
  white-space: nowrap;
}
.nis-pill-sm.standard {
  background: #fdf2f8;
  color: #db2777;
  border: 1px solid #fbcfe8;
}
.nis-pill-sm.sandyk {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}
</style>
