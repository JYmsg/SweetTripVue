<template>
  <section class="section section-shaped section-lg my-0">
    <div class="shape shape-style-1 shape-login"></div>
    <div class="container pt-lg-md">
      <div class="row justify-content-center">
        <div class="col-lg-5" style="padding-left: 4.5rem; padding-right: 4.5rem">
          <card
            type="secondary"
            shadow
            header-classes="bg-white pb-5"
            body-classes="px-lg-5 py-lg-5"
            class="border-0"
          >
            <template>
              <div class="text-muted text-center mb-3"></div>
              <div class="btn-wrapper text-center">
                <base-button type="neutral">
                  <img slot="icon" src="img/logo/kakao.png" />
                  Kakao
                </base-button>

                <base-button type="neutral">
                  <img slot="icon" src="img/logo/naver.jpg" />
                  Naver
                </base-button>
              </div>
            </template>
            <template>
              <div class="text-center text-muted mb-4"></div>
              <form role="form">
                <base-input
                  alternative
                  class="mb-3"
                  placeholder="Name"
                  v-model="name"
                  addon-left-icon="ni ni-single-02"
                >
                </base-input>
                <base-input
                  alternative
                  class="mb-2"
                  placeholder="ID"
                  v-model="id"
                  addon-left-icon="ni ni-key-25"
                >
                </base-input>
                <div class="mb-3">
                  <b-button size="sm" @click="duplicateCheck">ID중복검사</b-button>
                  <small style="color: green" v-if="duplicate === false"
                    >사용 가능한 아이디 입니다.</small
                  >
                  <small style="color: red" v-else-if="duplicate === true"
                    >사용할 수 없는 아이디 입니다.</small
                  >
                </div>
                <base-input
                  alternative
                  class="mb-2"
                  placeholder="Email"
                  v-model="email"
                  addon-left-icon="ni ni-email-83"
                >
                </base-input>
                <div class="mb-3">
                  <b-button size="sm" @click="emailCheck">Email 인증하기</b-button>
                  <div style="color: green" v-if="show" class="mt-2">
                    <input
                      type="text"
                      v-model="inputkey"
                      class="mr-2"
                      placeholder="인증코드를 입력하세요."
                    />
                    <small style="color: green" v-if="code != null && inputkey == code"
                      >인증되었습니다.</small
                    >
                  </div>
                </div>

                <base-input
                  alternative
                  type="password"
                  placeholder="Password"
                  v-model="password"
                  addon-left-icon="ni ni-lock-circle-open"
                >
                </base-input>
                <base-input
                  alternative
                  type="password"
                  placeholder="Password REPEAT"
                  v-model="repeat"
                  addon-left-icon="ni ni-lock-circle-open"
                >
                </base-input>
                <base-input
                  alternative
                  type="age"
                  placeholder="Age"
                  v-model="age"
                  addon-left-icon="ni ni-watch-time"
                >
                </base-input>
                <div class="text-muted font-italic">
                  <small v-if="msg" style="color: red"> {{ message }} </small>
                </div>
                <div class="text-center">
                  <base-button type="primary" class="my-4" @click="regist"
                    >Create account</base-button
                  >
                </div>
              </form>
            </template>
          </card>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import http from "@/util/http-common.js";
export default {
  data() {
    return {
      id: "",
      password: "",
      name: "",
      email: "",
      age: "",
      repeat: "",
      msg: false,
      message: "",
      duplicate: null,
      show: false,
      code: null,
      inputkey: "",
    };
  },
  methods: {
    duplicateCheck() {
      http.get(`/userapi/user/${this.id}`).then(({ data }) => {
        console.log("중복체크들어갑니다" + data);
        if (data.id != null) {
          this.duplicate = true;
        } else {
          this.duplicate = false;
        }
      });
    },
    emailCheck() {
      this.show = true;
      http
        .post("/userapi/mailcheck", {
          email: this.email,
        })
        .then(({ data }) => {
          alert("이메일을 보냈습니다.");
          console.log(data);
          this.code = data;
        })
        .catch(() => {
          this.email = "";
          alert("이메일 인증 실패");
        });
    },
    regist() {
      if (
        this.id === "" ||
        this.password === "" ||
        this.name === "" ||
        this.email === "" ||
        this.age === "" ||
        this.repeat === ""
      ) {
        this.msg = true;
        this.message = "정보를 전부 입력해 주세요.";
        return;
      }
      if (this.duplicate === null) {
        this.msg = true;
        this.message = "아이디 중복 검사를 진행해 주세요.";
        return;
      }
      if (this.duplicate === true) {
        this.msg = true;
        this.message = "사용할 수 없는 아이디입니다.";
        return;
      }
      if (this.password !== this.repeat) {
        this.msg = true;
        this.message = "비밀번호가 일치하지 않습니다.";
        return;
      }
      if (this.code === null) {
        this.msg = true;
        this.message = "이메일 인증을 진행해 주세요.";
        return;
      }
      http
        .post("/userapi/user", {
          id: this.id,
          password: this.password,
          name: this.name,
          email: this.email,
          age: this.age,
        })
        .then(() => {
          this.$router.push({ name: "login" });
        })
        .catch(() => {
          alert("회원가입 실패");
        });
    },
  },
};
</script>
<style></style>
