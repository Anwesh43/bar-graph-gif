const Canvas = require('canvas')
const Gifencoder = require('gifencoder')
const w = 500, h = 500, DELAY = 75
class BarGraphGif {
    constructor() {
        this.initCanvas()
        this.initEncoder()
    }
    initEncoder() {
        this.gifEncoder = new Gifencoder(w, h)
        this.gifEncoder.setQuality(100)
        this.gifEncoder.setDelay(DELAY)
        this.gifEncoder.setRepeat(0)
    }
    initCanvas() {
      this.canvas = new Canvas()
      this.canvas.width = w
      this.canvas.height = h
      this.context = this.canvas.getContext('2d')
    }
    create(fileName, data) {
        this.gifEncoder.start()
        this.gifEncoder.createReadStream().pipe(require('fs').createWriteStream(fileName))
        this.renderer = new Renderer(data)
        this.renderer.render(this.context, (context) => {
            this.gifEncoder.addFrame(context)
        },() => {
            this.gifEncoder.end()
        })
    }
}
class State {
    constructor() {
        this.deg = 0
        this.scale = 0
        this.k = 0
    }
    update(stopcb) {
        if(this.k == 0 || this.k == 10) {
            this.deg += Math.PI/20
        }
        if(this. deg >= Math.PI/2 && this.k < 10) {
            this.k++
        }
        this.scale = Math.sin(this.deg)
        console.log(this.scale)
        if (this.deg > Math.PI) {
            this.scale = 0
            stopcb()
        }
    }
}
class BarGraph {
    constructor(data) {
        this.state = new State()
        this.initBars(data)
    }
    initBars(data) {
        if (data.length > 0) {
            this.bars = []
            const x_gap = (w * 0.9) / data.length
            var y_max = data.reduce((a,b) => a > b ? a : b)
            console.log(y_max)
            var x = 0
            for (var i = 0; i < data.length; i++) {
                const rectX = (x + x_gap/2)
                const rectH = h * 0.9 * (data[i]/y_max)
                const rectY = h * 0.9 - rectH
                this.bars.push(new Bar(rectX, rectY, x_gap/2, rectH))
                x += x_gap
            }
            console.log(this.bars)
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
    render(context, updatecb, stopcb) {
        while (this.running) {
            context.fillStyle = '#212121'
            context.fillRect(0, 0, w, h)
            this.barGraph.draw(context)
            updatecb(context)
            this.barGraph.update(() => {
                this.running = false
                stopcb()
            })
        }
    }
}
const createBarGraphGif = (data,fileName) => {
    const barGraphGif = new BarGraphGif()
    barGraphGif.create(fileName,data)
}
module.exports = createBarGraphGif
