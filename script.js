const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')

const GRAVITY_SCALE = 10
const ELASTIC_SCALE = 0.1 //탄성력
//탄성력: 0(완전탄성) ~ 1(완전흡수)

function fillCircle(pos, r, color) {
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.arc(pos.x, pos.y, r, Math.PI * 2, false);
    ctx.fill()
}

function numberMark(num) {
    if (num < 0) {
        return -1
    }
    return 1
}

class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    add(vector2) {
        this.x += vector2.x
        this.y += vector2.y
    }
    toString() {
        return `Vector(${this.x}, ${this.y})`
    }
    setVector(vector2) {
        this.x = vector2.x
        this.y = vector2.y
    }
}

class Ball {
    constructor(mass, pos, radius, vel, color) {
        this.mass = mass
        this.position = new Vector(pos[0], pos[1])
        this.radius = radius
        this.velocity = new Vector(vel[0], vel[1])
        this.color = color

        this.reachWall = [canvas.width - this.radius, canvas.height - this.radius]

        this.draw()
    }
    process() {
        this.draw()
        this.processReachWall()
        this.move()
        this.applyGravityForce()
    }
    draw() {
        fillCircle(this.position, this.radius, this.color)
    }
    move() {
        this.position.x += this.velocity.x * 0.01
        this.position.y += this.velocity.y * 0.01
    }
    processReachWall() {
        const pos = this.position
        let isReach = true

        if (this.reachWall[0] < pos.x) {
            this.position.x = this.reachWall[0]
        }
        else if (0 > pos.x) {
            this.position.x = 0
        }
        else {
            isReach = false
        }
        if(isReach){
            this.velocity.x -= this.velocity.x * ELASTIC_SCALE
            this.velocity.x *= -1
        }

        isReach = true;
        if (this.reachWall[1] < pos.y) {
            this.position.y = this.reachWall[1]
        }
        else if (0 > pos.y) {
            this.position.y = 0
        }
        else {
            isReach = false
        }
        if(isReach){
            this.velocity.y -= this.velocity.y * ELASTIC_SCALE
            this.velocity.y *= -1
        }
    }
    applyGravityForce() {
        this.velocity.y += GRAVITY_SCALE
    }
}

const Boxes = []
Boxes.push(new Ball(5, [100, 300], 25, [50, 20], "#DAB"))
Boxes.push(new Ball(15, [500, 300], 20, [-80, -700], "#0AB"))
let frame = 0

function render() {
    ctx.beginPath()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (var i = 0; i < Boxes.length; i++) {
        Boxes[i].process()
    }
}

function display() {
    render()
    requestAnimationFrame(display)
}

display()