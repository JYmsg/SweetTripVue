import Vue from 'vue'
import Vuex from 'vuex'
import { createVuexPersistedState } from 'vue-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    books: [],
    book: {
      isbn: String,
      title: String,
      author: String,
      price: Number,
      content: String,
    },
  },
  getters: {
    booksLength(state) {
      return state.books.length;
    }
  },
  mutations: {
    SET_BOOKS(state, books) {
      state.books = books;
    },
    SET_BOOK(state, book) {
      state.book = book;
    }
  },
  actions: {
    getBooks({commit}) {
      http.get("/book").then(({ data }) => {
        commit("SET_BOOKS", data);
      }).catch(() => {
        alert("도서목록: 에러발생")
      });
    },
    getBook({commit}, isbn) {
      http.get("/book/"+isbn).then(({ data }) => {
        commit("SET_BOOKS", data);
      }).catch(() => {
        alert("도서조회: 에러발생")
      });
    }
  },
  plugins: [
    createVuexPersistedState({
      //key : 'vuex',
      storage: sessionStorage, //localStorage
    })
  ],
  modules: {
  }
})
