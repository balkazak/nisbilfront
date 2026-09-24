<template>
  <div class="landing-page-futuristic">
    <!-- Header -->
    <MainHeader />

    <!-- HERO SECTION -->
    <section class="hero-section">
      <!-- Ambient Cyber Glows -->
      <div class="ambient-nebula nebula-1"></div>
      <div class="ambient-nebula nebula-2"></div>
      <div class="cyber-grid-overlay"></div>

      <div class="container hero-container">
        <!-- Left Content -->
        <div class="hero-left">
          <!-- Live Badge -->
          <div class="hero-badge animate-float">
            <span class="badge-dot"></span>
            <span class="badge-text">{{ t("landing.badge") }}</span>
          </div>

          <!-- Main Title -->
          <h1 class="hero-title">
            {{ currentLang === 'kk' ? 'НЗМ мен БИЛ-ге' : 'Поступи в НИШ и БИЛ' }}
            <span class="hero-highlight-gradient">
              {{ currentLang === 'kk' ? 'ГРАНТҚА түс' : 'на ГРАНТ' }}
            </span>
            {{ currentLang === 'kk' ? 'бірінші талпыныстан' : 'с первой попытки' }}
          </h1>

          <!-- Subtitle -->
          <p class="hero-subtitle">
            {{ t("landing.heroSub") }}
          </p>

          <!-- Action Buttons -->
          <div class="hero-actions">
            <router-link to="/trial-test" class="btn-cyber btn-hero-primary">
              <span class="btn-icon">⚡</span>
              <span>{{ t("landing.trialBtn") }}</span>
              <span class="btn-arrow">➔</span>
            </router-link>

            <router-link to="/calculator" class="btn-cyber-outline">
              <span class="btn-icon">🎯</span>
              <span>{{ t("landing.calcBtn") }}</span>
            </router-link>

            <a href="#system" class="btn-ghost-scroll">
              <span>{{ t("landing.systemBtn") }}</span>
              <span class="scroll-arrow">↓</span>
            </a>
          </div>

          <!-- Stats HUD -->
          <div class="hero-stats-hud">
            <div class="hud-stat-item">
              <div class="hud-stat-value">98.4%</div>
              <div class="hud-stat-label">{{ t("landing.stats.grantLabel") }}</div>
            </div>
            <div class="hud-stat-divider"></div>
            <div class="hud-stat-item">
              <div class="hud-stat-value">15 000+</div>
              <div class="hud-stat-label">{{ t("landing.stats.tasksLabel") }}</div>
            </div>
            <div class="hud-stat-divider"></div>
            <div class="hud-stat-item">
              <div class="hud-stat-value">22+ {{ currentLang === 'kk' ? 'жыл' : 'года' }}</div>
              <div class="hud-stat-label">{{ t("landing.stats.yearsLabel") }}</div>
            </div>
            <div class="hud-stat-divider"></div>
            <div class="hud-stat-item">
              <div class="hud-stat-value">24/7</div>
              <div class="hud-stat-label">{{ t("landing.stats.curatorLabel") }}</div>
            </div>
          </div>
        </div>

        <!-- Right Content: 3D Hologram Frame & Live Card -->
        <div class="hero-right">
          <div class="hero-hologram-wrapper">
            <div class="hologram-ring-orbit"></div>
            <div class="hologram-card">
              <img
                src="/hero_cyber_hologram.jpg"
                alt="NIS-BIL Futuristic Academy"
                class="hero-hologram-img"
              />
              <div class="hologram-scanline"></div>
              
              <!-- Floating HUD Badge Top -->
              <div class="floating-hud-pill hud-pill-top">
                <span class="pill-dot green"></span>
                <span>{{ currentLang === 'kk' ? 'База NIS & BIL 2025/2026' : 'База NIS & BIL 2025/2026' }}</span>
              </div>

              <!-- Floating HUD Badge Bottom -->
              <div class="floating-hud-pill hud-pill-bottom">
                <div class="pill-metric">99.2%</div>
                <div class="pill-desc">
                  <div class="pill-desc-title">{{ currentLang === 'kk' ? 'Грант ықтималдығы' : 'Шанс на грант' }}</div>
                  <div class="pill-desc-sub">{{ currentLang === 'kk' ? 'Жоғары көрсеткіш' : 'Высокий уровень' }}</div>
                </div>
              </div>

              <!-- Student Live Badge -->
              <div class="floating-student-badge">
                <div class="student-avatar">А</div>
                <div class="student-info">
                  <div class="student-name">Алихан С.</div>
                  <div class="student-score">138 / 140 • НИШ ФМН</div>
                </div>
              </div>
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
          <div class="promo-screen-frame">
            <video autoplay loop muted playsinline controls class="promo-video-player">
              <source src="/promo.webm" type="video/webm" />
            </video>
            <div class="screen-frame-glow"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- WHY US SECTION -->
    <section id="why-us" class="section-why-us">
      <div class="container">
        <div class="section-heading text-center">
          <div class="cyber-tag">{{ t("landing.whyUsTag") }}</div>
          <h2 class="section-title">{{ t("landing.whyUs") }}</h2>
          <p class="section-subtitle">{{ t("landing.whyUsSub") }}</p>
        </div>

        <div class="features-grid">
          <!-- Card 1 -->
          <div class="feature-cyber-card">
            <div class="card-icon-halo">🏆</div>
            <h3>{{ currentLang === 'kk' ? '22+ жыл академиялық тәжірибе' : '22+ года академической экспертизы' }}</h3>
            <p>
              {{ currentLang === 'kk'
                ? 'Қазақстанның үздік олимпиадалық мұғалімдерінің авторлық әдістемесі. Біздің оқушылар жыл сайын грант рейтингінің басында.'
                : 'Авторская методика сильнейших преподавателей РК. Наши ученики ежегодно возглавляют рейтинги грантов НИШ и БИЛ.'
              }}
            </p>
            <div class="card-corner-accent"></div>
          </div>

          <!-- Card 2 -->
          <div class="feature-cyber-card highlight-card">
            <div class="card-icon-halo">🎯</div>
            <h3>{{ currentLang === 'kk' ? '100% ресми стандарттар' : '100% стандарты NIS & BIL 2025' }}</h3>
            <p>
              {{ currentLang === 'kk'
                ? 'Барлық есептер мен тесттер ресми емтихан форматына толық сәйкес келеді. Ешқандай артық су жоқ, тек нәтиже беретін есептер.'
                : 'Все тестовые задания и спецификации обновлены по актуальным правилам вступительных экзаменов без лишней воды.'
              }}
            </p>
            <div class="card-corner-accent"></div>
          </div>

          <!-- Card 3 -->
          <div class="feature-cyber-card">
            <div class="card-icon-halo">💡</div>
            <h3>{{ currentLang === 'kk' ? 'Қателерді жылдам талдау' : 'Мгновенный разбор каждой ошибки' }}</h3>
            <p>
              {{ currentLang === 'kk'
                ? 'Тесттен кейін оқушы қателескен сұрақтың дұрыс жауабын және бейне/мәтіндік шешу жолын көріп, кемшілігін бірден түзейді.'
                : 'После каждого теста ученик видит не только правильный ответ, но и пошаговый алгоритм решения, исключая повторные промахи.'
              }}
            </p>
            <div class="card-corner-accent"></div>
          </div>

          <!-- Card 4 -->
          <div class="feature-cyber-card">
            <div class="card-icon-halo">🚀</div>
            <h3>{{ currentLang === 'kk' ? 'Ақылды прогресс трекері' : 'Умная память и трекер прогресса' }}</h3>
            <p>
              {{ currentLang === 'kk'
                ? 'Жүйе оқушының қай сабақта тоқтағанын есте сақтап, тақырыпты аяқтау деңгейін және грантқа дайындық графигін көрсетеді.'
                : 'Платформа автоматически сохраняет точку остановки, ведет прогресс-бар курса и рассчитывает точную динамику готовности.'
              }}
            </p>
            <div class="card-corner-accent"></div>
          </div>

          <!-- Card 5 -->
          <div class="feature-cyber-card highlight-card">
            <div class="card-icon-halo">👥</div>
            <h3>{{ currentLang === 'kk' ? 'Жеке куратор және топтар' : 'Личный куратор и онлайн-группы' }}</h3>
            <p>
              {{ currentLang === 'kk'
                ? 'Әрбір оқушыға жеке наставник бекітіледі. Ол үй тапсырмасын тексереді, сұрақтарға жауап береді және ата-анамен байланыста болады.'
                : 'Индивидуальный наставник контролирует выполнение домашних заданий, мотивирует ученика и держит регулярную связь с родителями.'
              }}
            </p>
            <div class="card-corner-accent"></div>
          </div>

          <!-- Card 6 -->
          <div class="feature-cyber-card">
            <div class="card-icon-halo">🌐</div>
            <h3>{{ currentLang === 'kk' ? 'Екі тілде толық оқу' : 'Обучение на двух языках (KZ / RU)' }}</h3>
            <p>
              {{ currentLang === 'kk'
                ? 'Барлық видеосабақтар, терминдер мен тестілеу қазақ және орыс тілдерінде толыққанды дайындалған.'
                : 'Полная синхронная база курсов, терминологических словарей и тестов на чистом казахском и русском языках.'
              }}
            </p>
            <div class="card-corner-accent"></div>
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

    <!-- RESULTS & STUDENT REVIEWS SECTION -->
    <section id="results" class="section-results">
      <div class="container">
        <div class="section-heading text-center">
          <div class="cyber-tag">{{ t("landing.resultsTag") }}</div>
          <h2 class="section-title">{{ t("landing.resultsTitle") }}</h2>
          <p class="section-subtitle">{{ t("landing.resultsSub") }}</p>
        </div>

        <div class="results-grid">
          <!-- Student 1 -->
          <div class="student-result-card">
            <div class="card-top">
              <div class="avatar-ring">АМ</div>
              <div class="student-meta">
                <h4>Айзере Мұрат</h4>
                <span class="school-target">НИШ ФМН Алматы</span>
              </div>
              <div class="score-badge">138 / 140</div>
            </div>
            <p class="student-quote">
              "Платформадағы видеоталдаулар мен куратордың көмегі арқасында логика мен математикадан 100% нәтиже көрсеттім. Грант ұтып алдым!"
            </p>
            <div class="result-footer">
              <span class="grant-pill">✓ ГРАНТ 2024</span>
              <span class="verified-pill">Расталған нәтиже</span>
            </div>
          </div>

          <!-- Student 2 -->
          <div class="student-result-card highlight-card">
            <div class="card-top">
              <div class="avatar-ring pink-ring">ДК</div>
              <div class="student-meta">
                <h4>Данияр Кенесов</h4>
                <span class="school-target">БИЛ Астана</span>
              </div>
              <div class="score-badge">1240 балл</div>
            </div>
            <p class="student-quote">
              "Олимпиадная математика БИЛ казалась нереальной, пока не начал решать банк из 15 000 задач на платформе. За 5 месяцев поднял результат с 65 до 98 баллов!"
            </p>
            <div class="result-footer">
              <span class="grant-pill">✓ ГРАНТ 2024</span>
              <span class="verified-pill">Топ-3 рейтинг</span>
            </div>
          </div>

          <!-- Student 3 -->
          <div class="student-result-card">
            <div class="card-top">
              <div class="avatar-ring">АС</div>
              <div class="student-meta">
                <h4>Амина Сейдахмет</h4>
                <span class="school-target">НИШ ХБН Шымкент</span>
              </div>
              <div class="score-badge">136 / 140</div>
            </div>
            <p class="student-quote">
              "Ең ұнағаны — қатемен жұмыс істеу жүйесі. Қай есептен қателескенім бірден көрініп тұрады, ал мұғалімдердің түсіндіруі өте түсінікті."
            </p>
            <div class="result-footer">
              <span class="grant-pill">✓ ГРАНТ 2024</span>
              <span class="verified-pill">Расталған нәтиже</span>
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
import { ref, computed } from "vue";
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
</script>

