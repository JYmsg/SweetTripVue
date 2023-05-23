<template>
<div>
    <section class="section-profile-cover section-shaped my-0">
      <div class="shape shape-login"></div>
    </section>
    <section class="section section-skew">
      <div class="container">
        <card shadow class="card-profile mt--300" no-body>
          <div class="px-4">
            <div class="form-row mt-3 ml-4">
              <base-dropdown tag="li" class="nav-item">
                <a slot="title" href="#" class="nav-link" data-toggle="dropdown" role="button"> &#9776; </a>
                <router-link :to="`/plan/regist/${travel.id}`" class="dropdown-item">수정</router-link>
                <a href="#" class="dropdown-item">삭제</a>
              </base-dropdown>
            </div>
            <div class="row justify-content-center m-5">
              <h3> {{ travel.title }}에 대한 여행 계획</h3>
            </div>
            <div class="row justify-content-center mt-5 mb-5 ml-2" style="width: 100%; height: 50vh;">
              <div id="map" style="width: 100%; height: 100%;">
              </div>
            </div>
            <div class="mt-1 ml-1 mr-1 mb-5" v-for="(day, index) in travel.days" :key="day.id">
              <div class="row">
                <div class="row">
                  <h5 class="m-4 day_title" :style="'text-decoration-color:'+colors[index]">Day{{ index+1 }}({{ day.date }})</h5>
                </div>
                <div class="mt-5 ml-1 mb-3" v-for="(place, idx) in day.places" :key="place.content_id">
                  <div :style="'height: 7.5rem; width: 10rem; border-radius: 40px 80px / 80px 40px; border: 2px solid '+colors[index]" class="float-left">
                    <base-button type="" outline class="p-1 float-right mr-1" style="height:1.5rem; font-size:10px; min-width:1.5rem;" @click="detailMore(index, place)">+</base-button>
                    <p class="p-3">{{ idx+1 }}번째 장소
                    <br>
                    {{ place.title }}
                    <br>
                    {{ times[place.starttime-1]+'~'+times[place.endtime-1] }}
                    </p>
                  </div>
                  <hr :style="'border:5px solid '+ colors[index]" width="150rem;" class="mt-5 float-left">
                </div>
              </div>
            </div>
          </div>
        </card>
      </div>
    </section>
    <modal id="planSearchModal" :show.sync="modal" v-if="modalPlace">
        <h3 slot="header" class="modal-title ml-2" id="modal-title-default">{{ modalPlace.title }}</h3>
        <div class="row">
          <div class="col-md-6 col-lg-6 mt-4 mt-md-0">
            <p class="d-block text-uppercase font-weight-bold mb-2">장소 도착 시간</p>
            <div class="row align-items-center">
              <div class="col">
                <base-input v-model="times[modalPlace.starttime-1]" class="me-2 rounded-4" readonly></base-input>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-6 mt-4 mt-md-0">
            <p class="d-block text-uppercase font-weight-bold mb-2">장소 떠날 시간</p>
            <div class="row align-items-center">
              <div class="col">
                <base-input class="me-2 rounded-4" v-model="times[modalPlace.endtime-1]" readonly></base-input>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-3" v-show="modalPlace.memo != null">
          <div class="col-md-12 col-lg-12 mt-3 mb-0 ml-0 mr-0">
              <p class="d-block text-uppercase font-weight-bold mb-2">메모</p>
              <div class="row align-items-center">
                <div class="col">
                  <textarea
                      placeholder="메모가 없습니다."
                      class="form-control"
                      id="content"
                      v-model="modalPlace.memo"
                      rows="3"
                      readonly
                    ></textarea>
                </div>
              </div>
          </div>
        </div>
        <img id="modal_img" :src="`${modalPlace.first_image}`" alt="">
        <p class="m-2">{{modalPlace.overview}}</p>
        <template slot="footer">

            <base-button type="link" class="ml-auto" @click="modal = false">Close
            </base-button>
        </template>
    </modal>
  </div>
</template>
<script>
import BaseDropdown from "@/components/BaseDropdown";
import http from "@/util/http-common.js";
import Modal from "@/components/Modal.vue";
import { mapState } from 'vuex';
export default {
  components:{
    Modal,
    BaseDropdown,
  },
  data() {
    return {
      travel: null,
      map: null,
      modal: false,
      modalPlace: null,
      colors: ['#dc3545', '#fd7e14', '#ffc107', '#28a745', '#20c997', '#17a2b8', '#007bff', '#6610f2', '#6f42c1'], //9가지 색
      times: [
        "00:00",
        "00:30",
        "01:00",
        "01:30",
        "02:00",
        "02:30",
        "03:00",
        "03:30",
        "04:00",
        "04:30",
        "05:00",
        "05:30",
        "06:00",
        "06:30",
        "07:00",
        "07:30",
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00",
        "20:30",
        "21:00",
        "21:30",
        "22:00",
        "22:30",
        "23:00",
        "23:30"
      ]
    }
  },
  computed: {
    ...mapState(["loginUser"]),
  },
  mounted() {
    if (!this.loginUser) {
      alert("로그인해야 계획을 짤 수 있습니다.")
      this.$router.push({ name: "home" });
      }
    if (!window.kakao || !window.kakao.maps) {
      const script = document.createElement("script");
      script.src = "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=610bf6cd591542b654c6ececbd7a14b0&libraries=services,clusterer,drawing";
      script.addEventListener("load", () => {
          kakao.maps.load(this.initMap);
      });
      document.head.appendChild(script);
    } else {
        this.initMap();
    }
  },
  async created(){
    await http.get("/travelapi/travel/one/"+this.$route.params.id)
    .then(({data})=>{
      this.travel = data;
      for (let i = 0; i < data.days.length; i++) { 
        for (let j = 0; j < data.days[i].places.length; j++) {
          if (data.days[i].places[j].starttime == null) {
            data.days[i].places[j].starttime = 1;
          } 
          if (data.days[i].places[j].endtime == null) {
            data.days[i].places[j].endtime = 1;
          } 
        }
      }
    })
    .catch((e)=>{
      alert("여행 정보를 가져오는데 실패했습니다.");
      this.$router.push({name: "home"});
    });
  },
  methods: {
    detailMore(index, place) {
      console.log(place)
      http.get("/placeapi/place/one/"+this.travel.days[index].id+"/"+place.content_id)
        .then(({ data }) => {
          if (data.starttime == null) data.starttime = 1;
          if (data.endtime == null) data.endtime = 1;
          this.modalPlace = {
              title: place.title,
              overview: data.overview,
              first_image: place.first_image,
              starttime: data.starttime,
              endtime: data.endtime,
              memo: data.memo
          }
          console.log(this.modalPlace);
      })
      this.modal = true;
    },
    initMap() {
      var container = document.getElementById("map");
      var options = {
          center: new kakao.maps.LatLng(37.500613, 127.036431), // 지도의 중심좌표
          level: 8, // 지도의 확대 레벨
      };
      this.map = new kakao.maps.Map(container, options);
      // this.initMap();
    },
  }
}
</script>
<style>
.day_title{
  text-decoration-line: underline;
  text-decoration-thickness: 4px;
}
</style>