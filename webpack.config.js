const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    target: 'electron-renderer',
    entry: './src/renderer/index.tsx',
    output: {
      path: path.resolve(__dirname, 'dist/renderer'),
      filename: 'bundle.js',
      clean: true,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@/components': path.resolve(__dirname, 'src/components'),
        '@/pages': path.resolve(__dirname, 'src/pages'),
        '@/hooks': path.resolve(__dirname, 'src/hooks'),
        '@/store': path.resolve(__dirname, 'src/store'),
        '@/services': path.resolve(__dirname, 'src/services'),
        '@/styles': path.resolve(__dirname, 'src/styles'),
        '@/types': path.resolve(__dirname, 'src/types'),
        '@/utils': path.resolve(__dirname, 'src/utils'),
        '@/shared': path.resolve(__dirname, 'shared'),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg|ico)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[hash][ext][query]',
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[hash][ext][query]',
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/renderer/index.html',
        filename: 'index.html',
      }),
    ],
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist/renderer'),
      },
      port: 3000,
      hot: true,
    },
  };
};
