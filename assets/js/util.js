'use strict';

function getRandom (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

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