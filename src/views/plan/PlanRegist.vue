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
                <div id="attractions" v-for="place in day.places" :key="place.content_id" class="p-1">
                  <div v-if="place">
                    <div id="att_img_box" class="mb-1">
                      <img id="att_img" :src="`${place.first_image}`" alt="">
                    </div>
                    <div id="att_address_box" class="text-center mb-1">
                      <h4 class="mt-2 mb-0">{{ place.title }}</h4>
                      <p>{{place.addr1}}</p>
                    </div>
                  </div>
                </div>      
                <div class="text-center pb-2 mt-2">
                  <base-button class="btn-2 p-1 pt-2" type="light" icon="ni ni-fat-add" style="box-shadow: none; width: 2rem; height: 2rem;" @click="dumy(index)"></base-button>
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
                <!-- <div class="hot" v-else>
                  <div id="cart_img_box" class="mb-1">
                    <img id="cart_img" src="img/theme/profile.jpg" alt="">
                  </div>
                  <div id="address_box" class="text-center mb-1">
                    <h4 class="mt-2 mb-0" style="color: white">{{cart.hotplace.name}}</h4>
                    <p> {{cart.hotplace.address}} </p>
                  </div>
                </div> -->
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
          <modal :show.sync="modal">
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
      modal: false,
      moveLine: null,
      clickLine: null,
      distanceOverlay: null,
      dots : [],
      markers: [],
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
  watch:{
    travel : {
      handler(newtravel){
        // console.log("travel", newtravel);
        this.makeMarkers(12);
      },
      deep: true,
    },
    'travel.days[0].places': {
      handler(val){
        // console.log("days0", val);
        this.makeMarkers(0);
      },
      deep: true,
    },
    'travel.days': {
      handler(val){
        // console.log(this.travel.days[0].places);
        // console.log("daysall", val);
        this.initLine();
      },
      deep : true,
    }
  },
  methods: {
    initMap() {
      var container = document.getElementById("map");
      var options = {
          center: new kakao.maps.LatLng(37.500613, 127.036431), // 지도의 중심좌표
          level: 5, // 지도의 확대 레벨
      };
      this.map = new kakao.maps.Map(container, options);
    },
    makeMarkers(index){
      console.log(index);
    },
    initLine(){
      this.deleteClickLine();
      this.deleteDistnce();
      this.deleteCircleDot();
      // for(let i=0; i<this.travel.days[0].places.length; i++){
      if(this.travel.days[0].places != null){
        var firstPosition = new kakao.maps.LatLng(this.travel.days[0].places[0].latitude, this.travel.days[0].places[0].longitude);
        this.clickLine = new kakao.maps.Polyline({
            map: this.map, // 선을 표시할 지도입니다 
            path: [firstPosition], // 선을 구성하는 좌표 배열입니다 클릭한 위치를 넣어줍니다
            strokeWeight: 3, // 선의 두께입니다 
            strokeColor: '#db4040', // 선의 색깔입니다
            strokeOpacity: 1, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
            strokeStyle: 'solid' // 선의 스타일입니다
        });
        // this.moveLine = new kakao.maps.Polyline({
        //     strokeWeight: 3, // 선의 두께입니다 
        //     strokeColor: '#db4040', // 선의 색깔입니다
        //     strokeOpacity: 0.5, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
        //     strokeStyle: 'solid' // 선의 스타일입니다    
        // });
        this.displayCircleDot(firstPosition, 0);
        console.log(this.travel.days[0].places.length);
        for(let j=1; j<this.travel.days[0].places.length; j++){
          var path = this.clickLine.getPath();
          var clickPosition = new kakao.maps.LatLng(this.travel.days[0].places[j].latitude, this.travel.days[0].places[j].longitude);
          path.push(clickPosition);
          this.clickLine.setPath(path);

          var distance = Math.round(this.clickLine.getLength());
          this.displayCircleDot(clickPosition, distance);
        }
      }

      if(path.length > 1){
        if(this.dots[this.dots.length-1].distance){
          this.dots[this.dots.length-1].distance.setMap(null);
          this.dots[this.dots.length-1].distance = null;
        }
        var distance = Math.round(this.clickLine.getLength()),
            content = this.getTimeHTML(distance);

        this.showDistance(content, path[path.length-1]);
      }else{
        this.deleteClickLine();
        this.deleteCircleDot(); 
        this.deleteDistnce();
      }
    },
    showDistance(content, position) {
    
      if (this.distanceOverlay) { // 커스텀오버레이가 생성된 상태이면     
        // 커스텀 오버레이의 위치와 표시할 내용을 설정합니다
        this.distanceOverlay.setPosition(position);
        this.distanceOverlay.setContent(content);
          
      } else { // 커스텀 오버레이가 생성되지 않은 상태이면         
          // 커스텀 오버레이를 생성하고 지도에 표시합니다
          this.distanceOverlay = new kakao.maps.CustomOverlay({
            map: this.map, // 커스텀오버레이를 표시할 지도입니다
            content: content,  // 커스텀오버레이에 표시할 내용입니다
            position: position, // 커스텀오버레이를 표시할 위치입니다.
            xAnchor: 0,
            yAnchor: 0,
            zIndex: 3
          });      
      }
    },
    displayCircleDot(position, distance){
      // 클릭 지점을 표시할 빨간 동그라미 커스텀오버레이를 생성합니다
      var circleOverlay = new kakao.maps.CustomOverlay({
        content: '<span class="dot"></span>',
        position: position,
        zIndex: 1
      });
      circleOverlay.setMap(this.map);
      if(distance > 0) {
        var distanceOverlay = new kakao.maps.CustomOverlay({
            content: '<div class="dotOverlay">거리 <span class="number">' + distance + '</span>m</div>',
            position: position,
            yAnchor: 1,
            zIndex: 2
        });

        // 지도에 표시합니다
        distanceOverlay.setMap(this.map);
      }
      this.$set(this.dots, this.dots.length, {circle: circleOverlay, distance: distanceOverlay});
    },
    deleteClickLine(){
      if(this.clickLine){
        this.clickLine.setMap(null);
        this.clickLine = null;
      }
    },
    deleteDistnce(){
      if(this.distanceOverlay){
        this.distanceOverlay.setMap(null);
        this.distanceOverlay = null
      }
    },
    deleteCircleDot(){
      for(let i=0; i<this.dots.length; i++){
        if(this.dots[i].circle){
          this.dots[i].circle.setMap(null);
        }
      }
      this.dots = [];
    },
    getTimeHTML(distance){
      // 도보의 시속은 평균 4km/h 이고 도보의 분속은 67m/min입니다
      var walkkTime = distance / 67 | 0;
      var walkHour = '', walkMin = '';

      // 계산한 도보 시간이 60분 보다 크면 시간으로 표시합니다
      if (walkkTime > 60) {
          walkHour = '<span class="number">' + Math.floor(walkkTime / 60) + '</span>시간 '
      }
      walkMin = '<span class="number">' + walkkTime % 60 + '</span>분'

      // 자전거의 평균 시속은 16km/h 이고 이것을 기준으로 자전거의 분속은 267m/min입니다
      var bycicleTime = distance / 227 | 0;
      var bycicleHour = '', bycicleMin = '';

      // 계산한 자전거 시간이 60분 보다 크면 시간으로 표출합니다
      if (bycicleTime > 60) {
          bycicleHour = '<span class="number">' + Math.floor(bycicleTime / 60) + '</span>시간 '
      }
      bycicleMin = '<span class="number">' + bycicleTime % 60 + '</span>분'

      // 거리와 도보 시간, 자전거 시간을 가지고 HTML Content를 만들어 리턴합니다
      var content = '<ul class="dotOverlay distanceInfo">';
      content += '    <li>';
      content += '        <span class="label">총거리</span><span class="number">' + distance + '</span>m';
      content += '    </li>';
      content += '    <li>';
      content += '        <span class="label">도보</span>' + walkHour + walkMin;
      content += '    </li>';
      content += '    <li>';
      content += '        <span class="label">자전거</span>' + bycicleHour + bycicleMin;
      content += '    </li>';
      content += '</ul>'

      return content;
    },
    dumy(index){
      let dumy1 = {
        content_id: 839237,
        sido_code: 1,
        gugun_code: 1,
        title: "카페티퍼스트에비뉴",
        addr1: "서울특별시 강남구 도산대로59길 9",
        first_image: "http://tong.visitkorea.or.kr/cms/resource/30/1922330_image2_1.jpg",
        content_type_id: 39,
        latitude: 37.52450471,
        longitude: 127.0419442
      };
      let dumy2 = {
        content_id: 1066064,
        sido_code: 1,
        gugun_code: 1,
        title: "한일축제한마당 in Seoul",
        addr1: "서울특별시 강남구 영동대로 513 코엑스",
        first_image: "http://tong.visitkorea.or.kr/cms/resource/26/2822726_image2_1.jpg",
        content_type_id: 15,
        latitude: 37.5119176,
        longitude: 127.059218
      };
      let dumy3 = {
        content_id: 2845175,
        sido_code: 1,
        gugun_code: 1,
        title: "카페 노티드 삼성",
        addr1: "서울특별시 강남구 테헤란로103길 9 제일빌딩",
        first_image: "http://tong.visitkorea.or.kr/cms/resource/66/2845166_image2_1.jpg",
        latitude: 37.510104,
        longitude: 127.0639093,
      }
      this.travel.days[index].places = [];
      console.lo
      this.$set(this.travel.days[index].places, 0, dumy1);
      this.$set(this.travel.days[index].places, 1, dumy2);
      this.$set(this.travel.days[index].places, 2, dumy3);
      console.log(this.travel);
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
#cart_img, #att_img{
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
#att_img_box{
  float: left;
  width: 33%;
  height: 6rem;
}
#att_address_box{
  float: right;
  width: 66%;
  height: 6rem;
  background: #F8F6F4;
  overflow: hidden;
}
#attractions{
  width: 100%;
  height: 6.5rem;
  /* background-color: #A5D7E8; */
  background-color: black;
}




/* by kakao */
.dot {overflow:hidden;float:left;width:12px;height:12px;background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/mini_circle.png');}    
.dotOverlay {position:relative;bottom:10px;border-radius:6px;border: 1px solid #ccc;border-bottom:2px solid #ddd;float:left;font-size:12px;padding:5px;background:#fff;}
.dotOverlay:nth-of-type(n) {border:0; box-shadow:0px 1px 2px #888;}    
.number {font-weight:bold;color:#ee6152;}
.dotOverlay:after {content:'';position:absolute;margin-left:-6px;left:50%;bottom:-8px;width:11px;height:8px;background:url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white_small.png')}
.distanceInfo {position:relative;top:5px;left:5px;list-style:none;margin:0;}
.distanceInfo .label {display:inline-block;width:50px;}
.distanceInfo:after {content:none;}
</style>