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

/**
 * Converts a string representation of a float to an actual float.
 * Assumes valid input.  We can catch invalid input by ensuring that
 * there are no other characters other than digits and a single decimal point.
 * @param str   The string to be converted
 */
function weeblyFloat(str) {
    // Remove all whitespace and then split by decimal point
    var arr = str.replace(/\s/g, "").split(".");

    var integers = arr[0];
    var decimals = arr[1];

    var intNumber = 0;
    var decNumber = 0;

    for (var intIdx = 0; intIdx < integers.length; intIdx += 1) {
        intNumber += integers.charAt(intIdx) * Math.pow(10, integers.length - intIdx - 1);
    }


    for (var decIdx = 0; decIdx < decimals.length; decIdx += 1) {
        decNumber += decimals.charAt(decIdx) * Math.pow(10, 0 - decIdx - 1);
    }


    return intNumber + decNumber;
}