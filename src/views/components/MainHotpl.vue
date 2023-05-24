<template>
  <div class="promotion">
    <!-- {{ images }} -->
    <swiper class="swiper-container" :options="swiperImageOption">
      <div class="swiper-wrapper" v-for="index in 8" :key="index">
        <div class="swiper-slide">
          <img :src="images[index]" />
          <!-- <a href="#" class="btn">자세히 보기</a> -->
        </div>
      </div>
      <div class="swiper-pagination" slot="pagination"></div>
      <div class="swiper-prev" slot="button-prev">
        <b-icon icon="arrow-left-short" font-scale="2"></b-icon>
      </div>
      <div class="swiper-next" slot="button-next">
        <b-icon icon="arrow-right-short" font-scale="2"></b-icon>
      </div>
    </swiper>
  </div>
</template>

<script>
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
      images: [],
      swiperImageOption: {
        direction: "horizontal",
        slidesPerView: 3,
        spaceBetween: 10,
        centeredSlides: true,
        loop: true,
        autoplay: {
          delay: 5000, //ms기준 500은 0.5초
        },
        pagination: {
          el: ".swiper-pagination", // 페이지 번호 요소 선택지
          clickable: true,
        },
        navigation: {
          prevEl: ".swiper-prev",
          nextEl: ".swiper-next",
        },
      },
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
    for (let i = 0; i < 8; i++) this.$set(this.images, i, `img/place/image${i + 1}.jpg`);
  },
};
</script>

<style scoped>
/* COMMON */
img {
  display: block;
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
.promotion {
  height: 693px;
  background-color: #fff;
  position: relative;
  transition: height 0.4s;
  overflow: hidden;
}
.promotion.hide {
  height: 0;
}
.promotion .swiper-container {
  width: calc(819px * 3 + 20px);
  height: 553px;
  position: absolute;
  top: 40px;
  left: 50%;
  margin-left: calc((819px * 3 + 20px) / -2);
}
.promotion .swiper-slide {
  opacity: 0.5;
  transition: opacity 1s;
  position: relative;
}
.promotion .swiper-slide-active {
  opacity: 1;
}
.promotion .swiper-slide .btn {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.promotion .swiper-pagination {
  bottom: 40px;
  left: 0;
  right: 0;
}
/* .promotion .swiper-pagination .swiper-pagination-bullet {
  background-color: transparent;
  background-image: url("/img/brand/aa.jpg");
  width: 12px;
  height: 12px;
  margin-right: 6px;
  outline: none;
}
.promotion .swiper-pagination .swiper-pagination-bullet:last-child {
  margin-right: 0;
}
.promotion .swiper-pagination .swiper-pagination-bullet-active {
  background-image: url("/img/brand/skyblue.jpg");
} */
.promotion .swiper-prev,
.promotion .swiper-next {
  width: 42px;
  height: 42px;
  border: 2px solid #333;
  border-radius: 50%;
  position: absolute;
  top: 300px;
  z-index: 1;
  cursor: pointer;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.4s;
}
.promotion .swiper-prev {
  left: 50%;
  margin-left: -480px;
}
.promotion .swiper-next {
  right: 50%;
  margin-right: -480px;
}
.promotion .swiper-prev:hover,
.promotion .swiper-next:hover {
  background-color: #333;
  color: #fff;
}
</style>
