import Vue from 'vue';
import axios from 'axios';

const students = [];

const initialStudent = {
  id: '',
  name: '',
  group: '',
  done: '',
};

new Vue({
  el: '#app',
  data: {
    search: '',
    students: students,
    currencies: [],

    amount: 0,
    sellCurrency: null,
    buyCurrency: null,

    newStudent: { ...initialStudent },
  },
  mounted: function () {
    axios.get('http://46.101.212.195:3000/students').then(({ data: students }) => {
      this.students = [...students];
    });

    axios
      .get('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
      .then(({ data }) => {
        this.currencies = data;
      });
  },
  methods: {
    addStudent: function () {
      this.newStudent.id = Date.now();
      this.students.push(this.newStudent);
      this.clear();
    },
    deleteStudent: function (id) {
      this.students = this.students.filter((student) => student._id !== id);
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
});
