<template>
  <div class="student-profile">
    <div class="student-photo">
      <img :src="student.photo" alt="student-photo" />
    </div>
    <div class="student-info">
      <p>
        Студент: <b>{{ student.name }}</b>
      </p>
      <p>Группа: {{ student.group }}</p>
      <p>Оценка: {{ student.mark }}</p>
    </div>
    <p>Всего студентов: {{ studentsCount }}</p>
  </div>
</template>

<script>
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3003",
});

export default {
  props: {
    id: "",
  },
  data: function () {
    return {
      student: {},
      modalOpen: false,
    };
  },
  created: async function () {
    const { data: student } = await api.get(`/students/${this.id}`);
    this.student = { ...student, mark: student.mark ? student.mark : "?" };
  },
  computed: {
    studentsCount: function () {
      return this.$store.getters.getCount;
    },
  },
};
</script>

<style scoped>
.student-profile {
  display: flex;
  max-width: 500px;
  height: fit-content;
  border: 2px solid rgb(128, 10, 207);
}

.student-photo {
  display: flex;
  position: relative;
  width: 150px;
  height: 150px;
}

.student-photo img {
  width: 100%;
}

.student-photo::after {
  content: "";
  position: relative;
  height: 100%;
  border-right: 2px solid rgb(128, 10, 207);
}

.student-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: fit-content;
  flex: 1 1;
  font-size: 20px;
  padding: 15px;
}

.student-info p {
  margin: 0;
}
</style>
