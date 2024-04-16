function submitValues() {
    const dutyCycle = parseFloat(document.getElementById('dutyCycle').value);
    const inputVoltage = parseFloat(document.getElementById('inputVoltage').value);
    const frequencyValue = parseFloat(document.getElementById('frequencyValue').value); // Make sure you have this input in your HTML
    const frequencySuffix = parseFloat(document.getElementById('frequencySuffix').value);

    const inductorValue = parseFloat(document.getElementById('inductorValue').value);
    const inductorSuffix = parseFloat(document.getElementById('inductorSuffix').value);
    const inductance = inductorValue * inductorSuffix;

    const resistorValue = parseFloat(document.getElementById('resistorValue').value);
    const resistorSuffix = parseFloat(document.getElementById('resistorSuffix').value);
    const resistance = resistorValue * resistorSuffix;

    const capacitorValue = parseFloat(document.getElementById('capacitorValue').value);
    const capacitorSuffix = parseFloat(document.getElementById('capacitorSuffix').value);
    const capacitance = capacitorValue * capacitorSuffix;
    var explanations = document.querySelectorAll('.hidden');
    
    // Loop through all elements and remove the 'hidden' class
    explanations.forEach(function(element) {
        element.classList.remove('hidden');
    });
    
    // Convert frequency to Hz if needed
    const frequencyInHz = frequencyValue * frequencySuffix;
    const period = 1 / frequencyInHz; // Period of one cycle in seconds

    // Prepare data for plotting
    const timeValues = []; // Time values for the X axis
    const outputVoltageValues = []; // Output voltage values for the Y axis
    const switchVoltageValues = []; // Output voltage values for the Y axis
    const inductorVoltageValues = [];
    const diodeVoltageValues = []; // Output voltage values for the Y axis

    const rcrit=2*inductance*frequencyInHz/(1-dutyCycle)
    document.getElementById('rcrit').textContent="In this case, your critical resistance value would be: "+rcrit.toFixed(3)+"Ω";

    if (resistance>rcrit){
        console.log("DCM reached")
        DCM(dutyCycle,inputVoltage,inductance,resistance,capacitance,period,timeValues,outputVoltageValues,switchVoltageValues,inductorVoltageValues,diodeVoltageValues)
        document.querySelectorAll('.hidden-dcm').forEach(function(element) {
            element.classList.remove('hidden-dcm');
        });
        
    }
    else{
        CCM(dutyCycle,inputVoltage,inductance,resistance,capacitance,period,timeValues,outputVoltageValues,switchVoltageValues,inductorVoltageValues,diodeVoltageValues)
        document.querySelectorAll('#dcm').forEach(function(element) {
            console.log("test")
            element.classList.add('hidden-dcm');
        });
    }
}

