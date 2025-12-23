<template>
  <div>
    <div class="flex justify-between items-center header-section">
      <h2 class="title-lg">Управление Тестами</h2>
      <button v-if="isAdmin" @click="openCreateModal" class="btn-primary">+ Новый Тест</button>
    </div>

    <!-- Test List -->
    <div class="course-grid">
      <div v-for="test in tests" :key="test.id" class="card course-card">
        <h3>{{ test.title }}</h3>
        <p v-if="test.description">{{ test.description }}</p>
        <p class="text-muted" v-else>Нет описания</p>
        <div>
             <span class="badge-blue" v-if="test.time_limit">⏱ {{ test.time_limit }} мин</span>
             <span class="badge-gray" v-else>Без таймера</span>
        </div>
        <div class="flex gap-2 mt-auto">
             <button @click="editTest(test)" class="btn-outline grow">Редактировать</button>
             <button v-if="isAdmin" @click="deleteTest(test)" class="btn-delete" title="Удалить">🗑</button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Test Modal -->
    <div v-if="showTestModal" class="modal-overlay">
       <div class="card modal-xl animate-scale-up">
          <div class="modal-header">
              <h3>{{ isEditing ? 'Редактирование Теста' : 'Создание Теста' }}</h3>
              <button @click="showTestModal = false" class="btn-close">&times;</button>
          </div>
          
          <form @submit.prevent="saveTest" class="modal-body">
             <div class="form-section">
                 <div class="form-row">
                    <div class="input-group full-width">
                        <label>Название теста</label>
                        <input v-model="currentTest.title" placeholder="Например: Математика - Глава 1" class="input-field" required />
                    </div>
                    <div class="input-group">
                        <label>Время (минут)</label>
                        <input type="number" v-model="currentTest.time_limit" placeholder="Без лимита" class="input-field" />
                    </div>
                 </div>
                 <div class="input-group">
                    <label>Описание (опционально)</label>
                    <textarea v-model="currentTest.description" placeholder="Краткое описание" class="input-field" rows="2"></textarea>
                 </div>
             </div>
             
             <div class="questions-section">
                <h4 style="margin-bottom: 15px; color: var(--primary-color);">Вопросы ({{ currentTest.questions.length }})</h4>
                <div v-for="(q, index) in currentTest.questions" :key="index" class="question-card">
                   <div class="question-header">
                       <span class="q-number">Вопрос {{ index + 1 }}</span>
                       <button type="button" @click="removeQuestion(index)" class="btn-icon-danger" title="Удалить вопрос">🗑</button>
                   </div>
                   
                   <div class="question-main">
                       <input v-model="q.text" placeholder="Введите текст вопроса" class="input-field q-input" :required="!q.image_url" />
                       
                       <div class="image-uploader">
                           <label class="upload-btn" :class="{ 'has-image': q.image_url }">
                              <span v-if="!q.image_url">📷 Добавить фото</span>
                              <span v-else>🔄 Заменить фото</span>
                              <input type="file" @change="uploadImage($event, q)" accept="image/*" hidden />
                           </label>
                           <div v-if="q.image_url" class="image-preview">
                               <img :src="q.image_url" alt="Preview" />
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
                
                <button type="button" @click="addQuestion" class="btn-add-question">+ Добавить новый вопрос</button>
             </div>

             <div class="modal-footer">
                <button type="button" @click="showTestModal = false" class="btn-secondary">Отмена</button>
                <button type="submit" class="btn-primary">Сохранить Тест</button>
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
      tests: [],
      showTestModal: false,
      isEditing: false,
      currentUser: JSON.parse(localStorage.getItem('user') || '{}'),
      currentTest: { title: '', description: '', time_limit: null, is_standalone: true, questions: [] }
    };
  },
  computed: {
    isAdmin() { return this.currentUser.role === 'admin'; }
  },
  mounted() { this.fetchTests(); },
  methods: {
    async fetchTests() {
      const res = await api.get('/tests?is_standalone=true');
      this.tests = res.data;
    },
    openCreateModal() {
        this.isEditing = false;
        this.currentTest = { title: '', description: '', time_limit: null, is_standalone: true, questions: [this.createEmptyQuestion()] };
        this.showTestModal = true;
    },
    createEmptyQuestion() {
        return { 
            text: '', image_url: '', 
            options: [{ text: '', image_url: '' }, { text: '', image_url: '' }, { text: '', image_url: '' }, { text: '', image_url: '' }], 
            correct_option_index: 0 
        };
    },
    addQuestion() { this.currentTest.questions.push(this.createEmptyQuestion()); },
    removeQuestion(index) { this.currentTest.questions.splice(index, 1); },
    async editTest(test) {
        const res = await api.get(`/tests/${test.id}`);
        this.currentTest = res.data;
        if (!this.currentTest.questions && this.currentTest.Questions) this.currentTest.questions = this.currentTest.Questions;
        this.isEditing = true;
        this.showTestModal = true;
    },
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
    async saveTest() {
        try {
             // Clean up the payload - remove fields that shouldn't be sent
             const payload = {
                 title: this.currentTest.title,
                 description: this.currentTest.description,
                 time_limit: this.currentTest.time_limit,
                 is_standalone: this.currentTest.is_standalone,
                 questions: this.currentTest.questions.map(q => ({
                     text: q.text,
                     image_url: q.image_url,
                     options: q.options,
                     correct_option_index: q.correct_option_index,
                     score_value: q.score_value || 1
                 }))
             };

             if (this.isEditing) {
                 await api.put(`/tests/${this.currentTest.id}`, payload);
                 this.toast.success('Тест обновлен!');
             } else {
                 await api.post('/tests', payload);
                 this.toast.success('Тест создан!');
             }
             
             this.showTestModal = false;
             this.fetchTests();
        } catch (err) {
            this.toast.error('Ошибка: ' + (err.response?.data?.message || err.message));
        }
    },
    async deleteTest(test) {
        if(!confirm(`Вы уверены, что хотите удалить тест "${test.title}"?`)) return;
        try {
            await api.delete(`/tests/${test.id}`);
            this.toast.success('Тест удален');
            this.fetchTests();
        } catch(err) {
             this.toast.error('Ошибка: ' + (err.response?.data?.message || err.message));
        }
    }
  }
};
</script>

