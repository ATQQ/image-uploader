const os = require('os');
const cpuCount = os.cpus().length;

module.exports = {
  apps: [{
    name: 'image-uploader',
    script: '.output/server/index.mjs',
    // instances: 'max',
    instances: Math.floor(cpuCount / 2),
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      // SECRET_ACCOUNT_USER1: 'testpwd',
      // SECRET_ACCOUNT_SUGAR: 'test02'
    }
  }]
} 