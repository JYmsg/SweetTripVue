<template>
    <!-- <div class="row"> -->
        <!-- <div class="col-md-4">
            <small class="d-block text-uppercase font-weight-bold mb-3">Single date</small>
            <base-input addon-left-icon="ni ni-calendar-grid-58">
                <flat-picker slot-scope="{focus, blur}"
                             @on-open="focus"
                             @on-close="blur"
                             :config="{allowInput: true}"
                             class="form-control datepicker"
                             v-model="dates.simple">
                </flat-picker>
            </base-input>
        </div> -->
        <div class="col-md-11 mt-4 mt-md-0">
            <p class="d-block text-uppercase font-weight-bold mb-2">여행 기간</p>

            <div class="input-daterange datepicker row align-items-center">
                <div class="col">
                    <base-input addon-left-icon="ni ni-calendar-grid-58">
                        <flat-picker slot-scope="{focus, blur}"
                            @on-open="focus"
                            @on-close="blur"
                            :config="{allowInput: true, mode: 'range',}"
                            class="form-control datepicker"
                            v-model="range"
                            @change="sendRange()"
                          >
                        </flat-picker>
                    </base-input>
                </div>
            </div>
        </div>
    <!-- </div> -->
</template>
<script>
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import moment from "moment";
export default {
  components: {
    flatPicker,
    moment
  },
  data() {
    return {
      range: moment(new Date()).format('YYYY-MM-DD')+" to "+moment(new Date()).format('YYYY-MM-DD')
    };
  },
  watch: {
    range(newrange){
      this.$emit("sendRange", newrange);
    }
  },
};
</script>
