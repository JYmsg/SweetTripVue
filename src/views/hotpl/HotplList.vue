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
            <div class="row justify-content-center mt-1">
              <h2>{{ area }}</h2>
            </div>
            <div class="row m-1" style="justify-content: right">
              <b-button variant="outline-info" size="sm" @click="moveMain">목록으로</b-button>
            </div>
            <div v-if="getUser" class="row m-1" style="justify-content: right">
              <div class="btn btn-outline-warning float-end d-inline" @click="hotplRegist">핫 플레이스 등록하기</div>
            </div>
            <b-form-group>
              <b-form-radio-group
                id="radio-group-1"
                v-model="selected"
                :options="options"
                name="radio-options"
              ></b-form-radio-group>
            </b-form-group>
            <input type="text" placeholder="제목으로 검색하세요." v-model="search" />
            <b-button class="ml-3" size="sm" @click="reloadList">확인</b-button>

            <hr />
            <div class="row justify-content-center">
              <div class="hotpl-list" style="width: 90%">
                <div v-if="hotpls.length && getlike">
                  <div v-for="(hotpl, index) in hotpls" :key="index">
                    <div class="card mb-3 text-start">
                      <div class="row g-0">
                        <div class="col-md-3">
                          <img style="width: 100%; height: 100%" :src="hotpl.src" />
                        </div>
                        <div class="col-md-9">
                          <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                              <div>
                                <router-link
                                  class="card-title m-0 h5"
                                  :to="{ name: 'HotplDetail', params: { id: hotpl.id } }"
                                  >{{ hotpl.title }}</router-link
                                >
                              </div>
                              <div>
                                <div class="h2" v-if="getUser">
                                  <img
                                    :src="change[index]"
                                    style="width: 2.5rem; height: 2.5rem"
                                    size="sm"
                                    type="default"
                                    @click="changeHeart(hotpl.id, index)"
                                  />
                                </div>
                                <span
                                  class="h5"
                                  v-if="controll[index] && change[index] === '/img/icons/noti/heart-color.png'"
                                  >좋아요 {{ hotpl.good + 1 }}</span
                                >
                                <span class="h5" v-else-if="!controll[index]">좋아요 {{ hotpl.good }}</span>
                                <br />
                                <span class="h5">조회수 {{ hotpl.hit }}</span>
                              </div>
                            </div>
                            <p class="card-text">
                              <small class="text-muted">작성자: {{ hotpl.writer_id }}</small
                              ><br />
                              <small class="text-muted">{{ hotpl.write_time }}</small>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="mb-4" v-else>등록된 게시물이 없습니다.</div>
              </div>
            </div>
          </div>
        </card>
      </div>
    </section>
  </div>
</template>

<script>
import http from "@/util/http-common.js";
import BaseNav from "@/components/BaseNav";
import BaseDropdown from "@/components/BaseDropdown";
import { mapState } from "vuex";
export default {
  name: "HotplList",
  components: {
    BaseNav,
    BaseDropdown,
  },
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
          src: String,
        },
      ],
      likes: [
        {
          hotplace_id: Number,
        },
      ],
      change: [],
      controll: [],
      value: [],
      selected: "write_time",
      options: [
        { text: "최신글", value: "write_time" },
        { text: "좋아요수", value: "good" },
        { text: "조회수", value: "hit" },
      ],
      search: "",
      areas_si: [
        { value: 1, text: "서울" },
        { value: 2, text: "인천" },
        { value: 3, text: "대전" },
        { value: 4, text: "대구" },
        { value: 5, text: "광주" },
        { value: 6, text: "부산" },
        { value: 7, text: "울산" },
        { value: 8, text: "세종특별자치시" },
      ],
      area: "",
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
    getlike() {
      for (let i = 0; i < this.hotpls.length; i++) {
        for (let j = 0; j < this.likes.length; j++) {
          if (this.hotpls[i].id === this.likes[j].hotplace_id) {
            this.$set(this.change, i, "/img/icons/noti/heart-color.png");
          }
        }
      }
      return true;
    },
  },
  created() {
    if (this.$route.params.id != 0) {
      this.area = this.areas_si[this.$route.params.id - 1].text;
    }
    http.get(`/hotplaceapi/hotplace/${this.$route.params.id}/write_time/none`).then(({ data }) => {
      this.hotpls = data;
      for (let i = 0; i < data.length; i++) {
        this.$set(this.change, i, "/img/icons/noti/heart-bean.png");
        this.$set(this.controll, i, false);
        this.hotpls[i].src = `/img/upload/${data[i].img}`;
      }
    });

    if (this.getUser) {
      http.get(`/likeapi/likehotpl/${this.loginUser.id}`).then(({ data }) => {
        this.likes = data;
      });
    }
  },
  methods: {
    hotplRegist() {
      this.$router.push({ name: "HotplRegist" });
    },
    moveMain() {
      this.$router.push({ name: "HotplMain" });
    },
    async reloadList() {
      console.log(this.search.length, this.selected);
      if (this.search.length < 1) {
        await http.get(`/hotplaceapi/hotplace/${this.$route.params.id}/${this.selected}/none`).then(({ data }) => {
          this.hotpls = data;
          for (let i = 0; i < data.length; i++) {
            this.$set(this.change, i, "/img/icons/noti/heart-bean.png");
            this.$set(this.controll, i, false);
            this.hotpls[i].src = `/img/upload/${data[i].img}`;
          }
        });
      } else {
        await http
          .get(`/hotplaceapi/hotplace/${this.$route.params.id}/${this.selected}/${this.search}`)
          .then(({ data }) => {
            this.hotpls = data;
            for (let i = 0; i < data.length; i++) {
              this.$set(this.change, i, "/img/icons/noti/heart-bean.png");
              this.$set(this.controll, i, false);
              this.hotpls[i].src = `/img/upload/${data[i].img}`;
            }
          });
      }
      await http.get(`/likeapi/likehotpl/${this.loginUser.id}`).then(({ data }) => {
        this.likes = data;
      });
      this.getlike;
    },
    changeHeart(id, index) {
      if (this.change[index] === "/img/icons/noti/heart-color.png") {
        http.put(`/hotplaceapi/good/${id}/-1`);

        http.delete(`/likeapi/likehotpl/${this.loginUser.id}/${id}`).then(() => {
          let msg = "좋아요가 취소되었습니다.";
          alert(msg);
          this.$set(this.change, index, "/img/icons/noti/heart-baen.png");
          this.$router.go(0);
        });
      } else {
        http
          .post("/likeapi/likehotpl", {
            user_id: this.loginUser.id,
            hotplace_id: id,
          })
          .then(() => {
            this.$set(this.change, index, "/img/icons/noti/heart-color.png");
          });

        http.put(`/hotplaceapi/good/${id}/1`);

        this.$set(this.controll, index, true);
      }
    },
  },
};
</script>

<style></style>
