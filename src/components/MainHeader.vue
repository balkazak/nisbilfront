<template>
  <header class="navbar-futuristic">
    <!-- Brand / Typing Logo -->
    <div class="logo-wrapper" @click="router.push('/')">
      <div class="brand-hologram-dot"></div>
      <div class="logo">
        <span class="logo-text">{{ displayedLogo }}</span>
        <span class="cursor">|</span>
      </div>
      <span class="badge-live">LIVE</span>
    </div>

    <!-- Center Navigation Links -->
    <nav :class="{ 'mobile-nav-open': isMenuOpen }">
      <div class="mobile-menu-header mobile-only">
        <span class="mobile-menu-title">НАВИГАЦИЯ</span>
        <button class="mobile-close-btn" @click="isMenuOpen = false">✕</button>
      </div>

      <LanguageSwitcher class="mobile-only mb-4" />

      <router-link
        to="/trial-test"
        class="nav-link nav-link-trial"
        @click="isMenuOpen = false"
      >
        <span class="pulse-dot"></span>
        {{ t("nav.trial") }}
      </router-link>

      <router-link
        to="/calculator"
        class="nav-link"
        @click="isMenuOpen = false"
      >
        {{ t("nav.calculator") }}
      </router-link>

      <router-link
        to="/tariffs"
        class="nav-link"
        @click="isMenuOpen = false"
      >
        {{ t("nav.tariffs") }}
      </router-link>

      <!-- Mobile User Links -->
      <div v-if="user" class="mobile-only mobile-user-block">
        <div class="mobile-user-info">
          <div class="avatar-neon">{{ user.username.charAt(0).toUpperCase() }}</div>
          <span class="mobile-username">{{ user.username }}</span>
        </div>
        <button @click="goToDashboard" class="btn-cyber w-full mb-2">
          {{ t("nav.cabinet") }}
        </button>
        <button @click="logout" class="btn-logout-mobile w-full">
          {{ t("nav.logout") }}
        </button>
      </div>
      <router-link
        v-else
        to="/login"
        class="mobile-only btn-cyber w-full text-center mt-2"
        @click="isMenuOpen = false"
      >
        {{ t("nav.login") }}
      </router-link>
    </nav>

    <!-- Right Side Actions -->
    <div class="nav-actions">
      <!-- Language Switcher (Desktop) -->
      <LanguageSwitcher class="desktop-only" />

      <!-- User Profile Dropdown (Desktop) -->
      <div v-if="user" class="user-profile desktop-only">
        <div class="profile-trigger" @click="isDropdownOpen = !isDropdownOpen">
          <div class="avatar-neon">{{ user.username.charAt(0).toUpperCase() }}</div>
          <span class="username">{{ user.username }}</span>
          <span class="arrow" :class="{ open: isDropdownOpen }">▼</span>
        </div>

        <Transition name="dropdown">
          <div v-if="isDropdownOpen" class="dropdown-menu-cyber">
            <button @click="goToDashboard" class="dropdown-item">
              <span class="item-icon">⚡</span>
              {{ t("nav.cabinet") }}
            </button>
            <div class="dropdown-divider"></div>
            <button @click="logout" class="dropdown-item logout-btn">
              <span class="item-icon">🚪</span>
              {{ t("nav.logout") }}
            </button>
          </div>
        </Transition>
      </div>

      <!-- Login Button (Desktop) -->
      <router-link
        v-else
        to="/login"
        class="btn-header-login desktop-only"
      >
        <span>{{ t("nav.login") }}</span>
        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
          <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
        </svg>
      </router-link>

      <!-- Mobile Hamburger Button -->
      <button
        class="hamburger-cyber mobile-only"
        @click="isMenuOpen = !isMenuOpen"
        :class="{ active: isMenuOpen }"
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import LanguageSwitcher from "./LanguageSwitcher.vue";
import { useLanguage } from "../composables/useLanguage";

const router = useRouter();
const { t } = useLanguage();

const user = ref(null);
const isDropdownOpen = ref(false);
const isMenuOpen = ref(false);
const fullLogo = "nis-bil.online";
const displayedLogo = ref("");

