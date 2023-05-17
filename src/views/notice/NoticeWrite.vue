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
              <h4>공지사항 등록하기</h4>
            </div>
            <div class="mb-4" id="write-title-div">
              <label for="title" class="h5">제목</label>
              <input
                type="text"
                class="form-control"
                placeholder="제목을 입력하세요."
                id="title"
                name="title"
                v-model="notice.title"
                required
              />
            </div>
            <div class="mb-4" id="write-content-div">
              <label for="content" class="h5">내용</label>
              <textarea
                class="form-control"
                id="content"
                v-model="notice.content"
                rows="15"
                name="content"
                placeholder="내용을 입력하세요."
                required
              ></textarea>
            </div>
            <div class="row m-3" style="justify-content: right">
              <b-button class="mr-3" @click="noticeRegist">등록</b-button>
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
        title: "",
        content: "",
        writer_id: "",
      },
    };
  },
  methods: {
    noticeRegist() {
      http
        .post("/noticeapi/notice", {
          content: this.notice.content,
          writer_id: this.$route.params.writer_id,
          title: this.notice.title,
        })
        .then(({ data }) => {
          let msg = "등록 처리시 문제가 발생했습니다.";
          if (data === 1) {
            msg = "등록이 완료되었습니다.";
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
