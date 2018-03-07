function fromBase64(base64Str) {
    let buff = new Buffer(base64Str, 'base64');
    let str = buff.toString('utf-8');
    return str;
}

exports.handler = function (event, context, endLambda) {
    console.log(JSON.stringify(event));

    var decLink = fromBase64(event.link);
    console.log('[go] link=' + decLink);

    var onenoteLink = decodeURI(decLink);
    var html =
        `<!DOCTYPE html>
        <html xmlns="http://www.w3.org/1999/xhtml">

        <head>
        <meta charset="utf-8"/>
        <title>new onenote link page</title>
        <script>
            function loaded()
            {
                window.setTimeout(closeMe, 4000);
            }

            function closeMe() 
            {
                window.close();
            }
        </script>
        <script type="text/javascript">
	        function post(path, params, method) {
		        var newPath = path;

		        if (navigator.userAgent.toLowerCase().indexOf("chrome") != -1) {
			        newPath = path.replace("onenote:///", "onenotelinker:///");
		        }
		        else {
		        }

		        method = method || "post";

		        var form = document.createElement("form");
		        form.setAttribute("method", method);
		        form.setAttribute("action", newPath);
		        for (var key in params) {
			        if (params.hasOwnProperty(key)) {
				        var hiddenField = document.createElement("input");
				        hiddenField.setAttribute("type", "hidden");
				        hiddenField.setAttribute("name", key);
				        hiddenField.setAttribute("value", params[key]);

				        form.appendChild(hiddenField);
			        }
		        }

		        document.body.appendChild(form);
		        form.submit();
	        }
        </script>
        </head>
        <body onLoad="loaded()">
        <div class="container">
        <nav class="navbar navbar-inverse" role="navigation">
            <div class="collapse navbar-collapse navbar-ex1-collapse">
            </div>
        </nav>
        <div class="well">
            <script type="text/javascript">
                window.setTimeout(function() {
                        post('${onenoteLink}', {});
                    },
                    1000);
            </script>
        </div>
        <div class="container">
            <h1>이 창은 잠시 후 자동으로 닫힙니다</h1>
        </div>
        </div>
        </body>
        </html>`;

    endLambda(null, html);
}