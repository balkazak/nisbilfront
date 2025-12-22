<template>
  <div class="login-container">
    <div class="card login-card animate-zoom-in">
      <h2 style="text-align: center; color: var(--primary-color);">Вход в систему</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
           <label>Логин</label>
           <input v-model="username" type="text" placeholder="Введите логин" class="input-field" required />
        </div>
        <div class="form-group">
           <label>Пароль</label>
           <input v-model="password" type="password" placeholder="Введите пароль" class="input-field" required />
        </div>
        <button type="submit" class="btn-primary" style="width: 100%; margin-top: 10px;">Войти</button>
      </form>
      <p v-if="error" style="color: red; text-align: center; margin-top: 10px;">{{ error }}</p>
      
      <div style="text-align: center; margin-top: 20px;">
        <router-link to="/" style="color: #666; text-decoration: none;">&larr; На главную</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  data() {
    return {
      username: '',
      password: '',
      error: null
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await api.post('/auth/login', {
          username: this.username,
          password: this.password
        });
        
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data));
        
        const role = response.data.role;
        if (role === 'admin' || role === 'teacher') {
          this.$router.push('/dashboard');
        } else {
          this.$router.push('/student-dashboard');
        }
      } catch (err) {
        this.error = 'Неверный логин или пароль';
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
}
.login-card {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; color: #555; font-size: 0.9rem; }
.animate-zoom-in { animation: zoomIn 0.3s ease-out; }
@keyframes zoomIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>
