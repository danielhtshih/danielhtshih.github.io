function filter(className, id) {
  var elements = document.querySelectorAll(className);
  Array.prototype.forEach.call(elements, function(element) {
    var view = element.querySelector(".resp-view");
    var map = element.querySelector(".resp-map");
    if ("0" === id) {
      view.style.display = "block";
      map.style.display = "none";
    }
    else if (element.id === id) {
      view.style.display = "block";
      map.style.display = "block";
    } else {
      view.style.display = "none";
      map.style.display = "none";
    }
  });
}

function addInputs(max, min) {
  // append "ALL" input image
  var all = document.createElement("input");
  all.setAttribute("type", "image");
  all.setAttribute("src", "/assets/img/all.jpg");
  all.setAttribute("class", "icon");
  all.setAttribute("alt", "");
  all.setAttribute("onclick", "filter('.resp', '0')");
  document.getElementById("inputs").appendChild(all);
  document.getElementById("inputs").appendChild(document.createTextNode("\n"));

  // append "iframe_*" input images
  for (; max >= min; max--)
  {
    var input = document.createElement("input");
    input.setAttribute("type", "image");
    input.setAttribute("src", "/assets/img/iframe_" + max + ".jpg");
    input.setAttribute("class", "icon");
    input.setAttribute("alt", "");
    input.setAttribute("onclick", "filter('.resp', '" + max + "')");
    document.getElementById("inputs").appendChild(input);
    document.getElementById("inputs").appendChild(document.createTextNode("\n"));
  }

  // reset the filter (hide the maps)
  filter(".resp", "0");
}