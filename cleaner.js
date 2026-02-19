chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF'
  });
});


const ig_home = 'https://www.instagram.com/';

const yt_link = 'https://www.youtube.com/';
// console.log("Running script on:", window.location.href);

// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith(ig_home) || tab.url.startsWith(yt_link)) {
    // We retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? 'OFF' : 'ON';

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState
    });

    if (nextState === 'ON') {
      // Insert the CSS file when the user turns the extension on

      await chrome.scripting.insertCSS({
        files: ['focused.css'],
        target: { tabId: tab.id }
      });

      // Execute the hideHomeButton function in the active tab
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: hideHomeButton
      });

    } else if (nextState === 'OFF') {
      // Remove the CSS file when the user turns the extension off
      await chrome.scripting.removeCSS({
        files: ['focused.css'],
        target: { tabId: tab.id }
      }); 

    


    }
  }
});


 function hideHomeButton() {
  // Note: Selectors like [aria-describedby] are fragile and change often on sites like IG.
  // Be sure this selector is correct for the current site version.
  const xpath = ["//a[@href='/' and contains(., 'HomeHome')]",
   "//a[@href='/explore/' and contains(., 'ExploreExplore')]", "//a[@href='/reels/' and contains(., 'ReelsReels')]"];
  const elements = [];
  
  xpath.forEach(xp => {
    const element = document.evaluate(xp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (element) {
      elements.push(element);
    }
  });
  
  elements.forEach(element => {
    element.style.display = 'none';
  });
}

function showHomeButton() {
  const homeButton = document.querySelector('[aria-describedby="_r_h0_"]');
  if (homeButton) {
    homeButton.style.display = ''; // Resets to default
  }
}
