const fs = require("fs"),
    {
        formatDate,
        convertToDate,
        areDatesOnSameDay,
    } = require("../utils/date.js"),
    { generateUUID, makeLog } = require("../utils/user.js"),
    url = require("url");

/**
 * Returns the active reply comment for a given site and post.
 * @method GET
 * @route /api
 * @param  {object}  options options object.
 * @param  {object}  options.state   Global state tree
 * @param  {number}  options.siteId  The ID of the site we're querying
 * @param  {number}  options.postId  The ID of the post we're querying
 * @returns {object}    commentId     Can be a string if the comment is a placeholder
 */

function getUserData(req, res) {
    const parsedUrl = url.parse(req.url, true);
    fs.readFile("./data.json", "utf8", (err, data) => {
        if (err) {
            console.log("Error reading JSON file: ", err.message);
            res.writeHead(500);
            res.end({ error: "Internal Server Error" });

            makeLog(
                req.headers.origin.split(":")[1].slice(2),
                req.method,
                parsedUrl.pathname,
                500,
                "Data was not received..."
            );

            return;
        }

        try {
            res.writeHead(200);

            // makeLog(
            //     req.headers.origin.split(':')[1].slice(2),
            //     req.method,
            //     parsedUrl.pathname,
            //     200,
            //     'Data was gotten...'
            // )

            res.end(data);
        } catch (err) {
            console.log("Error sending: ", err.message);
            res.writeHead(500);
            res.end({ error: "Internal Server Error" });
        }
    });
}

/**
 * Returns the active reply comment for a given site and post.
 * @method POST
 * @route /api
 * @param  {object}  options options object.
 * @param  {object}  options.state   Global state tree
 * @param  {number}  options.siteId  The ID of the site we're querying
 * @param  {number}  options.postId  The ID of the post we're querying
 * @returns {object}    commentId     Can be a string if the comment is a placeholder
 */

function createUserNote(req, res) {
    const parsedUrl = url.parse(req.url, true);

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
                        makeLog(
                            req.headers.origin.split(":")[1].slice(2),
                            req.method,
                            parsedUrl.pathname,
                            200,
                            "User was recorded"
                        );
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
}

/**
 * Returns the active reply comment for a given site and post.
 * @method DELETE
 * @route /api
 * @param  {object}  options options object.
 * @param  {object}  options.state   Global state tree
 * @param  {number}  options.siteId  The ID of the site we're querying
 * @param  {number}  options.postId  The ID of the post we're querying
 * @returns {object}    commentId     Can be a string if the comment is a placeholder
 */

function deleteUserNote(id, req, res) {
    const parsedUrl = url.parse(req.url, true);
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

            const updatedJSON = JSON.stringify(jsonData, null, 4);

            fs.writeFile("./data.json", updatedJSON, "utf8", (err) => {
                if (err) {
                    console.log(("Error write file...", err.message));
                    res.writeHead(500);
                    res.end({ error: "Internal Server Error" });
                } else {
                    makeLog(
                        req.headers.origin.split(":")[1].slice(2),
                        formatDate(new Date()),
                        req.method,
                        parsedUrl.pathname,
                        200,
                        "User was deleted"
                    );
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
}

/**
 * Returns the active reply comment for a given site and post.
 * @method POST
 * @route /api/edit
 * @param  {object}  options options object.
 * @param  {object}  options.state   Global state tree
 * @param  {number}  options.siteId  The ID of the site we're querying
 * @param  {number}  options.postId  The ID of the post we're querying
 * @returns {object}    commentId     Can be a string if the comment is a placeholder
 */

function editUserNote(req, res) {
    const parsedUrl = url.parse(req.url, true);
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
                        makeLog(
                            req.headers.origin.split(":")[1].slice(2),
                            formatDate(new Date()),
                            req.method,
                            parsedUrl.pathname,
                            200,
                            "User was edited"
                        );

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

module.exports = {
    createUserNote,
    deleteUserNote,
    editUserNote,
    getUserData,
};
