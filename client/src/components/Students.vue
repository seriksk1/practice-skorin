<template>
  <div>
    <div>
      <input
        type="radio"
        name="theme"
        :checked="getTheme === 'light'"
        @change="setTheme('light')"
      />Светлая таблица
      <input
        type="radio"
        name="theme"
        :checked="getTheme === 'dark'"
        @change="setTheme('dark')"
      />Тёмная таблица
    </div>

    <div class="form-add">
      <h2 class="title">Создать нового студента</h2>
      <input type="text" v-model="newStudent.name" placeholder="Имя студента" />
      <div class="wrap">
        <input type="text" v-model="newStudent.group" placeholder="Группа" />
      </div>
      <div class="wrap">
        <span>Сдал</span><input type="checkbox" v-model="newStudent.isDonePr" />
      </div>
      <button @click="addStudent()">Добавить</button>
    </div>

    <input
      type="search"
      class="search"
      placeholder="Найти студента"
      v-model="search"
    />

    <table :class="getTheme">
      <tr v-if="searchStudent().length !== 0 && studentsCount">
        <th>Фото</th>
        <th>Имя</th>
        <th>Група</th>
        <th>Сдал ПР</th>
        <th>Удалить</th>
        <th>Редактировать</th>
      </tr>

      <tr :key="st._id" v-for="st in searchStudent()">
        <td>
          <img :src="st.photo" alt="" />
        </td>
        <td>
          <input
            v-if="isStudentEditing(st._id)"
            type="text"
            v-model="editingStudent.name"
          />
          <router-link :to="`/student-info/${st._id}`" v-else
            ><span>{{ st.name }}</span>
          </router-link>
        </td>
        <td>
          <input
            v-if="isStudentEditing(st._id)"
            type="text"
            v-model="editingStudent.group"
          />
          <span v-else>{{ st.group }}</span>
        </td>
        <td>
          <input
            v-if="isStudentEditing(st._id)"
            type="checkbox"
            v-model="editingStudent.isDonePr"
          />
          <input
            v-else
            type="checkbox"
            v-model="st.isDonePr"
            :disabled="!isStudentEditing(st._id)"
          />
        </td>
        <td>
          <button
            @click.prevent="deleteStudent(st._id)"
            :disabled="
              isStudentEditing(st._id) || getCurrentUser.group !== st.group
            "
          >
            Удалить
          </button>
        </td>
        <td>
          <button v-if="isStudentEditing(st._id)" @click="updateStudent()">
            ОК
          </button>
          <button v-else @click="editStudent(st._id)">Редактировать</button>
        </td>
      </tr>
    </table>

    <p class="bold" v-if="searchStudent().length === 0">
      Результатов не найдено
    </p>
    <p>Всего студентов: {{ studentsCount }}</p>
  </div>
</template>

<script>
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3003",
});

const initialStudent = {
  name: "",
  group: "",
  isDonePr: false,
};

export default {
  data: function () {
    return {
      search: "",
      students: [],
      editingStudent: null,
      newStudent: { ...initialStudent },
    };
  },
  mounted: async function () {
    try {
      const { data: students } = await api.get("/students");
      this.students = [...students];
      this.$store.commit("setCount", this.students.length);
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    editStudent: function (id) {
      this.editingStudent = {
        ...this.students.find((student) => student._id === id),
      };
    },
    addStudent: async function () {
      try {
        const { data: newStudent } = await api.post(
          "/student",
          this.newStudent
        );
        this.students.push(newStudent);
        this.$store.commit("setCount", this.students.length);
      } catch (err) {
        console.log(err);
      }
      this.clear();
    },
    deleteStudent: async function (id) {
      try {
        await api.delete(`/student/${id}`);
        this.students = this.students.filter((student) => student._id !== id);
        this.$store.commit("setCount", this.students.length);
      } catch (err) {
        console.log(err);
      }
    },
    updateStudent: async function () {
      try {
        const { data: updatedStudent } = await api.put(
          "/student",
          this.editingStudent
        );

        this.students = this.students.map((student) =>
          student._id === this.editingStudent._id ? updatedStudent : student
        );

        this.editingStudent = null;
      } catch (err) {
        console.log(err);
      }
    },
    isStudentEditing: function (id) {
      return Boolean(this.editingStudent && this.editingStudent?._id === id);
    },
    searchStudent: function () {
      if (this.search) {
        return this.students.filter((student) =>
          student.name.toLowerCase().includes(this.search.toLowerCase())
        );
      }
      return this.students;
    },
    clear: function () {
      this.newStudent = { ...initialStudent };
    },
    setTheme: function (theme) {
      this.$store.commit("setTheme", theme);
    },
  },
  computed: {
    studentsCount: function () {
      return this.$store.getters.getCount;
    },
    getTheme: function () {
      return (this.currentTheme = this.$store.getters.getTheme);
    },
    getCurrentUser() {
      return this.$store.getters.getUser;
    },
  },
};
</script>

<style scoped>
table.light {
  background-color: #fff;
  color: #000;
}

table.dark {
  background-color: #000;
  color: #fff;
}

.title {
  font-size: 18px;
  font-weight: 700;
}

td {
  min-width: 100px;
  padding: 5px;
  border: 1px dashed;
  text-align: center;
}

td img {
  width: 100px;
  height: 100px;
}

.align-left {
  text-align: left;
}

.wrap {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

input[type="search"] {
  margin: 25px 0;
}

td input[type="text"] {
  max-width: 100px;
}

button:focus {
  display: none;
}
</style>
