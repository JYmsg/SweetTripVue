<template>
<div>
    <div class="searchlist p-2 pb-0 row justify-content-center no-gutters">
        <div class="col-lg-4 col-sm-4">
            <b-form-select v-model="area" :options="areas" class="me-2 rounded-4" @change="searchgugun"></b-form-select>
        </div>
        <div class="col-lg-4 col-sm-4">
            <b-form-select v-model="gugun" :options="guguns" class="me-2 rounded-4"></b-form-select>
        </div>
        <div class="col-lg-4 col-sm-4">
            <b-form-select v-model="type" :options="types" class="me-2 rounded-4"></b-form-select>
        </div>
    </div>
    <div class="searchlist p-2 pb-0 row justify-content-center no-gutters">
        <div class="col-lg-8 col-sm-8 m-1">
            <base-input placeholder="Search" v-model="search"
                addon-left-icon="ni ni-zoom-split-in">
            </base-input>
        </div>
        <div class="col-lg-3 col-sm-3 mt-1">
            <base-button class="btn-1" type="neutral" @click="searchAll">검색</base-button>
        </div>
    </div>
    <div id="days" style="overflow:auto; height: 85vh;" class="mt-0">
        <div id="attractions" v-for="(place, index) in places" :key="place.content_id" class="p-1">
            <div v-if="place" @click="detail(index)" @mouseover="mouseOver(index)" @mouseout="mapCustomOverlay.setMap(null); map.setLevel(5);">
                <div id="att_img_box" class="mb-1">
                    <img id="att_img" :src="`${place.first_image}`" alt="">
                </div>
                <div id="att_address_box" class="text-center mb-1">
                    <h4 class="mt-2 mb-0">{{ place.title }}</h4>
                    <p>{{place.addr1}}</p>
                </div>
            </div>
        </div>      
    </div>
    <modal id="planSearchModal" :show.sync="modal" v-if="modalPlace">
        <h3 slot="header" class="modal-title ml-2" id="modal-title-default">{{ modalPlace.title }}</h3>
        <img id="modal_img" :src="`${modalPlace.first_image}`" alt="">
        <p class="m-2">{{modalPlace.overview}}</p>
        <template slot="footer">
            <div class="">
                <b-form-select v-model="add" :options="adds" class="rounded-4"></b-form-select>
            </div>
            <base-button type="primary" @click="addPlace()">추가하기</base-button>
            <base-button type="link" class="ml-auto" @click="modal = false">Close
            </base-button>
        </template>
    </modal>
