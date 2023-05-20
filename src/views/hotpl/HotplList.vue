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
            <div v-if="getUser" class="row m-1" style="justify-content: right">
              <div class="btn btn-outline-warning float-end d-inline" @click="hotplRegist">핫 플레이스 등록하기</div>
            </div>

            <b-form-group >
              <b-form-radio-group
                id="radio-group-1"
                v-model="selected"
                :options="options"
                name="radio-options"
              ></b-form-radio-group>
            </b-form-group>
            <input type="text" placeholder="제목으로 검색하세요." v-model="search"> <b-button class="ml-3" size="sm" @click="reloadList">확인</b-button>

            <hr />
            <div class="row justify-content-center">
              <div class="hotpl-list" style="width: 90%">
                <div v-if="hotpls.length">
                  <div v-for="(hotpl, index) in hotpls" :key="index">
                    <div class="card mb-3 text-start">
                      <div class="row g-0">
                        <div v-if="hotpl.img.length == 0" class="col-md-3">
                          <img style="width: 100%; height: 100%" src="../../../public/img/logo/noupload.jpg" />
                        </div>
                        <div v-else class="col-md-3">
                          {{ hotpl.img }}
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
                                <!-- <p class="h2">
                                  <b-icon icon="heart" v-if="checkLike(hotpl.id)"></b-icon>
                                  <b-icon icon="heart-fill" v-else></b-icon>
                                </p> -->
                                <span>좋아요 {{ hotpl.good }}</span
                                ><br />
                                <span>조회수 {{ hotpl.hit }}</span>
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
        },
      ],
      like :[
        {
          user_id: String,
          hotplace_id: Number,
        },
      ],
      selected: 'write_time',
      options: [
        { text: '최신글', value: 'write_time' },
        { text: '좋아요수', value: 'good' },
        { text: '조회수', value: 'hit' },
      ],
      search: ""
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
    http.get("/hotplaceapi/hotplace/none/none").then(({ data }) => {
      this.hotpls = data;
    });
  },
  methods: {
    hotplRegist() {
      this.$router.push({ name: "HotplRegist" });
    },
    reloadList(){
      console.log(this.search.length, this.selected);
      if(this.search.length<1){
        http.get(`/hotplaceapi/hotplace/${this.selected}/none`).then(({ data }) => {
          this.hotpls = data;
        });
      } else{
        http.get(`/hotplaceapi/hotplace/${this.selected}/${this.search}`).then(({ data }) => {
          this.hotpls = data;
        });
      }
    },
    // checkLike(id){
    //   http.get(`/likehotplaceapi/likehotpl/${this.loginUser.id}/${id}`).then(({ data }) => {
    //     this.like = data;
    //   });
    //   if(this.like.length>0){
    //     return true;
    //   } else return false;
    // }
  },
};
</script>

<style></style>
