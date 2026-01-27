<template>
  <div>
    <div class="flex justify-between items-center header-section">
      <h2 class="title-lg">{{ t("userManagement.title") }}</h2>
      <div class="flex gap-4 items-center">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            :placeholder="t('userManagement.search')"
            class="search-input"
          />
        </div>
        <button
          v-if="canAddUser"
          @click="showAddForm = true"
          class="btn-primary"
        >
          + {{ t("userManagement.addBtn") }}
        </button>
      </div>
    </div>

    <!-- User List -->
    <div class="table-container">
      <table class="styled-table">
        <thead>
          <tr>
            <th>{{ t("userManagement.thLogin") }}</th>
            <th>{{ t("userManagement.thRole") }}</th>
            <th>{{ t("userManagement.thActions") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in filteredUsers" :key="u.id">
            <td>{{ u.username }}</td>
            <td>
              <span :class="'role-tag ' + u.role">{{
                translateRole(u.role)
              }}</span>
            </td>
            <td>
              <button
                v-if="u.role === 'student' && currentUser.role === 'admin'"
                @click="openAccessDetails(u)"
                class="btn-xs btn-outline"
              >
                {{ t("userManagement.accessBtn") }}
              </button>
              <button
                v-if="canDelete(u)"
                @click="handleDelete(u)"
                class="btn-xs btn-outline-danger ml-2"
                :title="t('userManagement.deleteBtn')"
              >
                ✕
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add User Modal -->
    <div v-if="showAddForm" class="modal-overlay">
      <div class="card modal animate-zoom-in">
        <h3>{{ t("userManagement.newTitle") }}</h3>
        <form @submit.prevent="addUser">
          <div class="form-group">
            <label>{{ t("userManagement.loginLabel") }}</label>
            <input
              v-model="newUser.username"
              :placeholder="t('userManagement.loginLabel')"
              class="input-field"
              required
            />
          </div>
          <div class="form-group">
            <label>{{ t("userManagement.passwordLabel") }}</label>
            <input
              v-model="newUser.password"
              type="password"
              :placeholder="t('userManagement.passwordLabel')"
              class="input-field"
              required
            />
          </div>
          <div class="form-group">
            <label>{{ t("userManagement.roleLabel") }}</label>
            <select v-model="newUser.role" class="input-field">
              <option value="student">{{ t("admin.role.student") }}</option>
              <option v-if="currentUser.role === 'admin'" value="teacher">
                {{ t("admin.role.teacher") }}
              </option>
              <option v-if="currentUser.role === 'admin'" value="admin">
                {{ t("admin.role.admin") }}
              </option>
            </select>
          </div>
          <div class="flex gap-2 mt-4">
            <button type="submit" class="btn-primary">
              {{ t("userManagement.createBtn") }}
            </button>
            <button
              type="button"
              @click="showAddForm = false"
              class="btn-secondary"
            >
              {{ t("userManagement.cancelBtn") }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Access Control Modal -->
    <div v-if="showAccessModal" class="modal-overlay">
      <div class="card modal-wide animate-zoom-in">
        <div class="modal-header">
          <h3>
            {{ t("userManagement.accessTitle") }}: {{ selectedUser?.username }}
          </h3>
          <button @click="showAccessModal = false" class="btn-close">
            &times;
          </button>
        </div>
        <div class="modal-body">
          <div class="flex-row">
            <!-- Courses -->
            <div class="access-column">
              <h4>📚 {{ t("userManagement.coursesTitle") }}</h4>
              <p v-if="availableCourses.length === 0" class="text-muted">
                {{ t("userManagement.noCourses") }}
              </p>
              <div
                v-for="course in availableCourses"
                :key="course.id"
                class="check-item"
              >
                <label>
                  <input
                    type="checkbox"
                    :value="course.id"
                    v-model="selectedCourseIds"
                  />
                  {{ course.title }}
                </label>
              </div>
            </div>

            <!-- Standalone Tests -->
            <div class="access-column">
              <h4>📝 {{ t("userManagement.testsTitle") }}</h4>
              <p v-if="availableTests.length === 0" class="text-muted">
                {{ t("userManagement.noTests") }}
              </p>
              <div
                v-for="test in availableTests"
                :key="test.id"
                class="check-item"
              >
                <label>
                  <input
                    type="checkbox"
                    :value="test.id"
                    v-model="selectedTestIds"
                  />
                  {{ test.title }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="saveAccess" class="btn-primary">
            {{ t("userManagement.saveBtn") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import api from "../api";
import { useToast } from "../composables/useToast";
import { useLanguage } from "../composables/useLanguage";

const toast = useToast();
const { t } = useLanguage();

const users = ref([]);
const showAddForm = ref(false);
const showAccessModal = ref(false);
const currentUser = ref(JSON.parse(localStorage.getItem("user") || "{}"));
const newUser = reactive({ username: "", password: "", role: "student" });
const selectedUser = ref(null);
const availableCourses = ref([]);
const availableTests = ref([]);
const selectedCourseIds = ref([]);
const selectedTestIds = ref([]);
const searchQuery = ref("");

const canAddUser = computed(() => true);

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const q = searchQuery.value.toLowerCase();
  return users.value.filter((u) => u.username.toLowerCase().includes(q));
});

const fetchUsers = async () => {
  try {
    const res = await api.get("/users");
    users.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

const addUser = async () => {
  try {
    await api.post("/users", newUser);
    showAddForm.value = false;
    fetchUsers();
    newUser.username = "";
    newUser.password = "";
    newUser.role = "student";
    toast.success(t("userManagement.successCreated"));
  } catch (err) {
    toast.error(err.response?.data?.message || "Error");
  }
};

const translateRole = (role) => {
  return t(`admin.role.${role}`) || role;
};

const openAccessDetails = async (user) => {
  if (user.role !== "student") return;
  selectedUser.value = user;
  showAccessModal.value = true;

  const [coursesRes, testsRes] = await Promise.all([
    api.get("/courses"),
    api.get("/tests?is_standalone=true"),
  ]);
  availableCourses.value = coursesRes.data;
  availableTests.value = testsRes.data;

  try {
    const accessRes = await api.get(`/users/${user.id}/access`);
    selectedCourseIds.value = accessRes.data.courses;
    selectedTestIds.value = accessRes.data.tests;
  } catch (err) {
    console.error("Error fetching access", err);
    selectedCourseIds.value = [];
    selectedTestIds.value = [];
  }
};

const saveAccess = async () => {
  try {
    await api.post(`/users/${selectedUser.value.id}/access`, {
      courseIds: selectedCourseIds.value,
      testIds: selectedTestIds.value,
    });
    toast.success(t("userManagement.successAccess"));
    showAccessModal.value = false;
  } catch (err) {
    toast.error("Error: " + err.message);
  }
};

const canDelete = (u) => {
  if (u.username === "admin") return false;
  if (currentUser.value.role === "admin") return true;
  // Teachers cannot delete anyone based on "only add" rule
  return false;
};

const handleDelete = async (u) => {
  if (!confirm(`${t("userManagement.confirmDelete")} ${u.username}?`)) return;
  try {
    await api.delete(`/users/${u.id}`);
    fetchUsers();
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  }
};

onMounted(fetchUsers);
</script>

<style scoped>
.header-section {
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}
.title-lg {
  font-size: 1.5rem;
  color: #333;
  margin: 0;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 12px;
  color: #94a3b8;
  font-size: 0.9rem;
  pointer-events: none;
}
.search-input {
  padding: 10px 15px 10px 35px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  font-size: 0.9rem;
  width: 250px;
  transition: all 0.2s;
}
.search-input:focus {
  outline: none;
  border-color: #00bfff;
  box-shadow: 0 0 0 3px rgba(0, 191, 255, 0.1);
  width: 300px;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}
.styled-table {
  width: 100%;
  border-collapse: collapse;
}
.styled-table th {
  background: #f8f9fa;
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #555;
}
.styled-table td {
  padding: 15px;
  border-bottom: 1px solid #eee;
}
.styled-table tr:last-child td {
  border-bottom: none;
}
.role-tag {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}
.role-tag.admin {
  background: #e3f2fd;
  color: #1976d2;
}
.role-tag.teacher {
  background: #e8f5e9;
  color: #388e3c;
}
.role-tag.student {
  background: #fff3e0;
  color: #f57c00;
}
.btn-secondary {
  background: #f0f0f0;
  color: #333;
}
.btn-secondary:hover {
  background: #e0e0e0;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal {
  width: 350px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 20px;
}
.modal-wide {
  width: 700px;
  padding: 25px;
  display: flex;
  flex-direction: column;
  height: 70vh;
  background: white;
  border-radius: 20px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  margin-bottom: 15px;
}
.modal-body {
  flex: 1;
  overflow-y: auto;
}
.modal-footer {
  margin-top: 20px;
  text-align: right;
}

.flex-row {
  display: flex;
  gap: 30px;
  height: 100%;
}
.access-column {
  flex: 1;
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 8px;
  overflow-y: auto;
  background: #fafafa;
}
.access-column h4 {
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
  color: #444;
}

.check-item {
  margin-bottom: 8px;
  padding: 8px;
  background: white;
  border-radius: 6px;
  border: 1px solid #eee;
  transition: 0.2s;
}
.check-item:hover {
  border-color: #b3e5fc;
}
.check-item label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: 100%;
  font-size: 0.95rem;
}

.btn-xs {
  width: auto;
  min-width: 36px;
  height: 36px;
  border-radius: 18px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.2s;
  flex-shrink: 0;
  font-size: 0.8rem;
  padding: 0 10px;
}
.btn-xs:hover {
  background: #f0f9ff;
  border-color: #00bfff;
  color: #00bfff;
}
.btn-outline-danger {
  color: #d32f2f;
  border-color: #ffcdd2;
}
.btn-outline-danger:hover {
  background: #ffebee;
  border-color: #ef5350;
}
.btn-close {
  border: none;
  background: none;
  width: 36px;
  height: 36px;
  font-size: 1.5rem;
  cursor: pointer;
  color: #777;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}
.btn-close:hover {
  background: #f5f5f5;
  color: #333;
}
.text-muted {
  color: #999;
  font-size: 0.85rem;
}

.animate-zoom-in {
  animation: zoomIn 0.3s ease-out;
}
@keyframes zoomIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .modal {
    width: 95%;
    padding: 15px;
  }
  .modal-wide {
    width: 95%;
    height: 90vh;
  }
  .role-tag {
    font-size: 0.7rem;
    padding: 2px 6px;
  }
  .flex-row {
    flex-direction: column;
  }
}
</style>
