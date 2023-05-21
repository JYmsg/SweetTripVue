<template>
<div>
    <div id="date" class="p-2 pb-0">
        <h5>{{travel.title}} : {{travel.startdate}} ~ {{travel.enddate}}</h5>
    </div>
    <div id="days" style="overflow:auto; max-height: 90vh;" class="mt-0">
        <div id="day" class="mb-1" v-for="(day, index) in travel.days" :key="day.id">
        <h3 class="day pl-3 pt-1" :style="'color: ' + colors[index % 9]" @click="onlyLine(index)">Day{{index+1}}({{day.date}})</h3>
        <div id="attractions" v-for="place in day.places" :key="place.content_id" class="p-1">
            <div v-if="place">
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
</template>
<script>
export default {
    // props:{
    //     travel: {
    //         title: String,
    //         days: Array,
    //         startdate: String,
    //         enddate: String
    //     },
    // }
    props: [
      'travel',
      'colors'
    ],
    methods:{
        dumy(index){
            this.$emit("dumy", index);
        },
        onlyLine(index){
            this.$emit("onlyLine", index);
        }
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