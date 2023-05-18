<template>
  <div>
    <section class="section-profile-cover section-shaped my-0">
      <div class="shape shape-login"></div>
    </section>
    <section class="section section-skew">
      <div class="container">
        <card shadow class="card-profile mt--300" no-body>
          <div class="px-4">
            <div class="row justify-content-center m-4">
              <h3>핫 플레이스 등록하기</h3>
            </div>
            <div class="row">
              <div class="col">지도</div>
              <div class="col">
                <div class="mb-4" id="write-place-div">
                  <div class="ml-2" style="text-align: left">위치</div>
                  <input type="text" placeholder="위치를 검색해 선택하세요" class="form-control" readonly />
                </div>
                <div class="mb-4" id="write-title-div">
                  <div class="ml-2" style="text-align: left">제목</div>
                  <input
                    type="text"
                    placeholder="제목을입력하세요"
                    class="form-control"
                    id="title"
                    name="title"
                    v-model="hotpl.title"
                  />
                </div>
                <div class="mb-4" id="write-content-div">
                  <div class="ml-2" style="text-align: left">내용</div>
                  <textarea
                    placeholder="내용을입력하세요"
                    class="form-control"
                    id="content"
                    v-model="hotpl.content"
                    rows="10"
                    name="content"
                  ></textarea>
                </div>
                <div class="mb-4">
                  <div class="ml-2" style="text-align: left; color: red">이미지 최대 1개</div>
                  <input type="file" class="form-control" id="file" name="file" accept="image/*" />
                </div>
                <div class="row m-3" style="justify-content: right">
                  <b-button @click="createHotpl">등록 완료</b-button>
                  <b-button @click="moveList">취소</b-button>
                </div>
              </div>
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
      hotpl: {
        title: "",
        content: "",
        writer_id: "",
        latitude: "",
        longitude: "",
        img: "",
      },
    };
  },
  methods: {
    createHotpl() {
      console.log(this.hotpl);
      if (this.hotpl.img === "") this.hotpl.img = null;
      http
        .post("/hotplaceapi/hotplace", {
          title: this.hotpl.title,
          content: this.hotpl.content,
          writer_id: this.getUser,
          latitude: 1.1,
          longitude: 1.1,
          img: this.hotpl.img,
        })
        .then(({ data }) => {
          let msg = "등록 처리시 문제가 발생했습니다.";
          if (data === 1) {
            msg = "등록이 완료되었습니다.";
          }
          alert(msg);
          this.moveList();
        });
    },
    moveList() {
      this.$router.push({ name: "HotplList" });
    },
  },
  computed: {
    ...mapState(["loginUser"]),
    getUser() {
      console.log(this.loginUser);
      if (this.loginUser) {
        return this.loginUser.id;
      } else {
        return null;
      }
    },
  },
};
</script>
<style></style>
