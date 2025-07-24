const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  webpack: {
    plugins: {
      add: [
        // Add bundle analyzer in development
        ...(process.env.ANALYZE === 'true' ? [new BundleAnalyzerPlugin()] : []),
      ],
    },
    configure: (webpackConfig, { env, paths }) => {
      // Production optimizations
      if (env === 'production') {
        // Enable gzip compression
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all',
                enforce: true,
              },
              common: {
                name: 'common',
                minChunks: 2,
                chunks: 'all',
                enforce: true,
              },
            },
          },
        };

        // Tree shaking optimizations
        webpackConfig.optimization.usedExports = true;
        webpackConfig.optimization.sideEffects = false;
      }

      return webpackConfig;
    },
  },
  babel: {
    plugins: [
      // Remove console.log in production
      ...(process.env.NODE_ENV === 'production' ? [['transform-remove-console']] : []),
    ],
  },
};