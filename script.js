document.addEventListener("DOMContentLoaded", () => {
    const dataBaseUrl = "https://www.footydatasheet.com/2024Fc7fb2ee9/leagues/standings/";
    const imageBaseUrl = "https://www.footydatasheet.com/team_logos/";

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
        const theadRow = table.querySelector("thead tr");
        const tbody = table.querySelector("tbody");

        // Identify the index of the team_id column
        const teamIdIndex = rows.headers.indexOf("team_id");

        // Create new headers, excluding team_id and adding a Logo column
        const newHeaders = [...rows.headers];
        newHeaders.splice(teamIdIndex, 1); // Remove team_id
        newHeaders.push("Logo"); // Add Logo column

        // Update table headers
        theadRow.innerHTML = newHeaders.map(header => `<th>${header}</th>`).join("");

        // Update table body
        tbody.innerHTML = rows.data
            .map(row => {
                // Remove team_id and add logo image
                const teamId = row[teamIdIndex];
                row.splice(teamIdIndex, 1); // Remove team_id
                const logoCell = `<td><img src="${imageBaseUrl}${teamId}.png" alt="Logo" style="max-width: 20px; height: auto;"></td>`;
                return `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}${logoCell}</tr>`;
            })
            .join("");
    }
});
