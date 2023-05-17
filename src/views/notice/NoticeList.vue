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
              <h4>⚠️ 공지사항 ⚠️</h4>
            </div>
            <div v-if="user != null" class="row m-2" style="justify-content: right">
              <b-button @click="noticeWrite">공지사항 등록</b-button>
            </div>
            <div class="row justify-content-center">
              <b-table
                striped
                hover
                :items="getData"
                :fields="fields"
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
export default {
  name: "light-table",
  props: {
    user: null,
  },
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
    getData() {
      return this.boards;
    },
  },
  created() {
    http.get("/noticeapi/notice").then(({ data }) => {
      this.boards = data;
    });
  },
  methods: {
    noticeWrite() {
      this.$router.push({ name: "NoticeWrite", params: { writer_id: this.user.id } });
    },
    viewNotice(notice) {
      this.$router.push({
        name: "NoticeDetail",
        params: { id: notice.id },
      });
    },
  },
};
</script>
<style></style>
