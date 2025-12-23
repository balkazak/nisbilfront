<template>
  <div>
    <div class="header-section flex justify-between items-center">
      <h2 class="title-lg">Курсы и Контент</h2>
      <button v-if="isAdmin" @click="showAddCourse = true" class="btn-primary btn-lg">+ Новый Курс</button>
    </div>

    <!-- Course List -->
    <div class="course-grid">
      <div v-for="course in courses" :key="course.id" class="card course-card">
        <div class="card-content">
           <h3>{{ course.title }}</h3>
           <p>{{ course.description || 'Нет описания' }}</p>
        </div>
        <div class="flex gap-2 mt-auto">
             <button @click="editCourse(course)" class="btn-outline grow">Управление</button>
             <button v-if="isAdmin" @click="deleteCourse(course)" class="btn-delete" title="Удалить">🗑</button>
        </div>
      </div>
    </div>

    <!-- Add Course Modal -->
    <div v-if="showAddCourse" class="modal-overlay">
      <div class="card modal animate-scale-up">
        <div class="modal-header">
           <h3>Создание Курса</h3>
           <button @click="showAddCourse = false" class="btn-close">&times;</button>
        </div>
        <form @submit.prevent="createCourse" class="modal-body">
          <div class="input-group">
              <label>Название Курса</label>
              <input v-model="newCourse.title" placeholder="Введите название" class="input-field" required />
          </div>
          <div class="input-group">
              <label>Описание</label>
              <textarea v-model="newCourse.description" placeholder="Краткое описание курса" class="input-field" rows="3"></textarea>
          </div>
          <div class="modal-footer">
            <button type="submit" class="btn-primary btn-full">Создать Курс</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Course Editor (Lessons & Tests) -->
    <div v-if="selectedCourse" class="modal-overlay">
      <div class="card modal-xl animate-scale-up">
        <div class="modal-header">
           <h3>{{ selectedCourse.title }}</h3>
           <button @click="selectedCourse = null" class="btn-close">&times;</button>
        </div>
        
        <div class="modal-body flex-row-layout">
           <!-- Sidebar Info -->
            <div class="course-info-sidebar">
                <div class="flex justify-between items-center mb-2">
                    <h4>Информация</h4>
                    <button @click="startEditCourse" class="btn-icon-blue" title="Редактировать курс">✎</button>
                </div>
                <div v-if="!isEditingCourse">
                    <p class="desc">{{ selectedCourse.description || 'Нет описания' }}</p>
                </div>
                <div v-else class="edit-course-form">
                    <input v-model="courseEditData.title" class="input-field mb-2" placeholder="Название" />
                    <textarea v-model="courseEditData.description" class="input-field mb-2" placeholder="Описание" rows="3"></textarea>
                    <div class="flex gap-2">
                        <button @click="saveCourseEdit" class="btn-primary btn-sm grow">OK</button>
                        <button @click="isEditingCourse = false" class="btn-secondary btn-sm">X</button>
                    </div>
                </div>
                <div class="stat-box">
                   <span>{{ selectedCourse.Lessons ? selectedCourse.Lessons.length : 0 }}</span>
                   <small>Уроков</small>
                </div>
            </div>

           <!-- Content Area -->
           <div class="course-content-area">
               <div class="flex justify-between items-center mb-4">
                  <h4 class="section-title">Список Уроков</h4>
                  <button @click="showAddLesson = true" class="btn-primary">+ Добавить Видео-Урок</button>
               </div>

               <div v-if="!selectedCourse.Lessons || selectedCourse.Lessons.length === 0" class="empty-state">
                  <p>В этом курсе пока нет уроков.</p>
               </div>

               <ul class="lesson-list">
                 <li v-for="lesson in selectedCourse.Lessons" :key="lesson.id" class="lesson-item">
                    <div class="lesson-row">
                        <div class="lesson-main">
                            <span class="lesson-icon">🎥</span>
                            <div>
                                <strong>{{ lesson.title }}</strong>
                                <div class="flex gap-2 mt-1">
                                    <button @click="startEditLesson(lesson)" class="btn-text-blue">Изменить</button>
                                    <button @click="deleteLesson(lesson)" class="btn-text-danger">Удалить</button>
                                </div>
                            </div>
                        </div>
                        
                         <div class="lesson-actions">
                            <div v-if="lesson.Test" class="test-badge-wrapper">
                               <div class="test-badge">
                                   <span>✅ Тест прикреплен</span>
                                   <small v-if="lesson.Test.time_limit">⏱ {{ lesson.Test.time_limit }} мин</small>
                               </div>
                               <div class="test-badge-actions">
                                   <button @click="editLessonTest(lesson)" class="btn-icon-blue small-circle" title="Изменить тест">✎</button>
                                   <button @click="deleteLessonTest(lesson.Test.id)" class="btn-icon-danger small-circle" title="Удалить тест">✕</button>
                               </div>
                            </div>
                            <button v-else @click="attachTest(lesson)" class="btn-secondary btn-sm">+ Создать Тест</button>
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
              <h3>{{ isEditingLesson ? 'Редактирование Урока' : 'Новый Урок' }}</h3>
              <button @click="showAddLesson = false" class="btn-close">&times;</button>
          </div>
          <form @submit.prevent="addLesson" class="modal-body">
             <div class="input-group">
                 <label>Название Урока</label>
                 <input v-model="newLesson.title" placeholder="Введите тему урока" class="input-field" required />
             </div>
             
             <!-- Videos -->
             <div class="input-group">
                 <label>Видео уроки</label>
                 <div v-for="(v, idx) in newLesson.video_urls" :key="'v-'+idx" class="flex gap-2 mb-2">
                     <input v-model="newLesson.video_urls[idx]" placeholder="https://youtube.com/..." class="input-field grow" required />
                     <button type="button" @click="newLesson.video_urls.splice(idx, 1)" class="btn-icon-danger small">x</button>
                 </div>
                 <button type="button" @click="newLesson.video_urls.push('')" class="btn-secondary btn-sm">+ Еще видео</button>
             </div>

             <!-- Solutions -->
             <div class="input-group">
                 <label>Разборы (доступно после сдачи)</label>
                 <div v-for="(s, idx) in newLesson.solution_video_urls" :key="'s-'+idx" class="flex gap-2 mb-2">
                     <input v-model="newLesson.solution_video_urls[idx]" placeholder="Ссылка на разбор" class="input-field grow" />
                     <button type="button" @click="newLesson.solution_video_urls.splice(idx, 1)" class="btn-icon-danger small">x</button>
                 </div>
                 <button type="button" @click="newLesson.solution_video_urls.push('')" class="btn-secondary btn-sm">+ Еще разбор</button>
             </div>

             <div class="modal-footer">
                <button type="submit" class="btn-primary btn-full">{{ isEditingLesson ? 'Сохранить изменения' : 'Добавить Урок' }}</button>
             </div>
          </form>
       </div>
    </div>

    <!-- Create Test Modal (Reused Logic, Improved UI) -->
    <div v-if="showCreateTest" class="modal-overlay z-high">
       <div class="card modal-xl animate-scale-up">
          <div class="modal-header">
              <h3>{{ isEditingTest ? 'Редактирование теста' : 'Тест к уроку' }}: {{ targetLesson?.title }}</h3>
              <button @click="showCreateTest = false" class="btn-close">&times;</button>
          </div>
          
          <form @submit.prevent="createTest" class="modal-body flex-col">
             <div class="form-section">
                <div class="form-row">
                   <div class="input-group full-width">
                       <label>Название Теста</label>
                       <input v-model="newTest.title" class="input-field" required />
                   </div>
                   <div class="input-group">
                       <label>Таймер (мин)</label>
                       <input type="number" v-model="newTest.time_limit" placeholder="Без лимита" class="input-field" />
                   </div>
                </div>
             </div>
             
             <div class="questions-section">
                <h4 style="color: var(--primary-color); margin-bottom: 15px;">Вопросы</h4>
                <div v-for="(q, index) in newTest.questions" :key="index" class="question-card">
                   <div class="question-header">
                       <span class="q-number">Вопрос {{ index + 1 }}</span>
                       <button type="button" @click="removeQuestion(index)" class="btn-icon-danger">🗑</button>
                   </div>
                   
                   <div class="question-main">
                       <input v-model="q.text" placeholder="Текст вопроса" class="input-field q-input" :required="!q.image_url" />
                       <!-- Image Upload for Question -->
                       <div class="image-uploader">
                           <label class="upload-btn" :class="{ 'has-image': q.image_url }">
                              <span v-if="!q.image_url">📷 Фото</span>
                              <span v-else>🔄</span>
                              <input type="file" @change="uploadImage($event, q)" accept="image/*" hidden />
                           </label>
                           <div v-if="q.image_url" class="image-preview">
                               <img :src="q.image_url" />
                               <button type="button" @click="q.image_url = ''" class="btn-remove-img">&times;</button>
                           </div>
                       </div>
                   </div>
                   
                   <div class="options-grid">
                      <div v-for="(opt, oIndex) in q.options" :key="oIndex" class="option-item" :class="{ correct: q.correct_option_index === oIndex }">
                         <div class="option-marker" @click="q.correct_option_index = oIndex">
                             <div class="radio-circle"></div>
                             <span>{{ String.fromCharCode(65 + oIndex) }}</span>
                         </div>
                         <div class="option-content">
                             <input v-model="opt.text" :placeholder="'Вариант ' + (oIndex + 1)" class="input-field opt-input" />
                             <!-- Image Upload for Option -->
                             <div class="mini-uploader">
                                 <label class="mini-upload-btn">
                                     <span v-if="!opt.image_url">📷</span>
                                     <span v-else>🔄</span>
                                     <input type="file" @change="uploadImage($event, opt)" accept="image/*" hidden />
                                 </label>
                                 <img v-if="opt.image_url" :src="opt.image_url" class="mini-preview" />
                                 <button v-if="opt.image_url" type="button" @click="opt.image_url = ''" class="mini-remove">&times;</button>
                             </div>
                         </div>
                      </div>
                   </div>
                </div>
                <button type="button" @click="addQuestion" class="btn-add-question">+ Добавить вопрос</button>
             </div>

             <div class="modal-footer">
                <button type="button" @click="showCreateTest = false" class="btn-secondary">Отмена</button>
                <button type="submit" class="btn-primary btn-lg">{{ isEditingTest ? 'Сохранить изменения' : 'Сохранить Тест' }}</button>
             </div>
          </form>
       </div>
    </div>

  </div>