<style scoped>
.landing-page-futuristic {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: #070a14;
  color: #f1f5f9;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* Ambient Cyber Glow Elements */
.ambient-nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  pointer-events: none;
  z-index: 0;
}

.nebula-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255, 46, 147, 0.22) 0%, rgba(255, 46, 147, 0) 70%);
  top: -100px;
  left: -100px;
}

.nebula-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, rgba(147, 51, 234, 0) 70%);
  top: 250px;
  right: -100px;
}

.cyber-grid-overlay {
  position: absolute;
  inset: 0;
  height: 1000px;
  background-image: 
    linear-gradient(rgba(255, 46, 147, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 46, 147, 0.035) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(circle at 50% 30%, black 30%, transparent 80%);
  -webkit-mask-image: radial-gradient(circle at 50% 30%, black 30%, transparent 80%);
  pointer-events: none;
}

/* HERO SECTION */
.hero-section {
  position: relative;
  padding: 70px 0 90px;
  z-index: 1;
}

.hero-container {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  align-items: center;
  gap: 50px;
}

.hero-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* Live Badge */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 46, 147, 0.12);
  border: 1px solid rgba(255, 46, 147, 0.35);
  padding: 6px 16px;
  border-radius: 30px;
  margin-bottom: 24px;
  box-shadow: 0 0 15px rgba(255, 46, 147, 0.2);
}