const checkUser = () => {
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      user.value = JSON.parse(userData);
    } catch {
      user.value = null;
    }
  }
};

const startTyping = () => {
  let isDeleting = false;
  const type = () => {
    const currentLength = displayedLogo.value.length;

    if (!isDeleting) {
      if (currentLength < fullLogo.length) {
        displayedLogo.value = fullLogo.substring(0, currentLength + 1);
        setTimeout(type, 140);
      } else {
        isDeleting = true;
        setTimeout(type, 2600);
      }
    } else {
      if (currentLength > 0) {
        displayedLogo.value = fullLogo.substring(0, currentLength - 1);
        setTimeout(type, 80);
      } else {
        isDeleting = false;
        setTimeout(type, 400);
      }
    }
  };
  type();
};

const closeDropdown = (e) => {
  const dropdown = document.querySelector(".user-profile");
  if (dropdown && !dropdown.contains(e.target)) {
    isDropdownOpen.value = false;
  }
};

const goToDashboard = () => {
  if (!user.value) return;
  if (
    user.value.role === "admin" ||
    user.value.role === "curator" ||
    user.value.role === "operator" ||
    user.value.role === "teacher"
  ) {
    router.push("/dashboard");
  } else {
    router.push("/student-dashboard");
  }
  isDropdownOpen.value = false;
  isMenuOpen.value = false;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  user.value = null;
  isDropdownOpen.value = false;
  isMenuOpen.value = false;
  router.push("/");
};

onMounted(() => {
  checkUser();
  startTyping();
  window.addEventListener("click", closeDropdown);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", closeDropdown);
});
</script>

<style scoped>
.navbar-futuristic {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 36px;
  background: rgba(10, 14, 28, 0.88);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 46, 147, 0.22);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.35), 0 1px 0 rgba(255, 46, 147, 0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.brand-hologram-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #ff2e93;
  box-shadow: 0 0 12px #ff2e93, 0 0 24px #ff007a;
  animation: pulse-dot 1.8s infinite;
}

.logo {
  font-family: 'Outfit', sans-serif;
  font-size: 1.45rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  min-width: 175px;
}

