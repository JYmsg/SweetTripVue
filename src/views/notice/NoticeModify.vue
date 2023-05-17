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
              <h4>공지사항 수정하기</h4>
            </div>
            <div class="mb-4" id="write-title-div">
              <label for="title" class="h5">제목</label>
              <input type="text" class="form-control" id="title" name="title" v-model="notice.title" required />
            </div>
            <div class="mb-4" id="write-content-div">
              <label for="content" class="h5">내용</label>
              <textarea
                class="form-control"
                id="content"
                v-model="notice.content"
                rows="15"
                name="content"
                required
              ></textarea>
            </div>
            <div class="row m-3" style="justify-content: right">
              <b-button class="mr-3" @click="noticeModify">수정</b-button>
              <b-button @click="noticeList">취소</b-button>
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
  data() {
    return {
      notice: {
        id: "",
        content: "",
        title: "",
      },
    };
  },
  created() {
    http.get(`/noticeapi/notice/${this.$route.params.id}`).then(({ data }) => {
      this.notice.id = this.$route.params.id;
      this.notice.title = data.title;
      this.notice.content = data.content;
    });
  },
  methods: {
    noticeModify() {
      http
        .put(`/noticeapi/notice`, {
          id: this.notice.id,
          title: this.notice.title,
          content: this.notice.content,
        })
        .then(({ data }) => {
          let msg = "수정 처리시 문제가 발생했습니다.";
          if (data === 1) {
            msg = "수정이 완료되었습니다.";
          }
          alert(msg);
          this.noticeList();
        });
    },
    noticeList() {
      this.$router.push({ name: "NoticeList" });
    },
  },
};
</script>

<style></style>