.badge-dot {
  width: 8px;
  height: 8px;
  background-color: #ff2e93;
  border-radius: 50%;
  box-shadow: 0 0 10px #ff2e93;
  animation: pulse-dot 1.5s infinite;
}

.badge-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #ff5ca8;
}

/* Hero Title */
.hero-title {
  font-family: 'Outfit', sans-serif;
  font-size: 3.4rem;
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 22px;
  letter-spacing: -0.02em;
  color: #ffffff;
}

.hero-highlight-gradient {
  background: var(--gradient-color);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 20px rgba(230, 45, 149, 0.4));
  display: inline;
}

.hero-subtitle {
  font-size: 1.15rem;
  line-height: 1.65;
  color: #cbd5e1;
  max-width: 580px;
  margin-bottom: 36px;
}

/* Hero Actions */
.hero-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 48px;
}

.btn-hero-primary {
  padding: 16px 36px;
  font-size: 1.05rem;
}

.btn-hero-primary .btn-arrow {
  transition: transform 0.25s ease;
}

.btn-hero-primary:hover .btn-arrow {
  transform: translateX(4px);
}

.btn-cyber-outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: rgba(255, 255, 255, 0.05);
  border: 1.5px solid rgba(255, 46, 147, 0.4);
  color: #ffffff;
  font-weight: 700;
  font-size: 0.98rem;
  border-radius: 50px;
  text-decoration: none;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.btn-cyber-outline:hover {
  background: rgba(255, 46, 147, 0.15);
  border-color: #ff2e93;
  box-shadow: 0 0 25px rgba(255, 46, 147, 0.35);
  transform: translateY(-2px);
}

