let timeShiftSlider, scaleSlider, signalTypeCheckbox;
let signalType = 'sine'; // Default to sine wave

function setup() {
  createCanvas(800, 400);
  textSize(15);

  // Adjust positions to prevent overlap, increase y offset for each subsequent element
  let yOffset = height + 20;
  let yStep = 40; // Space between elements

  // Time Shift Slider and Label
  createP('Time Shift').position(10, yOffset);
  timeShiftSlider = createSlider(-100, 100, 0).position(160, yOffset + 10);
  yOffset += yStep;

  // Scale Slider and Label
  createP('Scale Factor').position(10, yOffset);
  scaleSlider = createSlider(0.1, 5, 1, 0.1).position(160, yOffset + 10);
  yOffset += yStep;

  // Signal Type Toggle (Sine/PWM)
  signalTypeCheckbox = createCheckbox('PWM Signal', false).position(10, yOffset);
  signalTypeCheckbox.changed(() => signalType = signalTypeCheckbox.checked() ? 'pwm' : 'sine');
}

function draw() {
  background(220);
  drawLabels(); // Function to draw static labels at the top

  // Update based on input
  const timeShift = timeShiftSlider.value();
  const scalingFactor = scaleSlider.value();

  drawSignal(0, 'Original Signal', color(0, 0, 255), 1, false); // Blue for original, not inverted
  drawSignal(timeShift, 'Modified Signal', color(255, 0, 0), scalingFactor, true); // Red for modified, inverted
}

function drawLabels() {
  fill(0);
  // Position labels away from the signal visualization area
  text('Original Signal (Blue)', 10, 20);
  text('Modified Signal (Red)', 10, 35);
}

// Function to draw the signal with updated handling for sine and PWM signals
function drawSignal(timeShift, label, signalColor, scalingFactor = 1, invert) {
  push(); // Start a new drawing state
  translate(0, height / 2);
  if (invert) {
    scale(1, -1); // Invert the signal vertically if required
  }
  stroke(signalColor);
  noFill();

  // Draw the selected signal type
  if (signalType === 'sine') {
    // Draw Sine Wave
    let prevX = 0;
    let prevY = 0;
    for (let x = 0; x < width; x++) {
      let t = (x + timeShift - width / 2) * 0.05;
      let y = sin(t * scalingFactor) * 50; // Simple sine wave
      line(prevX, prevY, x, y);
      prevX = x;
      prevY = y;
    }
  } else if (signalType === 'pwm') {
    // Draw PWM Signal
    for (let x = 0; x < width; x++) {
      let t = (x + timeShift - width / 2) * 0.05;
      let y = (sin(t * scalingFactor) > 0 ? 1 : -1) * 50; // PWM approximation
      let prevY = x > 0 ? (sin((x - 1 + timeShift - width / 2) * 0.05 * scalingFactor) > 0 ? 1 : -1) * 50 : y;
      line(x - 1, prevY, x, y);
    }
  }

  pop(); // Restore original drawing state
}
