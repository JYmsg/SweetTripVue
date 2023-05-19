<template>
  <div>
    <section class="section-profile-cover section-shaped my-0">
      <div class="shape shape-login"></div>
    </section>
    <section class="section section-skew">
      <div class="container">
        <card shadow class="card-profile mt--300" no-body>
          <div>
            <div class="form-row mt-3 ml-4" v-if="getUser">
              <base-dropdown tag="li" class="nav-item">
                <a slot="title" href="#" class="nav-link" data-toggle="dropdown" role="button"> &#9776; </a>
                <router-link :to="`modify/${hotpl.id}`" class="dropdown-item">수정</router-link>
                <a href="#" class="dropdown-item" @click="deleteHotpl">삭제</a>
              </base-dropdown>
            </div>
            <div v-if="getUser" class="row justify-content-center text-center">
              <h2>{{ hotpl.title }}</h2>
            </div>
            <div v-else class="row justify-content-center text-center mt-3">
              <h2>{{ hotpl.title }}</h2>
            </div>
            <div class="text-center">&#128065; {{ hotpl.hit }} &nbsp;&nbsp;&nbsp;&nbsp; &#9829; {{ hotpl.like }}</div>
            <h5 class="section-subheading text-muted mr-5" style="text-align: right">
              {{ hotpl.writer_id }}<br />
              {{ hotpl.write_time }}
            </h5>
          </div>
          <div class="row no-gutters">
            <div class="col mb-2 ml-2">
              <div id="map" style="width: 100%; height: 100%; position: relative; overflow: hidden"></div>
            </div>
            <div class="px-4 col">
              <div class="mt-3 row justify-content-center">
                {{ hotpl.img }}
              </div>
              <div class="row justify-content-center">
                <b-form-textarea
                  class="w-75"
                  id="textarea-no-resize"
                  rows="10"
                  no-resize
                  readonly
                  v-model="hotpl.content"
                ></b-form-textarea>
              </div>
              <div class="form-row float-right m-3">
                <b-button class="btn" @click="moveList">목록 보기</b-button>
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
import BaseDropdown from "@/components/BaseDropdown";
import { mapState } from "vuex";

export default {
  name: "HotplDetail",
  data() {
    return {
      hotpl: {
        id: 0,
        title: "",
        content: "",
        img: "",
        hit: 0,
        like: 0,
        write_time: "",
        writer_id: "",
        latitude: 0,
        longitude: 0,
        name: "",
        address: "",
      },
      map: null,
    };
  },
  created() {
    http.put(`/hotplaceapi/hit`, {
      id: this.$route.params.id,
    });
    http.get(`/hotplaceapi/hotplace/${this.$route.params.id}`).then(({ data }) => {
      this.hotpl = data;
    });
  },
  components: {
    BaseDropdown,
  },
  methods: {
    deleteHotpl() {
      http.delete(`/hotplaceapi/hotplace/${this.$route.params.id}`).then(({ data }) => {
        let msg = "삭제 처리시 문제가 발생했습니다.";
        if (data === 1) {
          msg = "삭제가 완료되었습니다.";
        }
        alert(msg);
        this.moveList();
      });
    },
    moveList() {
      this.$router.push({ name: "HotplList" });
    },
    initMap() {
      http.get(`/hotplaceapi/hotplace/${this.$route.params.id}`).then(({ data }) => {
        this.hotpl = data;
        var container = document.getElementById("map");
        console.log("hotpl", this.hotpl);
        var mk = new kakao.maps.LatLng(this.hotpl.latitude, this.hotpl.longitude);
        var options = {
          center: mk, // 지도의 중심좌표
          level: 5, // 지도의 확대 레벨
        };
        this.map = new kakao.maps.Map(container, options);

        var imageSrc = "img/markers/marker.png";
        // 마커 이미지의 이미지 크기 입니다
        var imageSize = new kakao.maps.Size(34, 35);

        // // 마커 이미지를 생성합니다
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
        var markerInfo = {
          title: this.hotpl.name,
          latlng: mk,
        };
        // // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
          map: this.map, // 마커를 표시할 지도
          position: markerInfo.latlng, // 마커를 표시할 위치
          title: markerInfo.title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          image: markerImage, // 마커 이미지
        });
        console.log("marker", marker);
        var content =
          '<div class="overlay_info">' +
          '    <a href="#" target="_blank"><strong>' +
          this.hotpl.name +
          "</strong></a>" +
          '    <div class="desc">' +
          '        <span class="address">' +
          this.hotpl.address +
          "</span>" +
          "    </div>" +
          "</div>";

        console.log("markerInfo", markerInfo);
        var overlay = new kakao.maps.CustomOverlay({
          content: content,
          position: markerInfo.latlng,
          xAnchor: 0.5,
          yAnchor: 1.4,
        });
        overlay.setMap(this.map);
      });
    },
  },
  computed: {
    ...mapState(["loginUser"]),
    getUser() {
      if (this.loginUser) {
        if (this.loginUser.id === this.hotpl.writer_id) return true;
        return false;
      } else {
        return false;
      }
    },
  },
  mounted() {
    if (!window.kakao || !window.kakao.maps) {
      const script = document.createElement("script");
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=610bf6cd591542b654c6ececbd7a14b0&libraries=services,clusterer,drawing";
      script.addEventListener("load", () => {
        kakao.maps.load(this.initMap);
      });
      document.head.appendChild(script);
    } else {
      this.initMap();
    }
  },
};
</script>

<style>
.overlay_info {
  border-radius: 6px;
  margin-bottom: 12px;
  float: left;
  position: relative;
  border: 1px solid #ccc;
  border-bottom: 2px solid #ddd;
  background-color: #fff;
}
.overlay_info:nth-of-type(n) {
  border: 0;
  box-shadow: 0px 1px 2px #888;
}
.overlay_info a {
  display: block;
  background: #d95050;
  background: #d95050 url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/arrow_white.png) no-repeat right 14px
    center;
  text-decoration: none;
  color: #fff;
  padding: 12px 36px 12px 14px;
  font-size: 14px;
  border-radius: 6px 6px 0 0;
}
.overlay_info .desc {
  padding: 14px;
  position: relative;
  min-width: 190px;
  height: 56px;
}
.overlay_info img {
  vertical-align: top;
}
.overlay_info .address {
  font-size: 12px;
  color: #333;
  position: absolute;
  white-space: normal;
}
.overlay_info:after {
  content: "";
  position: absolute;
  margin-left: -11px;
  left: 50%;
  bottom: -12px;
  width: 22px;
  height: 12px;
  background: url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png) no-repeat 0 bottom;
}
</style>
