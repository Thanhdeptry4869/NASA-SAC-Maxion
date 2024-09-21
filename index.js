const canvas = document.querySelector('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext('2d');

let circleArray = [];
const n = 500;
const g = 10;
const maxRadius = 50;
const minRadius = 5;

const mouse = {
    x: undefined,
    y: undefined
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
})

class circle{
    constructor() {
        this.dx = Math.random() * 1 - 0.5;
        this.dy = Math.random() * 1 - 0.5;
        this.minR = Math.floor(Math.random() * minRadius + 1);
        this.r = this.minR;
        this.x = Math.random() * (window.innerWidth - this.r) + this.r;
        this.y = Math.random() * (window.innerHeight - this.r) + this.r;
        this.strokeColor = this.getRandomHslColor();
        this.fillColor = this.getRandomHslColor();
    }

    getRandomHslColor() {
        const h = Math.floor(Math.random() * 360); // Random hue from 0 to 360
        const s = Math.floor(Math.random() * 100) + '%'; // Random saturation from 0% to 100%
        const l = Math.floor(Math.random() * 100) + '%'; // Random lightness from 0% to 100%
        return `hsl(${h}, ${s}, ${l})`; // Return the HSL color string
    }
    
    drawCircle() {
        c.beginPath();
        c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
        c.strokeStyle = this.strokeColor;
        c.lineWidth = 5;
        c.stroke();
        c.fillStyle = this.fillColor;
        c.fill();
    }

    collisionType() {
        if(this.x + this.r >= canvas.width) {
            return 'right';
        } else if(this.x - this.r <= 0) {
            return 'left';
        } else if(this.y + this.r >= canvas.height) {
            return 'bottom';
        } else if(this.y - this.r <= 0) {
            return 'top';
        } else {
            return null;
        }
    }

    collisionAct(type) {
        switch (type) {
            case 'right':
                this.dx = -Math.abs(this.dx); // Reverse the x velocity to the left
                break;
            case 'left':
                this.dx = Math.abs(this.dx); // Reverse the x velocity to the right
                break;
            case 'bottom':
                this.dy = -Math.abs(this.dy); // Reverse the y velocity upwards
                this.y = canvas.height - this.r;
                break;
            case 'top':
                this.dy = Math.abs(this.dy); // Reverse the y velocity downwards
                break;
        }
    }

    interacting() {
        if(Math.abs(mouse.x - this.x) < maxRadius && Math.abs(mouse.y - this.y) < maxRadius && this.r < maxRadius) {
            this.r += 1;
        } else if(this.r > this.minR) {
            this.r -= 1;
        }
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.drawCircle();
        this.collisionAct(this.collisionType());
        this.interacting();
    }
}

for(let i = 0; i < n; i++) {
    circleArray.push(new circle);
}

function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height);

    for(const circle of circleArray) {
        circle.update();
    }

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
