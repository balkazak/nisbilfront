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
  gap: 3px;
  background: #f8fafc;
  padding: 3px;
  border-radius: 20px;
  border: 1px solid rgba(255, 46, 147, 0.2);
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
  color: #64748b;
  border: none;
  cursor: pointer;
}

.lang-switcher-cyber button.active {
  background: linear-gradient(135deg, #ff2e93, #ff52a8);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(255, 46, 147, 0.4);
}

.lang-switcher-cyber button:hover:not(.active) {
  color: #ff2e93;
  background: rgba(255, 46, 147, 0.06);
}
</style>
