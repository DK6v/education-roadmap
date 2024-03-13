const {run: ch0} = require("./source/ch0.js");
const {run: ch1} = require("./source/ch1.js");
const {run: ch6} = require("./source/ch6.js");

const http = require("http");

http.createServer(function(request, response){

    let respStr = ch0();

    response.end(respStr);

}).listen(8081, "0.0.0.0", function() {

    console.log("Listen port 8081");
});

