export default class Point {
  constructor(x, y, time, color, width, fill, type) {
    this.x = x
    this.y = y
    this.time = time || new Date().getTime()
    this.color = color
    this.width = width
    this.fill = fill
    this.type = type
  }

  velocityFrom(start) {
    return (this.time !== start.time) ? this.distanceTo(start) / (this.time - start.time) : 1    
  }

  distanceTo(start) {
    return Math.sqrt(Math.pow(this.x - start.x, 2) + Math.pow(this.y - start.y, 2))
  }
  
  equals(point) {
    return this.x === point.x && this.y === point.y && this.time === point.time
  }
}