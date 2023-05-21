<template>
    <div>
        <section class="section-profile-cover section-shaped my-0">
            <div class="shape shape-login">
            </div>
        </section>
        <section class="section section-skew">
            <div class="container">
                <card shadow class="card-profile mt--300" no-body>
                    <div class="px-4">
                        <div class="m-5">
                          <div class="row float-right">
                            <button type="button" class="btn btn-sky" @click="moveProfile">
                              <img src="img/icons/noti/car-full.png" style="width: 1.5rem; height: 1.5rem;" /><span class="badge badge-info" v-if="getCarts">{{ cartslength }}</span>
                            </button>
                          </div>
                          <div class="row justify-content-center">
                              <h3>🔍 여행지를 검색하세요!</h3>
                          </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-lg-3 col-sm-6">
                                <b-form-select v-model="area" :options="areas" class="me-2 rounded-4" @change="searchgugun"></b-form-select>
                            </div>
                            <div class="col-lg-2 col-sm-6">
                                <b-form-select v-model="gugun" :options="guguns" class="me-2 rounded-4"></b-form-select>
                            </div>
                            <div class="col-lg-3 col-sm-6">
                                <b-form-select v-model="type" :options="types" class="me-2 rounded-4"></b-form-select>
                            </div>
                            <div class="justify-content-center col-lg-3 col-sm-3">
                                <base-input placeholder="Search" v-model="search"
                                    addon-left-icon="ni ni-zoom-split-in">
                                </base-input>
                            </div>
                            <div class="col-lg-1 col-sm-3">
                                <base-button class="btn-1" type="neutral" @click="searchPlaces">검색</base-button>
                            </div>
                        </div>
                        <!-- 지도 -->
                        <div id="map" class="m-3" style="width: 100%; height: 400px">
                        </div>

                        <div class="row justify-content-center mt-5">
                            <div id="resultBox" style="width: 100%">
                                
                                <div class='row card m-3 col-lg-11 col-sm-11' v-for="(place, index) in places" :key="place.content_id">
                                    <div class='row g-0'><div class='col-md-3'>
                                        <img style='height:200px; width: 300px'
                                        :src="`${place.first_image}`"
                                        class='img-fluid rounded-start' alt='test'></div><div class='col-md-8'>
                                            <div class='card-body'>
                                                <h5 class='card-title' @click="moveCenter(`${place.latitude}`, `${place.longitude}`)">{{ place.title }}</h5>
                                                <p class='card-text'>
                                                    <small class='text-muted'>{{ place.addr1 +" "+ place.addr2}}</small>
                                                </p>
                                                <img :src="filters[index]" style="width: 2rem; height: 2rem;" alt="cart" size='sm' type='default' v-b-popover.hover.bottom='`장바구니에 담아서 더 간편하게 여행계획을 세워보아요.`' title='장바구니에 담기!' @click="inCart(index, place.content_id)" />
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
import http from "@/util/http-common.js"
import { mapState } from "vuex"
//https://map.naver.com/v5/search/%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C%20%EA%B0%95%EB%82%A8%EA%B5%AC%20%EC%82%BC%EC%84%B1%EB%A1%9C%20634/place/1431214756?c=19,0,0,0,dh&isCorrectAnswer=true 상세 위치 검색
export default {
    data() {
      return {
        user: null,
        map: null,
        search: "",
        area: null,
        areas: [
          {value: null, text : '검색할 지역 선택'},
          {value: 1, text : '서울'},
          {value: 2, text : '인천'},
          {value: 3, text : '대전'},
          {value: 4, text : '대구'},
          {value: 5, text : '광주'},
          {value: 6, text : '부산'},
          {value: 7, text : '울산'},
          {value: 8, text : '세종특별자치시'},
          {value: 31, text : '경기도'},
          {value: 32, text : '강원도'},
          {value: 33, text : '충청북도'},
          {value: 34, text : '충청남도'},
          {value: 35, text : '경상북도'},
          {value: 36, text : '경상남도'},
          {value: 37, text : '전라북도'},
          {value: 38, text : '전라남도'},
          {value: 39, text : '제주도'},
        ],
        gugun: null,
        guguns: [
            {value: null, text : '구군선택'}
        ],
        type: null,
        types: [
          {value: null, text : '관광지 유형'},
          {value: 12, text : '관광지'},
          {value: 14, text : '문화시설'},
          {value: 15, text : '축제공연행사'},
          {value: 25, text : '여행코스'},
          {value: 28, text : '레포츠'},
          {value: 32, text : '숙박'},
          {value: 38, text : '쇼핑'},
          {value: 39, text : '음식점'},
        ],
      places: [],
      markers: [],
      filters: [],
      carts: [],
      cartslength: 0,
    }
  },
  computed: {
    ...mapState(["loginUser"]),
    async getCarts(){
      console.log("computed" , this.loginUser)
      await http.get("/cartapi/cart/list/" + this.loginUser.id)
      .then(({ data }) => {
        for (let i = 0; i < data.length; i++){
          this.$set(this.carts, i, data[i]);
        }
        this.cartslength = this.carts.length;
      })
      return true;
    }
  },
  methods: {
    searchgugun() {
      http.get("/gugunapi/gugun/"+this.area)
      .then(({ data }) => {
        this.gugun = null;
        this.guguns = [];
        let first = { value: null, text: '구군선택' };
        this.$set(this.guguns, 0, first);
        for (let i = 0; i < data.length; i++){
          let gugun = {
            value: data[i].gugun_code,
            text: data[i].gugun_name
          };
          this.$set(this.guguns, i+1, gugun);
        }
      })
      .catch(()=>{
          alert("잘못된 접근 입니다.");
      })
    },
    searchPlaces() {
      http.post("/placeapi/place/list/"+this.loginUser.id, {
        sido_code: this.area,
        gugun_code: this.gugun,
        contentTypeId: this.type,
        keyword: this.search
      })
      .then(({ data }) => {
        console.log(data);
        this.initMap();
        this.places = []; this.filters = []; this.markers = [];
        for (let i = 0; i < data.length; i++){
          var value = data[i];
          if (value.first_image == "") { // 이미지가 없는 경우 이미지 대체
            data[i].first_image = "img/logo/no-image.PNG";
            }
          this.$set(this.places, i, data[i]);
          let markerInfo = {
              title: data[i].title,
              latlng: new kakao.maps.LatLng(data[i].latitude, data[i].longitude)
          };
          this.$set(this.markers, i, markerInfo);
          if(data[i].in == true){
            this.$set(this.filters, i, "img/icons/noti/car-full.png");
          }else{
            this.$set(this.filters, i, "img/icons/noti/car-bean.png");
          }
        };
        this.displayMarker();
      })
      .catch(()=>{
          alert("검색오류입니다.");
      })
    },
    initMap() {
      var container = document.getElementById("map");
      var options = {
          center: new kakao.maps.LatLng(37.500613, 127.036431), // 지도의 중심좌표
          level: 5, // 지도의 확대 레벨
      };
      this.map = new kakao.maps.Map(container, options);
    },
    displayMarker() {
      var imageSrc = "img/markers/marker_share.png"

      var bounds = new kakao.maps.LatLngBounds();

      for (var i = 0; i < this.markers.length; i++) {
        // 마커 이미지의 이미지 크기 입니다
        var imageSize = new kakao.maps.Size(34, 35);

        // 마커 이미지를 생성합니다
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            map: this.map, // 마커를 표시할 지도
            position: this.markers[i].latlng, // 마커를 표시할 위치
            title: this.markers[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image: markerImage, // 마커 이미지
        });

        // marker.setMap(this.map);
        // LatLngBounds 객체에 좌표를 추가합니다
        var content = '<div class="customoverlay">' +
        '  <a href="https://map.naver.com/v5/search/'+this.places[i].title+'/place" target="_blank">' +
        '    <span class="title">'+this.places[i].title+'</span>' +
        '  </a>' +
        '</div>';

        var customOverlay = new kakao.maps.CustomOverlay({
          map: this.map,
          position: this.markers[i].latlng,
          content: content,
          yAnchor: 0.2
        });
        bounds.extend(this.markers[i].latlng);
        customOverlay.setMap(this.map);
      }
      this.map.setBounds(bounds);
    },
    moveCenter(lat, lng) {
      this.map.setCenter(new kakao.maps.LatLng(lat, lng));
    },
    moveProfile(){
      console.log("move");
      this.$router.push({ name: "profile" });
    },
    inCart(index, placeId) {
      console.log("incart", this.loginUser)
      http.post("/cartapi/cart/place", {
        user_id: this.loginUser.id,
        attraction_id : placeId
      }).then(({ data }) => {
        this.$set(this.filters, index, "img/icons/noti/car-full.png");
        this.$set(this.carts, this.cartslength, this.places[placeId]);
        this.cartslength += 1;
        alert("장바구니 담았습니다.")
      }).catch(() => {
        alert("실패")
      })
      
    }
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
  }
}
</script>

