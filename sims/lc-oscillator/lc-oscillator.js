let LSlider, CSlider; // Sliders for L and C
let L = 0.001; // Initial inductance in Henries
let C = 0.000001; // Initial capacitance in Farads
let frequency; // Frequency in Hz

function setup() {
  createCanvas(400, 400); // Canvas size set to 400x400
  textSize(14); // Set text size
  
  // Create sliders for L and C
  LSlider = createSlider(1, 1000, L * 1000000); // L slider, values in microHenries for better granularity
  LSlider.position(10, 340);
  LSlider.style('width', '180px');
  
  CSlider = createSlider(1, 1000, C * 1000000000); // C slider, values in nanoFarads for better granularity
  CSlider.position(10, 360);
  CSlider.style('width', '180px');
  
  updateCircuitParameters(L, C); // Initialize with default L and C values
}

function draw() {
  background(220); // Clear background
  
  // Update L and C from sliders
  L = LSlider.value() / 1000000; // Convert back to Henries
  C = CSlider.value() / 1000000000; // Convert back to Farads
  
  updateCircuitParameters(L, C); // Update parameters based on slider values
  drawAxes(); // Draw the axes
  drawOscillation(frequency); // Draw oscillation based on the current frequency
  displayParameters(); // Display the values of L, C, and frequency
}

function calculateResonantFrequency(L, C) {
  // Resonant frequency formula for an LC circuit
  return 1 / (2 * Math.PI * Math.sqrt(L * C));
}

function updateCircuitParameters(L, C) {
  frequency = calculateResonantFrequency(L, C);
}

function drawOscillation(frequency) {
  let wavelength = width / (frequency * 10); // Adjust scale for visualization
  let amplitude = height / 4; // Adjusted amplitude for the new canvas size
  
  // Change graph color based on frequency
  if (frequency < 150000) { // Adjusted for higher frequency values
    stroke(255, 0, 0); // Red for lower frequencies
  } else if (frequency >= 150000 && frequency < 300000) { // Adjusted for higher frequency values
    stroke(0, 255, 0); // Green for mid-range frequencies
  } else {
    stroke(0, 0, 255); // Blue for higher frequencies
  }
  
  beginShape();
  noFill();
  for (let x = 0; x < width; x++) {
    let angle = TWO_PI * (x / wavelength);
    let y = height / 2 + amplitude * sin(angle);
    vertex(x, y);
  }
  endShape();
}

function displayParameters() {
  // Display the current values of L, C, and frequency with automatic scaling
  fill(0); // Set fill color for text to black
  noStroke(); // Ensure no stroke/outline for text
  
  let frequencyLabel;
  if (frequency >= 1e6) { // If frequency is in Megahertz range
    frequencyLabel = `Frequency: ${(frequency / 1e6).toFixed(2)} MHz`;
  } else if (frequency >= 1e3) { // If frequency is in Kilohertz range
    frequencyLabel = `Frequency: ${(frequency / 1e3).toFixed(2)} kHz`;
  } else { // Frequency in Hertz
    frequencyLabel = `Frequency: ${frequency.toFixed(2)} Hz`;
  }
  
  text(`L: ${(L * 1000000).toFixed(2)} µH`, 200, 345);
  text(`C: ${(C * 1000000000).toFixed(2)} nF`, 200, 365);
  text(frequencyLabel, 200, 385);
}

function drawAxes() {
  stroke(0); // Black color for axes
  strokeWeight(1);
  // Y-axis
  line(50, 0, 50, height - 20);
  // X-axis
  line(0, height / 2, width, height / 2);
  // Labels for axes
  fill(0);
  text('Time', width - 40, height / 2 + 20);
  text('Amplitude', 10, 20);
}
