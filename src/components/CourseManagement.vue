<template>
  <div>
    <div class="header-section flex justify-between items-center">
      <h2 class="title-lg">{{ t("courseManagement.title") }}</h2>
      <button
        v-if="isAdmin"
        @click="showAddCourse = true"
        class="btn-primary btn-lg"
      >
        + {{ t("courseManagement.newCourseBtn") }}
      </button>
    </div>

    <!-- Course List -->
    <div class="course-grid">
      <div v-for="course in courses" :key="course.id" class="card course-card">
        <div class="card-content">
          <h3>{{ course.title }}</h3>
          <p>{{ course.description || t("courseManagement.noDescription") }}</p>
        </div>
        <div class="flex gap-2 mt-auto">
          <button @click="editCourse(course)" class="btn-outline grow">
            {{ t("courseManagement.manageBtn") }}
          </button>
          <button
            v-if="isAdmin"
            @click="deleteCourse(course)"
            class="btn-delete"
            :title="t('courseManagement.deleteBtn')"
          >
            🗑
          </button>
        </div>
      </div>
    </div>

    <!-- Add Course Modal -->
    <div v-if="showAddCourse" class="modal-overlay">
      <div class="card modal animate-scale-up">
        <div class="modal-header">
          <h3>{{ t("courseManagement.createTitle") }}</h3>
          <button @click="showAddCourse = false" class="btn-close">
            &times;
          </button>
        </div>
        <form @submit.prevent="createCourse" class="modal-body">
          <div class="input-group">
            <label>{{ t("courseManagement.courseName") }}</label>
            <input
              v-model="newCourse.title"
              :placeholder="t('courseManagement.courseName')"
              class="input-field"
              required
            />
          </div>
          <div class="input-group">
            <label>{{ t("courseManagement.description") }}</label>
            <textarea
              v-model="newCourse.description"
              :placeholder="t('courseManagement.description')"
              class="input-field"
              rows="3"
            ></textarea>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn-primary btn-full">
              {{ t("courseManagement.createBtn") }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Course Editor (Lessons & Tests) -->
    <div v-if="selectedCourse" class="modal-overlay">
      <div class="card modal-xl animate-scale-up">
        <div class="modal-header">
          <h3>{{ selectedCourse.title }}</h3>
          <button @click="selectedCourse = null" class="btn-close">
            &times;
          </button>
        </div>

        <div class="modal-body flex-row-layout">
          <!-- Sidebar Info -->
          <div class="course-info-sidebar">
            <div class="flex justify-between items-center mb-2">
              <h4>{{ t("courseManagement.infoTitle") }}</h4>
              <button
                @click="startEditCourse"
                class="btn-icon-blue"
                :title="t('courseManagement.editCourseTitle')"
              >
                ✎
              </button>
            </div>
            <div v-if="!isEditingCourse">
              <p class="desc">
                {{
                  selectedCourse.description ||
                  t("courseManagement.noDescription")
                }}
              </p>
            </div>
            <div v-else class="edit-course-form">
              <input
                v-model="courseEditData.title"
                class="input-field mb-2"
                :placeholder="t('courseManagement.courseName')"
              />
              <textarea
                v-model="courseEditData.description"
                class="input-field mb-2"
                :placeholder="t('courseManagement.description')"
                rows="3"
              ></textarea>
              <div class="flex gap-2">
                <button @click="saveCourseEdit" class="btn-primary btn-sm grow">
                  OK
                </button>
                <button
                  @click="isEditingCourse = false"
                  class="btn-secondary btn-sm"
                >
                  X
                </button>
              </div>
            </div>
            <div class="stat-box">
              <span>{{
                selectedCourse.Lessons ? selectedCourse.Lessons.length : 0
              }}</span>
              <small>{{ t("courseManagement.lessonsCount") }}</small>
            </div>
          </div>

          <!-- Content Area -->
          <div class="course-content-area">
            <div class="flex justify-between items-center mb-4">
              <h4 class="section-title">
                {{ t("courseManagement.lessonsList") }}
              </h4>
              <button @click="openAddLessonModal" class="btn-primary">
                + {{ t("courseManagement.addLessonBtn") }}
              </button>
            </div>

            <div
              v-if="
                !selectedCourse.Lessons || selectedCourse.Lessons.length === 0
              "
              class="empty-state"
            >
              <p>{{ t("courseManagement.noLessons") }}</p>
            </div>

            <ul class="lesson-list">
              <li
                v-for="(lesson, lIdx) in selectedCourse.Lessons"
                :key="lesson.id"
                class="lesson-item"
              >
                <div class="lesson-row">
                  <div class="lesson-main">
                    <span class="lesson-icon">{{ lIdx + 1 }}</span>
                    <div class="lesson-info">
                      <strong class="lesson-title">{{ lesson.title }}</strong>
                      <div class="flex gap-2 mt-1 items-center flex-wrap">
                        <button
                          @click="startEditLesson(lesson)"
                          class="btn-text-blue"
                        >
                          {{ t("courseManagement.editLesson") }}
                        </button>
                        <button
                          @click="duplicateLesson(lesson)"
                          class="btn-text-blue"
                          title="Дублировать урок"
                        >
                          📋 Копировать
                        </button>
                        <button
                          @click="handleDeleteLesson(lesson)"
                          class="btn-text-danger"
                        >
                          {{ t("courseManagement.deleteLesson") }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="lesson-actions">
                    <div v-if="lesson.Test" class="test-badge-wrapper">
                      <div
                        class="test-badge"
                        :class="{ 'bil-test': lesson.Test.category === 'bil' }"
                      >
                        <div class="flex items-center gap-1">
                          <span>{{ t("courseManagement.testAttached") }}</span>
                          <span
                            v-if="lesson.Test.category === 'bil'"
                            class="category-tag-mini"
                            >BIL</span
                          >
                        </div>
                        <small v-if="lesson.Test.time_limit"
                          >⏱ {{ lesson.Test.time_limit }}
                          {{ t("testManagement.minutes") }}</small
                        >
                      </div>
                      <div class="test-badge-actions">
                        <button
                          @click="editLessonTest(lesson)"
                          class="btn-icon-blue small-circle"
                          :title="t('courseManagement.changeTest')"
                        >
                          ✎
                        </button>
                        <button
                          @click="handleDeleteLessonTest(lesson.Test.id)"
                          class="btn-icon-danger small-circle"
                          :title="t('courseManagement.deleteTest')"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    <button
                      v-else
                      @click="attachTest(lesson)"
                      class="btn-secondary btn-sm"
                    >
                      + {{ t("courseManagement.createTest") }}
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Lesson Modal -->
    <div v-if="showAddLesson" class="modal-overlay z-high">
      <div class="card modal animate-scale-up">
        <div class="modal-header">
          <h3>
            {{
              isEditingLesson
                ? t("courseManagement.editLessonTitle")
                : t("courseManagement.newLessonTitle")
            }}
          </h3>
          <button @click="showAddLesson = false" class="btn-close">
            &times;
          </button>
        </div>
        <form @submit.prevent="addLesson" class="modal-body">
          <div class="input-group">
            <label>{{ t("courseManagement.lessonName") }}</label>
            <input
              v-model="newLesson.title"
              :placeholder="t('courseManagement.lessonName')"
              class="input-field"
              required
            />
          </div>

          <!-- Videos -->
          <div class="input-group">
            <label>{{ t("courseManagement.videoLessons") }}</label>
            <div
              v-for="(v, idx) in newLesson.video_urls"
              :key="'v-' + idx"
              class="flex gap-2 mb-2"
            >
              <input
                v-model="newLesson.video_urls[idx]"
                placeholder="https://youtube.com/..."
                class="input-field grow"
                required
              />
              <button
                type="button"
                @click="newLesson.video_urls.splice(idx, 1)"
                class="btn-icon-danger small"
              >
                x
              </button>
            </div>
            <button
              type="button"
              @click="newLesson.video_urls.push('')"
              class="btn-secondary btn-sm"
            >
              + {{ t("courseManagement.addMoreVideo") }}
            </button>
          </div>

          <!-- Solutions -->
          <div class="input-group">
            <label>{{ t("courseManagement.solutions") }}</label>
            <div
              v-for="(s, idx) in newLesson.solution_video_urls"
              :key="'s-' + idx"
              class="flex gap-2 mb-2"
            >
              <input
                v-model="newLesson.solution_video_urls[idx]"
                placeholder="https://..."
                class="input-field grow"
              />
              <button
                type="button"
                @click="newLesson.solution_video_urls.splice(idx, 1)"
                class="btn-icon-danger small"
              >
                x
              </button>
            </div>
            <button
              type="button"
              @click="newLesson.solution_video_urls.push('')"
              class="btn-secondary btn-sm"
            >
              + {{ t("courseManagement.addMoreSolution") }}
            </button>
          </div>

          <!-- Additional Materials -->
          <div class="input-group">
            <label>{{ t("courseManagement.additionalMaterials") }}</label>
            <div
              v-for="(m, idx) in newLesson.materials"
              :key="'m-' + idx"
              class="flex gap-2 mb-2 items-center"
            >
              <input
                v-model="m.name"
                placeholder="Name"
                class="input-field grow"
                required
              />
              <a :href="m.url" target="_blank" class="btn-icon-blue small"
                >👁</a
              >
              <button
                type="button"
                @click="newLesson.materials.splice(idx, 1)"
                class="btn-icon-danger small"
              >
                x
              </button>
            </div>
            <label class="btn-secondary btn-sm cursor-pointer inline-block">
              + {{ t("courseManagement.addMaterial") }}
              <input
                type="file"
                @change="uploadMaterial"
                accept="application/pdf"
                hidden
              />
            </label>
          </div>

          <div class="modal-footer">
            <button type="submit" class="btn-primary btn-full">
              {{
                isEditingLesson
                  ? t("courseManagement.saveChanges")
                  : t("courseManagement.addLessonAction")
              }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Create Test Modal -->
    <div v-if="showCreateTest" class="modal-overlay z-high">
      <div class="card modal-xl animate-scale-up">
        <div class="modal-header">
          <h3>
            {{
              isEditingTest
                ? t("courseManagement.editTestToLesson")
                : t("courseManagement.testToLesson")
            }}: {{ targetLesson?.title }}
          </h3>
          <button @click="showCreateTest = false" class="btn-close">
            &times;
          </button>
        </div>

        <form @submit.prevent="createTest" class="modal-body flex-col">
          <div class="form-section">
            <div class="form-row">
              <div class="input-group full-width">
                <label>{{ t("courseManagement.testName") }}</label>
                <input v-model="newTest.title" class="input-field" required />
              </div>
              <div class="input-group">
                <label>{{ t("courseManagement.timer") }}</label>
                <input
                  type="number"
                  v-model="newTest.time_limit"
                  :placeholder="t('courseManagement.noTimer')"
                  class="input-field"
                />
              </div>
              <div class="input-group">
                <label>{{ t("testManagement.categoryLabel") }}</label>
                <select v-model="newTest.category" class="input-field">
                  <option value="standard">
                    {{ t("testManagement.categoryStandard") }}
                  </option>
                  <option value="bil">
                    {{ t("testManagement.categoryBIL") }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="questions-section">
            <h4 style="color: var(--primary-color); margin-bottom: 15px">
              {{ t("courseManagement.questions") }} ({{
                newTest.questions.length
              }})
            </h4>
            <div
              v-for="(q, index) in newTest.questions"
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
                    <span v-if="!q.image_url"
                      >📷 {{ t("courseManagement.photo") }}</span
                    >
                    <span v-else>🔄</span>
                    <input
                      type="file"
                      @change="uploadImage($event, q)"
                      accept="image/*"
                      hidden
                    />
                  </label>
                  <div v-if="q.image_url" class="image-preview">
                    <img :src="q.image_url" />
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
                        <span>📷</span>
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
              @click="showCreateTest = false"
              class="btn-secondary"
            >
              {{ t("courseManagement.cancel") }}
            </button>
            <button type="submit" class="btn-primary btn-lg">
              {{ t("courseManagement.saveTest") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import api from "../api";
import { useToast } from "../composables/useToast";
import { useLanguage } from "../composables/useLanguage";

const toast = useToast();
const { t } = useLanguage();

const courses = ref([]);
const showAddCourse = ref(false);
const selectedCourse = ref(null);
const showAddLesson = ref(false);
const showCreateTest = ref(false);
const targetLesson = ref(null);
const isEditingLesson = ref(false);
const isEditingCourse = ref(false);
const isEditingTest = ref(false);
const courseEditData = reactive({ title: "", description: "" });
const currentUser = ref(JSON.parse(localStorage.getItem("user") || "{}"));
const newCourse = reactive({ title: "", description: "" });
const newLesson = reactive({
  id: null,
  title: "",
  video_urls: [""],
  solution_video_urls: [],
  materials: [],
});
const newTest = ref({
  id: null,
  title: "",
  time_limit: 15,
  is_standalone: false,
  category: "standard",
  questions: [],
});

const isAdmin = computed(() => currentUser.value.role === "admin");

const fetchCourses = async () => {
  const res = await api.get("/courses");
  courses.value = res.data;
};

const createCourse = async () => {
  await api.post("/courses", newCourse);
  showAddCourse.value = false;
  fetchCourses();
  newCourse.title = "";
  newCourse.description = "";
  toast.success(t("courseManagement.successCourseCreated"));
};

const editCourse = async (course) => {
  const res = await api.get(`/courses/${course.id}`);
  selectedCourse.value = res.data;
};

const openAddLessonModal = () => {
  isEditingLesson.value = false;
  newLesson.id = null;
  newLesson.title = "";
  newLesson.video_urls = [""];
  newLesson.solution_video_urls = [];
  newLesson.materials = [];
  showAddLesson.value = true;
};

const startEditLesson = (lesson) => {
  newLesson.id = lesson.id;
  newLesson.title = lesson.title;
  newLesson.video_urls =
    lesson.video_urls && lesson.video_urls.length
      ? [...lesson.video_urls]
      : [""];
  newLesson.solution_video_urls =
    lesson.solution_video_urls && lesson.solution_video_urls.length
      ? [...lesson.solution_video_urls]
      : [];
  newLesson.materials =
    lesson.materials && lesson.materials.length ? [...lesson.materials] : [];
  isEditingLesson.value = true;
  showAddLesson.value = true;
};

const addLesson = async () => {
  const payload = {
    title: newLesson.title,
    video_urls: newLesson.video_urls.filter((u) => u.trim()),
    solution_video_urls: newLesson.solution_video_urls.filter((u) => u.trim()),
    materials: newLesson.materials,
  };

  if (isEditingLesson.value) {
    await api.put(`/lessons/${newLesson.id}`, payload);
    toast.success(t("courseManagement.successLessonUpdated"));
  } else {
    await api.post(`/courses/${selectedCourse.value.id}/lessons`, payload);
    toast.success(t("courseManagement.successLessonAdded"));
  }

  showAddLesson.value = false;
  editCourse(selectedCourse.value);
};

const handleDeleteLesson = async (lesson) => {
  if (!confirm(t("courseManagement.confirmDeleteLesson"))) return;
  try {
    await api.delete(`/lessons/${lesson.id}`);
    toast.success(t("courseManagement.successLessonDeleted"));
    editCourse(selectedCourse.value);
  } catch (err) {
    toast.error("Error: " + err.message);
  }
};

const duplicateLesson = async (lesson) => {
  try {
    const payload = {
      title: `${lesson.title} (Копия)`,
      video_urls: lesson.video_urls ? [...lesson.video_urls] : [],
      solution_video_urls: lesson.solution_video_urls ? [...lesson.solution_video_urls] : [],
      materials: lesson.materials ? [...lesson.materials] : [],
    };
    await api.post(`/courses/${selectedCourse.value.id}/lessons`, payload);
    toast.success("Урок успешно скопирован");
    editCourse(selectedCourse.value);
  } catch (err) {
    toast.error("Ошибка при копировании урока: " + err.message);
  }
};

const createEmptyQuestion = () => ({
  text: "",
  image_url: "",
  options: [
    { text: "", image_url: "" },
    { text: "", image_url: "" },
    { text: "", image_url: "" },
    { text: "", image_url: "" },
  ],
  correct_option_index: 0,
});

const attachTest = (lesson) => {
  targetLesson.value = lesson;
  isEditingTest.value = false;
  newTest.value = {
    id: null,
    title: `${t("courseManagement.testToLesson")}: ${lesson.title}`,
    time_limit: 15,
    is_standalone: false,
    category: "standard",
    questions: [createEmptyQuestion()],
  };
  showCreateTest.value = true;
};

const editLessonTest = async (lesson) => {
  try {
    const res = await api.get(`/tests/${lesson.Test.id}`);
    const data = res.data;
    newTest.value = {
      ...data,
      questions: data.Questions || data.questions || [],
    };
    targetLesson.value = lesson;
    isEditingTest.value = true;
    showCreateTest.value = true;
  } catch (err) {
    toast.error("Error: " + err.message);
  }
};

const createTest = async () => {
  try {
    const payload = {
      title: newTest.value.title,
      time_limit: newTest.value.time_limit,
      is_standalone: false,
      category: newTest.value.category,
      lessonId: targetLesson.value.id,
      questions: newTest.value.questions.map((q) => ({
        text: q.text,
        image_url: q.image_url,
        options: q.options.map((o) => ({
          text: o.text,
          image_url: o.image_url,
        })),
        correct_option_index: q.correct_option_index,
      })),
    };

    if (isEditingTest.value) {
      await api.put(`/tests/${newTest.value.id}`, payload);
      toast.success(t("courseManagement.successTestUpdated"));
    } else {
      await api.post("/tests", payload);
      toast.success(t("courseManagement.successTestCreated"));
    }
    showCreateTest.value = false;
    editCourse(selectedCourse.value);
  } catch (err) {
    toast.error("Error: " + err.message);
  }
};

const handleDeleteLessonTest = async (testId) => {
  if (!confirm(t("courseManagement.confirmDeleteTest"))) return;
  try {
    await api.delete(`/tests/${testId}`);
    toast.success(t("courseManagement.successTestDeleted"));
    editCourse(selectedCourse.value);
  } catch (err) {
    toast.error("Error: " + err.message);
  }
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
    toast.success(t("courseManagement.successPhotoUploaded"));
  } catch (err) {
    toast.error("Error: " + err.message);
  }
};
const uploadMaterial = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    newLesson.materials.push({
      name: file.name.replace(".pdf", ""),
      url: res.data.url,
    });
    toast.success(t("courseManagement.successMaterialUploaded"));
  } catch (err) {
    toast.error("Error: " + err.message);
  }
};

const startEditCourse = () => {
  courseEditData.title = selectedCourse.value.title;
  courseEditData.description = selectedCourse.value.description;
  isEditingCourse.value = true;
};

const saveCourseEdit = async () => {
  try {
    await api.put(`/courses/${selectedCourse.value.id}`, courseEditData);
    selectedCourse.value.title = courseEditData.title;
    selectedCourse.value.description = courseEditData.description;
    toast.success(t("courseManagement.successCourseUpdated"));
    isEditingCourse.value = false;
    fetchCourses();
  } catch (err) {
    toast.error("Error: " + err.message);
  }
};

const deleteCourse = async (course) => {
  if (!confirm(t("courseManagement.confirmDeleteCourse"))) return;
  try {
    await api.delete(`/courses/${course.id}`);
    toast.success(t("courseManagement.successCourseDeleted"));
    fetchCourses();
  } catch (err) {
    toast.error("Error: " + err.message);
  }
};

const addQuestion = () => newTest.value.questions.push(createEmptyQuestion());
const removeQuestion = (index) => newTest.value.questions.splice(index, 1);

onMounted(fetchCourses);
</script>

<style scoped>
/* Common & Reset */
.title-lg {
  font-size: 1.8rem;
  font-weight: 800;
  color: #333;
  letter-spacing: -0.5px;
}
.header-section {
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

/* Buttons */
.btn-primary {
  background: var(--gradient-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  box-shadow: 0 4px 12px var(--primary-glow);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px var(--primary-glow-strong);
}
.btn-lg {
  padding: 12px 24px;
  font-size: 1.1rem;
}
.btn-full {
  width: 100%;
  padding: 14px;
  font-size: 1.1rem;
}
.btn-secondary {
  background: #f1f3f5;
  color: #333;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.btn-secondary:hover {
  background: #e9ecef;
}
.btn-outline {
  width: 100%;
  padding: 12px;
  background: white;
  border: 2px solid rgba(230, 45, 149, 0.2);
  color: var(--primary-color);
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}
.btn-outline:hover {
  border-color: var(--primary-color);
  background: var(--primary-light);
}
.btn-close {
  font-size: 2rem;
  background: none;
  border: none;
  color: #bbb;
  cursor: pointer;
  line-height: 1;
}
.btn-close:hover {
  color: #555;
}
.btn-add-question:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: #fff;
}
.btn-delete {
  background: #ffebee;
  color: #c62828;
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
  background: #ffcdd2;
  transform: scale(1.05);
}
.btn-icon-blue {
  background: #fdf2f8;
  color: var(--primary-color);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
  flex-shrink: 0;
}
.btn-icon-blue:hover {
  background: #fce7f3;
}
.btn-icon-danger {
  background: #ffebee;
  color: #c62828;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
  flex-shrink: 0;
}
.btn-icon-danger:hover {
  background: #ffcdd2;
}
.btn-icon-danger.small {
  width: 24px;
  height: 24px;
  font-size: 0.8rem;
}
.btn-icon-blue.small {
  width: 24px;
  height: 24px;
  font-size: 0.8rem;
}
.btn-text-blue {
  background: none;
  border: none;
  color: var(--primary-color);
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0;
}
.btn-text-blue:hover {
  opacity: 0.7;
}
.btn-text-danger {
  background: none;
  border: none;
  color: #ff4d4d;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0;
}
.btn-text-danger:hover {
  opacity: 0.7;
}

/* Course Grid */
.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
}
.course-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: 0.3s;
  height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-top: 5px solid var(--primary-color);
}
.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}
.card-content h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
  color: #333;
}
.card-content p {
  color: #777;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}
.z-high {
  z-index: 1100;
}
.modal {
  width: 450px;
  background: white;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}
.modal-xl {
  width: 95%;
  max-width: 1200px;
  height: 85vh;
  background: white;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

.modal-header {
  padding: 20px 30px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
}
.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}
.modal-body {
  padding: 30px;
  overflow-y: auto;
  flex: 1;
  background: #fafafa;
}
.modal-footer {
  padding: 20px 30px;
  background: white;
  border-top: 1px solid #f0f0f0;
}

.flex-row-layout {
  display: flex;
  gap: 30px;
}
.flex-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Inputs */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}
.input-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.input-field {
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: 0.2s;
  background: #fff;
}
.input-field:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 3px var(--primary-glow);
}

