const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MetaVariables = require('./project.config.js');
const sortCSSmq = require('sort-css-media-queries');

const PATHS = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist'),
  assets: 'assets/'
}

const fs = require( 'fs' );
const pages = fs.readdirSync( './src' );

let htmlPages = [];
pages.forEach( page => {
  if ( page.endsWith( '.html' ) ) {
    htmlPages.push( page.split( '.html' )[0] )
  }
})

let multipleHtmlPlugins = htmlPages.map( name => {
  return new HtmlWebpackPlugin({
    template: `${PATHS.src}/${name}.html`,
    filename: `${name}.html`,
    scriptLoading: 'blocking', // Scripts from head to bottom
    minify: {
      collapseWhitespace: false
    },
    viewport: MetaVariables.viewport,
    themeColor: MetaVariables.themeColor
  })
});

module.exports = {
  context: PATHS.src,
  entry: `${PATHS.src}/index.js`,
  output: {
    path: PATHS.dist,
    filename: 'js/scripts.js?v=[hash]',
  },
  devtool: 'source-map',
  optimization: {
    chunkIds: 'named',
    minimize: true
  },
  devServer: {
    watchFiles: {
      paths: [PATHS.src]
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }, {
        test: /\.(s*)[ac]ss$/i,
        // exclude: /node_modules/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader', // Befor sass-loader
            options: {
              postcssOptions: {
                plugins: [
                  'autoprefixer',
                  ['css-mqpacker', {
                    sort: sortCSSmq
                  }]
                ]
              }
            }
          }, {
            loader: 'sass-loader', // Sfter postcss-loader
            options: {
              sassOptions: {
                outputStyle: 'expanded' // nested, expanded, compact, compressed
              }
            }
          }
        ]
      }, {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: '[path][name].[ext]',
        }
      }
    ]
  },
  plugins: [
    // new CleanWebpackPlugin(), // Clean dist
    new MiniCssExtractPlugin({
      filename: 'css/style.css?v=[hash]',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: `${PATHS.src}/images`,
          to: 'images'
        }
      ]
    })
  ].concat( multipleHtmlPlugins )
}
