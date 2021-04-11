'use strict';

async function loadLogo(reset = false) {
  if (true) {
  //if (Math.random() < 0.5) {
    load2DLogo(reset);
  } else {
    load3DLogo(reset);
  }
}

async function load2DLogo(reset = false) {
  initCanvas(reset);

  let element = document.getElementById("logo");
  element.setAttribute("onclick", "loadLogo(true)");
  let context = element.getContext("2d");
  const height = element.height;
  const width = element.width;

  //newIcon(context, height, width, 1, 'azure', 'skyblue');
  newIcon(context,
          height,
          width,
          1,
          "#" + getRandom (100000, 999999) + "44",
          "#" + getRandom (100000, 999999) + "cc");
}

function load3DLogo(reset = false) {
  initCanvas(reset);

  let element = document.getElementById("logo");
  element.setAttribute("onclick", "loadLogo(true)");
  let ctx = element.getContext("2d");

  const width = element.width; // Width of the canvas
  const height = element.height; // Height of the canvas
  let rotation = 0; // Rotation of the globe
  let dots = []; // Every dots in an array

  const DOTS_AMOUNT = getRandom (100, 499); // Amount of dots on the screen
  const DOT_RADIUS = 4; // Radius of the dots
  let GLOBE_RADIUS = width / 2; // Radius of the globe
  let GLOBE_CENTER_Z = -GLOBE_RADIUS; // Z value of the globe center
  let PROJECTION_CENTER_X = width / 2; // X center of the canvas HTML
  let PROJECTION_CENTER_Y = height / 2; // Y center of the canvas HTML
  let FIELD_OF_VIEW = width * 0.8;

  class Dot {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
      
      this.xProject = 0;
      this.yProject = 0;
      this.sizeProjection = 0;
    }
    // Do some math to project the 3D position into the 2D canvas
    project(sin, cos) {
      const rotX = cos * this.x + sin * (this.z - GLOBE_CENTER_Z);
      const rotZ = -sin * this.x + cos * (this.z - GLOBE_CENTER_Z) + GLOBE_CENTER_Z;
      this.sizeProjection = FIELD_OF_VIEW / (FIELD_OF_VIEW - rotZ);
      this.xProject = (rotX * this.sizeProjection) + PROJECTION_CENTER_X;
      this.yProject = (this.y * this.sizeProjection) + PROJECTION_CENTER_Y;
    }
    // Draw the dot on the canvas
    draw(sin, cos) {
      this.project(sin, cos);
      // ctx.fillRect(this.xProject - DOT_RADIUS, this.yProject - DOT_RADIUS, DOT_RADIUS * 2 * this.sizeProjection, DOT_RADIUS * 2 * this.sizeProjection);
      if (Math.random() < 0.9999) {
        drawArc(ctx, this.xProject, this.yProject, DOT_RADIUS * this.sizeProjection, 0, Math.PI * 2, "skyblue");
      } else {
        drawStar(ctx, this.xProject, this.yProject, 4, 10, 2, 'yellow', 'white');
      }
    }
  }

  async function createDots(delay = 0) {
    // Empty the array of dots
    dots.length = 0;
    
    // Create a new dot based on the amount needed
    for (let i = 0; i < DOTS_AMOUNT; i++) {
      const theta = Math.random() * 2 * Math.PI; // Random value between [0, 2PI]
      const phi = Math.acos((Math.random() * 2) - 1); // Random value between [-1, 1]
      
      // Calculate the [x, y, z] coordinates of the dot along the globe
      const x = GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
      const y = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);
      const z = (GLOBE_RADIUS * Math.cos(phi)) + GLOBE_CENTER_Z;
      dots.push(new Dot(x, y, z));
      if (delay > 0) {
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }

  function render(a) {
    // Clear the scene
    ctx.clearRect(0, 0, width, height);
    
    // Increase the globe rotation
    rotation = a * 0.0004;
    
    const sineRotation = Math.sin(rotation); // Sine of the rotation
    const cosineRotation = Math.cos(rotation); // Cosine of the rotation
    
    // Loop through the dots array and draw every dot
    for (var i = 0; i < dots.length; i++) {
      dots[i].draw(sineRotation, cosineRotation);
    }

    window.requestAnimationFrame(render);
  }

  // Populate the dots array with random dots
  createDots(1);

  // Render the scene
  window.requestAnimationFrame(render);
}