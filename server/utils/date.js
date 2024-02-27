function formatDate(date) {
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    const day = date.getDate(),
        month = months[date.getMonth()],
        year = date.getFullYear(),
        hours = date.getHours().toString().padStart(2, "0"),
        minutes = date.getMinutes().toString().padStart(2, "0"),
        second = date.getSeconds().toString().padStart(2, "0");

    return `${day}/${month}/${year}:${hours}:${minutes}:${second}`;
}

function convertToDate(dateString) {
    const parts = dateString.split("/"),
        months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        monthIndex = months.indexOf(parts[1]),
        year = parts[2].split(":")[0],
        date = new Date(
            year,
            monthIndex,
            parts[0],
            ...parts[2].split(":").slice(1)
        );

    date.setHours(date.getHours() + 3);

    return date;
}

function areDatesOnSameDay(date_1, date_2) {
    return (
        date_1.getFullYear() === date_2.getFullYear() &&
        date_1.getMonth() === date_2.getMonth() &&
        date_1.getDate() === date_2.getDate()
    );
}

module.exports = {
    formatDate,
    convertToDate,
    areDatesOnSameDay
}