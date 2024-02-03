const http = require("http"),
    url = require("url"),
    fs = require("fs"),
    port = 5051;

function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        }
    );
}

const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE");
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
    } else if (parsedUrl.pathname === "/api" && req.method === "POST") {
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

                try {
                    const jsonData = JSON.parse(data);

                    body = JSON.parse(body);

                    jsonData.push({ ...body, id: generateUUID() });

                    const updatedJSON = JSON.stringify(jsonData, null, 4);

                    fs.writeFile("./data.json", updatedJSON, "utf8", (err) => {
                        if (err) {
                            console.log("Error writing: ", err.message);
                            res.writeHead(500);
                            res.end({ error: "Internal Server Error" });
                        } else {
                            res.writeHead(200);
                            res.end(JSON.stringify(body));
                        }
                    });
                } catch (err) {
                    console.log("Error parsing: ", err.message);
                    res.writeHead(500);
                    res.end({ error: "Internal Server Error" });
                }
            });
        });
    } else if (parsedUrl.pathname === "/api" && req.method === "DELETE") {
        const { id } = queryParams;
        fs.readFile("./data.json", "utf8", (err, data) => {
            if (err) {
                console.log("Error writing file...", err.message);
                res.writeHead(500);
                res.end({ error: "Internal Server Error" });

                return;
            }
            try {
                let jsonData = JSON.parse(data);

                jsonData = jsonData.filter((el) => el.id !== id);

                const updatedJSON = JSON.stringify(jsonData);

                fs.writeFile("./data.json", updatedJSON, "utf8", (err) => {
                    if (err) {
                        console.log(("Error write file...", err.message));
                        res.writeHead(500);
                        res.end({ error: "Internal Server Error" });
                    } else {
                        res.writeHead(200);
                        res.end();
                    }
                });
            } catch (err) {
                console.log("Error parsing", err.message);
                res.writeHead(500);
                res.end({ error: "Internal Server Error" });
            }
        });
    } else if (parsedUrl.pathname === "/api/edit" && req.method === "POST") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            fs.readFile("./data.json", "utf8", (err, data) => {
                if (err) {
                    console.log("Error write file...", err.message);
                    res.writeHead(500);
                    res.end({ error: "Internal Server Error" });

                    return;
                }

                try {
                    let jsonData = JSON.parse(data);

                    body = JSON.parse(body);

                    const { id, firstName, lastName } = body;

                    const updatedJSON = JSON.stringify(
                        jsonData.map((user) => {
                            if (user.id === id) {
                                return {
                                    ...user,
                                    firstName: firstName,
                                    lastName: lastName,
                                };
                            } else {
                                return user;
                            }
                        })
                    );

                    fs.writeFile("./data.json", updatedJSON, "utf8", (err) => {
                        if (err) {
                            console.log("Error write file...", err.message);
                            res.writeHead(500);
                            res.end({ error: "Internal Server Error" });
                        } else {
                            res.writeHead(200);
                            res.end();
                        }
                    });
                } catch (err) {
                    if (err) {
                        console.log("Error change data...", err.message);
                        res.writeHead(500);
                        res.end();
                    }
                }
            });
        });
    }
});

server.listen(port, (error) => {
    error ? console.log(error) : console.log("Server is running: " + port);
});