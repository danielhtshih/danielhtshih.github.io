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