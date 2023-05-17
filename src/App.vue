<template>
  <div id="app">
    <router-view name="header" :user="user" @logout="logout"></router-view>
    <main>
      <fade-transition origin="center" mode="out-in" :duration="250">
        <router-view :user="user" @login="login" />
      </fade-transition>
    </main>
    <router-view name="footer"></router-view>
  </div>
</template>
<script>
import { FadeTransition } from "vue2-transitions";
import http from "@/util/http-common.js";

export default {
  data() {
    return {
      user: null,
    };
  },
  components: {
    FadeTransition,
  },
  methods: {
    logout() {
      this.user = null;
      this.$router.push({ name: "home" });
    },
    login(user) {
      http
        .post("/userapi/login", {
          id: user.id,

          password: user.password,
        })
        .then(() => {
          this.user = user;
          this.$router.push({ name: "home" });
        })
        .catch(() => {
          alert("로그인 실패");
        });
    },
  },
};
</script>
<style>
a {
  text-decoration: none;
}
</style>
