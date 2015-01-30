/**
 * Created by pariskshitdutt on 30/01/15.
 * calls for twitter search then creates a express app on port 3000
 * client will only run once the tweets have been processed it will take about 10 secs on server start.
 * after that it will keep track of any new tweets so upon start of app for about first 10 secs the client wont be able to run
 * then clients will be served until the server is arbitrarily stopped
 *
 * client end uses high charts and socket.io. socket.io to update chart real time and highcharts for showing the chart
 */

var express=require('express');
var app =express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Twit = require('twit');
var highchartsData=[];
var tweets={};
var present={};
var twitter_completed=false;
/**
 * twitter configurations
 * @type {Twitter}
 */
var T = new Twit({
    consumer_key:         'Hp0jCkAYhnXW19BenkcZDV4ST'
    , consumer_secret:      'lPOtnskjemIsTsF8qCOcgz9otwSVWot7AMxmE7nU1jdKqb8iP7'
    , access_token:         '1036424330-JYtEIxDMULWlDkE7Tw1X3rMYm0X6I8N80nO6w5x'
    , access_token_secret:  'nnjItdMVjXT897QxiEWhA1TBledGGQEcRCk6OIyAtj4uz'
});
/**
 * twitter query to search word limetray on twitter
 */
T.get('search/tweets', {q: 'limetray', count: 100}, function (err, data, response) {
    console.log(data, data.statuses.length);
    for (var i = 0; i < data.statuses.length; i++) {
        counters(data.statuses[i]);
    }
    console.log(tweets);
    twitter_completed=true;
});

/**
 * declaration of static folder from where the static files shall be served
 */
app.use('/public',express.static(__dirname + '/public'));

/**
 * route to serve index.html
 */
app.get('/', function(req, res){
    res.sendFile(__dirname +'/index.htm');
});

/**
 * socket.io functions to send data through a socket upon connections of a client but wont refresh page if tweets are not loaded yet
 */
io.on('connection', function(socket){
        Object.keys(tweets).forEach(function (element, key, _array) {
            highchartsData.push([element, tweets[element]]);
        });
        if(twitter_completed)
        io.emit('init', JSON.stringify(highchartsData));
        //var stream = T.stream('statuses/filter', {track: 'limetray'});
        //stream.on('tweet', function (tweet) {
        //console.log(tweet);
        //counters(tweet);
        //highchartsData=[]
        //Object.keys(tweets).forEach(function(element, key, _array) {
        //    highchartsData.push([element,tweets[element]]);
        //})
        //    if(twitter_completed)
        //io.emit('init_new',JSON.stringify(highchartsData));
        //});

});
/**
 * increment of variables against date for keeping record of tweets on that day
 * @param data
 */
function counters(data){
    if(!present[data.id]) {
        present[data.id]=true;
        var tweet_date = new Date(data.created_at);
        if (tweets[tweet_date.toDateString()]) {
            tweets[tweet_date.toDateString()]++;
        } else {
            tweets[tweet_date.toDateString()] = 1;
        }
    }
}
/**
 * port declaration of express
 */
http.listen(3000, function(){
    console.log('listening on *:3000');
});