

getAllTabs();
setActiveTab();



/**
 * Gets all tabs in
 */
function getAllTabs() {
    chrome.tabs.query({}, function(tabs) {
        console.log(tabs);
        createList(tabs);

    });

    setActiveTab();
}

/**
 * Creates the tab list and adds them to popup.html
 * @param ls    An array of Tab objects
 */

function createList(ls) {

    var tabsList = groupUrls(ls);


    for (var key in tabsList) {
        var ul = document.createElement("ul");
        var textUl = document.createTextNode(key);
        ul.appendChild(textUl);

        ul.setAttribute("class", "domains");

        for (var idx in tabsList[key]) {
            var node = document.createElement("LI");
            var text = document.createTextNode(tabsList[key][idx].title);
            node.appendChild(text);

            // For use in switchTab
            node.setAttribute("id", tabsList[key][idx].id);
            node.setAttribute("windowId", tabsList[key][idx].windowId);

            node.setAttribute("class", "tabs");

            node.addEventListener("click", switchTabs);

            ul.appendChild(node);
        }

        document.getElementById("tabList").appendChild(ul);
    }

}

/**
 * GroupUrls groups tabs in the given tabs array by their domain.
 *
 * e.g.: [tab(drive.google.com/a), tab(drive.google.com/b), tab(stackoverflow.com/c)]
 * would become {"drive.google.com": [tab(drive.google.com/a), tab(drive.google.com/b)],
 *               "stackoverflow.com": tab(stackoverflow.com/c)}
 *
 * @param tabs  An array of Tabs
 * @return      A dictionary of arrays containing tabs
 */

function groupUrls(tabs) {
    var domain_dict = {};

    for (var idx in tabs) {
        let url = new URL(tabs[idx].url);

        if (domain_dict[url.hostname] === undefined) {

            if (url.href.includes("chrome://")) {
                domain_dict["chrome://"] = [tabs[idx]];
            } else {
                domain_dict[url.hostname] = [tabs[idx]];
            }

        } else {

            if (url.href.includes("chrome://")) {
                domain_dict["chrome://"].push(tabs[idx]);
            } else {
                domain_dict[url.hostname].push(tabs[idx]);
            }
        }
    }

    return domain_dict;
}

/**
 * Switches tabs to the selected target
 * @param event event object representing the tab desired
 */
function switchTabs(event) {
    console.log(event.target);
    var targetId = parseInt(event.target.getAttribute("id"));
    var winId = parseInt(event.target.getAttribute("windowId"));

    chrome.windows.update(winId, {focused:true});
    chrome.tabs.update(targetId, {highlighted:true});

}

/**
 * Sets the active tab element in popup.html
 */
function setActiveTab() {
    chrome.windows.getCurrent(function (window) {
        chrome.tabs.query({
                active: true,
                windowId: window.id
            },
            function (tabs) {
                document.getElementById("activeTab").innerHTML = tabs[0].title;
            });
    });
}