document.getElementById("search").addEventListener("submit", search);

function search(event) {
    chrome.tabs.query({}, function(tabs) {
        var searchTable = [];
        var query = event.target.value;
        var returnValue;

        // Create the search table
        for (tabIdx in tabs) {
            if (tabs[tabIdx].title.includes(query)) {
                searchTable.push({
                    "title": tabs[tabIdx].title,
                    "id": tabs[tabIdx].id,
                    "windowid": tabs[tabIdx].windowId })
            }
        }

        for (resultIdx in searchTable) {
            var div = document.createElement("div");
            div.setAttribute("class", "result");

            var tab = document.createElement("p");
            tab.innerHTML = searchTable[resultIdx]["title"];
            tab.setAttribute("class", "tabs");
            tab.setAttribute("tabid", searchTable[resultIdx]["id"]);
            tab.setAttribute("windowid", searchTable[resultIdx]["windowid"]);

            tab.addEventListener("click", switchTabs);

            var closeButton = document.createElement("span");
            closeButton.innerHTML("x");
            closeButton.setAttribute("class", "closeTab");
            closeButton.setAttribute("tabid", searchTable[resultIdx]["id"]);
            closeButton.addEventListener("click", closeTabs);

            div.appendChild(tab);
            div.appendChild(closeButton);

            document.getElementById("results").appendChild(div);

        }

    })
}