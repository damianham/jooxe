'use strict';

/**
 * Module dependencies
 */
var articlesPolicy = require('./articles.server.policy'),
  schema = require('./article.server.model'),
  articles = require('./articles.server.controller');

articlesPolicy.invokeRolesPolicies();

module.exports = function(app) {
  
  // create the model on the subapp using the db for this subapp
  app.locals.Article = app.db.model('Article',schema);
  
  // Articles Routes
  app.route('/api/articles').all(articlesPolicy.isAllowed)
    .get(articles.list)
    .post(articles.create);

  app.route('/api/articles/:articleId').all(articlesPolicy.isAllowed)
    .get(articles.read)
    .put(articles.update)
    .delete(articles.delete);

  // Finish by binding the Article middleware
  app.param('articleId', articles.articleByID);
};