.btn-ghost-scroll {
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  transition: color 0.25s ease;
}

.btn-ghost-scroll:hover {
  color: #ff2e93;
}

.scroll-arrow {
  animation: bounce-down 1.6s infinite ease-in-out;
}

/* Stats HUD */
.hero-stats-hud {
  display: flex;
  align-items: center;
  background: rgba(18, 24, 43, 0.7);
  border: 1px solid rgba(255, 46, 147, 0.2);
  border-radius: 18px;
  padding: 16px 28px;
  gap: 24px;
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.hud-stat-item {
  display: flex;
  flex-direction: column;
}

.hud-stat-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.45rem;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 0 12px rgba(255, 46, 147, 0.5);
}

.hud-stat-label {
  font-size: 0.76rem;
  color: #94a3b8;
  font-weight: 600;
  margin-top: 2px;
}

.hud-stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
}

/* HERO RIGHT: 3D Hologram Frame */
.hero-right {
  display: flex;
  justify-content: center;
  position: relative;
}

.hero-hologram-wrapper {
  position: relative;
  width: 100%;
  max-width: 440px;
}

.hologram-ring-orbit {
  position: absolute;
  inset: -15px;
  border-radius: 30px;
  border: 1.5px dashed rgba(255, 46, 147, 0.4);
  pointer-events: none;
  animation: rotate-slow 24s linear infinite;
}

.hologram-card {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  border: 2px solid rgba(255, 46, 147, 0.35);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(255, 46, 147, 0.25);
  background: #0f1426;
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-hologram-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.hologram-card:hover .hero-hologram-img {
  transform: scale(1.04);
}

.hologram-scanline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, transparent, rgba(255, 46, 147, 0.8), transparent);
  box-shadow: 0 0 15px #ff2e93;
  animation: scan-vertical 4s linear infinite;
  pointer-events: none;
}

/* Floating HUD Pills */
.floating-hud-pill {
  position: absolute;
  background: rgba(13, 18, 33, 0.88);
  border: 1px solid rgba(255, 46, 147, 0.35);
  backdrop-filter: blur(16px);
  padding: 8px 16px;
  border-radius: 30px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 5;
}

.hud-pill-top {
  top: 18px;
  right: 18px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  color: #f1f5f9;
}

.pill-dot.green {
  width: 8px;
  height: 8px;
  background-color: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 10px #22c55e;
}

.hud-pill-bottom {
  bottom: 20px;
  left: 20px;
  padding: 10px 18px;
}

.pill-metric {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.4rem;
  font-weight: 800;
  color: #ff2e93;
  text-shadow: 0 0 12px rgba(255, 46, 147, 0.6);
}

.pill-desc {
  display: flex;
  flex-direction: column;
}

.pill-desc-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: #ffffff;
}