<style scoped>
/* General Layout */
.header-section { margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid #eaeaea; }
.title-lg { font-size: 1.8rem; color: #333; font-weight: 700; }
.course-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
.course-card { padding: 25px; display: flex; flex-direction: column; justify-content: space-between; height: 220px; border-top: 4px solid var(--primary-color); }
.text-muted { color: #888; font-size: 0.9rem; font-style: italic; }

/* Modal Styles */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 2000; backdrop-filter: blur(5px); }
.modal-xl { width: 95%; max-width: 1000px; height: 90vh; background: #fdfdfd; display: flex; flex-direction: column; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }

.modal-header { padding: 20px 30px; background: white; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { margin: 0; color: #333; font-weight: 700; }
.btn-close { background: none; border: none; font-size: 2rem; color: #999; cursor: pointer; line-height: 1; }
.btn-close:hover { color: #333; }

.modal-body { flex: 1; overflow-y: auto; padding: 30px; background: #fafafa; display: flex; flex-direction: column; gap: 30px; }
.modal-footer { padding: 20px 30px; background: white; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 15px; }

/* Form Elements */
.form-section { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); border: 1px solid #f0f0f0; }
.form-row { display: flex; gap: 20px; margin-bottom: 15px; }
.input-group { display: flex; flex-direction: column; gap: 8px; flex: 1; }
.input-group label { font-size: 0.85rem; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
.input-field { padding: 12px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 1rem; transition: border-color 0.2s; background: #fafafa; }
.input-field:focus { border-color: var(--primary-color); outline: none; background: white; box-shadow: 0 0 0 3px rgba(0, 191, 255, 0.1); }
.full-width { flex: 2; }

/* Questions Styles */
.questions-section { flex: 1; }
.question-card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); border: 1px solid #eee; margin-bottom: 25px; transition: transform 0.2s; }
.question-card:hover { border-color: #b3e5fc; }

.question-header { display: flex; justify-content: space-between; margin-bottom: 15px; }
.q-number { font-weight: 700; color: var(--primary-color); font-size: 1.1rem; }
.btn-icon-danger { width: 36px; height: 36px; border-radius: 50%; background: #ffebee; color: #d32f2f; border: none; cursor: pointer; display: flex; justify-content: center; align-items: center; transition: 0.2s; flex-shrink: 0; }
.btn-icon-danger:hover { background: #ffcdd2; transform: scale(1.1); }
.btn-delete { background: #ffebee; color: #c62828; border: none; border-radius: 50%; width: 44px; height: 44px; cursor: pointer; font-size: 1.2rem; display: flex; justify-content: center; align-items: center; transition: 0.2s; flex-shrink: 0; }
.btn-delete:hover { background: #ffcdd2; transform: scale(1.05); }
.grow { flex: 1; }

.question-main { display: flex; gap: 20px; margin-bottom: 20px; }
.q-input { flex: 1; font-weight: 500; font-size: 1.1rem; }

/* Image Uploaders */
.image-uploader { display: flex; align-items: center; gap: 10px; }
.upload-btn { background: #f0f0f0; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-size: 0.9rem; font-weight: 500; color: #555; transition: 0.2s; border: 1px dashed #ccc; display: inline-block; white-space: nowrap; }
.upload-btn:hover { background: #e0e0e0; border-color: #999; }
.upload-btn.has-image { background: #e3f2fd; color: var(--primary-color); border-color: var(--primary-color); }

.image-preview { position: relative; width: 60px; height: 60px; border-radius: 8px; overflow: hidden; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
.image-preview img { width: 100%; height: 100%; object-fit: cover; }
.btn-remove-img { position: absolute; top: 2px; right: 2px; background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; width: 16px; height: 16px; font-size: 10px; cursor: pointer; display: flex; justify-content: center; align-items: center; }

/* Options Grid */
.options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.option-item { background: #f8f9fa; padding: 10px 15px; border-radius: 10px; border: 2px solid transparent; display: flex; align-items: center; gap: 15px; transition: 0.2s; }
.option-item:hover { background: white; border-color: #e0e0e0; }
.option-item.correct { background: #e8f5e9; border-color: #4caf50; }

.option-marker { cursor: pointer; display: flex; align-items: center; gap: 10px; font-weight: 700; color: #555; }
.radio-circle { width: 20px; height: 20px; border: 2px solid #ccc; border-radius: 50%; position: relative; transition: 0.2s; }
.option-item.correct .radio-circle { border-color: #4caf50; background: #4caf50; }
.option-item.correct .radio-circle::after { content: '✔'; color: white; position: absolute; font-size: 12px; top: 0; left: 4px; }

.option-content { flex: 1; display: flex; align-items: center; gap: 10px; }
.opt-input { padding: 8px 12px; font-size: 0.95rem; background: white; }

.mini-uploader { display: flex; align-items: center; gap: 5px; }
.mini-upload-btn { cursor: pointer; font-size: 1.2rem; opacity: 0.6; transition: 0.2s; }
.mini-upload-btn:hover { opacity: 1; transform: scale(1.1); }
.mini-preview { width: 30px; height: 30px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd; }
.mini-remove { background: none; border: none; color: #ff4d4d; cursor: pointer; font-weight: bold; }

.btn-add-question { width: 100%; padding: 15px; background: white; border: 2px dashed #ccc; color: #666; font-weight: 600; border-radius: 12px; cursor: pointer; transition: 0.2s; }
.btn-add-question:hover { border-color: var(--primary-color); color: var(--primary-color); background: #f0faff; }

.btn-primary { background: var(--primary-color); color: white; padding: 12px 25px; border-radius: 8px; font-weight: 600; border: none; cursor: pointer; transition: 0.2s; }
.btn-primary:hover { background: #009ACD; transform: translateY(-1px); }
.btn-secondary { background: #f0f0f0; color: #333; padding: 12px 25px; border-radius: 8px; font-weight: 600; border: none; cursor: pointer; transition: 0.2s; }
.btn-secondary:hover { background: #e0e0e0; }

.badge-blue { background: #e1f5fe; color: #0288d1; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
.badge-gray { background: #eff0f1; color: #6c757d; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; }

.animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); }
@keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
/* Responsive */
@media (max-width: 768px) {
  .test-grid { grid-template-columns: 1fr; }
  .modal-content { width: 95%; padding: 15px; margin: 10px auto; overflow-y: auto; max-height: 90vh; }
  .question-main { flex-direction: column; }
  .options-grid { grid-template-columns: 1fr; }
}
</style>
