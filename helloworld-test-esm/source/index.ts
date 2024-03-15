import * as http from 'http';
import * as url from 'node:url';
import * as process from 'node:process';

import fetch from 'node-fetch';

export { start, close, ready };

let server: http.Server = null!;

async function start(wait: boolean = false) {

    server = http.createServer(function (request: http.IncomingMessage,
        response: http.ServerResponse) {

        let respStr = "Hello!";
        response.end(respStr);

    }).listen(8081, "0.0.0.0", function () {
        console.log("Listen port 8081");
    });

    if(wait) {

        try {
            await ready();
            console.log("HTTP server is READY!");
        }
        catch (error) {
            console.log("HTTP server is DOWN!");
        }
    }
}

function close() {
    console.log("Stop HTTP server");
    server.close();
}

async function ready(url: string = "http://localhost:8081",
                     interval: number = 500 /* ms */,
                     attempts: number = 10) {

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    let count: number = 0

    return new Promise(async (resolve, reject) => {

        while (count < attempts) {

            await sleep(interval)

            try {
                const response = await fetch(url)
                if (response.ok) {
                    if (response.status === 200) {
                        resolve("Done");
                        break
                    }
                } else {
                    count++
                }
            } catch {
                count++
                console.log(`Still down, trying ${count} of ${attempts}`)
            }

            count++;
        }

        reject(new Error(`Server is down: ${count} attempts tried`))
    })
}

async function __main__() {

    if (import.meta.url.startsWith('file:')) {
        const modulePath = url.fileURLToPath(import.meta.url);
        if (process.argv[1] === modulePath) {
            start(true);
        }
    }
}

__main__();