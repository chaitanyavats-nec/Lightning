let xPosition = 200;
let yPosition = 200;
let timer;
let userInput = [];
let circleSize = 5;
let speed = 10;
let discharges = [];
var maxsteps = 30;
var effectSize = 400;
var stroke1 = 200;

function Discharge(pos, v0, childrenSpawnProbability) {
  this.v0 = v0;
  this.pos = [pos.copy()];
  this.children = [];
  this.childrenSpawnProbability = childrenSpawnProbability;

  this.update = function(stepi) {
    let p0 = this.pos[this.pos.length - 1];
    
    for (let i = 0; i < stepi; ++i) {
      let p1 = p0.copy().add(p5.Vector.mult(v0, 5));
      v0.add(p5.Vector.random2D().mult(0.44)).normalize();

      this.pos.push(p1);
      p0 = p1;
      
      let chSpawnProb = this.childrenSpawnProbability * (0.25 + 0.75 * this.pos.length / maxsteps);
      if (random(1) < chSpawnProb)
        this.children.push(new Discharge(p0.copy(), v0.copy(), chSpawnProb));
    }
    
    this.children.forEach(child => child.update(stepi));
  }
  
  this.draw = function() {
    for (let i = 1; i < this.pos.length; ++i) {
      let p0 = this.pos[i - 1];
      let p1 = this.pos[i];
      
      let u = p0.dist(center) / effectSize;
      strokeWeight(3 - 2 * u);
      line(p0.x, p0.y, p1.x, p1.y);
    }
    
    this.children.forEach(child => child.draw());
  }
  
  this.done = function() {
    return this.pos.length > maxsteps || this.pos[this.pos.length - 1].dist(center) > effectSize;
  }
}

function setup() {
  createCanvas(800, 700);
  center = createVector(width / 2, height / 2);
  noSmooth();
  strokeCap(SQUARE);
}

function keyTyped() {
  userInput.push(key);
}

function draw() {
  textSize(10);
  textAlign(LEFT, TOP);
  fill(220);
  let displayText = userInput.join('');
  text(displayText, 20, 20);
  ellipse(mouseX,mouseY, circleSize, circleSize);
  if (random(1) < 0.1){
    let c = createVector(mouseX,mouseY);
    discharges.push(new Discharge(c.copy(), p5.Vector.random2D(), 0.1));
  }
  
  discharges = discharges.filter(elem => !elem.done());

  for (let i = 0; i < discharges.length; ++i)
    discharges[i].update(8 - i % 4);
  
  background(0, 30);
  stroke(0,0,220,stroke1);
  
  discharges.forEach(discharge => discharge.draw());
}