/* Course Editor Specifics */
.course-info-sidebar {
  width: 250px;
  flex-shrink: 0;
  background: white;
  padding: 20px;
  border-radius: 12px;
  height: fit-content;
  border: 1px solid #eee;
}
.course-content-area {
  flex: 1;
  min-width: 0;
}
.section-title {
  font-size: 1.2rem;
  color: #444;
  margin: 0;
}
.stat-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
}
.stat-box span {
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary-color);
}
.desc {
  color: #666;
  line-height: 1.6;
  font-size: 0.95rem;
}

.lesson-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.lesson-item {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #eee;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
  transition: 0.2s;
}
.lesson-item:hover {
  transform: translateX(4px);
  border-color: rgba(230, 45, 149, 0.35);
  box-shadow: 0 4px 14px rgba(230, 45, 149, 0.08);
}
.lesson-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  min-width: 0;
}
.lesson-main {
  display: flex;
  gap: 16px;
  align-items: center;
  flex: 1;
  min-width: 0;
}
.lesson-icon {
  font-size: 1.05rem;
  font-weight: 700;
  background: #fdf2f8;
  color: var(--primary-color);
  border: 1px solid rgba(230, 45, 149, 0.25);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  min-width: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  white-space: nowrap;
  line-height: 1;
  padding: 0;
}
.lesson-info {
  flex: 1;
  min-width: 0;
}
.lesson-title {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
  word-break: break-word;
}
.link-sm {
  color: var(--primary-color);
  font-size: 0.85rem;
  text-decoration: none;
  font-weight: 600;
}
.lesson-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}
.test-badge-wrapper {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-shrink: 0;
}
.test-badge {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  white-space: nowrap;
  flex-shrink: 0;
}
.test-badge.bil-test {
  background: #fef2f2;
  color: #991b1b;
  border-color: #fecaca;
}
.test-badge-actions {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
  align-items: center;
}
.small-circle {
  width: 32px !important;
  height: 32px !important;
  min-width: 32px;
  font-size: 0.85rem !important;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
  border: 2px dashed #eee;
  border-radius: 12px;
}

