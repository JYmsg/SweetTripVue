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
                        <div class="row justify-content-center m-5">
                            <h4>“🔍” 여행지를 검색하세요!</h4>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-lg-3 col-sm-6">
                                <b-form-select v-model="area" :options="areas" class="me-2 rounded-4" @change="searchgugun"></b-form-select>
                            </div>
                            <div class="col-lg-2 col-sm-6">
                                <b-form-select v-model="gugun" :options="guguns" class="me-2 rounded-4"></b-form-select>
                            </div>
                            <div class="col-lg-3 col-sm-6">
                                <b-form-select v-model="place" :options="places" class="me-2 rounded-4"></b-form-select>
                            </div>
                            <div class="justify-content-center col-lg-3 col-sm-3">
                                <base-input placeholder="Search" v-model="search"
                                    addon-left-icon="ni ni-zoom-split-in">
                                </base-input>
                            </div>
                            <div class="col-lg-1 col-sm-3">
                                <base-button class="btn-1" type="neutral">검색</base-button>
                            </div>
                            <div class="card-profile-stats d-flex justify-content-center">
                                맵
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
export default {
    data() {
        return {
            search: null,
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
            place: null,
            places: [
                {value: null, text : '관광지 유형'},
                {value: 12, text : '관광지'},
                {value: 14, text : '문화시설'},
                {value: 15, text : '축제공연행사'},
                {value: 25, text : '여행코스'},
                {value: 28, text : '레포츠'},
                {value: 32, text : '숙박'},
                {value: 38, text : '쇼핑'},
                {value: 39, text : '음식점'},
            ]
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
    }
}
</script>
<style>

</style>