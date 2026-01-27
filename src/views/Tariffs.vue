<template>
  <div class="tariffs-page">
    <MainHeader />

    <main class="container">
      <div class="hero-section animate-fade-in-up">
        <h1>{{ t("tariffs.title") }}</h1>
      </div>

      <div class="pricing-grid animate-fade-in-up delay-1">
        <div
          v-for="plan in pricingPlans"
          :key="plan.id"
          class="pricing-card"
          :class="{
            active: form.plan === plan.id,
            featured: plan.id === 'bil_bundle',
          }"
          @click="form.plan = plan.id"
        >
          <div class="card-header">
            <h2 class="plan-name">{{ plan.name }}</h2>
            <div v-if="plan.originalPrice" class="original-price">
              {{ plan.originalPrice.toLocaleString() }}
              {{ t("tariffs.currency") }}
            </div>
            <div class="current-price">
              <span
                >{{ plan.price.toLocaleString() }}
                {{ t("tariffs.currency") }}</span
              >
            </div>
          </div>

          <div class="features-list">
            <div
              v-for="(feature, index) in plan.features"
              :key="'inc-' + index"
              class="feature-item included"
            >
              <span class="icon">✓</span> {{ feature }}
            </div>
          </div>
        </div>
      </div>

      <div class="application-section animate-fade-in-up delay-2">
        <div class="card application-card">
          <h2>{{ t("tariffs.submitTitle") }}</h2>
          <form @submit.prevent="submitApplication" class="app-form">
            <div class="form-row">
              <div class="form-group" style="grid-column: span 2">
                <label>{{ t("tariffs.phone") }}</label>
                <input
                  type="tel"
                  v-model="form.phone"
                  @input="handlePhoneInput"
                  required
                  placeholder="+7 (700) 000-00-00"
                />
              </div>
            </div>
            <div class="form-group">
              <label>{{ t("tariffs.selectedPlan") }}</label>
              <select v-model="form.plan" required>
                <option value="" disabled>
                  {{ t("tariffs.placeholderPlan") }}
                </option>
                <option
                  v-for="plan in pricingPlans"
                  :key="plan.id"
                  :value="plan.id"
                >
                  {{ plan.name }} - {{ plan.price.toLocaleString() }}
                  {{ t("tariffs.currency") }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>{{ t("tariffs.comment") }}</label>
              <textarea
                v-model="form.comment"
                :placeholder="t('tariffs.commentPlaceholder')"
                rows="3"
                class="comment-textarea"
              ></textarea>
            </div>
            <button type="submit" class="btn-submit" :disabled="loading">
              {{ loading ? t("tariffs.sending") : t("tariffs.submitBtn") }}
            </button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
import { useToast } from "../composables/useToast";
import MainHeader from "../components/MainHeader.vue";
import { useLanguage } from "../composables/useLanguage";

const toast = useToast();
const { t } = useLanguage();

const loading = ref(false);
const form = reactive({
  email: "",
  phone: "",
  plan: "",
  comment: "",
});

const pricingPlans = computed(() => [
  {
    id: "math_bil_nzm",
    name: t("tariffs.plans.math"),
    price: 19900,
    originalPrice: 53000,
    features: [
      t("tariffs.features.access247"),
      t("tariffs.features.math53"),
      t("tariffs.features.test15"),
      t("tariffs.features.duration1year"),
    ],
  },
  {
    id: "logic_bil",
    name: t("tariffs.plans.logic"),
    price: 14900,
    originalPrice: 20000,
    features: [
      t("tariffs.features.access247"),
      t("tariffs.features.logic20"),
      t("tariffs.features.test15"),
      t("tariffs.features.duration1year"),
    ],
  },
  {
    id: "bil_bundle",
    name: t("tariffs.plans.bundle"),
    price: 29900,
    originalPrice: 76000,
    features: [
      t("tariffs.features.access247"),
      t("tariffs.features.math53"),
      t("tariffs.features.logic20"),
      t("tariffs.features.kazakh3"),
      t("tariffs.features.test15"),
      t("tariffs.features.duration1year"),
    ],
  },
  {
    id: "math_5_grade",
    name: t("tariffs.plans.math5"),
    price: 14900,
    originalPrice: 20000,
    features: [
      t("tariffs.features.access247"),
      t("tariffs.features.math30"),
      t("tariffs.features.test15"),
      t("tariffs.features.duration1year"),
    ],
  },
]);

const formatPhone = (val) => {
  let value = val.replace(/\D/g, "");
  if (value.startsWith("7")) value = value.slice(1);

  let formatted = "+7 ";
  if (value.length > 0) formatted += "(" + value.substring(0, 3);
  if (value.length >= 4) formatted += ") " + value.substring(3, 6);
  if (value.length >= 7) formatted += "-" + value.substring(6, 8);
  if (value.length >= 9) formatted += "-" + value.substring(8, 10);

  return formatted.trim();
};

const handlePhoneInput = (e) => {
  form.phone = formatPhone(e.target.value);
};

const submitApplication = async () => {
  if (!form.plan) {
    toast.error(t("tariffs.selectPlanError"));
    return;
  }
  loading.value = true;
  try {
    console.log("Submitting application:", form);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success(t("tariffs.success"));
    form.email = "";
    form.phone = "";
    form.plan = "";
    form.comment = "";
  } catch (error) {
    toast.error(t("tariffs.error"));
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.tariffs-page {
  font-family: "Inter", sans-serif;
  background-color: #f8fafc;
  min-height: 100vh;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.hero-section {
  text-align: center;
  margin-bottom: 40px;
}
.hero-section h1 {
  font-size: 2.5rem;
  color: #1e293b;
  margin-bottom: 10px;
  font-weight: 800;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 25px;
  margin-bottom: 60px;
}

.pricing-card {
  background: white;
  padding: 30px 25px;
  border-radius: 24px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border: 2px solid transparent;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
}

.pricing-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

.pricing-card.active {
  border-color: #00bfff;
  background: #f0f9ff;
}

.pricing-card.featured::before {
  content: "BEST VALUE";
  position: absolute;
  top: 12px;
  right: -30px;
  background: #00bfff;
  color: white;
  font-size: 0.65rem;
  font-weight: 900;
  padding: 4px 40px;
  transform: rotate(45deg);
}

.card-header {
  text-align: center;
  margin-bottom: 25px;
}
.plan-name {
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 12px;
  color: #1e293b;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.original-price {
  text-decoration: line-through;
  opacity: 0.5;
  font-size: 1rem;
  margin-bottom: 4px;
  color: #ef4444;
  font-weight: 600;
}
.current-price {
  font-size: 2rem;
  font-weight: 900;
  color: #00bfff;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
}
.feature-item {
  display: flex;
  gap: 10px;
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.4;
}
.icon {
  font-weight: bold;
  color: #00bfff;
  flex-shrink: 0;
}

.application-section {
  max-width: 600px;
  margin: 0 auto;
}
.application-card {
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
  border-top: 6px solid #00bfff;
}
.application-card h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #1e293b;
  font-size: 1.8rem;
  font-weight: 800;
}

.app-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.form-group label {
  font-weight: 700;
  color: #475569;
  font-size: 0.9rem;
  margin-left: 4px;
}
.form-group input,
.form-group select,
.comment-textarea {
  padding: 14px 18px;
  border: 2px solid #f1f5f9;
  border-radius: 14px;
  outline: none;
  transition: 0.3s;
  font-size: 1rem;
  background: #f8fafc;
}
.form-group input:focus,
.form-group select:focus,
.comment-textarea:focus {
  border-color: #00bfff;
  background: white;
  box-shadow: 0 0 0 4px rgba(0, 191, 255, 0.1);
}

.comment-textarea {
  resize: none;
  min-height: 100px;
}

.btn-submit {
  background: linear-gradient(135deg, #00bfff 0%, #009acd 100%);
  color: white;
  padding: 16px;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
  box-shadow: 0 10px 20px rgba(0, 191, 255, 0.2);
}
.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(0, 191, 255, 0.3);
}
.btn-submit:active {
  transform: translateY(0);
}
.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.delay-1 {
  animation-delay: 0.2s;
}
.delay-2 {
  animation-delay: 0.4s;
}

@media (max-width: 768px) {
  .hero-section h1 {
    font-size: 2rem;
  }
  .pricing-grid {
    grid-template-columns: 1fr;
  }
  .application-card {
    padding: 30px 20px;
  }
}
</style>
