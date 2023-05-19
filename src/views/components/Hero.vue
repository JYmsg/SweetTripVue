<template>
  <section class="section-hero section-shaped my-0">
    <div class="shape shape-style-1 shape-main" />

    <!-- </div> -->
    <div class="container shape-container d-flex align-items-center">
      <div class="col px-0">
        <div class="row justify-content-center align-items-center">
          <div class="col-lg-7 text-center pt-lg">
            <!-- <img src="img/brand/white.png" style="width: 200px;" class="img-fluid"> -->
            <h1 class="text-white">SWEET TRIP</h1>
            <p class="lead text-white mt-4 mb-5">지금 바로 어디든 떠나보세요 ✈️ Sweet Trip이 여러분과 함께합니다</p>
            <!-- <div class="btn-wrapper">
                            <base-button tag="a"
                                         href="https://demos.creative-tim.com/vue-argon-design-system/documentation"
                                         class="mb-3 mb-sm-0"
                                         type="info"
                                         icon="fa fa-code">
                                Components
                            </base-button>
                            <base-button tag="a"
                                         href="https://www.creative-tim.com/product/vue-argon-design-system"
                                         class="mb-3 mb-sm-0"
                                         type="white"
                                         icon="ni ni-cloud-download-95">
                                Download Vue
                            </base-button>
                        </div> -->
          </div>
        </div>
        <div class="row align-items-center justify-content-around stars-and-coded">
          <div class="col-md-4 col-sm-4">
            <base-button block type="primary" class=" mb-3" @click="modals.modal1 = true">
                여행 계획을 세우러 가요!
            </base-button>
            <modal :show.sync="modals.modal1">
                <h6 slot="header" class="modal-title text-center" id="modal-title-default">여행 정보를 입력해주세요.</h6>
                <!-- DataPickers -->
                <div class="col-md-11 mt-4 mt-md-0">
                  <small class="d-block text-uppercase font-weight-bold mb-3">여행 제목</small>
                  <div class="row align-items-center">
                    <div class="col">
                      <base-input placeholder="Title" v-model="search"
                        addon-left-icon="ni ni-tag">
                      </base-input>
                    </div>
                  </div>
                </div>
                <date-pickers></date-pickers>
                <div class="col-md-11 mt-4 mt-md-0">
                  <small class="d-block text-uppercase font-weight-bold mb-3">초대 하기</small>
                  <base-input placeholder="Title" value="ssafy(evecomcom98@naver.com)"
                    addon-right-icon="ni ni-fat-remove" class="text-center" readonly>
                  </base-input>
                  <b-dropdown class="dropdown mt-4 mt-md-0" text="다른 유저의 아이디를 검색하세요">
                    <div class="m-3">
                      <b-input-group class="m-1">
                        <b-input placeholder="Title" v-model="title"
                          addon-left-icon="ni ni-tag">
                        </b-input>
                        <b-input-group-append>
                          <b-button @click="searchId"><i class="ni ni-check-bold"></i></b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </div>
                    <b-dropdown-divider></b-dropdown-divider>
                    <base-input placeholder="Title" value="ssafy(evecomcom98@naver.commymymy)"
                      addon-right-icon="ni ni-fat-add" class="text-center" readonly>
                    </base-input>
                    <!-- <b-dropdown-item-button>ssafy(evecomcom98@naver.com)</b-dropdown-item-button> -->
                  </b-dropdown>           
                </div>

                <!-- <div class="dropdown">
                  <button class="btn btn-primary btn-block" type="button" id="multiDropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Click here
                  <div class="ripple-container"></div></button>
                  <div class="dropdown-menu" aria-labelledby="multiDropdownMenu">
                    <a class="dropdown-item" href="#pablo">Action</a>
                    <a class="dropdown-item" href="#pablo">Another action</a>
                    <a class="dropdown-item dropdown-toggle" href="#pablo">Submenu</a>
                    <div class="dropdown-menu">
                      <a class="dropdown-item" href="#pablo">Submenu action</a>
                      <a class="dropdown-item" href="#pablo">Submenu action</a>
                      <a class="dropdown-item dropdown-toggle" href="#pablo">Subsubmenu</a>
                      <div class="dropdown-menu">
                        <a class="dropdown-item" href="#pablo">Subsubmenu action 1</a>
                        <a class="dropdown-item" href="#pablo">Subsubmenu action 2</a>
                      </div>
                      <a class="dropdown-item dropdown-toggle" href="#pablo">Second subsubmenu</a>
                      <div class="dropdown-menu">
                        <a class="dropdown-item" href="#pablo">Subsubmenu action 1</a>
                        <a class="dropdown-item" href="#pablo">Subsubmenu action 2</a>
                      </div>
                    </div>
                  </div>
                </div> -->

                <template slot="footer">
                    <base-button type="primary">Save changes</base-button>
                    <base-button type="link" class="ml-auto" @click="modals.modal1 = false">Close
                    </base-button>
                </template>
            </modal>
        </div>
          <div class="col-sm-4 mt-4 mt-sm-0 text-right">
            <span class="text-white alpha-7">Made by MSG 🧂</span>
            <!-- <a href="https://www.creative-tim.com" target="_blank" title="Creative Tim - Premium Bootstrap Themes and Templates">
                            <img src="img/brand/creativetim-white-slim.png" class="ml-3" style="height: 30px;">
                        </a> -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import Modal from "@/components/Modal.vue";
const DatePickers = () => import("./JavascriptComponents/DatePickers");
export default {
  components: {
    DatePickers,
    Modal,
    flatPicker,
  },
  data() {
    return {
      modals: {
        range: "2018-07-17 to 2018-07-19",
        modal1: false,
        modal2: false,
      },
      title: "",
      search: "검색하세요",
      users: [],
    };
  },
  methods: {
    searchId() {
      
    }
  },
};
</script>
<style></style>
