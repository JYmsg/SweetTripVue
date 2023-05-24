<template>
  <div style="width: 100vw; height: 100vh">
    <!-- <div class="row"> -->
    <div class="row no-gutters" style="width: 100vw; height: 100vh">
      <!-- 카카오 지도 : 8칸 -->
      <div class="col-lg-8 col-sm-8 m-0">
        <div id="map" style="width: 100%; height: 100%">
          <div class="btn m-3 p-0" style="background-color: black; height: 3rem; width: 3rem; z-index: 5;" @click="share = true">
            <img src="img/icons/common/share2.png" style="width: 100%; height: 100%;">
          </div>

        </div>
      </div>
      <!-- 계획표와 장바구니 : 4칸 -->
      <div class="row no-gutters col-lg-4 col-sm-4">
        <!-- 계획표는 할당된 곳의 7칸 -->
        <div class="col-lg-7 col-sm-7 m-0">
          <div id="sidebar" class="p-3">
            <div class="row no-gutters">
              <div :id="Title[0]" class="text-center p-1 col-lg-6" @click="change(1)">
                <h4 class="mt-2" :id="Title[0]">여행 계획표</h4>
              </div>
              <div :id="Title[1]" class="text-center p-1 col-lg-6" @click="change(2)">
                <h4 class="mt-2" :id="Title[1]">검색</h4>
                <!-- <h5>분리중</h5> -->
              </div>
            </div>
            <plan-list
              v-if="select"
              :travel="travel"
              :colors="colors"
              @drop="drop"
              @remove="remove"
              @add="add"
              @onlyLine="onlyLine"
              @moveMap="moveMap"
              @removeDayPlace="removeDayPlace"
              @dragPlace="dragPlace"
            ></plan-list>
            <plan-search v-else :daylength="daylength" :map="map" @addPlace="addPlace"></plan-search>
          </div>
        </div>
        <!-- 장바구니는 5칸 -->
        <div class="col-lg-5 col-sm-5">
          <div id="bag" class="p-3">
            <div id="title_bag" class="text-center p-1">
              <h4 class="mt-2" style="color: white">찜한 장소 목록</h4>
            </div>
            <div id="carts" style="overflow: auto; height: 85vh" class="p-2" v-if="cartslength">
              <div id="cart" v-for="cart in carts" :key="cart.content_id" class="p-1">
                <div class="place" v-if="cart.place != null" draggable="true" @dragstart="moveCart(cart.place)">
                  <div id="cart_img_box" class="mb-1">
                    <img id="cart_img" :src="`${cart.place.first_image}`" alt="" />
                  </div>
                  <div id="address_box" class="text-center mb-1">
                    <p class="mt-2 mb-0" style="color: white">{{ cart.place.title }}</p>
                    <p style="font-size: 13px">{{ cart.place.addr1 }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center">
              <h5 style="color: white" class="m-2">찜한 장소가 없습니다.</h5>
            </div>
            <div id="buttons" class="mt-2" style="float: right">
              <base-button class="btn-1 p-2" type="info" @click="firstSubmitTravel()">임시저장</base-button>
              <base-button class="btn-1 p-2" type="primary" @click="submitTravel()">계획완료</base-button>
              <base-button class="btn-1 p-2" type="warning" @click="deleteTravel()">계획취소</base-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal :show.sync="share">
      <div class="col-md-11 mt-4 mt-md-0">
        <p class="d-block text-uppercase font-weight-bold mb-2">초대 하기</p>
        <div v-if="travel.users != []">
          <div v-for="(add, index) in travel.users" :key="add.id">
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
        <base-button type="link" class="ml-auto" @click="share = false">Close </base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import Modal from "@/components/Modal.vue";
import http from "@/util/http-common.js";
import { mapState } from "vuex";
import PlanList from "./element/PlanList.vue";
import PlanSearch from "./element/PlanSearch.vue";
import Moment from "moment";
export default {
  components: {
    Modal,
    PlanList,
    PlanSearch,
    Moment,
  },
  watch: {
    daylength() {
      this.initLine();
    },
  },
  data() {
    return {
      map: null,
      travel: null,
      carts: [],
      share: false,
      cartslength: 0,
      daylength: 0,
      modal: false,
      clickLines: [],
      distanceOverlays: [],
      dots: [],
      markers: [],
      select: true,
      Title: ["title_plan", "noTitle"],
      colors: ["#dc3545", "#fd7e14", "#ffc107", "#28a745", "#20c997", "#17a2b8", "#007bff", "#6610f2", "#6f42c1"], //9가지 색
      places: [],
      InfoWindow: null,
      movePlace: null,
      moveDelete: null,
      idx: null,
      users: [],
      keyword: "",
    };
  },
  async created() {
    await http
      .get("/travelapi/travel/one/" + this.$route.params.id)
      .then(({ data }) => {
        this.travel = data;
        this.daylength = data.days.length;
        for (let i = 0; i < this.daylength; i++) {
          this.$set(this.dots, i, []);
          this.$set(this.distanceOverlays, i, null);
          this.$set(this.clickLines, i, null);
        }
        let check = false;
        console.log("log = "+this.loginUser.id)
        console.log("make = "+this.travel.user_id)
        for(let i=0; i<this.travel.users.length; i++){
          console.log(this.travel.users[i].id)
          if(this.travel.users[i].id == this.loginUser.id) check = true;
        }
        if(this.travel.user_id == this.loginUser.id) check = true;
        if(!check){
          alert("잘못된 접근입니다.");
          this.$router.push({ name: "home" });
        }
      })
      .catch((e) => {
        alert("여행 정보를 가져오는데 실패했습니다.");
        this.$router.push({ name: "home" });
      });

    await http.get("/cartapi/cart/list/" + this.loginUser.id).then(({ data }) => {
      // console.log(data);
      for (let i = 0; i < data.length; i++) {
        this.$set(this.carts, i, data[i]);
      }
      this.cartslength = this.carts.length;
    });
  },
  computed: {
    ...mapState(["loginUser"]),
  },
  mounted() {
    if (!this.loginUser) {
      alert("로그인해야 계획을 짤 수 있습니다.");
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
    searchId() {
      this.users = [];
      http
        .get("/userapi/user/keyword/" + this.keyword)
        .then(({ data }) => {
          console.log(this.travel.users, data);
          for (let i = 0; i < data.length; i++) {
            if(this.addValid(data[i]))
              this.$set(this.users, this.users.length, data[i]);
          }
          console.log(this.users);
        })
        .catch((err) => {
          alert("유저를 불러오는데 실패했습니다.");
        });
    },
    addValid(user){
      for(let j=0; j<this.travel.users.length; j++){
        if(this.travel.users[j].id == user.id || this.loginUser.id == user.id) return false;
      }
      return true;
    },
    removeUser(index){
      http.delete("/travelapi/travel/"+this.travel.users[index].id+"/"+this.travel.id)
      .then(({data})=>{
        console.log("삭제 완료");
        this.$delete(this.travel.users, index);
      }).catch((e)=>{
        alert("삭제 중 에러 발생");
      })
    },
    addUser(index){
      http.get("/travelapi/travel/"+this.users[index].id+"/"+this.travel.id)
      .then(({data})=>{
        console.log("등록 성공")
        this.$set(this.travel.users, this.travel.users.length, this.users[index]);
        this.$delete(this.users, index);
      })
      .catch((e)=>{
        alert("추가 중 에러 발생");
      })
    },
    add() {
      var day = {
        date: Moment(this.travel.enddate).add(1, "days").format("YYYY-MM-DD"),
        weather: "맑음",
        travel_id: this.travel.id,
        places: [],
      };
      http.post("/travelapi/day", day).then(({ data }) => {
        this.travel.enddate = Moment(this.travel.enddate).add(1, "days").format("YYYY-MM-DD");
        this.$set(this.travel.days, this.travel.days.length, day);
        this.daylength = this.travel.days.length;
        console.log(data);
        this.travel.days[this.travel.days.length - 1].id = data;
        console.log(this.travel.days[this.travel.days.length - 1]);
        this.$set(this.dots, this.dots.length, []);
        this.$set(this.distanceOverlays, this.distanceOverlays.length, null);
        this.$set(this.clickLines, this.clickLines.length, null);
      });
    },
    removeConfirm(){
      http.delete("/travelapi/day/" + this.travel.days[this.daylength - 1].id).then(({ data }) => {
        this.$delete(this.travel.days, this.daylength - 1);
        this.daylength -= 1;
        this.travel.enddate = Moment(this.travel.enddate).subtract(1, "days").format("YYYY-MM-DD");
        this.$delete(this.travel.days, this.daylength);
        this.$delete(this.dots, this.dots.length - 1);
        this.$delete(this.distanceOverlays, this.distanceOverlays.length - 1);
        this.$delete(this.clickLines, this.clickLines.length - 1);
      });
    },
    remove() {
      if(this.travel.days[this.travel.days.length-1].places.length > 0){
        if(confirm("해당 날짜에 저장된 장소가 존재합니다.\n삭제하시겠습니까?")){
          this.removeConfirm();
        }
      }else{
        this.removeConfirm();
      }
    },
    dragPlace(index, idx, place) {
      this.movePlace = place;
      this.moveDelete = index;
      this.idx = idx;
    },
    moveCart(place) {
      this.movePlace = place;
    },
    removeDayPlace(index, idx) {
      console.log(index, idx);
      this.$delete(this.travel.days[index].places, idx);
      this.onlyLine(index);
    },
    addPlace(index, place) {
      if (this.travel.days[index].places == null) this.travel.days[index].places = [];
      if (this.travel.days[index].places.length == 10) {
        alert("최대 10개의 장소만 등록할 수 있습니다.");
      }
      if (this.isIn(index, place)) {
        this.$set(this.travel.days[index].places, this.travel.days[index].places.length, place);
        this.onlyLine(index);
      } else {
        alert("이미 해당 장소가 존재합니다.");
      }
    },
    isIn(index, place) {
      // 넣을 day의 index와 장소를 받아 이미 존재하는지 확인.
      console.log("check");
      for (let i = 0; i < this.travel.days[index].places.length; i++) {
        if (this.travel.days[index].places[i].content_id == place.content_id) return false;
      }
      return true;
    },
    moveMap(lat, lng) {
      this.map.setCenter(new kakao.maps.LatLng(lat, lng));
      this.map.setLevel(3);
    },
    change(index) {
      if (index == 1) {
        this.Title[1] = "noTitle";
        this.Title[0] = "title_plan";
        this.select = true;
      } else {
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
      if (this.select) {
        this.initLine();
      } else {
        this.distanceOverlays = [];
        this.markers = [];
      }
    },
    onlyLine(i) {
      // 전부 삭제후, 자기것만 생성
      for (let j = 0; j < this.travel.days.length; j++) {
        this.deleteClickLine(j);
        this.deleteDistnce(j);
        this.deleteCircleDot(j);
      }
      var bounds = new kakao.maps.LatLngBounds();

      if (this.travel.days[i].places != null) {
        var firstPosition = new kakao.maps.LatLng(this.travel.days[i].places[0].latitude, this.travel.days[i].places[0].longitude);
        var clickLine = new kakao.maps.Polyline({
          map: this.map, // 선을 표시할 지도입니다
          path: [firstPosition], // 선을 구성하는 좌표 배열입니다 클릭한 위치를 넣어줍니다
          strokeWeight: 5, // 선의 두께입니다
          strokeColor: this.colors[i % 9], // 선의 색깔입니다
          strokeOpacity: 1, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
          strokeStyle: "solid", // 선의 스타일입니다
        });
        bounds.extend(firstPosition);
        this.$set(this.clickLines, i, clickLine);
        this.displayCircleDot(firstPosition, 0, i);
        for (let j = 1; j < this.travel.days[i].places.length; j++) {
          var path = this.clickLines[i].getPath();
          var clickPosition = new kakao.maps.LatLng(this.travel.days[i].places[j].latitude, this.travel.days[i].places[j].longitude);
          path.push(clickPosition);
          this.clickLines[i].setPath(path);
          bounds.extend(clickPosition);
          var distance = Math.round(this.clickLines[i].getLength());
          this.displayCircleDot(clickPosition, distance, i);
        }
        if (path.length > 1) {
          if (this.dots[i][this.dots[i].length - 1].distance) {
            //dayi의 마지막 점의 거리 distanceOveray가 존재하면
            this.dots[i][this.dots[i].length - 1].distance.setMap(null); // null로 수정해줍니다.
            this.dots[i][this.dots[i].length - 1].distance = null;
          }
          var distance = Math.round(this.clickLines[i].getLength()),
            content = this.getTimeHTML(distance);

          this.showDistance(content, path[path.length - 1], i); // dayi의 distanceOveray를 총 거리정보로 변경해줍니다.
        } else {
          this.deleteClickLine(i);
          this.deleteCircleDot(i);
          this.deleteDistnce(i);
        }
        this.map.setBounds(bounds);
      }
    },
    initLine() {
      // 지도에 표시된 것들을 모두 제거
      for (let i = 0; i < this.travel.days.length; i++) {
        this.deleteClickLine(i);
        this.deleteDistnce(i);
        this.deleteCircleDot(i);
      }
      var bounds = new kakao.maps.LatLngBounds();
      for (let i = 0; i < this.travel.days.length; i++) {
        if (this.travel.days[i].places != null) {
          var firstPosition = new kakao.maps.LatLng(this.travel.days[i].places[0].latitude, this.travel.days[i].places[0].longitude);
          var clickLine = new kakao.maps.Polyline({
            map: this.map, // 선을 표시할 지도입니다
            path: [firstPosition], // 선을 구성하는 좌표 배열입니다 클릭한 위치를 넣어줍니다
            strokeWeight: 5, // 선의 두께입니다
            strokeColor: this.colors[i % 9], // 선의 색깔입니다
            strokeOpacity: 1, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
            strokeStyle: "solid", // 선의 스타일입니다
          });
          bounds.extend(firstPosition);
          this.$set(this.clickLines, i, clickLine);
          this.displayCircleDot(firstPosition, 0, i);
          for (let j = 1; j < this.travel.days[i].places.length; j++) {
            var path = this.clickLines[i].getPath();
            var clickPosition = new kakao.maps.LatLng(this.travel.days[i].places[j].latitude, this.travel.days[i].places[j].longitude);
            path.push(clickPosition);
            this.clickLines[i].setPath(path);
            bounds.extend(clickPosition);
            var distance = Math.round(this.clickLines[i].getLength());
            this.displayCircleDot(clickPosition, distance, i);
          }
          if (path.length > 1) {
            if (this.dots[i][this.dots[i].length - 1].distance) {
              //dayi의 마지막 점의 거리 distanceOveray가 존재하면
              this.dots[i][this.dots[i].length - 1].distance.setMap(null); // null로 수정해줍니다.
              this.dots[i][this.dots[i].length - 1].distance = null;
            }
            var distance = Math.round(this.clickLines[i].getLength()),
              content = this.getTimeHTML(distance);

            this.showDistance(content, path[path.length - 1], i); // dayi의 distanceOveray를 총 거리정보로 변경해줍니다.
          } else {
            this.deleteClickLine(i);
            this.deleteCircleDot(i);
            this.deleteDistnce(i);
          }
          this.map.setBounds(bounds);
        }
      }
    },
    showDistance(content, position, index) {
      if (this.distanceOverlays[index]) {
        // 커스텀오버레이가 생성된 상태이면
        // 커스텀 오버레이의 위치와 표시할 내용을 설정합니다
        this.distanceOverlays[index].setPosition(position);
        this.distanceOverlays[index].setContent(content);
        this.distanceOverlays[index].setMap(this.map);
      } else {
        // 커스텀 오버레이가 생성되지 않은 상태이면
        // 커스텀 오버레이를 생성하고 지도에 표시합니다
        this.$set(
          this.distanceOverlays,
          index,
          new kakao.maps.CustomOverlay({
            map: this.map, // 커스텀오버레이를 표시할 지도입니다
            content: content, // 커스텀오버레이에 표시할 내용입니다
            position: position, // 커스텀오버레이를 표시할 위치입니다.
            xAnchor: 0,
            yAnchor: 0,
            zIndex: 3,
          })
        );
        this.distanceOverlays[index].setMap(this.map);
      }
    },
    displayCircleDot(position, distance, index) {
      // 클릭 지점을 표시할 빨간 동그라미 커스텀오버레이를 생성합니다
      var circleOverlay = new kakao.maps.CustomOverlay({
        content: '<span class="dot"></span>',
        position: position,
        zIndex: 1,
      });
      circleOverlay.setMap(this.map);
      if (distance > 0) {
        var distanceOverlay = new kakao.maps.CustomOverlay({
          content: '<div class="dotOverlay">거리 <span class="number">' + distance + "</span>m</div>",
          position: position,
          yAnchor: 1,
          zIndex: 2,
        });
        // 지도에 표시합니다
        distanceOverlay.setMap(this.map);
        this.$set(this.distanceOverlays, index, distanceOverlay);
        this.$set(this.dots[index], this.dots[index].length, { circle: circleOverlay, distance: distanceOverlay });
      } else {
        this.$set(this.dots[index], this.dots[index].length, { circle: circleOverlay, distance: null });
      }
      // console.log("dots = ", this.dots);
    },
    deleteClickLine(index) {
      if (this.clickLines[index]) {
        this.clickLines[index].setMap(null);
        this.clickLines[index] = null;
      }
    },
    deleteDistnce(index) {
      if (this.distanceOverlays[index]) {
        this.distanceOverlays[index].setMap(null);
      }
    },
    deleteCircleDot(index) {
      for (let i = 0; i < this.dots[index].length; i++) {
        // console.log(this.dots[index][i]);
        if (this.dots[index][i].circle) {
          this.dots[index][i].circle.setMap(null);
          if (this.dots[index][i].distance != null) this.dots[index][i].distance.setMap(null);
        }
      }
      this.dots[index] = [];
    },
    getTimeHTML(distance) {
      // 도보의 시속은 평균 4km/h 이고 도보의 분속은 67m/min입니다
      var walkkTime = (distance / 67) | 0;
      var walkHour = "",
        walkMin = "";

      // 계산한 도보 시간이 60분 보다 크면 시간으로 표시합니다
      if (walkkTime > 60) {
        walkHour = '<span class="number">' + Math.floor(walkkTime / 60) + "</span>시간 ";
      }
      walkMin = '<span class="number">' + (walkkTime % 60) + "</span>분";

      // 자전거의 평균 시속은 16km/h 이고 이것을 기준으로 자전거의 분속은 267m/min입니다
      var bycicleTime = (distance / 227) | 0;
      var bycicleHour = "",
        bycicleMin = "";

      // 계산한 자전거 시간이 60분 보다 크면 시간으로 표출합니다
      if (bycicleTime > 60) {
        bycicleHour = '<span class="number">' + Math.floor(bycicleTime / 60) + "</span>시간 ";
      }
      bycicleMin = '<span class="number">' + (bycicleTime % 60) + "</span>분";

      // 거리와 도보 시간, 자전거 시간을 가지고 HTML Content를 만들어 리턴합니다
      var content = '<ul class="dotOverlay distanceInfo">';
      content += "    <li>";
      content += '        <span class="label">총거리</span><span class="number">' + distance + "</span>m";
      content += "    </li>";
      content += "    <li>";
      content += '        <span class="label">도보</span>' + walkHour + walkMin;
      content += "    </li>";
      content += "    <li>";
      content += '        <span class="label">자전거</span>' + bycicleHour + bycicleMin;
      content += "    </li>";
      content += "</ul>";

      return content;
    },
    firstSubmitTravel(){
      this.travel.save = 0;
      http
        .put("/travelapi/travel", this.travel)
        .then(({ data }) => {
          alert("계획 생성 완료");
          this.$router.push({ name: "PlanDetail", id: this.travel.id });
        })
        .catch((e) => {
          alert("계획 생성 실패");
        });
    },
    submitTravel() {
      this.travel.save = 1;
      http
        .put("/travelapi/travel", this.travel)
        .then(({ data }) => {
          alert("계획 생성 완료");
          this.$router.push({ name: "PlanDetail", id: this.travel.id });
        })
        .catch((e) => {
          alert("계획 생성 실패");
        });
    },
    deleteTravel() {
      http
        .delete("/travelapi/travel/" + this.travel.id)
        .then(({ data }) => {
          alert("계획이 삭제 되었습니다.");
          this.$router.push({ name: "home" });
        })
        .catch((e) => {
          alert("계획 삭제 실패");
        });
    },
    drop(index) {
      if (this.travel.days[index].places == null) this.travel.days[index].places = [];
      var p = {
        content_id: this.movePlace.content_id,
        sido_code: this.movePlace.sido_code,
        title: this.movePlace.title,
        addr1: this.movePlace.addr1,
        first_image: this.movePlace.first_image,
        content_type_id: this.movePlace.content_type_id,
        latitude: this.movePlace.latitude,
        longitude: this.movePlace.longitude,
        memo: this.movePlace.memo,
        starttime: this.movePlace.starttime,
        endtime: this.movePlace.endtime,
      };
      this.movePlace = null;
      // this.$set(this.travel.days[index].places, this.travel.days[index].places.length, p);
      if (this.isIn(index, p)) {
        this.$set(this.travel.days[index].places, this.travel.days[index].places.length, p);
        if (this.moveDelete != null) {
          console.log(this.moveDelete, this.idx);
          this.$delete(this.travel.days[this.moveDelete].places, this.idx);
          console.log(this.travel.days[this.moveDelete].places);
          this.moveDelete = null;
          this.movePlace = null;
          this.idx = null;
          // this.travel.days[this.moveDelete]
        }
        this.onlyLine(index);
      } else {
        alert("해당 장소가 이미 존재합니다.");
        this.movePlace = null;
        this.idx = null;
      }
    },
  },
};
</script>
<style>
#sidebar {
  width: 100%;
  height: 100%;
  background-color: #f8f6f4;
}
#title_plan {
  background-color: #c4dfdf;
  height: 5.5%;
  border-radius: 20px 20px 0px 0px;
}
#noTitle {
  background-color: black;
  color: white;
  height: 5.5%;
  border-radius: 20px 20px 0px 0px;
}
.day {
  background-color: #d2e9e9;
}
#days {
  background-color: #e3f4f4;
}
#bag {
  width: 100%;
  height: 100%;
  background-color: #0b2447;
}
#title_bag {
  background-color: #19376d;
}
#carts {
  color: whitesmoke;
  background-color: #576cbc;
}
#cart {
  width: 100%;
  height: 6.5rem;
  /* background-color: #A5D7E8; */
  background-color: #f8f6f4;
}
#cart_img_box {
  float: left;
  width: 33%;
  height: 6rem;
}
#cart_img,
#att_img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}
#address_box {
  float: right;
  width: 66%;
  height: 6rem;
  background: black;
  overflow: hidden;
}
#att_img_box {
  float: left;
  width: 33%;
  height: 6rem;
}
#att_address_box {
  float: right;
  width: 66%;
  height: 6rem;
  background: #f8f6f4;
  overflow: hidden;
}
#attractions {
  width: 100%;
  height: 6.5rem;
  /* background-color: #A5D7E8; */
  background-color: black;
}

/* by kakao */
.dot {
  overflow: hidden;
  float: left;
  width: 12px;
  height: 12px;
  background: url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/mini_circle.png");
}
.dotOverlay {
  position: relative;
  bottom: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  border-bottom: 2px solid #ddd;
  float: left;
  font-size: 12px;
  padding: 5px;
  background: #fff;
}
.dotOverlay:nth-of-type(n) {
  border: 0;
  box-shadow: 0px 1px 2px #888;
}
.number {
  font-weight: bold;
  color: #ee6152;
}
.dotOverlay:after {
  content: "";
  position: absolute;
  margin-left: -6px;
  left: 50%;
  bottom: -8px;
  width: 11px;
  height: 8px;
  background: url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white_small.png");
}
.distanceInfo {
  position: relative;
  top: 5px;
  left: 5px;
  list-style: none;
  margin: 0;
}
.distanceInfo .label {
  display: inline-block;
  width: 50px;
}
.distanceInfo:after {
  content: none;
}
</style>
