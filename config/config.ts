/*
 * @Author: xxxafu
 * @Date: 2021-11-09 14:36:28
 * @LastEditTime: 2021-11-18 17:07:39
 * @LastEditors: xxxafu
 * @Description:
 * @FilePath: \evea-admin\config\config.ts
 */
import { defineConfig } from 'umi';
import routes from './routes';
import tailwindcss from '@tailwindcss/postcss7-compat';

export default defineConfig({
  routes: routes.defaultRouter,
  publicPath: '/examlgd/',
  antd: {},
  theme: {
    //'@primary-color': 'rgba(129, 140, 248, 1)',
  },
  /* esbuild无法使用，应该与postcss及插件tailwind有关
  esbuild: {
    target: 'es5',
  },
  */
  dynamicImport: {
    loading: '@/components/loading/Loading',
  },
  history: { type: 'hash' },
  layout: {},
  request: {
    dataField: 'data',
  },
  nodeModulesTransform: {
    type: 'none',
  },
  fastRefresh: {},
  extraPostCSSPlugins: [
    /* 配置tailwindcss，目前为postcss7.0兼容版本 */
    tailwindcss(),
  ],
  /* 打包体积处理设定 */
  chainWebpack(config) {
    config.optimization.splitChunks({
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(css|less)$/,
          chunks: 'async',
          minChunks: 1,
          minSize: 0,
        },
      },
    });
    config.merge({
      optimization: {
        minimize: true,
        splitChunks: {
          chunks: 'async',
          minSize: 30000,
          minChunks: 2,
          automaticNameDelimiter: '.',
          cacheGroups: {
            vendor: {
              name: 'vendors',
              test: /^.*node_modules[\\/](?!ag-grid-|lodash|wangeditor|react-virtualized|rc-select|rc-drawer|rc-time-picker|rc-tree|rc-table|rc-calendar|antd).*$/,
              chunks: 'all',
              priority: 10,
            },
          },
        },
      },
    });
    //过滤掉momnet的那些不使用的国际化文件
    config
      .plugin('replace')
      .use(require('webpack').ContextReplacementPlugin)
      .tap(() => {
        return [/moment[/\\]locale$/, /zh-cn/];
      });
  },
});
