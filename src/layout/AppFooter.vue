<template>
  <footer class="footer has-cards">
    <div class="container">
      <div class="row row-grid align-items-center my-md">
        <div class="col-lg-6">
          <h3 class="text-primary font-weight-light mb-2">Thank you for inviting us!</h3>
          <h4 class="mb-0 font-weight-light">SWEET TRIP에서 좋은 여행을 만들기를 바랍니다.</h4>
        </div>
        <div class="col-lg-6 text-lg-center btn-wrapper"></div>
      </div>
      <hr />
      <div class="row align-items-center justify-content-md-between">
        <div class="col-md-6">
          <div class="copyright">
            &copy; 2023
            <a href="https://www.creative-tim.com" target="_blank" rel="noopener">JUNGEUN</a> &
            <a href="https://www.binarcode.com" target="_blank" rel="noopener">YUJIN</a>
          </div>
        </div>
        <div class="col-md-6">
          <ul class="nav nav-footer justify-content-end">
            <li class="nav-item">
              <a href="https://www.creative-tim.com" class="nav-link" target="_blank" rel="noopener">공공데이터</a>
            </li>
            <li class="nav-item">
              <a href="https://github.com/JYmsg" class="nav-link" target="_blank" rel="noopener">GIT</a>
            </li>
            <li class="nav-item">
              <a
                href="https://www.notion.so/Sweet-Trip-dce80e80ea0445c49ef93a67fece544d"
                class="nav-link"
                target="_blank"
                rel="noopener"
                >Notion</a
              >
            </li>
            <li class="nav-item">
              <a href="https://www.ssafy.com/ksp/jsp/swp/swpMain.jsp" class="nav-link" target="_blank" rel="noopener"
                >SSAFY</a
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  name: "app-footer",
  data() {
    return {
      year: new Date().getFullYear(),
    };
  },
};
</script>
<style></style>
