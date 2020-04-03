<template>
  <div class="page-article" v-if="model">
    <div class="d-flex py-3 px-2 border-bottom">
      <div class="iconfont icon-back-line text-blue"></div>
      <strong class="flex-1 fs-lg text-blue pl-2">
        {{ model.title }}
      </strong>
      <div class="text-grey fs-xs">
        2020-4-1
      </div>
    </div>

    <div v-html="model.content" class="px-3 body fs-lg"></div>

    <div class="px-3 py-2 border-top">
      <div class="d-flex ai-center ">
        <i class="iconfont icon-tubiaozhizuomoban-"></i>
        <strong class="text-blue fs-lg ml-2">相关资讯</strong>
      </div>
    </div>
    <div class="pt-3">
      <router-link
        class="py-1"
        tag="div"
        v-for="item in model.related"
        :key="item._id"
        :to="`/articles/${item._id}`"
      >
        {{ item.title }}
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: { required: true }
  },

  data() {
    return {
      model: null
    };
  },

  watch: {
    id: "fetch"
  },

  methods: {
    async fetch() {
      const res = await this.$http.get(`articles/${this.id}`);
      this.model = res.data;
    }
  },

  created() {
    this.fetch();
  }
};
</script>

<style lang="scss">
.page-article {
  .body {
    img {
      max-width: 100%;
      height: auto;
    }

    iframe {
      width: 100%;
      height: auto;
    }
  }
}
</style>
