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
            <div class="row no-gutters">
              <div :id="Title[0]" class="text-center p-1 col-lg-6" @click="change(1)" >
                <h4 class="mt-2" :id="Title[0]">여행 계획표</h4>
              </div>
              <div :id="Title[1]" class="text-center p-1 col-lg-6" @click="change(2)">
                <h4 class="mt-2" :id="Title[1]">검색</h4>
                <!-- <h5>분리중</h5> -->
              </div>
            </div>
            <plan-list v-if="select" :travel="travel" :colors="colors" :drop="drop" @dumy="dumy" @onlyLine="onlyLine" @moveMap="moveMap"></plan-list>
            <plan-search v-else :daylength="daylength" :map="map" @addPlace="addPlace"></plan-search>
          </div>
        </div>
        <!-- 장바구니는 5칸 -->
        <div class="col-lg-5 col-sm-5">
          <div id="bag" class="p-3">
            <div id="title_bag" class="text-center p-1">
              <h4 class="mt-2" style="color: white">찜한 장소 목록</h4>
            </div>
            <div id="carts" style="overflow:auto; height: 85vh;" class="p-2" v-if="cartslength">
              <div id="cart" v-for="cart in carts" :key="cart.content_id" class="p-1">
                <div class="place" v-if="cart.place != null"
                  draggable="true"
                  @dragstart="moveCart(cart.place)"
                
                >
                  <div id="cart_img_box" class="mb-1">
                    <img id="cart_img" :src="`${cart.place.first_image}`" alt="">
                  </div>
                  <div id="address_box" class="text-center mb-1">
                    <h4 class="mt-2 mb-0" style="color: white">{{ cart.place.title }}</h4>
                    <p>{{cart.place.addr1}}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center">
              <h5 style="color: white" class="m-2">찜한 장소가 없습니다.</h5>
            </div>
            <div id="buttons" class="mt-2" style="float: right;">
              <base-button class="btn-1 p-2" type="info">임시저장</base-button>
              <base-button class="btn-1 p-2" type="primary" @click="submitTravel()">계획완료</base-button>
              <base-button class="btn-1 p-2" type="warning" @click="deleteTravel()">계획취소</base-button>
            </div>
          </div>
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
import PlanList from './element/PlanList.vue';
import PlanSearch from './element/PlanSearch.vue';
export default {
  components:{
    Modal,
    PlanList,
    PlanSearch,
  },
  data(){
    return{
      map: null,
      travel: null,
      carts: [],
      cartslength: 0,
      daylength: 0,
      modal: false,
      clickLines: [],
      distanceOverlays: [],
      dots : [],
      markers: [],
      select: true,
      Title: ["title_plan", "noTitle"],
      colors : ['#dc3545', '#fd7e14', '#ffc107', '#28a745', '#20c997', '#17a2b8', '#007bff', '#6610f2', '#6f42c1'], //9가지 색
      places: [],
      InfoWindow: null,
      movePlace: null,
    }
  },
  async created(){
    await http.get("/travelapi/travel/one/"+this.$route.params.id)
    .then(({data})=>{
      this.travel = data;
      this.daylength = data.days.length;
      for (let i = 0; i < this.daylength; i++) {
        this.$set(this.dots, i, []);
        this.$set(this.distanceOverlays, i, null);
        this.$set(this.clickLines, i, null);
      }
    })
    .catch((e)=>{
      alert("여행 정보를 가져오는데 실패했습니다.");
      this.$router.push({name: "home"});
    });

    await http.get("/cartapi/cart/list/" + this.loginUser.id)
      .then(({ data }) => {
        // console.log(data);
        for (let i = 0; i < data.length; i++){
        this.$set(this.carts, i, data[i]);
        }
        this.cartslength = this.carts.length;
      // console.log(this.carts);
      })
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
  methods: {
    moveCart(place) {
      this.movePlace = place;
    },
    addPlace(index, place){
      if(this.travel.days[index].places == null) this.travel.days[index].places = [];
      this.$set(this.travel.days[index].places, this.travel.days[index].places.length, place);
      this.onlyLine(index);

    },
    moveMap(lat, lng) {
      this.map.setCenter(new kakao.maps.LatLng(lat, lng));
      this.map.setLevel(3);
    },
    change(index){
      if(index == 1){
        this.Title[1] = "noTitle";
        this.Title[0] = "title_plan";
        this.select = true;
      }
      else{
        this.Title[0] = "noTitle";
        this.Title[1] = "title_plan";
        this.select = false;
      }
      this.initMap();

    },
    initMap() {
      var container = document.getElementById("map");
      var options = {
          center: new kakao.maps.LatLng(37.500613, 127.036431), // 지도의 중심좌표
          level: 8, // 지도의 확대 레벨
      };
      this.map = new kakao.maps.Map(container, options);
      if(this.select){
        this.initLine();
      }else{
        this.distanceOverlays = [];
        this.markers = [];

      }
    },
    onlyLine(i) {
      // 전부 삭제후, 자기것만 생성
      for (let j = 0; j < this.travel.days.length; j++){
        this.deleteClickLine(j);
        this.deleteDistnce(j);
        this.deleteCircleDot(j);
      }
      if(this.travel.days[i].places != null){
        var firstPosition = new kakao.maps.LatLng(this.travel.days[i].places[0].latitude, this.travel.days[i].places[0].longitude);
        var clickLine = new kakao.maps.Polyline({
            map: this.map, // 선을 표시할 지도입니다 
            path: [firstPosition], // 선을 구성하는 좌표 배열입니다 클릭한 위치를 넣어줍니다
            strokeWeight: 5, // 선의 두께입니다 
            strokeColor: this.colors[i % 9], // 선의 색깔입니다
            strokeOpacity: 1, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
            strokeStyle: 'solid' // 선의 스타일입니다
        });
        this.$set(this.clickLines, i, clickLine);
        this.displayCircleDot(firstPosition, 0, i);
        for(let j=1; j<this.travel.days[i].places.length; j++){
          var path = this.clickLines[i].getPath();
          var clickPosition = new kakao.maps.LatLng(this.travel.days[i].places[j].latitude, this.travel.days[i].places[j].longitude);
          path.push(clickPosition);
          this.clickLines[i].setPath(path);

          var distance = Math.round(this.clickLines[i].getLength());
          this.displayCircleDot(clickPosition, distance, i);
        }
        if(path.length > 1){
          if(this.dots[i][this.dots[i].length-1].distance){ //dayi의 마지막 점의 거리 distanceOveray가 존재하면
            this.dots[i][this.dots[i].length-1].distance.setMap(null); // null로 수정해줍니다.
            this.dots[i][this.dots[i].length-1].distance = null;
          }
          var distance = Math.round(this.clickLines[i].getLength()),
              content = this.getTimeHTML(distance);
  
          this.showDistance(content, path[path.length-1], i); // dayi의 distanceOveray를 총 거리정보로 변경해줍니다.
        }else{
          this.deleteClickLine(i);
          this.deleteCircleDot(i); 
          this.deleteDistnce(i);
        }
      }
    },
    initLine(){
      // 지도에 표시된 것들을 모두 제거
      for(let i=0; i<this.travel.days.length; i++){
        this.deleteClickLine(i);
        this.deleteDistnce(i);
        this.deleteCircleDot(i);
      }
      for(let i=0; i<this.travel.days.length; i++){
        if(this.travel.days[i].places != null){
          var firstPosition = new kakao.maps.LatLng(this.travel.days[i].places[0].latitude, this.travel.days[i].places[0].longitude);
          var clickLine = new kakao.maps.Polyline({
              map: this.map, // 선을 표시할 지도입니다 
              path: [firstPosition], // 선을 구성하는 좌표 배열입니다 클릭한 위치를 넣어줍니다
              strokeWeight: 5, // 선의 두께입니다 
              strokeColor: this.colors[i % 9], // 선의 색깔입니다
              strokeOpacity: 1, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
              strokeStyle: 'solid' // 선의 스타일입니다
          });
          this.$set(this.clickLines, i, clickLine);
          this.displayCircleDot(firstPosition, 0, i);
          for(let j=1; j<this.travel.days[i].places.length; j++){
            var path = this.clickLines[i].getPath();
            var clickPosition = new kakao.maps.LatLng(this.travel.days[i].places[j].latitude, this.travel.days[i].places[j].longitude);
            path.push(clickPosition);
            this.clickLines[i].setPath(path);
  
            var distance = Math.round(this.clickLines[i].getLength());
            this.displayCircleDot(clickPosition, distance, i);
          }
          if(path.length > 1){
            if(this.dots[i][this.dots[i].length-1].distance){ //dayi의 마지막 점의 거리 distanceOveray가 존재하면
              this.dots[i][this.dots[i].length-1].distance.setMap(null); // null로 수정해줍니다.
              this.dots[i][this.dots[i].length-1].distance = null;
            }
            var distance = Math.round(this.clickLines[i].getLength()),
                content = this.getTimeHTML(distance);
    
            this.showDistance(content, path[path.length-1], i); // dayi의 distanceOveray를 총 거리정보로 변경해줍니다.
          }else{
            this.deleteClickLine(i);
            this.deleteCircleDot(i); 
            this.deleteDistnce(i);
          }
        }
      }
    },
    showDistance(content, position, index) {
    
      if (this.distanceOverlays[index]) { // 커스텀오버레이가 생성된 상태이면     
        // 커스텀 오버레이의 위치와 표시할 내용을 설정합니다
        this.distanceOverlays[index].setPosition(position);
        this.distanceOverlays[index].setContent(content);
        this.distanceOverlays[index].setMap(this.map);
          
      } else { // 커스텀 오버레이가 생성되지 않은 상태이면         
          // 커스텀 오버레이를 생성하고 지도에 표시합니다
          this.$set(this.distanceOverlays, index, new kakao.maps.CustomOverlay({
            map: this.map, // 커스텀오버레이를 표시할 지도입니다
            content: content,  // 커스텀오버레이에 표시할 내용입니다
            position: position, // 커스텀오버레이를 표시할 위치입니다.
            xAnchor: 0,
            yAnchor: 0,
            zIndex: 3
          }));
          this.distanceOverlays[index].setMap(this.map);
      }
    },
    displayCircleDot(position, distance, index){
      // 클릭 지점을 표시할 빨간 동그라미 커스텀오버레이를 생성합니다
      var circleOverlay = new kakao.maps.CustomOverlay({
        content: '<span class="dot"></span>',
        position: position,
        zIndex: 1
      });
      circleOverlay.setMap(this.map);
      if (distance > 0) {
        var distanceOverlay = new kakao.maps.CustomOverlay({
          content: '<div class="dotOverlay">거리 <span class="number">' + distance + '</span>m</div>',
          position: position,
          yAnchor: 1,
          zIndex: 2
        });
        // 지도에 표시합니다
        distanceOverlay.setMap(this.map);
        this.$set(this.distanceOverlays, index, distanceOverlay);
        this.$set(this.dots[index], this.dots[index].length, {circle: circleOverlay, distance: distanceOverlay});
      }
      else {
        this.$set(this.dots[index], this.dots[index].length, {circle: circleOverlay, distance: null});
        
      }
      // console.log("dots = ", this.dots);
    },
    deleteClickLine(index){
      if(this.clickLines[index]){
        this.clickLines[index].setMap(null);
        this.clickLines[index] = null;
      }
    },
    deleteDistnce(index){
      if(this.distanceOverlays[index]){
        this.distanceOverlays[index].setMap(null);
      }
    },
    deleteCircleDot(index) {
      for (let i = 0; i < this.dots[index].length; i++){
        // console.log(this.dots[index][i]);
        if(this.dots[index][i].circle){
          this.dots[index][i].circle.setMap(null);
          if(this.dots[index][i].distance != null)
            this.dots[index][i].distance.setMap(null);
        }
      }
      this.dots[index] = [];
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
      if (this.travel.days[index].places == null) { this.travel.days[index].places = []; }
      if(index == 1){
      let dumy1 = {
        content_id: 131139,
        sido_code: 1,
        gugun_code: 1,
        title: "강남청소년수련관",
        addr1: "서울특별시 강남구 도산대로59길 9",
        first_image: "http://tong.visitkorea.or.kr/cms/resource/23/2462023_image2_1.jpg",
        content_type_id: 39,
        latitude: 37.52044985000000000,
        longitude: 127.05414320000000000
      };
      let dumy2 = {
        content_id: 131455,
        sido_code: 1,
        gugun_code: 1,
        title: "서울특별시립수서청소년수련관",
        addr1: "서울특별시 강남구 영동대로 513 코엑스",
        first_image: "http://tong.visitkorea.or.kr/cms/resource/26/2822726_image2_1.jpg",
        content_type_id: 15,
        latitude: 37.48359919000000000,
        longitude: 127.08880780000000000
      };
      let dumy3 = {
        content_id: 131903,
        sido_code: 1,
        gugun_code: 1,
        title: "세븐럭카지노(강남코엑스점)",
        addr1: "서울특별시 강남구 테헤란로103길 9 제일빌딩",
        first_image: "http://tong.visitkorea.or.kr/cms/resource/66/2845166_image2_1.jpg",
        latitude: 37.51202589000000000,
        longitude: 127.05753200000000000,
      }
        this.$set(this.travel.days[index].places, this.travel.days[index].places.length, dumy1);
        this.$set(this.travel.days[index].places, this.travel.days[index].places.length, dumy2);
        this.$set(this.travel.days[index].places, this.travel.days[index].places.length, dumy3);
        // this.$set(this.travel.days[index].attractions, 0, dumy1.content_id);
        // this.$set(this.travel.days[index].attractions, 1, dumy2.content_id);
        // this.$set(this.travel.days[index].attractions, 2, dumy3.content_id);
        // console.log(this.travel);
      }else{
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
      this.$set(this.travel.days[index].places, this.travel.days[index].places.length, dumy1);
      this.$set(this.travel.days[index].places, this.travel.days[index].places.length, dumy2);
      this.$set(this.travel.days[index].places, this.travel.days[index].places.length, dumy3);
      }
      this.initLine();
    },
    submitTravel(){
      http.put("/travelapi/travel", this.travel)
      .then(({data})=>{
        alert("계획 생성 완료");
        this.$router.push({name: "home"});
      })
      .catch((e)=>{
        alert("계획 생성 실패");
      })
    },
    deleteTravel(){
      http.delete("/travelapi/travel/"+this.travel.id)
      .then(({data})=>{
        alert("계획이 삭제 되었습니다.");
        this.$router.push({name: "home"});
      })
      .catch((e)=>{
        alert("계획 삭제 실패");
      })
    },
    drop(index) {
      this.$set(this.travel.days[index].places, this.travel.days[index].places.length, this.movePlace);
      this.initMap();
      this.onlyLine(index);
      // this.travel.days[index]

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
  height: 5.5%;
  border-radius: 20px 20px 0px 0px;
}
#noTitle{
  background-color: black;
  color: white;
  height: 5.5%;
  border-radius: 20px 20px 0px 0px;
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