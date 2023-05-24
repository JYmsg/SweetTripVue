<template>
  <div class="promotion">
    <swiper class="swiper-container" :options="swiperOption">
      <swiper-slide class="slide"
        ><img :src="images[0]" />
        <div class="btn" @click="moveList(1)">서울</div></swiper-slide
      >
      <swiper-slide class="slide"
        ><img :src="images[1]" />
        <div class="btn" @click="moveList(2)">인천</div></swiper-slide
      >
      <swiper-slide class="slide"
        ><img :src="images[2]" />
        <div class="btn" @click="moveList(3)">대전</div></swiper-slide
      >
      <swiper-slide class="slide"
        ><img :src="images[3]" />
        <div class="btn" @click="moveList(4)">대구</div></swiper-slide
      >
      <swiper-slide class="slide"
        ><img :src="images[4]" />
        <div class="btn" @click="moveList(5)">광주</div></swiper-slide
      >
      <swiper-slide class="slide"
        ><img :src="images[5]" />
        <div class="btn" @click="moveList(6)">부산</div></swiper-slide
      >
      <swiper-slide class="slide"
        ><img :src="images[6]" />
        <div class="btn" @click="moveList(7)">울산</div></swiper-slide
      >
      <swiper-slide class="slide"
        ><img :src="images[7]" />
        <div class="btn" @click="moveList(8)">세종</div></swiper-slide
      >
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

<script lang="ts">
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
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 50,
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
  methods: {
    moveList(id) {
      this.$router.push({
        name: "HotplList",
        params: { id: id },
      });
    },
  },
  created() {
    for (let i = 0; i < 8; i++) this.$set(this.images, i, `/img/main/image${i + 1}.jpg`);
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
  width: 80px;
  padding: 10px;
  border: 2px solid #333;
  border-radius: 1rem;
  color: #333;
  background-color: rgba(255, 255, 255, 0.7);
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
  height: 500px;
  background-color: #fff;
  position: relative;
  /* transition: height 0.4s; */
  overflow: hidden;
}
.promotion.hide {
  height: 0;
}
.promotion .swiper-container {
  width: calc(640px * 3 + 50px);
  height: 500px;
  position: absolute;
  top: 40px;
  left: 50%;
  margin-left: calc((640px * 3 + 50px) / -2);
}
.promotion .swiper-slide {
  opacity: 0.5;
  /* transition: opacity 1s; */
  position: relative;
}
.promotion .swiper-slide-active {
  opacity: 1;
}
.promotion .slide .btn {
  /* background-color: white; */
  /* opacity: 0.5; */
  position: absolute;
  bottom: 8rem;
  left: 0;
  right: 0;
  margin: auto;
}
.promotion .swiper-pagination {
  bottom: 40px;
  left: 0;
  right: 0;
}
.promotion .swiper-pagination .swiper-pagination-bullet {
  background-color: transparent;
  background-image: url("../../../public/img/main/slide_pager.png");
  width: 12px;
  height: 12px;
  margin-right: 6px;
  outline: none;
}
.promotion .swiper-pagination .swiper-pagination-bullet:last-child {
  margin-right: 0;
}
.promotion .swiper-pagination .swiper-pagination-bullet-active {
  background-image: url("../../../public/img/main/slide_pager_on.png");
}
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
