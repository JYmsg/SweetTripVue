<template>
  <section class="section section-shaped section-lg my-0">
    <div class="shape shape-style-1 shape-login"></div>
    <div class="container pt-lg-md">
      <div class="row justify-content-center">
        <div class="col-lg-5" style="padding-left: 4.5rem; padding-right: 4.5rem">
          <card type="secondary" shadow header-classes="bg-white pb-5" body-classes="px-lg-5 py-lg-5" class="border-0">
            <template>
              <div class="text-muted text-center mb-3"></div>
              <div class="btn-wrapper text-center">
                <base-button type="neutral">
                  <img slot="icon" src="img/logo/kakao.png" />
                  Kakao
                </base-button>
                      <base-button type="neutral">
                          <img slot="icon" src="img/logo/naver.jpg">
                          Naver
                      </base-button>
                  </div>
              </template>
              <template>
                  <div class="text-center text-muted mb-4">
                      <!-- <small>직접 </small> -->
                  </div>
                  <form role="form">
                      <base-input alternative
                                  v-model="id"
                                  class="mb-3"
                                  placeholder="Id"
                                  addon-left-icon="ni ni-key-25">
                      </base-input>
                      <base-input alternative
                                  v-model="password"
                                  type="password"
                                  placeholder="Password"
                                  addon-left-icon="ni ni-lock-circle-open">
                      </base-input>
                      <base-checkbox>
                          Remember me
                      </base-checkbox>
                      <div class="text-center">
                          <base-button type="primary" class="my-4" @click="login">Login</base-button>
                      </div>
                  </form>
              </template>
          </card>
          <div class="row mt-3">
              <div class="col-6">
                  <a href="#" class="text-light">
                      <small style="color:black">비밀번호를 잊으셨나요?</small>
                  </a>
              </div>
              <div class="col-6 text-right">
                  <router-link to="register" class="text-light">
                      <small style="color:black">회원가입 하러 가기 ✏️</small>
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
// import http from "@/util/http-common.js";
// import axios from "axios";
export default {
  data() {
    return {
      id: "",
      password: "",
      msg: false,
    };
  },
  methods: {
    ...mapActions(["setLoginUser"]),
    login() {
      let user = {
        id: this.id,
        password: this.password,
      };
      this.setLoginUser(user);
    },
  },
};
</script>
<style></style>