function DCM(dutyCycle,inputVoltage,inductance,resistance,capacitance,period,timeValues,outputVoltageValues,switchVoltageValues,inductorVoltageValues,diodeVoltageValues){
        // Populate timeValues and voltageValues for 3 cycles
    for (let t = 0; t <= 3 * period; t += period / 1000) {
        timeValues.push(t);
        const instantaneousVoltage = dutyCycle * inputVoltage; // Assuming constant output voltage for simplification
        outputVoltageValues.push(instantaneousVoltage);

        // Determine whether the switch is on or off using the duty cycle
        const switchIsOn = (t % period) <= (dutyCycle * period);

        // If the switch is on, the switch voltage is 0 and the inductor voltage is Vin - Vout
        if (switchIsOn) {
            switchVoltageValues.push(0);
            diodeVoltageValues.push(inputVoltage)

            inductorVoltageValues.push(inputVoltage - instantaneousVoltage);
        } else {
            // Once the switch is off, the switch voltage is Vin and the inductor voltage is -Vout
            // until the current reaches zero, at which point both voltages are 0
            switchVoltageValues.push(inputVoltage);
            diodeVoltageValues.push(0)

            inductorVoltageValues.push(-instantaneousVoltage);
        }
    }
    const { timeDivisor, suffix } = getTimeScale(timeValues);


    // Reset current for DCM calculations
    let inductorCurrentValues = [];
    let inputCurrentValues = [];
    let capacitorCurrentValues=[];
    let capacitorVoltageValues=[];

    let inductorcurrent = 0; // Start with an initial current of 0
    let capacitorVoltage = 0;
    const instantaneousVoltage = dutyCycle * inputVoltage; // Assuming constant output voltage for simplification

    for (let i = 1; i < inductorVoltageValues.length; i++) {
        // Calculate the area (voltage * time step)
        let inductorarea = inductorVoltageValues[i] * (timeValues[i] - timeValues[i - 1]);
        // Sum the area to the current (integral approximation)
        inductorcurrent += inductorarea / inductance




        // If the current drops to zero, we are in DCM and the switch voltage and inductor voltage should be adjusted
        if ((inductorcurrent-((inputVoltage-instantaneousVoltage)*dutyCycle*period/(inductance))/2+(instantaneousVoltage/resistance))<0){
            inductorCurrentValues.push(0)
            capacitorCurrentValues.push(-instantaneousVoltage/resistance)

            // When current is zero, the diode turns off, so the inductor voltage should be zero
            inductorVoltageValues[i - 1] = 0;
            switchVoltageValues[i-1] = inputVoltage-instantaneousVoltage;
            diodeVoltageValues[i-1]=instantaneousVoltage;
            // Adjust switch voltage if necessary, it might be zero if the current reaches zero when the switch is on
        } else {
            inductorCurrentValues.push(inductorcurrent-((inputVoltage-instantaneousVoltage)*dutyCycle*period/(inductance))/2+(instantaneousVoltage/resistance));
            capacitorCurrentValues.push(inductorcurrent-((inputVoltage-instantaneousVoltage)*dutyCycle*period/(inductance))/2)

            if((timeValues[i] % period) <= (dutyCycle * period)){
                inputCurrentValues.push(inductorcurrent-((inputVoltage-instantaneousVoltage)*dutyCycle*period/(inductance))/2+(instantaneousVoltage/resistance))
            } else{
                inputCurrentValues.push(0)
            }        
        }
    }
    for (let i = 1; i < capacitorCurrentValues.length; i++) {
        const instantaneousVoltage = dutyCycle * inputVoltage; // Assuming constant output voltage for simplification

        // Calculate the area (voltage * time step)
        let area = capacitorCurrentValues[i] * (timeValues[i] - timeValues[i - 1]);
        // Sum the area to the current (integral approximation)
        capacitorVoltage += area / capacitance
        // Store the current value
        capacitorVoltageValues.push(capacitorVoltage+instantaneousVoltage)

    }
    inductorVoltageValues.pop()
    switchVoltageValues.pop()
    diodeVoltageValues.pop()

    // Plot both the voltage and the current on the same chart
    plotRippleGraph('capacitorVoltageChart', timeValues, capacitorVoltageValues, 'Capacitor Voltage (V)','purple','Voltage (V)',0.9*dutyCycle*inputVoltage,1.1*dutyCycle*inputVoltage,{ timeDivisor, suffix });
    plotGraph('inputCurrentChart',timeValues,inputCurrentValues, 'Input Current (A)','black','Current (A)',{ timeDivisor, suffix })
    plotGraph('diodeVoltageChart',timeValues,diodeVoltageValues, 'Diode Voltage (V)','pink','Voltage (V)',{ timeDivisor, suffix })
    plotGraph('inductorCurrentChart',timeValues,inductorCurrentValues, 'Inductor Current (A)','orange','Current (A)',{ timeDivisor, suffix })
    plotGraph('outputVoltageChart', timeValues, outputVoltageValues, 'Output Voltage (V)','red','Voltage (V)',{ timeDivisor, suffix });
    plotGraph('inductorVoltageChart', timeValues, inductorVoltageValues, 'Inductor Voltage (V)','green','Voltage (V)',{ timeDivisor, suffix });
    plotGraph('switchVoltageChart', timeValues, switchVoltageValues, 'Switch Voltage (V)','blue','Voltage (V)',{ timeDivisor, suffix });
    plotGraph('capacitorCurrentChart',timeValues,capacitorCurrentValues, 'Capacitor Current (A)','yellow','Current (A)',{ timeDivisor, suffix })
}

