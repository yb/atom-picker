module.exports = {
  devServer: (config) => ({
    ...config,
    proxy: {
      '/api': {
        target: process.env.API,
      },
    },
  }),
}
