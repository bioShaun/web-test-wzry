module.exports = app => {
  const express = require("express");
  const router = express.Router({
    mergeParams: true
  });
  const jwt = require("jsonwebtoken");
  const AdminUser = require("../../models/AdminUser");
  const assert = require("http-assert");
  const shell = require("shelljs");

  //登录中间件
  const authMiddleware = require("../../middleware/auth");
  // 资源中间件
  const resourceMiddleware = require("../../middleware/resource");
  //创建
  router.post("/", async (req, res) => {
    const model = await req.Model.create(req.body);
    res.send(model);
  });

  // 列表
  router.get("/", async (req, res) => {
    const queryOptions = {};

    if (req.Model.modelName == "Category") {
      queryOptions.populate = "parent";
    }

    const items = await req.Model.find()
      .setOptions(queryOptions)
      .limit(100);
    res.send(items);
  });

  // 查询
  router.get("/:id", async (req, res) => {
    const model = await req.Model.findById(req.params.id);
    res.send(model);
  });

  // 更新
  router.put("/:id", async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
    res.send(model);
  });

  //删除
  router.delete("/:id", async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id, req.body);
    res.send({ success: true });
  });

  app.use(
    "/admin/api/rest/:resource",
    authMiddleware(),
    resourceMiddleware(),
    router
  );

  // 上传文件
  const multer = require("multer");
  const upload = multer({ dest: __dirname + "/../../uploads" });
  app.post(
    "/admin/api/upload",
    authMiddleware(),
    upload.single("file"),
    async (req, res) => {
      const file = req.file;
      file.url = `http://localhost:3000/uploads/${file.filename}`;
      res.send(file);
    }
  );

  //登录
  app.post("/admin/api/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await AdminUser.findOne({ username }).select("+password");
    // 校验用户
    assert(user, 422, "用户不存在");

    //校验密码
    const isValid = require("bcryptjs").compareSync(password, user.password);
    assert(isValid, 422, "密码错误");

    //返回token
    const token = jwt.sign(
      {
        id: user._id
      },
      app.get("secret")
    );
    res.send({ token });
  });

  // test run python scripy
  app.get("/admin/api/cmd-test", async (req, res) => {
    const cmdOutdir = __dirname + "/../../cmdOutput";
    await shell.exec(
      `sleep 10s ; ls  > ${cmdOutdir}/test.out`,
      (code, stdout, stderr) => {
        console.log("Exit code:", code);
        console.log("Program output:", stdout);
        console.log("Program stderr:", stderr);
        res.send({
          data: stdout
        });
      }
    );
  });

  // 错误处理
  app.use(async (err, req, res, next) => {
    //console.log(err);
    res.status(err.statusCode || 500).send({
      message: err.message
    });
  });
};
