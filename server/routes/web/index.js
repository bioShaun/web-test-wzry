module.exports = app => {
  const router = require("express").Router();
  const mongoose = require("mongoose");
  const Article = mongoose.model("Article");
  const Category = mongoose.model("Category");
  const Hero = mongoose.model("Hero");

  // 导入新闻
  router.get("/news/init", async (req, res) => {
    const parent = await Category.findOne({
      name: "新闻分类"
    });
    const cats = await Category.find()
      .lean()
      .where({
        parent: parent
      });
    const newsTitles = [
      "迎接《炉石传说》全新职业——恶魔猎手",
      "《炉石传说》17.0版本更新——3月27日",
      "战棋组队冲分赛落幕 瓦莉拉成功夺冠",
      "战棋组队冲分赛第二日 啦啦啦第一晋级",
      "战棋组队冲分赛首日 毒奶色失误痛失第一",
      "乱斗模式——“再战麦卡佐德！”现已开放",
      "人气主播带你品鉴“外域的灰烬”新卡",
      "最后7小时 参加万人线上海选赛 在家拿黄金卡背",
      "酒馆战棋线上冲分挑战赛3月27日开启",
      "炉边闲谈——深入探究恶魔猎手",
      "《炉石传说》全新职业恶魔猎手卡牌预览",
      "炉边闲谈——圣契课程",
      "大师巡回赛洛杉矶站落幕 国手TNCAnswer勇创佳绩"
    ];
    const newsList = newsTitles.map(title => {
      const randomCats = cats.slice(0).sort((a, b) => Math.random() - 0.5);
      return {
        categories: randomCats.slice(0, 2),
        title: title
      };
    });

    await Article.deleteMany({});
    await Article.insertMany(newsList);
    res.send(newsList);
  });

  // 新闻列表
  router.get("/news/list", async (req, res) => {
    const parent = await Category.findOne({
      name: "新闻分类"
    });

    const cats = await Category.aggregate([
      { $match: { parent: parent._id } },
      {
        $lookup: {
          from: "articles",
          localField: "_id",
          foreignField: "categories",
          as: "newsList"
        }
      },
      {
        $addFields: {
          newsList: { $slice: ["$newsList", 5] }
        }
      }
    ]);

    const subCats = cats.map(v => v._id);

    cats.unshift({
      name: "热门",
      newsList: await Article.find()
        .where({
          categories: { $in: subCats }
        })
        .populate("categories")
        .limit(5)
        .lean()
    });

    cats.map(cat => {
      cat.newsList.map(news => {
        news.categoryName =
          cat.name === "热门" ? news.categories[0].name : cat.name;
        return cat;
      });
      return cat;
    });
    res.send(cats);
  });

  //导入英雄数据
  router.get("/heros/init", async (req, res) => {
    await Hero.deleteMany({});
    const rawData = [
      {
        name: "核心",
        heroes: [
          {
            name: "sven",
            avatar: "https://www.dota2.com.cn/images/heroes/sven_hphover.png"
          },
          {
            name: "tiny",
            avatar: "https://www.dota2.com.cn/images/heroes/tiny_hphover.png"
          },
          {
            name: "kunkka",
            avatar: "https://www.dota2.com.cn/images/heroes/kunkka_hphover.png"
          },
          {
            name: "dragon_knight",
            avatar:
              "https://www.dota2.com.cn/images/heroes/dragon_knight_hphover.png"
          },
          {
            name: "huskar",
            avatar: "https://www.dota2.com.cn/images/heroes/huskar_hphover.png"
          },
          {
            name: "alchemist",
            avatar:
              "https://www.dota2.com.cn/images/heroes/alchemist_hphover.png"
          },
          {
            name: "brewmaster",
            avatar:
              "https://www.dota2.com.cn/images/heroes/brewmaster_hphover.png"
          },
          {
            name: "bristleback",
            avatar:
              "https://www.dota2.com.cn/images/heroes/bristleback_hphover.png"
          },
          {
            name: "legion_commander",
            avatar:
              "https://www.dota2.com.cn/images/heroes/legion_commander_hphover.png"
          },
          {
            name: "mars",
            avatar: "https://www.dota2.com.cn/images/heroes/mars_hphover.png"
          },
          {
            name: "antimage",
            avatar:
              "https://www.dota2.com.cn/images/heroes/antimage_hphover.png"
          },
          {
            name: "drow_ranger",
            avatar:
              "https://www.dota2.com.cn/images/heroes/drow_ranger_hphover.png"
          },
          {
            name: "juggernaut",
            avatar:
              "https://www.dota2.com.cn/images/heroes/juggernaut_hphover.png"
          },
          {
            name: "mirana",
            avatar: "https://www.dota2.com.cn/images/heroes/mirana_hphover.png"
          },
          {
            name: "morphling",
            avatar:
              "https://www.dota2.com.cn/images/heroes/morphling_hphover.png"
          },
          {
            name: "phantom_lancer",
            avatar:
              "https://www.dota2.com.cn/images/heroes/phantom_lancer_hphover.png"
          },
          {
            name: "riki",
            avatar: "https://www.dota2.com.cn/images/heroes/riki_hphover.png"
          },
          {
            name: "sniper",
            avatar: "https://www.dota2.com.cn/images/heroes/sniper_hphover.png"
          },
          {
            name: "templar_assassin",
            avatar:
              "https://www.dota2.com.cn/images/heroes/templar_assassin_hphover.png"
          },
          {
            name: "luna",
            avatar: "https://www.dota2.com.cn/images/heroes/luna_hphover.png"
          },
          {
            name: "ursa",
            avatar: "https://www.dota2.com.cn/images/heroes/ursa_hphover.png"
          },
          {
            name: "gyrocopter",
            avatar:
              "https://www.dota2.com.cn/images/heroes/gyrocopter_hphover.png"
          },
          {
            name: "lone_druid",
            avatar:
              "https://www.dota2.com.cn/images/heroes/lone_druid_hphover.png"
          },
          {
            name: "naga_siren",
            avatar:
              "https://www.dota2.com.cn/images/heroes/naga_siren_hphover.png"
          },
          {
            name: "troll_warlord",
            avatar:
              "https://www.dota2.com.cn/images/heroes/troll_warlord_hphover.png"
          },
          {
            name: "ember_spirit",
            avatar:
              "https://www.dota2.com.cn/images/heroes/ember_spirit_hphover.png"
          },
          {
            name: "monkey_king",
            avatar:
              "https://www.dota2.com.cn/images/heroes/monkey_king_hphover.png"
          },
          {
            name: "pangolier",
            avatar:
              "https://www.dota2.com.cn/images/heroes/pangolier_hphover.png"
          },
          {
            name: "storm_spirit",
            avatar:
              "https://www.dota2.com.cn/images/heroes/storm_spirit_hphover.png"
          },
          {
            name: "windrunner",
            avatar:
              "https://www.dota2.com.cn/images/heroes/windrunner_hphover.png"
          },
          {
            name: "lina",
            avatar: "https://www.dota2.com.cn/images/heroes/lina_hphover.png"
          },
          {
            name: "tinker",
            avatar: "https://www.dota2.com.cn/images/heroes/tinker_hphover.png"
          },
          {
            name: "furion",
            avatar: "https://www.dota2.com.cn/images/heroes/furion_hphover.png"
          },
          {
            name: "silencer",
            avatar:
              "https://www.dota2.com.cn/images/heroes/silencer_hphover.png"
          },
          {
            name: "void_spirit",
            avatar:
              "https://www.dota2.com.cn/images/heroes/void_spirit_hphover.png"
          },
          {
            name: "slardar",
            avatar: "https://www.dota2.com.cn/images/heroes/slardar_hphover.png"
          },
          {
            name: "skeleton_king",
            avatar:
              "https://www.dota2.com.cn/images/heroes/wraith_king_hphover.png"
          },
          {
            name: "life_stealer",
            avatar:
              "https://www.dota2.com.cn/images/heroes/life_stealer_hphover.png"
          },
          {
            name: "night_stalker",
            avatar:
              "https://www.dota2.com.cn/images/heroes/night_stalker_hphover.png"
          },
          {
            name: "doom_bringer",
            avatar:
              "https://www.dota2.com.cn/images/heroes/doom_bringer_hphover.png"
          },
          {
            name: "spirit_breaker",
            avatar:
              "https://www.dota2.com.cn/images/heroes/spirit_breaker_hphover.png"
          },
          {
            name: "lycan",
            avatar: "https://www.dota2.com.cn/images/heroes/lycan_hphover.png"
          },
          {
            name: "chaos_knight",
            avatar:
              "https://www.dota2.com.cn/images/heroes/chaos_knight_hphover.png"
          },
          {
            name: "abaddon",
            avatar: "https://www.dota2.com.cn/images/heroes/abaddon_hphover.png"
          },
          {
            name: "bloodseeker",
            avatar:
              "https://www.dota2.com.cn/images/heroes/bloodseeker_hphover.png"
          },
          {
            name: "nevermore",
            avatar:
              "https://www.dota2.com.cn/images/heroes/nevermore_hphover.png"
          },
          {
            name: "razor",
            avatar: "https://www.dota2.com.cn/images/heroes/razor_hphover.png"
          },
          {
            name: "faceless_void",
            avatar:
              "https://www.dota2.com.cn/images/heroes/faceless_void_hphover.png"
          },
          {
            name: "phantom_assassin",
            avatar:
              "https://www.dota2.com.cn/images/heroes/phantom_assassin_hphover.png"
          },
          {
            name: "viper",
            avatar: "https://www.dota2.com.cn/images/heroes/viper_hphover.png"
          },
          {
            name: "clinkz",
            avatar: "https://www.dota2.com.cn/images/heroes/clinkz_hphover.png"
          },
          {
            name: "broodmother",
            avatar:
              "https://www.dota2.com.cn/images/heroes/broodmother_hphover.png"
          },
          {
            name: "weaver",
            avatar: "https://www.dota2.com.cn/images/heroes/weaver_hphover.png"
          },
          {
            name: "spectre",
            avatar: "https://www.dota2.com.cn/images/heroes/spectre_hphover.png"
          },
          {
            name: "meepo",
            avatar: "https://www.dota2.com.cn/images/heroes/meepo_hphover.png"
          },
          {
            name: "slark",
            avatar: "https://www.dota2.com.cn/images/heroes/slark_hphover.png"
          },
          {
            name: "medusa",
            avatar: "https://www.dota2.com.cn/images/heroes/medusa_hphover.png"
          },
          {
            name: "terrorblade",
            avatar:
              "https://www.dota2.com.cn/images/heroes/terrorblade_hphover.png"
          },
          {
            name: "arc_warden",
            avatar:
              "https://www.dota2.com.cn/images/heroes/arc_warden_hphover.png"
          },
          {
            name: "necrolyte",
            avatar:
              "https://www.dota2.com.cn/images/heroes/necrolyte_hphover.png"
          },
          {
            name: "queenofpain",
            avatar:
              "https://www.dota2.com.cn/images/heroes/queenofpain_hphover.png"
          },
          {
            name: "death_prophet",
            avatar:
              "https://www.dota2.com.cn/images/heroes/death_prophet_hphover.png"
          },
          {
            name: "leshrac",
            avatar: "https://www.dota2.com.cn/images/heroes/leshrac_hphover.png"
          },
          {
            name: "invoker",
            avatar: "https://www.dota2.com.cn/images/heroes/invoker_hphover.png"
          },
          {
            name: "obsidian_destroyer",
            avatar:
              "https://www.dota2.com.cn/images/heroes/obsidian_destroyer_hphover.png"
          }
        ]
      },
      {
        name: "控制",
        heroes: [
          {
            name: "earthshaker",
            avatar:
              "https://www.dota2.com.cn/images/heroes/earthshaker_hphover.png"
          },
          {
            name: "sven",
            avatar: "https://www.dota2.com.cn/images/heroes/sven_hphover.png"
          },
          {
            name: "tiny",
            avatar: "https://www.dota2.com.cn/images/heroes/tiny_hphover.png"
          },
          {
            name: "kunkka",
            avatar: "https://www.dota2.com.cn/images/heroes/kunkka_hphover.png"
          },
          {
            name: "beastmaster",
            avatar:
              "https://www.dota2.com.cn/images/heroes/beastmaster_hphover.png"
          },
          {
            name: "dragon_knight",
            avatar:
              "https://www.dota2.com.cn/images/heroes/dragon_knight_hphover.png"
          },
          {
            name: "rattletrap",
            avatar:
              "https://www.dota2.com.cn/images/heroes/rattletrap_hphover.png"
          },
          {
            name: "alchemist",
            avatar:
              "https://www.dota2.com.cn/images/heroes/alchemist_hphover.png"
          },
          {
            name: "brewmaster",
            avatar:
              "https://www.dota2.com.cn/images/heroes/brewmaster_hphover.png"
          },
          {
            name: "treant",
            avatar: "https://www.dota2.com.cn/images/heroes/treant_hphover.png"
          },
          {
            name: "centaur",
            avatar: "https://www.dota2.com.cn/images/heroes/centaur_hphover.png"
          },
          {
            name: "tusk",
            avatar: "https://www.dota2.com.cn/images/heroes/tusk_hphover.png"
          },
          {
            name: "elder_titan",
            avatar:
              "https://www.dota2.com.cn/images/heroes/elder_titan_hphover.png"
          },
          {
            name: "legion_commander",
            avatar:
              "https://www.dota2.com.cn/images/heroes/legion_commander_hphover.png"
          },
          {
            name: "earth_spirit",
            avatar:
              "https://www.dota2.com.cn/images/heroes/earth_spirit_hphover.png"
          },
          {
            name: "phoenix",
            avatar: "https://www.dota2.com.cn/images/heroes/phoenix_hphover.png"
          },
          {
            name: "mars",
            avatar: "https://www.dota2.com.cn/images/heroes/mars_hphover.png"
          },
          {
            name: "snapfire",
            avatar:
              "https://www.dota2.com.cn/images/heroes/snapfire_hphover.png"
          },
          {
            name: "drow_ranger",
            avatar:
              "https://www.dota2.com.cn/images/heroes/drow_ranger_hphover.png"
          },
          {
            name: "mirana",
            avatar: "https://www.dota2.com.cn/images/heroes/mirana_hphover.png"
          },
          {
            name: "morphling",
            avatar:
              "https://www.dota2.com.cn/images/heroes/morphling_hphover.png"
          },
          {
            name: "vengefulspirit",
            avatar:
              "https://www.dota2.com.cn/images/heroes/vengefulspirit_hphover.png"
          },
          {
            name: "riki",
            avatar: "https://www.dota2.com.cn/images/heroes/riki_hphover.png"
          },
          {
            name: "ursa",
            avatar: "https://www.dota2.com.cn/images/heroes/ursa_hphover.png"
          },
          {
            name: "gyrocopter",
            avatar:
              "https://www.dota2.com.cn/images/heroes/gyrocopter_hphover.png"
          },
          {
            name: "naga_siren",
            avatar:
              "https://www.dota2.com.cn/images/heroes/naga_siren_hphover.png"
          },
          {
            name: "troll_warlord",
            avatar:
              "https://www.dota2.com.cn/images/heroes/troll_warlord_hphover.png"
          },
          {
            name: "ember_spirit",
            avatar:
              "https://www.dota2.com.cn/images/heroes/ember_spirit_hphover.png"
          },
          {
            name: "monkey_king",
            avatar:
              "https://www.dota2.com.cn/images/heroes/monkey_king_hphover.png"
          },
          {
            name: "pangolier",
            avatar:
              "https://www.dota2.com.cn/images/heroes/pangolier_hphover.png"
          },
          {
            name: "crystal_maiden",
            avatar:
              "https://www.dota2.com.cn/images/heroes/crystal_maiden_hphover.png"
          },
          {
            name: "puck",
            avatar: "https://www.dota2.com.cn/images/heroes/puck_hphover.png"
          },
          {
            name: "storm_spirit",
            avatar:
              "https://www.dota2.com.cn/images/heroes/storm_spirit_hphover.png"
          },
          {
            name: "windrunner",
            avatar:
              "https://www.dota2.com.cn/images/heroes/windrunner_hphover.png"
          },
          {
            name: "lina",
            avatar: "https://www.dota2.com.cn/images/heroes/lina_hphover.png"
          },
          {
            name: "shadow_shaman",
            avatar:
              "https://www.dota2.com.cn/images/heroes/shadow_shaman_hphover.png"
          },
          {
            name: "enchantress",
            avatar:
              "https://www.dota2.com.cn/images/heroes/enchantress_hphover.png"
          },
          {
            name: "jakiro",
            avatar: "https://www.dota2.com.cn/images/heroes/jakiro_hphover.png"
          },
          {
            name: "silencer",
            avatar:
              "https://www.dota2.com.cn/images/heroes/silencer_hphover.png"
          },
          {
            name: "ogre_magi",
            avatar:
              "https://www.dota2.com.cn/images/heroes/ogre_magi_hphover.png"
          },
          {
            name: "rubick",
            avatar: "https://www.dota2.com.cn/images/heroes/rubick_hphover.png"
          },
          {
            name: "disruptor",
            avatar:
              "https://www.dota2.com.cn/images/heroes/disruptor_hphover.png"
          },
          {
            name: "keeper_of_the_light",
            avatar:
              "https://www.dota2.com.cn/images/heroes/keeper_of_the_light_hphover.png"
          },
          {
            name: "skywrath_mage",
            avatar:
              "https://www.dota2.com.cn/images/heroes/skywrath_mage_hphover.png"
          },
          {
            name: "oracle",
            avatar: "https://www.dota2.com.cn/images/heroes/oracle_hphover.png"
          },
          {
            name: "techies",
            avatar: "https://www.dota2.com.cn/images/heroes/techies_hphover.png"
          },
          {
            name: "dark_willow",
            avatar:
              "https://www.dota2.com.cn/images/heroes/dark_willow_hphover.png"
          },
          {
            name: "void_spirit",
            avatar:
              "https://www.dota2.com.cn/images/heroes/void_spirit_hphover.png"
          },
          {
            name: "axe",
            avatar: "https://www.dota2.com.cn/images/heroes/axe_hphover.png"
          },
          {
            name: "pudge",
            avatar: "https://www.dota2.com.cn/images/heroes/pudge_hphover.png"
          },
          {
            name: "sand_king",
            avatar:
              "https://www.dota2.com.cn/images/heroes/sand_king_hphover.png"
          },
          {
            name: "slardar",
            avatar: "https://www.dota2.com.cn/images/heroes/slardar_hphover.png"
          },
          {
            name: "tidehunter",
            avatar:
              "https://www.dota2.com.cn/images/heroes/tidehunter_hphover.png"
          },
          {
            name: "skeleton_king",
            avatar:
              "https://www.dota2.com.cn/images/heroes/wraith_king_hphover.png"
          },
          {
            name: "life_stealer",
            avatar:
              "https://www.dota2.com.cn/images/heroes/life_stealer_hphover.png"
          },
          {
            name: "night_stalker",
            avatar:
              "https://www.dota2.com.cn/images/heroes/night_stalker_hphover.png"
          },
          {
            name: "doom_bringer",
            avatar:
              "https://www.dota2.com.cn/images/heroes/doom_bringer_hphover.png"
          },
          {
            name: "spirit_breaker",
            avatar:
              "https://www.dota2.com.cn/images/heroes/spirit_breaker_hphover.png"
          },
          {
            name: "chaos_knight",
            avatar:
              "https://www.dota2.com.cn/images/heroes/chaos_knight_hphover.png"
          },
          {
            name: "undying",
            avatar: "https://www.dota2.com.cn/images/heroes/undying_hphover.png"
          },
          {
            name: "magnataur",
            avatar:
              "https://www.dota2.com.cn/images/heroes/magnataur_hphover.png"
          },
          {
            name: "abyssal_underlord",
            avatar:
              "https://www.dota2.com.cn/images/heroes/abyssal_underlord_hphover.png"
          },
          {
            name: "bloodseeker",
            avatar:
              "https://www.dota2.com.cn/images/heroes/bloodseeker_hphover.png"
          },
          {
            name: "venomancer",
            avatar:
              "https://www.dota2.com.cn/images/heroes/venomancer_hphover.png"
          },
          {
            name: "faceless_void",
            avatar:
              "https://www.dota2.com.cn/images/heroes/faceless_void_hphover.png"
          },
          {
            name: "viper",
            avatar: "https://www.dota2.com.cn/images/heroes/viper_hphover.png"
          },
          {
            name: "meepo",
            avatar: "https://www.dota2.com.cn/images/heroes/meepo_hphover.png"
          },
          {
            name: "nyx_assassin",
            avatar:
              "https://www.dota2.com.cn/images/heroes/nyx_assassin_hphover.png"
          },
          {
            name: "slark",
            avatar: "https://www.dota2.com.cn/images/heroes/slark_hphover.png"
          },
          {
            name: "medusa",
            avatar: "https://www.dota2.com.cn/images/heroes/medusa_hphover.png"
          },
          {
            name: "bane",
            avatar: "https://www.dota2.com.cn/images/heroes/bane_hphover.png"
          },
          {
            name: "lion",
            avatar: "https://www.dota2.com.cn/images/heroes/lion_hphover.png"
          },
          {
            name: "witch_doctor",
            avatar:
              "https://www.dota2.com.cn/images/heroes/witch_doctor_hphover.png"
          },
          {
            name: "enigma",
            avatar: "https://www.dota2.com.cn/images/heroes/enigma_hphover.png"
          },
          {
            name: "necrolyte",
            avatar:
              "https://www.dota2.com.cn/images/heroes/necrolyte_hphover.png"
          },
          {
            name: "warlock",
            avatar: "https://www.dota2.com.cn/images/heroes/warlock_hphover.png"
          },
          {
            name: "death_prophet",
            avatar:
              "https://www.dota2.com.cn/images/heroes/death_prophet_hphover.png"
          },
          {
            name: "dazzle",
            avatar: "https://www.dota2.com.cn/images/heroes/dazzle_hphover.png"
          },
          {
            name: "leshrac",
            avatar: "https://www.dota2.com.cn/images/heroes/leshrac_hphover.png"
          },
          {
            name: "dark_seer",
            avatar:
              "https://www.dota2.com.cn/images/heroes/dark_seer_hphover.png"
          },
          {
            name: "batrider",
            avatar:
              "https://www.dota2.com.cn/images/heroes/batrider_hphover.png"
          },
          {
            name: "ancient_apparition",
            avatar:
              "https://www.dota2.com.cn/images/heroes/ancient_apparition_hphover.png"
          },
          {
            name: "invoker",
            avatar: "https://www.dota2.com.cn/images/heroes/invoker_hphover.png"
          },
          {
            name: "obsidian_destroyer",
            avatar:
              "https://www.dota2.com.cn/images/heroes/obsidian_destroyer_hphover.png"
          },
          {
            name: "shadow_demon",
            avatar:
              "https://www.dota2.com.cn/images/heroes/shadow_demon_hphover.png"
          },
          {
            name: "visage",
            avatar: "https://www.dota2.com.cn/images/heroes/visage_hphover.png"
          },
          {
            name: "winter_wyvern",
            avatar:
              "https://www.dota2.com.cn/images/heroes/winter_wyvern_hphover.png"
          },
          {
            name: "grimstroke",
            avatar:
              "https://www.dota2.com.cn/images/heroes/grimstroke_hphover.png"
          }
        ]
      },
      {
        name: "先手",
        heroes: [
          {
            name: "earthshaker",
            avatar:
              "https://www.dota2.com.cn/images/heroes/earthshaker_hphover.png"
          },
          {
            name: "sven",
            avatar: "https://www.dota2.com.cn/images/heroes/sven_hphover.png"
          },
          {
            name: "tiny",
            avatar: "https://www.dota2.com.cn/images/heroes/tiny_hphover.png"
          },
          {
            name: "kunkka",
            avatar: "https://www.dota2.com.cn/images/heroes/kunkka_hphover.png"
          },
          {
            name: "beastmaster",
            avatar:
              "https://www.dota2.com.cn/images/heroes/beastmaster_hphover.png"
          },
          {
            name: "dragon_knight",
            avatar:
              "https://www.dota2.com.cn/images/heroes/dragon_knight_hphover.png"
          },
          {
            name: "rattletrap",
            avatar:
              "https://www.dota2.com.cn/images/heroes/rattletrap_hphover.png"
          },
          {
            name: "huskar",
            avatar: "https://www.dota2.com.cn/images/heroes/huskar_hphover.png"
          },
          {
            name: "alchemist",
            avatar:
              "https://www.dota2.com.cn/images/heroes/alchemist_hphover.png"
          },
          {
            name: "brewmaster",
            avatar:
              "https://www.dota2.com.cn/images/heroes/brewmaster_hphover.png"
          },
          {
            name: "treant",
            avatar: "https://www.dota2.com.cn/images/heroes/treant_hphover.png"
          },
          {
            name: "centaur",
            avatar: "https://www.dota2.com.cn/images/heroes/centaur_hphover.png"
          },
          {
            name: "bristleback",
            avatar:
              "https://www.dota2.com.cn/images/heroes/bristleback_hphover.png"
          },
          {
            name: "tusk",
            avatar: "https://www.dota2.com.cn/images/heroes/tusk_hphover.png"
          },
          {
            name: "elder_titan",
            avatar:
              "https://www.dota2.com.cn/images/heroes/elder_titan_hphover.png"
          },
          {
            name: "legion_commander",
            avatar:
              "https://www.dota2.com.cn/images/heroes/legion_commander_hphover.png"
          },
          {
            name: "earth_spirit",
            avatar:
              "https://www.dota2.com.cn/images/heroes/earth_spirit_hphover.png"
          },
          {
            name: "phoenix",
            avatar: "https://www.dota2.com.cn/images/heroes/phoenix_hphover.png"
          },
          {
            name: "mars",
            avatar: "https://www.dota2.com.cn/images/heroes/mars_hphover.png"
          },
          {
            name: "vengefulspirit",
            avatar:
              "https://www.dota2.com.cn/images/heroes/vengefulspirit_hphover.png"
          },
          {
            name: "naga_siren",
            avatar:
              "https://www.dota2.com.cn/images/heroes/naga_siren_hphover.png"
          },
          {
            name: "ember_spirit",
            avatar:
              "https://www.dota2.com.cn/images/heroes/ember_spirit_hphover.png"
          },
          {
            name: "monkey_king",
            avatar:
              "https://www.dota2.com.cn/images/heroes/monkey_king_hphover.png"
          },
          {
            name: "pangolier",
            avatar:
              "https://www.dota2.com.cn/images/heroes/pangolier_hphover.png"
          },
          {
            name: "puck",
            avatar: "https://www.dota2.com.cn/images/heroes/puck_hphover.png"
          },
          {
            name: "storm_spirit",
            avatar:
              "https://www.dota2.com.cn/images/heroes/storm_spirit_hphover.png"
          },
          {
            name: "shadow_shaman",
            avatar:
              "https://www.dota2.com.cn/images/heroes/shadow_shaman_hphover.png"
          },
          {
            name: "silencer",
            avatar:
              "https://www.dota2.com.cn/images/heroes/silencer_hphover.png"
          },
          {
            name: "ogre_magi",
            avatar:
              "https://www.dota2.com.cn/images/heroes/ogre_magi_hphover.png"
          },
          {
            name: "disruptor",
            avatar:
              "https://www.dota2.com.cn/images/heroes/disruptor_hphover.png"
          },
          {
            name: "axe",
            avatar: "https://www.dota2.com.cn/images/heroes/axe_hphover.png"
          },
          {
            name: "pudge",
            avatar: "https://www.dota2.com.cn/images/heroes/pudge_hphover.png"
          },
          {
            name: "sand_king",
            avatar:
              "https://www.dota2.com.cn/images/heroes/sand_king_hphover.png"
          },
          {
            name: "slardar",
            avatar: "https://www.dota2.com.cn/images/heroes/slardar_hphover.png"
          },
          {
            name: "tidehunter",
            avatar:
              "https://www.dota2.com.cn/images/heroes/tidehunter_hphover.png"
          },
          {
            name: "skeleton_king",
            avatar:
              "https://www.dota2.com.cn/images/heroes/wraith_king_hphover.png"
          },
          {
            name: "night_stalker",
            avatar:
              "https://www.dota2.com.cn/images/heroes/night_stalker_hphover.png"
          },
          {
            name: "doom_bringer",
            avatar:
              "https://www.dota2.com.cn/images/heroes/doom_bringer_hphover.png"
          },
          {
            name: "spirit_breaker",
            avatar:
              "https://www.dota2.com.cn/images/heroes/spirit_breaker_hphover.png"
          },
          {
            name: "chaos_knight",
            avatar:
              "https://www.dota2.com.cn/images/heroes/chaos_knight_hphover.png"
          },
          {
            name: "magnataur",
            avatar:
              "https://www.dota2.com.cn/images/heroes/magnataur_hphover.png"
          },
          {
            name: "bloodseeker",
            avatar:
              "https://www.dota2.com.cn/images/heroes/bloodseeker_hphover.png"
          },
          {
            name: "venomancer",
            avatar:
              "https://www.dota2.com.cn/images/heroes/venomancer_hphover.png"
          },
          {
            name: "faceless_void",
            avatar:
              "https://www.dota2.com.cn/images/heroes/faceless_void_hphover.png"
          },
          {
            name: "viper",
            avatar: "https://www.dota2.com.cn/images/heroes/viper_hphover.png"
          },
          {
            name: "meepo",
            avatar: "https://www.dota2.com.cn/images/heroes/meepo_hphover.png"
          },
          {
            name: "nyx_assassin",
            avatar:
              "https://www.dota2.com.cn/images/heroes/nyx_assassin_hphover.png"
          },
          {
            name: "lion",
            avatar: "https://www.dota2.com.cn/images/heroes/lion_hphover.png"
          },
          {
            name: "enigma",
            avatar: "https://www.dota2.com.cn/images/heroes/enigma_hphover.png"
          },
          {
            name: "warlock",
            avatar: "https://www.dota2.com.cn/images/heroes/warlock_hphover.png"
          },
          {
            name: "dark_seer",
            avatar:
              "https://www.dota2.com.cn/images/heroes/dark_seer_hphover.png"
          },
          {
            name: "batrider",
            avatar:
              "https://www.dota2.com.cn/images/heroes/batrider_hphover.png"
          },
          {
            name: "shadow_demon",
            avatar:
              "https://www.dota2.com.cn/images/heroes/shadow_demon_hphover.png"
          }
        ]
      },
      {
        name: "打野",
        heroes: [
          {
            name: "ursa",
            avatar: "https://www.dota2.com.cn/images/heroes/ursa_hphover.png"
          },
          {
            name: "lone_druid",
            avatar:
              "https://www.dota2.com.cn/images/heroes/lone_druid_hphover.png"
          },
          {
            name: "crystal_maiden",
            avatar:
              "https://www.dota2.com.cn/images/heroes/crystal_maiden_hphover.png"
          },
          {
            name: "furion",
            avatar: "https://www.dota2.com.cn/images/heroes/furion_hphover.png"
          },
          {
            name: "enchantress",
            avatar:
              "https://www.dota2.com.cn/images/heroes/enchantress_hphover.png"
          },
          {
            name: "chen",
            avatar: "https://www.dota2.com.cn/images/heroes/chen_hphover.png"
          },
          {
            name: "keeper_of_the_light",
            avatar:
              "https://www.dota2.com.cn/images/heroes/keeper_of_the_light_hphover.png"
          },
          {
            name: "axe",
            avatar: "https://www.dota2.com.cn/images/heroes/axe_hphover.png"
          },
          {
            name: "sand_king",
            avatar:
              "https://www.dota2.com.cn/images/heroes/sand_king_hphover.png"
          },
          {
            name: "life_stealer",
            avatar:
              "https://www.dota2.com.cn/images/heroes/life_stealer_hphover.png"
          },
          {
            name: "lycan",
            avatar: "https://www.dota2.com.cn/images/heroes/lycan_hphover.png"
          },
          {
            name: "bloodseeker",
            avatar:
              "https://www.dota2.com.cn/images/heroes/bloodseeker_hphover.png"
          },
          {
            name: "enigma",
            avatar: "https://www.dota2.com.cn/images/heroes/enigma_hphover.png"
          },
          {
            name: "dark_seer",
            avatar:
              "https://www.dota2.com.cn/images/heroes/dark_seer_hphover.png"
          },
          {
            name: "batrider",
            avatar:
              "https://www.dota2.com.cn/images/heroes/batrider_hphover.png"
          }
        ]
      },
      {
        name: "辅助",
        heroes: [
          {
            name: "earthshaker",
            avatar:
              "https://www.dota2.com.cn/images/heroes/earthshaker_hphover.png"
          },
          {
            name: "kunkka",
            avatar: "https://www.dota2.com.cn/images/heroes/kunkka_hphover.png"
          },
          {
            name: "omniknight",
            avatar:
              "https://www.dota2.com.cn/images/heroes/omniknight_hphover.png"
          },
          {
            name: "alchemist",
            avatar:
              "https://www.dota2.com.cn/images/heroes/alchemist_hphover.png"
          },
          {
            name: "treant",
            avatar: "https://www.dota2.com.cn/images/heroes/treant_hphover.png"
          },
          {
            name: "wisp",
            avatar: "https://www.dota2.com.cn/images/heroes/wisp_hphover.png"
          },
          {
            name: "phoenix",
            avatar: "https://www.dota2.com.cn/images/heroes/phoenix_hphover.png"
          },
          {
            name: "snapfire",
            avatar:
              "https://www.dota2.com.cn/images/heroes/snapfire_hphover.png"
          },
          {
            name: "mirana",
            avatar: "https://www.dota2.com.cn/images/heroes/mirana_hphover.png"
          },
          {
            name: "vengefulspirit",
            avatar:
              "https://www.dota2.com.cn/images/heroes/vengefulspirit_hphover.png"
          },
          {
            name: "naga_siren",
            avatar:
              "https://www.dota2.com.cn/images/heroes/naga_siren_hphover.png"
          },
          {
            name: "crystal_maiden",
            avatar:
              "https://www.dota2.com.cn/images/heroes/crystal_maiden_hphover.png"
          },
          {
            name: "windrunner",
            avatar:
              "https://www.dota2.com.cn/images/heroes/windrunner_hphover.png"
          },
          {
            name: "lina",
            avatar: "https://www.dota2.com.cn/images/heroes/lina_hphover.png"
          },
          {
            name: "shadow_shaman",
            avatar:
              "https://www.dota2.com.cn/images/heroes/shadow_shaman_hphover.png"
          },
          {
            name: "enchantress",
            avatar:
              "https://www.dota2.com.cn/images/heroes/enchantress_hphover.png"
          },
          {
            name: "jakiro",
            avatar: "https://www.dota2.com.cn/images/heroes/jakiro_hphover.png"
          },
          {
            name: "chen",
            avatar: "https://www.dota2.com.cn/images/heroes/chen_hphover.png"
          },
          {
            name: "silencer",
            avatar:
              "https://www.dota2.com.cn/images/heroes/silencer_hphover.png"
          },
          {
            name: "ogre_magi",
            avatar:
              "https://www.dota2.com.cn/images/heroes/ogre_magi_hphover.png"
          },
          {
            name: "rubick",
            avatar: "https://www.dota2.com.cn/images/heroes/rubick_hphover.png"
          },
          {
            name: "disruptor",
            avatar:
              "https://www.dota2.com.cn/images/heroes/disruptor_hphover.png"
          },
          {
            name: "keeper_of_the_light",
            avatar:
              "https://www.dota2.com.cn/images/heroes/keeper_of_the_light_hphover.png"
          },
          {
            name: "skywrath_mage",
            avatar:
              "https://www.dota2.com.cn/images/heroes/skywrath_mage_hphover.png"
          },
          {
            name: "oracle",
            avatar: "https://www.dota2.com.cn/images/heroes/oracle_hphover.png"
          },
          {
            name: "dark_willow",
            avatar:
              "https://www.dota2.com.cn/images/heroes/dark_willow_hphover.png"
          },
          {
            name: "sand_king",
            avatar:
              "https://www.dota2.com.cn/images/heroes/sand_king_hphover.png"
          },
          {
            name: "skeleton_king",
            avatar:
              "https://www.dota2.com.cn/images/heroes/wraith_king_hphover.png"
          },
          {
            name: "undying",
            avatar: "https://www.dota2.com.cn/images/heroes/undying_hphover.png"
          },
          {
            name: "abaddon",
            avatar: "https://www.dota2.com.cn/images/heroes/abaddon_hphover.png"
          },
          {
            name: "abyssal_underlord",
            avatar:
              "https://www.dota2.com.cn/images/heroes/abyssal_underlord_hphover.png"
          },
          {
            name: "venomancer",
            avatar:
              "https://www.dota2.com.cn/images/heroes/venomancer_hphover.png"
          },
          {
            name: "bane",
            avatar: "https://www.dota2.com.cn/images/heroes/bane_hphover.png"
          },
          {
            name: "lich",
            avatar: "https://www.dota2.com.cn/images/heroes/lich_hphover.png"
          },
          {
            name: "lion",
            avatar: "https://www.dota2.com.cn/images/heroes/lion_hphover.png"
          },
          {
            name: "witch_doctor",
            avatar:
              "https://www.dota2.com.cn/images/heroes/witch_doctor_hphover.png"
          },
          {
            name: "warlock",
            avatar: "https://www.dota2.com.cn/images/heroes/warlock_hphover.png"
          },
          {
            name: "dazzle",
            avatar: "https://www.dota2.com.cn/images/heroes/dazzle_hphover.png"
          },
          {
            name: "leshrac",
            avatar: "https://www.dota2.com.cn/images/heroes/leshrac_hphover.png"
          },
          {
            name: "ancient_apparition",
            avatar:
              "https://www.dota2.com.cn/images/heroes/ancient_apparition_hphover.png"
          },
          {
            name: "shadow_demon",
            avatar:
              "https://www.dota2.com.cn/images/heroes/shadow_demon_hphover.png"
          },
          {
            name: "visage",
            avatar: "https://www.dota2.com.cn/images/heroes/visage_hphover.png"
          },
          {
            name: "winter_wyvern",
            avatar:
              "https://www.dota2.com.cn/images/heroes/winter_wyvern_hphover.png"
          },
          {
            name: "grimstroke",
            avatar:
              "https://www.dota2.com.cn/images/heroes/grimstroke_hphover.png"
          }
        ]
      },
      {
        name: "推进",
        heroes: [
          {
            name: "tiny",
            avatar: "https://www.dota2.com.cn/images/heroes/tiny_hphover.png"
          },
          {
            name: "dragon_knight",
            avatar:
              "https://www.dota2.com.cn/images/heroes/dragon_knight_hphover.png"
          },
          {
            name: "drow_ranger",
            avatar:
              "https://www.dota2.com.cn/images/heroes/drow_ranger_hphover.png"
          },
          {
            name: "juggernaut",
            avatar:
              "https://www.dota2.com.cn/images/heroes/juggernaut_hphover.png"
          },
          {
            name: "phantom_lancer",
            avatar:
              "https://www.dota2.com.cn/images/heroes/phantom_lancer_hphover.png"
          },
          {
            name: "luna",
            avatar: "https://www.dota2.com.cn/images/heroes/luna_hphover.png"
          },
          {
            name: "lone_druid",
            avatar:
              "https://www.dota2.com.cn/images/heroes/lone_druid_hphover.png"
          },
          {
            name: "naga_siren",
            avatar:
              "https://www.dota2.com.cn/images/heroes/naga_siren_hphover.png"
          },
          {
            name: "troll_warlord",
            avatar:
              "https://www.dota2.com.cn/images/heroes/troll_warlord_hphover.png"
          },
          {
            name: "shadow_shaman",
            avatar:
              "https://www.dota2.com.cn/images/heroes/shadow_shaman_hphover.png"
          },
          {
            name: "tinker",
            avatar: "https://www.dota2.com.cn/images/heroes/tinker_hphover.png"
          },
          {
            name: "furion",
            avatar: "https://www.dota2.com.cn/images/heroes/furion_hphover.png"
          },
          {
            name: "enchantress",
            avatar:
              "https://www.dota2.com.cn/images/heroes/enchantress_hphover.png"
          },
          {
            name: "jakiro",
            avatar: "https://www.dota2.com.cn/images/heroes/jakiro_hphover.png"
          },
          {
            name: "chen",
            avatar: "https://www.dota2.com.cn/images/heroes/chen_hphover.png"
          },
          {
            name: "lycan",
            avatar: "https://www.dota2.com.cn/images/heroes/lycan_hphover.png"
          },
          {
            name: "chaos_knight",
            avatar:
              "https://www.dota2.com.cn/images/heroes/chaos_knight_hphover.png"
          },
          {
            name: "razor",
            avatar: "https://www.dota2.com.cn/images/heroes/razor_hphover.png"
          },
          {
            name: "venomancer",
            avatar:
              "https://www.dota2.com.cn/images/heroes/venomancer_hphover.png"
          },
          {
            name: "clinkz",
            avatar: "https://www.dota2.com.cn/images/heroes/clinkz_hphover.png"
          },
          {
            name: "broodmother",
            avatar:
              "https://www.dota2.com.cn/images/heroes/broodmother_hphover.png"
          },
          {
            name: "meepo",
            avatar: "https://www.dota2.com.cn/images/heroes/meepo_hphover.png"
          },
          {
            name: "terrorblade",
            avatar:
              "https://www.dota2.com.cn/images/heroes/terrorblade_hphover.png"
          },
          {
            name: "enigma",
            avatar: "https://www.dota2.com.cn/images/heroes/enigma_hphover.png"
          },
          {
            name: "death_prophet",
            avatar:
              "https://www.dota2.com.cn/images/heroes/death_prophet_hphover.png"
          },
          {
            name: "pugna",
            avatar: "https://www.dota2.com.cn/images/heroes/pugna_hphover.png"
          },
          {
            name: "leshrac",
            avatar: "https://www.dota2.com.cn/images/heroes/leshrac_hphover.png"
          },
          {
            name: "invoker",
            avatar: "https://www.dota2.com.cn/images/heroes/invoker_hphover.png"
          },
          {
            name: "visage",
            avatar: "https://www.dota2.com.cn/images/heroes/visage_hphover.png"
          }
        ]
      },
      {
        name: "逃生",
        heroes: [
          {
            name: "treant",
            avatar: "https://www.dota2.com.cn/images/heroes/treant_hphover.png"
          },
          {
            name: "wisp",
            avatar: "https://www.dota2.com.cn/images/heroes/wisp_hphover.png"
          },
          {
            name: "centaur",
            avatar: "https://www.dota2.com.cn/images/heroes/centaur_hphover.png"
          },
          {
            name: "shredder",
            avatar:
              "https://www.dota2.com.cn/images/heroes/shredder_hphover.png"
          },
          {
            name: "earth_spirit",
            avatar:
              "https://www.dota2.com.cn/images/heroes/earth_spirit_hphover.png"
          },
          {
            name: "phoenix",
            avatar: "https://www.dota2.com.cn/images/heroes/phoenix_hphover.png"
          },
          {
            name: "snapfire",
            avatar:
              "https://www.dota2.com.cn/images/heroes/snapfire_hphover.png"
          },
          {
            name: "antimage",
            avatar:
              "https://www.dota2.com.cn/images/heroes/antimage_hphover.png"
          },
          {
            name: "juggernaut",
            avatar:
              "https://www.dota2.com.cn/images/heroes/juggernaut_hphover.png"
          },
          {
            name: "mirana",
            avatar: "https://www.dota2.com.cn/images/heroes/mirana_hphover.png"
          },
          {
            name: "morphling",
            avatar:
              "https://www.dota2.com.cn/images/heroes/morphling_hphover.png"
          },
          {
            name: "phantom_lancer",
            avatar:
              "https://www.dota2.com.cn/images/heroes/phantom_lancer_hphover.png"
          },
          {
            name: "vengefulspirit",
            avatar:
              "https://www.dota2.com.cn/images/heroes/vengefulspirit_hphover.png"
          },
          {
            name: "riki",
            avatar: "https://www.dota2.com.cn/images/heroes/riki_hphover.png"
          },
          {
            name: "templar_assassin",
            avatar:
              "https://www.dota2.com.cn/images/heroes/templar_assassin_hphover.png"
          },
          {
            name: "bounty_hunter",
            avatar:
              "https://www.dota2.com.cn/images/heroes/bounty_hunter_hphover.png"
          },
          {
            name: "naga_siren",
            avatar:
              "https://www.dota2.com.cn/images/heroes/naga_siren_hphover.png"
          },
          {
            name: "ember_spirit",
            avatar:
              "https://www.dota2.com.cn/images/heroes/ember_spirit_hphover.png"
          },
          {
            name: "monkey_king",
            avatar:
              "https://www.dota2.com.cn/images/heroes/monkey_king_hphover.png"
          },
          {
            name: "pangolier",
            avatar:
              "https://www.dota2.com.cn/images/heroes/pangolier_hphover.png"
          },
          {
            name: "puck",
            avatar: "https://www.dota2.com.cn/images/heroes/puck_hphover.png"
          },
          {
            name: "storm_spirit",
            avatar:
              "https://www.dota2.com.cn/images/heroes/storm_spirit_hphover.png"
          },
          {
            name: "windrunner",
            avatar:
              "https://www.dota2.com.cn/images/heroes/windrunner_hphover.png"
          },
          {
            name: "furion",
            avatar: "https://www.dota2.com.cn/images/heroes/furion_hphover.png"
          },
          {
            name: "oracle",
            avatar: "https://www.dota2.com.cn/images/heroes/oracle_hphover.png"
          },
          {
            name: "dark_willow",
            avatar:
              "https://www.dota2.com.cn/images/heroes/dark_willow_hphover.png"
          },
          {
            name: "void_spirit",
            avatar:
              "https://www.dota2.com.cn/images/heroes/void_spirit_hphover.png"
          },
          {
            name: "sand_king",
            avatar:
              "https://www.dota2.com.cn/images/heroes/sand_king_hphover.png"
          },
          {
            name: "slardar",
            avatar: "https://www.dota2.com.cn/images/heroes/slardar_hphover.png"
          },
          {
            name: "life_stealer",
            avatar:
              "https://www.dota2.com.cn/images/heroes/life_stealer_hphover.png"
          },
          {
            name: "spirit_breaker",
            avatar:
              "https://www.dota2.com.cn/images/heroes/spirit_breaker_hphover.png"
          },
          {
            name: "lycan",
            avatar: "https://www.dota2.com.cn/images/heroes/lycan_hphover.png"
          },
          {
            name: "magnataur",
            avatar:
              "https://www.dota2.com.cn/images/heroes/magnataur_hphover.png"
          },
          {
            name: "abyssal_underlord",
            avatar:
              "https://www.dota2.com.cn/images/heroes/abyssal_underlord_hphover.png"
          },
          {
            name: "faceless_void",
            avatar:
              "https://www.dota2.com.cn/images/heroes/faceless_void_hphover.png"
          },
          {
            name: "phantom_assassin",
            avatar:
              "https://www.dota2.com.cn/images/heroes/phantom_assassin_hphover.png"
          },
          {
            name: "clinkz",
            avatar: "https://www.dota2.com.cn/images/heroes/clinkz_hphover.png"
          },
          {
            name: "broodmother",
            avatar:
              "https://www.dota2.com.cn/images/heroes/broodmother_hphover.png"
          },
          {
            name: "weaver",
            avatar: "https://www.dota2.com.cn/images/heroes/weaver_hphover.png"
          },
          {
            name: "spectre",
            avatar: "https://www.dota2.com.cn/images/heroes/spectre_hphover.png"
          },
          {
            name: "meepo",
            avatar: "https://www.dota2.com.cn/images/heroes/meepo_hphover.png"
          },
          {
            name: "nyx_assassin",
            avatar:
              "https://www.dota2.com.cn/images/heroes/nyx_assassin_hphover.png"
          },
          {
            name: "slark",
            avatar: "https://www.dota2.com.cn/images/heroes/slark_hphover.png"
          },
          {
            name: "arc_warden",
            avatar:
              "https://www.dota2.com.cn/images/heroes/arc_warden_hphover.png"
          },
          {
            name: "queenofpain",
            avatar:
              "https://www.dota2.com.cn/images/heroes/queenofpain_hphover.png"
          },
          {
            name: "dark_seer",
            avatar:
              "https://www.dota2.com.cn/images/heroes/dark_seer_hphover.png"
          },
          {
            name: "batrider",
            avatar:
              "https://www.dota2.com.cn/images/heroes/batrider_hphover.png"
          },
          {
            name: "invoker",
            avatar: "https://www.dota2.com.cn/images/heroes/invoker_hphover.png"
          },
          {
            name: "grimstroke",
            avatar:
              "https://www.dota2.com.cn/images/heroes/grimstroke_hphover.png"
          }
        ]
      }
    ];
    const heroes_map = new Map();
    for (let cat of rawData) {
      const category = await Category.findOne({
        name: cat.name
      });
      cat.heroes = cat.heroes.map(hero => {
        if (heroes_map.has(hero.name)) {
          heroes_map.get(hero.name).categories.push(category);
        } else {
          hero.categories = [category];
          heroes_map.set(hero.name, hero);
        }
        return hero;
      });
    }
    heroes_arr = [];
    heroes_map.forEach(val => heroes_arr.push(val));
    await Hero.insertMany(heroes_arr);
    res.send(heroes_arr);
  });

  // 英雄列表
  router.get("/heroes/list", async (req, res) => {
    const parent = await Category.findOne({
      name: "英雄分类"
    });

    const cats = await Category.aggregate([
      { $match: { parent: parent._id } },
      {
        $lookup: {
          from: "heroes",
          localField: "_id",
          foreignField: "categories",
          as: "heroList"
        }
      }
    ]);

    /* const subCats = cats.map(v => v._id); */

    /* cats.unshift({
      name: "热门",
      newsList: await Article.find()
        .where({
          categories: { $in: subCats }
        })
        .populate("categories")
        .limit(5)
        .lean()
    }); */

    res.send(cats);
  });

  //文章详情
  router.get("/articles/:id", async (req, res) => {
    const data = await Article.findById(req.params.id).lean();
    data.related = await Article.find()
      .where({
        categories: { $in: data.categories }
      })
      .limit(2);
    res.send(data);
  });

  //英雄详情
  router.get("/heroes/:id", async (req, res) => {
    const data = await Hero.findById(req.params.id)
      .populate("categories items1 items2 partners.hero")
      .lean();
    res.send(data);
  });

  app.use("/web/api", router);
};
