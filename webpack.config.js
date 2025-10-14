const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: {
      'erg-expense-report-app': './src/index.js',
      'react-globals': './src/react-globals.js'
    },

    output: {
      path: path.resolve(__dirname, 'assets/js'),
      filename: '[name].js',
      chunkFilename: '[name].js',
      clean: true,
      // Ensure compatibility with WordPress
      library: 'ERGExpenseReportApp',
      libraryTarget: 'window'
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@data': path.resolve(__dirname, 'src/data'),
        '@styles': path.resolve(__dirname, 'src/styles')
      }
    },

    module: {
      rules: [
        // TypeScript/TSX
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    browsers: ['> 1%', 'last 2 versions', 'not ie 11']
                  },
                  useBuiltIns: 'usage',
                  corejs: 3
                }],
                ['@babel/preset-react', {
                  runtime: 'automatic'
                }],
                '@babel/preset-typescript'
              ],
              plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-transform-runtime'
              ]
            }
          }
        },

        // JavaScript/JSX
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    browsers: ['> 1%', 'last 2 versions', 'not ie 11']
                  },
                  useBuiltIns: 'usage',
                  corejs: 3
                }],
                ['@babel/preset-react', {
                  runtime: 'automatic'
                }]
              ],
              plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-transform-runtime'
              ]
            }
          }
        },

        // CSS
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ]
        },

        // JSON
        {
          test: /\.json$/,
          type: 'json'
        },

        // Images
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: 'asset/resource',
          generator: {
            filename: '../images/[name].[hash][ext]'
          }
        },

        // Fonts
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: {
            filename: '../fonts/[name].[hash][ext]'
          }
        }
      ]
    },

    plugins: [
      // Expose React and ReactDOM as globals
      new webpack.ProvidePlugin({
        React: 'react',
        ReactDOM: 'react-dom/client'
      }),

      ...(isProduction ? [
        new MiniCssExtractPlugin({
          filename: '../css/[name].css',
          chunkFilename: '../css/[id].css'
        }),

        // Compress assets with gzip
        new CompressionPlugin({
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 8192,
          minRatio: 0.8
        }),

        // Bundle analyzer (only when ANALYZE=true)
        ...(process.env.ANALYZE ? [
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: '../reports/bundle-analysis.html'
          })
        ] : [])
      ] : []),

      // Development plugins
      ...(!isProduction ? [
        // Hot module replacement
        new webpack.HotModuleReplacementPlugin()
      ] : [])
    ],

    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: isProduction,
              drop_debugger: isProduction,
              pure_funcs: isProduction ? ['console.log', 'console.info', 'console.debug'] : []
            },
            mangle: {
              safari10: true
            },
            format: {
              comments: false
            }
          },
          extractComments: false,
          parallel: true
        }),
        new CssMinimizerPlugin({
          parallel: true
        })
      ],

      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 200000,
        cacheGroups: {
          // React core libraries
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 30,
            enforce: true
          },
          // Zustand and state management
          state: {
            test: /[\\/]node_modules[\\/](zustand|immer)[\\/]/,
            name: 'state-management',
            chunks: 'all',
            priority: 25
          },
          // PDF and export libraries
          export: {
            test: /[\\/]node_modules[\\/](jspdf|html2canvas|xlsx)[\\/]/,
            name: 'export-libs',
            chunks: 'all',
            priority: 20
          },
          // Utility libraries
          utils: {
            test: /[\\/]node_modules[\\/](date-fns|lodash|core-js)[\\/]/,
            name: 'utils',
            chunks: 'all',
            priority: 15
          },
          // All other vendors
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            maxSize: 150000
          },
          // Common code from our source
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            enforce: true,
            reuseExistingChunk: true
          }
        }
      },

      // Tree shaking optimizations
      usedExports: true,
      sideEffects: false,

      // Module concatenation (scope hoisting)
      concatenateModules: isProduction
    },

    externals: {
      // Use WordPress provided jQuery if needed
      jquery: 'jQuery',
      // External libraries that will be loaded separately
      jspdf: 'jsPDF',
      xlsx: 'XLSX',
      html2canvas: 'html2canvas'
    },

    devtool: isProduction ? 'source-map' : 'eval-source-map',

    stats: {
      colors: true,
      chunks: false,
      modules: false,
      entrypoints: false,
      warnings: true,
      errors: true
    },

    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/
    },

    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    }
  };
};