.pill-desc-sub {
  font-size: 0.68rem;
  color: #a855f7;
}

.floating-student-badge {
  position: absolute;
  bottom: 85px;
  right: -15px;
  background: rgba(13, 18, 33, 0.9);
  border: 1px solid rgba(255, 46, 147, 0.4);
  backdrop-filter: blur(16px);
  padding: 8px 14px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
  z-index: 5;
  animation: float-smooth 5s infinite ease-in-out;
}

.student-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #ff2e93, #9333ea);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.85rem;
}

.student-info {
  display: flex;
  flex-direction: column;
}

.student-name {
  font-size: 0.78rem;
  font-weight: 700;
  color: #ffffff;
}

.student-score {
  font-size: 0.68rem;
  color: #ff5ca8;
  font-weight: 600;
}

/* PROMO VIDEO SECTION */
.section-promo {
  padding: 40px 0 80px;
  position: relative;
}

.promo-wrapper {
  max-width: 980px;
  margin: 0 auto;
}

.promo-header {
  text-align: center;
  margin-bottom: 28px;
}

.promo-header h2 {
  font-size: 2rem;
  color: #ffffff;
  margin-top: 10px;
}

.promo-screen-frame {
  position: relative;
  border-radius: 22px;
  overflow: hidden;
  border: 2px solid rgba(255, 46, 147, 0.35);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(255, 46, 147, 0.2);
  background: #090c17;
  aspect-ratio: 16/9;
}

.promo-video-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.screen-frame-glow {
  position: absolute;
  inset: 0;
  box-shadow: inset 0 0 30px rgba(255, 46, 147, 0.15);
  pointer-events: none;
}

/* SECTION HEADINGS */
.section-heading {
  margin-bottom: 50px;
}

.cyber-tag {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: #ff2e93;
  background: rgba(255, 46, 147, 0.1);
  border: 1px solid rgba(255, 46, 147, 0.3);
  padding: 4px 14px;
  border-radius: 20px;
  margin-bottom: 14px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
}

.section-subtitle {
  font-size: 1.05rem;
  color: #94a3b8;
  max-width: 640px;
  margin: 0 auto;
}

/* WHY US SECTION */
.section-why-us {
  padding: 80px 0;
  background: linear-gradient(180deg, #070a14 0%, #0d1222 50%, #070a14 100%);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 26px;
}

.feature-cyber-card {
  background: rgba(18, 24, 43, 0.7);
  border: 1px solid rgba(255, 46, 147, 0.18);
  border-radius: 20px;
  padding: 32px 28px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(16px);
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.feature-cyber-card:hover {
  transform: translateY(-6px);
  border-color: rgba(255, 46, 147, 0.6);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(255, 46, 147, 0.2);
}

.card-icon-halo {
  font-size: 2.2rem;
  margin-bottom: 20px;
  display: inline-block;
  filter: drop-shadow(0 0 12px rgba(255, 46, 147, 0.5));
}

.feature-cyber-card h3 {
  font-size: 1.22rem;
  color: #ffffff;
  margin-bottom: 12px;
  line-height: 1.35;
}

.feature-cyber-card p {
  font-size: 0.92rem;
  color: #cbd5e1;
  line-height: 1.6;
  margin: 0;
}

.card-corner-accent {
  position: absolute;
  top: 0;
  right: 0;
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, transparent 50%, rgba(255, 46, 147, 0.3) 50%);
}

.highlight-card {
  border-color: rgba(255, 46, 147, 0.35);
  background: rgba(25, 32, 58, 0.75);
}

/* COURSE SYSTEM (TIMELINE) */
.section-system {
  padding: 90px 0;
  position: relative;
}

.system-timeline {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.timeline-step-item {
  position: relative;
}

.step-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.6rem;
  font-weight: 800;
  color: #ff2e93;
  margin-bottom: 12px;
  text-shadow: 0 0 15px rgba(255, 46, 147, 0.6);
}

.step-card {
  background: rgba(18, 24, 43, 0.75);
  border: 1px solid rgba(255, 46, 147, 0.2);
  border-radius: 18px;
  padding: 24px;
  height: calc(100% - 45px);
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
}

.step-card:hover {
  border-color: #ff2e93;
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 46, 147, 0.18);
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 10px;
}

.step-header h4 {
  font-size: 1.12rem;
  color: #ffffff;
  margin: 0;
}

.step-time {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  font-weight: 700;
  color: #a855f7;
  background: rgba(168, 85, 247, 0.15);
  border: 1px solid rgba(168, 85, 247, 0.3);
  padding: 3px 8px;
  border-radius: 6px;
  white-space: nowrap;
}

