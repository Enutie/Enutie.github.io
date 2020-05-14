export class CircleQueue {
  constructor (circles, parent) {
    this.circles = circles.concat().reverse()
    this.parent = parent
    this.updatePositions()
  }

  pop () {
    if (this.circles.length === 0) return
    var d = this.circles.pop()
    d.cx = 0
    d.cy = 0
    this.updatePositions()
  }

  push (circle) {
    this.circles.push(circle)
    this.updatePositions()
  }

  updatePositions () {
    var target
    if (this.parent.root) // parent is a bst, target the root 
    {
      target = this.parent.root
    }
    else 
    {
      target = this.parent
    }
    var offset
    if (!target) offset = { x: (this.circles.length * 100) - 200, y: 0 }
    else offset = { x: target.x - (this.circles.length * 100), y: target.y }

    this.circles.filter(d => !d.locked_to_tree).forEach((d, i) => { d.cx = (i * 100) + offset.x; d.cy = offset.y })
  }
}
