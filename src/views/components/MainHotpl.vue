<template>
  <section class="notice">
    <div class="notice-line">
      <div class="bg-left"></div>
      <div class="bg-right"></div>
      <div class="inner">
        <div class="inner__left">
          <h2>공지사항</h2>
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <a href="javascript:void(0)">크리스마스 & 연말연시 스타벅스 매장 영업시간</a>
              </div>
              <div class="swiper-slide">
                <a href="javascript:void(0)">[당첨자 발표] 2022 스타벅스 멤버쉽</a>
              </div>
              <div class="swiper-slide">
                <a href="javascript:void(0)">스타벅스 코리아 애플리캐이션 업데이트 안내</a>
              </div>
              <div class="swiper-slide">
                <a href="javascript:void(0)">[당첨자 발표] 뉴이어 전자영수증</a>
              </div>
            </div>
          </div>
          <a href="javascript:void(0)" class="notice-line__more">
            <div class="material-icons">add_circle</div>
          </a>
        </div>

        <div class="inner__right">
          <h2>스타벅스 프로모션</h2>
          <div class="toggle-promotion">
            <div class="material-icons">upload</div>
          </div>
        </div>
      </div>
    </div>

    <div class="promotion">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <img src="img/place/image1.jpg" />
            <a href="javascript:void(0)" class="btn">자세히 보기</a>
          </div>
          <div class="swiper-slide">
            <img src="img/place/image2.jpg" />
            <a href="javascript:void(0)" class="btn">자세히 보기</a>
          </div>
          <div class="swiper-slide">
            <img src="img/place/image3.jpg" />
            <a href="javascript:void(0)" class="btn">자세히 보기</a>
          </div>
          <div class="swiper-slide">
            <img src="img/place/image4.jpg" />
            <a href="javascript:void(0)" class="btn">자세히 보기</a>
          </div>
          <div class="swiper-slide">
            <img src="img/place/image5.jpg" />
            <a href="javascript:void(0)" class="btn">자세히 보기</a>
          </div>
        </div>
      </div>
      <div class="swiper-pagination"></div>
      <div class="swiper-prev">
        <div class="material-icons">arrow_back</div>
      </div>
      <div class="swiper-next">
        <div class="material-icons">arrow_forward</div>
      </div>
    </div>
  </section>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";

// new Swiper(선택자, 옵션)
new Swiper(".notice-line .swiper-container", {
  direction: "vertical",
  autoplay: true,
  loop: true,
});
new Swiper(".promotion .swiper-container", {
  direction: "horizontal",
  slidesPerView: 3,
  spaceBetween: 10,
  centeredSlides: true,
  loop: true,
  autoplay: {
    delay: 5000, //ms기준 500은 0.5초
  },
  pagination: {
    el: ".promotion .swiper-pagination", // 페이지 번호 요소 선택지
    clickable: true,
  },
  navigation: {
    prevEl: ".promotion .swiper-prev",
    nextEl: ".promotion .swiper-next",
  },
});
new Swiper(".awards .swiper-contsainer", {
  autoplay: true,
  loop: true,
  spaceBetween: 30,
  slidesPerView: 5,
  navigation: {
    prevEl: ".awards .swiper-prev",
    nextEl: ".awards .swiper-next",
  },
});
export default {
  components: {
    Swiper,
    SwiperSlide,
  },
};
</script>

<style scoped>
/* COMMON */
img {
  display: block;
}
a {
  text-decoration: none;
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
.notice .notice-line {
  position: relative;
}
.notice .notice-line .bg-left {
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 100%;
  background-color: #333;
}
.notice .notice-line .bg-right {
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  background-color: #f6f5ef;
}
.notice .notice-line .inner {
  height: 62px;
  display: flex;
}
.notice .notice-line .inner__left {
  width: 60%;
  height: 100%;
  background-color: #333;
  display: flex;
  align-items: center;
}
.notice .notice-line .inner__left h2 {
  color: #fff;
  font-size: 17px;
  font-weight: 700;
  margin-right: 20px;
}
.notice .notice-line .inner__left .swiper-container {
  height: 62px;
  flex-grow: 1;
}
.notice .notice-line .inner__left .swiper-slide {
  height: 62px;
  display: flex;
  align-items: center;
}
.notice .notice-line .inner__left .swiper-slide a {
  color: #fff;
}
.notice .notice-line .inner__left .notice-line__more {
  width: 62px;
  height: 62px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.notice .notice-line .inner__left .notice-line__more .material-icons {
  color: #fff;
  font-size: 30px;
}
.notice .notice-line .inner__right {
  width: 40%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.notice .notice-line .inner__right h2 {
  font-size: 17px;
  font-weight: 700;
}
.notice .notice-line .inner__right .toggle-promotion {
  width: 62px;
  height: 62px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.notice .notice-line .inner__right .toggle-promotion .material-icons {
  font-size: 30px;
}
.notice .promotion {
  height: 693px;
  background-color: #f6f5ef;
  position: relative;
  transition: height 0.4s;
  overflow: hidden;
}
.notice .promotion.hide {
  height: 0;
}
.notice .promotion .swiper-container {
  width: calc(819px * 3 + 20px);
  height: 553px;
  position: absolute;
  top: 40px;
  left: 50%;
  margin-left: calc((819px * 3 + 20px) / -2);
}
.notice .promotion .swiper-slide {
  opacity: 0.5;
  transition: opacity 1s;
  position: relative;
}
.notice .promotion .swiper-slide-active {
  opacity: 1;
}
.notice .promotion .swiper-slide .btn {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.notice .promotion .swiper-pagination {
  bottom: 40px;
  left: 0;
  right: 0;
}
.notice .promotion .swiper-pagination .swiper-pagination-bullet {
  background-color: transparent;
  background-image: url("/img/brand/aa.jpg");
  width: 12px;
  height: 12px;
  margin-right: 6px;
  outline: none;
}
.notice .promotion .swiper-pagination .swiper-pagination-bullet:last-child {
  margin-right: 0;
}
.notice .promotion .swiper-pagination .swiper-pagination-bullet-active {
  background-image: url("/img/brand/skyblue/jpg");
}
.notice .promotion .swiper-prev,
.notice .promotion .swiper-next {
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
.notice .promotion .swiper-prev {
  left: 50%;
  margin-left: -480px;
}
.notice .promotion .swiper-next {
  right: 50%;
  margin-right: -480px;
}
.notice .promotion .swiper-prev:hover,
.notice .promotion .swiper-next:hover {
  background-color: #333;
  color: #fff;
}
</style>
