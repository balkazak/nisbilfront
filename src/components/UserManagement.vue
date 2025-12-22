<template>
  <div>
    <div class="flex justify-between items-center header-section">
      <h2 class="title-lg">Управление Пользователями</h2>
      <button v-if="canAddUser" @click="showAddForm = true" class="btn-primary">+ Добавить</button>
    </div>

    <!-- User List -->
    <div class="table-container">
      <table class="styled-table">
        <thead>
          <tr>
            <th>Логин</th>
            <th>Роль</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>{{ u.username }}</td>
            <td><span :class="'role-tag ' + u.role">{{ translateRole(u.role) }}</span></td>
            <td>
                <button v-if="u.role === 'student'" @click="openAccessDetails(u)" class="btn-xs btn-outline">Доступы</button>
                <button v-if="canDelete(u)" @click="deleteUser(u)" class="btn-xs btn-outline-danger ml-2" title="Удалить">✕</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add User Modal -->
    <div v-if="showAddForm" class="modal-overlay" @click.self="showAddForm = false">
      <!-- ... existing content ... -->
      <div class="card modal animate-zoom-in">
        <h3>Новый Пользователь</h3>
        <form @submit.prevent="addUser">
          <div class="form-group">
             <label>Логин</label>
             <input v-model="newUser.username" placeholder="Придумайте логин" class="input-field" required />
          </div>
          <div class="form-group">
             <label>Пароль</label>
             <input v-model="newUser.password" placeholder="Придумайте пароль" class="input-field" required />
          </div>
          <div class="form-group">
             <label>Роль</label>
             <select v-model="newUser.role" class="input-field">
                <option value="student">Ученик</option>
                <option v-if="currentUser.role === 'admin'" value="teacher">Учитель</option>
                <option v-if="currentUser.role === 'admin'" value="admin">Админ</option>
             </select>
          </div>
          <div class="flex gap-2 mt-4">
            <button type="submit" class="btn-primary">Создать</button>
            <button type="button" @click="showAddForm = false" class="btn-secondary">Отмена</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Access Control Modal -->
    <div v-if="showAccessModal" class="modal-overlay" @click.self="showAccessModal = false">
        <div class="card modal-wide animate-zoom-in">
            <div class="modal-header">
                <h3>Доступы: {{ selectedUser?.username }}</h3>
                <button @click="showAccessModal = false" class="btn-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="flex-row">
                    <!-- Courses -->
                    <div class="access-column">
                        <h4>📚 Курсы</h4>
                        <p v-if="availableCourses.length === 0" class="text-muted">Нет доступных курсов</p>
                        <div v-for="course in availableCourses" :key="course.id" class="check-item">
                            <label>
                                <input type="checkbox" :value="course.id" v-model="selectedCourseIds">
                                {{ course.title }}
                            </label>
                        </div>
                    </div>
                    
                    <!-- Standalone Tests -->
                    <div class="access-column">
                        <h4>📝 Отдельные Тесты</h4>
                        <p v-if="availableTests.length === 0" class="text-muted">Нет отдельных тестов</p>
                        <div v-for="test in availableTests" :key="test.id" class="check-item">
                            <label>
                                <input type="checkbox" :value="test.id" v-model="selectedTestIds">
                                {{ test.title }}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button @click="saveAccess" class="btn-primary">Сохранить</button>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  data() {
    return {
      users: [],
      showAddForm: false,
      showAccessModal: false,
      currentUser: JSON.parse(localStorage.getItem('user') || '{}'),
      newUser: { username: '', password: '', role: 'student' },
      
      // Access Management
      selectedUser: null,
      availableCourses: [],
      availableTests: [], // Standalone tests
      selectedCourseIds: [],
      selectedTestIds: []
    };
  },
  computed: {
    canAddUser() { return true; }
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const res = await api.get('/users');
        this.users = res.data;
      } catch (err) {
        console.error(err);
      }
    },
    async addUser() {
      try {
        await api.post('/users', this.newUser);
        this.showAddForm = false;
        this.fetchUsers();
        this.newUser = { username: '', password: '', role: 'student' };
      } catch (err) {
        alert(err.response?.data?.message || 'Ошибка создания пользователя');
      }
    },
    translateRole(role) {
       const roles = { 'admin': 'Админ', 'teacher': 'Учитель', 'student': 'Ученик' };
       return roles[role] || role;
    },
    
    // Access Management
    async openAccessDetails(user) {
        if (user.role !== 'student') return; // Only for students
        this.selectedUser = user;
        this.showAccessModal = true;
        
        // Fetch all courses and standalone tests
        const [coursesRes, testsRes] = await Promise.all([
            api.get('/courses'),
            api.get('/tests?is_standalone=true')
        ]);
        this.availableCourses = coursesRes.data;
        this.availableTests = testsRes.data;
        
        // Fetch current user access
        try {
            const accessRes = await api.get(`/users/${user.id}/access`);
            this.selectedCourseIds = accessRes.data.courses;
            this.selectedTestIds = accessRes.data.tests;
        } catch (err) {
            console.error("Error fetching access", err);
            this.selectedCourseIds = [];
            this.selectedTestIds = [];
        }
    },
    async saveAccess() {
        try {
            await api.post(`/users/${this.selectedUser.id}/access`, {
                courseIds: this.selectedCourseIds,
                testIds: this.selectedTestIds
            });
            alert('Доступы обновлены!');
            this.showAccessModal = false;
        } catch (err) {
            alert('Ошибка при сохранении: ' + err.message);
        }
    },
    canDelete(u) {
        if(this.currentUser.role === 'admin') return true;
        if(this.currentUser.role === 'teacher' && u.role === 'student') return true;
        return false;
    },
    async deleteUser(u) {
       if(!confirm(`Удалить пользователя ${u.username}?`)) return;
       try {
           await api.delete(`/users/${u.id}`);
           this.fetchUsers();
       } catch(err) {
           alert(err.response?.data?.message || err.message);
       }
    }
  }
};
</script>

