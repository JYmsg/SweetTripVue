<template>
  <div>
    <section class="section-profile-cover section-shaped my-0">
      <div class="shape shape-login"></div>
    </section>
    <section class="section section-skew">
      <div class="container">
        <card shadow class="card-profile mt--300" no-body>
          <div class="px-4">
            <div class="row justify-content-center mt-5">
              <h3>다른 사람들의 여행 일정을 구경해보세요!</h3>
            </div>
            <!-- <div class="row m-1" style="justify-content: right">
              <b-button variant="outline-info" size="sm" >목록으로</b-button>
            </div>
            <div class="row m-1" style="justify-content: right">
              <div class="btn btn-outline-warning float-end d-inline">핫 플레이스 등록하기</div>
            </div>
            <b-form-group>
              <b-form-radio-group
                id="radio-group-1"
                v-model="selected"
                :options="options"
                name="radio-options"
              ></b-form-radio-group>
            </b-form-group> -->
            <!-- <input type="text" placeholder="제목으로 검색하세요." v-model="search" /> -->
            <b-button class="ml-3" size="sm" >확인</b-button>

            <hr />
            <div class="row justify-content-center">
              <div class="hotpl-list" style="width: 90%">
                <div v-if="travels.length != 0">
                  <div v-for="(travel, index) in travels" :key="index">
                    <div class="card mb-3 text-start">
                      <div class="row g-0">
                        <div class="col-md-3">
                          <img style="width: 100%; height: 100%" :src="travel.first_image" />
                        </div>
                        <div class="col-md-9">
                          <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                              <div>
                                <router-link
                                  class="card-title m-0 h5"
                                  :to="{ name: 'PlanDetail', params: { id: travel.id } }"
                                  >{{ travel.title }}</router-link
                                >
                              </div>
                              <!-- <div> -->
                                <!-- <div class="h2" v-if="getUser">
                                  <img
                                    :src="change[index]"
                                    style="width: 2.5rem; height: 2.5rem"
                                    size="sm"
                                    type="default"
                                    @click="changeHeart(hotpl.id, index)"
                                  />
                                </div> -->
                                <!-- <span
                                  class="h5"
                                  v-if="controll[index] && change[index] === 'img/icons/noti/heart-color.png'"
                                  >좋아요 {{ hotpl.good + 1 }}</span
                                > -->
                                <!-- <span class="h5" v-else-if="!controll[index]">좋아요 {{ hotpl.good }}</span>
                                <br />
                                <span class="h5">조회수 {{ hotpl.hit }}</span> -->
                              <!-- </div> -->
                            </div>
                            <p class="card-text">
                              <small class="text-muted">다녀온 사람: {{ travel.user_id }}</small
                              ><br />
                              
                            </p>
                            <div v-for="(day, index) in travel.days" :key="day.id">
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
import http from "@/util/http-common.js";
import { mapState } from "vuex";
export default {
  name: "HotplList",
  // components: {
  //   BaseNav,
  //   BaseDropdown,
  // },
  data() {
    return {
      travels : [],
    };
  },
  computed: {
    ...mapState(["loginUser"]),
  },
  created() {
    http.get("/travelapi/travel/list")
    .then(({ data }) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].save == 1) { // 저장된 데이터만 가져온다.
          this.$set(this.travels, this.travels.length, data[i]);
          console.log(data[i]);
          if (data[i].days != null) {
            for (let j = 0; j < data[i].days.length; j++){
              for (let k = 0; k < data[i].days[j].places.length; k++) {
                if (data[i].days[j].places[k].first_image != null) {
                  this.travels[this.travels.length - 1].first_image = data[i].days[j].places[k].first_image;
                }
              }
            }
          }
        }
      }
    });
  },
  methods: {
    // hotplRegist() {
    //   this.$router.push({ name: "HotplRegist" });
    // },
    // moveMain() {
    //   this.$router.push({ name: "HotplMain" });
    // },
  },
};
</script>

<style></style>
