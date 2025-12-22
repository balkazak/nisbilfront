<template>
  <div class="landing-page">
    <header class="navbar">
      <div class="logo">nis-bil.online</div>
      <nav>
        <router-link to="/login" class="nav-link">Войти</router-link>
      </nav>
    </header>

    <section class="hero">
      <div class="hero-content">
        <h1 class="animate-fade-in-up">Образование Будущего</h1>
        <p class="animate-fade-in-up delay-1">Учитесь, развивайтесь и достигайте новых высот с нашей платформой.</p>
        <router-link to="/login" class="btn-primary animate-fade-in-up delay-2">Начать Обучение</router-link>
      </div>
      <div class="hero-image animate-fade-in">
         <!-- Geometric CSS Shape as placeholder for modern graphic -->
         <div class="circle-graphic"></div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <h2 style="text-align: center; margin-bottom: 40px;">Почему мы?</h2>
        <div class="grid">
          <div class="feature-card">
            <h3>Видео Курсы</h3>
            <p>Доступ к качественным видеоурокам от лучших преподавателей.</p>
          </div>
          <div class="feature-card">
            <h3>Интерактивные Тесты</h3>
            <p>Проверяйте свои знания и отслеживайте прогресс в реальном времени.</p>
          </div>
          <div class="feature-card">
             <h3>Удобный Кабинет</h3>
             <p>Все материалы и статистика в одном месте, доступные 24/7.</p>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="container">
        <p>&copy; 2025 nis-bil.online. Все права защищены.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.landing-page {
  font-family: 'Inter', sans-serif;
  background-color: var(--secondary-color);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary-color);
  background: -webkit-linear-gradient(45deg, var(--primary-color), #007bb5);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-link {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s;
}

.nav-link:hover {
  background: var(--primary-color);
  color: white;
}

.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 80px 40px;
  max-width: 1200px;
  margin: 0 auto;
  flex: 1;
}

.hero-content {
  flex: 1;
  max-width: 600px;
}

.hero h1 {
  font-size: 3.5rem;
  line-height: 1.2;
  margin-bottom: 20px;
  background: -webkit-linear-gradient(45deg, #333, var(--primary-color));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
}

.circle-graphic {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, var(--primary-color), #87CEFA);
  border-radius: 50%;
  box-shadow: 0 20px 50px rgba(0, 191, 255, 0.3);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

.features {
  padding: 60px 20px;
  background: white;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.feature-card {
  padding: 30px;
  border-radius: 12px;
  background: var(--bg-color);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.footer {
  text-align: center;
  padding: 20px;
  border-top: 1px solid #eee;
  background: white;
  color: #888;
}

@media (max-width: 1024px) {
  .hero h1 { font-size: 3rem; }
  .hero-image .circle-graphic { width: 250px; height: 250px; }
}

@media (max-width: 768px) {
  .navbar { padding: 15px 20px; }
  .logo { font-size: 1.2rem; }
  .hero { flex-direction: column; text-align: center; padding: 60px 20px; gap: 40px; }
  .hero-content { max-width: 100%; }
  .hero h1 { font-size: 2.5rem; }
  .hero-image { margin-top: 0; }
  .hero-image .circle-graphic { width: 200px; height: 200px; }
  .grid { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
  .hero h1 { font-size: 2rem; }
  .hero p { font-size: 1rem; }
  .btn-primary { width: 100%; text-align: center; }
}
</style>
