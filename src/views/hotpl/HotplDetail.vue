<template>
  <div>
    <section class="section-profile-cover section-shaped my-0">
      <div class="shape shape-login"></div>
    </section>
    <section class="section section-skew">
      <div class="container">
        <card shadow class="card-profile mt--300" no-body>
          <div class="row">
            <div class="col" style="border: 1px solid red">지도</div>
            <div class="px-4 col" style="border: 1px solid blue">
              <div class="form-row m-4" v-if="getUser">
                <base-dropdown tag="li" class="nav-item">
                  <a slot="title" href="#" class="nav-link" data-toggle="dropdown" role="button"> &#9776; </a>
                  <router-link :to="`modify/${hotpl.id}`" class="dropdown-item">수정</router-link>
                  <a href="#" class="dropdown-item" @click="deleteHotpl">삭제</a>
                </base-dropdown>
              </div>
              <div class="row justify-content-center text-center mt-2">
                <h2>{{ hotpl.title }}</h2>
              </div>
              <h5 class="section-subheading text-muted text-center">
                {{ hotpl.write_time }} <br />
                {{ hotpl.writer_id }}
              </h5>
              <div class="text-center">
                &#128065; {{ hotpl.hit + 1 }} &nbsp;&nbsp;&nbsp;&nbsp; &#9829; {{ hotpl.like }}
              </div>
              <div class="mt-3 row justify-content-center">
                {{ hotpl.img }}
              </div>
              <div class="row justify-content-center">
                <b-form-textarea
                  class="w-75"
                  id="textarea-no-resize"
                  rows="10"
                  no-resize
                  readonly
                  v-model="hotpl.content"
                ></b-form-textarea>
              </div>
              <div class="form-row float-right m-3">
                <b-button class="btn" @click="moveList">목록 보기</b-button>
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
import BaseDropdown from "@/components/BaseDropdown";
import { mapState } from "vuex";

export default {
  name: "HotplDetail",
  data() {
    return {
      hotpl: {
        id: 0,
        title: "",
        content: "",
        img: "",
        hit: 0,
        like: 0,
        write_time: "",
        writer_id: "",
      },
    };
  },
  created() {
    http.get(`/hotplaceapi/hotplace/${this.$route.params.id}`).then(({ data }) => {
      // console.log(data);
      this.hotpl = data;
    });
  },
  components: {
    BaseDropdown,
  },
  methods: {
    deleteHotpl() {
      http.delete(`/hotplaceapi/hotplace/${this.$route.params.id}`).then(({ data }) => {
        let msg = "삭제 처리시 문제가 발생했습니다.";
        if (data === 1) {
          msg = "삭제가 완료되었습니다.";
        }
        alert(msg);
        this.moveList();
      });
    },
    moveList() {
      this.$router.push({ name: "HotplList" });
    },
  },
  computed: {
    ...mapState(["loginUser"]),
    getUser() {
      if (this.loginUser) {
        if (this.loginUser.id === this.hotpl.writer_id) return true;
        return false;
      } else {
        return false;
      }
    },
  },
};
</script>

<style></style>
