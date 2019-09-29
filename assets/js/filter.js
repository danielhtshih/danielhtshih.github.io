function filter(className, id) {
  var elements = document.getElementsByClassName(className);
  Array.prototype.forEach.call(elements, function(element) {
    if (element.id === id) {
      element.style.display = "block";
    } else {
      element.style.display = "none";
    }
  });
}