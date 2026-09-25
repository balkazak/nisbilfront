<template>
  <div class="student-dashboard" :class="{ 'sidebar-open': isSidebarOpen }">
    <div
      v-if="isSidebarOpen"
      class="sidebar-overlay"
      @click="isSidebarOpen = false"
    ></div>
    <aside class="sidebar">
      <div class="logo-area">nis-bil.online</div>
      <nav>
        <button @click="router.push('/')">
          {{ t("nav.main") }}
        </button>
        <button
          @click="selectView('courses')"
          :class="{ active: currentView === 'courses' }"
        >
          {{ t("dashboard.myCourses") }}
        </button>
        <button
          @click="selectView('tests')"
          :class="{ active: currentView === 'tests' }"
        >
          {{ t("dashboard.testing") }}
        </button>
        <button
          @click="selectView('results')"
          :class="{ active: currentView === 'results' }"
        >
          {{ t("dashboard.results") }}
        </button>
        <button
          @click="selectView('trial-test')"
          :class="{ active: currentView === 'trial-test' }"
        >
          {{ t("dashboard.trial") }}
        </button>
        <button
          @click="selectView('calculator')"
          :class="{ active: currentView === 'calculator' }"
        >
          {{ t("nav.calculator") }}
        </button>
        <button
          @click="selectView('tariffs')"
          :class="{ active: currentView === 'tariffs' }"
        >
          {{ t("nav.tariffs") }}
        </button>
      </nav>
      <div
        class="coins-balance"
        v-if="user"
        :title="t('dashboard.coinsTooltip')"
      >
        <span class="coin-icon">🟡</span>
        <span class="coin-text">{{ user.coins || 0 }}</span>
      </div>
      <div style="margin-top: auto; padding: 20px">
        <button @click="logout" class="btn-logout">
          {{ t("dashboard.logout") }}
        </button>
      </div>
    </aside>

    <main class="content">
      <header class="mobile-header">
        <button class="hamburger" @click="isSidebarOpen = !isSidebarOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div class="mobile-logo">nis-bil.online</div>
      </header>
      <!-- Course List -->
      <div
        v-if="currentView === 'courses' && !activeCourse && !activeTestId"
        class="fade-in"
      >
        <h2 class="title-lg">
          {{ t("dashboard.availableCourses") }}
        </h2>

        <div class="info-banner mb-4">
          💡 {{ t("dashboard.earnCoinsPrompt") }}
        </div>

        <div class="course-grid">
          <div
            v-for="course in courses"
            :key="course.id"
            class="card course-card animate-scale"
            @click="openCourse(course)"
          >
            <div class="card-content">
              <h3>{{ course.title }}</h3>
              <p>{{ course.description || "Курс подготовки" }}</p>

              <!-- Course Progress bar on card -->
              <div class="course-card-progress" v-if="course.Lessons && course.Lessons.length > 0">
                <div class="progress-info-row">
                  <span class="progress-label">{{ t("dashboard.courseProgress") }}</span>
                  <span class="progress-pct">{{ getCourseProgress(course) }}%</span>
                </div>
                <div class="progress-track-sm">
                  <div
                    class="progress-fill-sm"
                    :style="{ width: getCourseProgress(course) + '%' }"
                  ></div>
                </div>
                <span class="progress-count-text">
                  {{ getCompletedLessonsCount(course) }} / {{ course.Lessons.length }} {{ t("courseManagement.lessonsCount") || "уроков" }}
                </span>
              </div>
            </div>
            <button class="btn-start">
              {{ getCourseProgress(course) > 0 ? t("dashboard.continueBtn") : t("dashboard.startBtn") }} &rarr;
            </button>
          </div>
        </div>
      </div>

      <!-- Test List -->
      <div v-if="currentView === 'tests' && !activeTestId" class="fade-in">
        <h2 class="title-lg">{{ t("dashboard.availableTests") }}</h2>

        <div class="info-banner mb-4">
          💡 {{ t("dashboard.earnCoinsPrompt") }}
        </div>

        <div class="course-grid">
          <div
            v-for="test in standaloneTests"
            :key="test.id"
            class="card course-card animate-scale"
            @click="openStandaloneTest(test)"
          >
            <div class="card-content">
              <h3>{{ test.title }}</h3>
              <p>{{ test.description || "Без описания" }}</p>
              <div class="test-badges-row mt-2 flex gap-2 flex-wrap items-center">
                <span v-if="test.category === 'nis'" class="badge-nis">🏛️ {{ t("testManagement.categoryNIS") || 'НИШ' }}</span>
                <span v-else-if="test.category === 'bil'" class="badge-bil">🏫 {{ t("testManagement.categoryBIL") || 'БИЛ' }}</span>
                <span class="badge-blue" v-if="test.time_limit"
                  >⏱ {{ test.time_limit }} {{ t("trial.min") }}</span
                >
                <span class="badge-blue" v-else>{{ t("trial.noTimer") }}</span>
              </div>
            </div>
            <button v-if="test.isOwned" class="btn-start">
              {{ t("dashboard.startBtn") }} &rarr;
            </button>
            <button
              v-else-if="test.coin_price > 0"
              class="btn-buy"
              @click.stop="buyTest(test)"
              :disabled="user.coins < test.coin_price"
            >
              {{ t("dashboard.buyTest", { price: test.coin_price }) }}
            </button>
            <button v-else class="btn-start">
              {{ t("dashboard.startBtn") }} &rarr;
            </button>
          </div>
          <div v-if="standaloneTests.length === 0" style="color: #666">
            {{ t("dashboard.noTests") }}
          </div>
        </div>
      </div>

      <!-- Standalone Test Runner -->
      <div v-if="activeTestId" class="fade-in" style="height: 100%">
        <button
          @click="
            activeTestId = null;
            showTest = false;
          "
          class="btn-back"
        >
          &larr; {{ t("dashboard.backToTests") }}
        </button>
        <TestRunner
          :testId="activeTestId"
          :isStandalone="true"
          @completed="onTestCompleted"
          @cancel="onTestCancel"
        />
      </div>

      <!-- Course Player -->
      <div v-if="activeCourse" class="course-player fade-in">
        <button @click="activeCourse = null" class="btn-back">
          &larr; {{ t("dashboard.backToCourses") }}
        </button>

        <!-- Course Progress & Resume Banner -->
        <div class="course-progress-banner card mb-4">
          <div class="progress-banner-main">
            <div>
              <span class="resume-badge">
                📍 {{ t("dashboard.currentPosition") }}:
                <strong>{{ currentLesson?.title || "Урок" }}</strong>
              </span>
              <h2 class="course-player-title">{{ activeCourse.title }}</h2>
            </div>
            <div class="banner-pct-box">
              <span class="banner-pct-num">{{ getCourseProgress(activeCourse) }}%</span>
              <span class="banner-pct-sub">
                {{ getCompletedLessonsCount(activeCourse) }} / {{ activeCourse.Lessons ? activeCourse.Lessons.length : 0 }} {{ t("courseManagement.lessonsCount") || "уроков" }}
              </span>
            </div>
          </div>
          <div class="progress-track mt-3">
            <div
              class="progress-bar-fill"
              :style="{ width: getCourseProgress(activeCourse) + '%' }"
            ></div>
          </div>
        </div>

        <div class="player-layout">
          <!-- Sidebar Lessons -->
          <div
            v-if="showMobileLessons"
            class="lesson-overlay"
            @click="showMobileLessons = false"
          ></div>
          <div
            class="lesson-sidebar card"
            :class="{ 'mobile-open': showMobileLessons }"
          >
            <div class="sidebar-header-mobile" v-if="isMobile">
              <h3 class="sidebar-title">{{ activeCourse.title }}</h3>
              <button
                @click="showMobileLessons = false"
                class="btn-close-drawer"
              >
                ✕
              </button>
            </div>
            <h3 class="sidebar-title desktop-only">{{ activeCourse.title }}</h3>
            <ul class="lesson-nav">
              <li
                v-for="(lesson, lIdx) in activeCourse.Lessons"
                :key="lesson.id"
                :class="{
                  active: currentLesson?.id === lesson.id,
                  completed: isLessonCompleted(activeCourse, lesson)
                }"
                @click="selectLesson(lesson)"
              >
                <span
                  class="lesson-marker"
                  :class="{
                    'marker-done': isLessonCompleted(activeCourse, lesson),
                    'marker-current': currentLesson?.id === lesson.id
                  }"
                >
                  {{ isLessonCompleted(activeCourse, lesson) ? "✓" : (currentLesson?.id === lesson.id ? "▶" : (lIdx + 1)) }}
                </span>
                <span class="lesson-title-text">{{ lesson.title }}</span>
                <span v-if="isLessonCompleted(activeCourse, lesson)" class="badge-done-check">
                  ✓
                </span>
              </li>
            </ul>
          </div>

          <!-- Main Content -->
          <div class="video-area card" v-if="currentLesson">
            <div class="mobile-actions">
              <button @click="currentLesson = null" class="btn-back-lessons">
                &larr; {{ t("dashboard.backToLessons") }}
              </button>
              <button
                @click="showMobileLessons = !showMobileLessons"
                class="btn-toggle-lessons"
              >
                {{
                  showMobileLessons
                    ? t("dashboard.hideLessons")
                    : t("dashboard.showLessons")
                }}
              </button>
            </div>
            <!-- Video Video -->
            <div v-if="!showTest" class="fade-in">
              <h3 class="lesson-title mb-6">{{ currentLesson.title }}</h3>
              <div
                v-for="(url, index) in currentLesson.video_urls"
                :key="'vid-' + index"
                class="video-block mb-6"
              >
                <h4
                  v-if="currentLesson.video_urls.length > 1"
                  class="text-gray-500 text-sm mb-2"
                >
                  Видео {{ index + 1 }}
                </h4>
                <div class="video-container">
                  <iframe
                    width="100%"
                    height="100%"
                    :src="getEmbedUrl(url)"
                    frameborder="0"
                    allowfullscreen
                  ></iframe>
                </div>
              </div>

              <!-- Additional Materials -->
              <div
                v-if="
                  currentLesson.materials && currentLesson.materials.length > 0
                "
                class="materials-section mb-6"
              >
                <h4 class="font-bold text-lg mb-3">
                  {{ t("courseManagement.additionalMaterials") }}
                </h4>
                <div class="materials-grid">
                  <a
                    v-for="(m, mIdx) in currentLesson.materials"
                    :key="'mat-' + mIdx"
                    :href="m.url"
                    target="_blank"
                    class="material-item"
                  >
                    <span class="material-icon">📄</span>
                    <div class="material-info">
                      <span class="material-name">{{ m.name }}</span>
                      <span class="material-ext">PDF</span>
                    </div>
                  </a>
                </div>
              </div>

              <div class="actions-bar">
                <button
                  v-if="currentLesson.Test"
                  @click="startTest"
                  class="btn-primary animate-pulse"
                >
                  {{
                    currentLesson.solution_video_urls &&
                    currentLesson.solution_video_urls.length > 0
                      ? t("dashboard.startTest") +
                        " (" +
                        (t("dashboard.submitted") || "Сдано") +
                        ")"
                      : t("dashboard.startTest")
                  }}
                </button>

                <!-- Unlocked Solution -->
                <button
                  v-if="
                    currentLesson.solution_video_urls &&
                    currentLesson.solution_video_urls.length > 0
                  "
                  @click="showSolution = !showSolution"
                  class="btn-secondary"
                >
                  {{
                    showSolution
                      ? t("dashboard.hideReview") || "Скрыть Разбор"
                      : t("dashboard.videoReview")
                  }}
                </button>

                <!-- Locked Solution -->
                <button
                  v-else-if="currentLesson.has_solution"
                  disabled
                  class="btn-disabled"
                  :title="t('dashboard.lockedHint') || 'Сначала пройдите тест'"
                >
                  {{ t("dashboard.lockedReview") }}
                </button>
              </div>

              <div
                v-if="showSolution"
                class="solution-container fade-in mt-4 border-t pt-4"
              >
                <h4 class="font-bold text-lg mb-4">
                  {{ t("dashboard.videoReview") }}
                </h4>
                <div
                  v-for="(solUrl, sIdx) in currentLesson.solution_video_urls"
                  :key="'sol-' + sIdx"
                  class="video-block mb-4"
                >
                  <h5
                    v-if="currentLesson.solution_video_urls.length > 1"
                    class="text-sm text-gray-500 mb-1"
                  >
                    Разбор {{ sIdx + 1 }}
                  </h5>
                  <div class="video-container secondary">
                    <iframe
                      width="100%"
                      height="100%"
                      :src="getEmbedUrl(solUrl)"
                      frameborder="0"
                      allowfullscreen
                    ></iframe>
                  </div>
                </div>
              </div>

              <!-- Lesson Navigation and Progress Action Footer -->
              <div class="lesson-nav-footer mt-6">
                <button
                  type="button"
                  @click="goToPrevLesson"
                  :disabled="!hasPrevLesson"
                  class="btn-secondary btn-nav-step"
                >
                  ← {{ t("dashboard.prevLesson") }}
                </button>

                <button
                  type="button"
                  v-if="!currentLesson.Test && !isLessonCompleted(activeCourse, currentLesson)"
                  @click="markCurrentLessonDone"
                  class="btn-mark-done"
                >
                  ✓ {{ t("dashboard.markDone") }}
                </button>

                <button
                  type="button"
                  @click="goToNextLesson"
                  :disabled="!hasNextLesson"
                  class="btn-primary btn-nav-step"
                >
                  {{ t("dashboard.nextLesson") }} →
                </button>
              </div>
            </div>

            <!-- Test Runner (Lesson Attached) -->
            <div v-if="showTest" class="fade-in">
              <TestRunner
                :testId="currentLesson.Test.id"
                :isStandalone="false"
                @completed="onTestCompleted"
                @cancel="showTest = false"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- My Results -->
      <div v-if="currentView === 'results'" class="fade-in">
        <h2 class="title-lg">{{ t("dashboard.myProgress") }}</h2>
        <div class="card">
          <table class="styled-table">
            <thead>
              <tr>
                <th>{{ t("dashboard.test") || "Тест" }}</th>
                <th>{{ t("dashboard.results") }}</th>
                <th>{{ t("dashboard.date") }}</th>
                <th style="text-align: right">Разбор ошибок</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="res in myResults" :key="res.id">
                <td class="font-bold">
                  {{ res.Test ? res.Test.title : "Тест" }}
                  <span v-if="res.Test?.category === 'nis'" class="badge-nis ml-2" style="font-size: 0.72rem; padding: 2px 7px;">НИШ</span>
                  <span v-else-if="res.Test?.category === 'bil'" class="badge-bil ml-2" style="font-size: 0.72rem; padding: 2px 7px;">БИЛ</span>
                </td>
                <td>
                  <span class="score-badge"
                    >{{ res.score }} / {{ res.max_score }}</span
                  >
                </td>
                <td>{{ new Date(res.createdAt).toLocaleString() }}</td>
                <td style="text-align: right">
                  <button
                    @click="openReviewModal(res)"
                    class="btn-sm btn-secondary"
                    style="padding: 6px 14px; font-size: 0.85rem; border-radius: 8px;"
                  >
                    📝 Смотреть ошибки
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Past Test Review Modal -->
      <div v-if="showReviewModal" class="modal-overlay" @click.self="showReviewModal = false">
        <div class="card modal-wide animate-zoom-in" style="max-height: 90vh; overflow-y: auto; padding: 25px; max-width: 800px; width: 95%;">
          <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
            <div>
              <h3 style="margin: 0; font-size: 1.3rem;">📝 Разбор теста: {{ selectedReviewResult?.Test?.title }}</h3>
              <p class="text-muted text-sm mt-1" v-if="selectedReviewResult">
                Результат: <strong>{{ selectedReviewResult.score }} / {{ selectedReviewResult.max_score }}</strong>
              </p>
            </div>
            <button @click="showReviewModal = false" class="btn-close" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
          </div>

          <div v-if="loadingReview" class="loading-state" style="text-align: center; padding: 40px;">
            <div class="spinner"></div>
          </div>
          <div v-else-if="selectedReviewResult && selectedReviewResult.questionsReview">
            <!-- Filter Pills -->
            <div class="review-filters mb-4">
              <button
                type="button"
                class="filter-pill"
                :class="{ active: historyReviewFilter === 'all' }"
                @click="historyReviewFilter = 'all'"
              >
                Все вопросы ({{ selectedReviewResult.questionsReview.length }})
              </button>
              <button
                type="button"
                class="filter-pill filter-pill-error"
                :class="{ active: historyReviewFilter === 'errors' }"
                @click="historyReviewFilter = 'errors'"
              >
                ❌ Ошибки ({{ selectedReviewResult.questionsReview.filter(q => !q.isCorrect).length }})
              </button>
              <button
                type="button"
                class="filter-pill filter-pill-correct"
                :class="{ active: historyReviewFilter === 'correct' }"
                @click="historyReviewFilter = 'correct'"
              >
                ✅ Верные ({{ selectedReviewResult.questionsReview.filter(q => q.isCorrect).length }})
              </button>
            </div>

            <!-- List of Questions -->
            <div class="review-list">
              <div
                v-for="(q, qIndex) in filteredHistoryQuestions"
                :key="q.id"
                class="review-card"
                :class="{
                  'status-correct': q.isCorrect,
                  'status-error': !q.isCorrect && q.userAnswer !== null,
                  'status-unanswered': q.userAnswer === null
                }"
              >
                <div class="review-card-header">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="review-q-num">Вопрос #{{ q.order || qIndex + 1 }}</span>
                    <span
                      v-if="selectedReviewResult?.Test?.category === 'nis' || selectedReviewResult?.category === 'nis' || q.question_type"
                      class="nis-badge"
                      :class="q.question_type === 'sandyk_sippattama' ? 'badge-sandyk' : 'badge-standard'"
                    >
                      {{ q.question_type === 'sandyk_sippattama' ? '📗 ' + (t("testManagement.questionTypeSandyk") || 'Сандық сипаттама (+5)') : '📘 ' + (t("testManagement.questionTypeStandard") || 'Стандарт (+10)') }}
                    </span>
                  </div>
                  <div class="review-status-badge">
                    <span v-if="q.isCorrect" class="badge-status badge-success">
                      ✅ Верно (+{{ getReviewQuestionScore(q) }})
                    </span>
                    <span v-else-if="q.userAnswer !== null" class="badge-status badge-danger">
                      ❌ Ошибка
                    </span>
                    <span v-else class="badge-status badge-warning">
                      ⚠️ Пропущено
                    </span>
                  </div>
                </div>

                <p class="review-q-text">{{ q.text }}</p>
                <div v-if="q.image_url" class="review-image-wrap">
                  <img :src="q.image_url" class="review-q-image" alt="Question Image" />
                </div>

                <div class="review-options-list">
                  <div
                    v-for="(opt, optIdx) in q.options"
                    :key="optIdx"
                    class="review-option"
                    :class="{
                      'is-correct-target': optIdx === q.correct_option_index,
                      'is-user-wrong': optIdx === q.userAnswer && !q.isCorrect,
                      'is-user-correct': optIdx === q.userAnswer && q.isCorrect
                    }"
                  >
                    <div class="option-marker">
                      <span v-if="optIdx === q.correct_option_index">✓</span>
                      <span v-else-if="optIdx === q.userAnswer && !q.isCorrect">✕</span>
                      <span v-else>{{ String.fromCharCode(65 + optIdx) }}</span>
                    </div>

                    <div class="review-opt-body">
                      <span v-if="opt.text" class="review-opt-text">{{ opt.text }}</span>
                      <img v-if="opt.image_url" :src="opt.image_url" class="review-opt-image" alt="Option Image" />
                    </div>

                    <div class="review-option-tag">
                      <span
                        v-if="optIdx === q.correct_option_index && optIdx === q.userAnswer"
                        class="tag-pill tag-correct"
                      >
                        ✓ Ваш ответ (верно)
                      </span>
                      <span
                        v-else-if="optIdx === q.correct_option_index"
                        class="tag-pill tag-correct"
                      >
                        ✓ Правильный ответ
                      </span>
                      <span
                        v-else-if="optIdx === q.userAnswer && !q.isCorrect"
                        class="tag-pill tag-wrong"
                      >
                        ✕ Ваш ответ (неверно)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style="text-align: right; margin-top: 25px;">
            <button @click="showReviewModal = false" class="btn-primary" style="padding: 10px 24px;">Закрыть</button>
          </div>
        </div>
      </div>

      <!-- Trial Test -->
      <div v-if="currentView === 'trial-test'" class="fade-in">
        <h2 class="title-lg">{{ t("dashboard.trial") }}</h2>
        <div class="card" style="padding: 40px; text-align: center">
          <p style="font-size: 1.2rem; margin-bottom: 20px">
            {{ t("trial.description") }}
          </p>
          <div
            style="
              display: flex;
              justify-content: center;
              gap: 30px;
              margin-bottom: 30px;
            "
          >
            <div class="badge-blue">⏱ {{ t("trial.duration") }}</div>
            <div class="badge-blue">📝 {{ t("trial.questions") }}</div>
          </div>
          <button class="btn-primary" @click="activeTestId = 'trial'">
            {{ t("trial.startBtn") }}
          </button>
        </div>
      </div>

      <!-- Calculator -->
      <div v-if="currentView === 'calculator'" class="fade-in">
        <h2 class="title-lg">{{ t("calculator.title") }}</h2>
        <div class="card" style="padding: 30px; border-radius: 20px">
          <div
            class="tabs"
            style="
              display: flex;
              gap: 10px;
              margin-bottom: 20px;
              border-bottom: 1px solid #eee;
              padding-bottom: 10px;
            "
          >
            <button
              :class="{ active: calcTab === 'nzm' }"
              @click="calcTab = 'nzm'"
              class="tab-btn"
            >
              {{ t("calculator.nzm") }}
            </button>
            <button
              :class="{ active: calcTab === 'bil' }"
              @click="calcTab = 'bil'"
              class="tab-btn"
            >
              {{ t("calculator.bil") }}
            </button>
          </div>

          <div
            class="calc-container"
            style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px"
          >
            <!-- Inputs -->
            <div
              class="calc-inputs"
              style="
                background: #fdfdfd;
                padding: 20px;
                border-radius: 12px;
                border: 1px solid #f0f0f0;
              "
            >
              <div
                v-if="calcTab === 'nzm'"
                class="form-grid"
                style="display: grid; grid-template-columns: 1fr; gap: 15px"
              >
                <div
                  class="form-group"
                  v-for="field in nzmFields"
                  :key="field.id"
                >
                  <label
                    style="
                      display: block;
                      font-size: 0.85rem;
                      font-weight: 600;
                      margin-bottom: 5px;
                    "
                    >{{ t(`calculator.${field.id}`) }}</label
                  >
                  <input
                    type="number"
                    v-model.number="nzmValues[field.id]"
                    style="
                      width: 100%;
                      padding: 10px;
                      border-radius: 8px;
                      border: 1px solid #ddd;
                    "
                    :placeholder="'max: ' + field.max"
                  />
                </div>
                <button
                  @click="calculateNzm"
                  class="btn-primary"
                  style="margin-top: 10px"
                >
                  {{ t("calculator.check") }}
                </button>
              </div>
              <div v-if="calcTab === 'bil'" class="form-group">
                <label
                  style="
                    display: block;
                    font-size: 0.85rem;
                    font-weight: 600;
                    margin-bottom: 5px;
                  "
                  >{{ t("calculator.bilScore") }}</label
                >
                <input
                  type="number"
                  v-model.number="bilScoreValue"
                  style="
                    width: 100%;
                    padding: 10px;
                    border-radius: 8px;
                    border: 1px solid #ddd;
                    margin-bottom: 15px;
                  "
                  :placeholder="t('calculator.enterScore')"
                />
                <button
                  @click="calculateBil"
                  class="btn-primary"
                  style="width: 100%"
                >
                  {{ t("calculator.check") }}
                </button>
              </div>
            </div>

            <!-- Results -->
            <div class="calc-results" v-if="calcShowResults">
              <h3 style="margin-bottom: 15px">
                {{ t("calculator.percentage") }}
              </h3>
              <div style="max-height: 400px; overflow-y: auto">
                <table style="width: 100%; border-collapse: collapse">
                  <tr
                    v-for="s in calcTab === 'nzm' ? nzmResults : bilResults"
                    :key="s.name"
                  >
                    <td
                      style="
                        padding: 8px 0;
                        border-bottom: 1px solid #eee;
                        font-size: 0.9rem;
                      "
                    >
                      {{ s.name }}
                    </td>
                    <td
                      style="
                        padding: 8px 0;
                        border-bottom: 1px solid #eee;
                        text-align: right;
                      "
                    >
                      <span
                        class="tag"
                        :class="getPercentageColor(s.percentage)"
                        >{{ s.percentage }}%</span
                      >
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div
              v-else
              style="
                display: flex;
                align-items: center;
                justify-content: center;
                color: #999;
                text-align: center;
              "
            >
              {{ t("calculator.fillForm") }}
            </div>
          </div>
        </div>
      </div>

      <!-- Tariffs -->
      <div v-if="currentView === 'tariffs'" class="fade-in">
        <h2 class="title-lg">{{ t("nav.tariffs") }}</h2>
        <div
          class="pricing-grid"
          style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 15px;
            max-width: 1000px;
            margin: 0 auto;
          "
        >
          <div
            v-for="plan in localPricingPlans"
            :key="plan.id"
            class="card pricing-item"
            :class="{ active: selectedTariff === plan.id }"
            @click="selectTariff(plan.id)"
            style="
              padding: 15px;
              cursor: pointer;
              transition: 0.3s;
              border: 2px solid transparent;
            "
          >
            <h3 style="margin-bottom: 12px; font-size: 1.15rem; font-weight: 700; color: #111827">
              {{ plan.name }}
            </h3>
            <ul
              style="
                list-style: none;
                padding: 0;
                margin-bottom: 10px;
                text-align: left;
                font-size: 0.8rem;
                color: #666;
              "
            >
              <li
                v-for="(feat, idx) in plan.features"
                :key="idx"
                style="margin-bottom: 3px"
              >
                ✓ {{ feat }}
              </li>
            </ul>
          </div>
        </div>

        <div
          v-if="selectedTariff"
          class="card"
          style="
            margin-top: 25px;
            padding: 25px;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
          "
        >
          <h3
            style="margin-bottom: 15px; text-align: center; font-size: 1.1rem"
          >
            {{ t("tariffs.submitTitle") }}: {{ selectedTariffName }}
          </h3>
          <div style="display: flex; flex-direction: column; gap: 12px">
            <input
              type="tel"
              v-model="appPhone"
              @input="(e) => formatPhoneInput(e, appPhone)"
              maxlength="18"
              placeholder="+7 (###) ### ## ##"
              style="padding: 10px; border: 1px solid #ddd; border-radius: 8px"
            />
            <textarea
              v-model="appComment"
              :placeholder="t('tariffs.comment')"
              style="padding: 10px; border: 1px solid #ddd; border-radius: 8px"
              rows="2"
            ></textarea>
            <button
              class="btn-primary"
              style="
                background: linear-gradient(135deg, #ff2e93, #ff007a);
                border: none;
                padding: 12px;
                font-weight: bold;
                box-shadow: 0 4px 15px rgba(255, 46, 147, 0.4);
              "
              @click="submitApp"
            >
              {{ t("tariffs.submitBtn") }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import api from "../api";
import TestRunner from "../components/TestRunner.vue";
import { useToast } from "../composables/useToast";
import { useLanguage } from "../composables/useLanguage";
import { usePhoneMask } from "../composables/usePhoneMask";

const router = useRouter();
const toast = useToast();
const { t, tm, format } = useLanguage();
const { handlePhoneInput: formatPhoneInput, isValidPhoneNumber } = usePhoneMask();

const nzmSchools = [
  { name: "Almaty FM", totalMin: 1261 },
  { name: "Almaty XB", totalMin: 1207 },
  { name: "Aqtau XB", totalMin: 1094 },
  { name: "Aqtobe FM", totalMin: 1113 },
  { name: "Astana IB", totalMin: 1270 },
  { name: "Astana FM", totalMin: 1255 },
  { name: "Atyrau FM", totalMin: 1084 },
  { name: "Karagandy XB", totalMin: 1013 },
  { name: "Kokwetau FM", totalMin: 1027 },
  { name: "Kostanay FM", totalMin: 936 },
  { name: "Kyzylorda FM", totalMin: 1016 },
  { name: "Oral FM", totalMin: 1040 },
  { name: "Oskemen FM", totalMin: 970 },
  { name: "Pavlodar FM", totalMin: 1022 },
  { name: "Petropavl FM", totalMin: 894 },
  { name: "Semei FM", totalMin: 903 },
  { name: "Shymkent FM", totalMin: 1126 },
  { name: "Shymkent XB", totalMin: 1091 },
  { name: "Taldyqorgan", totalMin: 1065 },
  { name: "Taraz", totalMin: 1048 },
  { name: "Turkistan", totalMin: 1080 },
];

const bilSchools = [
  { name: "Астана ұлдар БИЛ", totalMin: 206 },
  { name: "Алматы ерлер БИЛ", totalMin: 196 },
  { name: "Астана қыздар БИЛ", totalMin: 171 },
  { name: "Шымкент ерлер БИЛ", totalMin: 170 },
  { name: "Ақтөбе ерлер БИЛ", totalMin: 169 },
  { name: "Құлсары ерлер БИЛ", totalMin: 167 },
  { name: "Түркістан ерлер БИЛ", totalMin: 161 },
  { name: "Атырау ерлер БИЛ", totalMin: 161 },
  { name: "Есік ерлер БИЛ", totalMin: 158 },
  { name: "Тараз қыздар БИЛ", totalMin: 154 },
  { name: "Шымкент қыздар БИЛ", totalMin: 154 },
  { name: "Талдықорған ерлер БИЛ", totalMin: 148 },
  { name: "Тараз ерлер БИЛ", totalMin: 146 },
  { name: "Көкшетау ерлер БИЛ", totalMin: 145 },
  { name: "Ақтау ерлер БИЛ", totalMin: 143 },
  { name: "Қызылорда ерлер БИЛ", totalMin: 143 },
  { name: "Атырау қыздар БИЛ", totalMin: 142 },
  { name: "Қарағанды ерлер БИЛ", totalMin: 139 },
  { name: "Түркістан қыздар БИЛ", totalMin: 135 },
  { name: "Орал ерлер БИЛ", totalMin: 133 },
  { name: "Өскемен ерлер БИЛ", totalMin: 130 },
  { name: "Қостанай ерлер БИЛ (RUS)", totalMin: 129 },
  { name: "Қарағанды қыздар БИЛ", totalMin: 125 },
  { name: "Павлодар ерлер БИЛ", totalMin: 125 },
  { name: "Қызылорда қыздар БИЛ", totalMin: 123 },
  { name: "Павлодар қыздар БИЛ", totalMin: 110 },
  { name: "Жаңаөзен ерлер БИЛ", totalMin: 110 },
  { name: "Көкшетау қыздар БИЛ", totalMin: 105 },
  { name: "Семей ерлер БИЛ", totalMin: 100 },
  { name: "Қызылорда БИЛ физмат", totalMin: 96 },
  { name: "Қостанай ерлер БИЛ (KAZ)", totalMin: 96 },
  { name: "Жезқазған ерлер БИЛ", totalMin: 91 },
  { name: "Петропавл БИЛ", totalMin: 91 },
  { name: "Екібастұз БИЛ", totalMin: 91 },
  { name: "Щучинск IT БИЛ", totalMin: 90 },
  { name: "Арыс ерлер БИЛ", totalMin: 73 },
];

const currentView = ref("courses");
const courses = ref([]);
const myResults = ref([]);
const standaloneTests = ref([]);
const user = ref(JSON.parse(localStorage.getItem("user") || "{}"));
const activeCourse = ref(null);
const currentLesson = ref(null);
const activeTestId = ref(null);
const showTest = ref(false);
const showSolution = ref(false);
const isSidebarOpen = ref(false);
const calcTab = ref("nzm");
const nzmValues = reactive({
  mathematics: null,
  numericalCharacteristics: null,
  naturalScience: null,
  kazakh: null,
  russian: null,
  english: null,
});
const bilScoreValue = ref(null);
const nzmResults = ref([]);
const bilResults = ref([]);
const calcShowResults = ref(false);
const showMobileLessons = ref(false);
const isMobile = ref(window.innerWidth <= 992);

// Past test review modal
const showReviewModal = ref(false);
const loadingReview = ref(false);
const selectedReviewResult = ref(null);
const historyReviewFilter = ref("all");

const getReviewQuestionScore = (q) => {
  if (q.points_awarded !== undefined) return q.points_awarded;
  if (q.question_type === 'sandyk_sippattama') return 5;
  const isNis = selectedReviewResult.value?.Test?.category === 'nis' || selectedReviewResult.value?.category === 'nis';
  if (isNis) return 10;
  const isBil = selectedReviewResult.value?.Test?.category === 'bil' || selectedReviewResult.value?.category === 'bil';
  if (isBil) return 4;
  return q.score_value || 1;
};

const openReviewModal = async (resItem) => {
  showReviewModal.value = true;
  loadingReview.value = true;
  historyReviewFilter.value = "all";
  selectedReviewResult.value = null;
  try {
    const res = await api.get(`/results/${resItem.id}/review`);
    selectedReviewResult.value = res.data;
  } catch (err) {
    toast.error("Не удалось загрузить разбор: " + (err.response?.data?.message || err.message));
    showReviewModal.value = false;
  } finally {
    loadingReview.value = false;
  }
};

const filteredHistoryQuestions = computed(() => {
  if (!selectedReviewResult.value || !selectedReviewResult.value.questionsReview)
    return [];
  const list = selectedReviewResult.value.questionsReview;
  if (historyReviewFilter.value === "errors") {
    return list.filter((q) => !q.isCorrect);
  }
  if (historyReviewFilter.value === "correct") {
    return list.filter((q) => q.isCorrect);
  }
  return list;
});

const nzmFields = [
  { id: "mathematics", max: 400 },
  { id: "numericalCharacteristics", max: 300 },
  { id: "naturalScience", max: 200 },
  { id: "kazakh", max: 200 },
  { id: "russian", max: 200 },
  { id: "english", max: 200 },
];

const localPricingPlans = computed(() => [
  {
    id: "bil_online",
    name: t("tariffs.p5.name"),
    price: 69000,
    originalPrice: 125000,
    features: tm("tariffs.p5.features") || [],
  },
  {
    id: "nzm_online",
    name: t("tariffs.p1.name"),
    price: 42000,
    originalPrice: 75000,
    features: tm("tariffs.p1.features") || [],
  },
  {
    id: "math_package",
    name: t("tariffs.p2.name"),
    price: 19000,
    originalPrice: 53000,
    features: tm("tariffs.p2.features") || [],
  },
  {
    id: "logic_package",
    name: t("tariffs.p3.name"),
    price: 14900,
    originalPrice: 20000,
    features: tm("tariffs.p3.features") || [],
  },
  {
    id: "bil_bundle",
    name: t("tariffs.p4.name"),
    price: 29900,
    originalPrice: 76000,
    features: tm("tariffs.p4.features") || [],
  },
]);

const selectedTariff = ref(null);
const appPhone = ref("");
const appComment = ref("");

const selectedTariffName = computed(() => {
  const plan = localPricingPlans.value.find(
    (p) => p.id === selectedTariff.value,
  );
  return plan ? plan.name : "";
});

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 992;
};

const selectView = (view) => {
  currentView.value = view;
  isSidebarOpen.value = false;
  activeCourse.value = null;
  activeTestId.value = null;
};

const fetchCourses = async () => {
  const res = await api.get("/courses");
  courses.value = res.data;
};

const fetchResults = async () => {
  const res = await api.get("/results/me");
  myResults.value = res.data;
};

const fetchUser = async () => {
  try {
    const res = await api.get("/auth/me");
    user.value = res.data;
    localStorage.setItem("user", JSON.stringify(res.data));
  } catch (err) {
    console.error("Failed to fetch user data", err);
  }
};

const fetchStandaloneTests = async () => {
  const res = await api.get("/tests?is_standalone=true");
  standaloneTests.value = res.data;
};

const getProgressStorageKey = (courseId) => {
  const userId = user.value?.id || "guest";
  return `nisbil_student_course_${userId}_${courseId}`;
};

const getStoredProgress = (courseId) => {
  try {
    const raw = localStorage.getItem(getProgressStorageKey(courseId));
    return raw ? JSON.parse(raw) : { lastLessonId: null, completedLessonIds: [] };
  } catch (e) {
    return { lastLessonId: null, completedLessonIds: [] };
  }
};

const saveStoredProgress = (courseId, lastLessonId, completedLessonIds) => {
  try {
    const current = getStoredProgress(courseId);
    const updated = {
      lastLessonId:
        lastLessonId !== undefined && lastLessonId !== null
          ? lastLessonId
          : current.lastLessonId,
      completedLessonIds: completedLessonIds || current.completedLessonIds || [],
    };
    localStorage.setItem(getProgressStorageKey(courseId), JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save progress in localStorage", e);
  }
};

const isLessonCompleted = (course, lesson) => {
  if (!course || !lesson) return false;
  if (lesson.isTestCompleted) return true;
  if (
    lesson.Test &&
    myResults.value &&
    myResults.value.some((r) => r.TestId === lesson.Test.id)
  ) {
    return true;
  }
  const prog = getStoredProgress(course.id);
  return (prog.completedLessonIds || []).includes(lesson.id);
};

const getCompletedLessonsCount = (course) => {
  if (!course || !course.Lessons || course.Lessons.length === 0) return 0;
  return course.Lessons.filter((l) => isLessonCompleted(course, l)).length;
};

const getCourseProgress = (course) => {
  if (!course || !course.Lessons || course.Lessons.length === 0) return 0;
  const done = getCompletedLessonsCount(course);
  return Math.round((done / course.Lessons.length) * 100);
};

const openCourse = async (course) => {
  const res = await api.get(`/courses/${course.id}`);
  activeCourse.value = res.data;
  showTest.value = false;
  showSolution.value = false;

  const lessons = activeCourse.value.Lessons || [];
  if (lessons.length === 0) {
    currentLesson.value = null;
    return;
  }

  // Check saved progress: where student stopped
  const prog = getStoredProgress(course.id);
  let targetLesson = null;

  if (prog.lastLessonId) {
    targetLesson = lessons.find((l) => l.id === prog.lastLessonId);
  }

  // If not found, find first uncompleted lesson
  if (!targetLesson) {
    targetLesson = lessons.find((l) => !isLessonCompleted(activeCourse.value, l));
  }

  // Fallback to first lesson
  if (!targetLesson) {
    targetLesson = lessons[0];
  }

  selectLesson(targetLesson);
};

const selectLesson = (lesson) => {
  currentLesson.value = lesson;
  showTest.value = false;
  showSolution.value = false;
  showMobileLessons.value = false;

  // Save last opened lesson where student stopped
  if (activeCourse.value && lesson) {
    const prog = getStoredProgress(activeCourse.value.id);
    saveStoredProgress(activeCourse.value.id, lesson.id, prog.completedLessonIds);
  }
};

const currentLessonIndex = computed(() => {
  if (!activeCourse.value || !currentLesson.value || !activeCourse.value.Lessons)
    return -1;
  return activeCourse.value.Lessons.findIndex(
    (l) => l.id === currentLesson.value.id,
  );
});

const hasPrevLesson = computed(() => {
  return currentLessonIndex.value > 0;
});

const hasNextLesson = computed(() => {
  if (!activeCourse.value || !activeCourse.value.Lessons) return false;
  return (
    currentLessonIndex.value >= 0 &&
    currentLessonIndex.value < activeCourse.value.Lessons.length - 1
  );
});

const goToPrevLesson = () => {
  if (hasPrevLesson.value) {
    selectLesson(activeCourse.value.Lessons[currentLessonIndex.value - 1]);
  }
};

const goToNextLesson = () => {
  if (hasNextLesson.value) {
    // If current lesson has no test, automatically mark it done as student advances
    if (!currentLesson.value.Test) {
      const prog = getStoredProgress(activeCourse.value.id);
      const completed = new Set(prog.completedLessonIds || []);
      completed.add(currentLesson.value.id);
      saveStoredProgress(
        activeCourse.value.id,
        currentLesson.value.id,
        Array.from(completed),
      );
    }
    selectLesson(activeCourse.value.Lessons[currentLessonIndex.value + 1]);
  }
};

const markCurrentLessonDone = () => {
  if (!activeCourse.value || !currentLesson.value) return;
  const prog = getStoredProgress(activeCourse.value.id);
  const completed = new Set(prog.completedLessonIds || []);
  completed.add(currentLesson.value.id);
  saveStoredProgress(
    activeCourse.value.id,
    currentLesson.value.id,
    Array.from(completed),
  );
  toast.success("Урок пройден! Прогресс обновлен");
};

const getEmbedUrl = (url) => {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? `https://www.youtube.com/embed/${match[2]}`
    : url;
};

const startTest = () => {
  showTest.value = true;
};

const openStandaloneTest = (test) => {
  if (test.coin_price > 0 && !test.isOwned) return;
  activeTestId.value = test.id;
  showTest.value = true;
};

const buyTest = async (test) => {
  if (user.value.coins < test.coin_price) {
    toast.error(t("dashboard.notEnoughCoins"));
    return;
  }
  try {
    const res = await api.post("/tests/buy", { testId: test.id });
    toast.success(res.data.message);
    // Update local user and tests
    user.value.coins = res.data.coins;
    localStorage.setItem("user", JSON.stringify(user.value));
    fetchStandaloneTests();
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  }
};

const onTestCompleted = async () => {
  showTest.value = false;
  activeTestId.value = null;
  await fetchResults();
  await fetchStandaloneTests();
  await fetchUser();

  if (activeCourse.value) {
    const currentLessonId = currentLesson.value ? currentLesson.value.id : null;
    if (currentLessonId) {
      const prog = getStoredProgress(activeCourse.value.id);
      const completed = new Set(prog.completedLessonIds || []);
      completed.add(currentLessonId);
      saveStoredProgress(
        activeCourse.value.id,
        currentLessonId,
        Array.from(completed),
      );
    }
    await openCourse(activeCourse.value);

    if (currentLessonId) {
      const found = activeCourse.value.Lessons.find(
        (l) => l.id === currentLessonId,
      );
      if (found) {
        selectLesson(found);
      }
    }
  }
};

const onTestCancel = () => {
  showTest.value = false;
  activeTestId.value = null;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/");
};

const selectTariff = (id) => {
  selectedTariff.value = id;
};

const submitApp = async () => {
  if (!appPhone.value) {
    toast.error(t("tariffs.invalidPhone") || "Введите полный номер телефона в формате +7 (###) ### ## ##");
    return;
  }
  if (!isValidPhoneNumber(appPhone.value)) {
    toast.error(t("tariffs.invalidPhone") || "Введите полный номер телефона в формате +7 (###) ### ## ##");
    return;
  }
  await new Promise((r) => setTimeout(r, 1000));
  toast.success(t("tariffs.success") || "Заявка принята!");
  selectedTariff.value = null;
  appPhone.value = "";
  appComment.value = "";
};

const calculateNzm = () => {
  const total = Object.values(nzmValues).reduce(
    (a, b) => (Number(a) || 0) + (Number(b) || 0),
    0,
  );
  nzmResults.value = nzmSchools
    .map((school) => ({
      ...school,
      percentage: getNzmPercentage(total, school.totalMin),
    }))
    .sort((a, b) => b.percentage - a.percentage);
  calcShowResults.value = true;
};

const calculateBil = () => {
  const score = bilScoreValue.value;
  bilResults.value = bilSchools
    .map((school) => ({
      ...school,
      percentage: getBilPercentage(score, school.totalMin),
    }))
    .sort((a, b) => b.percentage - a.percentage);
  calcShowResults.value = true;
};

const getNzmPercentage = (score, min) => {
  const diff = score - min;
  if (diff >= 30) return 100;
  if (diff >= 25) return 90;
  if (diff >= 20) return 85;
  if (diff >= 15) return 80;
  if (diff >= 11) return 75;
  if (diff >= 6) return 70;
  if (diff >= 1) return 65;
  if (diff === 0) return 60;
  if (diff >= -5) return 50;
  if (diff >= -10) return 40;
  if (diff >= -15) return 30;
  if (diff >= -20) return 20;
  if (diff >= -25) return 10;
  if (diff >= -30) return 5;
  return 0;
};

const getBilPercentage = (score, min) => {
  const diff = score - min;
  if (diff >= 15) return 100;
  if (diff >= 12) return 90;
  if (diff >= 9) return 85;
  if (diff >= 6) return 80;
  if (diff >= 3) return 75;
  if (diff >= 1) return 70;
  if (diff === 0) return 60;
  if (diff >= -3) return 50;
  if (diff >= -6) return 40;
  if (diff >= -9) return 30;
  if (diff >= -11) return 20;
  if (diff >= -13) return 10;
  if (diff >= -15) return 5;
  return 0;
};

const getPercentageColor = (p) => {
  if (p >= 80) return "green";
  if (p >= 60) return "blue";
  if (p >= 40) return "orange";
  if (p >= 20) return "volcano";
  return "red";
};

onMounted(() => {
  fetchCourses();
  fetchResults();
  fetchStandaloneTests();
  window.addEventListener("resize", checkMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>

<style scoped>
.student-dashboard {
  display: flex;
  height: 100vh;
  background: var(--bg-color);
}
.sidebar {
  width: 260px;
  background: linear-gradient(180deg, var(--primary-color) 0%, #B51A71 100%);
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.mobile-header {
  display: none;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: white;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 0;
  z-index: 100;
}
.hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
}
.hamburger span {
  display: block;
  width: 25px;
  height: 3px;
  background-color: var(--primary-color);
  border-radius: 3px;
}
.mobile-logo {
  font-weight: 800;
  color: var(--primary-color);
}

@media (max-width: 992px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1001;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  .sidebar-open .sidebar {
    transform: translateX(0);
  }
  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }
  .mobile-header {
    display: flex;
  }
  .player-layout {
    display: flex;
    flex-direction: column;
    height: auto;
  }
  .video-area {
    order: 1;
    padding: 15px;
  }
  .lesson-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 280px;
    background: white;
    z-index: 2000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    margin-top: 0;
    max-height: none;
    display: flex;
    flex-direction: column;
    border-radius: 0;
  }
  .lesson-sidebar.mobile-open {
    transform: translateX(0);
  }

  .lesson-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1099;
  }

  .sidebar-header-mobile {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #eee;
  }
  .desktop-only {
    display: none;
  }

  .sidebar-title {
    border: none;
    padding: 0;
    margin: 0;
    font-size: 1rem;
  }
  .btn-close-drawer {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: #666;
  }

  .lesson-nav li {
    font-size: 0.9rem;
    padding: 12px 15px;
    margin-bottom: 4px;
  }
  .lesson-title {
    font-size: 1rem;
    margin-bottom: 12px;
    font-weight: 800;
    line-height: 1.3;
  }
  .btn-back {
    font-size: 0.75rem;
    padding: 6px 10px;
    margin-bottom: 10px;
  }

  .mobile-actions {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  .btn-back-lessons,
  .btn-toggle-lessons {
    font-size: 0.8rem;
    padding: 8px 12px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
  }
  .btn-back-lessons {
    background: #f0f9ff;
    color: var(--primary-color);
  }
  .btn-toggle-lessons {
    background: var(--primary-color);
    color: white;
  }
}

@media (max-width: 480px) {
  .content {
    padding: 15px;
  }
  .title-lg {
    font-size: 1.5rem;
  }
  .course-card {
    height: auto;
    min-height: 180px;
  }
  .video-area {
    padding: 15px;
  }
  .actions-bar {
    flex-direction: column;
  }
}

.logo-area {
  font-size: 1.4rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 40px;
  color: white;
}
.sidebar nav button {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  width: 100%;
  text-align: left;
  padding: 12px 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  font-weight: 500;
  transition: 0.3s;
}
.sidebar nav button:hover,
.sidebar nav button.active {
  background: white;
  color: var(--primary-color);
  transform: translateX(5px);
}
.btn-logout {
  background: rgba(0, 0, 0, 0.2);
  color: white;
  width: 100%;
  padding: 10px;
  border-radius: 8px;
}
.btn-logout:hover {
  background: #ff4d4d;
}

.coins-balance {
  margin: 20px 15px;
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 15px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}
.coin-icon {
  font-size: 1.2rem;
}
.coin-text {
  font-weight: 800;
  font-size: 1.1rem;
}

.btn-buy {
  background: #fdf2f2;
  color: #c2410c;
  border: 1px solid #fed7aa;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  margin-top: auto;
  transition: 0.2s;
}
.btn-buy:hover:not(:disabled) {
  background: #ffedd5;
  transform: translateY(-2px);
}
.btn-buy:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(1);
}

.info-banner {
  background: #fffbeb;
  color: #92400e;
  padding: 15px;
  border-radius: 12px;
  border: 1px solid #fcd34d;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
}

.content {
  flex: 1;
  padding: 30px;
  overflow-y: auto;
}
.title-lg {
  font-size: 2rem;
  margin-bottom: 25px;
  color: #333;
}
.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}
.course-card {
  background: white;
  border-radius: 12px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: transform 0.3s;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}
.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
.btn-start {
  background: transparent;
  color: var(--primary-color);
  font-weight: bold;
  text-align: right;
  margin-top: auto;
}

.player-layout {
  display: flex;
  gap: 30px;
  height: calc(100vh - 120px);
}
.lesson-sidebar {
  width: 320px;
  background: white;
  border-radius: 16px;
  padding: 24px;
  overflow-y: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}
.sidebar-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #1e293b;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 15px;
  margin-bottom: 20px;
}
.lesson-nav {
  list-style: none;
  padding: 0;
}
.lesson-nav li {
  padding: 14px 18px;
  cursor: pointer;
  border-radius: 12px;
  margin-bottom: 8px;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #475569;
  transition: all 0.2s;
  font-weight: 500;
}
.lesson-nav li:hover {
  background: #f5f5f5;
}
.lesson-nav li.active {
  background: var(--secondary-color);
  color: var(--primary-color);
  font-weight: 600;
}
.icon-play {
  font-size: 0.8rem;
}

.video-area {
  flex: 1;
  background: white;
  border-radius: 16px;
  padding: 30px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}
.mobile-actions {
  display: none;
}
@media (max-width: 992px) {
  .mobile-actions {
    display: flex;
  }
}

/* Base styles for desktop buttons if needed, but they are inside mobile-actions which is hidden on desktop */

.video-container {
  width: 100%;
  aspect-ratio: 16/9;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}
.video-container.secondary {
  aspect-ratio: 16/9;
  margin-top: 10px;
}
.actions-bar {
  display: flex;
  gap: 15px;
  margin-top: 10px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}
.btn-back {
  background: none;
  color: #666;
  margin-bottom: 15px;
  font-weight: 500;
}
.btn-back:hover {
  color: var(--primary-color);
}
.btn-primary.animate-pulse {
  animation: pulse 2s infinite;
}
.lesson-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
}
.video-block {
  margin-bottom: 30px;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
}
.styled-table th {
  text-align: left;
  padding: 15px;
  color: #777;
  border-bottom: 1px solid #eee;
}
.styled-table td {
  padding: 15px;
  border-bottom: 1px solid #eee;
}
.score-badge {
  font-weight: bold;
  color: var(--primary-color);
}

