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
            <div class="mb-2">
              <b-form-select v-model="find" :options="finds" style="width:15%;" class="mr-3"></b-form-select>
              <input type="text" placeholder=" 검색어를 입력해주세요." v-model="search" style="height: 2.7rem; border-radius: 5px 5px 5px 5px; border: 0.5px solid gray;"> <b-button class="ml-3" size="sm" @click="reloadList">확인</b-button>
            </div>
            <div>
              <b-table
                hover
                style="cursor: pointer"
                id="notice-table"
                :items="getData"
                :fields="fields"
                :tbody-tr-class="rowClass"
                :per-page="perPage"
                :current-page="currentPage"
                class="text-center"
                @row-clicked="viewNotice"
              ></b-table>
            </div>
          </div>
        </card>
      </div>
    </section>
    <b-pagination
      align="center"
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      style="font-family: Open Sans; font-size: 20px;"
      aria-controls="notice-table"
    ></b-pagination>
  </div>
</template>
<script>
import http from "@/util/http-common.js";
import { mapState } from "vuex";
export default {
  name: "light-table",
  data() {
    return {
      fields: [
        {
          key: 'writer_id',
          sortable: false,
          thClass: 'w20'
        },
        { 
          key: 'title',
          sortable: false,
          thClass: 'w50'
        }, 
        {
          key: 'write_time',
          sortable: true,
          thClass: 'w20'
        },
        {
          key: 'hit', 
          sortable: true,
          thClass: 'w10'
        }
      ],
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
      perPage:10,
      currentPage:1,
      finds: [
        {value: null, text: '검색 위치를 선택해 주세요.'},
        {value: "title", text: '제목'},
        {value: "writer_id", text: '작성자'},
      ],
      find: null,
      search: null,
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
    rows(){
      return this.boards.length
    }
  },
  created() {
    http.get("/noticeapi/notice/none/none").then(({ data }) => {
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
    reloadList(){
      if(this.search!=null){
        http.get(`/noticeapi/notice/${this.find}/${this.search}`).then(({ data }) => {
          this.boards = data;
        });
      }
    }
  },
};
</script>
<style>
th.w10{
  width:10%;
}
th.w20{
  width:20%;
}
th.w50{
  width:50%;
}
</style>