<style scoped>
.header-section { margin-bottom: 20px; }
.title-lg { font-size: 1.5rem; color: #333; }
.table-container { background: white; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); overflow: hidden; }
.styled-table { width: 100%; border-collapse: collapse; }
.styled-table th { background: #f8f9fa; padding: 15px; text-align: left; font-weight: 600; color: #555; }
.styled-table td { padding: 15px; border-bottom: 1px solid #eee; }
.styled-table tr:last-child td { border-bottom: none; }
.role-tag { padding: 4px 10px; border-radius: 12px; font-size: 0.85rem; font-weight: 500; }
.role-tag.admin { background: #e3f2fd; color: #1976d2; }
.role-tag.teacher { background: #e8f5e9; color: #388e3c; }
.role-tag.student { background: #fff3e0; color: #f57c00; }
.btn-secondary { background: #f0f0f0; color: #333; }
.btn-secondary:hover { background: #e0e0e0; }
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
}
.modal { width: 350px; padding: 25px; display: flex; flex-direction: column; }
.modal-wide { width: 700px; padding: 25px; display: flex; flex-direction: column; height: 70vh; }
.modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px; }
.modal-body { flex: 1; overflow-y: auto; }
.modal-footer { margin-top: 20px; text-align: right; }

.flex-row { display: flex; gap: 30px; height: 100%; }
.access-column { flex: 1; border: 1px solid #eee; padding: 15px; border-radius: 8px; overflow-y: auto; background: #fafafa; }
.access-column h4 { margin-top: 0; padding-bottom: 10px; border-bottom: 1px solid #ddd; color: #444; }

.check-item { margin-bottom: 8px; padding: 8px; background: white; border-radius: 6px; border: 1px solid #eee; transition: 0.2s; }
.check-item:hover { border-color: #b3e5fc; }
.check-item label { display: flex; align-items: center; gap: 10px; cursor: pointer; width: 100%; font-size: 0.95rem; }

.btn-xs { padding: 4px 8px; font-size: 0.75rem; border-radius: 4px; border: 1px solid #ddd; background: white; cursor: pointer; }
.btn-xs:hover { background: #f0f0f0; border-color: #ccc; }
.btn-xs:hover { background: #f0f0f0; border-color: #ccc; }
.btn-outline-danger { color: #d32f2f; border-color: #ffcdd2; margin-left: 5px; }
.btn-outline-danger:hover { background: #ffebee; border-color: #ef5350; }
.btn-close { border: none; background: none; font-size: 1.5rem; cursor: pointer; color: #777; }
.text-muted { color: #999; font-size: 0.85rem; }

.animate-zoom-in { animation: zoomIn 0.3s ease-out; }
@keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>
