<template>
  <div class="lang-switcher-cyber">
    <button
      v-for="lang in ['ru', 'kk']"
      :key="lang"
      :class="{ active: currentLang === lang }"
      @click="setLanguage(lang)"
    >
      {{ lang === 'kk' ? 'KZ' : 'RU' }}
    </button>
  </div>
</template>

<script setup>
import { useLanguage } from "../composables/useLanguage";

const { currentLang, setLanguage } = useLanguage();
</script>

<style scoped>
.lang-switcher-cyber {
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.08);
  padding: 3px;
  border-radius: 20px;
  border: 1px solid rgba(255, 46, 147, 0.25);
  backdrop-filter: blur(10px);
}

.lang-switcher-cyber button {
  padding: 4px 10px;
  border-radius: 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  transition: all 0.25s ease;
  background: transparent;
  color: #94a3b8;
  border: none;
  cursor: pointer;
}

.lang-switcher-cyber button.active {
  background: linear-gradient(135deg, #ff2e93, #ff007a);
  color: #ffffff;
  box-shadow: 0 0 10px rgba(255, 46, 147, 0.6);
}

.lang-switcher-cyber button:hover:not(.active) {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
}
</style>
