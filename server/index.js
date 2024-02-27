const http = require("http"),
    url = require("url"),
    fs = require("fs"),
    port = 5051,
    {
        createUserNote,
        deleteUserNote,
        editUserNote,
        getUserData,
    } = require("./controller/userController.js"),
    {
        formatDate,
        convertToDate,
        areDatesOnSameDay,
    } = require("./utils/date.js"),
    { makeLog } = require("./utils/user.js");

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
        getUserData(req, res);
    } else if (parsedUrl.pathname === "/api" && req.method === "POST") {
        createUserNote(req, res);
    } else if (parsedUrl.pathname === "/api" && req.method === "DELETE") {
        const { id } = queryParams;
        deleteUserNote(id, req, res);
    } else if (parsedUrl.pathname === "/api/edit" && req.method === "POST") {
        editUserNote(req, res);
    }
});

server.listen(port, (error) => {
    error ? console.log(error) : console.log("Server is running: " + port);
});
