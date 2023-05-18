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
import axios from "axios";

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
      this.$emit("update-hotpl", this.hotpl);
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
      })
      .catch(() => {
        alert("정보 요청에 실패했습니다.");
      });
  },
};
</script>

<style></style>
