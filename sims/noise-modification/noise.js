class Noise {
    constructor(context, width, height) {
        this.context = context;
        this.width = width;
        this.height = height;
    }

    addNoise(signalPoints, intensity = 0.5) {
        // Adjust the magnitude of noise based on the canvas height and intensity
        const magnitude = this.height * intensity;

        return signalPoints.map(point => {
            if (Math.random() < intensity) {
                // Apply noise by modifying the point's y value
                const noiseAmount = (Math.random() * 2 - 1) * magnitude;
                // Ensure the new y value stays within canvas boundaries
                const newY = Math.max(0, Math.min(this.height, point.y + noiseAmount));
                return { x: point.x, y: newY };
            }
            return point;
        });
    }
}


