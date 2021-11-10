<template>
  <div>
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

    <input type="search" class="search" placeholder="Найти студента" v-model="search" />

    <table>
      <tr v-if="searchStudent().length !== 0 && getNumberOfStudents">
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
          <input v-if="isStudentEditing(st._id)" type="text" v-model="editingStudent.name" />
          <span v-else>{{ st.name }}</span>
        </td>
        <td>
          <input v-if="isStudentEditing(st._id)" type="text" v-model="editingStudent.group" />
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
          <button @click="deleteStudent(st._id)" :disabled="isStudentEditing(st._id)">
            Удалить
          </button>
        </td>
        <td>
          <button v-if="isStudentEditing(st._id)" @click="updateStudent()">ОК</button>
          <button v-else @click="editStudent(st._id)">Редактировать</button>
        </td>
      </tr>
    </table>

    <p class="bold" v-if="searchStudent().length === 0">Результатов не найдено</p>
    <p>Всего студентов: {{ getNumberOfStudents }}</p>
  </div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';

const initialStudent = {
  name: '',
  group: '',
  isDonePr: '',
};

export default {
  data: function () {
    return {
      search: '',
      students: [],
      currencies: [],

      amount: 0,
      sellCurrency: null,
      buyCurrency: null,

      editingStudent: null,
      newStudent: { ...initialStudent },
    };
  },
  mounted: async function () {
    try {
      const { data: students } = await axios.get('http://46.101.212.195:3000/students');
      this.students = [...students];

      const { data: currencies } = await axios.get(
        'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json',
      );
      this.currencies = currencies;
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    editStudent: function (id) {
      this.editingStudent = { ...this.students.find((student) => student._id === id) };
    },
    addStudent: async function () {
      try {
        const { data: newStudent } = await axios.post(
          `http://46.101.212.195:3000/students`,
          this.newStudent,
        );
        this.students.push(newStudent);
      } catch (err) {
        console.log(err);
      }
      this.clear();
    },
    deleteStudent: async function (id) {
      try {
        await axios.delete(`http://46.101.212.195:3000/students/${id}`);
        this.students = this.students.filter((student) => student._id !== id);
      } catch (err) {
        console.log(err);
      }
    },
    updateStudent: async function () {
      try {
        const { data: updatedStudent } = await axios.put(
          `http://46.101.212.195:3000/students/${this.editingStudent._id}`,
          this.editingStudent,
        );

        this.students = this.students.map((student) =>
          student._id === this.editingStudent._id ? updatedStudent : student,
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
          student.name.toLowerCase().includes(this.search.toLowerCase()),
        );
      }
      return this.students;
    },
    clear: function () {
      this.newStudent = { ...initialStudent };
    },
    swapCurrencies: function () {
      const temp = { ...this.sellCurrency };
      this.sellCurrency = { ...this.buyCurrency };
      this.buyCurrency = { ...temp };
    },
  },
  computed: {
    getNumberOfStudents: function () {
      return this.students.length;
    },

    output: function () {
      if (this.sellCurrency && this.buyCurrency) {
        return ((this.amount * this.sellCurrency.rate) / this.buyCurrency.rate).toFixed(3);
      } else return 0;
    },
  },
};
</script>

<style scoped>
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

input[type='search'] {
  margin: 25px 0;
}

td input[type='text'] {
  max-width: 100px;
}

button:focus {
  display: none;
}
</style>
