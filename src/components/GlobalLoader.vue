<template>
  <Transition name="cyber-fade">
    <div v-if="isLoading" class="cyber-loader-overlay">
      <!-- Background Cyber Grid and Glowing Nebulas -->
      <div class="cyber-grid"></div>
      <div class="ambient-glow pink-glow"></div>
      <div class="ambient-glow purple-glow"></div>

      <!-- Main Futuristic Core -->
      <div class="loader-content">
        <!-- Multi-layered Hologram Rings -->
        <div class="hologram-rings">
          <div class="ring ring-outer"></div>
          <div class="ring ring-middle"></div>
          <div class="ring ring-inner"></div>
          
          <div class="core-symbol">
            <span class="symbol-text">NB</span>
            <div class="symbol-pulse"></div>
          </div>
        </div>

        <!-- Brand Name with Neon Glow -->
        <div class="brand-block">
          <h2 class="brand-title">
            <span class="title-nis">NIS-BIL</span><span class="title-dot">.</span><span class="title-online">ONLINE</span>
          </h2>
          <div class="brand-badge">NEXT-GEN EDTECH PLATFORM</div>
        </div>

        <!-- Progress Counter Display -->
        <div class="progress-display">
          <div class="progress-number">
            {{ progress }}<span class="percent-sign">%</span>
          </div>
        </div>

        <!-- Cyber Progress Track -->
        <div class="cyber-bar-track">
          <div class="cyber-bar-fill" :style="{ width: progress + '%' }">
            <div class="bar-spark"></div>
          </div>
        </div>

        <!-- Status Ticker -->
        <div class="status-ticker">
          <span class="ticker-prefix">&gt;</span>
          <span class="ticker-text">{{ statusMessage }}</span>
          <span class="ticker-cursor">_</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { onMounted } from 'vue';
import { useLoader } from '../composables/useLoader';

const { isLoading, progress, statusMessage, startInitialLoad } = useLoader();

onMounted(() => {
  startInitialLoad();
});
</script>

<style scoped>
.cyber-loader-overlay {
  position: fixed;
  inset: 0;
  background-color: #070a14;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
}

/* Background Grids & Nebulas */
.cyber-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255, 46, 147, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 46, 147, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
  -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
  pointer-events: none;
}

.ambient-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
}

.pink-glow {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255, 46, 147, 0.3) 0%, rgba(255, 46, 147, 0) 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse-glow 4s ease-in-out infinite;
}

.purple-glow {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, rgba(147, 51, 234, 0) 70%);
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Loader Content Container */
.loader-content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 440px;
  width: 90%;
}

/* Hologram Rings */
.hologram-rings {
  position: relative;
  width: 140px;
  height: 140px;
  margin-bottom: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring {
  position: absolute;
  border-radius: 50%;
}

.ring-outer {
  width: 130px;
  height: 130px;
  border: 2px dashed rgba(230, 45, 149, 0.6);
  border-top-color: #E62D95;
  border-right-color: transparent;
  animation: rotate-slow 5s linear infinite;
  box-shadow: 0 0 20px rgba(230, 45, 149, 0.35);
}

.ring-middle {
  width: 98px;
  height: 98px;
  border: 2px solid rgba(240, 94, 196, 0.5);
  border-left-color: #F05EC4;
  border-bottom-color: #E62D95;
  animation: rotate-reverse 3.5s linear infinite;
}

.ring-inner {
  width: 70px;
  height: 70px;
  border: 1px dotted rgba(6, 182, 212, 0.6);
  animation: rotate-slow 8s linear infinite;
}

.core-symbol {
  width: 54px;
  height: 54px;
  background: var(--gradient-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 0 25px rgba(230, 45, 149, 0.7);
}

.symbol-text {
  font-family: 'Onest', sans-serif;
  font-weight: 900;
  font-size: 1.15rem;
  color: white;
  letter-spacing: 1px;
}

.symbol-pulse {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 2px solid rgba(230, 45, 149, 0.5);
  animation: core-pulse 1.8s cubic-bezier(0.24, 0, 0.38, 1) infinite;
}

/* Brand Title */
.brand-block {
  margin-bottom: 20px;
}

.brand-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-nis {
  color: white;
}

.title-dot {
  color: #E62D95;
  text-shadow: 0 0 15px #E62D95;
}

.title-online {
  background: var(--gradient-color);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 25px rgba(230, 45, 149, 0.5);
}

.brand-badge {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  color: #a855f7;
  margin-top: 6px;
  background: rgba(147, 51, 234, 0.12);
  border: 1px solid rgba(147, 51, 234, 0.3);
  padding: 3px 12px;
  border-radius: 20px;
}

/* Progress Display */
.progress-display {
  margin-bottom: 14px;
}

.progress-number {
  font-family: 'JetBrains Mono', monospace;
  font-size: 2.2rem;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 0 20px rgba(255, 46, 147, 0.6);
}

.percent-sign {
  font-size: 1.2rem;
  color: #ff2e93;
  margin-left: 3px;
}

/* Cyber Bar Track */
.cyber-bar-track {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.5);
}

.cyber-bar-fill {
  height: 100%;
  background: var(--gradient-color);
  border-radius: 10px;
  position: relative;
  transition: width 0.06s ease-out;
  box-shadow: 0 0 16px rgba(230, 45, 149, 0.85);
}

.bar-spark {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 14px;
  background: #ffffff;
  box-shadow: 0 0 10px #ffffff, 0 0 20px #ff2e93;
  border-radius: 50%;
}

/* Status Ticker */
.status-ticker {
  margin-top: 18px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.82rem;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 24px;
}

.ticker-prefix {
  color: #ff2e93;
  font-weight: 700;
}

.ticker-text {
  color: #e2e8f0;
}

.ticker-cursor {
  color: #ff2e93;
  animation: cursor-blink 0.8s infinite;
  font-weight: 700;
}

/* Animations */
@keyframes core-pulse {
  0% {
    transform: scale(1);
    opacity: 0.9;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.15); }
}

/* Vue Transition */
.cyber-fade-enter-active,
.cyber-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.cyber-fade-enter-from {
  opacity: 0;
}

.cyber-fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
  filter: blur(10px);
}
</style>
