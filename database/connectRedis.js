var redis = require("redis"),
    client = redis.createClient({
        host: 'redis-13539.c1.asia-northeast1-1.gce.cloud.redislabs.com',
        port:13539,
        password: '8m5MsmZnCUaFnPb03qu7RggwUQi8mhLd'
    });
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

client.on("error", function (err) {
    console.log("Error " + err);
});

client.set("string key", "string val", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
client.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    // client.quit();
});

const options={
    client: client
}

module.exports = {
    session: session,
    RedisStore: new RedisStore(options)
}