function CCM(dutyCycle,inputVoltage,inductance,resistance,capacitance,period,timeValues,outputVoltageValues,switchVoltageValues,inductorVoltageValues,diodeVoltageValues){
    // Populate timeValues and voltageValues for 3 cycles
    for(let t = 0; (t <= 3 * period); t += period / 1000) {
        timeValues.push(t);
        const instantaneousVoltage = dutyCycle * inputVoltage; // Assuming constant output voltage for simplification
        outputVoltageValues.push(instantaneousVoltage);
    
        // Use modulo to find the position within the current period
        if((t % period) <= (dutyCycle * period)){
            switchVoltageValues.push(0); // Switch is ON
            diodeVoltageValues.push(inputVoltage)
            inductorVoltageValues.push(inputVoltage-instantaneousVoltage)
        } else{
            switchVoltageValues.push(inputVoltage); // Switch is OFF
            diodeVoltageValues.push(0);
            inductorVoltageValues.push(-1*instantaneousVoltage)
        }
    }
    const { timeDivisor, suffix } = getTimeScale(timeValues);


    let inductorCurrentValues = [];
    let inputCurrentValues = [];
    let capacitorCurrentValues=[];
    let capacitorVoltageValues=[];

    let inductorcurrent = 0; // Start with an initial current of 0
    let capacitorVoltage = 0;

    for (let i = 1; i < inductorVoltageValues.length; i++) {
        const instantaneousVoltage = dutyCycle * inputVoltage; // Assuming constant output voltage for simplification

        // Calculate the area (voltage * time step)
        let area = inductorVoltageValues[i] * (timeValues[i] - timeValues[i - 1]);
        // Sum the area to the current (integral approximation)
        inductorcurrent += area / inductance
        // Store the current value
        inductorCurrentValues.push(inductorcurrent-((inputVoltage-instantaneousVoltage)*dutyCycle*period/(inductance))/2+(instantaneousVoltage/resistance));
        capacitorCurrentValues.push(inductorcurrent-((inputVoltage-instantaneousVoltage)*dutyCycle*period/(inductance))/2)
        if((timeValues[i] % period) <= (dutyCycle * period)){
            inputCurrentValues.push(inductorcurrent-((inputVoltage-instantaneousVoltage)*dutyCycle*period/(inductance))/2+(instantaneousVoltage/resistance))
        } else{
            inputCurrentValues.push(0)
        }

    }

    for (let i = 1; i < capacitorCurrentValues.length; i++) {
        const instantaneousVoltage = dutyCycle * inputVoltage; // Assuming constant output voltage for simplification

        // Calculate the area (voltage * time step)
        let area = capacitorCurrentValues[i] * (timeValues[i] - timeValues[i - 1]);
        // Sum the area to the current (integral approximation)
        capacitorVoltage += area / capacitance
        // Store the current value
        capacitorVoltageValues.push(capacitorVoltage+instantaneousVoltage)

    }
    // Plot both the voltage and the current on the same chart
    plotRippleGraph('capacitorVoltageChart', timeValues, capacitorVoltageValues, 'Capacitor Voltage (V)','purple','Voltage (V)',0.9*dutyCycle*inputVoltage,1.1*dutyCycle*inputVoltage,{ timeDivisor, suffix });
    plotGraph('inputCurrentChart',timeValues,inputCurrentValues, 'Input Current (A)','black','Current (A)',{ timeDivisor, suffix })
    plotGraph('diodeVoltageChart',timeValues,diodeVoltageValues, 'Diode Voltage (V)','pink','Voltage (V)',{ timeDivisor, suffix })
    plotGraph('inductorCurrentChart',timeValues,inductorCurrentValues, 'Inductor Current (A)','orange','Current (A)',{ timeDivisor, suffix })
    plotGraph('outputVoltageChart', timeValues, outputVoltageValues, 'Output Voltage (V)','red','Voltage (V)',{ timeDivisor, suffix });
    plotGraph('inductorVoltageChart', timeValues, inductorVoltageValues, 'Inductor Voltage (V)','green','Voltage (V)',{ timeDivisor, suffix });
    plotGraph('switchVoltageChart', timeValues, switchVoltageValues, 'Switch Voltage (V)','blue','Voltage (V)',{ timeDivisor, suffix });
    plotGraph('capacitorCurrentChart',timeValues,capacitorCurrentValues, 'Capacitor Current (A)','yellow','Current (A)',{ timeDivisor, suffix })

}

