/**
 * A canvas with an an animation cycle:
 * 
 * - call animate() on all animated objects
 * - clear canvas
 * - draw all animated objects
 * - optionally adapt to browser full size
 * 
 */

class Animation {

  backgroundColor = 'white'
  frameMillis = 10
  animatedObjects = []
  running = true

  constructor( canvas ) {
    this.canvas = canvas
    this.ctx = canvas.getContext( '2d' )
    let me = this
    document.body.onkeydown = ev => { me.keypress( ev ) }
  }

  keypress( ev ) {
    if( ev.keyCode == 27 ) {
      this.running = !this.running
      if( this.running ) {
        this.animate()
      }
    }
  }

  /**
   * Expand canvas to size of browser
   */
  maximize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    document.body.style.margin = 0
  }

  setAutoMaximize( on ) {
    if( on ) {
      let me = this
      window.onresize = () => { me.maximize() }
      this.maximize()
    }
    else {
      window.onresize = null
    }
  }

  /**
   * Add animated object
   * 
   * @param {*} animatedObject Object which should implement animate and draw functions
   */
  add( animatedObject ) {
    this.animatedObjects.push( animatedObject )
  }

  start() {
    this.running = true
    this.animate()
  }

  stop() {
    this.running = false
  }

  animate() {
    if( !this.running ) {
      if( this.timer ) {
        clearTimeout( this.timer )
      }
    }
    else {
      this.animatedObjects.forEach( animatedObject => animatedObject.animate() )
      let me = this
      setTimeout( () => { me.draw() }, this.frameMillis )
    }
  }

  draw() {
    this.ctx.globalAlpha = 1
    this.ctx.fillStyle = this.backgroundColor
    this.ctx.fillRect( 0, 0, this.canvas.width, this.canvas.height )
    this.animatedObjects.forEach( animatedObject => animatedObject.draw() )
    this.animate()
  }

}

/**
 * An example for an animated object
 */
class Ball {

  constructor( canvas, x, y, r, sideSpeed, startSpeed, color ) {
    this.canvas = canvas
    this.x = x
    this.y = y
    this.r = r
    this.sideSpeed = sideSpeed
    this.color = color
    this.ctx = this.canvas.getContext( '2d' )
    this.fallSpeed = startSpeed
  }

  animate() {

    this.x += this.sideSpeed
    this.y += this.fallSpeed

    if( this.x - this.r <= 0 || this.x + this.r >= this.canvas.width ) {
      this.sideSpeed *= -1
    }

    if( this.fallSpeed > 0 ) {
      this.fallSpeed *= 1.05
      if( this.y + this.r >= this.canvas.height ) {
        this.fallSpeed *= -1
      }
    }
    else {
      this.fallSpeed *= 0.95
      if( this.y - this.r <= 0 || this.fallSpeed > -0.001 ) {
        this.fallSpeed = 0.5
      }
    }

  }

  draw() {
    this.ctx.fillStyle = this.color
    this.ctx.beginPath()
    this.ctx.arc( this.x, this.y, this.r, 0, Math.PI * 2 )
    this.ctx.closePath()
    this.ctx.fill()
  }

}

function randomColor() {
  return 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';
}
