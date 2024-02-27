const fsPromise = require("node:fs/promises"),
    path = require('path'),
    logFilePath = path.join(__dirname, "../log.txt"),
    {
        formatDate,
        convertToDate,
        areDatesOnSameDay,
    } = require("../utils/date.js");

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

async function makeLog(ip, method, path, status, message, date = new Date()) {
    try {
        const data = await fsPromise.readFile(logFilePath, {
                encoding: "utf8",
            }),
            lines = data.split("\n"),
            lastLine = lines[lines.length - 2],
            datePattern = /\[(\d{2}\/[a-zA-Z]+\/\d{4}:\d{2}:\d{2}:\d{2})\]/,
            match = lastLine.match(datePattern),
            dateString = match[1],
            lastLogDate = convertToDate(dateString);

        console.log(lastLogDate, date)

        if (!areDatesOnSameDay(date, lastLogDate)) {
            const dateSeparator = `|---${formatDate(date).split(":")[0]}---|\n`;
            await fsPromise.appendFile(
                logFilePath,
                dateSeparator,
                "utf8",
                (err) => {
                    console.log(err);
                }
            );
        }

        let log = `${ip} - [${formatDate(
            date
        )}] "${method} ${path}" ${status} -> '${message}'`;
        await fsPromise.appendFile(logFilePath, log + "\n", "utf8", (err) => {
            console.log(err);
        });
        console.log(log);
    } catch (err) {
        console.log(err);
        console.error("Error while writing: " + err);
    }
}

module.exports = {
    generateUUID,
    makeLog,
};
