<template>
  <div class="tariffs-page">
    <MainHeader />

    <main class="container">
      <div class="hero-section animate-fade-in-up">
        <h1>Выберите тариф</h1>
      </div>

      <div class="pricing-grid animate-fade-in-up delay-1">
        <div v-for="plan in pricingPlans" :key="plan.id" 
             class="pricing-card" 
             :class="{ 'active': form.plan === plan.id, 'featured': plan.id === 'annual' }"
             @click="form.plan = plan.id">
          <div class="card-header">
            <h2 class="plan-name">{{ plan.name }}</h2>
            <div v-if="plan.originalPrice" class="original-price">
              {{ plan.originalPrice.toLocaleString() }} 〒
            </div>
            <div class="current-price">
              <span>{{ plan.price.toLocaleString() }} 〒</span>
            </div>
          </div>

          <div class="features-list">
            <div v-for="(feature, index) in plan.features.included" :key="'inc-'+index" class="feature-item included">
              <span class="icon">✓</span> {{ feature }}
            </div>
          </div>
        </div>
      </div>

      <div class="application-section animate-fade-in-up delay-2">
        <div class="card application-card">
          <h2>Оставить заявку</h2>
          <form @submit.prevent="submitApplication" class="app-form">
            <div class="form-row">
              <div class="form-group" style="grid-column: span 2;">
                <label>Номер телефона</label>
                <input type="tel" v-model="form.phone" @input="formatPhone" required placeholder="+7 (700) 000-00-00" />
              </div>
            </div>
            <div class="form-group">
              <label>Выбранный тариф</label>
              <select v-model="form.plan" required>
                <option value="" disabled>Выберите тариф</option>
                <option v-for="plan in pricingPlans" :key="plan.id" :value="plan.id">
                  {{ plan.name }} - {{ plan.price.toLocaleString() }} 〒
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Комментарий (необязательно)</label>
              <textarea v-model="form.comment" placeholder="Ваш комментарий или вопрос..." rows="3" style="padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px; outline: none; transition: 0.3s; font-size: 0.95rem;"></textarea>
            </div>
            <button type="submit" class="btn-submit" :disabled="loading">
              {{ loading ? 'Отправка...' : 'Отправить заявку' }}
            </button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useToast } from '../composables/useToast';
import MainHeader from '../components/MainHeader.vue';

