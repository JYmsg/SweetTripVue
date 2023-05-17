<template>
  <section class="page-section container" style="margin-top: 6rem; width: 60%">
    <div class="text-center">
      <span class="mt-3 h3 d-inline-block" id="tripListTitle">핫 플레이스 수정하기</span>
    </div>
    <div class="mb-4" id="write-title-div">
      <label for="title" class="h5">제목</label>
      <input type="text" class="form-control" id="title" name="title" v-model="hotpl.title" required />
    </div>
    <div class="mb-4" id="write-content-div">
      <label for="content" class="h5">내용</label>
      <textarea class="form-control" id="content" v-model="hotpl.content" rows="10" name="content" required></textarea>
    </div>
    <div class="mb-4">
      <label for="file" class="h5">사진 첨부</label>
      <input type="file" class="form-control" id="file" name="file" accept="image/*" />
    </div>
    <div class="mt-5 text-center">
      <button @click="updateHotpl">수정 완료</button>
    </div>
  </section>
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
