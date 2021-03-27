'use strict';

function isMobile() {
  return navigator.userAgent.match(/iPhone|Android/i);
}
  
function querySelector(selectors, reset = false) {
  let node = document.querySelector(selectors);
  if (reset) {
    while (node.hasChildNodes()) {  
      node.removeChild(node.firstChild);
    }
  }

  return node;
}