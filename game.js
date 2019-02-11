'use strict'
var canvas, ctx, w, h,
          world, ship, input,
          planeShape, planeBody;

function normalizeAngle(angle) {
  angle = angle % (2*Math.PI);
  if(angle < 0){
    angle += (2*Math.PI);
  }
  return angle;
}

class Ship {

  constructor(world, ctx) {
    this.world = world;
    this.ctx = ctx;
    this.boxShape = new p2.Box({ width: 2, height: 1 });
    this.boxBody = new p2.Body({ mass: 1, position: [0,5], angularVelocity: 1 });
    this.boxBody.addShape(this.boxShape);
    this.world.addBody(this.boxBody);

    this.potShape = new p2.Circle({ radius: 1 });
    this.potBody = new p2.Body({ mass: 0.05, position: [3,5], density: 1 });
    this.potBody.addShape(this.potShape);
    this.world.addBody(this.potBody);

    this.distanceConstraint = new p2.DistanceConstraint(this.boxBody, this.potBody);
    this.distanceConstraint.setStiffness(0.5);
    this.world.addConstraint(this.distanceConstraint);
  }

  render(ctx) {
    var boxX = this.boxBody.position[0],
        boxY = this.boxBody.position[1];

    // draw ship
    ctx.beginPath();
    ctx.save();
    ctx.translate(boxX, boxY);        // Translate to the center of the box
    ctx.rotate(-this.boxBody.angle);  // Rotate to the box body frame
    ctx.rect(-this.boxShape.width/2, -this.boxShape.height/2, this.boxShape.width, this.boxShape.height);
    ctx.stroke();

    // left thruster
    let leftFire = this.thrustLeft ? ((this.thrustLeft / 5.5) + 0.1) * 0.3 : 0;
    ctx.strokeStyle = "#FF0000";
    ctx.beginPath();
    ctx.moveTo(-0.8, -0.5);
    ctx.lineTo(-0.8, -0.5 - leftFire);
    ctx.stroke();

    let rightFire = this.thrustRight ? ((this.thrustRight / 5.5) + 0.1) * 0.3 : 0;
    ctx.beginPath();
    ctx.moveTo(0.8, -0.5);
    ctx.lineTo(0.8, -0.5 - rightFire);
    ctx.stroke();

    ctx.restore();

    var potX = this.potBody.position[0],
        potY = this.potBody.position[1];
    this.ctx.beginPath();
    this.ctx.moveTo(boxX, boxY);
    this.ctx.lineTo(potX, potY);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(potX, potY, this.potShape.radius, 0, 2*Math.PI);
    this.ctx.stroke();
  }

  applyThrustLeft(thrust) {
    this.thrustLeft = thrust;
    let angle = this.boxBody.angle;
    if (angle) {
      angle = normalizeAngle(angle);
      let thrustX = Math.sin(angle) * thrust;
      let thrustY = Math.cos(angle) * thrust;
      this.boxBody.applyForce([thrustX, thrustY], [-1, 1]);
    }
  }

  applyThrustRight(thrust) {
    this.thrustRight = thrust;
    let angle = this.boxBody.angle;
    if (angle) {
      angle = normalizeAngle(angle);
      let thrustX = Math.sin(angle) * thrust;
      let thrustY = Math.cos(angle) * thrust;
      this.boxBody.applyForce([thrustX, thrustY], [1, 1]);
    }
  }
}


class Input {
  // constructor() {
  //   canvas.addEventListener('mousemove', event => {
  //         let bound = canvas.getBoundingClientRect();
  //         let x = event.clientX - bound.left - canvas.clientLeft;
  //         let y = event.clientY - bound.top - canvas.clientTop;

  //         // quantize position
  //         this.x = 4 + (x / canvas.width) * 4 - 2;
  //         this.y = 4 + -((y / canvas.height) * 4 - 2);
  //     });
  // }

