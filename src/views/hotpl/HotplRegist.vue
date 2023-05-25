<template>
  <div>
    <section class="section-profile-cover section-shaped my-0">
      <div class="shape shape-login"></div>
    </section>
    <section class="section section-skew">
      <div class="container">
        <card shadow class="card-profile mt--300" no-body>
          <div class="px-4">
            <div class="row justify-content-center m-4">
              <h3>핫 플레이스 등록하기</h3>
            </div>
            <div class="row">
              <div class="col mb-3" v-if="initMap">
                <div id="map" style="width: 100%; height: 100%; position: relative; overflow: hidden"></div>
                <div id="menu_wrap" style="background-color: white; opacity: 0.8">
                  <div class="option">
                    <div class="row no-gutters">
                      <base-input
                        class="col-lg-8 col-sm-8 mb-1 ml-2 mt-1"
                        placeholder="Search"
                        v-model="keyword"
                        size="15"
                        addon-left-icon="ni ni-zoom-split-in"
                      >
                      </base-input>
                      <base-button
                        id="submit_btn"
                        class="col-lg-3 col-sm-3"
                        type="primary"
                        style="height: 3rem"
                        @click="searchPlaces"
                        >검색</base-button
                      >
                    </div>
                  </div>
                  <hr />
                  <ul id="placesList">
                    <li id="item" v-for="(place, index) in places" :key="index">
                      <!-- <span class="markerbg">{{ index }}</span> -->
                      <div class="ml-4 mt-2" @click="selectPlace(place)">
                        <div class="row">
                          <b-icon icon="bookmark-star"></b-icon>
                          <h5 class="ml-1">{{ place.place_name }}</h5>
                        </div>
                        <div v-if="place.road_address_name">
                          <span>{{ place.road_address_name }}</span
                          ><br />
                          <span class="badge badge-info">지번</span>
                          <span>{{ place.address_name }}</span>
                        </div>
                        <div v-else>
                          <span>{{ place.address_name }}</span>
                        </div>
                      </div>
                      <hr style="opacity: 0.3" />
                    </li>
                  </ul>
                  <div id="pagination"></div>
                </div>
              </div>
              <div class="col">
                <div class="mb-2" id="write-place-div">
                  <div>
                    <div class="ml-2" style="text-align: left">지역을 선택하세요</div>
                    <b-form-select v-model="selected" :options="areas" class="me-2 rounded-4"></b-form-select>
                  </div>
                </div>
                <div class="mb-2" id="write-location-div">
                  <div class="ml-2" style="text-align: left">위치</div>
                  <input type="text" v-model="title" class="form-control" readonly />
                </div>
                <div class="mb-2" id="write-title-div">
                  <div class="ml-2" style="text-align: left">제목</div>
                  <input
                    type="text"
                    placeholder="제목을입력하세요"
                    class="form-control"
                    id="title"
                    name="title"
                    v-model="hotpl.title"
                  />
                </div>
                <div class="mb-2" id="write-content-div">
                  <div class="ml-2" style="text-align: left">내용</div>
                  <textarea
                    placeholder="내용을입력하세요"
                    class="form-control"
                    id="content"
                    v-model="hotpl.content"
                    rows="10"
                    name="content"
                  ></textarea>
                </div>
                <div class="mb-2">
                  <div class="ml-2" style="text-align: left; color: red">이미지 1개 필수</div>
                  <div class="ml-2" style="text-align: left; color: red">
                    이미지는 수정이 불가능하니 신중하게 등록해 주세요.
                  </div>
                  <input type="file" id="upload-image" accept="image/*" @change="fileChange($event.target.files)" />
                </div>
                <div class="row m-3" style="justify-content: right">
                  <b-button @click="createHotpl">등록 완료</b-button>
                  <b-button @click="moveList">취소</b-button>
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
  data() {
    return {
      hotpl: {
        title: "",
        content: "",
        writer_id: "",
        latitude: "",
        longitude: "",
        img: "not",
      },
      title: "위치를 검색해 선택하세요.",
      lan: 0,
      log: 0,
      address: "",
      ps: null,
      map: null,
      markers: [],
      keyword: "",
      places: [],
      selected: 1,
      areas: [
        { value: 1, text: "서울" },
        { value: 2, text: "인천" },
        { value: 3, text: "대전" },
        { value: 4, text: "대구" },
        { value: 5, text: "광주" },
        { value: 6, text: "부산" },
        { value: 7, text: "울산" },
        { value: 8, text: "세종특별자치시" },
        { value: 31, text: "경기도" },
        { value: 32, text: "강원도" },
        { value: 33, text: "충청북도" },
        { value: 34, text: "충청남도" },
        { value: 35, text: "경상북도" },
        { value: 36, text: "경상남도" },
        { value: 37, text: "전라북도" },
        { value: 38, text: "전라남도" },
        { value: 39, text: "제주도" },
      ],
    };
  },
  methods: {
    fileChange(file) {
      console.log(file[0]); //files는 배열로 들어온다.
      this.hotpl.img = file[0];
      // await this.base64(this.hotpl.img);
    },
    createHotpl() {
      if (this.hotpl.img === "not") {
        alert("파일을 추가해 주세요");
        return;
      }

      let form = new FormData();
      form.append("title", this.hotpl.title);
      form.append("content", this.hotpl.content);
      form.append("writer_id", this.getUser);
      form.append("latitude", this.lan);
      form.append("longitude", this.log);
      form.append("address", this.address);
      form.append("name", this.title);
      form.append("sido_code", this.selected);
      form.append("file", this.hotpl.img);

      http
        .post("/hotplaceapi/hotplace", form, {
          header: { "Content-Type": "multipart/form-data" },
        })
        .then(({ data }) => {
          let msg = "등록 처리시 문제가 발생했습니다.";
          if (data === 1) {
            msg = "등록이 완료되었습니다.";
          }
          alert(msg);
          this.moveList();
        });
    },
    moveList() {
      console.log(this.selected);
      this.$router.push({
        name: "HotplList",
        params: { id: this.selected },
      });
    },
    initMap() {
      var container = document.getElementById("map");
      var options = {
        center: new kakao.maps.LatLng(37.500613, 127.036431), // 지도의 중심좌표
        level: 5, // 지도의 확대 레벨
      };
      this.map = new kakao.maps.Map(container, options);
      this.ps = new kakao.maps.services.Places();
    },
    searchPlaces() {
      console.log(this.keyword);
      if (!this.keyword.replace(/^\s+|\s+$/g, "")) {
        alert("키워드를 입력해주세요!");
        return false;
      }

      this.ps.keywordSearch(this.keyword, this.placesSearchCB);
    },
    placesSearchCB(data, status, pagination) {
      if (status === kakao.maps.services.Status.OK) {
        // 정상적으로 검색이 완료됐으면
        // 검색 목록과 마커를 표출합니다
        this.displayPlaces(data);
        // 페이지 번호를 표출합니다
        this.displayPagination(pagination);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 존재하지 않습니다.");
        return;
      } else if (status === kakao.maps.services.Status.ERROR) {
        alert("검색 결과 중 오류가 발생했습니다.");
        return;
      }
    },
    displayPlaces(place) {
      var listEl = document.getElementById("placesList"),
        menuEl = document.getElementById("menu_wrap"),
        fragment = document.createDocumentFragment(),
        bounds = new kakao.maps.LatLngBounds(),
        listStr = "";
      // 검색 결과 목록에 추가된 항목들을 제거합니다
      this.places = [];
      this.removeAllChildNods(listEl);
      // 지도에 표시되고 있는 마커를 제거합니다
      this.removeMarker();
      console.log(place);
      for (var i = 0; i < place.length; i++) {
        // 마커를 생성하고 지도에 표시합니다
        var placePosition = new kakao.maps.LatLng(place[i].y, place[i].x),
          marker = this.addMarker(placePosition, i, place[i].place_name);
        // itemEl = this.getListItem(i, place[i]); // 검색 결과 항목 Element를 생성합니다
        this.$set(this.places, i, place[i]);
        bounds.extend(placePosition);
        // fragment.appendChild(itemEl);
      }
      console.log("my", this.places);
      // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
      listEl.appendChild(fragment);
      menuEl.scrollTop = 0;
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      this.map.setBounds(bounds);
    },
    addMarker(position, idx, title) {
      var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(36, 37), // 마커 이미지의 크기
        imgOptions = {
          spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
          spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
          offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
        marker = new kakao.maps.Marker({
          position: position, // 마커의 위치
          image: markerImage,
        }),
        infowindow = new kakao.maps.InfoWindow({
          content: '<div style="padding:5px;z-index:1;">' + title + "</div>",
        });

      marker.setMap(this.map); // 지도 위에 마커를 표출합니다
      this.markers.push(marker); // 배열에 생성된 마커를 추가합니다
      infowindow.open(this.map, marker);
      return marker;
    },
    removeMarker() {
      for (let i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
      this.markers = [];
    },
    displayPagination(pagination) {
      var paginationEl = document.getElementById("pagination"),
        fragment = document.createDocumentFragment(),
        i;

      // 기존에 추가된 페이지번호를 삭제합니다
      while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild);
      }

      for (i = 1; i <= pagination.last; i++) {
        var el = document.createElement("a");
        el.class = "page-link";
        el.href = "#";
        el.innerHTML = i;

        if (i === pagination.current) {
          el.className = "on";
        } else {
          el.onclick = (function (i) {
            return function () {
              pagination.gotoPage(i);
            };
          })(i);
        }

        fragment.appendChild(el);
      }
      paginationEl.appendChild(fragment);
    },
    removeAllChildNods(el) {
      while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
      }
    },
    selectPlace(place) {
      console.log(place);
      this.title = place.place_name;
      this.lan = place.y;
      this.log = place.x;
      this.address = place.address_name;
    },
  },
  computed: {
    ...mapState(["loginUser"]),
    getUser() {
      if (this.loginUser) {
        return this.loginUser.id;
      } else {
        return null;
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
/* by kakao*/
.map_wrap,
.map_wrap * {
  margin: 0;
  padding: 0;
  font-family: "Malgun Gothic", dotum, "돋움", sans-serif;
  font-size: 12px;
}
.map_wrap a,
.map_wrap a:hover,
.map_wrap a:active {
  color: #000;
  text-decoration: none;
}
.map_wrap {
  position: relative;
  width: 100%;
  height: 500px;
}
#menu_wrap {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 250px;
  margin: 10px 0 30px 10px;
  padding: 5px;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.7);
  z-index: 1;
  font-size: 12px;
  border-radius: 10px;
}
.bg_white {
  background: #fff;
}
#menu_wrap hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 2px solid #5f5f5f;
  margin: 3px 0;
}
#menu_wrap .option {
  text-align: center;
}
#menu_wrap .option p {
  margin: 10px 0;
}
#menu_wrap .option button {
  margin-left: 5px;
}
#placesList li {
  list-style: none;
}
#placesList .item {
  position: relative;
  border-bottom: 1px solid #888;
  overflow: hidden;
  cursor: pointer;
  min-height: 65px;
}
#placesList .item span {
  display: block;
  margin-top: 4px;
}
#placesList .item h5,
#placesList .item .info {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
#placesList .item .info {
  padding: 10px 0 10px 55px;
}
#placesList .info .gray {
  color: #8a8a8a;
}
#placesList .info .jibun {
  padding-left: 26px;
  background: url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_jibun.png) no-repeat;
}
#placesList .info .tel {
  color: #009900;
}
#placesList .item .markerbg {
  float: left;
  position: absolute;
  width: 36px;
  height: 37px;
  margin: 10px 0 0 10px;
  background: url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png) no-repeat;
}
#placesList .item .marker_1 {
  background-position: 0 -10px;
}
#placesList .item .marker_2 {
  background-position: 0 -56px;
}
#placesList .item .marker_3 {
  background-position: 0 -102px;
}
#placesList .item .marker_4 {
  background-position: 0 -148px;
}
#placesList .item .marker_5 {
  background-position: 0 -194px;
}
#placesList .item .marker_6 {
  background-position: 0 -240px;
}
#placesList .item .marker_7 {
  background-position: 0 -286px;
}
#placesList .item .marker_8 {
  background-position: 0 -332px;
}
#placesList .item .marker_9 {
  background-position: 0 -378px;
}
#placesList .item .marker_10 {
  background-position: 0 -423px;
}
#placesList .item .marker_11 {
  background-position: 0 -470px;
}
#placesList .item .marker_12 {
  background-position: 0 -516px;
}
#placesList .item .marker_13 {
  background-position: 0 -562px;
}
#placesList .item .marker_14 {
  background-position: 0 -608px;
}
#placesList .item .marker_15 {
  background-position: 0 -654px;
}
#pagination {
  margin: 10px auto;
  text-align: center;
}
#pagination a {
  display: inline-block;
  margin-right: 10px;
}
#pagination .on {
  font-weight: bold;
  cursor: default;
  color: #777;
}

