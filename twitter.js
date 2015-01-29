/**
 * Created by pariskshitdutt on 29/01/15.
 */

var Twit = require('twit');
var tweets={};
var T = new Twit({
    consumer_key:         'Hp0jCkAYhnXW19BenkcZDV4ST'
    , consumer_secret:      'lPOtnskjemIsTsF8qCOcgz9otwSVWot7AMxmE7nU1jdKqb8iP7'
    , access_token:         '1036424330-JYtEIxDMULWlDkE7Tw1X3rMYm0X6I8N80nO6w5x'
    , access_token_secret:  'nnjItdMVjXT897QxiEWhA1TBledGGQEcRCk6OIyAtj4uz'
});
exports.getTweets=function getTweets() {
    T.get('search/tweets', {q: 'limetray', count: 100}, function (err, data, response) {
        console.log(data, data.statuses.length);
        for (var i = 0; i < data.statuses.length; i++) {
            var tweet_date = new Date(data.statuses[i].created_at);
            tweet_date.setHours(0, 0, 0, 0);
            tweets[tweet_date.toUTCString()]++;
        }

    })
}

var stream = T.stream('statuses/filter', { track: 'limetray' })

stream.on('tweet', function (tweet) {
    console.log(tweet)
})