.fade-in {
  animation: fadeIn 0.5s ease;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(230, 45, 149, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(230, 45, 149, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(230, 45, 149, 0);
  }
}
.badge-blue {
  background: #fdf2f8;
  color: var(--primary-color);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}
.mb-4 {
  margin-bottom: 1rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mt-4 {
  margin-top: 1rem;
}
.pt-4 {
  padding-top: 1rem;
}
.border-t {
  border-top: 1px solid #eee;
}
.text-sm {
  font-size: 0.875rem;
}
.text-gray-500 {
  color: #6b7280;
}
.font-bold {
  font-weight: 700;
}
.text-lg {
  font-size: 1.125rem;
}
.btn-disabled {
  background: #e0e0e0;
  color: #999;
  border: 1px solid #ccc;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: not-allowed;
}

.pricing-item {
  transition: transform 0.3s;
  border: 2px solid transparent !important;
}
.pricing-item:hover {
  transform: translateY(-5px);
}
.pricing-item.active {
  border-color: #ff2e93 !important;
  background: #fff5f9;
}
.pricing-item.popular.active {
  border-color: #ff2e93 !important;
}

.tab-btn {
  background: none;
  border: none;
  padding: 10px 20px;
  font-weight: 700;
  color: #94a3b8;
  cursor: pointer;
  border-radius: 10px;
  transition: 0.3s;
}
.tab-btn.active {
  background: var(--primary-color);
  color: white;
}

.tag {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  display: inline-block;
}
.tag.green {
  background: #dcfce7;
  color: #166534;
}
.tag.blue {
  background: #fdf2f8;
  color: var(--primary-color);
}
.tag.orange {
  background: #ffedd5;
  color: #9a3412;
}
.tag.volcano {
  background: #fee2e2;
  color: #991b1b;
}

/* Materials */
.materials-section {
  margin-top: 35px;
  margin-bottom: 35px;
  padding-top: 25px;
  border-top: 1px solid #f1f5f9;
}
.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 15px;
}
.material-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.material-item:hover {
  border-color: #ff2e93;
  background: #fff5f9;
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(255, 46, 147, 0.15);
}
.material-icon {
  font-size: 1.8rem;
  background: white;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}
.material-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.material-name {
  font-weight: 700;
  color: #1e293b;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}
.material-ext {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.mb-6 {
  margin-bottom: 2.5rem;
}
.tag.red {
  background: #fef2f2;
  color: #dc2626;
}

/* Course Progress on Cards */
.course-card-progress {
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
}
.progress-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.progress-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
}
.progress-pct {
  font-size: 0.85rem;
  font-weight: 800;
  color: #ff2e93;
}
.progress-track-sm {
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 6px;
}
.progress-fill-sm {
  height: 100%;
  background: linear-gradient(90deg, #ff2e93, #ff007a);
  border-radius: 10px;
  transition: width 0.4s ease;
}
.progress-count-text {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

/* Course Player Banner */
.course-progress-banner {
  background: white;
  padding: 18px 24px;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  border: 1px solid #e2e8f0;
}
.progress-banner-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}
.resume-badge {
  display: inline-block;
  background: #fdf2f8;
  color: #be185d;
  border: 1px solid #fbcfe8;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-bottom: 6px;
}
.course-player-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}
.banner-pct-box {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.banner-pct-num {
  font-size: 1.6rem;
  font-weight: 800;
  color: #ff2e93;
  line-height: 1;
}
.banner-pct-sub {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
  margin-top: 4px;
}
.progress-track {
  width: 100%;
  height: 8px;
  background: #f1f5f9;
  border-radius: 10px;
  overflow: hidden;
}
.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff2e93, #ff007a);
  border-radius: 10px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Lesson Nav List Items */
.lesson-nav li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  color: #334155;
  font-weight: 500;
  margin-bottom: 6px;
  position: relative;
}
.lesson-nav li:hover {
  background: #fff5f9;
  color: #ff2e93;
}
.lesson-nav li.active {
  background: #fff0f6;
  color: #ff2e93;
  font-weight: 700;
}
.lesson-nav li.completed:not(.active) {
  color: #475569;
}
.lesson-marker {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  flex-shrink: 0;
  transition: all 0.2s;
}
.marker-current {
  background: #ff2e93;
  color: white;
}
.marker-done {
  background: #10b981;
  color: white;
}
.lesson-title-text {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.badge-done-check {
  font-size: 0.85rem;
  color: #10b981;
  font-weight: 800;
}

/* Lesson Navigation Footer */
.lesson-nav-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}
.btn-nav-step {
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
}
.btn-mark-done {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-mark-done:hover {
  background: #d1fae5;
  border-color: #6ee7b7;
}

/* Video Player Container */
.video-container {
  position: relative;
  width: 100%;
  max-width: 100%;
  aspect-ratio: 16/9;
  border-radius: 14px;
  overflow: hidden;
  background: #090c15;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

/* Mobile Player Adaptations */
@media (max-width: 768px) {
  .player-layout {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  .lesson-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 290px;
    max-width: 85vw;
    z-index: 1050;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    border-radius: 0;
    overflow-y: auto;
    background: white;
    padding: 24px 16px;
    box-shadow: 10px 0 30px rgba(0, 0, 0, 0.2);
  }
  .lesson-sidebar.mobile-open {
    transform: translateX(0);
  }
  .lesson-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    z-index: 1049;
    backdrop-filter: blur(4px);
  }
  .lesson-nav-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .btn-nav-step, .btn-mark-done {
    width: 100%;
    text-align: center;
    justify-content: center;
  }
  .content {
    padding: 16px 12px;
  }
}

.badge-nis {
  background: #ede9fe;
  color: #5b21b6;
  border: 1px solid #c4b5fd;
  font-weight: 700;
  font-size: 0.78rem;
  padding: 3px 8px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.badge-bil {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
  font-weight: 700;
  font-size: 0.78rem;
  padding: 3px 8px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.nis-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.76rem;
  font-weight: 700;
}

.nis-badge.badge-standard {
  background: #fdf2f8;
  color: #db2777;
  border: 1px solid #fbcfe8;
}

.nis-badge.badge-sandyk {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}
</style>
