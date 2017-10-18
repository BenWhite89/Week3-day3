var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

var server = http.createServer(function(req, res) {
    if (url.parse(req.url).pathname == `/`) {
        var pathName = path.join(__dirname, '..', 'client', 'index.html');

        res.writeHead(200, {'Content-type': 'html'});
        fs.createReadStream(pathName).pipe(res);
    } else if (url.parse(req.url).pathname == `/api/chirps`) {
        var pathName = path.join(__dirname, 'data.json');
        if (req.method == 'GET') {
            res.writeHead(200, {'Content-type': 'json'});
            fs.createReadStream(pathName).pipe(res);
        } else if (req.method == 'POST') {
            var strJSON = [];
            var list = [];
            fs.readFile(pathName, function(err, data) {
                if (err) {
                    throw err;
                } else {
                    strJSON.push(data);
                    list.push(JSON.parse(strJSON));

                    var post = '';

                    req.on('data', function(chunk) {
                        post += chunk;
                    })

                    req.on('end', function() {
                        var input = JSON.parse(post);
                        list.push(input);
                        var writeJSON = JSON.stringify(list);

                        fs.writeFile(pathName, writeJSON, function(err) {
                            if (err) {
                                throw err;
                            }
                            res.writeHead(201, {
                                "Data-type": "text",
                                "Content-type": "application/json"
                            });
                            res.end();
                        })
                    })
                }
            });
        }
    } else {
        var address = url.parse(req.url).pathname;
        var ext = `"${path.extname(address)}"`;
        var newPath = path.join(__dirname, '../client', address);

        fs.readFile(newPath, function(err, data) {
            if (err) {
                res.writeHead(404);
                res.end();
            }
            res.writeHead(201, {"Content-type": ext})
            fs.createReadStream(newPath).pipe(res);
        })
    }
});
server.listen(3000);