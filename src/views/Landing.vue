<template>
  <div class="landing-page">
    <MainHeader />

    <section class="hero">
      <div class="hero-content">
        <h1 class="animate-fade-in-up">Образование Будущего</h1>
        <p class="animate-fade-in-up delay-1">Учитесь, развивайтесь и достигайте новых высот с нашей платформой.</p>
        <router-link to="/login" class="btn-primary animate-fade-in-up delay-2">Начать Обучение</router-link>
      </div>
      <div class="hero-image animate-fade-in">
         <div class="circle-graphic"></div>
      </div>
    </section>
    
    <section class="promo-video">
      <div class="video-container">
        <video autoplay loop playsinline controls class="promo-player">
          <source src="/promo.webm" type="video/webm">
        </video>
        <div class="video-overlay"></div>
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
      <div class="container footer-grid">
        <div class="footer-col">
          <div class="footer-logo">nis-bil.online</div>
          <p>Ваш путь к успеху в образовании. Качественная подготовка к НЗМ и БИЛ.</p>
        </div>
        <div class="footer-col">
          <h4>Полезные ссылки</h4>
          <ul>
            <li><router-link to="/tariffs">Тарифы</router-link></li>
            <li><router-link to="/calculator">Калькулятор</router-link></li>
            <li><a href="/offert.pdf" target="_blank">Публичная оферта</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Контакты</h4>
          <ul>
            <li><a href="https://wa.me/77761555433" target="_blank">WhatsApp: +7 776 155 54 33</a></li>
            <li><a href="https://www.instagram.com/dostyq.kyzylorda/" target="_blank">Instagram: @dostyq.kyzylorda</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 nis-bil.online. Все права защищены.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import MainHeader from '../components/MainHeader.vue';

export default {
  components: { MainHeader }
};
</script>

<style scoped>
.landing-page {
  font-family: 'Inter', sans-serif;
  background-color: var(--secondary-color);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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
  background: #1e293b;
  color: #94a3b8;
  padding: 60px 0 30px;
  border-top: none;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

.footer-col h4 {
  color: white;
  margin-bottom: 20px;
  font-size: 1.1rem;
}

.footer-col ul {
  list-style: none;
  padding: 0;
}

.footer-col ul li {
  margin-bottom: 12px;
}

.footer-col ul li a {
  color: #94a3b8;
  text-decoration: none;
  transition: 0.3s;
}

.footer-col ul li a:hover {
  color: #00bfff;
}

.footer-logo {
  font-size: 1.5rem;
  font-weight: 800;
  color: #00bfff;
  margin-bottom: 15px;
}

.footer-bottom {
  text-align: center;
  padding-top: 30px;
  border-top: 1px solid rgba(255,255,255,0.1);
  font-size: 0.9rem;
}

.promo-video {
  padding: 40px 20px;
  background: white;
}

.promo-video .video-container {
  max-width: 1000px;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  position: relative;
  aspect-ratio: 16/9;
}

.promo-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 1024px) {
  .hero h1 { font-size: 3rem; }
  .hero-image .circle-graphic { width: 250px; height: 250px; }
}

@media (max-width: 768px) {
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
