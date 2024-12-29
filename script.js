document.addEventListener("DOMContentLoaded", () => {
    const leagueFilter = document.createElement("select");
    leagueFilter.id = "leagueFilter";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select a League";
    leagueFilter.appendChild(defaultOption);
    document.body.insertBefore(leagueFilter, document.body.firstChild);

    fetch("https://www.footydatasheet.com/2024Fc7fb2ee9/leagues/standings/new_ALL_standings_2024.csv?timestamp=" + Date.now())
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(csvContent => {
            const rows = parseCSV(csvContent);
            populateDropdown(rows);
            displayCSVData(rows);
        })
        .catch(error => {
            console.error("Error loading CSV file:", error);
            const errorMessage = document.createElement("p");
            errorMessage.textContent = "Failed to load CSV data. Please check the console for more details.";
            document.body.appendChild(errorMessage);
        });

    function parseCSV(csvContent) {
        const rows = csvContent.trim().split("\n").map(row => row.split(","));
        return {
            headers: rows[0],
            data: rows.slice(1),
        };
    }

    function populateDropdown(rows) {
        const leagueIndex = rows.headers.indexOf("league");
        if (leagueIndex === -1) {
            console.error("The 'league' column is not found in the CSV data.");
            return;
        }

        const uniqueLeagues = [...new Set(rows.data.map(row => row[leagueIndex]))];
        const dropdown = document.getElementById("leagueFilter");

        uniqueLeagues.forEach(league => {
            const option = document.createElement("option");
            option.value = league;
            option.textContent = league;
            dropdown.appendChild(option);
        });

        // Add event listener to filter data on selection
        dropdown.addEventListener("change", () => {
            const selectedLeague = dropdown.value;
            const filteredData = selectedLeague
                ? rows.data.filter(row => row[leagueIndex] === selectedLeague)
                : rows.data;
            displayCSVData({ headers: rows.headers, data: filteredData });
        });
    }

    function displayCSVData(rows) {
        const table = document.getElementById("dataTable");
        const theadRow = table.querySelector("thead tr");
        const tbody = table.querySelector("tbody");

        // Create table headers
        theadRow.innerHTML = rows.headers.map(header => `<th>${header}</th>`).join("");

        // Create table body
        tbody.innerHTML = rows.data
            .map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`)
            .join("");
    }
});