export default {
  components: { MainHeader },
  setup() {
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      loading: false,
      form: {
        email: '',
        phone: '',
        plan: '',
        comment: ''
      },
      pricingPlans: [
        {
          id: "bil_online",
          name: "БИЛ Online",
          duration: "5 месяцев",
          price: 69000,
          originalPrice: 125000,
          features: {
            included: [
              "Подготовка к экзаменам БИЛ",
              "2 прямых эфира в неделю",
              "Доступ 24/7",
              "Система кураторства",
              "Ежемесячные конкурсные тесты",
              "Дополнительные материалы",
              "Видеоуроки: Мат, Логика, Каз"
            ]
          }
        },
        {
          id: "nzm_online",
          name: "НЗМ Online",
          duration: "3 месяца",
          price: 42000,
          originalPrice: 75000,
          features: {
            included: [
              "Подготовка к экзаменам НЗМ",
              "2 прямых эфира в неделю",
              "Доступ 24/7",
              "Система кураторства",
              "Ежемесячные конкурсные тесты",
              "Дополнительные материалы",
              "Видеоуроки: Мат, ЧХ, Ест"
            ]
          }
        },
        {
          id: "math_package",
          name: "Математика (БИЛ-НЗМ)",
          duration: "1 год",
          price: 19000,
          originalPrice: 53000,
          features: {
            included: [
              "Доступ 24/7",
              "53 тематических видео",
              "Тесты к каждой теме (15 вопр)",
              "Доступ на 1 год"
            ]
          }
        },
        {
          id: "logic_package",
          name: "Логика (БИЛ)",
          duration: "1 год",
          price: 14900,
          originalPrice: 20000,
          features: {
            included: [
              "Доступ 24/7",
              "20 тематических видео",
              "Тесты к каждой теме (15 вопр)",
              "Доступ на 1 год"
            ]
          }
        },
        {
          id: "bil_bundle",
          name: "БИЛ Пакет",
          duration: "1 год",
          price: 29900,
          originalPrice: 76000,
          features: {
            included: [
              "Доступ 24/7",
              "20 тематических видео",
              "Тесты к каждой теме (15 вопр)",
              "Доступ на 1 год"
            ]
          }
        }
      ]
    };
  },
  methods: {
    formatPhone(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.startsWith('7')) value = value.slice(1);
      
      let formatted = '+7 ';
      if (value.length > 0) formatted += '(' + value.substring(0, 3);
      if (value.length >= 4) formatted += ') ' + value.substring(3, 6);
      if (value.length >= 7) formatted += '-' + value.substring(6, 8);
      if (value.length >= 9) formatted += '-' + value.substring(8, 10);
      
      this.form.phone = formatted.trim();
    },
    async submitApplication() {
      if (!this.form.plan) {
        this.toast.error('Пожалуйста, выберите тариф');
        return;
      }
      this.loading = true;
      try {
        console.log('Submitting application:', this.form);
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.toast.success('Заявка успешно отправлена!');
        this.form = { email: '', phone: '', plan: '', comment: '' };
      } catch (error) {
        this.toast.error('Произошла ошибка при отправке заявки');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.tariffs-page {
  font-family: 'Inter', sans-serif;
  background-color: #f8fafc;
  min-height: 100vh;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 40px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo { font-size: 1.4rem; font-weight: 800; color: #00bfff; }

.nav-link {
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  padding: 6px 16px;
  border-radius: 20px;
  transition: 0.3s;
}

.nav-link:hover { background: #f1f5f9; color: #00bfff; }

.container { max-width: 900px; margin: 0 auto; padding: 30px 20px; }

.hero-section { text-align: center; margin-bottom: 30px; }
.hero-section h1 { font-size: 2rem; color: #1e293b; margin-bottom: 5px; }
.hero-section p { color: #64748b; font-size: 1rem; }

.pricing-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
  gap: 20px; 
  margin-bottom: 40px; 
}

.pricing-card { 
  background: white; 
  padding: 25px; 
  border-radius: 20px; 
  transition: 0.3s; 
  display: flex; 
  flex-direction: column; 
  cursor: pointer;
  border: 2px solid transparent;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.pricing-card:hover { transform: translateY(-3px); border-color: #e2e8f0; }

.pricing-card.active { border-color: #00bfff; background: #f0f9ff; }

.pricing-card.featured.active { border-color: #00bfff; }

.card-header { text-align: center; margin-bottom: 15px; }
.plan-name { font-size: 1.25rem; font-weight: 800; margin-bottom: 8px; color: #1e293b; }
.original-price { text-decoration: line-through; opacity: 0.6; font-size: 0.95rem; margin-bottom: 4px; color: #ef4444; }
.current-price { font-size: 1.8rem; font-weight: 900; color: #00bfff; }

.features-list { display: flex; flex-direction: column; gap: 8px; }
.feature-item { display: flex; gap: 8px; font-size: 0.9rem; color: #475569; }
.icon { font-weight: bold; color: #00bfff; }

.application-section { max-width: 600px; margin: 0 auto; }
.application-card { background: white; border-radius: 20px; padding: 25px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border-top: 4px solid #00bfff; }
.application-card h2 { text-align: center; margin-bottom: 20px; color: #1e293b; font-size: 1.5rem; }

.app-form { display: flex; flex-direction: column; gap: 15px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-weight: 600; color: #475569; font-size: 0.85rem; }
.form-group input, .form-group select {
  padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px; outline: none; transition: 0.3s; font-size: 0.95rem;
}
.form-group input:focus, .form-group select:focus {
  border-color: #00bfff; box-shadow: 0 0 0 3px rgba(0, 191, 255, 0.1);
}

.btn-submit {
  background: linear-gradient(90deg, #00bfff, #009ACD);
  color: white;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 5px;
}
.btn-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 15px rgba(0, 191, 255, 0.2); }
.btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }

@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fadeInUp 0.6s ease forwards; }
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }

@media (max-width: 768px) {
  .pricing-grid { grid-template-columns: 1fr; }
  .pricing-card.featured { transform: none; }
  .form-row { grid-template-columns: 1fr; }
  .navbar { padding: 15px 20px; }
}
</style>
