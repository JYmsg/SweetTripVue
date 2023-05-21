<template>
<div style="width: 100vw; height: 100vh">
  <!-- <div class="row"> -->
    <div class="row no-gutters" style="width: 100vw; height: 100vh">
      <!-- 카카오 지도 : 8칸 -->
      <div class="col-lg-8 col-sm-8 m-0">
        <div id="map" style="width: 100%; height: 100%;"></div>
      </div>
      <!-- 계획표와 장바구니 : 4칸 -->
      <div class="row no-gutters col-lg-4 col-sm-4">
        <!-- 계획표는 할당된 곳의 7칸 -->
        <div class="col-lg-7 col-sm-7 m-0">
          <div id="sidebar" class="p-3">
            <div id="title_plan" class="text-center p-1">
              <h4 class="mt-2">여행 계획표</h4>
              <h5>{{travel.title}} : {{travel.startdate}} ~ {{travel.enddate}}</h5>
            </div>
            <div id="days" style="overflow:auto; max-height: 90vh;">
              <div id="day" class="mb-1" v-for="(day, index) in travel.days" :key="day.id">
                <h3 class="day pl-3 pt-1">Day{{index+1}}({{day.date}})</h3>
                  <div class="text-center pb-2">
                  <base-button class="btn-2 p-1 pt-2" type="light" icon="ni ni-fat-add" style="box-shadow: none; width: 2rem; height: 2rem;"></base-button>
                </div>          
              </div>
            </div>
          </div>
        </div>
        <!-- 장바구니는 5칸 -->
        <div class="col-lg-5 col-sm-5">
          <div id="bag" class="p-3">
            <div id="title_bag" class="text-center p-1">
              <h4 class="mt-2" style="color: white">장바구니</h4>
            </div>
            <div id="carts" style="overflow:auto; height: 92vh;" class="p-2" v-if="cartslength">



              <div id="cart" v-for="cart in carts" :key="cart.content_id" class="p-1">
                <div class="place" v-if="cart.place != null">
                  <div id="cart_img_box" class="mb-1">
                    <img id="cart_img" :src="`${cart.place.first_image}`" alt="">
                  </div>
                  <div id="address_box" class="text-center mb-1">
                    <h4 class="mt-2 mb-0" style="color: white">{{ cart.place.title }}</h4>
                    <p>{{cart.place.addr1}}</p>
                  </div>
                </div>
                <div class="hot" v-else>
                  <div id="cart_img_box" class="mb-1">
                    <img id="cart_img" src="img/theme/profile.jpg" alt="">
                  </div>
                  <div id="address_box" class="text-center mb-1">
                    <h4 class="mt-2 mb-0" style="color: white">{{cart.hotplace.name}}</h4>
                    <p> {{cart.hotplace.address}} </p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center">
              <h5>장바구니에 아무것도 없습니다.</h5>
            </div>
            <div id="buttons" class="mt-2" style="float: right;">
              <base-button class="btn-1 p-2" type="info">임시저장</base-button>
              <base-button class="btn-1 p-2" type="primary">계획완료</base-button>
              <base-button class="btn-1 p-2" type="warning">계획취소</base-button>
            </div>
          </div>
          <modal :show.sync="modals.modal1">
                <h6 slot="header" class="modal-title" id="modal-title-default">Type your modal title</h6>

                <p>Far far away, behind the word mountains, far from the countries Vokalia and
                    Consonantia, there live the blind texts. Separated they live in Bookmarksgrove
                    right at the coast of the Semantics, a large language ocean.</p>
                <p>A small river named Duden flows by their place and supplies it with the necessary
                    regelialia. It is a paradisematic country, in which roasted parts of sentences
                    fly into your mouth.</p>

                <template slot="footer">
                    <base-button type="primary">Save changes</base-button>
                    <base-button type="link" class="ml-auto" @click="modals.modal1 = false">Close
                    </base-button>
                </template>
            </modal>
        </div>
      </div>
    </div>
  <!-- </div> -->
</div>
</template>
<script>
import Modal from "@/components/Modal.vue";
import http from "@/util/http-common.js";
import { mapState } from 'vuex';
export default {
  components:{
    Modal,
  },
    data(){
        return{
            map: null,
            travel: null,
            carts: [],
            cartslength: 0,
            modals:{
              modal1: false,
            },
        }
    },
    async created(){
      await http.get("/travelapi/travel/one/"+this.$route.params.id)
      .then(({data})=>{
        this.travel = data;
      })
      .catch((e)=>{
        alert("여행 정보를 가져오는데 실패했습니다.");
        this.$router.push({name: "home"});
      });
      await http.get("/cartapi/cart/list/" + this.loginUser.id)
      .then(({ data }) => {
          for (let i = 0; i < data.length; i++){
          this.$set(this.carts, i, data[i]);
          }
          this.cartslength = this.carts.length;
      })
    },
    computed: {
      ...mapState(["loginUser"]),
    },
    mounted() {
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
  methods: {
    initMap() {
      var container = document.getElementById("map");
      var options = {
          center: new kakao.maps.LatLng(37.500613, 127.036431), // 지도의 중심좌표
          level: 3, // 지도의 확대 레벨
      };
      this.map = new kakao.maps.Map(container, options);
    },
  }
}
</script>
<style>
#sidebar{
  width: 100%;
  height: 100%;
  background-color: #F8F6F4;
}
#title_plan{
  background-color: #C4DFDF;
}
.day{
  background-color: #D2E9E9;
}
#days{
  background-color: #E3F4F4;
}
#bag{
  width: 100%;
  height: 100%;
  background-color: #0B2447;
}
#title_bag{
  background-color: #19376D;
}
#carts{
  color: whitesmoke;
  background-color: #576CBC;
}
#cart{
  width: 100%;
  height: 6.5rem;
  /* background-color: #A5D7E8; */
  background-color: #F8F6F4;
}
#cart_img_box{
  float: left;
  width: 33%;
  height: 6rem;
}
#cart_img{
  object-fit: cover;
  width: 100%;
  height: 100%
}
#address_box{
  float: right;
  width: 66%;
  height: 6rem;
  background: black;
  overflow: hidden;
}
</style>