/** 추가 디자인 */
/* #menuDiv {
  display: flex;
  position: relative;
  z-index: 2;
  font-size: 12px;
}

#menu_wrap {
  position: relative;
  width: 400px;
  height: 600px;
  border-radius: 20px;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.7);
}

#map_title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 10px;
}

#form {
  display: flex;
  justify-content: space-between;
  padding: 0px 15px 10px 15px;
}

#keyword {
  width: 100%;
  border: none;
  outline: none;
}

#submit_btn {
  background-color: #ff6e30;
  border: none;
  outline: none;
}

#placesList h5 {
  color: #ff6e30;
}

#placesList li {
  list-style: square;
}
#placesList .item {
  border-bottom: 1px solid #888;
  overflow: hidden;
  cursor: pointer;
}

#placesList .item .info {
  padding: 10px 0 10px 5px;
}

#placesList .item span {
  display: block;
  margin-top: 4px;
}
#placesList .info .gray {
  color: #8a8a8a;
}

#placesList .info .tel {
  color: #009900;
}

#btnDiv {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#pagination {
  margin: 10px auto;
  text-align: center;
}
#pagination a {
  display: inline-block;
  margin-right: 10px;
  color: #7b7b7b;
}
#pagination .on {
  font-weight: bold;
  cursor: default;
  color: #ff6e30;
}

#btnOn {
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#searchBtn {
  width: 20px;
  padding: 0px;
  height: 70px;
  background-color: #ffa230;
  border: none;
  outline: none;
} */
</style>
