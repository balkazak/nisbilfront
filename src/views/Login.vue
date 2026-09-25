<template>
  <div class="login-container">
    <div class="card login-card animate-zoom-in">
      <h2 style="text-align: center; color: var(--primary-color)">
        {{ t("login.title") }}
      </h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>{{ t("login.username") }}</label>
          <input
            v-model="form.username"
            type="text"
            :placeholder="t('login.usernamePlaceholder')"
            class="input-field"
            required
          />
        </div>
        <div class="form-group">
          <label>{{ t("login.password") }}</label>
          <input
            v-model="form.password"
            type="password"
            :placeholder="t('login.passwordPlaceholder')"
            class="input-field"
            required
          />
        </div>
        <button
          type="submit"
          class="btn-primary"
          style="width: 100%; margin-top: 10px"
        >
          {{ t("login.submitBtn") }}
        </button>
      </form>
      <p v-if="error" style="color: red; text-align: center; margin-top: 10px">
        {{ error }}
      </p>

      <div style="text-align: center; margin-top: 20px">
        <router-link to="/" style="color: #666; text-decoration: none"
          >&larr; {{ t("login.backToHome") }}</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import api from "../api";
import { useLanguage } from "../composables/useLanguage";

const router = useRouter();
const { t } = useLanguage();

const form = reactive({
  username: "",
  password: "",
});
const error = ref(null);

const handleLogin = async () => {
  error.value = null;
  try {
    const response = await api.post("/auth/login", {
      username: form.username,
      password: form.password,
    });

    localStorage.setItem("token", response.data.accessToken);
    localStorage.setItem("user", JSON.stringify(response.data));

    const role = response.data.role;

    if (role === "admin" || role === "curator" || role === "operator" || role === "teacher") {
      router.push("/dashboard");
    } else {
      router.push("/student-dashboard");
    }
  } catch (err) {
    error.value = t("login.error");
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #070a14;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.login-container::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255, 46, 147, 0.25) 0%, transparent 70%);
  filter: blur(100px);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 44px 36px;
  background: rgba(18, 24, 43, 0.85);
  border: 1.5px solid rgba(255, 46, 147, 0.35);
  border-radius: 24px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 46, 147, 0.2);
  backdrop-filter: blur(20px);
  position: relative;
  z-index: 2;
}

.login-card h2 {
  font-family: 'Onest', sans-serif;
  font-weight: 800;
  font-size: 1.8rem;
  letter-spacing: -0.01em;
  background: linear-gradient(135deg, #ffffff 30%, #ff2e93 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: #cbd5e1;
  font-size: 0.88rem;
  font-weight: 600;
}

.input-field {
  background: rgba(255, 255, 255, 0.05);
  border: 1.5px solid rgba(255, 46, 147, 0.25);
  color: #ffffff;
}

.input-field:focus {
  border-color: #ff2e93;
  box-shadow: 0 0 15px rgba(255, 46, 147, 0.35);
}

.animate-zoom-in {
  animation: zoomIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes zoomIn {
  from {
    transform: scale(0.92);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
