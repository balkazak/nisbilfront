<template>
  <div class="lang-switcher">
    <button
      v-for="lang in ['ru', 'kk']"
      :key="lang"
      :class="{ active: currentLang === lang }"
      @click="setLanguage(lang)"
    >
      {{ lang.toUpperCase() }}
    </button>
  </div>
</template>

<script setup>
import { useLanguage } from "../composables/useLanguage";

const { currentLang, setLanguage } = useLanguage();
</script>

<style scoped>
.lang-switcher {
  display: flex;
  gap: 5px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.lang-switcher button {
  padding: 4px 10px;
  border-radius: 7px;
  font-size: 0.75rem;
  font-weight: 700;
  transition: 0.3s;
  background: transparent;
  color: #64748b;
  border: none;
}

.lang-switcher button.active {
  background: white;
  color: #00bfff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.lang-switcher button:hover:not(.active) {
  background: rgba(255, 255, 255, 0.5);
}
</style>
