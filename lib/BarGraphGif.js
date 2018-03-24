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