</div>
</template>
<script>
import http from "@/util/http-common.js"
import Modal from "@/components/Modal.vue";
import { mapState } from 'vuex';
export default {
    props: [
        // 'daylength',
        'map',
    ],
    components:{
        Modal,
    },
    data(){
        return {
            modal: false,
            area: 1,
            areas: [
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
                gugun: 1,
                guguns: [
                    {value: null, text : '구군선택'},
                    {value: 1, text : '강남구'}
                ],
                type: 39,
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
            adds : [
                {value: null, text : '날짜선택'},
            ],
            add: null,
            search: "",
            places: [],
            modalPlace: null,
            markers: [],
            placelng: 0,
            mapCustomOverlay: null,
        }
    },
    async created(){
        await this.searchgugun();
        console.log(this.daylength);
        for(let i=0; i<this.daylength; i++){
            this.$set(this.adds, i+1, {value: i, text: "Day"+(i+1)});
        }
    },
    computed: {
        ...mapState(["loginUser"]),
    },
    watch:{
        area: {
            handler(){
                this.searchAll();
            }
        },
        gugun:{
            handler(){
                this.searchAll();
            }
        },
        type:{
            handler(){
                this.searchAll();
            }
        }
    },
    methods: {
        mouseOver(index) {
            if (this.mapCustomOverlay) this.mapCustomOverlay.setMap(null);
            var content = '<div class="overlay_info">' +
                '    <a href="#" target="_blank"><strong>' +
                    this.places[index].title +
                    "</strong></a>" +
                    '    <div class="desc">' +
                        '        <span class="address">' +
                            this.places[index].addr1 +
                        "</span>" +
                        "    </div>" +
                        "</div>";
                        
                        // 커스텀 오버레이가 표시될 위치입니다 
                        var position = new kakao.maps.LatLng(this.places[index].latitude, this.places[index].longitude);
                        
                        // 커스텀 오버레이를 생성합니다
                        this.mapCustomOverlay = new kakao.maps.CustomOverlay({
                            position: position,
                            content: content,
                            xAnchor: 0.5, // 커스텀 오버레이의 x축 위치입니다. 1에 가까울수록 왼쪽에 위치합니다. 기본값은 0.5 입니다
                            yAnchor: 1.1 // 커스텀 오버레이의 y축 위치입니다. 1에 가까울수록 위쪽에 위치합니다. 기본값은 0.5 입니다
                        });
                        this.map.setCenter(position);
                        this.map.setLevel(5);
                        
                        // 커스텀 오버레이를 지도에 표시합니다
                this.mapCustomOverlay.setMap(this.map);
            },
        sendMarker() {
            console.log("sendMarker");
            for (let i = 0; i < this.markers.length; i++){
                this.markers[i].setMap(null);
            }
            this.markers = [];
            var imageSrc = "img/markers/location-pin.png"
            var imageSize = new kakao.maps.Size(34, 35);
            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
            var bounds = new kakao.maps.LatLngBounds();
            for (let i = 0; i < this.places.length; i++){
                var marker = new kakao.maps.Marker({
                    map: this.map, // 마커를 표시할 지도
                    position: new kakao.maps.LatLng(this.places[i].latitude, this.places[i].longitude), // 마커를 표시할 위치
                    image: markerImage, // 마커 이미지
                });
                this.$set(this.markers, i, marker);
                bounds.extend(new kakao.maps.LatLng(this.places[i].latitude, this.places[i].longitude));
            };
            this.map.setBounds(bounds);

        },
        async detail(index){
            console.log(this.places[index])
            await http.get("/placeapi/place/one/"+this.places[index].content_id)
            .then(({data})=>{
                this.modalPlace = {
                    title: this.places[index].title,
                    overview: data.overview,
                    first_image: this.places[index].first_image,
                    index: index,
                }
                console.log(this.modalPlace);
            })
            this.modal = true;
        },
        async searchgugun() {
            if(this.area != null){
                await http.get("/gugunapi/gugun/"+this.area)
                .then(({ data }) => {
                    this.gugun = 1;
                    this.guguns = [];
                    this.type = 39;
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
            }
            this.searchAll();

        },
        addPlace(){
            if(this.add == null){
                alert("날짜를 선택하세요")
            }else{
                this.$emit("addPlace", this.add, this.places[this.modalPlace.index]);
            }
        },
        async searchAll(){
            this.places = [];
            if(this.type == null){
                // 시도 선택만
                if(this.gugun == null){
                    http.get("/placeapi/place/list/sido/"+this.area)
                    .then(({data})=>{
                        for(let i=0; i<data.length; i++){
                            this.$set(this.places, i, data[i]);
                        }
                        this.placelng = data.length;
                        this.sendMarker();
                    })
                    .catch((e)=>{
                        alert("검색 오류 입니다.")
                    })
                }
                else{
                    http.get("/placeapi/place/list/sido/"+this.area+"/"+this.gugun)
                    .then(({data})=>{
                        for(let i=0; i<data.length; i++){
                            this.$set(this.places, i, data[i]);
                        }
                        this.placelng = data.length;
                        this.sendMarker();
                    })
                    .catch((e)=>{
                        alert("검색 오류 입니다.")
                    })
                }
            }
            else{
                //시도+관광지타입
                if(this.gugun == null){
                    http.get("/placeapi/place/list/"+this.area+"/"+this.type)
                    .then(({data})=>{
                        for(let i=0; i<data.length; i++){
                            this.$set(this.places, i, data[i]);
                        }
                        this.placelng = data.length;
                        this.sendMarker();
                    })
                    .catch((e)=>{
                        alert("검색 오류 입니다.")
                    })
                }
                else{
                    //전부 선택+키워드 없음.
                    http.post("/placeapi/place/list/"+this.loginUser.id, {
                        sido_code: this.area,
                        gugun_code: this.gugun,
                        contentTypeId: this.type,
                        keyword: ""
                    })
                    .then(({data})=>{
                        for(let i=0; i<data.length; i++){
                            this.$set(this.places, i, data[i]);
                        }
                        this.placelng = data.length;
                        this.sendMarker();
                    })
                    .catch((e)=>{
                        alert("검색 오류 입니다.")
                    })
                }
            }
        }
    },
}
</script>
<style>
.searchlist{
    background-color: #C4DFDF;
}
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
#attractions{
    width: 100%;
    height: 6.5rem;
  /* background-color: #A5D7E8; */
    background-color: black;
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
#modal_img{
    width: 100%;
}



/* from kakao
 */
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