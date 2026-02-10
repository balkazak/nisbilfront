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
              <p>{{ course.description }}</p>
            </div>
            <button class="btn-start">
              {{ t("dashboard.startBtn") }} &rarr;
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
              <div style="margin-top: 10px">
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
                v-for="lesson in activeCourse.Lessons"
                :key="lesson.id"
                :class="{ active: currentLesson?.id === lesson.id }"
                @click="
                  currentLesson = lesson;
                  showTest = false;
                "
              >
                <span class="icon-play">▶</span>
                {{ lesson.title }}
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
              <h3 class="lesson-title mb-4">{{ currentLesson.title }}</h3>
              <div
                v-for="(url, index) in currentLesson.video_urls"
                :key="'vid-' + index"
                class="video-block mb-4"
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
              </tr>
            </thead>
            <tbody>
              <tr v-for="res in myResults" :key="res.id">
                <td>{{ res.Test.title }}</td>
                <td>
                  <span class="score-badge"
                    >{{ res.score }} / {{ res.max_score }}</span
                  >
                </td>
                <td>{{ new Date(res.createdAt).toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
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
            <h3 style="margin-bottom: 5px; font-size: 1.1rem">
              {{ plan.name }}
            </h3>
            <div
              style="
                font-size: 0.8rem;
                text-decoration: line-through;
                color: #ef4444;
                margin-bottom: 2px;
              "
              v-if="plan.originalPrice"
            >
              {{ plan.originalPrice.toLocaleString() }}
              {{ t("tariffs.currency") }}
            </div>
            <div
              style="
                font-size: 1.3rem;
                font-weight: 800;
                color: #00bfff;
                margin-bottom: 10px;
              "
            >
              {{ plan.price.toLocaleString() }} {{ t("tariffs.currency") }}
            </div>
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
              @input="handlePhoneInput"
              placeholder="+7 (700) 000-00-00"
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
                background: #00bfff;
                border: none;
                padding: 12px;
                font-weight: bold;
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

const router = useRouter();
const toast = useToast();
const { t, tm, format } = useLanguage();

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

const openCourse = async (course) => {
  const res = await api.get(`/courses/${course.id}`);
  activeCourse.value = res.data;
  if (activeCourse.value.Lessons.length > 0) {
    currentLesson.value = activeCourse.value.Lessons[0];
  }
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
    await openCourse(activeCourse.value);

    if (currentLessonId) {
      const found = activeCourse.value.Lessons.find(
        (l) => l.id === currentLessonId,
      );
      if (found) {
        currentLesson.value = found;
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

const handlePhoneInput = (e) => {
  let value = e.target.value.replace(/\D/g, "");
  if (value.startsWith("7")) value = value.slice(1);

  let formatted = "+7 ";
  if (value.length > 0) formatted += "(" + value.substring(0, 3);
  if (value.length >= 4) formatted += ") " + value.substring(3, 6);
  if (value.length >= 7) formatted += "-" + value.substring(6, 8);
  if (value.length >= 9) formatted += "-" + value.substring(8, 10);

  appPhone.value = formatted.trim();
  e.target.value = appPhone.value;
};

const submitApp = async () => {
  if (!appPhone.value) {
    toast.error(t("tariffs.errorPhone") || "Введите номер телефона");
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
  background: linear-gradient(180deg, var(--primary-color) 0%, #009acd 100%);
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
  gap: 20px;
  height: calc(100vh - 100px);
}
.lesson-sidebar {
  width: 300px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  overflow-y: auto;
}
.sidebar-title {
  font-size: 1.1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 10px;
}
.lesson-nav {
  list-style: none;
  padding: 0;
}
.lesson-nav li {
  padding: 12px;
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 5px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
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
  border-radius: 12px;
  padding: 25px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
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
    box-shadow: 0 0 0 0 rgba(0, 191, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 191, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 191, 255, 0);
  }
}
.badge-blue {
  background: #e3f2fd;
  color: #1565c0;
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
  border-color: #00bfff !important;
  background: #f0f9ff;
}
.pricing-item.popular.active {
  border-color: #00bfff !important;
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
  background: #e0f2fe;
  color: #0369a1;
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
.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}
.material-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  background: white;
  border: 1px solid #eee;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s;
}
.material-item:hover {
  border-color: #00bfff;
  background: #f0f9ff;
  transform: translateY(-2px);
}
.material-icon {
  font-size: 1.5rem;
}
.material-info {
  display: flex;
  flex-direction: column;
}
.material-name {
  font-weight: 600;
  color: #334155;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}
.material-ext {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 700;
}
.tag.red {
  background: #fef2f2;
  color: #dc2626;
}
</style>