<style>
.customoverlay {position:relative;bottom:85px;border-radius:6px;border: 1px solid #ccc;border-bottom:2px solid #ddd;float:left;}
.customoverlay:nth-of-type(n) {border:0; box-shadow:0px 1px 2px #888;}
.customoverlay a {display:block;text-decoration:none;color:#000;text-align:center;border-radius:6px;font-size:14px;font-weight:bold;overflow:hidden;background: #8CADF2;background: #8CADF2 url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/arrow_white.png) no-repeat right 14px center;}
.customoverlay .title {display:block;text-align:center;background:#fff;margin-right:35px;padding:10px 15px;font-size:14px;font-weight:bold;}
.customoverlay:after {content:'';position:absolute;margin-left:-12px;left:50%;bottom:-12px;width:22px;height:12px;background:url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png')}
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
}
.card > hr {
  margin-right: 0;
  margin-left: 0;
}
.card > .list-group {
  border-top: inherit;
  border-bottom: inherit;
}
.card > .list-group:first-child {
  border-top-width: 0;
  border-top-left-radius: calc(0.25rem - 1px);
  border-top-right-radius: calc(0.25rem - 1px);
}
.card > .list-group:last-child {
  border-bottom-width: 0;
  border-bottom-right-radius: calc(0.25rem - 1px);
  border-bottom-left-radius: calc(0.25rem - 1px);
}
.card > .card-header + .list-group,
.card > .list-group + .card-footer {
  border-top: 0;
}

.card-body {
  flex: 1 1 auto;
  padding: 1rem 1rem;
}

.card-title {
  margin-bottom: 0.5rem;
}

.card-subtitle {
  margin-top: -0.25rem;
  margin-bottom: 0;
}

.card-text:last-child {
  margin-bottom: 0;
}

.card-link + .card-link {
  margin-left: 1rem;
}

.card-header {
  padding: 0.5rem 1rem;
  margin-bottom: 0;
  background-color: rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
}
.card-header:first-child {
  border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
}

.card-footer {
  padding: 0.5rem 1rem;
  background-color: rgba(0, 0, 0, 0.03);
  border-top: 1px solid rgba(0, 0, 0, 0.125);
}
.card-footer:last-child {
  border-radius: 0 0 calc(0.25rem - 1px) calc(0.25rem - 1px);
}

.card-header-tabs {
  margin-right: -0.5rem;
  margin-bottom: -0.5rem;
  margin-left: -0.5rem;
  border-bottom: 0;
}

.card-header-pills {
  margin-right: -0.5rem;
  margin-left: -0.5rem;
}

.card-img-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1rem;
  border-radius: calc(0.25rem - 1px);
}

.card-img,
.card-img-top,
.card-img-bottom {
  width: 100%;
}

.card-img,
.card-img-top {
  border-top-left-radius: calc(0.25rem - 1px);
  border-top-right-radius: calc(0.25rem - 1px);
}

.card-img,
.card-img-bottom {
  border-bottom-right-radius: calc(0.25rem - 1px);
  border-bottom-left-radius: calc(0.25rem - 1px);
}

.card-group > .card {
  margin-bottom: 0.75rem;
}
@media (min-width: 576px) {
  .card-group {
    display: flex;
    flex-flow: row wrap;
  }
  .card-group > .card {
    flex: 1 0 0%;
    margin-bottom: 0;
  }
  .card-group > .card + .card {
    margin-left: 0;
    border-left: 0;
  }
  .card-group > .card:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .card-group > .card:not(:last-child) .card-img-top,
.card-group > .card:not(:last-child) .card-header {
    border-top-right-radius: 0;
  }
  .card-group > .card:not(:last-child) .card-img-bottom,
.card-group > .card:not(:last-child) .card-footer {
    border-bottom-right-radius: 0;
  }
  .card-group > .card:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .card-group > .card:not(:first-child) .card-img-top,
.card-group > .card:not(:first-child) .card-header {
    border-top-left-radius: 0;
  }
  .card-group > .card:not(:first-child) .card-img-bottom,
.card-group > .card:not(:first-child) .card-footer {
    border-bottom-left-radius: 0;
  }
}
</style>