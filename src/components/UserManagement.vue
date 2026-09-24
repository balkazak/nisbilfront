<template>
  <div>
    <div class="flex justify-between items-center header-section">
      <h2 class="title-lg">{{ t("userManagement.title") }}</h2>
      <div class="flex gap-4 items-center flex-wrap">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            :placeholder="t('userManagement.search')"
            class="search-input"
          />
        </div>
        <!-- Filter by Role -->
        <select v-model="filterRole" class="filter-select">
          <option value="">{{ t("userManagement.filterRole") }}</option>
          <option value="student">{{ t("admin.role.student") }}</option>
          <option value="curator">{{ t("admin.role.curator") }}</option>
          <option value="operator">{{ t("admin.role.operator") }}</option>
          <option value="admin">{{ t("admin.role.admin") }}</option>
        </select>
        <!-- Filter by Group -->
        <select v-model="filterGroup" class="filter-select">
          <option value="">{{ t("userManagement.filterGroup") }}</option>
          <option v-for="g in availableGroups" :key="g.id" :value="g.id">
            {{ g.name }}
          </option>
        </select>
        <button
          v-if="canAddUser"
          @click="openAddModal"
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
            <th>{{ t("userManagement.thPhone") }}</th>
            <th>{{ t("userManagement.thRole") }}</th>
            <th>{{ t("userManagement.thGroup") }}</th>
            <th class="text-right">{{ t("userManagement.thActions") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in filteredUsers" :key="u.id">
            <td class="font-bold">{{ u.username }}</td>
            <td>
              <a v-if="u.phone" :href="'tel:' + u.phone" class="phone-chip" title="Позвонить">
                📞 {{ u.phone }}
              </a>
              <span v-else class="text-muted text-sm">—</span>
            </td>
            <td>
              <span :class="'role-tag ' + u.role">{{
                translateRole(u.role)
              }}</span>
            </td>
            <td>
              <!-- If Student -->
              <span v-if="u.role === 'student' && u.group" class="badge group-badge">
                🏫 {{ u.group.name }}
              </span>
              <!-- If Curator -->
              <div
                v-else-if="(u.role === 'curator' || u.role === 'teacher') && u.curatedGroups && u.curatedGroups.length > 0"
                class="badge-list"
              >
                <span
                  v-for="cg in u.curatedGroups"
                  :key="cg.id"
                  class="badge group-badge"
                >
                  🏫 {{ cg.name }}
                </span>
              </div>
              <span v-else class="text-muted">—</span>
            </td>
            <td class="text-right">
              <button
                v-if="u.role === 'student' && currentUser.role === 'admin'"
                @click="openAccessDetails(u)"
                class="btn-xs btn-outline"
              >
                {{ t("userManagement.accessBtn") }}
              </button>
              <button
                v-if="canEdit(u)"
                @click="openEditModal(u)"
                class="btn-xs btn-outline-edit ml-2"
                :title="t('userManagement.editBtn')"
              >
                ✏️
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
    <div v-if="showAddForm" class="modal-overlay" @click.self="showAddForm = false">
      <div class="card modal animate-zoom-in">
        <h3>{{ t("userManagement.newTitle") }}</h3>
        <form @submit.prevent="addUser">
          <div class="form-group">
            <label>{{ t("userManagement.loginLabel") }} *</label>
            <input
              v-model="newUser.username"
              :placeholder="t('userManagement.loginLabel')"
              class="input-field"
              required
            />
          </div>
          <div class="form-group">
            <label>{{ t("userManagement.passwordLabel") }} *</label>
            <input
              v-model="newUser.password"
              type="password"
              :placeholder="t('userManagement.passwordLabel')"
              class="input-field"
              required
            />
          </div>
          <div class="form-group">
            <label>📞 {{ t("userManagement.phoneLabel") }}</label>
            <input
              v-model="newUser.phone"
              type="tel"
              :placeholder="t('userManagement.phonePlaceholder')"
              class="input-field"
            />
          </div>
          <div class="form-group">
            <label>{{ t("userManagement.roleLabel") }}</label>
            <select v-model="newUser.role" class="input-field">
              <option value="student">{{ t("admin.role.student") }}</option>
              <option
                v-if="currentUser.role === 'admin' || currentUser.role === 'operator'"
                value="curator"
              >
                {{ t("admin.role.curator") }}
              </option>
              <option v-if="currentUser.role === 'admin'" value="operator">
                {{ t("admin.role.operator") }}
              </option>
              <option v-if="currentUser.role === 'admin'" value="admin">
                {{ t("admin.role.admin") }}
              </option>
            </select>
          </div>

          <!-- Group selection for Student -->
          <div v-if="newUser.role === 'student'" class="form-group">
            <label>{{ t("userManagement.studentGroupLabel") }}</label>
            <select v-model="newUser.groupId" class="input-field">
              <option :value="null">{{ t("userManagement.noGroupSelected") }}</option>
              <option v-for="g in availableGroups" :key="g.id" :value="g.id">
                {{ g.name }}
              </option>
            </select>
          </div>

          <!-- Curated Groups for Curator -->
          <div
            v-if="newUser.role === 'curator'"
            class="form-group"
          >
            <label>{{ t("userManagement.curatorGroupsLabel") }}</label>
            <div v-if="availableGroups.length === 0" class="text-muted text-sm">
              Группы еще не созданы
            </div>
            <div v-else class="checkbox-group-container">
              <label
                v-for="g in availableGroups"
                :key="g.id"
                class="checkbox-item"
              >
                <input
                  type="checkbox"
                  :value="g.id"
                  v-model="newUser.curatedGroupIds"
                />
                <span>{{ g.name }}</span>
              </label>
            </div>
          </div>

          <div class="flex gap-2 mt-4 justify-end">
            <button
              type="button"
              @click="showAddForm = false"
              class="btn-secondary"
            >
              {{ t("userManagement.cancelBtn") }}
            </button>
            <button type="submit" class="btn-primary">
              {{ t("userManagement.createBtn") }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="card modal animate-zoom-in">
        <h3>{{ t("userManagement.editTitle") }}: {{ editingUser?.username }}</h3>
        <form @submit.prevent="saveEditUser">
          <div class="form-group">
            <label>{{ t("userManagement.loginLabel") }} *</label>
            <input
              v-model="editForm.username"
              class="input-field"
              required
            />
          </div>
          <div class="form-group">
            <label>{{ t("userManagement.passwordLabel") }} (оставьте пустым, если не меняется)</label>
            <input
              v-model="editForm.password"
              type="password"
              placeholder="Новый пароль"
              class="input-field"
            />
          </div>
          <div class="form-group">
            <label>📞 {{ t("userManagement.phoneLabel") }}</label>
            <input
              v-model="editForm.phone"
              type="tel"
              :placeholder="t('userManagement.phonePlaceholder')"
              class="input-field"
            />
          </div>
          <div class="form-group">
            <label>{{ t("userManagement.roleLabel") }}</label>
            <select v-model="editForm.role" class="input-field">
              <option value="student">{{ t("admin.role.student") }}</option>
              <option
                v-if="currentUser.role === 'admin' || currentUser.role === 'operator'"
                value="curator"
              >
                {{ t("admin.role.curator") }}
              </option>
              <option v-if="currentUser.role === 'admin'" value="operator">
                {{ t("admin.role.operator") }}
              </option>
              <option v-if="currentUser.role === 'admin'" value="admin">
                {{ t("admin.role.admin") }}
              </option>
            </select>
          </div>

          <!-- Group selection for Student -->
          <div v-if="editForm.role === 'student'" class="form-group">
            <label>{{ t("userManagement.studentGroupLabel") }}</label>
            <select v-model="editForm.groupId" class="input-field">
              <option :value="null">{{ t("userManagement.noGroupSelected") }}</option>
              <option v-for="g in availableGroups" :key="g.id" :value="g.id">
                {{ g.name }}
              </option>
            </select>
          </div>

          <!-- Curated Groups for Curator -->
          <div
            v-if="editForm.role === 'curator' || editForm.role === 'teacher'"
            class="form-group"
          >
            <label>{{ t("userManagement.curatorGroupsLabel") }}</label>
            <div v-if="availableGroups.length === 0" class="text-muted text-sm">
              Группы еще не созданы
            </div>
            <div v-else class="checkbox-group-container">
              <label
                v-for="g in availableGroups"
                :key="g.id"
                class="checkbox-item"
              >
                <input
                  type="checkbox"
                  :value="g.id"
                  v-model="editForm.curatedGroupIds"
                />
                <span>{{ g.name }}</span>
              </label>
            </div>
          </div>

          <div class="flex gap-2 mt-4 justify-end">
            <button
              type="button"
              @click="showEditModal = false"
              class="btn-secondary"
            >
              {{ t("userManagement.cancelBtn") }}
            </button>
            <button type="submit" class="btn-primary">
              {{ t("groupManagement.saveBtn") }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Access Control Modal (Admin only) -->
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
                  <span>{{ course.title }}</span>
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
                  <span>{{ test.title }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showAccessModal = false" class="btn-secondary">
            {{ t("userManagement.cancelBtn") }}
          </button>
          <button @click="saveAccess" class="btn-primary">
            {{ t("userManagement.saveAccessBtn") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import api from "../api";
import { useLanguage } from "../composables/useLanguage";
import { useToast } from "../composables/useToast";

const { t } = useLanguage();
const toast = useToast();

const users = ref([]);
const availableGroups = ref([]);
const showAddForm = ref(false);
const showEditModal = ref(false);
const editingUser = ref(null);

const currentUser = ref(JSON.parse(localStorage.getItem("user") || "{}"));

const newUser = reactive({
  username: "",
  password: "",
  phone: "",
  role: "student",
  groupId: null,
  curatedGroupIds: []
});

const editForm = reactive({
  id: null,
  username: "",
  password: "",
  phone: "",
  role: "student",
  groupId: null,
  curatedGroupIds: []
});

// Access Modal
const showAccessModal = ref(false);
const selectedUser = ref(null);
const availableCourses = ref([]);
const availableTests = ref([]);
const selectedCourseIds = ref([]);
const selectedTestIds = ref([]);

const searchQuery = ref("");
const filterRole = ref("");
const filterGroup = ref("");

const canAddUser = computed(() => {
  const role = currentUser.value.role;
  return role === "admin" || role === "operator" || role === "curator" || role === "teacher";
});

const filteredUsers = computed(() => {
  let list = users.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter((u) => u.username.toLowerCase().includes(q));
  }
  if (filterRole.value) {
    list = list.filter((u) => u.role === filterRole.value);
  }
  if (filterGroup.value) {
    const gId = Number(filterGroup.value);
    list = list.filter((u) => {
      if (u.role === "student") return u.groupId === gId;
      if (u.curatedGroups && u.curatedGroups.length > 0) {
        return u.curatedGroups.some((g) => g.id === gId);
      }
      return false;
    });
  }
  return list;
});

const fetchUsers = async () => {
  try {
    const res = await api.get("/users");
    users.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

const fetchGroups = async () => {
  try {
    const res = await api.get("/groups");
    availableGroups.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

const openAddModal = () => {
  newUser.username = "";
  newUser.password = "";
  newUser.phone = "";
  newUser.role = "student";
  newUser.groupId = null;
  newUser.curatedGroupIds = [];
  showAddForm.value = true;
};

const openEditModal = (u) => {
  editingUser.value = u;
  editForm.id = u.id;
  editForm.username = u.username || "";
  editForm.password = "";
  editForm.phone = u.phone || "";
  editForm.role = u.role === "teacher" ? "curator" : u.role;
  editForm.groupId = u.groupId || null;
  editForm.curatedGroupIds = u.curatedGroups ? u.curatedGroups.map((g) => g.id) : [];
  showEditModal.value = true;
};

const addUser = async () => {
  try {
    await api.post("/users", newUser);
    showAddForm.value = false;
    await fetchUsers();
    toast.success(t("userManagement.successCreated"));
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  }
};

const saveEditUser = async () => {
  try {
    await api.put(`/users/${editForm.id}`, {
      username: editForm.username,
      password: editForm.password ? editForm.password : undefined,
      phone: editForm.phone,
      role: editForm.role,
      groupId: editForm.role === "student" ? editForm.groupId : null,
      curatedGroupIds: (editForm.role === "curator" || editForm.role === "teacher") ? editForm.curatedGroupIds : []
    });
    showEditModal.value = false;
    await fetchUsers();
    toast.success("Пользователь успешно обновлен");
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
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
    selectedCourseIds.value = accessRes.data.courses || [];
    selectedTestIds.value = accessRes.data.tests || [];
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

const canEdit = (u) => {
  if (currentUser.value.role === "admin") return true;
  if (currentUser.value.role === "operator") {
    return u.role === "student" || u.role === "curator" || u.role === "teacher";
  }
  return false;
};

const canDelete = (u) => {
  if (u.username === "admin") return false;
  if (currentUser.value.role === "admin") return true;
  if (currentUser.value.role === "operator") {
    return u.role === "student" || u.role === "curator" || u.role === "teacher";
  }
  return false;
};

const handleDelete = async (u) => {
  if (!confirm(`${t("userManagement.confirmDelete")} ${u.username}?`)) return;
  try {
    await api.delete(`/users/${u.id}`);
    await fetchUsers();
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  }
};

onMounted(() => {
  fetchUsers();
  fetchGroups();
});
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
  padding-left: 36px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  padding-top: 8px;
  padding-bottom: 8px;
  font-size: 0.9rem;
  width: 200px;
  transition: all 0.2s;
}
.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  width: 240px;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 0.875rem;
  background-color: #fff;
  color: #334155;
  cursor: pointer;
}
.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}
.styled-table {
  width: 100%;
  border-collapse: collapse;
}
.styled-table th,
.styled-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
}
.styled-table th {
  background-color: #f8fafc;
  color: #64748b;
  font-weight: 600;
}
.role-tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}
.role-tag.admin {
  background: #fee2e2;
  color: #dc2626;
}
.role-tag.operator {
  background: #fef3c7;
  color: #b45309;
}
.role-tag.curator,
.role-tag.teacher {
  background: #e0e7ff;
  color: #4338ca;
}
.role-tag.student {
  background: #ecfdf5;
  color: #047857;
}

.badge-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}
.group-badge {
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #e2e8f0;
}

.btn-xs {
  padding: 4px 8px;
  font-size: 0.8rem;
  border-radius: 4px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline {
  border-color: #3b82f6;
  color: #3b82f6;
  background: transparent;
}
.btn-outline:hover {
  background: #3b82f6;
  color: white;
}
.btn-outline-edit {
  border-color: #94a3b8;
  color: #475569;
  background: #f8fafc;
}
.btn-outline-edit:hover {
  background: #e2e8f0;
}
.btn-outline-danger {
  border-color: #ef4444;
  color: #ef4444;
  background: transparent;
}
.btn-outline-danger:hover {
  background: #ef4444;
  color: white;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
.btn-secondary:hover {
  background: #e2e8f0;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}
.modal {
  width: 90%;
  max-width: 440px;
  padding: 24px;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}
.modal h3 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 1.25rem;
  color: #1e293b;
}

.form-group {
  margin-bottom: 14px;
}
.form-group label {
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  color: #475569;
  margin-bottom: 4px;
}

.checkbox-group-container {
  max-height: 120px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.checkbox-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 0.85rem;
}

.modal-wide {
  width: 700px;
  max-width: 90%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  background: white;
  border-radius: 12px;
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}
.btn-close:hover {
  color: #333;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.flex-row {
  display: flex;
  gap: 24px;
}
.access-column {
  flex: 1;
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  max-height: 400px;
  overflow-y: auto;
}
.access-column h4 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #334155;
  border-bottom: 1px solid #cbd5e1;
  padding-bottom: 8px;
}

.check-item {
  margin-bottom: 8px;
}
.check-item label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #334155;
}
.check-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #3b82f6;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #f8fafc;
}

.ml-2 {
  margin-left: 8px;
}
.text-right {
  text-align: right;
}
.text-muted {
  color: #94a3b8;
}
.text-sm {
  font-size: 0.8rem;
}
.font-bold {
  font-weight: 600;
}
.justify-end {
  justify-content: flex-end;
}
</style>
