<template>
  <div class="login">
    <h1>Login</h1>
    <input required type="text" v-model="login" />
    <button @click="auth">OK</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data: function () {
    return {
      login: "",
    };
  },
  methods: {
    auth: async function () {
      try {
        const { data } = await axios.get(
          `http://46.101.212.195:3000/students/name/${this.login}`
        );

        if (data === null || data.name === "CastError") {
          return;
        }
        this.$store.commit("setUser", data);
        this.$router.push("/");
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
