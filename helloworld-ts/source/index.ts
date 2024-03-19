import * as http from 'http'

import { Matrix, withDebug } from './matrix.ts'

http.createServer(function (request: http.IncomingMessage,
                            response: http.ServerResponse) {

    let respStr = "Hello TrueScript!\n\n";

    let DebubMatrix = withDebug(Matrix);
    let matrix = new DebubMatrix(5, 5, (x, y) => (x + y * 5));

    respStr += "matrix -> \n" + matrix.toString() + "\n\n";
    respStr += "debug -> \n" + matrix.debug() + "\n\n";

    respStr += "iterate -> \n";
    for (let value of matrix) {
        respStr += value.toString() + ", "
    }
    respStr += "\n\n";

    response.end(respStr);

}).listen(3000, "0.0.0.0", function () {

    console.log("Listen port 3000");
});

