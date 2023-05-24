<template>
  <div>
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
          <h5 class="mr-1">이용 방법이 궁금하신가요</h5>
          <div class="toggle" v-if="!show">
            <b-icon
              icon="question"
              font-scale="2"
              variant="dark"
              @click="showToggle"
              style="cursor: pointer"
            ></b-icon>
          </div>
          <div class="toggle" v-else>
            <b-icon
              icon="question"
              font-scale="2"
              variant="danger"
              @click="showToggle"
              style="cursor: pointer"
            ></b-icon>
          </div>
        </div>
      </div>
    </div>
    <transition name="slide-fade">
      <div
        v-if="show"
        class="row p-5"
        style="
          justify-content: space-between;
          background-color: rgba(249, 249, 239, 0.944);
          align-items: center;
        "
      >
        <div class="method" style="background-color: #f56e6e; color: white">
          <div class="txt">
            등록된 <br />핫플레이스와 일정을 <br />
            구경해 보세요
          </div>
        </div>
        <b-icon icon="arrow-right" font-scale="2"></b-icon>
        <div class="method" style="background-color: #ff9364; color: white">
          <div class="txt">관광지를 찾아서 <br />나만의 장소로 찜!</div>
        </div>
        <b-icon icon="arrow-right" font-scale="2"></b-icon>
        <div class="method" style="background-color: #ffc81e; color: white">
          <div class="txt">여행 정보를 입력하고 <br />함께 여행할 친구를 <br />선택하세요</div>
        </div>
        <b-icon icon="arrow-right" font-scale="2"></b-icon>
        <div class="method" style="background-color: #4ca975; color: white">
          <div class="txt">날짜,시간별 계획을 <br />세워보세요</div>
        </div>
        <b-icon icon="arrow-right" font-scale="2"></b-icon>
        <div class="method" style="background-color: #3caeff; color: white">
          <div class="txt">내가 세운 일정을 <br />확인하세요</div>
        </div>
      </div>
    </transition>
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
      show: false,
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
  methods: {
    showToggle() {
      if (!this.show) this.show = true;
      else this.show = false;
    },
  },
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.8s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.method {
  position: relative;
  width: 12rem;
  height: 10rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.method .txt {
  position: absolute;
  text-align: center;
  font-size: 18px;
}

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
  /* background-color: #c4d1da; */
  background-color: rgba(249, 249, 239, 0.944);
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
