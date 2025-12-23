<template>
  <div class="test-runner-container">
    
    <!-- Result Screen -->
    <div v-if="showResult" class="result-screen animate-fade-in">
       <div class="result-card">
          <div class="result-icon">🏆</div>
          <h2>Тест Завершен!</h2>
          <p class="result-subtitle">Ваш результат:</p>
          <div class="score-display">
             <span class="score-value">{{ resultData.score }}</span>
             <span class="score-total">/ {{ resultData.max_score }}</span>
          </div>
          <p class="motivational-text" v-if="percentage >= 80">Отличная работа! 🎉</p>
          <p class="motivational-text" v-else-if="percentage >= 50">Хороший результат! 👍</p>
          <p class="motivational-text" v-else>Можно лучше! 💪</p>
          
          <div class="flex gap-4 justify-center mt-6">
              <button @click="finish" class="btn-primary btn-lg">
                  {{ isStandalone ? 'Вернуться к списку' : 'Вернуться к уроку' }}
              </button>
          </div>
       </div>
    </div>

    <!-- Test Taking Screen -->
    <div v-else class="test-content">
        <div class="flex justify-between items-center mb-4 header sticky-header">
           <h3 class="test-title">{{ test.title }}</h3>
           <div v-if="timeLeft !== null" class="timer-badge" :class="{warning: timeLeft < 60}">
              ⏳ {{ formatTime(timeLeft) }}
           </div>
        </div>
        
        <div class="questions-list">
            <div v-for="(question, index) in test.Questions" :key="question.id" class="question-block animate-slide-up" :style="{animationDelay: index * 0.05 + 's'}">
               <div class="q-content">
                  <span class="q-number">Вопрос {{ index + 1 }}</span>
                  <p class="q-text">{{ question.text }}</p>
                  <div v-if="question.image_url" class="q-image-container">
                      <img :src="question.image_url" class="q-image" alt="Question Image" />
                  </div>
               </div>
               
               <div class="options-list">
                  <label v-for="(opt, oIndex) in question.options" :key="oIndex" class="option-label" :class="{selected: answers[question.id] === oIndex}">
                     <div class="radio-wrapper">
                        <input type="radio" :name="'q_'+question.id" :value="oIndex" v-model="answers[question.id]">
                        <div class="custom-radio"></div>
                     </div>
                     <div class="opt-content">
                         <span v-if="opt.text" class="opt-text">{{ opt.text }}</span>
                         <img v-if="opt.image_url" :src="opt.image_url" class="opt-image" alt="Option Image" />
                     </div>
                  </label>
               </div>
            </div>
        </div>

        <div class="footer-actions">
            <button @click="submitTest" class="btn-primary btn-xl">Завершить Тест</button>
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
  props: ['testId', 'isStandalone'],
  emits: ['completed', 'cancel'],
  data() {
    return {
      test: { Questions: [] },
      answers: {},
      timeLeft: null,
      timer: null,
      showResult: false,
      resultData: null
    };
  },
  computed: {
      percentage() {
          if (!this.resultData || !this.resultData.max_score) return 0;
          return (this.resultData.score / this.resultData.max_score) * 100;
      }
  },
  async mounted() {
    const res = await api.get(`/tests/${this.testId}`);
    this.test = res.data;
    if (this.test.time_limit) {
       this.timeLeft = this.test.time_limit * 60;
       this.timer = setInterval(() => {
          this.timeLeft--;
          if (this.timeLeft <= 0) {
             this.submitTest();
          }
       }, 1000);
    }
  },
  beforeUnmount() { if (this.timer) clearInterval(this.timer); },
  methods: {
    formatTime(s) { const m = Math.floor(s / 60); const sc = s % 60; return `${m}:${sc < 10 ? '0' : ''}${sc}`; },
    async submitTest() {
       clearInterval(this.timer);
       try {
          const res = await api.post('/results', { testId: this.testId, details: this.answers });
          this.resultData = res.data;
          this.showResult = true;
          // Note: We do NOT emit completed here. We wait for user to click "Return".
       } catch (err) { alert('Ошибка: ' + err.message); }
    },
    finish() {
        this.$emit('completed');
    }
  }
};
</script>

<style scoped>
.test-runner-container { max-width: 900px; margin: 0 auto; padding-bottom: 50px; }

