window.onload = function() {
    const canvas = document.getElementById('signal-canvas');
    const context = canvas.getContext('2d');
    const signal = new Signal(context, canvas.width, canvas.height);
    const noise = new Noise(context, canvas.width, canvas.height);

    const bitRateControl = document.getElementById('bit-rate');
    let currentBitRate = bitRateControl.value;
    let noiseEnabled = false;  // Correctly defining the noiseEnabled variable
  
    // Noise intensity control initialization
    const noiseIntensityControl = document.getElementById('noise-intensity');
    let currentNoiseIntensity = parseFloat(noiseIntensityControl.value);

    bitRateControl.addEventListener('change', () => {
        currentBitRate = bitRateControl.value;
        updateSignal();
    });
  
    // Event listener for noise intensity change
    noiseIntensityControl.addEventListener('input', () => {
        currentNoiseIntensity = parseFloat(noiseIntensityControl.value);
        updateSignal();
    });
  
    function updateSignal() {
        let signalPoints = signal.generatePoints(currentBitRate);

        // Always apply noise to the signal
        signalPoints = noise.addNoise(signalPoints, currentNoiseIntensity);

        signal.draw(signalPoints);  // Draw the signal with noise
    }

    function updateNoise() {
        if (noiseEnabled) {
            updateSignal();  // Redraw signal with noise
        } else {
            signal.draw(currentBitRate);  // Redraw signal without noise
        }
    }

    updateSignal(); // Initialize signal without noise
};

