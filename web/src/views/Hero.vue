<template>
  <div class="page-hero" v-if="model">
    <div class="topbar bg-black py-2 px-3 d-flex ai-center">
      <img src="../assets/images/ls-logo.png" height="30" />
      <div class="px-2 flex-1">
        <span class="text-white">炉石传说</span>
        <span class="ml-2 text-white">攻略站</span>
      </div>
      <router-link to="/" tag="div" class="text-white fs-lg"
        >更多英雄 &gt;</router-link
      >
    </div>

    <div class="top" :style="{ 'background-image': `url(${model.banner})` }">
      <div class="info text-white p-3 d-flex flex-column h-100 jc-end">
        <div class="fs-sm">{{ model.title }}</div>
        <h2 class="my-1">{{ model.name }}</h2>
        <div class="fs-sm">
          {{ model.categories.map(v => v.name).join("/") }}
        </div>
        <div class="d-flex ai-center jc-between">
          <div class="scores d-flex ai-center pt-2" v-if="model.scores">
            <span>难度</span>
            <span class="badge bg-primary">{{ model.scores.difficult }}</span>
            <span>技能</span>
            <span class="badge bg-blue-1">{{ model.scores.skills }}</span>
            <span>攻击</span>
            <span class="badge bg-danger">{{ model.scores.attack }}</span>
            <span>生存</span>
            <span class="badge bg-dark-2">{{ model.scores.survive }}</span>
          </div>

          <div>
            <router-link to="/" tag="span" class="text-grey"
              >皮肤:2 &gt;</router-link
            >
          </div>
        </div>
      </div>
    </div>
    <!-- end of top -->

    <div class="body">
      <div class="bg-white px-3">
        <div class="nav d-flex jc-around pt-3 pb-2 border-bottom">
          <div class="nav-item active">
            <div class="nav-link">英雄初识</div>
          </div>
          <div class="nav-item">
            <div class="nav-link">进阶攻略</div>
          </div>
        </div>
      </div>

      <swiper>
        <swiper-slide>
          <div>
            <div class="p-3 bg-white border-bottom">
              <div class="d-flex">
                <router-link tag="button" class="btn flex-1 btn-lg" to="/">
                  <i class="iconfont icon-cc-menu-circle fs-md"></i>
                  英雄介绍视频
                </router-link>
                <router-link tag="button" class="btn flex-1 ml-2 btn-lg" to="/">
                  <i class="iconfont icon-cc-menu-circle"></i>
                  一图识英雄
                </router-link>
              </div>
              <div class="skills bg-white mt-4">
                <div class="d-flex jc-around">
                  <img
                    :src="item.icon"
                    v-for="(item, i) in model.skills"
                    :key="i"
                    class="icon"
                    :class="{ active: currentSkillIndex === i }"
                    @click="currentSkillIndex = i"
                  />
                </div>

                <div v-if="currentSkill">
                  <div class="d-flex pt-4 pb-3">
                    <h3 class="m-0 fs-lg">{{ currentSkill.name }}</h3>
                    <span class="text-grey-1 ml-4 fs-sm">
                      (冷却值:{{ currentSkill.cd }} 消耗:{{
                        currentSkill.mana
                      }})
                    </span>
                  </div>
                  <p>{{ currentSkill.description }}</p>
                  <div class="border-bottom"></div>
                  <p class="text-grey-1">小提示:{{ currentSkill.tips }}</p>
                </div>
              </div>
            </div>

            <m-card
              plain
              icon="cc-menu-circle"
              title="出装推荐"
              class="hero-items"
            >
              <div class="fs-xl">前期出装</div>
              <div class="d-flex jc-around text-center mt-3">
                <div v-for="item in model.items1" :key="item.name">
                  <img class="icon" :src="item.icon" />
                  <div class="fs-xs">{{ item.name }}</div>
                </div>
              </div>
              <div class="border-bottom mt-3"></div>
              <div class="fs-xl mt-3">后期出装</div>
              <div class="d-flex jc-around text-center mt-3">
                <div v-for="item in model.items2" :key="item.name">
                  <img class="icon" :src="item.icon" />
                  <div class="fs-xs">{{ item.name }}</div>
                </div>
              </div>
            </m-card>

            <m-card plain icon="cc-menu-circle" title="使用技巧">
              <p class="m-0">{{ model.usageTips }}</p>
            </m-card>

            <m-card plain icon="cc-menu-circle" title="对抗技巧">
              <p class="m-0">{{ model.battleTips }}</p>
            </m-card>

            <m-card plain icon="cc-menu-circle" title="团战思路">
              <p class="m-0">{{ model.teamTips }}</p>
            </m-card>

            <m-card plain icon="cc-menu-circle" title="英雄关系">
              <div class="fs-xl">最佳搭档</div>
              <div
                v-for="item in model.partners"
                :key="item.name"
                class="d-flex pt-4"
              >
                <img :src="item.hero.avatar" height="40" />
                <p class="flex-1 ml-3 m-0 fs-sm">
                  {{ item.description }}
                </p>
              </div>
            </m-card>
          </div>
        </swiper-slide>
        <swiper-slide></swiper-slide>
      </swiper>
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
      model: null,
      currentSkillIndex: 0
    };
  },

  computed: {
    currentSkill() {
      return this.model.skills[this.currentSkillIndex];
    }
  },

  methods: {
    async fetch() {
      const res = await this.$http.get(`heroes/${this.id}`);
      this.model = res.data;
    }
  },

  created() {
    this.fetch();
  }
};
</script>

<style lang="scss">
@import "../assets/scss/variables";

.page-hero {
  .top {
    height: 50vw;
    background: #fff no-repeat top center;
    background-size: 100% auto;
  }

  .info {
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
    .scores {
      .badge {
        margin: 0 0.25rem;
        display: inline-block;
        width: 1rem;
        height: 1rem;
        line-height: 0.9rem;
        text-align: center;
        border-radius: 50%;
        font-size: 0.6rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
    }
  }

  .skills {
    img.icon {
      width: 50px;
      height: 50px;
      border: 2px solid map-get($map: $colors, $key: "white");
      &.active {
        border-color: map-get($map: $colors, $key: "primary");
      }
    }
  }

  .hero-items {
    img.icon {
      width: auto;
      height: 40px;
    }
  }
}
</style>
