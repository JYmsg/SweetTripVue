<template>
  <div>
    <hero></hero>
    <main-hotpl></main-hotpl>
  </div>
</template>
<script>
import Hero from "./components/Hero.vue";
import MainHotpl from "./components/MainHotpl.vue";

export default {
  name: "components",
  components: {
    Hero,
    MainHotpl,
  },
};
</script>