/* Question Styles (Reused from TestManagement) */
.form-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #eee;
  margin-bottom: 20px;
}
.form-row {
  display: flex;
  gap: 20px;
}
.full-width {
  flex: 2;
}
.question-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #eee;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}
.question-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.q-number {
  font-weight: 700;
  color: var(--primary-color);
}
.btn-icon-danger {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #ffebee;
  color: #c62828;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}
.btn-icon-danger.small {
  width: 28px;
  height: 28px;
  font-size: 0.8rem;
  flex-shrink: 0;
}
.grow {
  flex: 1;
}
.flex {
  display: flex;
}
.gap-2 {
  gap: 8px;
}
.mb-2 {
  margin-bottom: 8px;
}
.question-main {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}
.q-input {
  flex: 1;
}
.image-uploader,
.mini-uploader {
  display: flex;
  gap: 10px;
  align-items: center;
}
.upload-btn {
  background: #f0f0f0;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px dashed #ccc;
}
.upload-btn.has-image {
  background: #fdf2f8;
  color: var(--primary-color);
  border-color: var(--primary-color);
}
.image-preview {
  width: 50px;
  height: 50px;
  position: relative;
  border-radius: 6px;
  overflow: hidden;
}
.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.btn-remove-img {
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  width: 15px;
  height: 15px;
  font-size: 10px;
  cursor: pointer;
}
.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}
.option-item {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 2px solid transparent;
}
.option-item.correct {
  background: #e8f5e9;
  border-color: #4caf50;
}
.option-marker {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-weight: 700;
}
.radio-circle {
  width: 18px;
  height: 18px;
  border: 2px solid #ccc;
  border-radius: 50%;
}
.option-item.correct .radio-circle {
  background: #4caf50;
  border-color: #4caf50;
}
.option-content {
  flex: 1;
  display: flex;
  gap: 5px;
  align-items: center;
}
.opt-input {
  flex: 1;
  padding: 6px;
  font-size: 0.9rem;
}
.mini-upload-btn {
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.6;
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

/* Animations */
.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}
@keyframes scaleUp {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
/* Responsive */
@media (max-width: 992px) {
  .flex-row-layout {
    flex-direction: column;
  }
  .course-info-sidebar {
    width: 100%;
    order: 2;
  }
  .course-content-area {
    order: 1;
  }
  .modal-xl {
    width: 100%;
    height: 100%;
    border-radius: 0;
    border: none;
  }
}

@media (max-width: 820px) {
  .course-grid {
    grid-template-columns: 1fr;
  }
  .modal-header h3 {
    font-size: 1.2rem;
  }
  .modal-body {
    padding: 15px;
  }
  .lesson-row {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  .lesson-actions {
    width: 100%;
    justify-content: space-between;
    border-top: 1px dashed #eee;
    padding-top: 10px;
  }
}
</style>