.step-card p {
  font-size: 0.88rem;
  color: #cbd5e1;
  line-height: 1.55;
  margin: 0;
}

.highlight-step .step-card {
  border-color: rgba(255, 46, 147, 0.5);
  background: linear-gradient(135deg, rgba(255, 46, 147, 0.12) 0%, rgba(18, 24, 43, 0.85) 100%);
}

/* LIVE EXPRESS CALCULATOR WIDGET */
.section-calc-preview {
  padding: 80px 0;
}

.calc-preview-card {
  background: rgba(15, 21, 38, 0.85);
  border: 1.5px solid rgba(255, 46, 147, 0.35);
  border-radius: 28px;
  padding: 48px;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 40px;
  align-items: center;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 35px rgba(255, 46, 147, 0.2);
}

.calc-title {
  font-size: 2.2rem;
  color: #ffffff;
  margin: 10px 0 12px;
}

.calc-subtitle {
  font-size: 0.98rem;
  color: #cbd5e1;
  line-height: 1.6;
  margin-bottom: 24px;
}

.calc-type-switch {
  display: inline-flex;
  gap: 6px;
  background: rgba(255, 255, 255, 0.06);
  padding: 4px;
  border-radius: 30px;
  border: 1px solid rgba(255, 46, 147, 0.25);
  margin-bottom: 24px;
}

.calc-type-switch button {
  padding: 8px 20px;
  border-radius: 24px;
  font-weight: 700;
  font-size: 0.88rem;
  background: transparent;
  color: #94a3b8;
  transition: all 0.25s ease;
}

.calc-type-switch button.active {
  background: linear-gradient(135deg, #ff2e93, #ff007a);
  color: white;
  box-shadow: 0 0 15px rgba(255, 46, 147, 0.6);
}

.calc-slider-block {
  margin-bottom: 20px;
}

.calc-slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 12px;
}

.calc-score-val {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.25rem;
  font-weight: 800;
  color: #ff2e93;
}

.cyber-range-input {
  width: 100%;
  accent-color: #ff2e93;
  height: 8px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  cursor: pointer;
}

/* Gauge styling */
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
  border: 3px dashed rgba(255, 46, 147, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 0 30px rgba(255, 46, 147, 0.25);
}

