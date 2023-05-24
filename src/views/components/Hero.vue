<template>
  <section class="section-hero section-shaped my-0">
    <div class="shape shape-style-1 shape-main" />

    <div class="container shape-container d-flex align-items-center">
      <div class="col px-0">
        <div class="row justify-content-center align-items-center">
          <div class="col-lg-7 text-center pt-lg">
            <h1 class="text-white" style="text-shadow: 3px 3px #2d63a7; font-size: 4em">
              SWEET TRIP, 당신의 여행 플래너
            </h1>
            <p class="lead text-white mt-4 mb-5" style="text-shadow: 3px 3px #2d63a7; font-size: 1.5em">
              지금 바로 어디든 떠나보세요 ✈️ Sweet Trip이 여러분과 함께합니다
            </p>
          </div>
        </div>
        <div class="row align-items-center justify-content-around stars-and-coded">
          <div class="col-md-4 col-sm-4">
            <base-button block type="primary" class="mb-3" @click="modal = true" v-if="getUser">
              여행 계획을 세우러 가요!
            </base-button>
            <base-button block type="primary" class="mb-3" v-else @click="moveLogin()">
              로그인하고 시작하기
            </base-button>
            <modal :show.sync="modal">
              <h6 slot="header" class="modal-title ml-2" id="modal-title-default">
                <i class="ni ni-cloud-download-95 mr-3"></i>여행 정보를 입력해주세요.
              </h6>
              <!-- DataPickers -->
              <div class="col-md-11 mt-4 mt-md-0">
                <p class="d-block text-uppercase font-weight-bold mb-2">여행 제목</p>
                <div class="row align-items-center">
                  <div class="col">
                    <base-input placeholder="Title" v-model="title" addon-left-icon="ni ni-tag"> </base-input>
                  </div>
                </div>
              </div>
              <date-pickers :range="range" @sendRange="sendRange"></date-pickers>

              <div class="col-md-11 mt-4 mt-md-0">
                <p class="d-block text-uppercase font-weight-bold mb-2">초대 하기</p>
                <div v-if="adds != []">
                  <div v-for="(add, index) in adds" :key="add.id">
                    <base-input
                      addon-right-icon="ni ni-fat-remove"
                      class="text-center"
                      readonly
                      @click="removeUser(index)"
                      :value="add.id + '(' + add.email + ')'"
                    >
                    </base-input>
                  </div>
                </div>
                <b-dropdown class="dropdown mt-4 mt-md-0" text="다른 유저의 아이디를 검색하여 추가하세요.">
                  <div class="m-2" style="width: 20rem">
                    <b-input-group class="m-1">
                      <b-input placeholder="Title" v-model="keyword" addon-left-icon="ni ni-tag"> </b-input>
                      <b-input-group-append>
                        <b-button @click="searchId"><i class="ni ni-check-bold"></i></b-button>
                      </b-input-group-append>
                    </b-input-group>
                  </div>
                  <b-dropdown-divider></b-dropdown-divider>
                  <div v-if="users.length">
                    <div v-for="(user, index) in users" :key="user.id">
                      <base-input
                        addon-right-icon="ni ni-fat-add"
                        class="p-2"
                        readonly
                        @click="addUser(index)"
                        :value="user.id + '(' + user.email + ')'"
                      >
                      </base-input>
                    </div>
                  </div>
                  <div v-else><p class="ml-5 mb-0">조건에 맞는 유저가 존재하지 않습니다.</p></div>
                </b-dropdown>
              </div>

              <template slot="footer">
                <base-button type="primary" @click="makeTravel()">Make a Plan</base-button>
                <base-button type="link" class="ml-auto" @click="modal = false">Close </base-button>
              </template>
            </modal>
          </div>
          <div class="col-sm-4 mt-4 mt-sm-0 text-right">
            <span class="text-white alpha-7">Made by MSG 🧂</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import http from "@/util/http-common.js";
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import Modal from "@/components/Modal.vue";
import { mapState } from "vuex";
const DatePickers = () => import("./JavascriptComponents/DatePickers");
export default {
  components: {
    DatePickers,
    Modal,
    flatPicker,
  },
  data() {
    return {
      modal: false,
      keyword: "",
      title: "",
      users: [],
      adds: [],
      range: "2023-06-01 to 2023-06-05",
    };
  },
  computed: {
    ...mapState(["loginUser"]),
    getUser() {
      console.log(this.loginUser);
      if (this.loginUser) {
        return true;
      } else {
        return false;
      }
    },
  },
  methods: {
    searchId() {
      this.users = [];
      http
        .get("/userapi/user/keyword/" + this.keyword)
        .then(({ data }) => {
          console.log(data);
          for (let i = 0; i < data.length; i++) {
            if (this.loginUser.id != data[i].id) {
              this.$set(this.users, i, data[i]);
            }
          }
        })
        .catch((err) => {
          alert("유저를 불러오는데 실패했습니다.");
        });
    },
    sendRange(range) {
      this.range = range;
      console.log(range);
    },
    addUser(index) {
      for (let i = 0; i < this.adds.length; i++) {
        if (this.adds[i].id == this.users[index].id) {
          this.$delete(this.users, index);
          return;
        }
      }
      this.$set(this.adds, this.adds.length, this.users[index]);
      this.$delete(this.users, index);
    },
    removeUser(index) {
      this.$delete(this.adds, index);
    },
    moveLogin() {
      this.$router.push({ name: "login" });
    },
    makeTravel() {
      var dates = this.range.split(" to ");
      console.log(this.add);
      http
        .post("/travelapi/travel", {
          users: this.adds,
          user_id: this.loginUser.id,
          title: this.title,
          startdate: dates[0],
          enddate: dates[1],
        })
        .then(({ data }) => {
          console.log(data);
          this.$router.push({ name: "PlanRegist", params: { id: data } });
        })
        .catch((e) => {
          alert("여행 계획 생성 실패");
        });
    },
  },
};
</script>
<style scoped></style>
