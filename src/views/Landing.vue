<template>
  <div class="landing-page-futuristic">
    <!-- Header -->
    <MainHeader />

    <!-- HERO SECTION -->
    <section class="hero-section">
      <!-- Soft Ambient Rose Glows -->
      <div class="ambient-glow glow-1"></div>
      <div class="ambient-glow glow-2"></div>

      <div class="container hero-container">
        <!-- Left Content -->
        <div class="hero-left">
          <!-- Live Badge (Exact from mockup) -->
          <div class="hero-badge animate-float">
            <span class="badge-icon">⚡</span>
            <span class="badge-text">
              {{ currentLang === 'kk' 
                ? 'ЖАҢА БУЫН ПЛАТФОРМАСЫ 2025/2026 • 98.4% ГРАНТ' 
                : 'ПЛАТФОРМА НОВОГО ПОКОЛЕНИЯ 2025/2026 • 98.4% ГРАНТ' 
              }}
            </span>
          </div>

          <!-- Main Title (Exact from mockup) -->
          <h1 class="hero-title">
            <span class="title-line">{{ currentLang === 'kk' ? 'НЗМ мен БИЛ-ге' : 'Поступление в НИШ и БИЛ' }}</span>
            <span class="title-line">
              <span class="hero-highlight-gradient">{{ currentLang === 'kk' ? 'ГРАНТҚА' : 'НА ГРАНТ' }}</span>
              {{ currentLang === 'kk' ? ' түсу бірінші' : ' с первой' }}
            </span>
            <span class="title-line">{{ currentLang === 'kk' ? 'талпыныстан' : 'попытки' }}</span>
          </h1>

          <!-- Subtitle (Exact from mockup) -->
          <p class="hero-subtitle">
            {{ currentLang === 'kk'
              ? 'Жаңа буын зияткерлік онлайн дайындық жүйесі. Қателерді видеоталдаумен 15 000+ тест тапсырмасы, ақылды прогресс трекері және 24/7 жеке куратор.'
              : 'Интеллектуальная онлайн-система подготовки нового поколения. 15 000+ тестовых заданий с видеоразбором ошибок, умный трекер прогресса и личный куратор 24/7.'
            }}
          </p>

          <!-- Action Buttons (Exact from mockup) -->
          <div class="hero-actions">
            <router-link to="/trial-test" class="btn-hero-primary">
              <span class="btn-icon">⚡</span>
              <span>{{ currentLang === 'kk' ? 'Тегін байқау тестін тапсыру' : 'Пройти пробный тест бесплатно' }}</span>
              <span class="btn-arrow">➔</span>
            </router-link>

            <router-link to="/calculator" class="btn-hero-secondary">
              <span class="btn-icon">🎯</span>
              <span>{{ currentLang === 'kk' ? 'Мүмкіндікті есептеу' : 'Рассчитать шансы' }}</span>
            </router-link>
          </div>

          <!-- Scroll link -->
          <a href="#system" class="btn-ghost-scroll">
            <span>{{ currentLang === 'kk' ? 'Оқу жүйесі' : 'Система обучения' }}</span>
            <span class="scroll-arrow">↓</span>
          </a>
        </div>

        <!-- Right Content: The exact banner requested by user! -->
        <div class="hero-right">
          <div class="hero-banner-wrapper">
            <img
              src="/hero_banner_clean.png"
              alt="НИШ & БИЛ 2025/2026 Дайындық платформасы"
              class="hero-banner-img"
            />
          </div>
        </div>
      </div>

      <!-- Stats Cards Row (Exact 4 cards from mockup) -->
      <div class="container hero-stats-container">
        <div class="hero-stats-row">
          <div class="stats-card">
            <div class="stats-icon-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff2e93" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
            </div>
            <div class="stats-content">
              <div class="stats-num">98.4%</div>
              <div class="stats-label">{{ currentLang === 'kk' ? 'Грантқа түсті' : 'Поступили на грант' }}</div>
            </div>
          </div>
          <div class="stats-card">
            <div class="stats-icon-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff2e93" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div class="stats-content">
              <div class="stats-num">15 000+</div>
              <div class="stats-label">{{ currentLang === 'kk' ? 'Тапсырған есептер' : 'Решенных заданий' }}</div>
            </div>
          </div>
          <div class="stats-card">
            <div class="stats-icon-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff2e93" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div class="stats-content">
              <div class="stats-num">22+ {{ currentLang === 'kk' ? 'жыл' : 'года' }}</div>
              <div class="stats-label">{{ currentLang === 'kk' ? 'Сарапшылар тәжірибесі' : 'Опыт экспертов' }}</div>
            </div>
          </div>
          <div class="stats-card">
            <div class="stats-icon-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff2e93" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div class="stats-content">
              <div class="stats-num">24/7</div>
              <div class="stats-label">{{ currentLang === 'kk' ? 'Куратор қолдауы' : 'Поддержка куратора' }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PROMO VIDEO SECTION -->
    <section class="section-promo">
      <div class="container">
        <div class="promo-wrapper">
          <div class="promo-header">
            <span class="cyber-tag">VIDEO TOUR</span>
            <h2>{{ currentLang === 'kk' ? 'Платформаның жұмыс істеу принципі' : 'Как устроена экосистема подготовки' }}</h2>
          </div>
          <div class="promo-screen-frame" ref="promoFrameRef" :class="{ 'is-fullscreen': isPromoFullscreen }">
            <video
              autoplay
              loop
              muted
              playsinline
              controls
              controlslist="nofullscreen"
              class="promo-video-player"
              @dblclick="togglePromoFullscreen"
            >
              <source src="/promo.webm" type="video/webm" />
            </video>
            <!-- Nis-Bil Brand Overlay Cover -->
            <div class="video-brand-cover">
              <div class="brand-bubble-icon-cover">
                <svg viewBox="0 0 32 32" fill="none" class="bubble-svg">
                  <circle cx="16" cy="16" r="14" fill="url(#pinkBubbleGradLandingCover)" />
                  <circle cx="11.5" cy="14" r="2" fill="#ffffff" />
                  <circle cx="20.5" cy="14" r="2" fill="#ffffff" />
                  <path d="M11 19c1.2 1.3 3 2 5 2s3.8-.7 5-2" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" />
                  <defs>
                    <linearGradient id="pinkBubbleGradLandingCover" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#ff2e93" />
                      <stop offset="1" stop-color="#ff52a8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div class="brand-text-cover">
                <div class="cover-brand-title">nis-bil<span class="cover-brand-accent">.online</span></div>
                <div class="cover-brand-sub">БІЛІМ ПЛАТФОРМАСЫ</div>
              </div>
              <button
                type="button"
                class="btn-cover-fullscreen"
                @click="togglePromoFullscreen"
                :title="isPromoFullscreen ? (currentLang === 'kk' ? 'Экраннан шығу' : 'Выйти из полноэкранного режима') : (currentLang === 'kk' ? 'Толық экран' : 'На весь экран')"
                aria-label="Toggle Fullscreen"
              >
                <svg class="icon-enter-fs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
                <svg class="icon-exit-fs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                </svg>
              </button>
            </div>
            <div class="screen-frame-glow"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- WHY US SECTION -->
    <section id="why-us" class="section-why-us">
      <div class="container">
        <div class="why-us-header-flex">
          <div>
            <div class="section-badge-pink">{{ currentLang === 'kk' ? 'БІЗДІҢ АРТЫҚШЫЛЫҒЫ →' : 'НАШИ ПРЕИМУЩЕСТВА →' }}</div>
            <h2 class="section-title">
              {{ currentLang === 'kk' ? 'Неліктен ' : 'Почему ' }}<span class="hero-highlight-gradient">{{ currentLang === 'kk' ? 'біз?' : 'мы?' }}</span>
            </h2>
          </div>
          <a href="#system" class="link-all-features">
            {{ currentLang === 'kk' ? 'Барлық мүмкіндіктер' : 'Все возможности' }} ➔
          </a>
        </div>

        <div class="features-grid">
          <!-- Card 1 (From mockup) -->
          <div class="feature-luxury-card">
            <div class="feature-icon-circle">🎯</div>
            <div class="feature-content">
              <h3>{{ currentLang === 'kk' ? 'Ақылды алгоритм' : 'Умный алгоритм' }}</h3>
              <p>{{ currentLang === 'kk' ? 'Сіздің деңгейіңізге сай жеке оқу жолдары.' : 'Индивидуальная траектория под ваш уровень знаний.' }}</p>
            </div>
          </div>

          <!-- Card 2 (From mockup) -->
          <div class="feature-luxury-card">
            <div class="feature-icon-circle">▶️</div>
            <div class="feature-content">
              <h3>{{ currentLang === 'kk' ? 'Видеоталдау' : 'Видеоразбор' }}</h3>
              <p>{{ currentLang === 'kk' ? 'Әр қателікке толық түсіндірме.' : 'Пошаговое объяснение каждого сложного задания.' }}</p>
            </div>
          </div>

          <!-- Card 3 (From mockup) -->
          <div class="feature-luxury-card">
            <div class="feature-icon-circle">👤</div>
            <div class="feature-content">
              <h3>{{ currentLang === 'kk' ? 'Жеке куратор' : 'Личный куратор' }}</h3>
              <p>{{ currentLang === 'kk' ? '24/7 байланыс және қолдау.' : '24/7 обратная связь, мотивация и регулярный контроль.' }}</p>
            </div>
          </div>

          <!-- Card 4 (From mockup) -->
          <div class="feature-luxury-card">
            <div class="feature-icon-circle">📊</div>
            <div class="feature-content">
              <h3>{{ currentLang === 'kk' ? 'Прогресс трекері' : 'Трекер прогресса' }}</h3>
              <p>{{ currentLang === 'kk' ? 'Оқу динамикасы мен нақты статистика.' : 'Наглядная динамика подготовки и вероятность гранта.' }}</p>
            </div>
          </div>

          <!-- Card 5 -->
          <div class="feature-luxury-card">
            <div class="feature-icon-circle">🏆</div>
            <div class="feature-content">
              <h3>{{ currentLang === 'kk' ? '22+ жыл академиялық тәжірибе' : '22+ года академической экспертизы' }}</h3>
              <p>{{ currentLang === 'kk' ? 'Қазақстанның үздік олимпиадалық мұғалімдерінің авторлық әдістемесі.' : 'Авторская методика сильнейших олимпиадных педагогов РК.' }}</p>
            </div>
          </div>

          <!-- Card 6 -->
          <div class="feature-luxury-card">
            <div class="feature-icon-circle">🌐</div>
            <div class="feature-content">
              <h3>{{ currentLang === 'kk' ? 'Екі тілде толық оқу (KZ / RU)' : 'Обучение на двух языках (KZ / RU)' }}</h3>
              <p>{{ currentLang === 'kk' ? 'Барлық сабақтар, терминдер мен тесттер толықтай екі тілде синхрондалған.' : 'Синхронная база уроков и тестов на чистом казахском и русском.' }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- COURSE SYSTEM (6 STEPS ROADMAP) -->
    <section id="system" class="section-system">
      <div class="container">
        <div class="section-heading text-center">
          <div class="cyber-tag">{{ t("landing.systemTag") }}</div>
          <h2 class="section-title">{{ t("landing.systemTitle") }}</h2>
          <p class="section-subtitle">{{ t("landing.systemSub") }}</p>
        </div>

        <div class="system-timeline">
          <!-- Step 1 -->
          <div class="timeline-step-item">
            <div class="step-badge">01</div>
            <div class="step-card">
              <div class="step-header">
                <h4>{{ currentLang === 'kk' ? 'Входная диагностика' : 'Входная диагностика' }}</h4>
                <span class="step-time">{{ currentLang === 'kk' ? '1 күн' : '1-й день' }}</span>
              </div>
              <p>
                {{ currentLang === 'kk'
                  ? 'Бастапқы білім деңгейін анықтау және оқушының әлсіз тақырыптарын анықтайтын кешенді тестілеу.'
                  : 'Комплексный срез знаний для выявления пробелов и формирования индивидуальной траектории обучения.'
                }}
              </p>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="timeline-step-item">
            <div class="step-badge">02</div>
            <div class="step-card">
              <div class="step-header">
                <h4>{{ currentLang === 'kk' ? 'Түйінді теория' : 'Концентрированная теория' }}</h4>
                <span class="step-time">100+ {{ currentLang === 'kk' ? 'сағат' : 'часов' }}</span>
              </div>
              <p>
                {{ currentLang === 'kk'
                  ? '10-15 минуттық ықшам видеосабақтар: формулалар, жылдам есептеу тәсілдері және логикалық амалдар.'
                  : 'Лаконичные уроки по 10-15 минут: формулы, логические паттерны и авторские лайфхаки быстрого счёта.'
                }}
              </p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="timeline-step-item">
            <div class="step-badge">03</div>
            <div class="step-card">
              <div class="step-header">
                <h4>{{ currentLang === 'kk' ? 'Интерактивті жаттығу' : 'Интерактивный тренажер' }}</h4>
                <span class="step-time">15 000+ {{ currentLang === 'kk' ? 'есеп' : 'задач' }}</span>
              </div>
              <p>
                {{ currentLang === 'kk'
                  ? 'Әрбір тақырыпты жүздеген күрделі тесттермен бекіту және нақты уақыт режимінде нәтижені бағалау.'
                  : 'Закрепление каждого урока сотнями тестовых заданий разного уровня сложности с таймером.'
                }}
              </p>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="timeline-step-item">
            <div class="step-badge">04</div>
            <div class="step-card">
              <div class="step-header">
                <h4>{{ currentLang === 'kk' ? 'Қателермен жұмыс' : 'Умная работа над ошибками' }}</h4>
                <span class="step-time">AI {{ currentLang === 'kk' ? 'талдау' : 'анализ' }}</span>
              </div>
              <p>
                {{ currentLang === 'kk'
                  ? 'Жүйе қате жауаптарды арнайы банкке жинақтап, оқушы толық меңгергенге дейін қайталатады.'
                  : 'Платформа сохраняет допущенные ошибки и генерирует персональные повторные тесты до полного усвоения.'
                }}
              </p>
            </div>
          </div>

          <!-- Step 5 -->
          <div class="timeline-step-item">
            <div class="step-badge">05</div>
            <div class="step-card">
              <div class="step-header">
                <h4>{{ currentLang === 'kk' ? 'Кураторлық қолдау' : 'Кураторское сопровождение' }}</h4>
                <span class="step-time">24/7</span>
              </div>
              <p>
                {{ currentLang === 'kk'
                  ? 'Шағын топтардағы апталық байланыс, күрделі есептерді бірге талдау және үздіксіз мотивация.'
                  : 'Работа в малых онлайн-группах, еженедельный разбор сложных олимпиадных задач и контроль дисциплины.'
                }}
              </p>
            </div>
          </div>

          <!-- Step 6 -->
          <div class="timeline-step-item highlight-step">
            <div class="step-badge">06</div>
            <div class="step-card">
              <div class="step-header">
                <h4>{{ currentLang === 'kk' ? 'Генералды Mock-емтихандар' : 'Генеральные Mock-экзамены' }}</h4>
                <span class="step-time">Финал</span>
              </div>
              <p>
                {{ currentLang === 'kk'
                  ? 'Нағыз емтиханның толық симуляциясы: уақытты бақылау, стресске төзімділік және нақты грантқа дайындық.'
                  : 'Полная симуляция реального вступительного испытания с жестким таймингом и стресс-тестированием.'
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- LIVE EXPRESS CALCULATOR WIDGET -->
    <section id="calc-preview" class="section-calc-preview">
      <div class="container">
        <div class="calc-preview-card">
          <div class="calc-preview-info">
            <div class="cyber-tag">{{ t("landing.calcTag") }}</div>
            <h2 class="calc-title">{{ t("landing.calcTitle") }}</h2>
            <p class="calc-subtitle">
              {{ currentLang === 'kk'
                ? 'Мектеп түрін таңдап, болжамды балыңызды көрсетіңіз. Жүйе грантқа түсу мүмкіндігіңізді бірден есептейді.'
                : 'Выберите целевую школу и укажите ориентировочный балл. Алгоритм моментально оценит ваши шансы на грант.'
              }}
            </p>

            <!-- School Switcher -->
            <div class="calc-type-switch">
              <button
                :class="{ active: calcSchool === 'nzm' }"
                @click="setCalcSchool('nzm')"
              >
                НИШ (NIS)
              </button>
              <button
                :class="{ active: calcSchool === 'bil' }"
                @click="setCalcSchool('bil')"
              >
                БИЛ (BIL)
              </button>
            </div>

            <!-- Score Slider -->
            <div class="calc-slider-block">
              <div class="calc-slider-header">
                <span>{{ currentLang === 'kk' ? 'Болжамды балл' : 'Ожидаемый балл' }}:</span>
                <span class="calc-score-val">{{ calcScore }} {{ calcSchool === 'nzm' ? '/ 1400' : '/ 100' }}</span>
              </div>
              <input
                type="range"
                v-model.number="calcScore"
                :min="calcSchool === 'nzm' ? 600 : 30"
                :max="calcSchool === 'nzm' ? 1400 : 100"
                step="5"
                class="cyber-range-input"
              />
            </div>

            <router-link to="/calculator" class="btn-cyber mt-4">
              <span>{{ currentLang === 'kk' ? 'Пәндер бойынша толық калькулятор' : 'Открыть детальный калькулятор по предметам' }}</span>
              <span>➔</span>
            </router-link>
          </div>

          <!-- Score Radar / Meter Gauge -->
          <div class="calc-preview-gauge">
            <div class="gauge-circle-outer">
              <div class="gauge-circle-inner">
                <div class="gauge-percent">{{ calcPercent }}%</div>
                <div class="gauge-caption">{{ currentLang === 'kk' ? 'ТҮСУ ЫҚТИМАЛДЫҒЫ' : 'ШАНС НА ГРАНТ' }}</div>
                <div class="gauge-status-badge" :class="gaugeStatusClass">
                  {{ gaugeStatusText }}
                </div>
              </div>
            </div>

            <div class="gauge-school-targets">
              <div class="target-title">{{ currentLang === 'kk' ? 'Қолжетімді мектептер' : 'Доступные школы' }}:</div>
              <div class="target-list">
                <span class="target-tag" v-for="school in recommendedSchools" :key="school">
                  ✓ {{ school }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- RESULTS & STUDENT SUCCESS SECTION -->
    <section id="results" class="section-results">
      <div class="container">
        <div class="section-heading text-center">
          <div class="cyber-tag">{{ t("landing.resultsTag") }}</div>
          <h2 class="section-title">{{ t("landing.resultsTitle") }}</h2>
          <p class="section-subtitle">
            {{ currentLang === 'kk' 
              ? 'НИШ пен БИЛ-ге грант ұтып алған оқушыларымыздың нақты нәтижелері' 
              : 'Реальные результаты наших учеников, поступивших на грант в НИШ и БИЛ' 
            }}
          </p>

          <!-- Category Toggle Tabs -->
          <div class="results-toggle-wrapper">
            <button
              class="result-tab-btn"
              :class="{ active: activeResultTab === 'nis' }"
              @click="activeResultTab = 'nis'"
            >
              🎓 {{ currentLang === 'kk' ? 'НИШ нәтижелері (25 оқушы)' : 'Результаты НИШ (25 учеников)' }}
            </button>
            <button
              class="result-tab-btn"
              :class="{ active: activeResultTab === 'bil' }"
              @click="activeResultTab = 'bil'"
            >
              🏆 {{ currentLang === 'kk' ? 'БИЛ нәтижелері (10 оқушы)' : 'Результаты БИЛ (10 учеников)' }}
            </button>
          </div>
        </div>

        <!-- Meta Summary Stats Bar -->
        <div v-if="activeResultTab === 'nis'" class="results-summary-strip">
          <div class="summary-pill gold">🥇 1-орын: 1396 балл</div>
          <div class="summary-pill bronze">🥉 3-орын: 1354 балл</div>
          <div class="summary-pill purple">⭐ 6-орын: 1322 балл</div>
          <div class="summary-pill green">✓ 25 грант иегері</div>
        </div>

        <div v-else class="results-summary-strip">
          <div class="summary-pill pink">⚡ Ең жоғары: 220 балл</div>
          <div class="summary-pill green">🔥 Орташа өсім: +117 балл</div>
          <div class="summary-pill purple">🏫 Түркістан, Шымкент, Бурабай, Арыс БИЛ</div>
          <button @click="showBilPosterModal = true" class="summary-pill btn-poster-link">
            🖼️ {{ currentLang === 'kk' ? 'Ресми постерді көру' : 'Официальный постер' }}
          </button>
        </div>

        <!-- NIS GRID -->
        <div v-if="activeResultTab === 'nis'" class="results-grid">
          <div
            v-for="(student, idx) in displayedNisStudents"
            :key="idx"
            class="student-result-card"
            :class="{
              'gold-card': student.medal === 'gold',
              'bronze-card': student.medal === 'bronze',
              'top-card': student.medal === 'top'
            }"
          >
            <div class="card-top">
              <div
                class="avatar-ring"
                :class="{
                  'gold-ring': student.medal === 'gold',
                  'bronze-ring': student.medal === 'bronze',
                  'pink-ring': student.medal === 'top'
                }"
              >
                {{ student.initials }}
              </div>
              <div class="student-meta">
                <h4>{{ student.name }}</h4>
                <span class="school-target">
                  {{ currentLang === 'kk' ? 'НИШ (НЗМ) гранты' : 'Грант НИШ (НЗМ)' }}
                </span>
              </div>
              <div class="rank-badge" :class="student.medal">
                {{ currentLang === 'kk' ? student.rank : student.rankRu }}
              </div>
            </div>

            <div class="card-score-row">
              <span class="score-label">{{ currentLang === 'kk' ? 'Қорытынды балл:' : 'Итоговый балл:' }}</span>
              <span class="score-badge font-bold">{{ student.score }} балл</span>
            </div>

            <div class="result-footer">
              <span class="grant-pill">✓ {{ currentLang === 'kk' ? 'ГРАНТ ИЕГЕРІ' : 'ОБЛАДАТЕЛЬ ГРАНТА' }}</span>
              <span class="verified-pill">#{{ idx + 1 }} {{ currentLang === 'kk' ? 'тізімде' : 'в списке' }}</span>
            </div>
          </div>
        </div>

        <!-- BIL GRID -->
        <div v-else class="results-grid">
          <div
            v-for="(student, idx) in bilStudents"
            :key="idx"
            class="student-result-card bil-card"
            :class="{ 'highlight-card': student.highlight }"
          >
            <div class="card-top">
              <div class="avatar-ring pink-ring">
                {{ student.initials }}
              </div>
              <div class="student-meta">
                <h4>{{ student.name }}</h4>
                <span class="school-target">{{ currentLang === 'kk' ? student.school : student.schoolRu }}</span>
              </div>
              <div class="score-badge large-score">{{ student.finalScore }} БАЛЛ</div>
            </div>

            <div class="progression-box">
              <div class="progression-labels">
                <span>{{ currentLang === 'kk' ? 'Бастапқы' : 'Было' }}: {{ student.initialScore }} балл</span>
                <span class="growth-tag">+{{ student.growth }} балл өсім</span>
                <span class="final-tag">{{ currentLang === 'kk' ? 'Нәтиже' : 'Стало' }}: {{ student.finalScore }} балл</span>
              </div>
              <div class="progression-bar-bg">
                <div
                  class="progression-bar-fill"
                  :style="{ width: Math.min(100, Math.round((student.finalScore / 250) * 100)) + '%' }"
                ></div>
              </div>
            </div>

            <div class="result-footer">
              <span class="grant-pill">✓ {{ currentLang === 'kk' ? 'ГРАНТ ИЕГЕРІ' : 'ОБЛАДАТЕЛЬ ГРАНТА' }}</span>
              <span class="verified-pill">{{ currentLang === 'kk' ? student.school : student.schoolRu }}</span>
            </div>
          </div>
        </div>

        <!-- Show More / Show Less Toggle Button for NIS -->
        <div v-if="activeResultTab === 'nis' && nisStudents.length > 9" class="text-center mt-8">
          <button
            @click="showAllNis = !showAllNis"
            class="btn-cyber-outline"
          >
            {{ showAllNis
              ? (currentLang === 'kk' ? 'Жинақтау ▲' : 'Свернуть ▲')
              : (currentLang === 'kk' ? `Барлық 25 нәтижені көру (${nisStudents.length}) ▼` : `Показать все 25 результатов (${nisStudents.length}) ▼`)
            }}
          </button>
        </div>

        <!-- Poster Modal for BIL -->
        <div v-if="showBilPosterModal" class="poster-modal-overlay" @click.self="showBilPosterModal = false">
          <div class="poster-modal-card">
            <div class="poster-modal-header">
              <h3>{{ currentLang === 'kk' ? 'БИЛ Грант иегерлері — Ресми постер' : 'Обладатели грантов БИЛ — Официальный постер' }}</h3>
              <button @click="showBilPosterModal = false" class="btn-close">&times;</button>
            </div>
            <div class="poster-modal-body">
              <img src="/bil_grants.png" alt="БИЛ Грант Иегерлері" class="poster-img" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TARIFFS SECTION -->
    <section id="tariffs" class="section-tariffs">
      <div class="container">
        <div class="section-heading text-center">
          <div class="cyber-tag">{{ t("landing.tariffsTag") }}</div>
          <h2 class="section-title">{{ t("landing.tariffsTitle") }}</h2>
          <p class="section-subtitle">{{ t("landing.tariffsSub") }}</p>
        </div>

        <div class="tariffs-grid">
          <!-- Tariff 1 -->
          <div class="tariff-cyber-card">
            <div class="tariff-header">
              <h3 class="tariff-name">НИШ Online</h3>
              <p class="tariff-for">{{ currentLang === 'kk' ? 'НЗМ-ге толық дайындық' : 'Полная подготовка к НИШ' }}</p>
            </div>
            <ul class="tariff-features">
              <li><span class="check-icon">✓</span> {{ currentLang === 'kk' ? 'Математика (НЗМ барлық тақырыптары)' : 'Математика (все темы стандарта НИШ)' }}</li>
              <li><span class="check-icon">✓</span> {{ currentLang === 'kk' ? 'Сандық сипаттамалар мен логика' : 'Числовые характеристики и логика' }}</li>
              <li><span class="check-icon">✓</span> {{ currentLang === 'kk' ? 'Жаратылыстану блогы' : 'Естествознание и наука' }}</li>
              <li><span class="check-icon">✓</span> {{ currentLang === 'kk' ? 'Қателерді видеомен талдау' : 'Детальный видеоразбор каждой ошибки' }}</li>
              <li><span class="check-icon">✓</span> {{ currentLang === 'kk' ? '24/7 платформаға қолжетімділік' : 'Круглосуточный доступ 24/7' }}</li>
            </ul>
            <a
              href="https://wa.me/77761555433?text=Здравствуйте!%20Хочу%20узнать%20подробнее%20о%20тарифе%20НИШ%20Online"
              target="_blank"
              class="btn-cyber w-full"
            >
              {{ currentLang === 'kk' ? 'Өтінім қалдыру' : 'Оставить заявку' }}
            </a>
          </div>

          <!-- Tariff 2 (Featured Hot Pink) -->
          <div class="tariff-cyber-card featured-tariff">
            <div class="popular-ribbon">{{ currentLang === 'kk' ? 'ЕҢ ТАНЫМАЛ' : 'ХИТ ВЫБОРА' }}</div>
            <div class="tariff-header">
              <h3 class="tariff-name">БИЛ Online</h3>
              <p class="tariff-for">{{ currentLang === 'kk' ? 'БИЛ лицейлеріне қарқынды дайындық' : 'Интенсив в лицеи БИЛ' }}</p>
            </div>
            <ul class="tariff-features">
              <li><span class="check-icon">✓</span> {{ currentLang === 'kk' ? 'Олимпиадалық математика' : 'Олимпиадная математика БИЛ' }}</li>
              <li><span class="check-icon">✓</span> {{ currentLang === 'kk' ? 'Күрделі логикалық есептер' : 'Нестандартная логика' }}</li>
              <li><span class="check-icon">✓</span> {{ currentLang === 'kk' ? 'Қазақ тілі емтихан форматында' : 'Казахский язык по формату экзамена' }}</li>
              <li><span class="check-icon">✓</span> {{ currentLang === 'kk' ? '15 000+ тест тапсырмалары' : 'Банк из 15 000+ тренировочных задач' }}</li>
              <li><span class="check-icon">✓</span> {{ currentLang === 'kk' ? 'Жеке куратор бақылауы' : 'Персональный куратор и группа' }}</li>
              <li><span class="check-icon">✓</span> {{ currentLang === 'kk' ? 'Ай сайынғы Mock-емтихандар' : 'Ежемесячные Mock-экзамены' }}</li>
            </ul>
            <a
              href="https://wa.me/77761555433?text=Здравствуйте!%20Хочу%20узнать%20подробнее%20о%20тарифе%20БИЛ%20Online"
              target="_blank"
              class="btn-cyber w-full btn-featured"
            >
              {{ currentLang === 'kk' ? 'Өтінім қалдыру' : 'Оставить заявку' }}
            </a>
          </div>

          <!-- Tariff 3 -->
          <div class="tariff-cyber-card">
            <div class="tariff-header">
              <h3 class="tariff-name">НИШ + БИЛ VIP</h3>
              <p class="tariff-for">{{ currentLang === 'kk' ? 'Екі мектепке қатар дайындық' : 'Максимальный комплекс 2-в-1' }}</p>
            </div>
            <ul class="tariff-features">
              <li><span class="check-icon">✓</span> {{ currentLang === 'kk' ? 'НЗМ және БИЛ барлық пәндері' : 'Все предметы НИШ и БИЛ' }}</li>
              <li><span class="check-icon">✓</span> {{ currentLang === 'kk' ? 'Ағылшын тілі (бонус сабақтар)' : 'Английский язык (бонусный курс)' }}</li>
              <li><span class="check-icon">✓</span> {{ currentLang === 'kk' ? 'Үй жұмыстарын басымдықпен тексеру' : 'Приоритетная проверка ДЗ куратором' }}</li>
              <li><span class="check-icon">✓</span> {{ currentLang === 'kk' ? 'Ата-анаға апта сайынғы есеп' : 'Еженедельные отчеты родителям' }}</li>
              <li><span class="check-icon">✓</span> {{ currentLang === 'kk' ? 'Барлық Mock-тесттерге рұқсат' : 'Все генеральные симуляции экзаменов' }}</li>
            </ul>
            <a
              href="https://wa.me/77761555433?text=Здравствуйте!%20Хочу%20узнать%20подробнее%20о%20тарифе%20НИШ%20плюс%20БИЛ%20VIP"
              target="_blank"
              class="btn-cyber w-full"
            >
              {{ currentLang === 'kk' ? 'Өтінім қалдыру' : 'Оставить заявку' }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ ACCORDION SECTION -->
    <section id="faq" class="section-faq">
      <div class="container">
        <div class="section-heading text-center">
          <div class="cyber-tag">{{ t("landing.faqTag") }}</div>
          <h2 class="section-title">{{ t("landing.faqTitle") }}</h2>
        </div>

        <div class="faq-accordion-list">
          <div
            v-for="(item, idx) in faqItems"
            :key="idx"
            class="faq-accordion-item"
            :class="{ open: openFaq === idx }"
            @click="toggleFaq(idx)"
          >
            <div class="faq-question">
              <span class="faq-q-text">{{ currentLang === 'kk' ? item.qKk : item.qRu }}</span>
              <span class="faq-toggle-icon">{{ openFaq === idx ? '−' : '+' }}</span>
            </div>
            <div v-show="openFaq === idx" class="faq-answer">
              <p>{{ currentLang === 'kk' ? item.aKk : item.aRu }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FINAL WOW CTA BANNER -->
    <section class="section-cta-banner">
      <div class="container">
        <div class="cta-banner-card">
          <div class="cta-banner-glow"></div>
          <div class="cta-banner-content">
            <span class="cyber-tag">{{ currentLang === 'kk' ? 'БҮГІН БАСТАҢЫЗ' : 'НАЧНИТЕ СЕГОДНЯ' }}</span>
            <h2 class="cta-banner-title">{{ t("landing.ctaTitle") }}</h2>
            <p class="cta-banner-sub">{{ t("landing.ctaSub") }}</p>
            <div class="cta-banner-buttons">
              <router-link to="/trial-test" class="btn-cyber btn-cta-primary">
                ⚡ {{ t("landing.ctaTrial") }}
              </router-link>
              <a
                href="https://wa.me/77761555433"
                target="_blank"
                class="btn-cyber-outline btn-cta-wa"
              >
                💬 {{ t("landing.ctaWa") }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer-futuristic">
      <div class="container footer-grid">
        <div class="footer-col brand-col">
          <div class="footer-logo">
            <span class="logo-white">nis-bil</span><span class="logo-pink">.online</span>
          </div>
          <p class="footer-tagline">
            {{ t("landing.footerTagline") }}<br />
            {{ t("landing.footerQuality") }}
          </p>
          <div class="social-links">
            <a href="https://wa.me/77761555433" target="_blank" class="social-icon-btn" title="WhatsApp">WA</a>
            <a href="https://www.instagram.com/dostyq.kyzylorda/" target="_blank" class="social-icon-btn" title="Instagram">IG</a>
          </div>
        </div>

        <div class="footer-col">
          <h4>{{ t("landing.usefulLinks") }}</h4>
          <ul>
            <li><router-link to="/trial-test">{{ t("nav.trial") }}</router-link></li>
            <li><router-link to="/calculator">{{ t("nav.calculator") }}</router-link></li>
            <li><router-link to="/tariffs">{{ t("nav.tariffs") }}</router-link></li>
            <li><a href="/offert.pdf" target="_blank">{{ t("landing.offer") }}</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>{{ t("landing.contacts") }}</h4>
          <ul>
            <li>
              <a href="https://wa.me/77761555433" target="_blank">
                WhatsApp: +7 776 155 54 33
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/dostyq.kyzylorda/" target="_blank">
                Instagram: @dostyq.kyzylorda
              </a>
            </li>
            <li>
              <span class="footer-support-hours">Пн-Вс: 09:00 - 21:00</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom-bar">
        <div class="container flex justify-between items-center bottom-flex">
          <p>&copy; 2026 nis-bil.online. {{ t("landing.rights") }}</p>
          <button @click="scrollToTop" class="btn-back-to-top">
            ▲ {{ currentLang === 'kk' ? 'Жоғарыға' : 'Наверх' }}
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import MainHeader from "../components/MainHeader.vue";
import { useLanguage } from "../composables/useLanguage";

const { t, currentLang } = useLanguage();

// Live Calculator Widget State
const calcSchool = ref("nzm");
const calcScore = ref(1180);

const setCalcSchool = (school) => {
  calcSchool.value = school;
  calcScore.value = school === "nzm" ? 1180 : 85;
};

const calcPercent = computed(() => {
  if (calcSchool.value === "nzm") {
    // 600 to 1400 range
    const clamped = Math.max(600, Math.min(1400, calcScore.value));
    if (clamped >= 1250) return 99;
    if (clamped >= 1150) return Math.round(85 + ((clamped - 1150) / 100) * 13);
    if (clamped >= 1000) return Math.round(60 + ((clamped - 1000) / 150) * 24);
    return Math.max(15, Math.round(((clamped - 600) / 400) * 58));
  } else {
    // 30 to 100 range
    const clamped = Math.max(30, Math.min(100, calcScore.value));
    if (clamped >= 90) return 98;
    if (clamped >= 80) return Math.round(82 + ((clamped - 80) / 10) * 15);
    if (clamped >= 65) return Math.round(55 + ((clamped - 65) / 15) * 26);
    return Math.max(15, Math.round(((clamped - 30) / 35) * 39));
  }
});

const gaugeStatusClass = computed(() => {
  if (calcPercent.value >= 85) return "status-high";
  if (calcPercent.value >= 60) return "status-mid";
  return "status-low";
});

const gaugeStatusText = computed(() => {
  if (currentLang.value === "kk") {
    if (calcPercent.value >= 85) return "Жасыл аймақ: Жоғары мүмкіндік!";
    if (calcPercent.value >= 60) return "Сары аймақ: Орташа мүмкіндік";
    return "Қызыл аймақ: Дайындықты күшейту қажет";
  } else {
    if (calcPercent.value >= 85) return "Зеленая зона: Высокий шанс на грант!";
    if (calcPercent.value >= 60) return "Желтая зона: Хороший потенциал";
    return "Красная зона: Требуется усиленная подготовка";
  }
});

const recommendedSchools = computed(() => {
  if (calcSchool.value === "nzm") {
    if (calcPercent.value >= 85) {
      return ["НИШ ФМН Алматы", "НИШ Астана", "НИШ Шымкент", "НИШ Караганда"];
    } else if (calcPercent.value >= 60) {
      return ["НИШ ХБН Павлодар", "НИШ Кызылорда", "НИШ Тараз"];
    } else {
      return ["НИШ (Резервный список)"];
    }
  } else {
    if (calcPercent.value >= 85) {
      return ["БИЛ Астана №1", "БИЛ Алматы", "БИЛ Шымкент"];
    } else if (calcPercent.value >= 60) {
      return ["БИЛ Караганда", "БИЛ Актобе", "БИЛ Кызылорда"];
    } else {
      return ["БИЛ (Резерв)"];
    }
  }
});

// FAQ Accordion State
const openFaq = ref(0);
const toggleFaq = (idx) => {
  openFaq.value = openFaq.value === idx ? -1 : idx;
};

const faqItems = [
  {
    qRu: "С какого класса лучше начинать подготовку к НИШ и БИЛ?",
    qKk: "НЗМ және БИЛ-ге дайындықты қай сыныптан бастаған дұрыс?",
    aRu: "Идеально начинать подготовку с 5 класса, чтобы без спешки закрыть школьные пробелы и выйти на олимпиадный уровень. Однако при интенсивной программе на нашей платформе ученики 6 класса успешно готовятся за 4-6 месяцев благодаря ежедневным практическим тренажерам.",
    aKk: "Дайындықты 5-сыныптан бастаған өте тиімді, бұл мектеп бағдарламасын толық меңгеріп, олимпиадалық деңгейге көтерілуге мүмкіндік береді. Дегенмен, біздің платформамыздың қарқынды жүйесімен 6-сынып оқушылары 4-6 айда сәтті дайындалып шыға алады."
  },
  {
    qRu: "Чем онлайн-формат NIS-BIL эффективнее обычных репетиторов?",
    qKk: "NIS-BIL онлайн форматы қатардағы репетиторлардан несімен артық?",
    aRu: "Обычный репетитор дает 2-3 часа в неделю. На платформе ученик имеет доступ 24/7 к банку из 15 000+ задач с мгновенным видеоразбором ошибок, персональному трекеру темпа и поддержке куратора, что дает в 3-4 раза больше концентрированной практики.",
    aKk: "Қарапайым репетитор аптасына 2-3 сағат қана бөледі. Ал біздің платформада оқушы тәулік бойы 15 000-нан астам есептер қорына, бейнеталдауларға және жеке куратор көмегіне қол жеткізеді, бұл дайындық сапасын еселейді."
  },
  {
    qRu: "Как родители могут отслеживать результаты ребенка?",
    qKk: "Ата-аналар баланың үлгерімін қалай бақылай алады?",
    aRu: "В личном кабинете доступна детальная аналитика: процент пройденного курса, средний балл за тесты, статистика ошибок и посещаемость. Кроме того, куратор еженедельно отправляет родителям отчет об успехах ученика.",
    aKk: "Жеке кабинетте барлық аналитика ашық көрсетіледі: өтілген сабақ пайызы, тесттердің орташа балы, қателер тарихы. Сонымен қатар куратор апта сайын ата-анаға есеп беріп отырады."
  },
  {
    qRu: "Как работает система разбора ошибок в тестах?",
    qKk: "Тесттегі қателермен жұмыс қалай жүзеге асады?",
    aRu: "После отправки теста ученик видит не только правильный ответ, но и пошаговый алгоритм решения с объяснением формулы. Система запоминает проблемные вопросы и регулярно предлагает повторные контрольные задания.",
    aKk: "Тест аяқталғаннан кейін оқушы әрбір қате жауаптың шешу жолын көреді. Жүйе қате кеткен тақырыпты есте сақтап, қайта бекіту үшін арнайы тапсырмалар дайындайды."
  },
  {
    qRu: "Есть ли обучение на казахском языке?",
    qKk: "Оқыту қазақ тілінде толықтай бар ма?",
    aRu: "Да, абсолютно все курсы, видеоуроки, тесты и методические материалы полностью синхронизированы на казахском и русском языках с точной научной терминологией.",
    aKk: "Иә, платформадағы барлық курстар, видеосабақтар, тестілеулер қазақ және орыс тілдерінде толыққанды жасалған."
  }
];

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Results Section State & Datasets
const activeResultTab = ref("nis");
const showAllNis = ref(false);
const showBilPosterModal = ref(false);

const nisStudents = [
  { name: "Асқаров Нұрасыл", initials: "АН", score: 1396, rank: "1-орын", rankRu: "1-е место", medal: "gold" },
  { name: "Асқар Нұрасыл", initials: "АН", score: 1354, rank: "3-орын", rankRu: "3-е место", medal: "bronze" },
  { name: "Болат Адият", initials: "БА", score: 1322, rank: "6-орын", rankRu: "6-е место", medal: "top" },
  { name: "Серік Ернұр", initials: "СЕ", score: 1284, rank: "15-орын", rankRu: "15-е место", medal: "top" },
  { name: "Нәби Қайсар", initials: "НҚ", score: 1283, rank: "16-орын", rankRu: "16-е место", medal: "top" },
  { name: "Әбдірәсіл Қазыбек", initials: "ӘҚ", score: 1269, rank: "18-орын", rankRu: "18-е место", medal: "top" },
  { name: "Байдүйсен Інжу", initials: "БІ", score: 1229, rank: "26-орын", rankRu: "26-е место", medal: "top" },
  { name: "Амирхан Алихан", initials: "АА", score: 1224, rank: "29-орын", rankRu: "29-е место", medal: "top" },
  { name: "Нұржанұлы Алихан", initials: "НА", score: 1181, rank: "54-орын", rankRu: "54-е место", medal: "" },
  { name: "Бақытжан Мадияр", initials: "БМ", score: 1159, rank: "58-орын", rankRu: "58-е место", medal: "" },
  { name: "Тасқараев Қабылсая", initials: "ТҚ", score: 1164, rank: "61-орын", rankRu: "61-е место", medal: "" },
  { name: "Тұрғанбаев Батырхан", initials: "ТБ", score: 1142, rank: "70-орын", rankRu: "70-е место", medal: "" },
  { name: "Абизов Амир", initials: "АА", score: 1136, rank: "72-орын", rankRu: "72-е место", medal: "" },
  { name: "Архат Ерасыл", initials: "АЕ", score: 1131, rank: "73-орын", rankRu: "73-е место", medal: "" },
  { name: "Көктемқызы Ақбаян", initials: "КА", score: 1118, rank: "76-орын", rankRu: "76-е место", medal: "" },
  { name: "Каһарманқызы Амина", initials: "КА", score: 1094, rank: "91-орын", rankRu: "91-е место", medal: "" },
  { name: "Әділ Бақдаулет", initials: "ӘБ", score: 1079, rank: "95-орын", rankRu: "95-е место", medal: "" },
  { name: "Жолдас Даулет", initials: "ЖД", score: 1074, rank: "99-орын", rankRu: "99-е место", medal: "" },
  { name: "Тобыл Айару", initials: "ТА", score: 1073, rank: "100-орын", rankRu: "100-е место", medal: "" },
  { name: "Байсугылов Нұрасыл", initials: "БН", score: 1066, rank: "110-орын", rankRu: "110-е место", medal: "" },
  { name: "Аманбек Алинұр", initials: "АА", score: 1060, rank: "116-орын", rankRu: "116-е место", medal: "" },
  { name: "Орынбасаров Расул", initials: "ОР", score: 1047, rank: "123-орын", rankRu: "123-е место", medal: "" },
  { name: "Жандосұлы Мади", initials: "ЖМ", score: 1043, rank: "126-орын", rankRu: "126-е место", medal: "" },
  { name: "Қалыбай Әліп", initials: "ҚӘ", score: 1040, rank: "128-орын", rankRu: "128-е место", medal: "" },
  { name: "Ерланұлы Нұрасыл", initials: "ЕН", score: 1035, rank: "132-орын", rankRu: "132-е место", medal: "" }
];

const bilStudents = [
  { name: "Бекежан Муслим", initials: "БМ", school: "Шымкент БИЛ", schoolRu: "Шымкент БИЛ", finalScore: 220, initialScore: 94, growth: 126, highlight: true },
  { name: "Әуезхан Әбубәкір", initials: "ӘӘ", school: "Шымкент БИЛ", schoolRu: "Шымкент БИЛ", finalScore: 211, initialScore: 92, growth: 119, highlight: true },
  { name: "Оралбай Нұрсерік", initials: "ОН", school: "Түркістан БИЛ", schoolRu: "Туркестан БИЛ", finalScore: 210, initialScore: 150, growth: 60, highlight: true },
  { name: "Кәрім Қуаныш", initials: "КҚ", school: "Шымкент БИЛ", schoolRu: "Шымкент БИЛ", finalScore: 210, initialScore: 83, growth: 127, highlight: false },
  { name: "Абишов Омарали", initials: "АО", school: "Түркістан БИЛ", schoolRu: "Туркестан БИЛ", finalScore: 203, initialScore: 71, growth: 132, highlight: false },
  { name: "Кәрім Кәусар", initials: "КК", school: "Шымкент БИЛ", schoolRu: "Шымкент БИЛ", finalScore: 199, initialScore: 64, growth: 135, highlight: false },
  { name: "Махсұт Бейбарыс", initials: "МБ", school: "Бурабай БИЛ", schoolRu: "Бурабай БИЛ", finalScore: 195, initialScore: 115, growth: 80, highlight: false },
  { name: "Садық Әбубәкір", initials: "СӘ", school: "Арыс БИЛ", schoolRu: "Арыс БИЛ", finalScore: 189, initialScore: 70, growth: 119, highlight: false },
  { name: "Жолшы Ержігіт", initials: "ЖЕ", school: "Арыс БИЛ", schoolRu: "Арыс БИЛ", finalScore: 183, initialScore: 61, growth: 122, highlight: false },
  { name: "Абылқасым Нұрәділ", initials: "АН", school: "Арыс БИЛ", schoolRu: "Арыс БИЛ", finalScore: 170, initialScore: 22, growth: 148, highlight: false }
];

const displayedNisStudents = computed(() => {
  return showAllNis.value ? nisStudents : nisStudents.slice(0, 9);
});

// Promo Video Fullscreen Handling
const promoFrameRef = ref(null);
const isPromoFullscreen = ref(false);

const togglePromoFullscreen = () => {
  const container = promoFrameRef.value;
  if (!container) return;

  const isCurrentFullscreen =
    document.fullscreenElement === container ||
    document.webkitFullscreenElement === container ||
    container.classList.contains("is-fullscreen");

  if (!isCurrentFullscreen) {
    if (container.requestFullscreen) {
      container.requestFullscreen().catch(() => {
        container.classList.add("is-fullscreen");
        isPromoFullscreen.value = true;
      });
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    } else if (container.msRequestFullscreen) {
      container.msRequestFullscreen();
    } else {
      container.classList.add("is-fullscreen");
      isPromoFullscreen.value = true;
    }
  } else {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
    container.classList.remove("is-fullscreen");
    isPromoFullscreen.value = false;
  }
};

const handlePromoFullscreenChange = () => {
  const fsElem = document.fullscreenElement || document.webkitFullscreenElement;
  if (fsElem && (fsElem === promoFrameRef.value || promoFrameRef.value?.contains(fsElem))) {
    isPromoFullscreen.value = true;
    promoFrameRef.value?.classList.add("is-fullscreen");
  } else if (!fsElem) {
    isPromoFullscreen.value = false;
    if (promoFrameRef.value) {
      promoFrameRef.value.classList.remove("is-fullscreen");
    }
  }
};

const handlePromoKeydown = (e) => {
  if (e.key === "Escape" && (isPromoFullscreen.value || promoFrameRef.value?.classList.contains("is-fullscreen"))) {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
    if (promoFrameRef.value) {
      promoFrameRef.value.classList.remove("is-fullscreen");
    }
    isPromoFullscreen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("fullscreenchange", handlePromoFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handlePromoFullscreenChange);
  window.addEventListener("keydown", handlePromoKeydown);
});

onBeforeUnmount(() => {
  document.removeEventListener("fullscreenchange", handlePromoFullscreenChange);
  document.removeEventListener("webkitfullscreenchange", handlePromoFullscreenChange);
  window.removeEventListener("keydown", handlePromoKeydown);
});
</script>

<style scoped>
.landing-page-futuristic {
  font-family: 'Onest', sans-serif;
  background-color: #ffffff;
  color: #0f172a;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* Ambient Rose Glows */
.ambient-glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(100px);
  z-index: 0;
}

.glow-1 {
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, rgba(255, 46, 147, 0.12) 0%, rgba(255, 182, 218, 0.04) 60%, rgba(255, 255, 255, 0) 80%);
  top: -60px;
  left: -80px;
}

.glow-2 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 82, 168, 0.1) 0%, rgba(255, 225, 240, 0.05) 50%, rgba(255, 255, 255, 0) 80%);
  top: 100px;
  right: -100px;
}

/* General Typography & Headers */
.section-title {
  font-size: clamp(2rem, 3.2vw, 2.75rem);
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.section-subtitle {
  font-size: 1.05rem;
  color: #64748b;
  max-width: 650px;
  margin: 10px auto 0;
  line-height: 1.6;
}

.section-badge-pink {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #ff2e93;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.cyber-tag {
  display: inline-block;
  background: #fdf2f8;
  color: #ff2e93;
  border: 1px solid rgba(255, 46, 147, 0.2);
  border-radius: 999px;
  padding: 4px 14px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.hero-highlight-gradient {
  background: linear-gradient(135deg, #ff2e93 0%, #ff52a8 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 900;
}

/* ==========================================================================
   HERO SECTION (Exact Mockup Match)
   ========================================================================== */
.hero-section {
  position: relative;
  padding: 45px 0 60px;
  overflow: hidden;
  background: linear-gradient(180deg, #fff7fb 0%, #ffffff 450px);
}

.hero-container {
  display: grid;
  grid-template-columns: 1.18fr 0.94fr;
  gap: 32px;
  align-items: center;
  gap: 40px;
  position: relative;
  z-index: 1;
}

.hero-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1px solid rgba(255, 46, 147, 0.22);
  border-radius: 999px;
  padding: 6px 16px;
  font-size: 0.76rem;
  font-weight: 800;
  color: #ff2e93;
  letter-spacing: 0.04em;
  box-shadow: 0 4px 16px rgba(255, 46, 147, 0.08);
  margin-bottom: 22px;
}

.badge-icon {
  font-size: 0.9rem;
}

.title-line {
  display: block;
  white-space: nowrap;
}

.hero-title {
  font-size: clamp(2.2rem, 3.3vw, 3.3rem);
  font-weight: 900;
  line-height: 1.15;
  color: #0f172a;
  letter-spacing: -0.03em;
  margin-bottom: 20px;
}

.hero-subtitle {
  font-size: 1.04rem;
  line-height: 1.62;
  color: #475569;
  max-width: 530px;
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.btn-hero-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #ff2e93 0%, #ff52a8 100%);
  color: #ffffff;
  border-radius: 999px;
  padding: 14px 28px;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 8px 25px rgba(255, 46, 147, 0.35);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.btn-hero-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(255, 46, 147, 0.48);
}

.btn-hero-primary .btn-arrow {
  transition: transform 0.2s ease;
}

.btn-hero-primary:hover .btn-arrow {
  transform: translateX(3px);
}

.btn-hero-secondary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  color: #0f172a;
  border: 1.5px solid rgba(255, 46, 147, 0.22);
  border-radius: 999px;
  padding: 13px 24px;
  font-size: 0.95rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
  transition: all 0.25s ease;
}

.btn-hero-secondary:hover {
  border-color: #ff2e93;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 46, 147, 0.15);
}

.btn-ghost-scroll {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #ff2e93;
  text-decoration: none;
  transition: opacity 0.2s;
}

.btn-ghost-scroll:hover {
  opacity: 0.8;
}

.scroll-arrow {
  font-size: 1rem;
}

/* Hero Right Banner */
.hero-right {
  display: flex;
  justify-content: center;
  position: relative;
}

.hero-banner-wrapper {
  position: relative;
  width: 100%;
  max-width: 580px;
  border-radius: 28px;
  background: radial-gradient(circle at center, rgba(255, 225, 240, 0.6) 0%, rgba(255, 255, 255, 0) 70%);
  padding: 10px;
  transition: transform 0.3s ease;
}

.hero-banner-img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 24px;
  box-shadow: 0 16px 45px rgba(255, 46, 147, 0.14), 0 4px 18px rgba(0, 0, 0, 0.04);
  object-fit: cover;
}

/* ==========================================================================
   STATS CARDS ROW (Exact 4 Cards from Mockup)
   ========================================================================== */
.hero-stats-container {
  margin-top: 50px;
  position: relative;
  z-index: 2;
}

.hero-stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stats-card {
  background: #ffffff;
  border: 1px solid rgba(255, 46, 147, 0.14);
  border-radius: 20px;
  padding: 20px 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 46, 147, 0.35);
  box-shadow: 0 10px 28px rgba(255, 46, 147, 0.1);
}

.stats-icon-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #fdf2f8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  flex-shrink: 0;
  border: 1px solid rgba(255, 46, 147, 0.15);
}

.stats-content {
  display: flex;
  flex-direction: column;
}

.stats-num {
  font-size: 1.5rem;
  font-weight: 900;
  color: #0f172a;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.stats-label {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
  margin-top: 3px;
}

/* ==========================================================================
   PROMO VIDEO SECTION
   ========================================================================== */
.section-promo {
  padding: 70px 0 50px;
  position: relative;
}

.promo-wrapper {
  background: #ffffff;
  border: 1px solid rgba(255, 46, 147, 0.16);
  border-radius: 30px;
  padding: 44px 30px;
  box-shadow: 0 12px 40px rgba(255, 46, 147, 0.07);
  text-align: center;
}

.promo-header {
  margin-bottom: 28px;
}

.promo-header h2 {
  font-size: clamp(1.8rem, 2.8vw, 2.4rem);
  font-weight: 900;
  color: #0f172a;
  margin-top: 8px;
}

.promo-screen-frame {
  position: relative;
  max-width: 920px;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  background: #090c15;
  container-type: inline-size;
}

.promo-screen-frame:fullscreen,
.promo-screen-frame.is-fullscreen,
.promo-screen-frame:-webkit-full-screen {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999999;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  margin: 0;
  max-width: none;
}

.promo-video-player {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 20px;
}

.promo-screen-frame:fullscreen .promo-video-player,
.promo-screen-frame.is-fullscreen .promo-video-player,
.promo-screen-frame:-webkit-full-screen .promo-video-player {
  width: 100%;
  height: 100%;
  max-width: 100vw;
  max-height: 100vh;
  object-fit: contain;
  border-radius: 0;
}

/* Video Brand Cover Overlay */
.promo-screen-frame .video-brand-cover {
  position: absolute;
  top: 0;
  right: 0;
  margin: 0;
  width: 28%;
  height: 18%;
  min-width: 195px;
  min-height: 58px;
  max-width: 340px;
  max-height: 95px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0 14px;
  background: #ffffff;
  border-radius: 0 0 0 18px;
  border-left: 1px solid rgba(226, 232, 240, 0.95);
  border-bottom: 1px solid rgba(226, 232, 240, 0.95);
  box-shadow: -4px 6px 20px rgba(15, 23, 42, 0.14);
  pointer-events: none;
  user-select: none;
  box-sizing: border-box;
}

.promo-screen-frame .brand-bubble-icon-cover {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  width: clamp(24px, 3.6cqw, 36px);
  height: clamp(24px, 3.6cqw, 36px);
}

.promo-screen-frame .brand-bubble-icon-cover .bubble-svg {
  width: 100%;
  height: 100%;
}

.promo-screen-frame .brand-text-cover {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  flex: 1;
  line-height: 1.15;
}

.promo-screen-frame .cover-brand-title {
  font-family: 'Onest', sans-serif;
  font-weight: 800;
  font-size: 14px;
  font-size: clamp(13px, 2.1cqw, 18px);
  color: #0f172a;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.promo-screen-frame .cover-brand-accent {
  color: #ff2e93;
}

.promo-screen-frame .cover-brand-sub {
  font-family: 'Onest', sans-serif;
  font-size: 9px;
  font-size: clamp(8px, 1.2cqw, 11px);
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
}

.promo-screen-frame .btn-cover-fullscreen {
  pointer-events: auto;
  cursor: pointer;
  flex-shrink: 0;
  background: rgba(241, 245, 249, 0.95);
  border: 1px solid rgba(203, 213, 225, 0.85);
  border-radius: 8px;
  color: #475569;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.promo-screen-frame .btn-cover-fullscreen:hover {
  background: #ff2e93;
  border-color: #ff2e93;
  color: #ffffff;
  transform: scale(1.08);
  box-shadow: 0 4px 12px rgba(255, 46, 147, 0.35);
}

.promo-screen-frame .btn-cover-fullscreen:active {
  transform: scale(0.96);
}

.promo-screen-frame .btn-cover-fullscreen svg {
  width: 15px;
  height: 15px;
}

.promo-screen-frame .btn-cover-fullscreen .icon-enter-fs {
  display: block;
}

.promo-screen-frame .btn-cover-fullscreen .icon-exit-fs {
  display: none;
}

/* Bigger, prominent logo in Fullscreen Mode */
.promo-screen-frame:fullscreen .video-brand-cover,
.promo-screen-frame.is-fullscreen .video-brand-cover,
.promo-screen-frame:-webkit-full-screen .video-brand-cover {
  top: 0;
  right: 0;
  margin: 0;
  width: 32%;
  min-width: 380px;
  max-width: 580px;
  height: 22%;
  min-height: 120px;
  max-height: 190px;
  padding: 0 32px;
  gap: 20px;
  border-radius: 0 0 0 32px;
  box-shadow: -12px 16px 50px rgba(0, 0, 0, 0.5);
}

.promo-screen-frame:fullscreen .brand-bubble-icon-cover,
.promo-screen-frame.is-fullscreen .brand-bubble-icon-cover,
.promo-screen-frame:-webkit-full-screen .brand-bubble-icon-cover {
  width: 56px;
  height: 56px;
  width: clamp(46px, 5.2cqw, 68px);
  height: clamp(46px, 5.2cqw, 68px);
}

.promo-screen-frame:fullscreen .cover-brand-title,
.promo-screen-frame.is-fullscreen .cover-brand-title,
.promo-screen-frame:-webkit-full-screen .cover-brand-title {
  font-size: 28px;
  font-size: clamp(22px, 3.2cqw, 38px);
  letter-spacing: -0.03em;
}

.promo-screen-frame:fullscreen .cover-brand-sub,
.promo-screen-frame.is-fullscreen .cover-brand-sub,
.promo-screen-frame:-webkit-full-screen .cover-brand-sub {
  font-size: 14px;
  font-size: clamp(12px, 1.6cqw, 20px);
  letter-spacing: 0.08em;
}

.promo-screen-frame:fullscreen .btn-cover-fullscreen,
.promo-screen-frame.is-fullscreen .btn-cover-fullscreen,
.promo-screen-frame:-webkit-full-screen .btn-cover-fullscreen {
  padding: 10px;
  border-radius: 10px;
}

.promo-screen-frame:fullscreen .btn-cover-fullscreen svg,
.promo-screen-frame.is-fullscreen .btn-cover-fullscreen svg,
.promo-screen-frame:-webkit-full-screen .btn-cover-fullscreen svg {
  width: 22px;
  height: 22px;
}

.promo-screen-frame:fullscreen .btn-cover-fullscreen .icon-enter-fs,
.promo-screen-frame.is-fullscreen .btn-cover-fullscreen .icon-enter-fs,
.promo-screen-frame:-webkit-full-screen .btn-cover-fullscreen .icon-enter-fs {
  display: none !important;
}

.promo-screen-frame:fullscreen .btn-cover-fullscreen .icon-exit-fs,
.promo-screen-frame.is-fullscreen .btn-cover-fullscreen .icon-exit-fs,
.promo-screen-frame:-webkit-full-screen .btn-cover-fullscreen .icon-exit-fs {
  display: block !important;
}

@media (max-width: 640px) {
  .promo-screen-frame .video-brand-cover {
    top: 0;
    right: 0;
    margin: 0;
    padding: 0 10px;
    gap: 8px;
    width: auto;
    min-width: 170px;
    height: 44px;
    min-height: 44px;
    border-radius: 0 0 0 12px;
  }
  .promo-screen-frame .cover-brand-title {
    font-size: 11px;
  }
  .promo-screen-frame .cover-brand-sub {
    font-size: 7px;
  }
  .promo-screen-frame .brand-bubble-icon-cover {
    width: 20px;
    height: 20px;
  }
  .promo-screen-frame .btn-cover-fullscreen {
    display: flex;
    padding: 4px;
  }
  .promo-screen-frame .btn-cover-fullscreen svg {
    width: 13px;
    height: 13px;
  }
}

/* ==========================================================================
   WHY US SECTION ("Неліктен біз?")
   ========================================================================== */
.section-why-us {
  padding: 70px 0 80px;
}

.why-us-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 36px;
  flex-wrap: wrap;
  gap: 16px;
}

