

getAllTabs();
setActiveTab();



/**
 * Gets all tabs in
 */
function getAllTabs() {
    chrome.tabs.query({}, function(tabs) {
        createList(tabs);
        console.log(tabs);
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
        // Create a div that is the section header for each domain
        var div = document.createElement("div");
        div.innerHTML = '<p class="domain">' + key + '</p>';
        div.setAttribute("class", "domains");

        for (var idx in tabsList[key]) {
            // Add p element under the top level div
            var node = document.createElement("p");

            // Add the title of the tab to the text of the p
            node.innerHTML = tabsList[key][idx].title;

            // Set attributes for CSS and switching and closing tabs
            node.setAttribute("tabid", tabsList[key][idx].id);
            node.setAttribute("windowId", tabsList[key][idx].windowId);
            node.setAttribute("class", "tabs");

            // Call switchTabs when clicked
            node.addEventListener("click", switchTabs);

            div.appendChild(node);

            // Create a fake button in a span element
            var closeButton = document.createElement("span");
            closeButton.innerHTML = "x";

            // Set attributes for CSS and closing a tab
            closeButton.setAttribute("class", "closeTab");
            closeButton.setAttribute("tabid", tabsList[key][idx].id);

            // Call closeTabs() when clicked
            closeButton.addEventListener("click", closeTabs);

            div.appendChild(closeButton);
        }

        document.getElementById("tabList").appendChild(div);
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

        if (url.href.includes("chrome://")) {

            if (domain_dict["chrome://"] === undefined) {
                domain_dict["chrome://"] = [tabs[idx]];
            } else {
                domain_dict["chrome://"].push(tabs[idx]);
            }
        } else if (domain_dict[url.hostname] === undefined) {

            domain_dict[url.hostname] = [tabs[idx]];

        } else {

            domain_dict[url.hostname].push(tabs[idx]);

        }
    }


    return domain_dict;
}

/**
 * Switches tabs to the selected target
 * @param event event object representing the tab desired
 */
function switchTabs(event) {
    event.preventDefault();

    var targetId = parseInt(event.target.getAttribute("tabid"));
    var winId = parseInt(event.target.getAttribute("windowId"));

    // Bring the selected window into focus
    chrome.windows.update(winId, {focused:true});

    // Switch to the selected tab
    chrome.tabs.update(targetId, {highlighted:true});
}


/**
 * Closes the corresponding tab to the closetab button
 * @param event
 */
function closeTabs(event) {
    event.preventDefault();
    var targetId = parseInt(event.target.getAttribute("tabid"));
  
    console.log(event.target.parentNode.childNodes);
    if (event.target.parentNode.childNodes.length === 3) {
        event.target.parentNode.remove();
        // Close the actual tab
        chrome.tabs.remove(targetId);
    } else {
        // Get the tab corresponding to this close tab button
        // the search query resolves to '.tabs[tabid="<targetId>"]', e.g. '.tabs[tabid="12"]'
        var removableHtml = document.querySelector('.tabs[tabid="' + targetId + '"]');



        // remove the html for the tab just closed
        removableHtml.parentNode.removeChild(removableHtml);


        // Remove the close tab button from html
        event.target.parentNode.removeChild(event.target);

        // Close the actual tab
        chrome.tabs.remove(targetId);
    }

}


/**
 * Sets the active tab element in popup.html
 */
function setActiveTab() {
    // Get current window, then get the active tab inside of it
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
