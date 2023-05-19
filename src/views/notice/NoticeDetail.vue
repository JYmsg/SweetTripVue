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
            <div style="text-align: right">조회 {{ notice.hit + 1 }}</div>
            <div v-if="getUser" class="row mb-3 justify-content-center">
              <b-button v-if="loginUser.id === 'admin'" :to="{ name: 'NoticeModify', params: { id: notice.id } }"
                >수정</b-button
              >
              <b-button v-else @click="noticeDelete">삭제</b-button>
            </div>
            <div class="row mb-3 justify-content-center">
              <b-button v-if="loginUser.id === 'admin'" @click="noticeDelete">삭제</b-button>
            </div>
            <div class="row justify-content-center">
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

        <div class="comment justify-content-center">
          <div class="row align-items-center m-3">
            <b-form-textarea
              no-resize
              name="comment"
              cols="35"
              rows="2"
              v-model="write.content"
              placeholder="댓글을 입력하세요"
            ></b-form-textarea>
            <b-button size="sm" variant="outline-primary" class="ml-3" @click="checkComment">등록</b-button>
          </div>
          <div class="row mb-5 ml-4">
            <b-form-checkbox v-model="write.pr" id="checkbox-1" name="checkbox-1" value="1" unchecked-value="0">
              <b-icon icon="lock-fill"></b-icon>
            </b-form-checkbox>
          </div>
          <div>
            <ul class="list-unstyled">
              <b-media tag="li" v-for="(comment, index) in comments" :key="index">
                <template #aside>
                  <b-img blank blank-color="#abc" width="64" alt="placeholder" style="margin-right: 1rem"></b-img>
                </template>
                <h5 class="mt-0 mb-1">{{ comment.writer_id }}</h5>
                <div v-if="comment.pr == 0">
                  <div class="mb-4 mr-3" v-if="loginUser.id === comment.writer_id">
                    {{ comment.content }}
                    <b-button size="sm" variant="outline-primary" class="ml-3" @change="deleteComment">삭제</b-button>
                  </div>
                  <div class="mb-4" v-else>
                    {{ comment.content }}
                  </div>
                </div>
                <div v-else>
                  <div v-if="loginUser.id === comment.writer_id" class="mb-4 mr-3">
                    {{ comment.content }}
                    <b-button size="sm" variant="outline-primary" class="ml-3" @click="deleteComment(comment.id)"
                      >삭제</b-button
                    >
                  </div>
                  <div v-else-if="loginUser.id === notice.writer_id">
                    <p class="mb-4">
                      {{ comment.content }}
                    </p>
                  </div>
                  <div v-else>
                    <p class="mb-3"><b-icon icon="lock-fill"></b-icon>비밀댓글입니다.</p>
                  </div>
                </div>
              </b-media>
            </ul>
          </div>
        </div>
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
      comments: [
        {
          id: 0,
          content: "",
          pr: 0,
          writer_id: "",
          notice_id: "",
        },
      ],
      write: {
        content: "",
        pr: 0,
      },
    };
  },
  created() {
    http.put(`/noticeapi/hit`, {
      id: this.$route.params.id,
    });
    http.get(`/noticeapi/notice/${this.$route.params.id}`).then(({ data }) => {
      this.notice = data;
    });
    http.get(`/commentapi/comment/${this.$route.params.id}`).then(({ data }) => {
      this.comments = data;
    });
  },
  methods: {
    noticeList() {
      this.$router.push({ name: "NoticeList" });
    },
    noticeDelete() {
      http.delete(`/noticeapi/notice/${this.$route.params.id}`).then(({ data }) => {
        let msg = "삭제 처리시 문제가 발생했습니다.";
        if (data === 1) {
          msg = "삭제가 완료되었습니다.";
        }
        alert(msg);
        this.noticeList();
      });
    },
    checkComment() {
      if (!this.loginUser) {
        alert("로그인 후 이용해 주세요.");
        this.$router.push({ name: "Login" });
      } else {
        this.registComment();
      }
    },
    registComment() {
      http
        .post("/commentapi/comment", {
          content: this.write.content,
          writer_id: this.loginUser.id,
          notice_id: this.notice.id,
          pr: this.write.pr,
        })
        .then(() => {
          this.$router.go(0);
        });
    },
    deleteComment(id) {
      http.delete(`/commentapi/comment/${id}`).then(({ data }) => {
        let msg = "삭제 처리시 문제가 발생했습니다.";
        if (data === 1) {
          msg = "삭제가 완료되었습니다.";
        }
        alert(msg);
        this.$router.go(0);
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
.comment {
  width: 80%;
  margin: 0 auto;
}
.comment textarea {
  width: 90%;
}
.comment button {
  float: right;
}
</style>
