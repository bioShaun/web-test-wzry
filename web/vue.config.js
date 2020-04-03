module.exports = {
  devServer: {
    port: 8082
  },
  outputDir: __dirname + "/../server/web"
  //publicPath: process.env.NODE_ENV == "production" ? "/web/" : "/"
};
