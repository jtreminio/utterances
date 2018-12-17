module.exports = {
  plugins: {
    'posthtml-expressions': {
      root: __dirname,
      locals: {
        NODE_ENV: process.env.NODE_ENV,
        APP_ROOT: process.env.APP_ROOT,
        UTTERANCES_API: process.env.UTTERANCES_API,
        GITHUB_APP_NAME: process.env.GITHUB_APP_NAME,
        GOOGLE_ANALYTICS: process.env.GOOGLE_ANALYTICS
      }
    },
    'posthtml-include': {
      root: __dirname
    },
    'posthtml-md': {
      root: __dirname
    }
  }
};
