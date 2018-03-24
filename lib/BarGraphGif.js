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
        this.initBars(data)
    }
    initBars(data) {
        if (data.length > 0) {
            this.bars = []
            const x_gap = (w * 0.9) / data.length
            var y_max = data.reduce((a,b) => a > b ? a : b)
            var x = 0
            for (var i = 0; i < data.length; i++) {
                const rectX = (x + x_gap/2)
                const rectH = h * 0.9 * (data/y_max)
                const rectY = h * 0.9 - rectH
                this.bars.push(new Bar(rectX, rectY, x_gap/3, rectH))
                x += x_gap
            }
        }
    }
    draw(context) {
        this.bars.forEach((bar) => {
            bar.draw(context,this.state.scale)
        })
    }
    update(stopcb) {
        this.state.update(stopcb)
    }
    startUpdating(startcb) {
        this.state.startUpdating(startcb)
    }
}
class Bar {
    constructor(x,y,w,h) {
        this.x = x
        this.y = y
        this.h = h
        this.w = w
    }
    draw(context, scale) {
        context.fillStyle = '#FFC107'
        context.fillRect(this.x - this.w/2, this.y+ this.h * (1 - scale), this.w, this.h * scale)
    }
}
class Renderer {
    constructor(data) {
        this.barGraph = new BarGraph(data)
        this.running = true
    }
    render(context, stopcb) {
        while (this.running) {
            this.barGraph.draw(context)
            this.barGraph.update(() => {
                this.running = false
                stopcb(context)
            })
        }
    }
}
