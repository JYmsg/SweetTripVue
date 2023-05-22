<template>
  <div class="container">
    <header class="header-global">
      <base-nav class="navbar-main" transparent type="white" effect="light" expand>
        <router-link slot="brand" class="navbar-brand mr-lg-5" to="/">
          <img src="img/brand/logo.png" alt="logo" />
        </router-link>

        <div class="row" slot="content-header" slot-scope="{ closeMenu }">
          <div class="col-6 collapse-brand">
            <a href="https://demos.creative-tim.com/vue-argon-design-system/documentation/">
              <img src="img/brand/logo.png" />
            </a>
          </div>
          <div class="col-6 collapse-close">
            <close-button @click="closeMenu"></close-button>
          </div>
        </div>

        <ul class="navbar-nav navbar-nav-hover align-items-lg-center"></ul>
        <ul class="navbar-nav align-items-lg-center ml-lg-auto">
          <!-- <base-dropdown class="nav-item" menu-classes="dropdown-menu-xl">
            <a slot="title" href="#" class="nav-link" data-toggle="dropdown" role="button">
                        <i class="ni ni-ui-04 d-lg-none"></i>
                        <span class="nav-link-inner--text">Components</span>
                    </a>
                    <div class="dropdown-menu-inner">
                        <a href="https://demos.creative-tim.com/vue-argon-design-system/documentation/"
                        class="media d-flex align-items-center">
                        <div class="icon icon-shape bg-gradient-primary rounded-circle text-white">
                            <i class="ni ni-spaceship"></i>
                        </div>
                        <div class="media-body ml-3">
                            <h6 class="heading text-primary mb-md-1">Getting started</h6>
                                <p class="description d-none d-md-inline-block mb-0">Get started with Bootstrap, the
                                    world's most popular framework for building responsive sites.</p>
                                </div>
                        </a>
                        <a href="https://demos.creative-tim.com/vue-argon-design-system/documentation/"
                        class="media d-flex align-items-center">
                        <div class="icon icon-shape bg-gradient-warning rounded-circle text-white">
                            <i class="ni ni-ui-04"></i>
                        </div>
                        <div class="media-body ml-3">
                            <h5 class="heading text-warning mb-md-1">Components</h5>
                            <p class="description d-none d-md-inline-block mb-0">Learn how to use Argon
                                compiling Scss, change brand colors and more.</p>
                            </div>
                        </a>
                    </div>
                </base-dropdown> -->
          <li class="nav-item">
            <router-link to="/notice/list" class="nav-link">
              <i class="ni ni-bullet-list-67 d-lg-none"></i>
              <span class="nav-link-inner--text" style="font-family: 'GangwonEdu_OTFBoldA'"
                >QnA</span
              >
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/search" class="nav-link">
              <!-- <a slot="title" href="#" class="nav-link" data-toggle="dropdown" role="button" @click="login = true"> -->
              <!-- <i class="ni ni-collection d-lg-none"></i> -->
              <i class="ni ni-square-pin d-lg-none"></i>
              <span class="nav-link-inner--text" style="font-family: 'GangwonEdu_OTFBoldA'"
                >여행위치 검색</span
              >
              <!-- </a> -->
            </router-link>
          </li>
          <!-- <li class="nav-item">
            <router-link to="/information" class="nav-link"> -->
          <!-- <a slot="title" href="#" class="nav-link" data-toggle="dropdown" role="button" @click="login = true"> -->
          <!-- <i class="ni ni-collection d-lg-none"></i> -->
          <!-- <i class="ni ni-tablet-button d-lg-none"></i>
              <span class="nav-link-inner--text">정보공유방</span> -->
          <!-- </a> -->
          <!-- </router-link>
          </li> -->
          <li class="nav-item">
            <router-link :to="{ name: 'HotplMain' }" class="nav-link">
              <i class="ni ni-like-2 d-lg-none"></i>
              <span class="nav-link-inner--text" style="font-family: 'GangwonEdu_OTFBoldA'"
                >HotPlace</span
              >
              <!-- </a> -->
            </router-link>
          </li>
          <base-dropdown tag="li" class="nav-item" v-if="getUser">
            <a slot="title" href="#" class="nav-link" data-toggle="dropdown" role="button">
              <i class="ni ni-circle-08"></i>
              <i class="ni ni-bold-down"></i>
              <!-- <span class="nav-link-inner--text">Components</span> -->
            </a>
            <a
              href="#"
              class="dropdown-item user-nav"
              @click="logout"
              style="font-family: 'GangwonEdu_OTFBoldA'"
              >Logout</a
            >
            <router-link
              to="/profile"
              class="dropdown-item user-nav"
              style="font-family: 'GangwonEdu_OTFBoldA'"
              >MyPage</router-link
            >
          </base-dropdown>
          <li class="nav-item" v-else>
            <router-link to="/login" class="nav-link">
              <!-- <a slot="title" href="#" class="nav-link" data-toggle="dropdown" role="button" @click="login = true"> -->
              <!-- <i class="ni ni-collection d-lg-none"></i> -->
              <i class="ni ni-circle-08 d-lg-none"></i>
              <span class="nav-link-inner--text" style="font-family: 'GangwonEdu_OTFBoldA'"
                >LOGIN</span
              >
              <!-- </a> -->
            </router-link>
          </li>
          <!-- <li class="nav-item">
                    <a class="nav-link nav-link-icon" href="https://www.facebook.com/creativetim" target="_blank" rel="noopener"
                    data-toggle="tooltip" title="Like us on Facebook">
                    <i class="fa fa-facebook-square"></i>
                    <span class="nav-link-inner--text d-lg-none">Facebook</span>
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link nav-link-icon" href="https://www.instagram.com/creativetimofficial"
                       target="_blank" rel="noopener" data-toggle="tooltip" title="Follow us on Instagram">
                        <i class="fa fa-instagram"></i>
                        <span class="nav-link-inner--text d-lg-none">Instagram</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link nav-link-icon" href="https://twitter.com/creativetim" target="_blank" rel="noopener"
                       data-toggle="tooltip" title="Follow us on Twitter">
                        <i class="fa fa-twitter-square"></i>
                        <span class="nav-link-inner--text d-lg-none">Twitter</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link nav-link-icon" href="https://github.com/creativetimofficial/vue-argon-design-system"
                       target="_blank" rel="noopener" data-toggle="tooltip" title="Star us on Github">
                        <i class="fa fa-github"></i>
                        <span class="nav-link-inner--text d-lg-none">Github</span>
                    </a>
                </li> -->
          <!-- <li class="nav-item d-none d-lg-block ml-lg-4">
                    <a href="https://www.creative-tim.com/product/vue-argon-design-system" target="_blank" rel="noopener"
                       class="btn btn-neutral btn-icon">
                <span class="btn-inner--icon">
                  <i class="fa fa-cloud-download mr-2"></i>
                </span>
                <span class="nav-link-inner--text">Download</span>
            </a>
        </li> -->
        </ul>

        <!-- <modals :login="login"></modals> -->
      </base-nav>
    </header>
    <!-- <modal :show.sync="login"
                   body-classes="p-0"
                   modal-classes="modal-dialog-centered modal-sm">
                <card type="secondary" shadow
                      header-classes="bg-white pb-5"
                      body-classes="px-lg-5 py-lg-5"
                      class="border-0">
                    <template>
                        <div class="text-muted text-center mb-3">
                            <small>Sign in with</small>
                        </div>
                        <div class="btn-wrapper text-center">
                            <base-button type="neutral">
                                <img slot="icon" src="img/icons/common/github.svg">
                                Github
                            </base-button>

                            <base-button type="neutral">
                                <img slot="icon" src="img/icons/common/google.svg">
                                Google
                            </base-button>
                        </div>
                    </template>
                    <template>
                        <div class="text-center text-muted mb-4">
                            <small>Or sign in with credentials</small>
                        </div>
                        <form role="form">
                            <base-input alternative
                                        class="mb-3"
                                        placeholder="Email"
                                        addon-left-icon="ni ni-email-83">
                            </base-input>
                            <base-input alternative
                                        type="password"
                                        placeholder="Password"
                                        addon-left-icon="ni ni-lock-circle-open">
                            </base-input>
                            <base-checkbox>
                                Remember me
                            </base-checkbox>
                            <div class="text-center">
                                <base-button type="primary" class="my-4">Sign In</base-button>
                            </div>
                        </form>
                    </template>
                </card>
            </modal> -->
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