.link-all-features {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
  font-weight: 700;
  color: #ff2e93;
  text-decoration: none;
  transition: transform 0.2s;
}

.link-all-features:hover {
  transform: translateX(3px);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 22px;
}

.feature-luxury-card {
  background: #ffffff;
  border: 1px solid rgba(255, 46, 147, 0.14);
  border-radius: 22px;
  padding: 26px 22px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.feature-luxury-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 46, 147, 0.35);
  box-shadow: 0 12px 30px rgba(255, 46, 147, 0.12);
}

.feature-icon-circle {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #fdf2f8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  border: 1px solid rgba(255, 46, 147, 0.15);
}

.feature-content h3 {
  font-size: 1.12rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 8px;
}

.feature-content p {
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.55;
}

/* ==========================================================================
   ROADMAP TIMELINE SECTION (6 Steps)
   ========================================================================== */
.section-system {
  padding: 70px 0 80px;
  background: linear-gradient(180deg, #ffffff 0%, #fffbfd 100%);
}

.section-heading {
  margin-bottom: 45px;
}

.system-timeline {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.timeline-step-item {
  background: #ffffff;
  border: 1px solid rgba(255, 46, 147, 0.14);
  border-radius: 22px;
  padding: 30px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.timeline-step-item:hover {
  transform: translateY(-4px);
  border-color: #ff2e93;
  box-shadow: 0 12px 30px rgba(255, 46, 147, 0.12);
}

.timeline-step-item.highlight-step {
  border: 1.5px solid #ff2e93;
  background: linear-gradient(180deg, #fffafd 0%, #ffffff 100%);
}

.step-badge {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff2e93 0%, #ff52a8 100%);
  color: #ffffff;
  font-weight: 900;
  font-size: 1.15rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  box-shadow: 0 4px 16px rgba(255, 46, 147, 0.3);
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 12px;
}

.step-header h4 {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0f172a;
}

.step-time {
  font-size: 0.78rem;
  font-weight: 700;
  color: #ff2e93;
  background: #fdf2f8;
  padding: 3px 9px;
  border-radius: 6px;
  white-space: nowrap;
}

.step-card p {
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.58;
}

/* ==========================================================================
   LIVE EXPRESS CALCULATOR WIDGET
   ========================================================================== */
.section-calc-preview {
  padding: 70px 0 80px;
}

.calc-preview-card {
  background: linear-gradient(135deg, #ffffff 0%, #fffcfd 100%);
  border: 1.5px solid rgba(255, 46, 147, 0.22);
  border-radius: 30px;
  padding: 44px;
  box-shadow: 0 16px 45px rgba(255, 46, 147, 0.08);
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 40px;
  align-items: center;
}

.calc-title {
  font-size: clamp(1.8rem, 2.6vw, 2.3rem);
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 12px;
}

.calc-subtitle {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.55;
  margin-bottom: 24px;
}

.calc-type-switch {
  display: inline-flex;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 4px;
  margin-bottom: 24px;
}

.calc-type-switch button {
  padding: 8px 20px;
  font-size: 0.9rem;
  font-weight: 700;
  border-radius: 999px;
  background: transparent;
  color: #64748b;
  border: none;
  transition: all 0.2s ease;
}

.calc-type-switch button.active {
  background: linear-gradient(135deg, #ff2e93, #ff52a8);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(255, 46, 147, 0.35);
}

.calc-slider-block {
  margin-bottom: 24px;
}

.calc-slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 10px;
}

.calc-score-val {
  color: #ff2e93;
  font-size: 1.25rem;
  font-weight: 900;
}

.cyber-range-input {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background: #f1f5f9;
  outline: none;
  accent-color: #ff2e93;
}

/* Gauge Circle */
.calc-preview-gauge {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.gauge-circle-outer {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: conic-gradient(#ff2e93 0%, #ff52a8 calc(v-bind('calcPercent') * 1%), #f1f5f9 calc(v-bind('calcPercent') * 1%) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(255, 46, 147, 0.2);
  margin-bottom: 22px;
  transition: all 0.4s ease;
}

.gauge-circle-inner {
  width: 184px;
  height: 184px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.04);
}

.gauge-percent {
  font-size: 2.8rem;
  font-weight: 900;
  color: #0f172a;
  line-height: 1;
}

.gauge-caption {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: #ff2e93;
  margin-top: 6px;
}

.gauge-status-badge {
  font-size: 0.72rem;
  font-weight: 700;
  border-radius: 999px;
  padding: 3px 10px;
  margin-top: 8px;
}

.status-high {
  background: #f0fdf4;
  color: #16a34a;
}

.status-mid {
  background: #fffbeb;
  color: #d97706;
}

.status-low {
  background: #fef2f2;
  color: #dc2626;
}

.gauge-school-targets {
  width: 100%;
}

.target-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 8px;
}

.target-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.target-tag {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #0f172a;
}

/* ==========================================================================
   RESULTS & STUDENT SUCCESS SECTION
   ========================================================================== */
.section-results {
  padding: 70px 0 80px;
  background: #ffffff;
}

.results-toggle-wrapper {
  display: inline-flex;
  gap: 12px;
  margin-top: 24px;
}

.result-tab-btn {
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 999px;
  padding: 10px 24px;
  font-size: 0.92rem;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.result-tab-btn.active {
  background: linear-gradient(135deg, #ff2e93, #ff52a8);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 4px 18px rgba(255, 46, 147, 0.32);
}

.results-summary-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  align-items: center;
  margin: 28px 0 36px;
}

.summary-pill {
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
}

.summary-pill.gold {
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #b45309;
}

.summary-pill.bronze {
  background: #fff7ed;
  border: 1px solid #fed7aa;
  color: #c2410c;
}

.summary-pill.purple {
  background: #faf5ff;
  border: 1px solid #e9d5ff;
  color: #7e22ce;
}

.summary-pill.pink {
  background: #fdf2f8;
  border: 1px solid #fbcfe8;
  color: #db2777;
}

.summary-pill.green {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
}

.btn-poster-link {
  background: #ffffff;
  border: 1.5px solid #ff2e93;
  color: #ff2e93;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-poster-link:hover {
  background: #fdf2f8;
}

/* Results Grid */
.results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.student-result-card {
  background: #ffffff;
  border: 1px solid rgba(255, 46, 147, 0.15);
  border-radius: 20px;
  padding: 22px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.student-result-card:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 46, 147, 0.4);
  box-shadow: 0 10px 28px rgba(255, 46, 147, 0.1);
}

.student-result-card.gold-card {
  border: 1.5px solid #f59e0b;
  background: linear-gradient(180deg, #fffdf8 0%, #ffffff 100%);
}

.student-result-card.bronze-card {
  border: 1.5px solid #f97316;
  background: linear-gradient(180deg, #fffaf5 0%, #ffffff 100%);
}

.student-result-card.top-card {
  border: 1.5px solid rgba(255, 46, 147, 0.35);
}

.student-result-card.bil-card {
  border-color: rgba(255, 46, 147, 0.18);
}

.card-top {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;
}

.avatar-ring {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.95rem;
  flex-shrink: 0;
  background: #f8fafc;
  color: #0f172a;
  border: 2px solid #e2e8f0;
}

.avatar-ring.gold-ring {
  background: #fef3c7;
  color: #b45309;
  border-color: #f59e0b;
}

.avatar-ring.bronze-ring {
  background: #ffedd5;
  color: #c2410c;
  border-color: #f97316;
}

.avatar-ring.pink-ring {
  background: #fdf2f8;
  color: #ff2e93;
  border-color: #ff2e93;
}

.student-meta {
  flex: 1;
}

.student-meta h4 {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.25;
}

.school-target {
  font-size: 0.78rem;
  color: #64748b;
  margin-top: 2px;
  display: block;
}

.rank-badge {
  font-size: 0.8rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 999px;
  background: #f8fafc;
  color: #475569;
}

.rank-badge.gold {
  background: #fef3c7;
  color: #b45309;
}

.rank-badge.bronze {
  background: #ffedd5;
  color: #c2410c;
}

.rank-badge.top {
  background: #fdf2f8;
  color: #ff2e93;
}

.card-score-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 14px;
}

.score-label {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
}

.score-badge {
  color: #ff2e93;
  font-size: 1.15rem;
  font-weight: 900;
}

.score-badge.large-score {
  font-size: 1.25rem;
}

.progression-box {
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 14px;
}

.progression-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.78rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.growth-tag {
  color: #16a34a;
}

.progression-bar-bg {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progression-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff2e93, #ff52a8);
  border-radius: 999px;
}

.result-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
}

.grant-pill {
  font-size: 0.74rem;
  font-weight: 800;
  color: #16a34a;
  background: #f0fdf4;
  padding: 3px 10px;
  border-radius: 999px;
}

.verified-pill {
  font-size: 0.74rem;
  color: #94a3b8;
  font-weight: 600;
}

/* Cyber Outline Button */
.btn-cyber-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  background: #ffffff;
  color: #ff2e93;
  border: 1.5px solid #ff2e93;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 14px rgba(255, 46, 147, 0.1);
}

.btn-cyber-outline:hover {
  background: #fdf2f8;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 46, 147, 0.2);
}

/* Modal */
.poster-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.poster-modal-card {
  background: #ffffff;
  border-radius: 24px;
  max-width: 750px;
  width: 100%;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
}

.poster-modal-header {
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
}

.poster-modal-header h3 {
  font-size: 1.15rem;
  font-weight: 800;
  color: #0f172a;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #64748b;
  cursor: pointer;
}

.poster-modal-body {
  padding: 16px;
  max-height: 80vh;
  overflow-y: auto;
}

.poster-img {
  width: 100%;
  height: auto;
  border-radius: 12px;
}

/* ==========================================================================
   TARIFFS SECTION
   ========================================================================== */
.section-tariffs {
  padding: 70px 0 80px;
  background: linear-gradient(180deg, #ffffff 0%, #fffbfd 100%);
}

.tariffs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 26px;
  align-items: stretch;
}

.tariff-cyber-card {
  background: #ffffff;
  border: 1px solid rgba(255, 46, 147, 0.16);
  border-radius: 26px;
  padding: 38px 30px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.tariff-cyber-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 46, 147, 0.4);
  box-shadow: 0 15px 35px rgba(255, 46, 147, 0.12);
}

.tariff-cyber-card.featured-tariff {
  border: 2px solid #ff2e93;
  box-shadow: 0 16px 45px rgba(255, 46, 147, 0.18);
  transform: translateY(-6px);
}

.tariff-cyber-card.featured-tariff:hover {
  transform: translateY(-10px);
}

.popular-ribbon {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #ff2e93, #ff52a8);
  color: #ffffff;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 5px 18px;
  border-radius: 999px;
  box-shadow: 0 4px 15px rgba(255, 46, 147, 0.4);
}

.tariff-name {
  font-size: 1.6rem;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 6px;
}

.tariff-for {
  font-size: 0.88rem;
  color: #64748b;
  margin-bottom: 24px;
}

.tariff-features {
  list-style: none;
  padding: 0;
  margin: 0 0 32px 0;
  flex: 1;
}

.tariff-features li {
  font-size: 0.92rem;
  color: #334155;
  margin-bottom: 14px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  line-height: 1.45;
}

.check-icon {
  color: #ff2e93;
  font-weight: 900;
  flex-shrink: 0;
}

.btn-featured {
  background: linear-gradient(135deg, #ff2e93 0%, #ff52a8 100%) !important;
  box-shadow: 0 8px 25px rgba(255, 46, 147, 0.4) !important;
}

/* ==========================================================================
   FAQ SECTION
   ========================================================================== */
.section-faq {
  padding: 70px 0 80px;
  background: #ffffff;
}

.faq-accordion-list {
  max-width: 860px;
  margin: 0 auto;
}

.faq-accordion-item {
  background: #ffffff;
  border: 1px solid rgba(255, 46, 147, 0.14);
  border-radius: 18px;
  margin-bottom: 14px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
  transition: all 0.25s ease;
  cursor: pointer;
}

.faq-accordion-item:hover {
  border-color: rgba(255, 46, 147, 0.35);
}

.faq-accordion-item.open {
  border-color: #ff2e93;
  box-shadow: 0 8px 24px rgba(255, 46, 147, 0.1);
}

.faq-question {
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.faq-q-text {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
}

.faq-toggle-icon {
  font-size: 1.3rem;
  font-weight: 700;
  color: #ff2e93;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #fdf2f8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.faq-answer {
  padding: 0 24px 22px;
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.62;
  border-top: 1px solid #f8fafc;
  padding-top: 16px;
}

/* ==========================================================================
   FINAL CTA BANNER SECTION
   ========================================================================== */
.section-cta-banner {
  padding: 60px 0 80px;
}

.cta-banner-card {
  background: linear-gradient(135deg, #ff2e93 0%, #ff52a8 50%, #f43f5e 100%);
  border-radius: 32px;
  padding: 65px 40px;
  text-align: center;
  color: #ffffff;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(255, 46, 147, 0.32);
}

.cta-banner-card .cyber-tag {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.35);
}

.cta-banner-title {
  font-size: clamp(2rem, 3.4vw, 3rem);
  font-weight: 900;
  color: #ffffff;
  margin: 16px 0;
  line-height: 1.2;
}

.cta-banner-sub {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.92);
  max-width: 620px;
  margin: 0 auto 34px;
  line-height: 1.6;
}

.cta-banner-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-cta-primary {
  background: #ffffff;
  color: #ff2e93;
  font-weight: 800;
  border-radius: 999px;
  padding: 15px 34px;
  font-size: 1rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  text-decoration: none;
  transition: all 0.25s ease;
}

.btn-cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.22);
}

.btn-cta-wa {
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  border-radius: 999px;
  padding: 14px 30px;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  backdrop-filter: blur(8px);
  transition: all 0.25s ease;
}

.btn-cta-wa:hover {
  background: rgba(255, 255, 255, 0.28);
  transform: translateY(-2px);
}

/* ==========================================================================
   FOOTER
   ========================================================================== */
.footer-futuristic {
  background: #fff6f9;
  border-top: 1px solid rgba(255, 46, 147, 0.14);
  padding: 60px 0 0;
  color: #475569;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 50px;
}

.footer-logo {
  font-size: 1.6rem;
  font-weight: 900;
  margin-bottom: 12px;
}

.logo-white {
  color: #0f172a;
}

.logo-pink {
  color: #ff2e93;
}

.footer-tagline {
  font-size: 0.92rem;
  line-height: 1.6;
  color: #64748b;
  margin-bottom: 20px;
}

.social-links {
  display: flex;
  gap: 10px;
}

.social-icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid rgba(255, 46, 147, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff2e93;
  font-weight: 800;
  font-size: 0.85rem;
  text-decoration: none;
  transition: all 0.2s ease;
}

.social-icon-btn:hover {
  background: #ff2e93;
  color: #ffffff;
  transform: translateY(-2px);
}

.footer-col h4 {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 18px;
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-col li {
  margin-bottom: 10px;
}

.footer-col a {
  color: #64748b;
  text-decoration: none;
  font-size: 0.92rem;
  transition: color 0.2s;
}

.footer-col a:hover {
  color: #ff2e93;
}

.footer-support-hours {
  font-size: 0.88rem;
  color: #94a3b8;
}

.footer-bottom-bar {
  border-top: 1px solid rgba(255, 46, 147, 0.1);
  padding: 22px 0;
  font-size: 0.88rem;
}

.btn-back-to-top {
  background: #ffffff;
  border: 1px solid rgba(255, 46, 147, 0.22);
  border-radius: 999px;
  padding: 6px 16px;
  color: #ff2e93;
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-back-to-top:hover {
  background: #fdf2f8;
}

/* ==========================================================================
   RESPONSIVE BREAKPOINTS
   ========================================================================== */
@media (max-width: 1080px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 36px;
  }
  .hero-left {
    align-items: center;
  }
  .hero-subtitle {
    margin-left: auto;
    margin-right: auto;
  }
  .hero-actions {
    justify-content: center;
  }
  .hero-stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .system-timeline,
  .results-grid,
  .tariffs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .calc-preview-card {
    grid-template-columns: 1fr;
    padding: 32px 24px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 30px 0 50px;
  }
  .hero-title {
    font-size: 2.1rem;
    line-height: 1.2;
  }
  .hero-subtitle {
    font-size: 0.95rem;
  }
  .hero-actions {
    flex-direction: column;
    width: 100%;
  }
  .hero-actions a {
    width: 100%;
    justify-content: center;
  }
  .hero-stats-row {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .stats-card {
    padding: 14px 12px;
    gap: 10px;
    border-radius: 16px;
  }
  .stats-icon-circle {
    width: 38px;
    height: 38px;
    font-size: 1.1rem;
  }
  .stats-num {
    font-size: 1.25rem;
  }
  .stats-label {
    font-size: 0.74rem;
  }
  .features-grid,
  .system-timeline,
  .results-grid,
  .tariffs-grid {
    grid-template-columns: 1fr;
  }
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  .bottom-flex {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  .gauge-circle-outer {
    width: 180px;
    height: 180px;
  }
  .gauge-circle-inner {
    width: 150px;
    height: 150px;
  }
  .gauge-percent {
    font-size: 2.3rem;
  }
  .promo-wrapper {
    padding: 24px 14px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.8rem;
  }
  .hero-stats-row {
    grid-template-columns: 1fr;
  }
  .calc-type-switch {
    width: 100%;
    display: flex;
  }
  .calc-type-switch button {
    flex: 1;
    padding: 8px 10px;
    font-size: 0.82rem;
  }
  .cta-banner-buttons {
    flex-direction: column;
    width: 100%;
  }
  .btn-cta-primary,
  .btn-cta-wa {
    width: 100%;
    text-align: center;
    justify-content: center;
  }
}
</style>
