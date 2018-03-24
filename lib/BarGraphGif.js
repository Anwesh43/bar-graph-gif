const Canvas = require('canvas')
const Gifencoder = require('gifencoder')
const w = 500, h = 500
class BarGraphGif {
    constructor() {
        this.initCanvas()
        this.initEncoder()
    }
    initEncoder() {
        this.gifEncoder = new Gifencoder(w, h)
        this.gifEncoder.setQuality(100)
        this.gifEncoder.setInterval(50)
    }
    initCanvas() {
      this.canvas = new Canvas()
      this.canvas.width = w
      this.canvas.height = h
      this.context = this.canvas.getContext('2d')
    }
    create(fileName, data) {
        this.gifEncoder.createReadStream(require('fs').createWriteStream(fileName))
        this.gifEncoder.start()
    }
}
class State {
    constructor() {
        this.deg = 0
        this.scale = 0
    }
    update(stopcb) {
        this.deg += Math.PI/20
        this.scale = Math.sin(this.deg)
        if (this.deg > Math.PI) {
            this.scale = 0
            stopcb()
        }
    }
}
class BarGraph {
    constructor(data) {
        this.state = new State()
        this.data = data
        this.initXsYs(data)
    }
    initXsYs(data) {
        if (data.length > 0) {
            this.xs = []
            this.ys = []
            const x_gap = (w * 0.9) / data.length
            var y_max = data.reduce((a,b) => a > b ? a : b)
            var x = 0
            for (var i = 0; i < data.length; i++) {
                this.xs.push(x + x+gap/2)
                this.ys.push(h * 0.9 *(1 -  (data/y_max)))
                x += x_gap
            }
        }
    }
    draw(context) {

    }
}
