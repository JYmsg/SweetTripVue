<template>
  <div class="container">
    <header class="header-global">
      <base-nav class="navbar-main" transparent type="white" effect="light" expand>
        <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
          <img src="img/brand/air.png" alt="logo" />
        </router-link>

        <div class="row" slot="content-header" slot-scope="{ closeMenu }">
          <div class="col-6 collapse-brand">
            <a href="https://demos.creative-tim.com/vue-argon-design-system/documentation/" style="font-size: 22px;">
              <img src="img/brand/air.png" /> SWEET TRIP
            </a>
          </div>
          <div class="col-6 collapse-close">
            <close-button @click="closeMenu"></close-button>
          </div>
        </div>

        <ul class="navbar-nav navbar-nav-hover align-items-lg-center"></ul>
        <ul class="navbar-nav align-items-lg-center ml-lg-auto">
          <li class="nav-item">
            <router-link to="/notice/list" class="nav-link">
              <i class="ni ni-bulb-61 d-lg-none"></i>
              <span class="nav-link-inner--text" style="font-family: 'GangwonEdu_OTFBoldA'">공지사항(Q&A)</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/search" class="nav-link">
              <i class="ni ni-square-pin d-lg-none"></i>
              <span class="nav-link-inner--text" style="font-family: 'GangwonEdu_OTFBoldA'">여행위치검색</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{name : 'PlanList'}" class="nav-link">
              <i class="ni ni-calendar-grid-58 d-lg-none"></i>
              <span class="nav-link-inner--text" style="font-family: 'GangwonEdu_OTFBoldA'">일정구경하기</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'HotplMain' }" class="nav-link">
              <i class="ni ni-like-2 d-lg-none"></i>
              <span class="nav-link-inner--text" style="font-family: 'GangwonEdu_OTFBoldA'">핫플레이스</span>
            </router-link>
          </li>
          <base-dropdown tag="li" class="nav-item" v-if="getUser">
            <a slot="title" href="#" class="nav-link" data-toggle="dropdown" role="button">
              <i class="ni ni-circle-08"></i>
              <i class="ni ni-bold-down"></i>
            </a>
            <a href="#" class="dropdown-item user-nav" @click="logout" style="font-family: 'GangwonEdu_OTFBoldA'"
              >로그아웃</a
            >
            <router-link to="/profile" class="dropdown-item user-nav" style="font-family: 'GangwonEdu_OTFBoldA'"
              >마이페이지</router-link
            >
          </base-dropdown>
          <li class="nav-item" v-else>
            <router-link to="/login" class="nav-link">
              <i class="ni ni-circle-08 d-lg-none"></i>
              <span class="nav-link-inner--text" style="font-family: 'GangwonEdu_OTFBoldA'">로그인</span>
            </router-link>
          </li>
        </ul>
      </base-nav>
    </header>
  </div>
</template>
<script>
import BaseNav from "@/components/BaseNav";
import BaseDropdown from "@/components/BaseDropdown";
import CloseButton from "@/components/CloseButton";
import { mapMutations, mapState } from "vuex";

export default {
  components: {
    BaseNav,
    CloseButton,
    BaseDropdown,
  },
  methods: {
    ...mapMutations(["LOGOUT"]),
    logout() {
      this.LOGOUT();
    },
  },
  computed: {
    ...mapState(["loginUser"]),
    getUser() {
      console.log(this.loginUser);
      if (this.loginUser) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>
<style scoped>
.user-nav {
  min-width: 12rem;
}
</style>