.logo-text {
  background: linear-gradient(90deg, #ffffff 15%, #E62D95 60%, #F05EC4 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 12px rgba(230, 45, 149, 0.35));
}

.cursor {
  display: inline-block;
  color: #E62D95;
  font-weight: 300;
  margin-left: 2px;
  animation: cursor-blink 1s step-end infinite;
  text-shadow: 0 0 8px #E62D95;
}

.badge-live {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  color: #E62D95;
  background: rgba(230, 45, 149, 0.12);
  border: 1px solid rgba(230, 45, 149, 0.35);
  padding: 2px 7px;
  border-radius: 6px;
  letter-spacing: 0.08em;
}

/* Nav links */
nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-link {
  text-decoration: none;
  color: #cbd5e1;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 8px 18px;
  border-radius: 30px;
  transition: all 0.25s ease;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.nav-link:hover {
  color: #ffffff;
  background: rgba(230, 45, 149, 0.1);
  box-shadow: 0 0 15px rgba(230, 45, 149, 0.15);
}

.nav-link.router-link-active {
  color: #E62D95;
  background: rgba(230, 45, 149, 0.14);
  border: 1px solid rgba(230, 45, 149, 0.3);
}

.nav-link-trial {
  color: #F05EC4 !important;
  border: 1px solid rgba(230, 45, 149, 0.35);
  background: rgba(230, 45, 149, 0.08);
}

.nav-link-trial:hover {
  background: rgba(230, 45, 149, 0.2) !important;
  box-shadow: 0 0 20px rgba(230, 45, 149, 0.4) !important;
}

.pulse-dot {
  width: 7px;
  height: 7px;
  background-color: #E62D95;
  border-radius: 50%;
  box-shadow: 0 0 10px #E62D95;
  animation: pulse-dot 1.4s infinite;
}

/* Nav actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-header-login {
  background: var(--gradient-color);
  color: white;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.92rem;
  padding: 9px 22px;
  border-radius: 30px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 0 20px rgba(230, 45, 149, 0.45);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-header-login:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 0 30px rgba(255, 46, 147, 0.7);
  filter: brightness(1.08);
}

/* User profile */
.user-profile {
  position: relative;
}

.profile-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 14px 5px 6px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 46, 147, 0.25);
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.profile-trigger:hover {
  background: rgba(255, 46, 147, 0.12);
  border-color: #ff2e93;
  box-shadow: 0 0 15px rgba(255, 46, 147, 0.25);
}

.avatar-neon {
  width: 34px;
  height: 34px;
  background: linear-gradient(135deg, #ff2e93, #9333ea);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.95rem;
  box-shadow: 0 0 12px rgba(255, 46, 147, 0.5);
}

.username {
  font-weight: 600;
  color: #f1f5f9;
  font-size: 0.92rem;
}

.arrow {
  font-size: 0.65rem;
  color: #94a3b8;
  transition: 0.3s ease;
}

.arrow.open {
  transform: rotate(180deg);
  color: #ff2e93;
}

.dropdown-menu-cyber {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: #10162a;
  border: 1px solid rgba(255, 46, 147, 0.3);
  border-radius: 14px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(255, 46, 147, 0.15);
  padding: 8px;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  backdrop-filter: blur(20px);
}

.dropdown-item {
  width: 100%;
  text-align: left;
  padding: 10px 14px;
  border-radius: 8px;
  background: none;
  border: none;
  color: #e2e8f0;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dropdown-item:hover {
  background: rgba(255, 46, 147, 0.15);
  color: #ffffff;
}

.dropdown-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 4px 0;
}

.logout-btn {
  color: #fb7185 !important;
}

.logout-btn:hover {
  background: rgba(244, 63, 94, 0.18) !important;
  color: #ff4b6e !important;
}

/* Hamburger */
.hamburger-cyber {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 26px;
  height: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1002;
}

.hamburger-cyber span {
  width: 26px;
  height: 2.5px;
  background: #ff2e93;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  box-shadow: 0 0 8px rgba(255, 46, 147, 0.6);
}

.hamburger-cyber.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}
.hamburger-cyber.active span:nth-child(2) {
  opacity: 0;
  transform: translateX(10px);
}
.hamburger-cyber.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* Keyframes */
@keyframes pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.6; }
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.mobile-only {
  display: none;
}
.desktop-only {
  display: flex;
}

/* Responsive */
@media (max-width: 860px) {
  .navbar-futuristic {
    padding: 10px 18px;
  }
  .desktop-only {
    display: none !important;
  }
  .mobile-only {
    display: flex;
  }

  nav {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 280px;
    background: #0d1222;
    border-left: 1px solid rgba(255, 46, 147, 0.25);
    flex-direction: column;
    align-items: stretch;
    padding: 24px 20px;
    gap: 12px;
    box-shadow: -15px 0 40px rgba(0, 0, 0, 0.7);
    transform: translateX(100%);
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 1001;
    overflow-y: auto;
  }

  nav.mobile-nav-open {
    transform: translateX(0);
  }

  .mobile-menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 8px;
  }

  .mobile-menu-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    letter-spacing: 0.15em;
    color: #ff2e93;
    font-weight: 700;
  }

  .mobile-close-btn {
    background: none;
    border: none;
    color: #94a3b8;
    font-size: 1.2rem;
    padding: 4px;
    cursor: pointer;
  }

  .nav-link {
    width: 100%;
    padding: 12px 16px;
    border-radius: 10px;
  }

  .mobile-user-block {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .mobile-user-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .mobile-username {
    color: white;
    font-weight: 700;
    font-size: 1rem;
  }

  .btn-logout-mobile {
    background: rgba(244, 63, 94, 0.15);
    color: #fb7185;
    border: 1px solid rgba(244, 63, 94, 0.3);
    padding: 10px;
    border-radius: 8px;
  }
}
</style>
