<template>
  <div id="app">
    <router-view
      :user="user"
      :hotpls="hotpls"
      @create-hotpl="createHotpl"
      @delete-hotpl="deleteHotpl"
      @update-hotpl="updateHotpl"
    />
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "HotplView",
  props: {
    user: null,
  },
  data() {
    return {
      hotpls: [],
    };
  },
  methods: {
    getHotplList() {
      const API_URL = `http://localhost:9999/trip/hotplaceapi/hotplace`;
      axios({
        url: API_URL,
        method: "get",
      })
        .then(({ data }) => {
          this.hotpls = data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    createHotpl(hotpl) {
      const API_URL = `http://localhost:9999/trip/hotplaceapi/hotplace`;
      axios({
        url: API_URL,
        method: "post",
        data: hotpl,
      })
        .then(() => {
          alert("등록 완료");
          this.getHotplList();
          this.$route.push("/hotplace/list");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateHotpl(hotpl) {
      const API_URL = `http://localhost:9999/trip/hotplaceapi/hotplace`;
      axios({
        url: API_URL,
        method: "put",
        data: hotpl,
      })
        .then(({ data }) => {
          alert("수정 완료");
          this.getHotplList();
          this.$router.push("/hotplace/list");
        })
        .catch(() => {
          console.log(err);
        });
    },
    deleteHotpl(hotpl) {
      const API_URL = `http://localhost:9999/trip/hotplaceapi/hotplace/${hotpl.id}`;
      axios({
        url: API_URL,
        method: "delete",
      })
        .then(() => {
          alert("삭제 완료");
          this.getHotplList();
          this.$router.push("/hotplace/list");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.getHotplList();
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
