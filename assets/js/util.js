'use strict';

function getRandom (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function hexToRgb(hex, a = 0.5) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

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