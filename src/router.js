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

import NoticeView from "@/views/NoticeView.vue";
import NoticeList from "@/views/notice/NoticeList.vue";
import NoticeWrite from "@/views/notice/NoticeWrite.vue";
import NoticeDetail from "@/views/notice/NoticeDetail.vue";
import NoticeModify from "@/views/notice/NoticeModify.vue";

import HotplView from "@/views/HotplView.vue";
import HotplMain from "@/views/hotpl/HotplMain.vue";
import HotplList from "@/views/hotpl/HotplList.vue";
import HotplRegist from "@/views/hotpl/HotplRegist.vue";
import HotplDetail from "@/views/hotpl/HotplDetail.vue";
import HotplModify from "@/views/hotpl/HotplModify.vue";

import PlanView from "@/views/PlanView.vue";
import PlanRegist from "@/views/plan/PlanRegist.vue";

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
        footer: AppFooter,
      },
    },
    {
      path: "/plan",
      name: "PlanView",
      components: {
        default: PlanView,
      },
      children: [
        {
          path: "regist/:id",
          name: "PlanRegist",
          components: {
            default: PlanRegist,
          },
        },
      ],
    },
    {
      path: "/notice",
      name: "NoticeView",
      components: {
        header: AppHeader,
        default: NoticeView,
        footer: AppFooter,
      },
      children: [
        {
          path: "list",
          name: "NoticeList",
          components: {
            header: AppHeader,
            default: NoticeList,
            footer: AppFooter,
          },
        },
        {
          path: "modify/:id",
          name: "NoticeModify",
          components: {
            header: AppHeader,
            default: NoticeModify,
            footer: AppFooter,
          },
        },
        {
          path: "write",
          name: "NoticeWrite",
          components: {
            header: AppHeader,
            default: NoticeWrite,
            footer: AppFooter,
          },
        },
        {
          path: "view/:id",
          name: "NoticeDetail",
          components: {
            header: AppHeader,
            default: NoticeDetail,
            footer: AppFooter,
          },
        },
      ],
    },
    {
      path: "/search",
      name: "search",
      components: {
        header: AppHeader,
        default: SearchPlace,
        footer: AppFooter,
      },
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
      components: {
        header: AppHeader,
        default: HotplView,
        footer: AppFooter,
      },
      children: [
        {
          path: "main",
          name: "HotplMain",
          components: {
            header: AppHeader,
            default: HotplMain,
            footer: AppFooter,
          },
        },
        {
          path: "regist",
          name: "HotplRegist",
          components: {
            header: AppHeader,
            default: HotplRegist,
            footer: AppFooter,
          },
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
          path: "list/:id",
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
