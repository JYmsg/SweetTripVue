<template>
  <div>
    <section class="section-profile-cover section-shaped my-0">
      <div class="shape shape-login"></div>
    </section>
    <section class="section section-skew">
      <div class="container">
        <card shadow class="card-profile mt--300" no-body>
          <div class="px-4">
            <div class="row justify-content-center mt-5">
              <h3>🔥 핫 플레이스 🔥</h3>
            </div>
            <hr />
          </div>
          <div class="m-3">
            {{ hotplcnt }}
            <div v-for="(area, index) in areas" :key="index">
              <!-- <b-card-group deck class="row justify-content-center"> -->
              <b-card
                img-src="https://picsum.photos/600/300/?image=25"
                img-top
                style="max-width: 20rem"
                class="mb-2"
                @click="moveList(area.value)"
              >
                <b-card-title>{{ area.text }}</b-card-title>
                <b-card-text> {{ hotplcnt[area.value] }} 개의 게시물 </b-card-text>
              </b-card>
              <!-- </b-card-group> -->
            </div>
          </div>
        </card>
      </div>
    </section>
  </div>
</template>

<script>
import http from "@/util/http-common.js";
import { mapState } from "vuex";
export default {
  name: "HotplMain",
  data() {
    return {
      hotpls: [
        {
          id: Number,
          title: String,
          content: String,
          img: String,
          hit: Number,
          good: Number,
          write_time: String,
          writer_id: String,
          sido_code: Number,
        },
      ],
      hotplcnt: [Number],
      areas: [
        { value: 0, text: "전체보기" },
        { value: 1, text: "서울" },
        { value: 2, text: "인천" },
        { value: 3, text: "대전" },
        { value: 4, text: "대구" },
        { value: 5, text: "광주" },
        { value: 6, text: "부산" },
        { value: 7, text: "울산" },
        { value: 8, text: "세종특별자치시" },
        { value: 31, text: "경기도" },
        { value: 32, text: "강원도" },
        { value: 33, text: "충청북도" },
        { value: 34, text: "충청남도" },
        { value: 35, text: "경상북도" },
        { value: 36, text: "경상남도" },
        { value: 37, text: "전라북도" },
        { value: 38, text: "전라남도" },
        { value: 39, text: "제주도" },
      ],
    };
  },
  computed: {
    ...mapState(["loginUser"]),
    getData() {
      return this.hotpls;
    },
    getUser() {
      if (this.loginUser) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    http.get("/hotplaceapi/hotplace/0/none/none").then(({ data }) => {
      console.log(data);
      this.hotpls = data;
      this.hotplcnt = data.length;
      for (let i = 0; i < data.length; i++) {
        this.hotplcnt[data[i].sido_code] += 1;
      }
    });
  },
  methods: {
    moveList(sido_code) {
      this.$router.push({
        name: "HotplList",
        params: { id: sido_code },
      });
    },
  },
};
</script>

<style></style>
