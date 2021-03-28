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