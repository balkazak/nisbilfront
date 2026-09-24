<template>
  <div class="group-management">
    <!-- VIEW 1: GROUPS LIST -->
    <div v-if="currentView === 'list'" class="fade-in">
      <div class="header-actions">
        <div>
          <h2>
            {{
              currentUser.role === 'curator' || currentUser.role === 'teacher'
                ? 'Мои Группы'
                : t('groupManagement.title')
            }}
          </h2>
          <p class="subtitle text-muted">
            {{
              currentUser.role === 'curator' || currentUser.role === 'teacher'
                ? 'Группы, закрепленные за вами'
                : 'Список всех учебных групп платформы'
            }}
          </p>
        </div>
        <button
          v-if="canManage"
          @click="openAddGroupModal"
          class="btn-primary"
        >
          + {{ t("groupManagement.addBtn") }}
        </button>
      </div>

      <!-- Search bar -->
      <div class="search-bar">
        <input
          v-model="searchQuery"
          :placeholder="t('groupManagement.search')"
          class="input-field"
        />
      </div>

      <!-- Groups List (Cards Grid) -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
      </div>
      <div v-else-if="filteredGroups.length === 0" class="card empty-card">
        <div class="empty-icon">🏫</div>
        <h3>{{ t("groupManagement.noGroups") }}</h3>
        <p class="text-muted" v-if="currentUser.role === 'curator' || currentUser.role === 'teacher'">
          Вам пока не назначено ни одной группы. Обратитесь к администратору или оператору.
        </p>
      </div>
      <div v-else class="groups-grid">
        <div
          v-for="group in filteredGroups"
          :key="group.id"
          class="group-card"
          @click="openGroupDetails(group)"
        >
          <div class="group-card-header">
            <div class="group-title-wrap">
              <span class="group-icon">🏫</span>
              <h3 class="group-name">{{ group.name }}</h3>
            </div>
            <span class="badge count-badge">
              👥 {{ group.studentsCount || 0 }} {{ t("groupManagement.thStudentsCount").toLowerCase() }}
            </span>
          </div>

          <p class="group-desc text-muted">
            {{ group.description || "Без описания" }}
          </p>

          <div class="group-card-footer">
            <div class="curators-section">
              <span class="curators-label">{{ t("groupManagement.thCurators") }}:</span>
              <div v-if="group.curators && group.curators.length > 0" class="badge-list">
                <span
                  v-for="curator in group.curators"
                  :key="curator.id"
                  class="badge curator-badge"
                >
                  👤 {{ curator.username }}
                </span>
              </div>
              <span v-else class="text-muted text-sm">—</span>
            </div>

            <div class="group-card-actions" @click.stop>
              <button
                @click="openGroupDetails(group)"
                class="btn-action btn-open"
              >
                {{ t("groupManagement.viewStudents") }} ➔
              </button>
              <button
                v-if="canManage"
                @click="openEditGroupModal(group)"
                class="btn-icon"
                :title="t('groupManagement.editBtn')"
              >
                ✏️
              </button>
              <button
                v-if="canManage"
                @click="confirmDeleteGroup(group)"
                class="btn-icon btn-icon-danger"
                :title="t('groupManagement.deleteBtn')"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- VIEW 2: GROUP DETAILS & STUDENTS LIST -->
    <div v-else-if="currentView === 'details'" class="fade-in">
      <div class="details-header">
        <button @click="backToList" class="btn-back">
          {{ t("groupManagement.backToGroups") }}
        </button>
        <div class="details-title-row">
          <div>
            <h2>🏫 {{ selectedGroup?.name }}</h2>
            <p v-if="selectedGroup?.description" class="text-muted text-sm mt-1">
              {{ selectedGroup?.description }}
            </p>
          </div>
          <div class="details-curators-box">
            <span class="text-sm font-bold">{{ t("groupManagement.thCurators") }}:</span>
            <div v-if="selectedGroup?.curators && selectedGroup.curators.length > 0" class="badge-list mt-1">
              <span
                v-for="c in selectedGroup.curators"
                :key="c.id"
                class="badge curator-badge"
              >
                👤 {{ c.username }}
                <a v-if="c.phone" :href="'tel:' + c.phone" class="phone-chip" title="Позвонить куратору">
                  📞 {{ c.phone }}
                </a>
              </span>
            </div>
            <span v-else class="text-muted text-sm">—</span>
          </div>
        </div>
      </div>

      <!-- Add Student to Group Bar (for Admin/Operator) -->
      <div v-if="canManage" class="card add-student-bar">
        <h4>+ {{ t("groupManagement.addStudentBtn") }}</h4>
        <div class="flex gap-2 items-center flex-wrap">
          <select v-model="selectedStudentToAdd" class="input-field select-student">
            <option value="">{{ t("groupManagement.selectStudentToAdd") }}</option>
            <option
              v-for="s in unassignedStudents"
              :key="s.id"
              :value="s.id"
            >
              {{ s.username }} {{ s.phone ? `(${s.phone})` : '' }}
            </option>
          </select>
          <button
            @click="addStudentToCurrentGroup"
            class="btn-primary"
            :disabled="!selectedStudentToAdd"
          >
            {{ t("groupManagement.addStudentBtn") }}
          </button>
        </div>
      </div>

      <!-- Students Table -->
      <div class="card table-card mt-4">
        <div class="card-header-simple">
          <h3>
            {{ t("groupManagement.groupStudentsTitle") }}
            <span class="count-pill">
              {{ selectedGroupStudents ? selectedGroupStudents.length : 0 }}
            </span>
          </h3>
        </div>

        <div v-if="loadingStudents" class="loading-state">
          <div class="spinner"></div>
        </div>
        <div
          v-else-if="!selectedGroupStudents || selectedGroupStudents.length === 0"
          class="empty-state"
        >
          <p>{{ t("groupManagement.noStudentsInGroup") }}</p>
        </div>
        <table v-else class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{{ t("userManagement.thLogin") }}</th>
              <th>{{ t("groupManagement.thPhone") }}</th>
              <th class="text-right">{{ t("groupManagement.thActions") }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in selectedGroupStudents" :key="student.id">
              <td class="text-muted">#{{ student.id }}</td>
              <td class="font-bold student-name">
                👤 {{ student.username }}
              </td>
              <td>
                <div v-if="student.phone" class="phone-wrapper">
                  <a
                    :href="'tel:' + student.phone"
                    class="phone-call-btn"
                    :title="t('groupManagement.callBtn')"
                  >
                    <span class="phone-icon-circle">📞</span>
                    <span class="phone-number">{{ student.phone }}</span>
                  </a>
                </div>
                <span v-else class="badge no-phone-badge">
                  {{ t("groupManagement.noPhone") }}
                </span>
              </td>
              <td class="text-right">
                <div class="action-buttons">
                  <!-- Fast Call Link Button -->
                  <a
                    v-if="student.phone"
                    :href="'tel:' + student.phone"
                    class="btn-call-direct"
                    :title="t('groupManagement.callBtn')"
                  >
                    📞 {{ t("groupManagement.callBtn") }}
                  </a>
                  <!-- Edit Student Button -->
                  <button
                    @click="openEditStudentModal(student)"
                    class="btn-action btn-edit"
                    :title="t('groupManagement.editStudentTitle')"
                  >
                    ✏️ {{ t("userManagement.editBtn") }}
                  </button>
                  <!-- Remove from Group (Admin/Operator only) -->
                  <button
                    v-if="canManage"
                    @click="removeStudentFromCurrentGroup(student.id)"
                    class="btn-action btn-danger"
                    :title="t('groupManagement.removeFromGroup')"
                  >
                    ✕
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL 1: CREATE / EDIT GROUP -->
    <div v-if="showGroupModal" class="modal-overlay" @click.self="showGroupModal = false">
      <div class="card modal-content animate-zoom-in">
        <div class="modal-header">
          <h3>
            {{
              isEditingGroup
                ? t("groupManagement.editTitle")
                : t("groupManagement.newTitle")
            }}
          </h3>
          <button @click="showGroupModal = false" class="btn-close">&times;</button>
        </div>
        <form @submit.prevent="saveGroup">
          <div class="form-group">
            <label>{{ t("groupManagement.nameLabel") }} *</label>
            <input
              v-model="groupForm.name"
              :placeholder="t('groupManagement.namePlaceholder')"
              class="input-field"
              required
            />
          </div>

          <div class="form-group">
            <label>{{ t("groupManagement.descLabel") }}</label>
            <textarea
              v-model="groupForm.description"
              :placeholder="t('groupManagement.descPlaceholder')"
              class="input-field"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label>{{ t("groupManagement.curatorsLabel") }}</label>
            <div v-if="availableCurators.length === 0" class="text-muted text-sm">
              Нет доступных кураторов (создайте пользователя с ролью Куратор)
            </div>
            <div v-else class="checkbox-group-container">
              <label
                v-for="curator in availableCurators"
                :key="curator.id"
                class="checkbox-item"
              >
                <input
                  type="checkbox"
                  :value="curator.id"
                  v-model="groupForm.curatorIds"
                />
                <span>{{ curator.username }} {{ curator.phone ? `(${curator.phone})` : '' }}</span>
              </label>
            </div>
          </div>

          <div class="flex gap-2 mt-4 justify-end">
            <button type="button" @click="showGroupModal = false" class="btn-secondary">
              {{ t("groupManagement.cancelBtn") }}
            </button>
            <button type="submit" class="btn-primary" :disabled="savingGroup">
              {{ savingGroup ? "..." : t("groupManagement.saveBtn") }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL 2: EDIT STUDENT DATA (Username, Phone, Password) -->
    <div v-if="showEditStudentModal" class="modal-overlay" @click.self="showEditStudentModal = false">
      <div class="card modal-content animate-zoom-in">
        <div class="modal-header">
          <h3>✏️ {{ t("groupManagement.editStudentTitle") }}</h3>
          <button @click="showEditStudentModal = false" class="btn-close">&times;</button>
        </div>
        <form @submit.prevent="saveStudentData">
          <div class="form-group">
            <label>{{ t("userManagement.loginLabel") }} *</label>
            <input
              v-model="studentEditForm.username"
              class="input-field"
              required
            />
          </div>

          <div class="form-group">
            <label>📞 {{ t("userManagement.phoneLabel") }}</label>
            <input
              v-model="studentEditForm.phone"
              type="tel"
              :placeholder="t('userManagement.phonePlaceholder')"
              class="input-field"
            />
          </div>

          <div class="form-group">
            <label>{{ t("userManagement.passwordLabel") }} (оставьте пустым, если не меняется)</label>
            <input
              v-model="studentEditForm.password"
              type="password"
              placeholder="Новый пароль"
              class="input-field"
            />
          </div>

          <div class="flex gap-2 mt-4 justify-end">
            <button type="button" @click="showEditStudentModal = false" class="btn-secondary">
              {{ t("groupManagement.cancelBtn") }}
            </button>
            <button type="submit" class="btn-primary" :disabled="savingStudent">
              {{ savingStudent ? "..." : t("groupManagement.saveBtn") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../api";
import { useLanguage } from "../composables/useLanguage";

const { t } = useLanguage();

const currentUser = ref(JSON.parse(localStorage.getItem("user") || "{}"));
const canManage = computed(() => {
  return (
    currentUser.value.role === "admin" || currentUser.value.role === "operator"
  );
});

// Navigation View State: 'list' or 'details'
const currentView = ref("list");

const groups = ref([]);
const users = ref([]);
const loading = ref(false);
const searchQuery = ref("");

// Group Edit Modal State
const showGroupModal = ref(false);
const isEditingGroup = ref(false);
const savingGroup = ref(false);
const groupForm = ref({
  id: null,
  name: "",
  description: "",
  curatorIds: []
});

// Group Details State
const selectedGroup = ref(null);
const selectedGroupStudents = ref([]);
const loadingStudents = ref(false);
const selectedStudentToAdd = ref("");

// Student Edit Modal State
const showEditStudentModal = ref(false);
const savingStudent = ref(false);
const studentEditForm = ref({
  id: null,
  username: "",
  phone: "",
  password: ""
});

const availableCurators = computed(() => {
  return users.value.filter(
    (u) => u.role === "curator" || u.role === "teacher"
  );
});

const unassignedStudents = computed(() => {
  const currentGroupId = selectedGroup.value ? selectedGroup.value.id : null;
  return users.value.filter(
    (u) => u.role === "student" && u.groupId !== currentGroupId
  );
});

const filteredGroups = computed(() => {
  if (!searchQuery.value) return groups.value;
  const q = searchQuery.value.toLowerCase();
  return groups.value.filter((g) => {
    const matchName = g.name.toLowerCase().includes(q);
    const matchDesc = g.description && g.description.toLowerCase().includes(q);
    const matchCurator =
      g.curators &&
      g.curators.some((c) => c.username.toLowerCase().includes(q));
    return matchName || matchDesc || matchCurator;
  });
});

const fetchGroups = async () => {
  loading.value = true;
  try {
    const res = await api.get("/groups");
    groups.value = res.data;
  } catch (err) {
    console.error("Failed to fetch groups:", err);
  } finally {
    loading.value = false;
  }
};

const fetchUsers = async () => {
  try {
    const res = await api.get("/users");
    users.value = res.data;
  } catch (err) {
    console.error("Failed to fetch users:", err);
  }
};

// Open detailed view of group
const openGroupDetails = async (group) => {
  selectedGroup.value = group;
  selectedStudentToAdd.value = "";
  currentView.value = "details";
  loadingStudents.value = true;
  try {
    const res = await api.get(`/groups/${group.id}`);
    selectedGroup.value = res.data;
    selectedGroupStudents.value = res.data.students || [];
  } catch (err) {
    console.error("Failed to fetch group details:", err);
    alert(err.response?.data?.message || err.message);
    currentView.value = "list";
  } finally {
    loadingStudents.value = false;
  }
};

const backToList = async () => {
  currentView.value = "list";
  selectedGroup.value = null;
  selectedGroupStudents.value = [];
  await fetchGroups();
};

const openAddGroupModal = () => {
  isEditingGroup.value = false;
  groupForm.value = {
    id: null,
    name: "",
    description: "",
    curatorIds: []
  };
  showGroupModal.value = true;
};

const openEditGroupModal = (group) => {
  isEditingGroup.value = true;
  groupForm.value = {
    id: group.id,
    name: group.name,
    description: group.description || "",
    curatorIds: group.curators ? group.curators.map((c) => c.id) : []
  };
  showGroupModal.value = true;
};

const saveGroup = async () => {
  if (!groupForm.value.name.trim()) return;
  savingGroup.value = true;
  try {
    if (isEditingGroup.value) {
      await api.put(`/groups/${groupForm.value.id}`, {
        name: groupForm.value.name.trim(),
        description: groupForm.value.description.trim(),
        curatorIds: groupForm.value.curatorIds
      });
    } else {
      await api.post("/groups", {
        name: groupForm.value.name.trim(),
        description: groupForm.value.description.trim(),
        curatorIds: groupForm.value.curatorIds
      });
    }
    showGroupModal.value = false;
    await fetchGroups();
    await fetchUsers();
  } catch (err) {
    alert(err.response?.data?.message || err.message);
  } finally {
    savingGroup.value = false;
  }
};

const confirmDeleteGroup = async (group) => {
  if (!confirm(`${t("groupManagement.confirmDelete")}: ${group.name}?`)) return;
  try {
    await api.delete(`/groups/${group.id}`);
    await fetchGroups();
    await fetchUsers();
  } catch (err) {
    alert(err.response?.data?.message || err.message);
  }
};

const addStudentToCurrentGroup = async () => {
  if (!selectedStudentToAdd.value || !selectedGroup.value) return;
  try {
    await api.post(`/groups/${selectedGroup.value.id}/students`, {
      studentIds: [selectedStudentToAdd.value]
    });
    selectedStudentToAdd.value = "";
    // Refresh group students
    const res = await api.get(`/groups/${selectedGroup.value.id}`);
    selectedGroup.value = res.data;
    selectedGroupStudents.value = res.data.students || [];
    await fetchUsers();
  } catch (err) {
    alert(err.response?.data?.message || err.message);
  }
};

const removeStudentFromCurrentGroup = async (studentId) => {
  if (!selectedGroup.value) return;
  if (!confirm("Исключить ученика из этой группы?")) return;
  try {
    await api.delete(`/groups/${selectedGroup.value.id}/students/${studentId}`);
    const res = await api.get(`/groups/${selectedGroup.value.id}`);
    selectedGroup.value = res.data;
    selectedGroupStudents.value = res.data.students || [];
    await fetchUsers();
  } catch (err) {
    alert(err.response?.data?.message || err.message);
  }
};

// Open Student Edit Modal
const openEditStudentModal = (student) => {
  studentEditForm.value = {
    id: student.id,
    username: student.username,
    phone: student.phone || "",
    password: ""
  };
  showEditStudentModal.value = true;
};

const saveStudentData = async () => {
  savingStudent.value = true;
  try {
    const payload = {
      username: studentEditForm.value.username.trim(),
      phone: studentEditForm.value.phone.trim()
    };
    if (studentEditForm.value.password.trim()) {
      payload.password = studentEditForm.value.password.trim();
    }

    await api.put(`/users/${studentEditForm.value.id}`, payload);
    showEditStudentModal.value = false;

    // Refresh student in list
    if (selectedGroup.value) {
      const res = await api.get(`/groups/${selectedGroup.value.id}`);
      selectedGroup.value = res.data;
      selectedGroupStudents.value = res.data.students || [];
    }
    await fetchUsers();
  } catch (err) {
    alert(err.response?.data?.message || err.message);
  } finally {
    savingStudent.value = false;
  }
};

onMounted(() => {
  fetchGroups();
  fetchUsers();
});
</script>

<style scoped>
.group-management {
  max-width: 1200px;
  margin: 0 auto;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions h2 {
  font-size: 1.6rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.subtitle {
  font-size: 0.9rem;
  margin-top: 4px;
}

.search-bar {
  margin-bottom: 24px;
}

.search-bar .input-field {
  max-width: 400px;
  background-color: #fff;
}

/* Groups Grid */
.groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.group-card {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
}

.group-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
  border-color: #3b82f6;
}

.group-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;
}

.group-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.group-icon {
  font-size: 1.4rem;
}

.group-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.group-desc {
  font-size: 0.875rem;
  line-height: 1.4;
  margin-bottom: 16px;
  min-height: 38px;
}

.group-card-footer {
  border-top: 1px solid #f3f4f6;
  padding-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.curators-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.curators-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #6b7280;
  letter-spacing: 0.05em;
}

.group-card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
}

.btn-open {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-open:hover {
  background: #2563eb;
  color: #fff;
}

.btn-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.15s;
}

.btn-icon:hover {
  background: #f3f4f6;
}

.btn-icon-danger:hover {
  background: #fee2e2;
}

/* Details View */
.details-header {
  margin-bottom: 20px;
}

.btn-back {
  background: #f3f4f6;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  color: #4b5563;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.875rem;
  margin-bottom: 14px;
  display: inline-flex;
  align-items: center;
  transition: background 0.2s;
}

.btn-back:hover {
  background: #e5e7eb;
  color: #111827;
}

.details-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 18px 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.details-title-row h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #111827;
}

.phone-chip {
  margin-left: 6px;
  color: #047857;
  font-weight: 600;
  text-decoration: none;
  background: #d1fae5;
  padding: 2px 6px;
  border-radius: 6px;
}

.phone-chip:hover {
  text-decoration: underline;
}

.add-student-bar {
  background: #fff;
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.add-student-bar h4 {
  margin: 0 0 10px 0;
  font-size: 0.95rem;
  color: #374151;
}

.select-student {
  max-width: 380px;
}

.card-header-simple {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
}

.card-header-simple h3 {
  margin: 0;
  font-size: 1.15rem;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 10px;
}

.count-pill {
  background: #eff6ff;
  color: #2563eb;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.85rem;
}

/* Phone links and Call Buttons */
.phone-wrapper {
  display: inline-flex;
  align-items: center;
}

.phone-call-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #ecfdf5;
  color: #065f46;
  padding: 6px 12px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  border: 1px solid #a7f3d0;
  transition: all 0.2s;
}

.phone-call-btn:hover {
  background: #d1fae5;
  color: #064e3b;
  transform: scale(1.02);
}

.phone-icon-circle {
  font-size: 0.9rem;
}

.btn-call-direct {
  background: #10b981;
  color: #fff;
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: background 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.btn-call-direct:hover {
  background: #059669;
}

.no-phone-badge {
  background: #f3f4f6;
  color: #9ca3af;
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 6px;
}

.table-card {
  padding: 0;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: #f9fafb;
  padding: 12px 18px;
  text-align: left;
  font-weight: 600;
  color: #4b5563;
  font-size: 0.875rem;
  border-bottom: 1px solid #e5e7eb;
}

.data-table td {
  padding: 14px 18px;
  border-bottom: 1px solid #f3f4f6;
  color: #1f2937;
  vertical-align: middle;
}

.data-table tr:hover {
  background: #fcfcfd;
}

.student-name {
  font-size: 0.95rem;
}

.badge-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.curator-badge {
  background: #e0e7ff;
  color: #4338ca;
}

.count-badge {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}

.btn-action {
  border: none;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.15s;
}

.btn-edit {
  background: #f3f4f6;
  color: #374151;
}

.btn-edit:hover {
  background: #e5e7eb;
}

.btn-danger {
  background: #fee2e2;
  color: #dc2626;
}

.btn-danger:hover {
  background: #fca5a5;
}

/* Modals */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.modal-content {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #9ca3af;
  line-height: 1;
}

.btn-close:hover {
  color: #111827;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-weight: 600;
  font-size: 0.85rem;
  color: #374151;
  margin-bottom: 6px;
}

.checkbox-group-container {
  max-height: 150px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  color: #1f2937;
}

.empty-card {
  text-align: center;
  padding: 48px 24px;
  border: 1px dashed #d1d5db;
  border-radius: 14px;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}

.loading-state,
.empty-state {
  padding: 40px;
  text-align: center;
  color: #6b7280;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-zoom-in {
  animation: zoomIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes zoomIn {
  from {
    transform: scale(0.96);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.font-bold {
  font-weight: 600;
}
.text-muted {
  color: #6b7280;
}
.text-right {
  text-align: right;
}
.justify-end {
  justify-content: flex-end;
}
.mt-1 {
  margin-top: 4px;
}
.mt-4 {
  margin-top: 16px;
}
</style>
