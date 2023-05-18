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
              <div class="form-row m-4">
                <base-dropdown tag="li" class="nav-item" v-show="isShow">
                  <a slot="title" href="#" class="nav-link" data-toggle="dropdown" role="button"> &#9776; </a>
                  <router-link :to="`modify/${hotpl.id}`" class="dropdown-item">수정</router-link>
                  <a href="#" class="dropdown-item" @click="deleteHotpl">삭제</a>
                </base-dropdown>
              </div>
              <div class="row justify-content-center text-center">
                <h2>{{ hotpl.title }}</h2>
              </div>
              <h5 class="section-subheading text-muted">
                {{ hotpl.write_time }} <br />
                {{ hotpl.writer_id }}
              </h5>
              <div>&#128065; {{ hotpl.hit }} &nbsp;&nbsp;&nbsp;&nbsp; &#9829; {{ hotpl.like }}</div>
              <div class="mt-3">
                {{ hotpl.img }}
              </div>
              <div class="row justify-content-center">
                <!-- <div>{{ notice.content }}</div> -->
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
import axios from "axios";
import BaseDropdown from "@/components/BaseDropdown";

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
      isShow: true,
    };
  },
  components: {
    BaseDropdown,
  },
  methods: {
    deleteHotpl() {
      this.$emit("delete-hotpl", this.hotpl);
    },
    moveList() {
      this.$router.push({ name: "HotplList" });
    },
  },
  created() {
    const id = this.$route.params.id;
    console.log(id);
    const API_URL = `http://localhost:9999/trip/hotplaceapi/hotplace/${id}`;

    axios({
      url: API_URL,
      method: "get",
    })
      .then(({ data }) => {
        this.hotpl.id = data.id;
        this.hotpl.title = data.title;
        this.hotpl.content = data.content;
        this.hotpl.img = data.img;
        this.hotpl.hit = data.hit + 1;
        this.hotpl.like = data.like;
        this.hotpl.write_time = data.write_time;
        this.hotpl.writer_id = data.writer_id;
      })
      .catch(() => {
        alert("정보 요청에 실패했습니다.");
      });
    if (this.hotpl.writer_id === this.use_user.id) {
      this.isShow = true;
    }
  },
};
</script>

<style></style>
