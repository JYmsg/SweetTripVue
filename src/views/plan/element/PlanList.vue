<template>
<div>
    <div>
    <div id="date" class="p-2 pb-0">
        <h5>{{travel.title}} : {{travel.startdate}} ~ {{travel.enddate}}</h5>
        <base-button type="info" size="sm" @click="add()">날짜추가</base-button>
        <base-button type="default" size="sm" @click="remove()">날짜삭제</base-button>
    </div>
    <div id="days" style="overflow:auto; max-height: 80vh;" class="mt-0">
        <div id="day" class="mb-1" v-for="(day, index) in travel.days" :key="day.id"
        @drop.prevent="drop(index)"
        @dragenter.prevent
        @dragover.prevent
        >
        <div class="row day no-gutters">
          <h3 class="pl-3 pt-1 col-lg-10" :style="'color: ' + colors[index % 9]" @click="onlyLine(index)">Day{{index+1}}({{day.date}})</h3>
          <base-button type="default" size="sm" class="col-lg-2 float-right mt-1" style="height: 2.5rem;" @click="memo(index)">상세 설정</base-button>
        </div>
          <div id="attractions" v-for="place in day.places" :key="place.content_id" class="p-1" 
          >
            <div v-if="place" @click="moveMap(place.latitude, place.longitude)">
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
    <modal id="planSearchModal" :show.sync="modal">
        <h3 slot="header" class="modal-title ml-2" id="modal-title-default">해당 장소에서의 상세 정보를 적어주세요</h3>
        <div class="row">
          <div class="col-md-6 col-lg-6 mt-4 mt-md-0">
            <p class="d-block text-uppercase font-weight-bold mb-2">출발시간</p>
            <div class="row align-items-center">
              <div class="col">
                <b-form-select v-model="start" :options="starts" class="me-2 rounded-4"></b-form-select>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-6 mt-4 mt-md-0">
            <p class="d-block text-uppercase font-weight-bold mb-2">도착시간</p>
            <div class="row align-items-center">
              <div class="col">
                <b-form-select class="me-2 rounded-4"></b-form-select>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 col-lg-12 mt-3 mb-0 ml-0 mr-0">
              <p class="d-block text-uppercase font-weight-bold mb-2">메모</p>
              <div class="row align-items-center">
                <div class="col">
                  <textarea
                      placeholder="메모를 입력하세요"
                      class="form-control"
                      id="content"
                      v-model="textMemo"
                      rows="3"
                    ></textarea>
                </div>
              </div>
          </div>
        </div>
        <template slot="footer">
            <base-button type="primary">등록</base-button>
            <base-button type="link" class="ml-auto" @click="modal = false">Close
            </base-button>
        </template>
    </modal>
</div>
</template>
<script>
import Modal from "@/components/Modal.vue";
export default {
  components:{
        Modal,
    },
    props: [
      'travel',
      'colors'
    ],
    data(){
      return {
        textMemo: "",
        modal: false,
        start: 1,
        starts: [
          {value: 1, text : '00:00'},
          {value: 2, text : '00:30'},
          {value: 3, text : '01:00'},
          {value: 4, text : '01:30'},
          {value: 5, text : '02:00'},
          {value: 6, text : '02:30'},
          {value: 7, text : '03:00'},
          {value: 8, text : '03:30'},
          {value: 9, text : '04:00'},
          {value: 10, text : '04:30'},
          {value: 11, text : '05:00'},
          {value: 12, text : '05:30'},
          {value: 13, text : '06:00'},
          {value: 14, text : '06:30'},
          {value: 15, text : '07:00'},
          {value: 16, text : '07:30'},
          {value: 17, text : '08:00'},
          {value: 18, text : '08:30'},
          {value: 19, text : '09:00'},
          {value: 20, text : '09:30'},
          {value: 21, text : '10:00'},
          {value: 22, text : '10:30'},
          {value: 23, text : '11:00'},
          {value: 24, text : '11:30'},
          {value: 25, text : '12:00'},
          // {value: 1, text : '05:00'},
          // {value: 1, text : '05:00'},
          // {value: 1, text : '05:00'},
          // {value: 1, text : '05:00'},
          // {value: 1, text : '05:00'},
          // {value: 1, text : '05:00'},
          // {value: 1, text : '05:00'},
          // {value: 1, text : '05:00'},
          // {value: 1, text : '05:00'},
          // {value: 1, text : '05:00'},
          // {value: 1, text : '05:00'},
          // {value: 1, text : '05:00'},
          // {value: 1, text : '05:00'},
          // {value: 1, text : '05:00'},
        ],
      }
    },
    methods:{
      memo(index){
        // this.$emit("memo", index);
        console.log()
        this.modal = true;
      },
      dumy(index){
          this.$emit("dumy", index);
      },
      onlyLine(index){
          this.$emit("onlyLine", index);
      },
      moveMap(lan, lng) {
        this.$emit("moveMap", lan, lng);
      },
      drop(index) {
        console.log("listin")
        this.$emit("drop", index);
      },
      add(){
        this.$emit("add");
      },
      remove(){
        this.$emit("remove");
      },
    },
}
</script>
<style>
#date{
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
</style>