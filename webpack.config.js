const path = require("path");
const glob = require("glob");
const webpack = require("webpack");
const cenv = require("custom-env");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const pagesArray = glob.sync("./src/scripts/pages/*.js");
const pages = pagesArray.reduce((acc, item) => {
  const name = item.replace("./src/scripts/", "").replace(".js", "");
  acc[name] = item;
  return acc;
}, {});

module.exports = (_, argv) => {
  cenv.env(argv.mode);

  const config = {
    entry: {
      app: "./src/app.js",
      ...pages
    },
    output: {
      path: path.resolve(__dirname, "assets"),
      filename: "./scripts/[name].js"
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "sass-loader",
              options: {
                sourceMap: false
              }
            }
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "../../fonts/[name].[ext]",
                outputPath: "./fonts"
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "./styles/app.css"
      }),
      new webpack.DefinePlugin({
        __API_URL__: JSON.stringify(process.env.API_URL),
        __API_KEY__: JSON.stringify(process.env.API_KEY),
        __API_VERSION__: JSON.stringify(process.env.API_VERSION)
      })
    ]
  };

  if (argv.mode === "development") {
    config.devtool = "source-map";
  }

  return config;
};
