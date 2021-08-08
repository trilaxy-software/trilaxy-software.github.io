/**
 * Need explosions? Copy this code.
 * 
 */
class Explosion {

  particleCount = 250
  particleSpeedMin = .01
  particleSpeedMax = 1.3
  particleSizeMin = 0.3
  particleSizeMax = 2
  lifetime = 200
  randomColors = false
  fadeFactor = 2

  /**
   * @param ctx canvas 2d context
   * @param origin Origin of explosion. Should have x and y member and ...???
   */
  constructor( ctx, origin ) {
    this.ctx = ctx
    this.origin = origin
  }

  start() {
    this.particles = []
    let speedRange = this.particleSpeedMax - this.particleSpeedMin
    let sizeRange = this.particleSizeMax - this.particleSizeMin
    for( let i = 0; i < this.particleCount; i++ ) {
      let angle = Math.random() * Math.PI * 2
      let speed = this.particleSpeedMin + Math.random() * speedRange
      let size = this.particleSizeMin + Math.random() * sizeRange
      let color = 'white' 
      if( this.randomColors ) {
        color = randomColor()
      }
      let particle = new Particle( this.ctx, this.origin, angle, size, color, speed, this.lifetime, this.fadeFactor )
      this.particles.push( particle )
    }
  }

  animate() {
    this.particles.forEach( particle => particle.animate() )
  }

  draw() {
    this.particles.forEach( particle => particle.draw() )
  }

}

class Particle {

  constructor( ctx, origin, angle, size, color, speed, lifetime, fadeFactor ) {
    this.ctx = ctx
    this.origin = origin
    this.size = size
    this.color = color
    this.speed = speed
    this.lifetime = lifetime
    this.fadeFactor = fadeFactor
    this.sin = Math.sin( angle )
    this.cos = Math.cos( angle )
    this.pos = 0
    this.time = 0
    this.finished = false
  }

  animate() {
    if( this.time > this.lifetime ) {
      this.finished = true
    }
    else {
      this.x = this.origin.x + this.pos * this.sin
      this.y = this.origin.y + this.pos * this.cos
      this.pos += this.speed
      this.time++  
    }
  }

  draw() {
    if( !this.finished ) {
      let alpha = ( this.lifetime - this.time / this.fadeFactor ) / this.lifetime
      dot( this.ctx, this.x, this.y, this.size, this.color, alpha )
    }
  }

}

/**
 * A sample explosion origin which moves in a circle
 */
class CirclingOrigin {

  constructor( ctx, x0, y0, r, speed ) {
    this.ctx = ctx
    this.angle = 0
    this.x0 = x0
    this.y0 = y0
    this.r = r
    this.speed = speed
  }

  animate() {
    this.x = this.x0 + Math.sin( this.angle ) * this.r
    this.y = this.y0 + Math.cos( this.angle ) * this.r
    this.angle += this.speed
    if( !this.explosion ) {
      this.explosion = new Explosion( this.ctx, this )
      this.explosion.lifetime = 300
      this.explosion.randomColors = true
      this.explosion.fadeFactor = 2
      this.lifetime = this.explosion.lifetime
      this.explosion.start()
    }
    if( this.explosion ) {
      this.lifetime--
      if( this.lifetime == 0 ) {
        this.explosion = null
      }
      else {
        this.explosion.animate()
      }
    }
  }

  draw() {
    dot( ctx, this.x, this.y, 1, 'white' )
    if( this.explosion ) {
      this.explosion.draw()
    }
  }

}

function dot( ctx, x, y, r, color, alpha ) {

  ctx.globalAlpha = alpha
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc( x, y, r, 0, Math.PI * 2 )
  ctx.closePath()
  ctx.fill()

}