.gauge-circle-inner {
  width: 190px;
  height: 190px;
  background: linear-gradient(135deg, #13192f, #0d1222);
  border-radius: 50%;
  border: 2px solid rgba(255, 46, 147, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
}

.gauge-percent {
  font-family: 'JetBrains Mono', monospace;
  font-size: 3rem;
  font-weight: 900;
  color: #ffffff;
  text-shadow: 0 0 20px rgba(255, 46, 147, 0.7);
}

.gauge-caption {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  color: #94a3b8;
  margin-top: -4px;
  margin-bottom: 6px;
}

.gauge-status-badge {
  font-size: 0.74rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
}

.status-high {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.4);
}

.status-mid {
  background: rgba(234, 179, 8, 0.15);
  color: #facc15;
  border: 1px solid rgba(234, 179, 8, 0.4);
}

.status-low {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.gauge-school-targets {
  width: 100%;
}

.target-title {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 600;
  margin-bottom: 8px;
}

.target-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
}

.target-tag {
  font-size: 0.75rem;
  font-weight: 600;
  color: #ffffff;
  background: rgba(255, 46, 147, 0.12);
  border: 1px solid rgba(255, 46, 147, 0.3);
  padding: 3px 9px;
  border-radius: 6px;
}

/* RESULTS SECTION */
.section-results {
  padding: 80px 0;
  background: linear-gradient(180deg, #070a14 0%, #0d1224 50%, #070a14 100%);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 26px;
}

.student-result-card {
  background: rgba(18, 24, 43, 0.72);
  border: 1px solid rgba(255, 46, 147, 0.2);
  border-radius: 20px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  backdrop-filter: blur(14px);
  transition: all 0.3s ease;
}

.student-result-card:hover {
  transform: translateY(-5px);
  border-color: #ff2e93;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(255, 46, 147, 0.2);
}

.card-top {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.avatar-ring {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a855f7, #6366f1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.95rem;
  box-shadow: 0 0 12px rgba(168, 85, 247, 0.4);
}

.avatar-ring.pink-ring {
  background: linear-gradient(135deg, #ff2e93, #ff007a);
  box-shadow: 0 0 15px rgba(255, 46, 147, 0.5);
}

.student-meta {
  flex: 1;
}

.student-meta h4 {
  font-size: 1rem;
  color: #ffffff;
  margin: 0;
}

.school-target {
  font-size: 0.75rem;
  color: #a855f7;
}

.score-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  font-weight: 800;
  color: #ff2e93;
  background: rgba(255, 46, 147, 0.12);
  border: 1px solid rgba(255, 46, 147, 0.3);
  padding: 4px 10px;
  border-radius: 8px;
}

.student-quote {
  font-size: 0.92rem;
  color: #cbd5e1;
  line-height: 1.55;
  font-style: italic;
  margin: 0 0 20px;
}

.result-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 14px;
}

.grant-pill {
  font-size: 0.74rem;
  font-weight: 700;
  color: #22c55e;
}

.verified-pill {
  font-size: 0.7rem;
  color: #94a3b8;
}

/* TARIFFS SECTION */
.section-tariffs {
  padding: 90px 0;
  position: relative;
}

.tariffs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  align-items: stretch;
}

.tariff-cyber-card {
  background: rgba(18, 24, 43, 0.75);
  border: 1px solid rgba(255, 46, 147, 0.22);
  border-radius: 24px;
  padding: 36px 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  backdrop-filter: blur(16px);
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.tariff-cyber-card:hover {
  transform: translateY(-6px);
  border-color: rgba(255, 46, 147, 0.5);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(255, 46, 147, 0.2);
}

.featured-tariff {
  background: rgba(22, 28, 52, 0.9);
  border: 2px solid #ff2e93;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.5), 0 0 35px rgba(255, 46, 147, 0.3);
  transform: scale(1.03);
}

.featured-tariff:hover {
  transform: scale(1.05) translateY(-6px);
}

.popular-ribbon {
  position: absolute;
  top: 16px;
  right: 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  font-weight: 800;
  color: white;
  background: linear-gradient(135deg, #ff2e93, #ff007a);
  padding: 4px 12px;
  border-radius: 20px;
  box-shadow: 0 0 12px rgba(255, 46, 147, 0.6);
}

.tariff-header {
  margin-bottom: 24px;
}

.tariff-name {
  font-size: 1.8rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 6px;
}

.tariff-for {
  font-size: 0.88rem;
  color: #94a3b8;
  margin: 0;
}

.tariff-features {
  list-style: none;
  padding: 0;
  margin: 0 0 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.tariff-features li {
  font-size: 0.92rem;
  color: #cbd5e1;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  line-height: 1.45;
}

.check-icon {
  color: #ff2e93;
  font-weight: 800;
  font-size: 1rem;
}

.btn-featured {
  background: linear-gradient(135deg, #ff2e93 0%, #ff007a 50%, #9333ea 100%);
  box-shadow: 0 0 25px rgba(255, 46, 147, 0.6);
}

/* FAQ SECTION */
.section-faq {
  padding: 80px 0;
}

.faq-accordion-list {
  max-width: 840px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.faq-accordion-item {
  background: rgba(18, 24, 43, 0.7);
  border: 1px solid rgba(255, 46, 147, 0.2);
  border-radius: 16px;
  padding: 20px 24px;
  cursor: pointer;
  backdrop-filter: blur(12px);
  transition: all 0.25s ease;
}

.faq-accordion-item:hover {
  border-color: rgba(255, 46, 147, 0.5);
  background: rgba(24, 32, 56, 0.8);
}

.faq-accordion-item.open {
  border-color: #ff2e93;
  box-shadow: 0 0 25px rgba(255, 46, 147, 0.18);
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.faq-q-text {
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
}

.faq-toggle-icon {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.4rem;
  font-weight: 700;
  color: #ff2e93;
}

.faq-answer {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.faq-answer p {
  font-size: 0.95rem;
  color: #cbd5e1;
  line-height: 1.6;
  margin: 0;
}

/* FINAL CTA BANNER */
.section-cta-banner {
  padding: 90px 0 100px;
}

.cta-banner-card {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 46, 147, 0.18) 0%, rgba(147, 51, 234, 0.15) 100%);
  border: 1.5px solid rgba(255, 46, 147, 0.45);
  border-radius: 32px;
  padding: 70px 40px;
  text-align: center;
  overflow: hidden;
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 46, 147, 0.25);
}

.cta-banner-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 46, 147, 0.4) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  filter: blur(80px);
  pointer-events: none;
}

.cta-banner-content {
  position: relative;
  z-index: 5;
  max-width: 680px;
  margin: 0 auto;
}

.cta-banner-title {
  font-size: 2.6rem;
  font-weight: 800;
  color: #ffffff;
  margin: 16px 0 14px;
  line-height: 1.2;
}

.cta-banner-sub {
  font-size: 1.1rem;
  color: #cbd5e1;
  margin-bottom: 34px;
}

.cta-banner-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-cta-primary {
  padding: 16px 36px;
  font-size: 1.05rem;
}

.btn-cta-wa {
  padding: 16px 32px;
}

/* FOOTER */
.footer-futuristic {
  background: #05070f;
  border-top: 1px solid rgba(255, 46, 147, 0.2);
  padding: 70px 0 0;
  position: relative;
  z-index: 1;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 50px;
}

.footer-logo {
  font-family: 'Outfit', sans-serif;
  font-size: 1.8rem;
  font-weight: 900;
  margin-bottom: 16px;
}

.logo-white {
  color: #ffffff;
}

.logo-pink {
  color: #ff2e93;
  text-shadow: 0 0 15px rgba(255, 46, 147, 0.6);
}

.footer-tagline {
  font-size: 0.95rem;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 22px;
}

.social-links {
  display: flex;
  gap: 10px;
}

.social-icon-btn {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 46, 147, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 0.85rem;
  transition: all 0.25s ease;
}

.social-icon-btn:hover {
  background: #ff2e93;
  box-shadow: 0 0 15px #ff2e93;
  transform: translateY(-2px);
}

.footer-col h4 {
  font-size: 1.1rem;
  color: #ffffff;
  margin-bottom: 20px;
}

.footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-col ul li {
  margin-bottom: 12px;
}

.footer-col ul li a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.92rem;
  transition: all 0.2s ease;
}

.footer-col ul li a:hover {
  color: #ff2e93;
  padding-left: 4px;
}

.footer-support-hours {
  color: #64748b;
  font-size: 0.85rem;
}

.footer-bottom-bar {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 24px 0;
  background: #030408;
}

.bottom-flex {
  font-size: 0.85rem;
  color: #64748b;
}

.btn-back-to-top {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 46, 147, 0.3);
  color: #e2e8f0;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 700;
  transition: all 0.2s ease;
}

.btn-back-to-top:hover {
  background: rgba(255, 46, 147, 0.2);
  color: white;
  border-color: #ff2e93;
}

/* Animations */
@keyframes bounce-down {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}

@keyframes scan-vertical {
  0% { top: 0; }
  100% { top: 100%; }
}

/* Responsive */
@media (max-width: 1080px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 40px;
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
  .features-grid,
  .system-timeline,
  .results-grid,
  .tariffs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .calc-preview-card {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 40px 0 60px;
  }
  .hero-title {
    font-size: 2.1rem;
    line-height: 1.2;
  }
  .hero-subtitle {
    font-size: 0.98rem;
    margin-bottom: 24px;
  }
  .hero-badge {
    padding: 5px 12px;
    font-size: 0.72rem;
  }
  .hero-actions {
    flex-direction: column;
    width: 100%;
    gap: 12px;
  }
  .hero-actions .btn-cyber,
  .hero-actions .btn-cyber-outline {
    width: 100%;
    justify-content: center;
  }
  .features-grid,
  .system-timeline,
  .results-grid,
  .tariffs-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .hero-stats-hud {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    gap: 16px;
    padding: 16px;
  }
  .hud-stat-divider {
    display: none;
  }
  .hero-hologram-wrapper {
    max-width: 320px;
  }
  .floating-hud-pill {
    padding: 6px 12px;
    font-size: 0.7rem;
  }
  .floating-student-badge {
    right: 10px;
    bottom: 60px;
    padding: 6px 10px;
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
  .calc-preview-card {
    padding: 24px 16px;
    border-radius: 20px;
  }
  .calc-title {
    font-size: 1.7rem;
  }
  .gauge-circle-outer {
    width: 180px;
    height: 180px;
  }
  .gauge-circle-inner {
    width: 154px;
    height: 154px;
  }
  .gauge-percent {
    font-size: 2.4rem;
  }
  .section-title {
    font-size: 1.9rem;
  }
  .cta-banner-card {
    padding: 40px 18px;
    border-radius: 22px;
  }
  .cta-banner-title {
    font-size: 1.85rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.8rem;
  }
  .calc-type-switch {
    width: 100%;
    display: flex;
  }
  .calc-type-switch button {
    flex: 1;
    padding: 8px 10px;
    font-size: 0.8rem;
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
