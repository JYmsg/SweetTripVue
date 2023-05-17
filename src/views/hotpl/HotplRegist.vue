<template>
  <section class="page-section container" style="margin-top: 6rem; width: 60%">
    <div class="text-center">
      {{title}} hello
      <span class="mt-3 h3 d-inline-block" id="tripListTitle">핫 플레이스 등록하기</span>
    </div>
    <div class="mb-4" id="write-title-div">
      <label for="title" class="h5">제목</label>
      <input type="text" class="form-control" id="title" name="title" v-model="title" required />
    </div>
    <div class="mb-4" id="write-content-div">
      <label for="content" class="h5">내용</label>
      <textarea class="form-control" id="content" v-model="content" rows="10" name="content" required></textarea>
    </div>
    <div class="mb-4">
      <label for="file" class="h5">사진 첨부</label>
      <input type="file" class="form-control" id="file" name="file" accept="image/*" />
    </div>
    <div class="mt-5 text-center">
      <button @click="createHotpl">등록 완료</button>
    </div>
  </section>
</template>

<script>

export default {
  name: "HotplRegist",
  props: {
    id: {
      type: String,
    }
  },
  data() {
    return {
      title: "hi",
      content: "",
      writer_id: "",
      latitude:"",
      longitude:"",
      img:"",
    };
  },
  methods: {
    createHotpl() {
      console.log(this.title);
      if (
        this.title === "" ||
        this.content === ""
      ) {
        alert("모든 내용을 입력해주세요");
        return;
      }

      let hotpl = {
        title: this.title,
        content: this.content,
        writer_id: $route.params.id,
        latitude:1.1,
        longitude:1.1,
        img:"xxxx.png",
      };
      this.$emit("create-hotpl", hotpl);
    },
  },
};

<style></style>
