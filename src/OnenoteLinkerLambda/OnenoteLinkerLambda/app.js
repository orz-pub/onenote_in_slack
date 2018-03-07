'use strict';

var create = require('./create.js');
var go = require('./go.js');

exports.handler = function(event, context, endLambda) {
    console.log(event);

    // 람다 환경 변수에 token 을 키로 값이 필요.
    if (event.token !== process.env.token) {
        endLambda(null, 'invalid token');
    }

    if (event.command !== undefined) {
        create.handler(event, context, endLambda);
    } else {
        go.handler(event, context, endLambda);
    }
}