<template>
  <section class="notice">
    <div class="notice-line">
      <!-- <div class="bg-left"></div> -->
      <!-- <div class="bg-right"></div> -->
      <div class="inner">
        <div class="inner__left">
          <h2>공지사항</h2>
          <div class="swiper-container">
            <div class="swiper-slide">
              <router-link :to="{ name: 'NoticeList' }">공지사항입니다.</router-link>
            </div>
          </div>
        </div>

        <div class="inner__right">
          <h2>문의사항이 있나요?</h2>
          <router-link :to="{ name: 'NoticeList' }" class="qna">
            <b-icon icon="chat-dots" font-scale="2"></b-icon>
          </router-link>
        </div>
      </div>
    </div>

    <div class="hotpl">
      <b-carousel
        id="carousel-1"
        v-model="slide"
        :interval="4000"
        controls
        indicators
        background="#ababab"
        img-width="1024"
        img-height="480"
        style="text-shadow: 1px 1px 2px #333"
        @sliding-start="onSlideStart"
        @sliding-end="onSlideEnd"
      >
        <!-- Slides with custom text -->
        <b-carousel-slide img-src="https://picsum.photos/1024/480/?image=54">
          <h1>Hello world!</h1>
        </b-carousel-slide>
      </b-carousel>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      slide: 0,
      sliding: null,
    };
  },
  methods: {
    onSlideStart(slide) {
      this.sliding = true;
    },
    onSlideEnd(slide) {
      this.sliding = false;
    },
  },
};
</script>

<style scoped>
.notice .notice-line .inner {
  height: 62px;
  display: flex;
}
.notice .notice-line .inner__left {
  width: 60%;
  height: 100%;
  background-color: #78a9ed;
  display: flex;
  justify-content: center;
  align-items: center;
}
.notice .notice-line .inner__left h2 {
  font-size: 17px;
  font-weight: 700;
  margin-left: 3rem;
  color: white;
}
.notice .notice-line .inner__left .swiper-container {
  height: 62px;
  flex-grow: 1;
}
.notice .notice-line .inner__left .swiper-slide {
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 3rem;
}
.notice .notice-line .inner__right {
  width: 40%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.notice .notice-line .inner__right h2 {
  font-size: 17px;
  font-weight: 700;
}
</style>
