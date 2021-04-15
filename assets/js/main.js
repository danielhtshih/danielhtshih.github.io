'use strict';

var views = new Array(isMobile() ? 3 : 15);

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

function loadViews(description) {
  var graph = graphql("https://220-135-26-160.hinet-ip.hinet.net/graphql");
  graph(`query { views { icon view map location } }`
  )({
  }).then(function (response) {
    views = response.views;
    loadViewAndMap(getRandom(0, views.length-1));
    loadIcons(views.length);
    //document.getElementById("description").innerHTML = views.length + " " + description;
  }).catch(function (error) {
    console.log(error);
    loadViewAndMap(getRandom(0, views.length-1));
    loadIcons(views.length);
    //document.getElementById("description").innerHTML = 0 + " " + description;
  });
}

function loadViewAndMap(id) {
  // As long as <outputs> has a child node, remove it
  let outputs = querySelector("#outputs", true);
  let viewObj = views[id];

  if (viewObj) {
    // create view node
    let view = document.createElement("div");
    view.setAttribute("class", "outputs-view");
    view.appendChild(createIframe(viewObj.view));
    outputs.appendChild(view);
    outputs.appendChild(document.createElement("p"));

    // create map node
    let map = document.createElement("div");
    map.setAttribute("class", "outputs-map");
    map.appendChild(createIframe(viewObj.map));
    outputs.appendChild(map);
    outputs.appendChild(document.createElement("p"));
  }

  // create article node
  let title = document.createElement("div");
  title.setAttribute("id", "outputs-title");
  let article = document.createElement("div");
  article.setAttribute("id", "outputs-article");
  outputs.appendChild(title);
  outputs.appendChild(document.createElement("p"));
  outputs.appendChild(article);

  if (viewObj) {
    // create article
    loadArticle(viewObj.location);
  }
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
      input.width = 128;
      inputs.appendChild(input);
      inputs.appendChild(document.createTextNode("\n"));

      if (pos == 0 && total != current) {
        let canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        let context = canvas.getContext('2d');
        // previous page icon
        await drawLeftArrow(context, canvas.width*5/16, canvas.height/2).then(v => {
          input.setAttribute("src", canvas.toDataURL("image/png"));
          // cehck if the previous page is the first page
          let prev = (current + column - 1) == total ? total : (current + column - 2);
          input.setAttribute("onclick", "loadIcons(" + total + "," + prev + ")");
        });
      } else if (pos == (column - 1)) {
        let canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        let context = canvas.getContext('2d');
        // new page icon
        await drawRightArrow(context, canvas.width*5/8, canvas.height/2).then(v => {
          input.setAttribute("src", canvas.toDataURL("image/png"));
          input.setAttribute("onclick", "loadIcons(" + total + "," + current + ")")
        });
      } else {
        // view icon
        // placeholder of icon
        let viewObj = views[(current - 1)];
        let icon = viewObj ? viewObj.icon : null;
        let canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        let context = canvas.getContext('2d');
        await newIcon (context,
                 canvas.height,
                 canvas.width,
                 0,
                 "#" + md5(viewObj ? viewObj.view : getRandom (100000, 999999)).slice(-6) + "44",
                 "#" + md5(viewObj ? viewObj.map : getRandom (100000, 999999)).slice(-6) + "cc").then(v => {
          input.setAttribute("src", canvas.toDataURL("image/png"));
        });

        // reaplaced by actual icon; no await
        if (icon) {
          drawRectInCircle(icon.split("=")[0],
                           context,
                           canvas.width/2,
                           canvas.height/2,
                           canvas.width*3/4).then(v => {
            input.setAttribute("src", canvas.toDataURL("image/png"));
          });
        }

        input.setAttribute("onclick", "loadViewAndMap(" + (current-1) + ")");
        current--;
      }
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