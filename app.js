/**
 * Created by pariskshitdutt on 30/01/15.
 */
var express=require('express');
var app =express();
app.use(express.static(__dirname + '/public'));
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Twit = require('twit');
var highchartsData=[];
var tweets={};
var present={};
var T = new Twit({
    consumer_key:         'Hp0jCkAYhnXW19BenkcZDV4ST'
    , consumer_secret:      'lPOtnskjemIsTsF8qCOcgz9otwSVWot7AMxmE7nU1jdKqb8iP7'
    , access_token:         '1036424330-JYtEIxDMULWlDkE7Tw1X3rMYm0X6I8N80nO6w5x'
    , access_token_secret:  'nnjItdMVjXT897QxiEWhA1TBledGGQEcRCk6OIyAtj4uz'
});
T.get('search/tweets', {q: 'limetray', count: 100}, function (err, data, response) {
    console.log(data, data.statuses.length);
    for (var i = 0; i < data.statuses.length; i++) {
       counters(data.statuses[i]);
    }
    console.log(tweets);
});
app.get('/', function(req, res){
    res.sendFile(__dirname +'/index.htm');
});

io.on('connection', function(socket){
    console.log('a user connected');
    Object.keys(tweets).forEach(function(element, key, _array) {
        highchartsData.push([element,tweets[element]]);
    });
    io.emit('init',JSON.stringify(highchartsData));
    var stream = T.stream('statuses/filter', { track: 'limetray' })

    stream.on('tweet', function (tweet) {
        console.log(tweet);
        counters(tweet);
        highchartsData=[]
        Object.keys(tweets).forEach(function(element, key, _array) {
            highchartsData.push([element,tweets[element]]);
        });

        io.emit('init_new',JSON.stringify(highchartsData));
    })

});
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
http.listen(3000, function(){
    console.log('listening on *:3000');
});