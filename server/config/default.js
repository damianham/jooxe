'use strict';

module.exports = {
  app: {
    title:  'Jooxe app server'
  },
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
 
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  },
	// sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'JOOXE',
  // sessionKey is the cookie session name
  sessionKey: 'sessionId',
  sessionCollection: 'sessions',
  // Lusca config
  csrf: {
    csrf: false,
    csp: false,
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    xssProtection: true
  },
	illegalUsernames: ['meanjs', 'administrator', 'password', 'admin', 'user',
  'unknown', 'anonymous', 'null', 'undefined', 'api', 'jooxe'
	],
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
