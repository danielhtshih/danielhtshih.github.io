'use strict';

async function drawRadialGradientBackground(context, height, weight, diameter) {
  const grd = context.createRadialGradient(diameter/2, diameter/2, diameter/3, diameter/2, diameter/2, diameter);
  grd.addColorStop(0,"white");
  grd.addColorStop(1,"lightskyblue");
  context.fillStyle = grd;
  context.fillRect(0, 0, height, weight);
}
  
async function drawCheckeredBackground(context, height, weight, rows, cols, fillStyle = 'azure') {
  const cWeight = weight/cols;
  const cHeight = height/rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols / 2; col++) {
        context.rect(2 * col * cWeight + (row % 2 ? 0 : cWeight), row * cHeight, cWeight, cHeight);
    }
  }
  
  context.fillStyle = fillStyle;
  context.fill();
}

async function drawSphere(context, diameter, lines = 200, delay = 0, strokeStyle = 'skyblue') {
  let nextX = diameter/2;
  let nextY = diameter/2;
  for (let line = 0; line < lines; line++) {
    // random color
    //context.strokeStyle = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    context.strokeStyle = strokeStyle;
    context.beginPath();
    context.moveTo(nextX, nextY);
    let angle = getRandom(0, 360);
    nextX = diameter/3 * Math.cos(angle) + diameter/2;
    nextY = diameter/3 * Math.sin(angle) + diameter/2;
    context.lineTo(nextX, nextY);
    context.stroke();
    context.closePath();
    if (delay > 0) {
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

async function drawText(context, text, diameter, size) {
  context.font = size + "px Arial";
  context.fillStyle = 'white';
  context.textAlign = "center"; 
  context.fillText(text, diameter/2, diameter/2 + diameter/12);
  context.strokeText(text, diameter/2, diameter/2 + diameter/12);
}

async function drawStar(context, cx, cy, spikes, outerRadius, innerRadius, strokeStyle = 'yellow', fillStyle = 'white') {
  let rot = Math.PI / 2 * 3;
  const step = Math.PI / spikes;

  context.beginPath();
  context.moveTo(cx, cy - outerRadius);

  for (let spike = 0; spike < spikes; spike++) {
    for (const radius of [outerRadius, innerRadius]) {
      context.lineTo(cx + Math.cos(rot) * radius, cy + Math.sin(rot) * radius);
      rot += step;
    }
  }

  context.lineTo(cx, cy - outerRadius);
  context.closePath();

  context.lineWidth = 1;
  context.strokeStyle = strokeStyle;
  context.stroke();
  context.fillStyle = fillStyle;
  context.fill();
}

async function drawArc(context, cx, cy, radius, startAngle, endAngle, fillStyle) {
  context.fillStyle = fillStyle;
  context.beginPath();
  context.arc(cx, cy, radius, startAngle, endAngle);
  context.closePath();
  context.fill();
}

async function drawArrowhead (context, x, y, arrowHeight, arrowWidth, radians) {
  context.save();
  context.beginPath();
  context.translate(x, y);
  context.rotate(radians);
  context.moveTo(0, 0);
  context.lineTo(arrowHeight, arrowHeight);
  context.lineTo(arrowHeight, arrowHeight+arrowWidth);
  context.lineTo(0, arrowWidth);
  context.lineTo(-arrowHeight, arrowHeight+arrowWidth);
  context.lineTo(-arrowHeight, arrowHeight);
  context.closePath();
  context.restore();
  context.fill();
}

async function drawLeftArrow(context, x, y, strokeStyle = "black", fillStyle = "black", lineWidth = 1) {
  context.strokeStyle = strokeStyle;
  context.fillStyle = fillStyle;
  context.lineWidth = lineWidth;
  await drawArrowhead(context, x, y, 40, 15, -90 * Math.PI/180);
}

async function drawRightArrow(context, x, y, strokeStyle = "black", fillStyle = "black", lineWidth = 1) {
  context.strokeStyle = strokeStyle;
  context.fillStyle = fillStyle;
  context.lineWidth = lineWidth;
  await drawArrowhead(context, x, y, 40, 15, 90 * Math.PI/180);
}

async function initCanvas(reset = false) {
  let logos = querySelector("#logos", reset);
  if (!logos.hasChildNodes()) {
    const canvas = document.createElement('canvas');
    canvas.id = "logo";
    canvas.width = 270;
    canvas.height = 270;
    logos.appendChild(canvas);
  }
}

async function newIcon (context, height, width, delay = 0, backgroundStyle = 'azure', sphereStyle = 'skyblue') {
  //drawRadialGradientBackground(context, height, width, width).then(v => {
  await drawCheckeredBackground(context, height, width, 7, 7, backgroundStyle).then(v => {
    drawSphere(context, width, 200, delay, sphereStyle).then(v => {
      drawText(context, "", width, width/4).then(v => {
        for (let stars = 0; stars < 3; stars++) {
          drawStar(context, getRandom(width/3, width/3*2), getRandom(width/3, width/3*2), 4, width/9, width/54);
        }
      });
    });
  });
}

async function loadImage(url) {
  return new Promise (function (resolve, reject) {
      var img = new Image();
      img.setAttribute('crossorigin', 'anonymous'); 
      img.src = url;
      img.onload = function() {
        var dImage = document.createElement("canvas"); // create a drawable image
        dImage.width = img.naturalWidth;      // set the resolution
        dImage.height = img.naturalHeight;
        dImage.ctx = dImage.getContext("2d");   // get drawing API
                                                // and add to image
                                                // for possible later use
        dImage.ctx.scale(1, -1);
        dImage.ctx.drawImage(img, 0, 0, dImage.width, -dImage.height);
        img.replaceWith(dImage);
        resolve(dImage);
      };
      img.onerror = function() {
          reject("load error");
      };
  });
}

// draw the img inside the circle of center (cx,cy) between radius 
async function drawRectInCircle(img, ctx, cx, cy, radius) {
  await loadImage(img).then(function(img) {

    //ctx.drawImage(img, 0, 0);

    let step = 1 * Math.atan2(1, radius);
    let limit = 2 * Math.PI;

    ctx.save();
    ctx.translate(cx, cy);
    for (let angle = 0; angle < limit; angle += step) {
        ctx.save();
        ctx.rotate(angle);
        ctx.translate(0, 0);
        ctx.rotate(Math.PI / 2);
        let ratio = angle / limit;
        let x = ratio * img.width;
        ctx.drawImage(img, x, 0, 1, img.height, 0, 0, 1, radius);
        ctx.restore();
    }
    ctx.restore();
  });
}