let basis1, basis2;
let scalarSlider1, scalarSlider2;
let draggingBasis1 = false;
let draggingBasis2 = false;
let origin;

function setup() {
  createCanvas(600, 450);
  textSize(16);

  origin = createVector(50, 50); // Set the origin for drawing vectors

  // Initialize basis vectors with a starting position
  basis1 = createVector(120, 50);
  basis2 = createVector(50, 120);

  // Setup sliders for scalar multipliers
  scalarSlider1 = createSlider(0, 100, 50);
  scalarSlider1.position(width / 2 - 180, height - 35);
  scalarSlider2 = createSlider(0, 100, 50);
  scalarSlider2.position(width / 2 + 20, height - 35);
}

function draw() {
  background(255);

  // Handle dragging for basis vectors
  if (draggingBasis1) {
    basis1 = createVector(mouseX - origin.x, mouseY - origin.y);
  }
  if (draggingBasis2) {
    basis2 = createVector(mouseX - origin.x, mouseY - origin.y);
  }

  // Draw vectors from the updated origin
  translate(origin.x, origin.y);
  drawArrow(createVector(0, 0), basis1, 'red', 'Basis 1');
  drawArrow(createVector(0, 0), basis2, 'blue', 'Basis 2');
  let genericVector = p5.Vector.add(p5.Vector.mult(basis1, scalarSlider1.value() / 100), p5.Vector.mult(basis2, scalarSlider2.value() / 100));
  drawArrow(createVector(0, 0), genericVector, 'green', 'Generic Vector');

  resetMatrix(); // Reset transformation matrix for drawing UI elements

  // Draw slider labels
  drawSliderLabel(scalarSlider1.x + scalarSlider1.width / 2, height - 50, 'Multiplier for Basis 1: ' + scalarSlider1.value());
  drawSliderLabel(scalarSlider2.x + scalarSlider2.width / 2, height - 50, 'Multiplier for Basis 2: ' + scalarSlider2.value());
}

function mousePressed() {
  if (mouseX > origin.x + basis1.x - 10 && mouseX < origin.x + basis1.x + 10 &&
      mouseY > origin.y + basis1.y - 10 && mouseY < origin.y + basis1.y + 10) {
    draggingBasis1 = true;
  } else if (mouseX > origin.x + basis2.x - 10 && mouseX < origin.x + basis2.x + 10 &&
             mouseY > origin.y + basis2.y - 10 && mouseY < origin.y + basis2.y + 10) {
    draggingBasis2 = true;
  }
}

function mouseReleased() {
  // Stop dragging
  draggingBasis1 = false;
  draggingBasis2 = false;
}

function drawArrow(base, vec, myColor, label) {
  push();
  stroke(myColor);
  strokeWeight(2);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();

  // Label near the arrowhead
  fill(0);
  noStroke();
  textAlign(LEFT, BASELINE);
  text(label, vec.x + 10, vec.y - 5);
}

function drawSliderLabel(x, y, labelText) {
  push();
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  text(labelText, x, y);
  pop();
}
