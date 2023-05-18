import Vue from "vue";
import Vuex from "vuex";
import { createVuexPersistedState } from "vue-persistedstate";


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    loginUser: null,
  },
  mutations: {
    CREATE_USER(state, user) {
      state.users.push(user);
    },
    SET_USER(state, user) {
      state.user = user;
    },
    SET_LOGIN_USER(state, user) {
      state.loginUser = user;
    },
    LOGOUT(state) {
      state.loginUser = null;
    },
  },
  actions: {
    createUser({ commit }, user) {
      http.post("/userapi/user", user)
        .then(() => {
          alert("등록되었습니다.");
          router.push({name: "home"});
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateUser({ commit }, user) {
      http.put("/userapi/user", user)
        .then(() => {
          alert("수정 완료!");
          router.push({name : "home"});
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteUser({ state }, id) {
      console.log(state);
      http.delete("/userapi/user/"+id)
        .then(() => {
          alert("삭제 완료!");
          router.push({name: "home"});
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setUser({ commit }, id) {
      http.get("/userapi/user/"+id)
        .then(({ data }) => {
          commit("SET_USER", data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setLoginUser({ commit }, user) {
      http.post("/userapi/login")
        .then(({ data }) => {
            commit("SET_LOGIN_USER", data);
            router.push({name: "home"});
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  plugins: [
    createVuexPersistedState({
      //key: 'vuex', //기본값 'vuex'
      storage: window.sessionStorage, //기본값 localStorage
    }),
  ],
  modules: { user},
});