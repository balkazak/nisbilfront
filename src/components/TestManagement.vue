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
            <h4 style="margin-bottom: 15px; color: #00bfff">
              {{ t("testManagement.questionsCount") }} ({{
                currentTest.questions.length
              }})
            </h4>
            <div
              v-for="(q, index) in currentTest.questions"
              :key="index"
              class="question-card"
            >
              <div class="question-header">
                <span class="q-number"
                  >{{ t("testRunner.question") }} {{ index + 1 }}</span
                >
                <button
                  type="button"
                  @click="removeQuestion(index)"
                  class="btn-icon-danger"
                  :title="t('testManagement.removeQuestion')"
                >
                  🗑
                </button>
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

            <button type="button" @click="addQuestion" class="btn-add-question">
              + {{ t("testManagement.addQuestion") }}
            </button>
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
  border-top: 4px solid #00bfff;
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
  border-color: #00bfff;
  outline: none;
  background: white;
  box-shadow: 0 0 0 3px rgba(0, 191, 255, 0.1);
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
  border-color: #b3e5fc;
}

.question-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.q-number {
  font-weight: 700;
  color: #00bfff;
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
  background: #e0f2fe;
  color: #00bfff;
  border-color: #00bfff;
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
  border-color: #00bfff;
  color: #00bfff;
  background: #f0faff;
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
  border-color: #00bfff;
  color: #00bfff;
  background: #f0f9ff;
}

.badge-blue {
  background: #e0f2fe;
  color: #0369a1;
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

@media (max-width: 992px) {
  .course-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
  .modal-xl {
    width: 95%;
    height: 95vh;
    border-radius: 20px;
  }
  .form-row {
    flex-direction: column;
  }
  .question-main {
    flex-direction: column;
  }
  .options-grid {
    grid-template-columns: 1fr;
  }
}
</style>
