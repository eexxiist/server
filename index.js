const   http = require('http'),
        url = require('url'),
        fs = require('fs'),
        port = 3000;

const server = http.createServer((req, res) => {
    console.log('Server request');
    console.log(req.url, req.method)

    res.setHeader('Content-Type', 'text/plain');

    if(req.method === 'GET'){
        fs.readFile('index.html', (err, data) => {
            if(err){
                res.writeHead(500);
                read.end('Error index.html')
            } else {
                res.writeHead(200);
                res.end(data)
            }
        })
    } else if(req.method === 'POST'){
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        })
        req.on('end', () => {
            console.log(body);
            body = JSON.parse(body);

            fs.writeFile('data.json', body, (err) => {
                if(err){
                    res.writeHead(500);
                    read.end('Error index.html')
                }else{
                    res.writeHead(200);
                    res.end('Данные записаны')
                }
            })
        })
    }
})


server.listen(port, (error) => {
    error ? console.log(error) : console.log('Server is running');
})

























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