function getTimeScale(timeValues) {
    // Find max time in seconds
    const maxTime = Math.max(...timeValues);
    let timeDivisor = 1; // Divisor to convert time to the right unit
    let suffix = 's'; // Default suffix for seconds
    
    // If the maximum time is less than 1ms, use microseconds
    if (maxTime < 1e-3) {
      timeDivisor = 1e-6;
      suffix = 'μs';
    } else if (maxTime < 1) { // If less than one second, use milliseconds
      timeDivisor = 1e-3;
      suffix = 'ms';
    }
    
    return { timeDivisor, suffix };
}

function plotGraph(canvasId, timeValues, values, label,color,quantity,{ timeDivisor, suffix }) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    if (window[canvasId] instanceof Chart) {
        window[canvasId].destroy(); // Destroy the old chart instance before creating a new one
    }
    
    // Create a new chart instance
    window[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeValues,
            datasets: [{
                label: label,
                data: values,
                borderColor: color,
                tension: 0.1,
                fill: false,
                pointRadius: 0, // Set this to 0 to remove the point markers
                borderWidth: 3 // Set this to a lower value to make the line thinner
            }]
        },
        options: {
            responsive: true, // Chart's canvas size will adjust to the container size
            maintainAspectRatio: true, // Maintains the aspect ratio set by the canvas size
            scales: {
                x: {
                    bounds: 'data',
                    type: 'linear',
                    position: 'bottom',
                    ticks: {
                      // Callback to format the tick labels
                      callback: function(value) {
                        return (value / timeDivisor).toFixed(1); // Convert to appropriate unit
                      }
                    },
                    title:{
                        display: true,
                        text: `Time (${suffix})`
                    }
                  },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: quantity
                    }
                }
            }
        }
    });
}

function plotRippleGraph(canvasId, timeValues, values, label,color,quantity,minlim,maxlim,{ timeDivisor, suffix }) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    if (window[canvasId] instanceof Chart) {
        window[canvasId].destroy(); // Destroy the old chart instance before creating a new one
    }
    
    // Create a new chart instance
    window[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeValues,
            datasets: [{
                label: label,
                data: values,
                borderColor: color,
                tension: 0.1,
                fill: false,
                pointRadius: 0, // Set this to 0 to remove the point markers
                borderWidth: 3 // Set this to a lower value to make the line thinner
            }]
        },
        options: {
            responsive: true, // Chart's canvas size will adjust to the container size
            maintainAspectRatio: true, // Maintains the aspect ratio set by the canvas size
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    ticks: {
                      // Callback to format the tick labels
                      callback: function(value) {
                        return (value / timeDivisor).toFixed(1); // Convert to appropriate unit
                      }
                    },
                    title:{
                        display: true,
                        text: `Time (${suffix})`
                    }
                  },
                y: [{
                    ticks: {
                        beginAtZero: false,
                        min: minlim,
                        max: maxlim,
                    },
                    title: {
                        display: true,
                        text: quantity
                    }
                }]
            }
        }
    });
}
