<template>
  <header class="navbar">
    <div class="logo-wrapper" @click="$router.push('/')">
      <div class="logo">{{ displayedLogo }}<span class="cursor">|</span></div>
    </div>
    
    <div class="nav-actions">
      <!-- Mobile Login Icon/Avatar -->
      <div class="mobile-only header-user-action">
        <div v-if="user" class="mobile-user-avatar" @click="goToDashboard">
          {{ user.username.charAt(0).toUpperCase() }}
        </div>
        <router-link v-else to="/login" class="mobile-login-icon" title="Войти">
          👤
        </router-link>
      </div>

      <button class="hamburger-btn" @click="isMenuOpen = !isMenuOpen" :class="{ active: isMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <nav :class="{ 'mobile-nav-open': isMenuOpen }">
      <router-link to="/trial-test" class="nav-link blinking-red" @click="isMenuOpen = false">Пробный тест</router-link>
      <router-link to="/calculator" class="nav-link" @click="isMenuOpen = false">Калькулятор</router-link>
      <router-link to="/tariffs" class="nav-link" @click="isMenuOpen = false">Тарифы</router-link>
      
      <div v-if="user" class="user-profile">
        <div class="profile-trigger" @click="isDropdownOpen = !isDropdownOpen">
          <div class="avatar">{{ user.username.charAt(0).toUpperCase() }}</div>
          <span class="username">{{ user.username }}</span>
          <span class="arrow" :class="{ open: isDropdownOpen }">▼</span>
        </div>
        
        <Transition name="dropdown">
          <div v-if="isDropdownOpen" class="dropdown-menu">
            <button @click="goToDashboard">Мой кабинет</button>
            <button @click="logout" class="logout-btn">Выйти</button>
          </div>
        </Transition>
      </div>
      <router-link v-else to="/login" class="nav-link" @click="isMenuOpen = false">Войти</router-link>
    </nav>
  </header>
</template>

<script>
export default {
  data() {
    return {
      user: null,
      isDropdownOpen: false,
      isMenuOpen: false,
      fullLogo: 'nis-bil.online',
      displayedLogo: '',
      typingIndex: 0
    };
  },
  mounted() {
    this.checkUser();
    this.startTyping();
    window.addEventListener('click', this.closeDropdown);
  },
  beforeUnmount() {
    window.removeEventListener('click', this.closeDropdown);
  },
  methods: {
    checkUser() {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.user = JSON.parse(userData);
      }
    },
    startTyping() {
      let isDeleting = false;
      const type = () => {
        const currentLength = this.displayedLogo.length;
        
        if (!isDeleting) {
          // Typing
          if (currentLength < this.fullLogo.length) {
            this.displayedLogo = this.fullLogo.substring(0, currentLength + 1);
            setTimeout(type, 150);
          } else {
            // Wait before starting to delete
            isDeleting = true;
            setTimeout(type, 2000);
          }
        } else {
          // Deleting
          if (currentLength > 0) {
            this.displayedLogo = this.fullLogo.substring(0, currentLength - 1);
            setTimeout(type, 100);
          } else {
            // Wait before starting to type again
            isDeleting = false;
            setTimeout(type, 500);
          }
        }
      };
      type();
    },
    closeDropdown(e) {
      if (!this.$el.contains(e.target)) {
        this.isDropdownOpen = false;
      }
    },
    goToDashboard() {
      if (this.user.role === 'admin' || this.user.role === 'teacher') {
        this.$router.push('/dashboard');
      } else {
        this.$router.push('/student-dashboard');
      }
      this.isDropdownOpen = false;
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.user = null;
      this.isDropdownOpen = false;
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 40px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.mobile-only { display: none; }
.desktop-only { display: block; }

.logo-wrapper { display: flex; align-items: center; cursor: pointer; }

.logo { 
  font-size: 1.45rem; 
  font-weight: 800; 
  color: #00bfff; 
  background: -webkit-linear-gradient(45deg, #00bfff, #009ACD);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  min-width: 180px; /* Stabilize right side during typing */
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background-color: #00bfff;
  margin-left: 2px;
  animation: cursor-blink 1s step-end infinite;
}

@keyframes cursor-blink {
  from, to { opacity: 1; }
  50% { opacity: 0; }
}

nav { display: flex; align-items: center; gap: 5px; }

.nav-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.hamburger-btn {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 24px;
  height: 18px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.hamburger-btn span {
  width: 24px;
  height: 2px;
  background: var(--primary-color);
  border-radius: 10px;
  transition: all 0.3s linear;
  position: relative;
  transform-origin: 1px;
}

.hamburger-btn.active span:nth-child(1) { transform: rotate(45deg); }
.hamburger-btn.active span:nth-child(2) { opacity: 0; transform: translateX(10px); }
.hamburger-btn.active span:nth-child(3) { transform: rotate(-45deg); }

.nav-link {
  text-decoration: none;
  color: #64748b;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 20px;
  transition: 0.3s;
  font-size: 0.95rem;
}

.nav-link:hover { background: #f1f5f9; color: #00bfff; }

.blinking-red {
  color: #ef4444 !important;
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}

.user-profile { position: relative; margin-left: 10px; }

.profile-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  background: #f8fafc;
  border-radius: 30px;
  cursor: pointer;
  transition: 0.3s;
  border: 1px solid #e2e8f0;
}

.profile-trigger:hover { background: #f1f5f9; border-color: #00bfff; }

.avatar {
  width: 32px;
  height: 32px;
  background: #00bfff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.9rem;
}

.username { font-weight: 600; color: #1e293b; font-size: 0.9rem; }

.arrow { font-size: 0.7rem; color: #94a3b8; transition: 0.3s; }
.arrow.open { transform: rotate(180deg); }

.dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  padding: 8px;
  min-width: 180px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dropdown-menu button {
  width: 100%;
  text-align: left;
  padding: 10px 15px;
  border-radius: 8px;
  background: none;
  border: none;
  color: #475569;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;
  font-size: 0.9rem;
}

.dropdown-menu button:hover { background: #f1f5f9; color: #00bfff; }

.logout-btn { color: #ef4444 !important; }
.logout-btn:hover { background: #fee2e2 !important; }

.dropdown-enter-active, .dropdown-leave-active { transition: all 0.2s ease; }
.dropdown-enter-from, .dropdown-leave-to { opacity: 0; transform: translateY(-10px); }

@media (max-width: 768px) {
  .navbar { padding: 10px 15px; }
  .logo { font-size: 1.1rem; }
  .mobile-only { display: flex; }
  
  .hamburger-btn {
    display: flex;
  }

  .header-user-action {
    margin-right: 5px;
  }

  .mobile-login-icon {
    font-size: 1.4rem;
    text-decoration: none;
    color: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
  }

  .mobile-user-avatar {
    width: 32px;
    height: 32px;
    background: var(--primary-color);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 0.8rem;
    cursor: pointer;
  }

  nav {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 250px;
    background: white;
    flex-direction: column;
    align-items: flex-start;
    padding: 80px 20px 20px;
    gap: 15px;
    box-shadow: -5px 0 15px rgba(0,0,0,0.1);
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
    z-index: 1000;
  }

  nav.mobile-nav-open {
    transform: translateX(0);
  }

  .nav-link {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
  }

  .user-profile {
    width: 100%;
    margin-left: 0;
  }

  .profile-trigger {
    width: 100%;
    justify-content: space-between;
  }

  .dropdown-menu {
    position: static;
    margin-top: 10px;
    box-shadow: none;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
  }

  .username { display: inline-block; }
}
</style>
