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
            <br />
          </div>
          <div>
            <b-tabs content-class="mt-3" fill>
              <b-tab title="지도 구경하기">
                <b-form-group class="ml-5">
                  <b-form-radio-group
                    id="radio-group-1"
                    v-model="selected"
                    :options="areas_do"
                    name="radio-options"
                  ></b-form-radio-group>
                </b-form-group>
                <div class="row justify-content-center mb-5">
                  <img :src="imgs_do[selected - 31]" style="height: 30rem" />
                </div>
              </b-tab>
              <b-tab title="CATEGORY" active>
                <div class="m-3">
                  <div v-for="(area, index) in areas_si" :key="index">
                    <div v-if="index % 3 === 0">
                      <b-card-group deck class="row justify-content-center">
                        <b-card
                          :img-src="imgs_si[index]"
                          img-top
                          style="max-width: 20rem; cursor: pointer"
                          class="mb-2"
                          @click="moveList(areas_si[index].value)"
                        >
                          <b-card-title>{{ areas_si[index].text }}</b-card-title>
                          <b-card-text> {{ hotplcnt[areas_si[index].value] }} 개의 게시물 </b-card-text>
                        </b-card>

                        <b-card
                          :img-src="imgs_si[index + 1]"
                          img-top
                          style="max-width: 20rem; cursor: pointer"
                          class="mb-2"
                          @click="moveList(areas_si[index + 1].value)"
                        >
                          <b-card-title>{{ areas_si[index + 1].text }}</b-card-title>
                          <b-card-text> {{ hotplcnt[areas_si[index + 1].value] }} 개의 게시물 </b-card-text>
                        </b-card>

                        <b-card
                          :img-src="imgs_si[index + 2]"
                          img-top
                          style="max-width: 20rem; cursor: pointer"
                          class="mb-2"
                          @click="moveList(areas_si[index + 2].value)"
                        >
                          <b-card-title>{{ areas_si[index + 2].text }}</b-card-title>
                          <b-card-text> {{ hotplcnt[areas_si[index + 2].value] }} 개의 게시물 </b-card-text>
                        </b-card>
                      </b-card-group>
                    </div>
                  </div>
                </div>
              </b-tab>
            </b-tabs>
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
      imgs_si: [],
      imgs_do: [],
      hotplcnt: [],
      areas_si: [
        { value: 0, text: "전체보기" },
        { value: 1, text: "서울" },
        { value: 2, text: "인천" },
        { value: 3, text: "대전" },
        { value: 4, text: "대구" },
        { value: 5, text: "광주" },
        { value: 6, text: "부산" },
        { value: 7, text: "울산" },
        { value: 8, text: "세종특별자치시" },
      ],
      areas_do: [
        { value: 31, text: "수도권" },
        { value: 32, text: "강원도" },
        { value: 33, text: "충청도" },
        { value: 34, text: "경상도" },
        { value: 35, text: "전라도" },
        { value: 36, text: "제주도" },
      ],
      selected: 31,
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
      for (let i = 0; i < 40; i++) {
        this.$set(this.hotplcnt, i, 0);
      }
      this.$set(this.hotplcnt, 0, data.length);
      for (let i = 0; i < data.length; i++) {
        this.hotplcnt[data[i].sido_code] += 1;
      }
    });
    for (let i = 0; i < 9; i++) {
      this.imgs_si[i] = `img/place/image${i}.jpg`;
    }
    for (let i = 0; i < 6; i++) {
      this.imgs_do[i] = `img/place/image${31 + i}.png`;
    }
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
