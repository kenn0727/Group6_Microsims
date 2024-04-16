class Signal {
    constructor(context, width, height) {
        this.context = context;
        this.width = width;
        this.height = height;
    }

// In Signal class
generatePoints(bitRate) {
    const points = [];
    const step = this.width / bitRate; // Step size scales with canvas width
    let y = this.height / 2; // Starting in the middle, for example

    for (let x = 0; x <= this.width; x += step) {
        points.push({ x, y: y });
        // Toggle y value, keeping the signal's height consistent
        y = y === this.height / 2 ? 0 : this.height / 2;
    }

    return points;
}


    draw(points) {
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.beginPath();
        this.context.strokeStyle = 'blue';

        // Move to the first point
        if (points.length > 0) {
            this.context.moveTo(points[0].x, points[0].y);
        }

        // Draw lines between the points
        points.forEach(point => {
            this.context.lineTo(point.x, point.y);
        });

        this.context.stroke();
    }
}

