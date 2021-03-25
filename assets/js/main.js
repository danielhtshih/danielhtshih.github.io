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

function createIframe(list, id) {
  var iframe = document.createElement("iframe");
  iframe.setAttribute("src", list[id]);
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("style", "border:0;");
  iframe.setAttribute("allowfullscreen", "");

  return iframe;
}

function loadViewAndMap(id) {
  // As long as <outputs> has a child node, remove it
  let outputs = querySelector("#outputs", true);

  // create view node
  let view = document.createElement("div");
  view.setAttribute("class", "outputs-view");
  view.appendChild(createIframe(views, id));

  // create map node
  let map = document.createElement("div");
  map.setAttribute("class", "outputs-map");
  map.appendChild(createIframe(maps, id));

  outputs.appendChild(view);
  outputs.appendChild(document.createElement("p"));
  outputs.appendChild(map);
}

function loadIcons(total, current) {
  // desktop vs mobile
  let column = isMobile() ? 4 : 16;

  // As long as <inputs> has a child node, remove it
  let inputs = querySelector("#inputs", true);

  // load the latset view and map
  loadViewAndMap(current);

  // append "iframe_*" as icons
  for (let pos = 0; pos < column; pos++) { 
    if (current > 0) {
      let input = document.createElement("input");
      input.setAttribute("type", "image");
      input.setAttribute("class", "icon");
      input.setAttribute("alt", "");

      if (pos == 0 && total != current) {
        // previous page icon
        input.setAttribute("src", "/assets/img/left_arrow.jpg");
        // cehck if the previous page is the first page
        let prev = (current + column - 1) == total ? total : (current + column - 2);
        input.setAttribute("onclick", "loadIcons(" + total + "," + prev + ")")
      } else if (pos == (column - 1)) {
        // next page icon
        input.setAttribute("src", "/assets/img/right_arrow.jpg");
        input.setAttribute("onclick", "loadIcons(" + total + "," + current + ")")
      } else {
        // view icon
        input.setAttribute("src", "/assets/img/iframe_" + current + ".jpg");
        input.setAttribute("onclick", "loadViewAndMap(" + current + ")");
        current--;
      }

      inputs.appendChild(input);
      inputs.appendChild(document.createTextNode("\n"));
    }
  }
}