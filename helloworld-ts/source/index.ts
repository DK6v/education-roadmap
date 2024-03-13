import * as http from 'http'

import { Matrix } from './matrix.ts'

http.createServer(function (request: http.IncomingMessage,
                            response: http.ServerResponse) {

    let respStr = "Hello TrueScript!\n\n";

    let matrix = new Matrix(5, 5, (x, y) => (x + y * 5));

    respStr += "matrix -> \n" + matrix.toString() + "\n";

    respStr += "iterate -> \n";
    for (let value of matrix) {
        respStr += value.toString() + ", "
    }
    respStr += "\n";

    response.end(respStr);

}).listen(8081, "0.0.0.0", function () {

    console.log("Listen port 8081");
});

