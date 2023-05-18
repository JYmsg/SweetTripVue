<template>
  <div>
    <section class="section-profile-cover section-shaped my-0">
      <div class="shape shape-login"></div>
    </section>
    <section class="section section-skew">
      <div class="container">
        <card shadow class="card-profile mt--300" no-body>
          <div class="px-4">
            <div class="row justify-content-center mt-3">
              <h4>핫 플레이스 수정하기</h4>
            </div>
            <div class="mb-4" id="write-title-div">
              <label for="title" class="h5">제목</label>
              <input type="text" class="form-control" id="title" name="title" v-model="hotpl.title" required />
            </div>
            <div class="mb-4" id="write-content-div">
              <label for="content" class="h5">내용</label>
              <textarea
                class="form-control"
                id="content"
                v-model="hotpl.content"
                rows="10"
                name="content"
                required
              ></textarea>
            </div>
            <div class="mb-4">
              <label for="file" class="h5">사진 첨부</label>
              <input type="file" class="form-control" id="file" name="file" accept="image/*" />
            </div>
            <div class="row m-3" style="justify-content: right">
              <b-button @click="updateHotpl">수정 완료</b-button>
              <b-button @click="moveList">취소</b-button>
            </div>
          </div>
        </card>
      </div>
    </section>
  </div>
</template>

<script>
import http from "@/util/http-common";

export default {
  name: "HotplModify",
  data() {
    return {
      hotpl: {
        id: 0,
        title: "",
        content: "",
        img: "",
      },
    };
  },
  methods: {
    updateHotpl() {
      http
        .put(`/hotplaceapi/hotplace`, {
          id: this.hotpl.id,
          title: this.hotpl.title,
          content: this.hotpl.content,
          // img: this.hotpl.img,
          img: "...png",
        })
        .then(({ data }) => {
          let msg = "수정 처리시 문제가 발생했습니다.";
          if (data === 1) {
            msg = "수정이 완료되었습니다.";
          }
          alert(msg);
          this.moveList();
        });
    },
    moveList() {
      this.$router.push({ name: "HotplList" });
    },
  },
  created() {
    http.get(`/hotplaceapi/hotplace/${this.$route.params.id}`).then(({ data }) => {
      this.hotpl.id = this.$route.params.id;
      this.hotpl.title = data.title;
      this.hotpl.content = data.content;
      this.hotpl.img = data.img;
    });
  },
};
</script>

<style></style>
