const http = require("http"),
    url = require("url"),
    fs = require("fs"),
    port = 5051;

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();

        return;
    }

    res.setHeader("Content-Type", "text/plain");

    const parsedUrl = url.parse(req.url, true),
        queryParams = parsedUrl.query;

    if (req.method === "GET") {
        fs.readFile("./data.json", "utf8", (err, data) => {
            if (err) {
                console.log("Error reading JSON file: ", err.message);
                res.writeHead(500);
                res.end({ error: "Internal Server Error" });

                return;
            }

            try {
                res.writeHead(200);
                res.end(data);
            } catch (err) {
                console.log("Error sending: ", err.message);
                res.writeHead(500);
                res.end({ error: "Internal Server Error" });
            }
        });
    } else if (req.method === "POST") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            fs.readFile("./data.json", "utf8", (err, data) => {
                if (err) {
                    console.log("Error reading JSON file: ", err.message);
                    res.writeHead(500);
                    res.end({ error: "Internal Server Error" });

                    return;
                }

                try{
                    const jsonData = JSON.parse(data);
                    
                    body = JSON.parse(body);

                    jsonData.push({...body, id: generateUUID()});

                    const updatedJSON = JSON.stringify(jsonData, null, 4);

                    fs.writeFile('./data.json', updatedJSON, 'utf8', (err) => {
                        if(err){
                            console.log("Error writing: ", err.message);
                            res.writeHead(500);
                            res.end({ error: "Internal Server Error" });
                        }else{
                            res.writeHead(200);
                            res.end(JSON.stringify(body));
                        }
                    })
                }catch(err){
                    console.log("Error sending: ", err.message);
                    res.writeHead(500);
                    res.end({ error: "Internal Server Error" });
                }
            });
        });
    }else if(req.method === "DELETE"){
        // создать колонку с иконкой крестиков для каждой строки
        
    }
});

server.listen(port, (error) => {
    error ? console.log(error) : console.log("Server is running: " + port);
});

// const   http = require('http'),
//         url = require('url'),
//         port = 8012;

// const server = http.createServer((req, res) => {
//     res.setHeader('Content-Type', 'text/plain');

//     const parsedUrl = url.parse(req.url, true),
//         queryParams = parsedUrl.query;

//     // console.log(req.url)
//     // console.log(req.method)

//     console.log(parsedUrl)
//     console.log(queryParams)

//     if(parsedUrl.pathname === '/'){
//         res.statusCode = 200;
//         res.end('Hello, client!')
//     }else if(parsedUrl.pathname === '/api' && req.method === 'GET'){
//         res.statusCode = 200;
//         res.end(JSON.stringify({message: 'Hello, api...'}))
//     }else if(parsedUrl.pathname === '/api' && req.method === 'POST'){
//         let body = '';

//         req.on('data', (chunk) => {
//             body += chunk;
//         })

//         req.on('end', () => {
//             body = JSON.parse(body);

//             let {lat, lng} = body.location;

//             lat += 10;
//             lng -= 20;

//             res.statusCode = 200;
//             res.end(JSON.stringify({
//                 message: 'Post api',
//                 data: {
//                     lat,
//                     lng
//                 }
//             }))
//         })
//     } else {
//         res.statusCode = 404;
//         res.end('Not found')
//     }
// })

// server.listen(port, () => {
//     console.log('Сервер был запущен на порту: ' + port)
// })
