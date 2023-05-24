<template>
  <div>
    <hero></hero>
    <main-notice></main-notice>
    <main-hotpl></main-hotpl>
  </div>
</template>
<script>
import Hero from "./components/Hero.vue";
import MainHotpl from "./components/MainHotpl.vue";
import MainNotice from "./components/MainNotice.vue";

export default {
  name: "components",
  components: {
    Hero,
    MainNotice,
    MainHotpl,
  },
};
</script>
