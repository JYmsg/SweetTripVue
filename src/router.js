import Vue from "vue";
import Router from "vue-router";
import AppHeader from "./layout/AppHeader";
import AppFooter from "./layout/AppFooter";
import Components from "./views/Components.vue";
import Information from "./views/share/Information.vue";
import Login from "./views/user/Login.vue";
import Register from "./views/user/Register.vue";
import Profile from "./views/user/Profile.vue";
import SearchPlace from "@/views/searchPlace/Search.vue";

import HotplView from "@/views/HotplView.vue";
import HotplList from "@/views/components/hotpl/HotplList.vue";
import HotplRegist from "@/views/components/hotpl/HotplRegist.vue";
import HotplDetail from "@/views/components/hotpl/HotplDetail.vue";
import HotplModify from "@/views/components/hotpl/HotplModify.vue";

Vue.use(Router);

export default new Router({
  linkExactActiveClass: "active",
  routes: [
    {
      path: "/",
      name: "home",
      components: {
        header: AppHeader,
        default: Components,
        footer: AppFooter,
      },
    },
    {
      path: "/information",
      name: "information",
      components: {
        header: AppHeader,
        default: Information,
        footer: AppFooter
      }
    },
    {
      path: "/search",
      name: "search",
      components: {
        header: AppHeader,
        default: SearchPlace,
        footer: AppFooter
      }
    },
    {
      path: "/login",
      name: "login",
      components: {
        header: AppHeader,
        default: Login,
        footer: AppFooter,
      },
    },
    {
      path: "/register",
      name: "register",
      components: {
        header: AppHeader,
        default: Register,
        footer: AppFooter,
      },
    },
    {
      path: "/profile",
      name: "profile",
      components: {
        header: AppHeader,
        default: Profile,
        footer: AppFooter,
      },
    },
    {
      path: "/hotplace",
      name: "HotplView",
      redirect: "/hotplace/list",
      components: {
        header: AppHeader,
        default: HotplView,
        footer: AppFooter,
      },
      children: [
        {
          path: "regist",
          name: "HotplRegist",
          components: {
            header: AppHeader,
            default: HotplRegist,
            footer: AppFooter,
          },
          props: true,
        },
        {
          path: "modify/:id",
          name: "HotplModify",
          components: {
            header: AppHeader,
            default: HotplModify,
            footer: AppFooter,
          },
        },
        {
          path: "list",
          name: "HotplList",
          components: {
            header: AppHeader,
            default: HotplList,
            footer: AppFooter,
          },
        },
        {
          path: ":id",
          name: "HotplDetail",
          components: {
            header: AppHeader,
            default: HotplDetail,
            footer: AppFooter,
          },
        },
      ],
    },
  ],
  scrollBehavior: (to) => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  },
});
