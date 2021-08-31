// vue.config.js

const path = require("path");

const Webpack = require("webpack");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: "/",
  outputDir: "dist",
  // 打包去除map文件
  productionSourceMap: false,
  devServer: {
    port: 9001,
    proxy: {
      "/baseUrl": {
        target:
          "http://alb-55qn3htnfb91g3k7av.cn-shenzhen.alb.aliyuncs.com:18090/byd",
        // target: "http://192.168.20.10:7100/",
        changeOrigin: true,
        pathRewrite: {
          "^/baseUrl": "",
        },
      },
    },
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            "primary-color": "#0073C6",
          },
          javascriptEnabled: true,
        },
      },
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias.set("@", resolve("src"));

    config.plugin("html").tap((args) => {
      args[0].title = "BYD-管理系统";
      return args;
    });

    config.output
      .filename("js/[name].[hash].js")
      .chunkFilename("js/[name].[hash].js");

    // 去除多余moment多语言包
    config
      .plugin("IgnorePlugin")
      .use(new Webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
  },
  configureWebpack: (config) => {
    // 生产环境下生效
    if (process.env.NODE_ENV === "production") {
      // 配置删除 console.log
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
    }
  },
};
