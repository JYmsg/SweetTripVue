<template>
    <section class="section section-shaped section-lg my-0">
        <div class="shape shape-style-1 shape-login">
        </div>
        <div class="container pt-lg-md">
            <div class="row justify-content-center">
                <div class="col-lg-5" style="padding-left: 4.5rem; padding-right: 4.5rem">
                    <card type="secondary" shadow
                          header-classes="bg-white pb-5"
                          body-classes="px-lg-5 py-lg-5"
                          class="border-0">
                        <template>
                            <div class="text-muted text-center mb-3">
                                
                            </div>
                            <div class="btn-wrapper text-center">
                                <base-button type="neutral">
                                    <img slot="icon" src="img/logo/kakao.png">
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
                                
                            </div>
                            <form role="form">
                                <base-input alternative
                                            class="mb-3"
                                            placeholder="Name"
                                            v-model="name"
                                            addon-left-icon="ni ni-single-02">
                                </base-input>
                                <base-input alternative
                                            class="mb-3"
                                            placeholder="ID"
                                            v-model="id"
                                            addon-left-icon="ni ni-key-25">
                                </base-input>
                                <base-input alternative
                                            class="mb-3"
                                            placeholder="Email"
                                            v-model="email"
                                            addon-left-icon="ni ni-email-83">
                                </base-input>
                                <base-input alternative
                                            type="password"
                                            placeholder="Password"
                                            v-model="password"
                                            addon-left-icon="ni ni-lock-circle-open">
                                </base-input>
                                <base-input alternative
                                            type="password"
                                            placeholder="Password REPEAT"
                                            v-model="repeat"
                                            addon-left-icon="ni ni-lock-circle-open">
                                </base-input>
                                <base-input alternative
                                            type="age"
                                            placeholder="Age"
                                            v-model="age"
                                            addon-left-icon="ni ni-watch-time">
                                </base-input>
                                <div class="text-muted font-italic">
                                    <small v-if="msg" style="color:red">
                                        정보를 다시 확인해주세요
                                    </small>
                                </div>
                                <base-checkbox>
                                    <span>I agree with the
                                        <a href="#">Privacy Policy</a>
                                    </span>
                                </base-checkbox>
                                <div class="text-center">
                                    <base-button type="primary" class="my-4" @click="regist">Create account</base-button>
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
import http from "@/util/http-common.js"
export default {
    data(){
        return {
            id: "",
            password: "",
            name: "",
            email: "",
            age: "",
            repeat: "",
            msg: false,
        }
    },
    methods: {
        regist(){
            http.post("/userapi/user", {
                id: this.id,
                password: this.password,
                name: this.name,
                email : this.email,
                age : this.age,
            })
            .then(({data}) => {
                this.$router.push({ name: "home" });
            })
            .catch(()=>{
                alert("회원가입 실패")
            })
        }
    }
};
</script>
<style>
</style>
