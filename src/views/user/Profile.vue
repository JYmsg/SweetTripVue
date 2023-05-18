<template>
    <div class="profile-page">
        <section class="section-profile-cover section-shaped my-0">
            <div class="shape shape-login">
            </div>
        </section>
        <section class="section section-skew" v-if="getUser">
            <div class="container">
                <card shadow class="card-profile mt--300" no-body>
                    <div class="px-4">
                        <div class="row justify-content-center">
                            <div class="col-lg-3 order-lg-2">
                                <div class="card-profile-image">
                                    <a href="#">
                                        <img v-lazy="'img/logo/boarding-pass.png'" class="rounded-circle">
                                    </a>
                                </div>
                            </div>
                            <div class="col-lg-4 order-lg-3 text-lg-right align-self-lg-center">
                                <div class="card-profile-actions py-4 mt-lg-0">
                                    <base-button type="info" size="sm" class="mr-4">Connect</base-button>
                                    <base-button type="default" size="sm" class="float-right">Message</base-button>
                                </div>
                            </div>
                            <div class="col-lg-4 order-lg-1">
                                <div class="card-profile-stats d-flex justify-content-center">
                                    <div>
                                        <span class="heading">22</span>
                                        <span class="description">Friends</span>
                                    </div>
                                    <div>
                                        <span class="heading">10</span>
                                        <span class="description">Photos</span>
                                    </div>
                                    <div>
                                        <span class="heading">89</span>
                                        <span class="description">Comments</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text-center mt-5">
                            <h3>{{ loginUser.id }}
                                <span class="font-weight-light">, {{ loginUser.age }}</span>
                            </h3>
                            <div class="h6 font-weight-300"><i class="ni location_pin mr-2"></i>SSAFY, Seoul 20</div>
                            <div class="h6 mt-4"><i class="ni business_briefcase-24 mr-2"></i>JAVA 전공반에서 공부중 - 유럽으로 여행이 가고싶다.</div>
                            <div><i class="ni education_hat mr-2"></i>휴양지 여행을 즐기는 타입</div>
                        </div>
                        <!-- <calendar/> -->
                        <tabs fill class="flex-column flex-md-row">
                            <card shadow slot-scope="{activeTabIndex}">
                                <tab-pane key="tab2">
                                    <template slot="title">
                                        <i class="ni ni-calendar-grid-58"></i> Calendar
                                    </template>
                                    <div style="background-color: black;">
                                    Cosby sweater eu banh mi, qui irure terry richardson ex
                                        squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan
                                        american apparel, butcher voluptate nisi qui.</div>
                                </tab-pane>

                                <tab-pane key="tab3">
                                    <template slot="title">
                                        <i class="ni ni-cart"></i> Cart
                                    </template>

                                    <div id="resultBox" style="width: 100%">
                                        <div class='row card m-3 col-lg-11 col-sm-11' v-for="cart in carts" :key="cart.content_id">
                                            <div class='row g-0'><div class='col-md-3'>
                                                <img style='height:200px; width: 300px'
                                                :src="`${cart.place.first_image}`"
                                                class='img-fluid rounded-start' alt='test'></div><div class='col-md-8'>
                                                    <div class='card-body'>
                                                        <h5 class='card-title'>{{ cart.place.title }}</h5>
                                                        <p class='card-text'>
                                                            <small class='text-muted'>{{ cart.place.addr1 +" "+ cart.place.addr2}}</small>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </tab-pane>
                            </card>
                        </tabs>
                        <div class="m-3"></div>
                    </div>
                </card>
            </div>
        </section>
    </div>
</template>
<script>
import http from "@/util/http-common.js"
import { mapState } from "vuex";
import TabPane from "@/components/Tabs/TabPane.vue";
import Tabs from "@/components/Tabs/Tabs.vue";
export default {
    data(){
        return {
            carts : [],
            cartslength: 0,
        }
    },
    components: {
        Tabs,
        TabPane
    },
    computed: {
        ...mapState(["loginUser"]),
        async getUser() {
            console.log(this.loginUser);
            if (this.loginUser) {
                await this.getCarts();
                console.log("carts", this.carts);
                return true;
            } else {
                return false;
            }
        },
    },
    methods: {
        async getCarts(){
            await http.get("/cartapi/cart/list/" + this.loginUser.id)
            .then(({data})=>{
                for(let i=0; i<data.length; i++){
                    this.$set(this.carts, i, data[i]);
                }
                return this.carts.length;
            }).catch((err)=>{
                return 0;
            })
        },
    }
};
</script>
<style>
</style>
