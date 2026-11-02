<template>
  <div class="maintenance-page">
    <div class="maintenance-hero">
      <h1>Хостинг этого сайта отключен</h1>

      <div class="ufo-wrap" aria-hidden="true">
        <div class="ufo">
          <div class="ufo-glow"></div>
          <div class="ufo-lights">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>

    <div class="maintenance-details">
      <div class="detail-block">
        <p>Если вы посетитель,</p>
        <p>попробуйте зайти на сайт позднее.</p>
      </div>
      <div class="detail-block">
        <p>Если вы владелец,</p>
        <p>
          этот домен и хостинг, по-видимому,
          <span>не подключены к нашим услугам,</span>
          или вы находитесь в процессе переноса.
        </p>
      </div>
    </div>

    <footer class="maintenance-footer">
      <div class="footer-brand">
        <div class="brand-mark">PS</div>
        <div class="brand-text">
          <span class="brand-cloud">CLOUD</span>
          <span class="brand-services">SERVICES</span>
        </div>
      </div>

      <div class="footer-code">4 0 4</div>
    </footer>
  </div>
</template>

<script setup>
</script>

<style scoped>
  :global(html, body, #app) {
    margin: 0;
    width: 100%;
    min-height: 100%;
    background: #dfe5e7;
    font-family: 'Segoe UI', Tahoma, sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  .maintenance-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #dfe5e7;
    color: #1c1d1f;
  }

  .maintenance-hero {
    position: relative;
    min-height: 430px;
    background: linear-gradient(180deg, #4b7a8b 0%, #4b7a8b 100%);
    padding: 42px 0 0;
    overflow: hidden;
  }

  .maintenance-hero h1 {
    margin: 0;
    text-align: center;
    font-weight: 400;
    font-size: clamp(1.8rem, 2.2vw, 3rem);
    letter-spacing: 0.02em;
    color: rgba(255, 255, 255, 0.96);
    line-height: 1.35;
    position: relative;
    z-index: 2;
  }

  .language-switcher {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 18px;
    position: relative;
    z-index: 2;
  }

  .lang {
    border: none;
    background: rgba(255, 255, 255, 0.18);
    color: rgba(255, 255, 255, 0.88);
    border-radius: 3px;
    font-size: 11px;
    line-height: 1;
    letter-spacing: 0.08em;
    padding: 8px 10px 7px;
    cursor: default;
    opacity: 0.8;
    font-weight: 500;
    text-transform: uppercase;
  }

  .lang.active {
    background: #4aa7e8;
    color: #fff;
    opacity: 1;
  }

  .ufo-wrap {
    position: relative;
    height: 210px;
    width: 100%;
    margin-top: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
  }

  .ufo {
    position: relative;
    width: 420px;
    height: 150px;
    border-radius: 50% 50% 42% 42% / 58% 58% 42% 42%;
    background: linear-gradient(180deg, #f5f5f5 0%, #dfe3e5 55%, #bec8cc 100%);
    border: 1px solid rgba(90, 100, 108, 0.22);
    box-shadow: inset 0 -12px 18px rgba(126, 138, 145, 0.12), 0 10px 18px rgba(14, 38, 44, 0.08);
    transform: rotate(-1deg);
  }

  .ufo::before {
    content: "";
    position: absolute;
    left: 18%;
    right: 18%;
    bottom: 20px;
    height: 18px;
    border-radius: 50%;
    background: rgba(90, 112, 124, 0.16);
    filter: blur(14px);
  }

  .ufo::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -8px;
    width: 78%;
    height: 14px;
    transform: translateX(-50%);
    border-radius: 50%;
    background: rgba(138, 150, 162, 0.2);
    filter: blur(10px);
  }

  .ufo-glow {
    position: absolute;
    inset: 22px 62px 36px;
    border-radius: 50% 50% 42% 42% / 60% 60% 40% 40%;
    background: rgba(255, 255, 255, 0.25);
  }

  .ufo-lights {
    position: absolute;
    inset: 0;
  }

  .ufo-lights span {
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #b1bcc3;
    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.8), 0 2px 4px rgba(0, 0, 0, 0.08);
    top: 48%;
  }

  .ufo-lights span:nth-child(1) { left: 26%; }
  .ufo-lights span:nth-child(2) { left: 37%; }
  .ufo-lights span:nth-child(3) { left: 48%; }
  .ufo-lights span:nth-child(4) { left: 59%; }
  .ufo-lights span:nth-child(5) { left: 70%; }

  .maintenance-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 42px;
    max-width: 1120px;
    width: min(1120px, calc(100% - 48px));
    margin: 0 auto;
    padding: 34px 0 26px;
    color: #3f3f42;
  }

  .detail-block {
    text-align: center;
    font-size: 18px;
    line-height: 1.5;
    color: #31363b;
  }

  .detail-block p {
    margin: 0;
  }

  .detail-block p + p {
    margin-top: 8px;
  }

  .detail-block span {
    display: inline-block;
  }

  .maintenance-footer {
    margin-top: auto;
    background: rgba(22, 25, 31, 0.96);
    min-height: 110px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 42px 0 30px;
    color: #f0f2f4;
  }

  .footer-brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .brand-mark {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: #f0f0f0;
    color: #1b1d1f;
    font-weight: 800;
    font-size: 22px;
    letter-spacing: -0.06em;
  }

  .brand-text {
    display: flex;
    flex-direction: column;
    line-height: 1;
    color: #f0f2f4;
    text-transform: uppercase;
  }

  .brand-cloud {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 0.01em;
  }

  .brand-services {
    font-size: 12px;
    letter-spacing: 0.12em;
    opacity: 0.75;
    margin-top: 4px;
  }

  .footer-code {
    font-size: 18px;
    letter-spacing: 0.2em;
    color: rgba(255, 255, 255, 0.9);
  }

  @media (max-width: 760px) {
    .maintenance-hero {
      min-height: 360px;
    }

    .ufo {
      width: 300px;
      height: 120px;
    }

    .maintenance-details {
      grid-template-columns: 1fr;
      gap: 18px;
      padding-top: 22px;
    }

    .maintenance-footer {
      padding: 16px 20px;
    }
  }
</style>
