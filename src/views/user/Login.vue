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
              <div class="text-center text-muted mb-4">
                <!-- <small>직접 </small> -->
              </div>
              <form role="form">
                <base-input
                  alternative
                  v-model="id"
                  class="mb-3"
                  placeholder="Id"
                  addon-left-icon="ni ni-key-25"
                >
                </base-input>
                <base-input
                  alternative
                  v-model="password"
                  type="password"
                  placeholder="Password"
                  addon-left-icon="ni ni-lock-circle-open"
                >
                </base-input>
                <div class="text-center">
                  <base-button type="primary" class="my-4" @click="login">Login</base-button>
                </div>
                <div style="color: red" v-if="show_msg">{{ message }}</div>
              </form>
            </template>
          </card>
          <div class="row mt-3">
            <div class="col-6">
              <a href="#" class="text-light">
                <small style="color: black" @click="modal = true">비밀번호를 잊으셨나요?</small>
              </a>
              <modal :show.sync="modal">
                <h6 slot="header" class="modal-title ml-2" id="modal-title-default">
                  비밀번호 재설정하기
                </h6>

                <div>아이디를 입력하세요</div>
                <base-input
                  alternative
                  v-model="search_id"
                  class="mt-1"
                  placeholder="Id"
                  addon-left-icon="ni ni-key-25"
                >
                </base-input>
                <div style="float: right" v-if="success === null">
                  <b-button size="sm" @click="searchID">검색</b-button>
                </div>

                <div v-if="find === false" style="color: red">존재하지 않는 ID입니다.</div>
                <div v-else-if="find === true">
                  <div v-if="success === null">이메일을 보내는 중입니다.</div>

                  <div v-if="success === true">
                    <div class="mb-1">해당 회원의 이메일로 인증코드를 보냈습니다.</div>
                    <input type="text" v-model="val" placeholder="인증코드를 입력하세요." />
                    <b-button class="ml-2" size="sm" @click="checkCode">확인</b-button>
                  </div>
                </div>
                <div v-if="modify_pass === true" class="mt-3">
                  <div>새로운 비밀번호를 입력해 주세요.</div>
                  <base-input
                    class="mt-1"
                    alternative
                    v-model="newpassword"
                    type="password"
                    placeholder="Password"
                    addon-left-icon="ni ni-lock-circle-open"
                  >
                  </base-input>
                </div>

                <template slot="footer">
                  <div v-if="newpassword.length > 0">
                    <base-button type="primary" @click="updateInfo">수정하기</base-button>
                  </div>
                  <div v-else>
                    <base-button type="primary" disabled>수정하기</base-button>
                  </div>
                  <base-button type="link" class="ml-auto" @click="modal = false"
                    >Close
                  </base-button>
                </template>
              </modal>
            </div>
            <div class="col-6 text-right">
              <router-link to="register" class="text-light">
                <small style="color: black">회원가입 하러 가기 ✏️</small>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { mapActions } from "vuex";
import Modal from "@/components/Modal.vue";
import http from "@/util/http-common.js";
// import axios from "axios";
export default {
  components: {
    Modal,
  },
  data() {
    return {
      id: "",
      password: "",
      email: null,
      code: "",
      message: "",
      show_msg: false,
      modal: false,
      search_id: "",
      find: null,
      success: null,
      val: "",
      modify_pass: false,
      newpassword: "",
    };
  },
  methods: {
    ...mapActions(["setLoginUser"]),
    login() {
      console.log(this.id + this.password);
      if (this.id === "") {
        this.message = "아이디를 입력해주세요.";
        this.show_msg = true;
        return;
      } else if (this.password === "") {
        this.message = "비밀번호를 입력해주세요.";
        this.show_msg = true;
        return;
      }
      let user = {
        id: this.id,
        password: this.password,
      };
      this.setLoginUser(user);
    },
    searchID() {
      if (this.search_id.length < 1) {
        this.find = false;
        return;
      }
      http.get(`/userapi/user/${this.search_id}`).then(({ data }) => {
        console.log(data);
        if (data.id != null) {
          this.email = data.email;
          this.find = true;
          this.sendEmail();
        } else {
          this.find = false;
        }
      });
    },
    sendEmail() {
      console.log("hello");
      http
        .post("/userapi/mailcheck", {
          email: this.email,
        })
        .then(({ data }) => {
          alert("이메일을 보냈습니다.");
          console.log(data);
          this.code = data;
          this.success = true;
        })
        .catch(() => {
          alert("이메일 인증 실패");
          this.find = false;
          this.modal = false;
        });
    },
    checkCode() {
      if (this.val == this.code) {
        this.modify_pass = true;
      } else {
        this.modify_pass = false;
      }
    },
    updateInfo() {
      http
        .put(`/userapi/user`, {
          id: this.search_id,
          password: this.newpassword
        })
        .then(({ data }) => {
          let msg = "수정 처리시 문제가 발생했습니다.";
          if (data === 1) {
            msg = "수정이 완료되었습니다.";
          }
          alert(msg);
          this.modal=false;
        });
    },
  },
};
</script>
<style></style>
