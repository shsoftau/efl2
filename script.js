document.addEventListener("DOMContentLoaded", () => {
    const dataBaseUrl = "https://www.footydatasheet.com/2024Fc7fb2ee9/leagues/standings/";
    const imageBaseUrl = "https://www.footydatasheet.com/team_logos/";

    // Define the columns to display with their custom display names, widths, and alignments
    const columnsToDisplay = [
        { csvName: "rank", displayName: "Rank", width: "10px", align: "center" },
        { csvName: "Logo", displayName: "Badge", width: "20px", align: "center" },
        { csvName: "team_name", displayName: "Team", width: "280px", align: "left" },
        { csvName: "all_played", displayName: "MP", width: "80px", align: "center" },
        { csvName: "all_win", displayName: "W", width: "80px", align: "center" },
        { csvName: "all_draw", displayName: "D", width: "80px", align: "center" },
        { csvName: "all_lose", displayName: "L", width: "80px", align: "center" },
        { csvName: "all_goals_for", displayName: "GF", width: "80px", align: "center" },
        { csvName: "all_goals_against", displayName: "GA", width: "80px", align: "center" },
        { csvName: "goalsDiff", displayName: "GD", width: "80px", align: "center" },
        { csvName: "points", displayName: "Points", width: "80px", align: "center" },
        { csvName: "form", displayName: "Last 5", width: "120px", align: "center" },
    ];

    fetch(dataBaseUrl + "new_ALL_standings_2024.csv?timestamp=" + Date.now())
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(csvContent => {
            const rows = parseCSV(csvContent);
            displayCSVData(rows);
        })
        .catch(error => {
            console.error("Error loading CSV file:", error);
            const errorMessage = document.createElement("p");
            errorMessage.textContent = "Failed to load CSV data. Please check the console for more details.";
            document.querySelector(".right-pane").appendChild(errorMessage);
        });

    function parseCSV(csvContent) {
        const rows = csvContent.trim().split("\n").map(row => row.split(","));
        return {
            headers: rows[0],
            data: rows.slice(1),
        };
    }

    function displayCSVData(rows) {
        const table = document.getElementById("dataTable");

        // Apply fixed layout style to the table
        table.style.tableLayout = "fixed";
        table.style.width = "auto"; // Remove forced max width setting
        table.style.overflow = "hidden";
        table.style.borderCollapse = "collapse"; // Ensure borders collapse

        const theadRow = table.querySelector("thead tr");
        const tbody = table.querySelector("tbody");

        // Freeze header pane
        table.querySelector("thead").style.position = "sticky";
        table.querySelector("thead").style.top = "0";
        table.querySelector("thead").style.zIndex = "1";
        table.querySelector("thead").style.backgroundColor = "#fff";

        // Map headers to their indices for easy lookup
        const headerIndexMap = rows.headers.reduce((acc, header, index) => {
            acc[header] = index;
            return acc;
        }, {});

        // Update table headers using the custom display names and styles
        theadRow.innerHTML = columnsToDisplay
            .map(column => `<th style="width: ${column.width}; text-align: ${column.align}; box-sizing: border-box; padding: 0; overflow: hidden; border-bottom: 1px solid #ccc;">${column.displayName}</th>`)
            .join("");

        // Update table body with cell styles
        tbody.innerHTML = rows.data
            .map(row => {
                return columnsToDisplay.map(column => {
                    if (column.csvName === "Logo") {
                        const teamId = row[headerIndexMap["team_id"]];
                        return `<td style="width: ${column.width}; text-align: ${column.align}; padding: 0; box-sizing: border-box; overflow: hidden; border-bottom: 1px solid #ccc;">
                                    <img src="${imageBaseUrl}${teamId}.png" alt="Badge" style="width: 20px; height: auto; display: block; margin: 0 auto;">
                                </td>`;
                    } else if (column.csvName === "form") {
                        const formValue = row[headerIndexMap[column.csvName]] || "";
                        const reversedForm = formValue.split("").reverse().join("");
                        return `<td style="width: ${column.width}; text-align: ${column.align}; overflow: hidden; box-sizing: border-box; border-bottom: 1px solid #ccc;">${reversedForm}</td>`;
                    } else {
                        return `<td style="width: ${column.width}; text-align: ${column.align}; overflow: hidden; box-sizing: border-box; border-bottom: 1px solid #ccc;">${row[headerIndexMap[column.csvName]] || ""}</td>`;
                    }
                }).join("");
            })
            .map(row => `<tr>${row}</tr>`)
            .join("");
    }
});
