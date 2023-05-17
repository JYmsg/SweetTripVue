<template>
  <div>
    <router-view :user="user"></router-view>
  </div>
</template>

<script>
export default {
  props: {
    user: null,
  },
};
</script>

<style></style>
