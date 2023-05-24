<template>
  <div class="notice-line">
    <div class="bg-left"></div>
    <div class="bg-right"></div>
    <div class="inner">
      <div class="inner__left">
        <h4>공지사항</h4>
        <div class="swiper-container">
          <swiper class="swiper-wrapper" :options="swiperOption">
            <div class="swiper-slide" v-for="(notice, index) in notices" :key="index">
              <swiperSlide class="move">{{ notice }}</swiperSlide>
            </div>
          </swiper>
        </div>
        <router-link to="/notice/list" class="notice-line__more">
          <b-icon icon="plus-circle" font-scale="2" class="mr-3" variant="secondary"></b-icon>
        </router-link>
      </div>
      <div class="inner__right">
        <h5 class="mr-3">다른 사람 여행 일정 보러가기</h5>
        <router-link to="/notice/list" class="notice-line__more">
          <b-icon icon="calendar-range" font-scale="1.5" variant="dark"></b-icon>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import http from "@/util/http-common.js";
import { mapState } from "vuex";

import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";

export default {
  components: {
    swiper,
    swiperSlide,
  },
  data() {
    return {
      swiperOption: {
        loop: true,
        direction: "vertical",
        autoplay: true,
      },
      notices: [],
    };
  },
  computed: {
    ...mapState(["loginUser"]),
    getUser() {
      if (this.loginUser) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    http.get("/noticeapi/notice/none/none").then(({ data }) => {
      let index = 0;
      for (let i = 0; i < data.length; i++) {
        var category = data[i].title.substr(0, 6);
        if (category == "[공지사항]") {
          this.$set(this.notices, index, data[i].title);
          index++;
        }
      }
    });
  },
};
</script>

<style scoped>
.inner {
  width: 1100px;
  margin: 0 auto;
  position: relative;
}
.btn {
  width: 130px;
  padding: 10px;
  border: 2px solid #333;
  border-radius: 4px;
  color: #333;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  box-sizing: border-box;
  display: block;
  transition: 0.4s;
}
.btn:hover {
  background-color: #333;
  color: #fff;
}

/* NOTICE */
.notice-line {
  position: relative;
}
.notice-line .bg-left {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background-color: #2f4858;
}
.notice-line .bg-right {
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  background-color: #c4d1da;
}
.notice-line .inner {
  height: 62px;
  display: flex;
}
.notice-line .inner__left {
  width: 60%;
  height: 100%;
  background-color: #2f4858;
  display: flex;
  align-items: center;
  text-align: center;
}
.notice-line .inner__left h4 {
  color: #fff;
  font-weight: 700;
  margin: 0 auto;
}
.notice-line .inner__left .swiper-container {
  margin-left: 20px;
  height: 62px;
  flex-grow: 1;
}
.notice-line .inner__left .swiper-slide {
  height: 62px;
  display: flex;
  align-items: center;
}
.notice-line .inner__left .swiper-slide .move {
  color: #fff;
  margin: 0 auto;
}
.notice-line .inner__left .notice-line__more {
  width: 62px;
  height: 62px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.notice-line .inner__right {
  width: 40%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.notice-line .inner__right h5 {
  font-weight: 700;
  margin: 0 auto;
}
</style>
