<template>
  <div>
    <section class="section-profile-cover section-shaped my-0">
      <div class="shape shape-login"></div>
    </section>
    <section class="section section-skew">
      <div class="container">
        <card shadow class="card-profile mt--300" no-body>
          <div class="px-4">
            <div class="row justify-content-center m-5">
              <h3>⚠️ QnA ⚠️</h3>
            </div>
            <div v-if="getUser && loginUser.id === 'admin'" class="row m-2" style="justify-content: right">
              <b-button @click="noticeWrite">공지사항 등록</b-button>
            </div>
            <div v-else-if="getUser" class="row m-2" style="justify-content: right">
              <b-button @click="noticeWrite">질문 하기</b-button>
            </div>
            <div class="row justify-content-center">
              <b-table
                hover
                style="cursor: pointer"
                :items="getData"
                :fields="fields"
                :tbody-tr-class="rowClass"
                class="text-center"
                @row-clicked="viewNotice"
              ></b-table>
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
  name: "light-table",
  data() {
    return {
      fields: ["writer_id", "title", "write_time", "hit"],
      boards: [
        {
          id: 0,
          content: "",
          writer_id: "",
          title: "",
          write_time: "",
          hit: 0,
        },
      ],
    };
  },
  computed: {
    ...mapState(["loginUser"]),
    getData() {
      return this.boards;
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
    http.get("/noticeapi/notice").then(({ data }) => {
      this.boards = data;
    });
  },
  methods: {
    noticeWrite() {
      this.$router.push({ name: "NoticeWrite" });
    },
    viewNotice(notice) {
      if (!this.loginUser) {
        alert("로그인 후 이용해 주세요");
        this.$router.push({ name: "login" });
        return;
      }
      this.$router.push({
        name: "NoticeDetail",
        params: { id: notice.id },
      });
    },
    rowClass(item, type) {
      if (!item || type !== "row") return;
      if (item.writer_id === "admin") return "table-warning";
    },
  },
};
</script>
<style></style>
