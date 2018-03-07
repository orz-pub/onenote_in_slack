var request = require('request');

Date.prototype.addHours = function(h) {
    this.setHours(this.getHours() + h);
    return this;
}

// https://api.slack.com/docs/message-formatting#message_formatting
function makeLinkText(rawLink) {
    const delim = '&gt;';   // <, > 는 &lt, &gt 로 해야 한다. (슬랙 예약 기호)

    var decodeLink = decodeURIComponent(rawLink);
    var splits = decodeLink.split('/');
    var lastIndex = splits.length - 1;
    splits[lastIndex] = splits[lastIndex].substr(0, splits[lastIndex].indexOf('&section-id'));

    var linkText = '';

    for (var i = 5; i < splits.length; ++i) {
        linkText += splits[i] + delim;
    }
    linkText = linkText.replace('.one#', delim);
    linkText = linkText.substr(0, linkText.length - delim.length);

    return linkText;
}

function toBase64(str) {
    let buff = new Buffer(str);
    let base64Str = buff.toString('base64');
    return base64Str;
}

exports.handler = function (event, context, endLambda) {
    // 람다에서 실행하는 경우는 api-gateway 에서 처리되서 들어온다.
    if (event.localtest !== undefined && event.localtest) {
        event.text = event.text.replace(/\\/g, "/");
    }

    var nowStr = (new Date()).addHours(9).toISOString().replace('T', ' ').replace(/\.\d+Z/g, '');
    var linkText = makeLinkText(event.text);

    var getParam = decodeURI(event.text);
    getParam = encodeURI(getParam);
    getParam = toBase64(getParam);

    console.log('[create] link=' + getParam);

    var url = process.env.get_url + getParam;
    var finalLink = `[${nowStr}] *<${url}|${linkText}>*` + ` (by ${event.user_name})`;

    var response = {
        "response_type": "in_channel",
        "channel": event.channel_id,
        "text": finalLink,
        "mrkdwn": true
    };

    var options = {
        method: "POST",
        url: event.response_url,
        headers: {
            'Content-Type': "application/json"
        },
        json: response
    };

    // 람다에서 바로 리턴하지 않고, response_url 에 리턴하면 명령이 보이지 않는다.
    request(options,
        function (err, res, body) {
            if (err) {
                console.log(err);
                endLambda(null, `생성 오류: ${err}`);
                return;
            }

            endLambda(null, 'response_url 에 리턴하면 이 메시지는 보이지 않는다');
        });
}