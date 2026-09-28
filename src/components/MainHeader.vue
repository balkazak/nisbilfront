<template>
  <header class="navbar-futuristic">
    <!-- Brand / Logo -->
    <div class="logo-wrapper" @click="router.push('/')">
      <div class="brand-bubble-icon">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" fill="url(#pinkBubbleGrad)"/>
          <circle cx="11.5" cy="14" r="2" fill="#ffffff"/>
          <circle cx="20.5" cy="14" r="2" fill="#ffffff"/>
          <path d="M11 19c1.2 1.3 3 2 5 2s3.8-.7 5-2" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
          <defs>
            <linearGradient id="pinkBubbleGrad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
              <stop stop-color="#ff2e93"/>
              <stop offset="1" stop-color="#ff52a8"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div class="logo">
        <span class="logo-text">nis</span>
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
        class="nav-btn-pill-trial"
        @click="isMenuOpen = false"
      >
        <span class="lightning">⚡</span>
        <span>{{ t("nav.trial") }}</span>
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
  padding: 14px 44px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 46, 147, 0.12);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.03);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.brand-bubble-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.logo-wrapper:hover .brand-bubble-icon {
  transform: scale(1.08) rotate(4deg);
}

.logo {
  font-family: 'Onest', sans-serif;
  font-size: 1.65rem;
  font-weight: 900;
  letter-spacing: -0.03em;
  display: flex;
  align-items: center;
}

.logo-text {
  color: #0f172a;
}

.badge-live {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  font-weight: 800;
  color: #ff2e93;
  background: rgba(255, 46, 147, 0.08);
  border: 1.5px solid rgba(255, 46, 147, 0.25);
  padding: 3px 9px;
  border-radius: 20px;
  letter-spacing: 0.06em;
}

/* Nav links */
nav {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-btn-pill-trial {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: linear-gradient(135deg, #ff2e93 0%, #ff52a8 100%);
  color: #ffffff !important;
  font-family: 'Onest', sans-serif;
  font-weight: 700;
  font-size: 0.92rem;
  padding: 9px 24px;
  border-radius: 30px;
  text-decoration: none;
  box-shadow: 0 4px 18px rgba(255, 46, 147, 0.35);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-btn-pill-trial:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 46, 147, 0.5);
  filter: brightness(1.04);
}

.nav-link {
  text-decoration: none;
  color: #334155;
  font-family: 'Onest', sans-serif;
  font-weight: 600;
  font-size: 0.96rem;
  padding: 8px 18px;
  border-radius: 20px;
  transition: all 0.25s ease;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.nav-link:hover {
  color: #ff2e93;
  background: rgba(255, 46, 147, 0.06);
}

.nav-link.router-link-active {
  color: #ff2e93;
  background: rgba(255, 46, 147, 0.1);
  font-weight: 700;
}

/* Nav actions */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-header-login {
  background: #ffffff;
  color: #0f172a;
  border: 1.5px solid rgba(255, 46, 147, 0.3);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.92rem;
  padding: 8px 22px;
  border-radius: 30px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  transition: all 0.25s ease;
}

.btn-header-login:hover {
  border-color: #ff2e93;
  color: #ff2e93;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 46, 147, 0.15);
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
  background: #ffffff;
  border: 1px solid rgba(255, 46, 147, 0.25);
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(255, 46, 147, 0.06);
  transition: all 0.25s ease;
}

.profile-trigger:hover {
  border-color: #ff2e93;
  box-shadow: 0 4px 18px rgba(255, 46, 147, 0.18);
}

.avatar-neon {
  width: 34px;
  height: 34px;
  background: linear-gradient(135deg, #ff2e93, #ff52a8);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.95rem;
  box-shadow: 0 3px 12px rgba(255, 46, 147, 0.35);
}

.username {
  font-weight: 700;
  color: #0f172a;
  font-size: 0.92rem;
}

.arrow {
  font-size: 0.65rem;
  color: #64748b;
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
  background: #ffffff;
  border: 1px solid rgba(255, 46, 147, 0.2);
  border-radius: 16px;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(255, 46, 147, 0.1);
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
  border-radius: 10px;
  background: transparent;
  border: none;
  color: #334155;
  font-family: 'Onest', sans-serif;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: rgba(255, 46, 147, 0.08);
  color: #ff2e93;
  transform: translateX(4px);
}

.dropdown-divider {
  height: 1px;
  background: rgba(255, 46, 147, 0.1);
  margin: 4px 0;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.08) !important;
  color: #ef4444 !important;
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
  box-shadow: 0 0 8px rgba(255, 46, 147, 0.4);
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
    background: #ffffff;
    border-left: 1px solid rgba(255, 46, 147, 0.2);
    flex-direction: column;
    align-items: stretch;
    padding: 24px 20px;
    gap: 12px;
    box-shadow: -15px 0 40px rgba(0, 0, 0, 0.1);
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
    border-bottom: 1px solid rgba(255, 46, 147, 0.12);
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
    color: #64748b;
    font-size: 1.2rem;
    padding: 4px;
    cursor: pointer;
  }

  .nav-link {
    width: 100%;
    padding: 12px 16px;
    border-radius: 12px;
  }

  .mobile-user-block {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 46, 147, 0.12);
  }

  .mobile-user-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .mobile-username {
    color: #0f172a;
    font-weight: 700;
    font-size: 1rem;
  }

  .btn-logout-mobile {
    background: rgba(239, 68, 68, 0.08);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.2);
    padding: 10px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
  }
}
</style>
