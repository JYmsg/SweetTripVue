<template>
  <div>
    {{ use_user }}
    <section class="page-section container text-center w-75">
      <div id="titleBox">
        <div class="dropdown text-start" style="margin-top: 8rem">
          <!-- <i id="threeDot" class="bi bi-three-dots fs-3" data-bs-toggle="dropdown" aria-expanded="false"></i> -->
          <base-dropdown tag="li" class="nav-item" v-show="isShow">
            <a slot="title" href="#" class="nav-link" data-toggle="dropdown" role="button"> &#9776; </a>
            <router-link :to="`modify/${hotpl.id}`" class="dropdown-item">수정</router-link>
            <a href="#" class="dropdown-item" @click="deleteHotpl">삭제</a>
          </base-dropdown>
        </div>
        <span class="text-center h1 d-inline-block">
          {{ hotpl.title }}
        </span>
      </div>
      <h3 class="section-subheading text-muted">
        {{ hotpl.write_time }} <br />
        {{ hotpl.writer_id }}
      </h3>
      <div>&#128065; {{ hotpl.hit }} &nbsp;&nbsp;&nbsp;&nbsp; &#9829; {{ hotpl.like }}</div>
      <div class="mt-3">
        {{ hotpl.img }}
      </div>
      <div id="view" class="textBox text-center mt-3">
        <p>{{ hotpl.content }}</p>
      </div>
      <div class="text-end">
        <a class="btn" @click="moveList">목록 보기</a>
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
