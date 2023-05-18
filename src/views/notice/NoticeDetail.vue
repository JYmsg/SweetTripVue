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
              <h2>{{ notice.title }}</h2>
            </div>
            <h4 class="section-subheading text-muted text-center">
              {{ notice.write_time }} <br />
              {{ notice.writer_id }}
            </h4>
            <div style="text-align: right">조회 {{ notice.hit }}</div>
            <div v-if="getUser" class="row mb-3 justify-content-center">
              <b-button :to="{ name: 'NoticeModify', params: { id: notice.id } }">수정</b-button>
              <b-button @click="noticeDelete">삭제</b-button>
            </div>
            <div class="row justify-content-center">
              <!-- <div>{{ notice.content }}</div> -->
              <b-form-textarea
                class="w-75"
                id="textarea-no-resize"
                rows="10"
                no-resize
                readonly
                v-model="notice.content"
              ></b-form-textarea>
            </div>
            <div class="row m-3" style="justify-content: right">
              <b-button @click="noticeList">목록</b-button>
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
  data() {
    return {
      notice: {
        id: 0,
        content: "",
        writer_id: "",
        title: "",
        write_time: "",
        hit: 0,
      },
    };
  },
  created() {
    http.get(`/noticeapi/notice/${this.$route.params.id}`).then(({ data }) => {
      this.notice = data;
    });
  },
  methods: {
    noticeList() {
      this.$router.push({ name: "NoticeList" });
    },
    noticeDelete() {
      http.delete(`/noticeapi/notice/${this.$route.params.id}`).then(({ data }) => {
        let msg = "삭제 처리시 문제가 발생했습니다.";
        if (data === "success") {
          msg = "삭제가 완료되었습니다.";
        }
        alert(msg);
        this.noticeList();
      });
    },
  },
  computed: {
    ...mapState(["loginUser"]),
    getUser() {
      if (this.loginUser) {
        if (this.loginUser.id === this.notice.writer_id) return true;
        return false;
      } else {
        return false;
      }
    },
  },
};
</script>

<style scoped>
.content {
  margin: 0 auto;
}
</style>
