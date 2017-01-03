'use strict';

module.exports = {
  uploads: {
    profile: {
      image: {
        dest: './public/img/profile/uploads/',
        limits: {
          fileSize: 1 * 1024 * 1024 // Max file size in bytes (1 MB)
        }
      }
    }
  }

};