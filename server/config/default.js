'use strict';

module.exports = {
  app: {
    title:  'Jooxe app server'
  },
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
 
  shared: {
    owasp: {
      allowPassphrases: true,
      maxLength: 128,
      minLength: 10,
      minPhraseLength: 20,
      minOptionalTestsToPass: 4
    }
  }

};
