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
              <div class="col">
                
                지도
              </div>
              <div class="col">
                <div class="mb-4" id="write-place-div">
                  <div class="ml-2" style="text-align:left">위치</div>
                  <input type="text" placeholder="위치를 검색해 선택하세요" class="form-control" readonly required />
                </div>
                <div class="mb-4" id="write-title-div">
                  <div class="ml-2" style="text-align:left">제목</div>
                  <input type="text" placeholder="제목을입력하세요" class="form-control" id="title" name="title" v-model="title" required />
                </div>
                <div class="mb-4" id="write-content-div">
                  <div class="ml-2" style="text-align:left">내용</div>
                  <textarea placeholder="내용을입력하세요" class="form-control" id="content" v-model="content" rows="10" name="content" required></textarea>
                </div>
                <div class="mb-4">
                  <div class="ml-2" style="text-align:left; color:red">이미지 최대 1개</div>
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

export default {
  name: "HotplRegist",
  props: {
    id: {
      type: String,
    }
  },
  data() {
    return {
      title: "",
      content: "",
      writer_id: "",
      latitude:"",
      longitude:"",
      img:"",
    };
  },
  methods: {
    moveList() {
      this.$router.push({ name: "HotplList" });
    },
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
