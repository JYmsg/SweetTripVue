<template>
  <div class="profile-page">
    <section class="section-profile-cover section-shaped my-0">
      <div class="shape shape-login"></div>
    </section>
    <section class="section section-skew">
      <div class="container">
        <card shadow class="card-profile mt--300" no-body>
          <div class="px-4">
            <div class="row justify-content-center">
              <div class="col-lg-3 order-lg-2">
                <div class="card-profile-image">
                  <a href="#">
                    <img v-lazy="'img/logo/boarding-pass.png'" class="rounded-circle" />
                  </a>
                </div>
              </div>
              <div class="btn"></div>
              <div class="col-lg-4 order-lg-3 text-lg-right align-self-lg-center">
                <div class="card-profile-actions py-4 mt-lg-0">
                </div>
              </div>
              <div class="col-lg-4 order-lg-1">
                <div class="card-profile-stats d-flex justify-content-center">
                </div>
              </div>
            </div>
            <div class="text-center mt-5">
              <h3>
                {{ loginUser.id }}
                <span class="font-weight-light">, {{ loginUser.age }}</span>
              </h3>
              <div class="h6 font-weight-300">
                <i class="ni location_pin mr-2"></i>SSAFY, Seoul 20
              </div>
              <div class="h6 mt-4">
                <i class="ni business_briefcase-24 mr-2"></i>JAVA 전공반에서 공부중 - 유럽으로
                여행이 가고싶다.
              </div>
              <div><i class="ni education_hat mr-2"></i>휴양지 여행을 즐기는 타입</div>
            </div>
            <!-- <calendar/> -->
            <tabs fill class="flex-column flex-md-row">
              <card shadow class="mb-4">
                <tab-pane key="tab1">
                  <template slot="title"> <i class="ni ni-cart"></i> MY PLACE </template>
                  <div v-if="getCarts && cartslength != 0" id="resultBox" style="width: 100%">
                    <div
                      class="row card m-3 col-lg-11 col-sm-11"
                      v-for="cart in carts"
                      :key="cart.content_id"
                    >
                      <div class="row g-0" v-if="cart.place != null">
                        <div class="col-md-3">
                          <img
                            style="height: 200px; width: 300px"
                            :src="`${cart.place.first_image}`"
                            class="img-fluid rounded-start"
                            alt="test"
                          />
                        </div>
                        <div class="col-md-8">
                          <div class="card-body">
                            <h5 class="card-title">{{ cart.place.title }}</h5>
                            <p class="card-text">
                              <small class="text-muted">{{
                                cart.place.addr1 + " " + cart.place.addr2
                              }}</small>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div class="row g-0" v-else>
                        <div class="col-md-3" @click="moveHot(cart.hotplace.id)">
                          <img
                            style="height: 200px; width: 300px"
                            :src="`${cart.hotplace.img}`"
                            class="img-fluid rounded-start"
                            alt="test"
                          />
                        </div>
                        <div class="col-md-8">
                          <div class="card-body">
                            <h5 class="card-title">{{ cart.hotplace.name }}</h5>
                            <p class="card-text">
                              <small class="text-muted">{{ cart.hotplace.address }}</small>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else style="text-align: center">
                    <h4>찜한 장소가 없습니다.</h4>
                    <div>
                      <base-button
                        type="primary"
                        size="sm"
                        class="justify-content-end"
                        @click="moveSearch()"
                        >지금바로 넣으러 가기!</base-button
                      >
                    </div>
                  </div>
                </tab-pane>
                <tab-pane key="tab2">
                  <template slot="title">
                    <i class="ni ni-calendar-grid-58"></i> Calendar
                  </template>
                  <div>
                    <div v-if="!showNotSave" class="w-50" style="margin: 0 auto">
                      <calendar @showPlan="showPlan"></calendar>
                    </div>
                    <div v-if="show && !showNotSave" id="resultBox" style="width: 100%">
                      <div
                        class="row card m-3 col-lg-11 col-sm-11 pb-0"
                        v-for="plan in show"
                        :key="plan.id"
                        @click="moveDetail(plan.id)"
                      >
                        <div class="row">
                          <div class="col-lg-12 col-sm-12 p-0">
                            <div class="card-body col-lg-12">
                              <h5 class="card-title">{{ plan.title }}</h5>
                              <p class="card-text">
                                <small class="text-muted">{{
                                plan.startdate + "~" + plan.enddate
                                }}</small>
                              </p>
                              <div v-for="(day, index) in plan.days" :key="day.id">
                                <p class="mb-1">day{{ index+1 }} : </p>
                                <div style="white-space : nowrap; display:inline;" v-for="place in day.places" :key="place.content_id">
                                - {{place.title}}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <not-save :notsavePlans="notsavePlans" v-if="showNotSave"></not-save>
                    {{ value }}
                    <div class="m-2" v-if="!showNotSave">
                      임시저장된 일정이 {{ notsave }}개 있습니다.
                      <b-button size="sm" class="ml-2" @click="showNotSave = true">임시저장 일정 보러가기</b-button>
                    </div>
                    <div class="m-2" v-else>
                      <b-button size="sm" class="ml-2" @click="showNotSave = false">달력 보러가기</b-button>
                    </div>
                  </div>
                </tab-pane>
              </card>
            </tabs>
          </div>
        </card>
      </div>
    </section>
  </div>
</template>
<script>
import http from "@/util/http-common.js";
import calendar from "./Calendar.vue"
import { mapState } from "vuex";
import TabPane from "@/components/Tabs/TabPane.vue";
import Tabs from "@/components/Tabs/Tabs.vue";
import notSave from "./component/planNotSave.vue"
export default {
  data() {
    return {
      plans: [
        {
          id: Number,
          title: String,
          startdate: String,
          enddate: String,
          user_id: String,
          save: Number,
        },
      ],
      select: [
        {
          id: Number,
          title: String,
          startdate: String,
          enddate: String,
          user_id: String,
          save: Number,
        },
      ],
      carts: [],
      cartslength: 0,
      value: null,
      notsave: 0,
      str: "",
      show: null,
      notsavePlans: [],
      showNotSave: false,
    };
  },
  components: {
    Tabs,
    TabPane,
    calendar,
    notSave,
  },
  created() {
    const now = new Date();
    this.value = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    http.get(`travelapi/travel/list/${this.loginUser.id}`).then(({ data }) => {
      this.plans = data;
      for (let i = 0; i < data.length; i++) {
        if (data[i].save == 0) {
          this.notsave += 1;
          this.$set(this.notsavePlans, this.notsave - 1, data[i]);
        }
      }
    });
  },
  computed: {
    ...mapState(["loginUser"]),
    async getCarts() {
      console.log("computed", this.loginUser);
      await http.get("/cartapi/cart/list/" + this.loginUser.id).then(({ data }) => {
        for (let i = 0; i < data.length; i++) {
          this.$set(this.carts, i, data[i]);
        }
        this.cartslength = this.carts.length;
      });
      return true;
    },
  },
  methods: {
    moveDetail(id) {
      this.$router.push({ name: "PlanDetail", params: { id: id }});
    },
    showPlan(showTravel) {
      this.show = showTravel;
    },
    moveSearch() {
      // console.log("move");
      this.$router.push({ name: "search" });
    },
    moveHot(index) {
      this.$router.push({ name: "HotplDetail", params: { id: index } });
    },
  },
};
</script>
<style></style>
