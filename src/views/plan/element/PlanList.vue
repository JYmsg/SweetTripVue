<template>
<div>
    <div>
    <div id="date" class="p-2 pb-0" v-if="showTitle">
      <div class="row">
        <h5 class="ml-3 mr-2" style="width: 80%">{{travel.title}} : {{travel.startdate}} ~ {{travel.enddate}}</h5>
        <img class="ml-2" src="/img/icons/common/modify.png" style="height: 1rem; width: 1rem;" @click="showTitle=false">
      </div>
        <base-button type="info" size="sm" @click="add()">날짜추가</base-button>
        <base-button type="default" size="sm" @click="remove()">날짜삭제</base-button>
    </div>
    <div id="date" class="p-2 pb-0" v-else>
      <div class="row">
        <input class="ml-3 mr-2  rounded-4" type="text" style="border: 0.1px solid; background: transparent; height: 3rem; width: 80%; font: 13px;" v-model="travel.title">
        <div  class="float-right">
          <img class="ml-2" src="/img/icons/common/save.png" style="height: 1rem; width: 1rem;" @click="showTitle=true">
        </div>
      </div>
    </div>
    <div id="days" style="overflow:auto; max-height: 80vh;" class="mt-0">
        <div id="day" class="mb-1" v-for="(day, index) in travel.days" :key="day.id"
        @drop.prevent="drop(index)"
        @dragenter.prevent
        @dragover.prevent
        >
        <div class="row day no-gutters">
          <h5 class="pl-3 pt-1 col-lg-10" :style="'color: ' + colors[index % 9]" @click="onlyLine(index)">Day{{index+1}}({{day.date}})</h5>
        </div>
          <div id="attractions" v-for="(place, idx) in day.places" :key="day.id+'-'+place.content_id" class="p-1"
          >
            <div v-if="place" @click="moveMap(place.latitude, place.longitude)"
              draggable="true"
              @dragstart="dragPlace(index, idx, place)"
              >
              <div style="height: 3rem;">
                <div id="att_img_box" class="mb-1">
                  <img id="att_img" :src="`${place.first_image}`" alt="">
                </div>
                <div id="att_address_box" class="text-center mb-1">
                  <div style="height: 3.5rem;">
                    <div>
                      <div class="row">
                        <h5 class="mt-2 mb-0 float-left col-lg-10">{{ place.title }}</h5>
                        <div class="float-right p-1" style="height: 1.5rem; width: 1.5rem;" @click="removeDayPlace(index, idx)">
                          <img src="/img/logo/logoX.jpg" style="height:100%; width:100%;" alt="">
                        </div>
                      </div>
                    </div>
                    <p>{{place.addr1}}</p>
                  </div>
                  <base-button type="default" class="p-1 float-right mr-1" @click="memo(place)" style="height:1.5rem; font-size:12px; min-width:2.5rem;">more</base-button>
                </div>
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
        <h3 slot="header" class="modal-title ml-2" id="modal-title-default">{{modalPlace.title}}에서의 정보를 남겨주세요.</h3>
        <div class="row">
          <div class="col-md-6 col-lg-6 mt-4 mt-md-0">
            <p class="d-block text-uppercase font-weight-bold mb-2">장소 도착 시간</p>
            <div class="row align-items-center">
              <div class="col">
                <b-form-select v-model="modalPlace.starttime" :options="starts" class="me-2 rounded-4"></b-form-select>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-6 mt-4 mt-md-0">
            <p class="d-block text-uppercase font-weight-bold mb-2">장소 떠날 시간</p>
            <div class="row align-items-center">
              <div class="col">
                <b-form-select class="me-2 rounded-4" v-model="modalPlace.endtime" :options="ends"></b-form-select>
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
                      v-model="modalPlace.memo"
                      rows="3"
                    ></textarea>
                </div>
              </div>
          </div>
        </div>
        <template slot="footer">
            <base-button type="primary" @click="memoRegi()">등록</base-button>
            <base-button type="link" class="ml-auto" @click="modal = false">Close
            </base-button>
        </template>
    </modal>
</div>
</template>
<script>
import Modal from "@/components/Modal.vue";
import draggable from 'vuedraggable'

export default {
  components:{
      Modal,
      draggable,
    },
    props: [
      'travel',
      'colors'
    ],
    data(){
      return {
        showTitle: true,
        textMemo: "",
        modal: false,
        start: 1,
        modalPlace: {
          title: "",
          starttime: 1,
          endtime: 1,
        },
        setPlace: null,
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
          {value: 26, text : '12:30'},
          {value: 27, text : '13:00'},
          {value: 28, text : '13:30'},
          {value: 29, text : '14:00'},
          {value: 30, text : '14:30'},
          {value: 31, text : '15:00'},
          {value: 32, text : '15:30'},
          {value: 33, text : '16:00'},
          {value: 34, text : '16:30'},
          {value: 35, text : '17:00'},
          {value: 36, text : '17:30'},
          {value: 37, text : '18:00'},
          {value: 13, text : '18:30'},
          {value: 14, text : '19:00'},
          {value: 15, text : '19:30'},
          {value: 16, text : '20:00'},
          {value: 17, text : '20:30'},
          {value: 18, text : '21:00'},
          {value: 19, text : '21:30'},
          {value: 20, text : '22:00'},
          {value: 21, text : '22:30'},
          {value: 22, text : '23:00'},
          {value: 23, text : '23:30'},
          {value: 24, text : '24:00'},
        ],
        end: 1,
        ends: [
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
          {value: 26, text : '12:30'},
          {value: 27, text : '13:00'},
          {value: 28, text : '13:30'},
          {value: 29, text : '14:00'},
          {value: 30, text : '14:30'},
          {value: 31, text : '15:00'},
          {value: 32, text : '15:30'},
          {value: 33, text : '16:00'},
          {value: 34, text : '16:30'},
          {value: 35, text : '17:00'},
          {value: 36, text : '17:30'},
          {value: 37, text : '18:00'},
          {value: 13, text : '18:30'},
          {value: 14, text : '19:00'},
          {value: 15, text : '19:30'},
          {value: 16, text : '20:00'},
          {value: 17, text : '20:30'},
          {value: 18, text : '21:00'},
          {value: 19, text : '21:30'},
          {value: 20, text : '22:00'},
          {value: 21, text : '22:30'},
          {value: 22, text : '23:00'},
          {value: 23, text : '23:30'},
          {value: 24, text : '24:00'},
        ],
      }
    },
  methods: {
    dragPlace(index, idx, place) {
      this.$emit("dragPlace", index, idx, place);
    },
    removeDayPlace(index, idx) {
      this.$emit("removeDayPlace", index, idx);
    },
    memoRegi() {
      this.setPlace.memo = this.modalPlace.memo;
      this.setPlace.starttime = this.modalPlace.starttime;
      this.setPlace.endtime = this.modalPlace.endtime;
      this.modal = false;
      this.modalPlace = {};
      this.setPlace = null;
      },
      memo(place){
        console.log(place)
        this.setPlace = place;
        if (this.setPlace.starttime == null) {
          this.setPlace.starttime = 1;
        }
        if (this.setPlace.endtime == null) {
          this.setPlace.endtime = 1;
        }
        this.modalPlace = {
          title: this.setPlace.title,
          memo: this.setPlace.memo,
          starttime: this.setPlace.starttime,
          endtime: this.setPlace.endtime
        };
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
  height: 4rem;
}
#att_address_box{
  float: right;
  width: 66%;
  height: 4rem;
  background: #F8F6F4;
  overflow: hidden;
}
</style>