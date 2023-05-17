<template>
  <div class="container" style="margin-top: 6rem">
    <section class="hotpl-header">
      <h2 style="margin-bottom: 2rem">🔥핫 플레이스🔥</h2>
      <div v-if="user != null">
        <router-link
          class="btn btn-outline-warning float-end d-inline"
          :to="{ name: 'HotplRegist', params: { id: user.id } }"
          :user="user"
          >핫 플레이스 등록하기</router-link
        >
      </div>
    </section>
    <hr />
    <div class="hotpl-list">
      <div v-if="hotpls.length">
        <div v-for="(hotpl, index) in hotpls" :key="index">
          <div class="card mb-3 text-start">
            <div class="row g-0">
              <div class="col-md-3">
                {{ hotpl.img }}
              </div>
              <div class="col-md-9">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <router-link class="card-title m-0 h5" :to="`${hotpl.id}`">{{ hotpl.title }}</router-link>
                    </div>
                    <div>
                      <i id="like" class="bi bi-heart fs-4"></i>
                      <br />
                      <span>좋아요 {{ hotpl.like }}</span
                      ><br />
                      <span>조회수 {{ hotpl.hit }}</span>
                    </div>
                  </div>
                  <p class="card-text">
                    <small class="text-muted">작성자: {{ hotpl.writer_id }}</small
                    ><br />
                    <small class="text-muted">{{ hotpl.write_time }}</small>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>등록된 게시물이 없습니다.</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HotplList",
  props: {
    hotpls: {
      type: Array,
    },
    user: null,
  },
};
</script>

<style></style>
