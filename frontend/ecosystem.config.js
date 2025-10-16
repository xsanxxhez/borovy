module.exports = {
  apps: [{
    name: 'borovy-frontend',
    script: 'node_modules/nuxt/bin/nuxt.js',
    args: 'start',
    env: {
      NITRO_PORT: 10000,
      NITRO_HOST: '0.0.0.0',
      NODE_ENV: 'production'
    }
  }]
}