</template>

<script>
import api from '../api';
import { useToast } from '../composables/useToast';

export default {
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      courses: [],
      showAddCourse: false,
      selectedCourse: null,
      showAddLesson: false,
      showCreateTest: false,
      targetLesson: null,
      isEditingLesson: false,
      isEditingCourse: false,
      isEditingTest: false,
      courseEditData: { title: '', description: '' },
      currentUser: JSON.parse(localStorage.getItem('user') || '{}'),
      newCourse: { title: '', description: '' },
      newLesson: { title: '', video_urls: [''], solution_video_urls: [] },
      newTest: { title: '', time_limit: null, questions: [] }
    };
  },
  computed: {
    isAdmin() { return this.currentUser.role === 'admin'; }
  },
  mounted() { this.fetchCourses(); },
  methods: {
    async fetchCourses() {
      const res = await api.get('/courses');
      this.courses = res.data;
    },
    async createCourse() {
      await api.post('/courses', this.newCourse);
      this.showAddCourse = false;
      this.fetchCourses();
      this.newCourse = { title: '', description: '' };
    },
    async editCourse(course) {
       const res = await api.get(`/courses/${course.id}`);
       this.selectedCourse = res.data;
    },
    attachTest(lesson) {
       this.targetLesson = lesson;
       this.isEditingTest = false;
       this.showCreateTest = true;
       this.newTest = { 
           title: `Тест: ${lesson.title}`, 
           time_limit: 15,
           is_standalone: false,
           questions: [this.createEmptyQuestion()] 
       };
    },
    createEmptyQuestion() {
        return { 
            text: '', image_url: '', 
            options: [{ text: '', image_url: '' }, { text: '', image_url: '' }, { text: '', image_url: '' }, { text: '', image_url: '' }], 
            correct_option_index: 0 
        };
    },
    addQuestion() { this.newTest.questions.push(this.createEmptyQuestion()); },
    removeQuestion(index) { this.newTest.questions.splice(index, 1); },
    
    async uploadImage(event, targetObject) {
        const file = event.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            targetObject.image_url = res.data.url;
            this.toast.success('Фото загружено!');
        } catch (err) {
            this.toast.error('Ошибка загрузки фото: ' + err.message);
        }
    },

      async createTest() {
        try {
            const payload = { ...this.newTest, lessonId: this.targetLesson.id };
            if (this.isEditingTest) {
                await api.put(`/tests/${this.newTest.id}`, payload);
                this.toast.success('Тест обновлен');
            } else {
                await api.post('/tests', payload);
                this.toast.success('Тест создан');
            }
            this.showCreateTest = false;
            this.editCourse(this.selectedCourse);
        } catch (err) {
            this.toast.error('Ошибка сохранения теста: ' + err.message);
        }
    },
    async editLessonTest(lesson) {
        try {
            const res = await api.get(`/tests/${lesson.Test.id}`);
            this.newTest = res.data;
            if (!this.newTest.questions && this.newTest.Questions) {
                this.newTest.questions = this.newTest.Questions;
            }
            this.targetLesson = lesson;
            this.isEditingTest = true;
            this.showCreateTest = true;
        } catch (err) {
            this.toast.error('Ошибка загрузки теста: ' + err.message);
        }
    },
    async deleteLessonTest(testId) {
        if (!confirm('Вы уверены, что хотите удалить этот тест?')) return;
        try {
            await api.delete(`/tests/${testId}`);
            this.toast.success('Тест удален');
            this.editCourse(this.selectedCourse);
        } catch (err) {
            this.toast.error('Ошибка удаления теста: ' + err.message);
        }
    },
    async deleteCourse(course) {
        if(!confirm(`Вы уверены, что хотите удалить курс "${course.title}"? Это действие необратимо.`)) return;
        try {
            await api.delete(`/courses/${course.id}`);
            this.toast.success('Курс удален');
            this.fetchCourses();
        } catch (err) {
            this.toast.error('Ошибка удаления: ' + (err.response?.data?.message || err.message));
        }
    },
    // Lesson Edit/Delete
    startEditLesson(lesson) {
        this.newLesson = { 
            id: lesson.id,
            title: lesson.title, 
            video_urls: lesson.video_urls && lesson.video_urls.length ? [...lesson.video_urls] : [''], 
            solution_video_urls: lesson.solution_video_urls && lesson.solution_video_urls.length ? [...lesson.solution_video_urls] : [] 
        };
        this.isEditingLesson = true;
        this.showAddLesson = true;
    },
    async deleteLesson(lesson) {
        if (!confirm('Удалить этот урок?')) return;
        try {
            console.log(`Sending DELETE request to: /lessons/${lesson.id}`);
            const res = await api.delete(`/lessons/${lesson.id}`);
            console.log('DELETE response:', res.status, res.data);
            this.toast.success('Урок удален');
            this.editCourse(this.selectedCourse);
        } catch (err) {
            console.error('DELETE error:', err.response?.status, err.response?.data || err.message);
            this.toast.error('Ошибка: ' + err.message);
        }
    },
    // Adding/Overriding lesson method to handle edit
    async addLesson() {
       this.newLesson.video_urls = this.newLesson.video_urls.filter(u => u.trim());
       this.newLesson.solution_video_urls = this.newLesson.solution_video_urls.filter(u => u.trim());
       
       if (this.isEditingLesson) {
           console.log(`Sending PUT request to: /lessons/${this.newLesson.id}`);
           const res = await api.put(`/lessons/${this.newLesson.id}`, this.newLesson);
           console.log('PUT response:', res.status, res.data);
           this.toast.success('Урок обновлен');
       } else {
           await api.post(`/courses/${this.selectedCourse.id}/lessons`, this.newLesson);
           this.toast.success('Урок добавлен');
       }
       
       this.showAddLesson = false;
       this.isEditingLesson = false;
       this.editCourse(this.selectedCourse); 
       this.newLesson = { title: '', video_urls: [''], solution_video_urls: [] };
    },
    // Course Metadata Editing
    startEditCourse() {
        this.courseEditData = { title: this.selectedCourse.title, description: this.selectedCourse.description };
        this.isEditingCourse = true;
    },
    async saveCourseEdit() {
        try {
            await api.put(`/courses/${this.selectedCourse.id}`, this.courseEditData);
            this.selectedCourse.title = this.courseEditData.title;
            this.selectedCourse.description = this.courseEditData.description;
            this.toast.success('Курс обновлен');
            this.isEditingCourse = false;
            this.fetchCourses();
        } catch (err) {
            this.toast.error('Ошибка: ' + err.message);
        }
    }
  }
};
</script>

