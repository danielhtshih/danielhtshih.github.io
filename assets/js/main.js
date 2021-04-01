'use strict';

var views = [];

function test(views) {
  console.log(views[0]["view"]);
  console.log(views[0]["map"]);
}

function createIframe(element) {
  var iframe = document.createElement("iframe");
  iframe.setAttribute("src", element);
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("style", "border:0;");
  iframe.setAttribute("allowfullscreen", "");

  return iframe;
}

function loadViews() {
  var graph = graphql("https://220-135-26-160.hinet-ip.hinet.net/graphql");
  graph(`query { views { icon view map location } }`
  )({
  }).then(function (response) {
    views = response.views;
    loadViewAndMap(getRandom(0, response.views.length-1));
    loadIcons(response.views.length);
  }).catch(function (error) {
    console.log(error);
  });
}

function loadViewAndMap(id) {
  // As long as <outputs> has a child node, remove it
  let outputs = querySelector("#outputs", true);

  // create view node
  let view = document.createElement("div");
  view.setAttribute("class", "outputs-view");
  view.appendChild(createIframe(views[id].view));

  // create map node
  let map = document.createElement("div");
  map.setAttribute("class", "outputs-map");
  map.appendChild(createIframe(views[id].map));

  // create article node
  let title = document.createElement("div");
  title.setAttribute("id", "outputs-title");
  let article = document.createElement("div");
  article.setAttribute("id", "outputs-article");

  outputs.appendChild(view);
  outputs.appendChild(document.createElement("p"));
  outputs.appendChild(map);
  outputs.appendChild(document.createElement("p"));
  outputs.appendChild(title);
  outputs.appendChild(document.createElement("p"));
  outputs.appendChild(article);

  // create article
  loadArticle(views[id].location);
}

async function loadIcons(total, current = total) {
  // desktop vs mobile
  let column = isMobile() ? 4 : 16;

  // As long as <inputs> has a child node, remove it
  let inputs = querySelector("#inputs", true);

  // load the latset view and map
  //loadViewAndMap(getRandom(0, current-1));

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
        let icon = views[(current - 1)].icon;
        if (icon) {
          input.setAttribute("src", "/assets/img/" + icon);
        } else {
          let canvas = document.createElement('canvas');
          canvas.width = 128;
          canvas.height = 128;
          let context = canvas.getContext('2d');
          newIcon (context,
                   canvas.height,
                   canvas.width,
                   0,
                   "#" + md5(views[(current - 1)].view).slice(-6) + "44",
                   "#" + md5(views[(current - 1)].map).slice(-6) + "cc").then(v => {
            input.setAttribute("src", canvas.toDataURL("image/png"));
          });
        }
        input.setAttribute("onclick", "loadViewAndMap(" + (current-1) + ")");
        current--;
      }

      inputs.appendChild(input);
      inputs.appendChild(document.createTextNode("\n"));
    }
  }
}

function loadArticle(title) {
  let host = "https://en.wikipedia.org";
  // e.g. en-us
  //var userLang = navigator.language || navigator.userLanguage; 
  //$(window).on("load", function() {
  $(document).ready(function(){
    $.ajax({
        type: "GET",
        url: host + "/w/api.php?action=parse&format=json&prop=text&section=0&page=" + title + "&callback=?",
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {
            $('#outputs-title').html($('<div></div>').html($('<a href="' + host + '/wiki/' + title + '"></a>').html(data.parse.title)));
            var article = $('<div></div>').html(data.parse.text["*"]);
            $(article).find('a').each (function () {
              $(this).attr("href", host + $(this).attr('href'));
            });
            $('#outputs-article').html($(article).find('p'));
        },
        error: function (errorMessage) {
        }
    });
  });
}