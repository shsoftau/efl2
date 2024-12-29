document.addEventListener("DOMContentLoaded", () => {
    fetch("https://www.footydatasheet.com/2024Fc7fb2ee9/leagues/standings/new_ALL_standings_2024.csv?timestamp=" + Date.now()) // Ensure the file path matches the location of standings.csv
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(csvContent => {
            displayCSVData(csvContent);
        })
        .catch(error => {
            console.error("Error loading CSV file:", error);
            const errorMessage = document.createElement("p");
            errorMessage.textContent = "Failed to load CSV data. Please check the console for more details.";
            document.body.appendChild(errorMessage);
        });

    function displayCSVData(csvContent) {
        const rows = csvContent.trim().split("\n").map(row => row.split(","));
        const headerRow = rows[0];
        const dataRows = rows.slice(1);

        // Create table headers
        const table = document.getElementById("dataTable");
        const theadRow = table.querySelector("thead tr");
        theadRow.innerHTML = headerRow.map(header => `<th>${header}</th>`).join("");

        // Create table body
        const tbody = table.querySelector("tbody");
        tbody.innerHTML = dataRows
            .map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`)
            .join("");
    }
});