<style scoped>
/* Common & Reset */
.title-lg { font-size: 1.8rem; font-weight: 800; color: #333; letter-spacing: -0.5px; }
.header-section { margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 15px; }

/* Buttons */
.btn-primary { background: linear-gradient(135deg, #00BFFF 0%, #009ACD 100%); color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 6px rgba(0,191,255,0.2); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0,191,255,0.3); }
.btn-lg { padding: 12px 24px; font-size: 1.1rem; }
.btn-full { width: 100%; padding: 14px; font-size: 1.1rem; }
.btn-secondary { background: #f1f3f5; color: #333; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: 0.2s; }
.btn-secondary:hover { background: #e9ecef; }
.btn-outline { width: 100%; padding: 12px; background: white; border: 2px solid #e0f2fe; color: var(--primary-color); font-weight: 700; border-radius: 8px; cursor: pointer; transition: 0.2s; }
.btn-outline:hover { border-color: var(--primary-color); background: #f0faff; }
.btn-close { font-size: 2rem; background: none; border: none; color: #bbb; cursor: pointer; line-height: 1; }
.btn-close:hover { color: #555; }
.btn-add-question:hover { border-color: var(--primary-color); color: var(--primary-color); background: #fff; }
.btn-delete { background: #ffebee; color: #c62828; border: none; border-radius: 50%; width: 44px; height: 44px; cursor: pointer; font-size: 1.2rem; display: flex; justify-content: center; align-items: center; transition: 0.2s; flex-shrink: 0; }
.btn-delete:hover { background: #ffcdd2; transform: scale(1.05); }
.btn-icon-blue { background: #e3f2fd; color: var(--primary-color); border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; flex-shrink: 0; }
.btn-icon-blue:hover { background: #bbdefb; }
.btn-text-blue { background: none; border: none; color: var(--primary-color); font-weight: 600; font-size: 0.85rem; cursor: pointer; padding: 0; }
.btn-text-blue:hover { opacity: 0.7; }
.btn-text-danger { background: none; border: none; color: #ff4d4d; font-weight: 600; font-size: 0.85rem; cursor: pointer; padding: 0; }
.btn-text-danger:hover { opacity: 0.7; }

/* Course Grid */
.course-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; }
.course-card { background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); transition: 0.3s; height: 240px; display: flex; flex-direction: column; justify-content: space-between; border-top: 5px solid var(--primary-color); }
.course-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
.card-content h3 { font-size: 1.3rem; margin-bottom: 10px; color: #333; }
.card-content p { color: #777; font-size: 0.95rem; line-height: 1.5; }

/* Modals */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); z-index: 1000; display: flex; justify-content: center; align-items: center; }
.z-high { z-index: 1100; }
.modal { width: 450px; background: white; border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
.modal-xl { width: 95%; max-width: 1200px; height: 85vh; background: white; border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.25); }

.modal-header { padding: 20px 30px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between; align-items: center; background: #fff; }
.modal-header h3 { margin: 0; font-size: 1.5rem; color: #333; }
.modal-body { padding: 30px; overflow-y: auto; flex: 1; background: #fafafa; }
.modal-footer { padding: 20px 30px; background: white; border-top: 1px solid #f0f0f0; }

.flex-row-layout { display: flex; gap: 30px; }
.flex-col { display: flex; flex-direction: column; gap: 20px; }

/* Inputs */
.input-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; }
.input-group label { font-weight: 600; font-size: 0.9rem; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
.input-field { padding: 12px 15px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 1rem; transition: 0.2s; background: #fff; }
.input-field:focus { border-color: var(--primary-color); outline: none; box-shadow: 0 0 0 3px rgba(0,191,255,0.1); }

/* Course Editor Specifics */
.course-info-sidebar { width: 250px; flex-shrink: 0; background: white; padding: 20px; border-radius: 12px; height: fit-content; border: 1px solid #eee; }
.course-content-area { flex: 1; }
.section-title { font-size: 1.2rem; color: #444; margin: 0; }
.stat-box { display: flex; flex-direction: column; align-items: center; background: #f8f9fa; padding: 15px; border-radius: 8px; margin-top: 20px; }
.stat-box span { font-size: 2rem; font-weight: 800; color: var(--primary-color); }
.desc { color: #666; line-height: 1.6; font-size: 0.95rem; }

.lesson-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 15px; }
.lesson-item { background: white; padding: 20px; border-radius: 12px; border: 1px solid #eee; box-shadow: 0 2px 5px rgba(0,0,0,0.02); transition: 0.2s; }
.lesson-item:hover { transform: translateX(5px); border-color: #b3e5fc; }
.lesson-row { display: flex; justify-content: space-between; align-items: center; }
.lesson-main { display: flex; gap: 15px; align-items: center; }
.lesson-icon { font-size: 1.5rem; background: #e1f5fe; padding: 10px; border-radius: 50%; width: 50px; height: 50px; display: flex; justify-content: center; align-items: center; }
.link-sm { color: var(--primary-color); font-size: 0.85rem; text-decoration: none; font-weight: 600; }
.test-badge { background: #e8f5e9; color: #2e7d32; padding: 6px 12px; border-radius: 20px; font-weight: 600; font-size: 0.85rem; display: flex; flex-direction: column; align-items: flex-start; }
.test-badge-wrapper { display: flex; gap: 8px; align-items: center; }
.test-badge-actions { display: flex; gap: 4px; }
.small-circle { width: 30px !important; height: 30px !important; font-size: 0.8rem !important; }
.empty-state { text-align: center; padding: 40px; color: #999; border: 2px dashed #eee; border-radius: 12px; }

/* Question Styles (Reused from TestManagement) */
.form-section { background: white; padding: 20px; border-radius: 12px; border: 1px solid #eee; margin-bottom: 20px; }
.form-row { display: flex; gap: 20px; }
.full-width { flex: 2; }
.question-card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #eee; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
.question-header { display: flex; justify-content: space-between; margin-bottom: 15px; }
.q-number { font-weight: 700; color: var(--primary-color); }
.btn-icon-danger { width: 36px; height: 36px; border-radius: 50%; background: #ffebee; color: #c62828; border: none; cursor: pointer; display: flex; justify-content: center; align-items: center; flex-shrink: 0; }
.btn-icon-danger.small { width: 28px; height: 28px; font-size: 0.8rem; flex-shrink: 0; }
.grow { flex: 1; }
.flex { display: flex; }
.gap-2 { gap: 8px; }
.mb-2 { margin-bottom: 8px; }
.question-main { display: flex; gap: 15px; margin-bottom: 15px; }
.q-input { flex: 1; }
.image-uploader, .mini-uploader { display: flex; gap: 10px; align-items: center; }
.upload-btn { background: #f0f0f0; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-size: 0.9rem; font-weight: 600; border: 1px dashed #ccc; }
.upload-btn.has-image { background: #e1f5fe; color: var(--primary-color); border-color: var(--primary-color); }
.image-preview { width: 50px; height: 50px; position: relative; border-radius: 6px; overflow: hidden; }
.image-preview img { width: 100%; height: 100%; object-fit: cover; }
.btn-remove-img { position: absolute; top: 0; right: 0; background: rgba(0,0,0,0.5); color: white; border: none; width: 15px; height: 15px; font-size: 10px; cursor: pointer; }
.options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.option-item { background: #f8f9fa; padding: 10px; border-radius: 8px; display: flex; align-items: center; gap: 10px; border: 2px solid transparent; }
.option-item.correct { background: #e8f5e9; border-color: #4caf50; }
.option-marker { display: flex; align-items: center; gap: 10px; cursor: pointer; font-weight: 700; }
.radio-circle { width: 18px; height: 18px; border: 2px solid #ccc; border-radius: 50%; }
.option-item.correct .radio-circle { background: #4caf50; border-color: #4caf50; }
.option-content { flex: 1; display: flex; gap: 5px; align-items: center; }
.opt-input { flex: 1; padding: 6px; font-size: 0.9rem; }
.mini-upload-btn { font-size: 1.2rem; cursor: pointer; opacity: 0.6; }
.mini-upload-btn:hover { opacity: 1; transform: scale(1.1); }
.mini-preview { width: 30px; height: 30px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd; }

/* Animations */
.animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); }
@keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
/* Responsive */
@media (max-width: 992px) {
  .flex-row-layout { flex-direction: column; }
  .course-info-sidebar { width: 100%; order: 2; }
  .course-content-area { order: 1; }
  .modal-xl { width: 100%; height: 100%; border-radius: 0; border: none; }
}

@media (max-width: 768px) {
  .course-grid { grid-template-columns: 1fr; }
  .modal-header h3 { font-size: 1.2rem; }
  .modal-body { padding: 15px; }
  .lesson-row { flex-direction: column; align-items: flex-start; gap: 10px; }
  .test-badge { align-items: flex-start; }
}
</style>
