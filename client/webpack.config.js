module.exports = {
  mode: "development", // set the mode to development
  entry: "./src/index.js", // set the entry file path
  output: {
    filename: "bundle.js", // set the output file name
    path: `${__dirname}/dist`, // set the output directory path
  },
  module: {
    rules: [
      {
        test: /\.js$/, // apply this rule to .js files
        exclude: /node_modules/, // exclude node_modules directory
        use: {
          loader: "babel-loader", // use babel-loader for .js files
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"], // apply the presets to the loader
          },
        },
      },
      {
        test: /\.css$/, // apply this rule to .css files
        use: ["style-loader", "css-loader"], // use style-loader and css-loader for .css files
      },
    ],
  },
  devServer: {
    contentBase: "./dist", // set the content base for the development server
  },
};