  constructor() {
    this.decayDelay = 0;
    this.tickSize = 50;
    this.x = 0;
    this.y = 0;
    this.lastTimeX = Date.now();
    this.lastTimeY = Date.now();
    this.lastRead = Date.now();
    this.keys = { 'a': false, 's': false }
    this.increaseAmount = 0.1;
    this.decreaseAmount = 0.05;
    this.maxThrust = 5.5;

    window.addEventListener('keydown', event => {
      this.keys[event.key] = true;
    });

    window.addEventListener('keyup', event => {
      this.keys[event.key] = false;
    });
  }



      // this.lastTimeY = this.lastTimeY || now;
      // if (now - this.lastTimeY > this.tickSize) {
      //   this.y += 0.1;
      //   if (this.y > 5.0)
      //     this.y = 5.0;
      //   this.lastTimeY = now;
      // }
      // this.lastTimeX = this.lastTimeX || now;
      // if (now - this.lastTimeX > this.tickSize) {
      //   this.x += 0.1;
      //   if (this.x > 5.0)
      //     this.x = 5.0;
      //   this.lastTimeX = now;
      // }

  // get inputs() {
  //   return [this.x, this.y];
  // }

  get inputs() {
    let now = Date.now();
    let deltaTimeX = now - this.lastTimeX;
    let deltaTimeY = now - this.lastTimeY;
    let deltaTimeDecay = now - this.lastRead;

    if (this.keys['a'] && deltaTimeX > this.tickSize) {
      this.x += this.increaseAmount;
      if (this.x > this.maxThrust)
        this.x = this.maxThrust;
      this.lastTimeX = now;
    }
    else if (deltaTimeX > this.decayDelay && deltaTimeDecay > this.tickSize) {
      this.x -= this.decreaseAmount;
      if (this.x < 0)
        this.x = 0;
    }

    if (this.keys['s'] && deltaTimeY > this.tickSize) {
      this.y += this.increaseAmount;
      if (this.y > this.maxThrust)
        this.y = this.maxThrust;
      this.lastTimeY = now;
    }
    else if (deltaTimeY > this.decayDelay && deltaTimeDecay > this.tickSize) {
      this.y -= this.decreaseAmount;
      if (this.y < 0)
        this.y = 0;
    }

    if (deltaTimeDecay > this.tickSize)
      this.lastRead = now;

    return [this.x, this.y];
  }
}



init();
animate();

function init(){

  // Init canvas
  canvas = document.getElementById("canvas");
  w = canvas.width;
  h = canvas.height;

  ctx = canvas.getContext("2d");
  ctx.lineWidth = 0.05;

  input = new Input();

  // Init p2.js
  world = new p2.World();
  ship = new Ship(world, ctx);

  // Add a plane
  planeShape = new p2.Plane();
  planeBody = new p2.Body();
  planeBody.addShape(planeShape);
  world.addBody(planeBody);
}

function drawPlane() {
  var y = planeBody.position[1];
  ctx.moveTo(-w, y);
  ctx.lineTo( w, y);
  ctx.stroke();
}

function render() {
  // Clear the canvas
  ctx.clearRect(0,0,w,h);

  // Transform the canvas
  // Note that we need to flip the y axis since Canvas pixel coordinates
  // goes from top to bottom, while physics does the opposite.
  ctx.save();
  ctx.translate(w/2, h/2);  // Translate to the center
  ctx.scale(50, -50);       // Zoom in and flip y axis

  // Draw all bodies
  ship.render(ctx);
  drawPlane();

  // Restore transform
  ctx.restore();

  ctx.font = "20px Arial";
  ctx.fillText("ship angle: " + ship.boxBody.angle.toFixed(3), 700, 30);
  let force = ship.boxBody.force;
  ctx.fillText("force  X: " + force[0].toFixed(2), 10, 30);
  ctx.fillText("force  Y: " + force[1].toFixed(2), 10, 50);
  let thrust = input.inputs;
  ctx.fillText("thrust L: " + thrust[0].toFixed(2), 400, 30);
  ctx.fillText("thrust R: " + thrust[1].toFixed(2), 400, 50);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Move physics bodies forward in time
  world.step(1/60);

  var [x, y] = input.inputs;

  if ((x || x === 0) && (y || y === 0)) {
    ship.applyThrustLeft(x);
    ship.applyThrustRight(y);
  }

  // Render scene
  render();
}
