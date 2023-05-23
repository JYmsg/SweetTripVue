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
                <a href="#" class="dropdown-item" @click="deleteTravel()">삭제</a>
              </base-dropdown>
            </div>
            <div class="row justify-content-center m-5">
              <h3> {{ travel.title }}에 대한 여행 계획</h3>
            </div>
            <div class="row justify-content-center mt-5 mb-5 ml-2" style="width: 100%; height: 50vh;">
              <div id="map" style="width: 100%; height: 100%;">
                <base-button type="warning" class="m-3" @click="godView()" style="z-index: 2">전체보기</base-button>
              </div>
            </div>
            <div class="mt-1 ml-1 mr-1 mb-5" v-for="(day, index) in travel.days" :key="day.id">
              <div class="row">
                <div class="row">
                  <h5 class="m-4 day_title" :style="'text-decoration-color:'+colors[index]">Day{{ index+1 }}({{ day.date }})</h5>
                </div>
                <div class="mt-5 ml-1 mb-3" v-for="(place, idx) in day.places" :key="place.content_id">
                  <div :style="'height: 7.5rem; width: 10rem; border-radius: 40px 80px / 80px 40px; border: 2px solid '+colors[index]" class="float-left" @click="moveCenter(place)">
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
          <div class="col-md-12 col-lg-12 mt-3 ml-0 mr-0 mb-3">
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
      totalBounds: null,
      mapCustomOverlay: null,
      clickLines: [],
      distanceOverlays: [],
      dots: [],
      markers: [],
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
  },
  methods: {
    deleteTravel(){
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
    godView(){
      this.map.setBounds(this.totalBounds);
      this.mapCustomOverlay.setMap(null);  
      this.mapCustomOverlay=null;
      for(let i=0; i<this.dots.length; i++){
        this.setCircleDot(i);
        this.distanceOverlays[i].setMap(this.map);
      }
    },
    setCircleDot(index) {
      for (let i = 0; i < this.dots[index].length; i++) {
        if (this.dots[index][i].circle) {
          if (this.dots[index][i].distance != null) this.dots[index][i].distance.setMap(this.map);
        }
      }
    },
    deleteCircleDot(index) {
      for (let i = 0; i < this.dots[index].length; i++) {
        if (this.dots[index][i].circle) {
          if (this.dots[index][i].distance != null) this.dots[index][i].distance.setMap(null);
        }
      }
    },
    moveCenter(place){
      for(let i=0; i<this.dots.length; i++){
        this.deleteCircleDot(i);
        this.distanceOverlays[i].setMap(null);
      }
      if (this.mapCustomOverlay) this.mapCustomOverlay.setMap(null);
        var content = '<div class="overlay_info">' +
        '    <a href="#" target="_blank"><strong>' +
        place.title +
        "</strong></a>" +
        '    <div class="desc">' +
        '        <span class="address">' +
        place.addr1 +
        "</span>" +
        "    </div>" +
        "</div>";
                    
      // 커스텀 오버레이가 표시될 위치입니다 
      var position = new kakao.maps.LatLng(place.latitude, place.longitude);
      
      // 커스텀 오버레이를 생성합니다
      this.mapCustomOverlay = new kakao.maps.CustomOverlay({
          position: position,
          content: content,
          xAnchor: 0.5, // 커스텀 오버레이의 x축 위치입니다. 1에 가까울수록 왼쪽에 위치합니다. 기본값은 0.5 입니다
          yAnchor: 1.1, // 커스텀 오버레이의 y축 위치입니다. 1에 가까울수록 위쪽에 위치합니다. 기본값은 0.5 입니다
          zIndex: 5
      });
      this.map.setCenter(position);
      this.map.setLevel(5);
                    
      // 커스텀 오버레이를 지도에 표시합니다
      this.mapCustomOverlay.setMap(this.map);
    },
    detailMore(index, place) {
      console.log(place)
      http.get("/placeapi/place/one/"+this.travel.days[index].id+"/"+place.content_id)
        .then(({ data }) => {

          if(data.memo == '') data.memo = null;
          this.modalPlace = {
              title: place.title,
              overview: data.overview,
              first_image: place.first_image,
              starttime: place.starttime,
              endtime: place.endtime,
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
      this.initLine();
    },
    initLine() {
      // 지도에 표시된 것들을 모두 제거
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
          }
          this.map.setBounds(bounds);
          this.totalBounds = bounds;
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
  }
}
</script>
<style>
.day_title{
  text-decoration-line: underline;
  text-decoration-thickness: 4px;
}
</style>