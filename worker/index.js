const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000 //if lost connection automatically reconnect to server once ever 1000ms
})

const sub = redisClient.duplicate(); //subscription to redis to watch for updates

function fib(index){
    if (index < 2) return 1;
    return fib(index-1) + fib(index-2);
}


sub.on('message', (channel, message) => {
    redisClient.hset('values', message, fib(parseInt(message)));
})

sub.subscribe('insert');//subscribe to any insert event