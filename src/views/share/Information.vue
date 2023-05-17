<template>
    <div>
        <section class="section-profile-cover section-shaped my-0">
            <div class="shape shape-login">
            </div>
        </section>
        <section class="section section-skew">
            <div class="container">
                <card shadow class="card-profile mt--300" no-body>
                    <div class="px-4">
                        <div class="row justify-content-center">
                            <h4>정보공유방입니다.</h4>
                        </div>
                        <div class="row justify-content-center">
                            <b-table striped hover :items="getData" :fields="fields"></b-table>
                        </div>
                    </div>
                </card>
            </div>
        </section>
    </div>
</template>
<script>
// import http from "@";
  export default {
    name: 'light-table',
    data() {
      return {
          fields: ["Title", "Id", "registerTime"],
          boards: [{
              "Title": "test1",
              "Id": "test1",
              "registerTime": "2023-02-06"
          },],
      };
    },
    computed: {
        getData() {
            return this.boards;
        }
    }
  }
</script>
<style>

</style>