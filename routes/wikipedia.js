var express = require('express');
var router = express.Router();

const wikipedia = require('../logic/wikipedia');

/**
 * curl -H "Content-Type: application/json" -X POST -d '{"url": "https://en.wikipedia.org/wiki/Edsger_W._Dijkstra"}' http://localhost:3000/api/wikipedia/article/trees
 */
router.post('/trees', function getArticleTree(req, response, next) {
    var url = (req.body.url) ? req.body.url : 'Missing parameter';

    if (wikipedia.validWikipediaUrl(url)) {
        wikipedia.getEpiTrees(url).then(successHandler, errorHandler);

        function successHandler(trees) { response.send(JSON.stringify({data: trees})) }
        function errorHandler(error) { response.send(JSON.stringify({error: error})) }
    }
    else {
        return response.send(JSON.stringify({error: 'Invalid URL'}));
    }
});

/**
 * curl -H "Content-Type: application/json" -X POST -d '{"url": "https://en.wikipedia.org/wiki/Edsger_W._Dijkstra"}' http://localhost:3000/api/wikipedia/article/thumbnail
 */
router.post('/thumbnail', function (req, response, next) {
    var url = (req.body.url) ? req.body.url : 'Missing parameter';

    if (wikipedia.validWikipediaUrl(url)) {
        wikipedia.getArticleThumbnail(url).then(successHandler, errorHandler);

        function successHandler(thumbnailLink) { response.send(JSON.stringify({data: thumbnailLink})) }
        function errorHandler(error) { response.send(JSON.stringify({error: error})) }
    }
    else response.send(JSON.stringify({error: 'Invalid URL'}));
});

/**
 * curl -H "Content-Type: application/json" -X POST -d '{"url": "https://en.wikipedia.org/wiki/Edsger_W._Dijkstra"}' http://localhost:3000/api/wikipedia/article/summary
 */
router.post('/summary', function (req, response, next) {
    var url = (req.body.url) ? req.body.url : 'Missing parameter';

    if (wikipedia.validWikipediaUrl(url)) {
        wikipedia.getArticleSummary(url).then(successHandler, errorHandler );

        function successHandler(summary) { response.send(JSON.stringify({data: summary})) }
        function errorHandler(error) { response.send(JSON.stringify({error: error})) }
    }
    else
        response.send(JSON.stringify({error: 'Invalid URL'}));
});

/**
 * curl -H "Content-Type: application/json" -X POST -d '{"url": "https://en.wikipedia.org/wiki/Edsger_W._Dijkstra"}' http://localhost:3000/api/wikipedia/article/images
 * curl -H "Content-Type: application/json" -X POST -d '{"url": "https://en.wikipedia.org/wiki/Hong_Kong_Correctional_Services"}' http://localhost:3000/api/wikipedia/article/images
 */
router.post('/images', function (req, response, next) {
    var url = (req.body.url) ? req.body.url : 'Missing parameter';

    if (wikipedia.validWikipediaUrl(url)) {
        wikipedia.getArticleImages(url).then(successHandler, errorHandler);

        function successHandler(imageLinks) { response.send(JSON.stringify({data: imageLinks})) }
        function errorHandler(error) {response.send(JSON.stringify({error: error})) }
    }
    else response.send(JSON.stringify({error: 'Invalid URL'}));
});

/**
 * curl -H "Content-Type: application/json" -X POST -d '{"url": "https://en.wikipedia.org/wiki/Edsger_W._Dijkstra"}' http://localhost:3000/api/wikipedia/article/exists
 */
router.post('/exists', function (req, response, next) {
    var url = (req.body.url) ? req.body.url : 'Missing parameter';

    if (wikipedia.validWikipediaUrl(url)) {

        wikipedia.articleExists(url).then(successHandler, errorHandler);

        function successHandler(exists) { response.send(JSON.stringify({data: exists})) }
        function errorHandler(error) { response.send(JSON.stringify({error: error})) }
    }
    else response.send(JSON.stringify({error: 'Invalid URL'}));
});

/**
 * curl -H "Content-Type: application/json" -X GET http://localhost:3000/api/wikipedia/article/trending
 */
router.get('/trending', function (req, response, next) {
    wikipedia.getTodaysTrends().then(successHandler, errorHandler);

    function successHandler(trends) { response.send(JSON.stringify({data: trends})) }
    function errorHandler(error) { response.send(JSON.stringify({error: error})) }
});

// get canonical URL
/**
 * curl -H "Content-Type: application/json" -X POST -d '{"query": "Duke Blue Devils mens basketball"}' http://localhost:3000/api/wikipedia/article/canonical
 * curl -H "Content-Type: application/json" -X POST -d '{"query": "iphone"}' http://localhost:3000/api/wikipedia/article/canonical
 */
router.post('/canonical', function (req, response, next) {
    var query = (req.body.query) ? req.body.query : 'Missing parameter';

    if (wikipedia.validQuery(query)) {
        wikipedia.getCanonicalURL(query).then(successHandler, errorHandler);

        function successHandler(canonicalURL) { response.send(JSON.stringify({data: canonicalURL})) }
        function errorHandler(error) { response.send(JSON.stringify({error: error})) }
    } else {
        response.send(JSON.stringify({error: "Query contains illegal characters."}));
    }
});

module.exports = router;