import Vue from "vue";
import Vuex from "vuex";
import router from "./router";
import { createVuexPersistedState } from "vue-persistedstate";
import http from "@/util/http-common";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    loginUser: null,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_LOGIN_USER(state, user) {
      console.log(user);
      state.loginUser = user;
    },
    LOGOUT(state) {
      state.loginUser = null;
      router.push({ name: "home" });
    },
  },
  actions: {
    createUser({ commit }, user) {
      http
        .post("/userapi/user", user)
        .then(() => {
          alert("등록되었습니다.");
          router.push({ name: "home" });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateUser({ commit }, user) {
      http
        .put("/userapi/user", user)
        .then(() => {
          alert("수정 완료!");
          router.push({ name: "home" });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteUser({ state }, id) {
      console.log(state);
      http
        .delete("/userapi/user/" + id)
        .then(() => {
          alert("삭제 완료!");
          router.push({ name: "home" });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setUser({ commit }, id) {
      http
        .get("/userapi/user/" + id)
        .then(({ data }) => {
          commit("SET_USER", data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setLoginUser({ commit }, user) {
      http
        .post("/userapi/login", user)
        .then(({ data }) => {
          if (data.length < 1) {
            console.log("실패");
            alert("비밀번호를 확인해주세요");
            return;
          }
          console.log("로그인 성공");
          commit("SET_LOGIN_USER", data);
          router.push({ name: "home" });
        })
        .catch((err) => {
          console.log(err);
          alert("존재하지 않는 아이디입니다.");
          router.go(0);
        });
    },
  },
  plugins: [
    createVuexPersistedState({
      //key: 'vuex', //기본값 'vuex'
      storage: window.sessionStorage, //기본값 localStorage
    }),
  ],
});