/* Result Screen */
.result-screen { display: flex; justify-content: center; align-items: center; min-height: 400px; text-align: center; }
.result-card { background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); width: 100%; max-width: 500px; animation: scaleUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.result-icon { font-size: 4rem; margin-bottom: 20px; }
.result-subtitle { color: #666; font-size: 1.1rem; margin-bottom: 10px; }
.score-display { font-size: 3rem; font-weight: 800; color: var(--primary-color); margin-bottom: 10px; }
.score-total { font-size: 1.5rem; color: #999; font-weight: 500; }
.motivational-text { font-size: 1.2rem; color: #333; font-weight: 600; }

/* Test Header */
.header { background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); padding: 15px 20px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
.sticky-header { position: sticky; top: 0; z-index: 100; }
.test-title { font-size: 1.4rem; color: #333; margin: 0; font-weight: 700; }
.timer-badge { font-size: 1.1rem; font-weight: bold; background: #e3f2fd; color: #0277bd; padding: 8px 16px; border-radius: 30px; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.timer-badge.warning { background: #ffebee; color: #c62828; animation: pulse-red 1s infinite; }

/* Questions */
.questions-list { display: flex; flex-direction: column; gap: 30px; }
.question-block { background: white; padding: 30px; border-radius: 16px; border: 1px solid #f0f0f0; box-shadow: 0 4px 15px rgba(0,0,0,0.02); transition: transform 0.2s; }
.question-block:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.05); }

.q-content { margin-bottom: 25px; }
.q-number { display: block; font-size: 0.85rem; text-transform: uppercase; font-weight: 700; color: var(--primary-color); margin-bottom: 8px; letter-spacing: 1px; }
.q-text { font-size: 1.25rem; font-weight: 600; color: #222; line-height: 1.5; margin-bottom: 15px; }
.q-image-container { margin-top: 15px; border-radius: 12px; overflow: hidden; border: 1px solid #eee; display: inline-block; }
.q-image { max-width: 100%; max-height: 400px; display: block; }

/* Options */
.options-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
.option-label { display: flex; align-items: flex-start; padding: 20px; background: #f8f9fa; border: 2px solid transparent; border-radius: 12px; cursor: pointer; transition: all 0.2s; position: relative; }
.option-label:hover { background: #fff; border-color: #b3e5fc; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.option-label.selected { background: #e1f5fe; border-color: var(--primary-color); box-shadow: 0 4px 12px rgba(2, 119, 189, 0.15); }

.radio-wrapper { min-width: 24px; margin-right: 15px; margin-top: 2px; position: relative; }
.option-label input { position: absolute; opacity: 0; cursor: pointer; }
.custom-radio { width: 22px; height: 22px; border: 2px solid #ccc; border-radius: 50%; position: relative; transition: 0.2s; background: white; }
.option-label:hover .custom-radio { border-color: var(--primary-color); }
.option-label.selected .custom-radio { border-color: var(--primary-color); background: var(--primary-color); }
.option-label.selected .custom-radio::after { content: ''; position: absolute; top: 6px; left: 6px; width: 6px; height: 6px; background: white; border-radius: 50%; }

.opt-content { display: flex; flex-direction: column; gap: 10px; width: 100%; }
.opt-text { font-size: 1.05rem; font-weight: 500; color: #444; line-height: 1.4; }
.opt-image { max-width: 100%; border-radius: 8px; border: 1px solid #ddd; object-fit: contain; max-height: 200px; }

/* Buttons */
.footer-actions { margin-top: 40px; display: flex; justify-content: flex-end; }
.btn-primary { background: linear-gradient(135deg, #00BFFF 0%, #009ACD 100%); color: white; border: none; padding: 12px 25px; border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 10px rgba(0,191,255,0.3); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,191,255,0.4); }
.btn-lg { padding: 15px 40px; font-size: 1.1rem; }
.btn-xl { padding: 18px 50px; font-size: 1.2rem; width: 100%; border-radius: 16px; }

/* Animations */
.animate-fade-in { animation: fadeIn 0.5s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) forwards; opacity: 0; transform: translateY(30px); }
@keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
@keyframes pulse-red { 0% { box-shadow: 0 0 0 0 rgba(198, 40, 40, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(198, 40, 40, 0); } 100% { box-shadow: 0 0 0 0 rgba(198, 40, 40, 0); } }
@keyframes scaleUp { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }

/* Responsive */
@media (min-width: 768px) {
    .btn-xl { width: auto; }
}
</style>
