var path = require('path');

module.exports = {
  entry: "./src/app.js",
  output: {
    path: path.join(__dirname, "priv", "static", "js"),
    filename: "bundle.js"
  },
  module: {
    loaders: [{ 
        test: /\.js$/, 
        include: path.join(__dirname, "src"),
        loader: "babel-loader",
        query: {
          presets: ["es2015", "react"]
        }
    }]
  }
};
