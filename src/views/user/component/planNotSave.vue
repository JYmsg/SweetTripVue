<template>
<div id="resultBox" style="width: 100%">
  <div
    class="row card m-3 col-lg-11 col-sm-11 pb-0"
    v-for="plan in notsavePlans"
    :key="plan.id"
    @click="moveRegi(plan.id)"
  >
    <div class="row">
      <div class="col-lg-12 col-sm-12 p-0">
        <div class="card-body col-lg-12">
          <h5 class="card-title">{{ plan.title }}</h5>
          <p class="card-text">
            <small class="text-muted">{{
            plan.startdate + "~" + plan.enddate
            }}</small>
          </p>
          <div v-for="(day, index) in plan.days" :key="day.id">
            <p class="mb-1">day{{ index+1 }} : </p>
            <div style="white-space : nowrap; display:inline;" v-for="place in day.places" :key="place.content_id">
            - {{place.title}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  props: [
    'notsavePlans'
  ],
  methods: {
    moveRegi(id) {
      this.$router.push({ name: "PlanRegist", params: { id: id } });
    }
  }
}
</script>
