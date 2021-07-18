// Trilaxy Intro Animation

// configuration
let speed = 10
let starCount = 300
let background = 'black'

// internals
let canvas = document.querySelector( "#trilaxy" )
let ctx = canvas.getContext( '2d' )
let finished = false
//let story = 0

let waitForResize
let animationTimer
let center = {}
let trilaxy

// classes --------------------------------------

class Trilaxy {

  distance = 0

  constructor( x, y, size ) {
    this.x = x
    this.y = y
    this.size = size
    this.galaxies = []
    let width = Math.min( canvas.width, canvas.height ) / 4
    this.galaxies.push( new Galaxy( this, width, 0, 0, .005, '#ffec27', starCount ) )
    this.galaxies.push( new Galaxy( this, width, 0, Math.PI * 2 / 3, .005, '#f89cfa', starCount ) ) //#f89cfa
    this.galaxies.push( new Galaxy( this, width, 0, Math.PI * 2 / 3 * 2, .005, '#23b0bd', starCount ) )
  }

  animate() {
    this.distance += .1
    if( this.distance > this.size ) {
      this.distance = this.size
    }
    for( let i = 0; i < this.galaxies.length; i++ ) {
      this.galaxies[ i ].distance = this.distance
      this.galaxies[ i ].animate()
    } 
  }

  draw() {
    for( let i = 0; i < this.galaxies.length; i++ ) {
      this.galaxies[ i ].draw()
    } 
  }

}

class Galaxy {

  constructor( trilaxy, size, distance, radPosition, radSpeed, color, starCount ) {

    this.trilaxy = trilaxy
    this.size = size
    this.distance = distance
    this.radPosition = radPosition
    this.radSpeed = radSpeed
    this.color = color
    this.starCount = starCount

    this.stars = []

    for( let i = 0; i < this.starCount; i++ ) {
      let starSize = .1 + Math.random() * ( this.size / 60 )
      let radPosition = Math.random() * 2 * Math.PI
      let radSpeed = Math.random() * 0.01
      let distanceSpeed = Math.random() * ( this.size / 850 )
      let starColor = Math.random() < .2 ? 'white' : this.color
      this.stars.push(
        new Star( this, starSize, starColor, radPosition, 0, radSpeed, distanceSpeed )
      )
    }

  }

  animate() {
    this.radPosition -= this.radSpeed
    this.x = this.trilaxy.x + Math.sin( this.radPosition ) * this.distance
    this.y = this.trilaxy.y + Math.cos( this.radPosition ) * this.distance
    for( let i = 0; i < this.stars.length; i++ ) {
      let star = this.stars[ i ]
      star.animate()
    }
  }

  draw() {
    dot( this.x, this.y, this.size / 30, this.color )
    for( let i = 0; i < this.stars.length; i++ ) {
      let star = this.stars[ i ]
      star.draw()
    }
  }

}

class Star {

  constructor( galaxy, size, color, radPosition, distance, radSpeed, distanceSpeed ) {
    this.galaxy = galaxy
    this.size = size
    this.color = color
    this.radPosition = radPosition
    this.distance = distance
    this.radSpeed = radSpeed
    this.distanceSpeed = distanceSpeed
  }

  animate() {
    this.radPosition += this.radSpeed
    this.distance += this.distanceSpeed
    if( this.distance > this.galaxy.size ) {
      this.distance = 0
    }
  }

  draw() {
    let x = Math.sin( this.radPosition ) * this.distance
    let y = Math.cos( this.radPosition ) * this.distance
    dot( this.galaxy.x + x, this.galaxy.y + y, this.size, this.color )
  }

}

window.onresize = runDelayed

function runDelayed() {

  if( waitForResize ) {
    clearTimeout( waitForResize )
    waitForResize = null
  }

  resizeCanvas()
  waitForResize = setTimeout( startAnimation, 500 )

}

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  center.x = canvas.width / 2
  center.y = canvas.height / 2
}

function startAnimation() {
  resizeCanvas()
  trilaxy = new Trilaxy( center.x, center.y, Math.min( canvas.height, canvas.width ) / 4 )
  draw()
}

function draw() {

  ctx.fillStyle = background
  ctx.globalAlpha = .5
  ctx.fillRect( 0, 0, canvas.width, canvas.height )

  // dot( center.x, center.y, 10, 'white' )

  // story += .1
  // if( story > Math.PI * 2 ) {
  //   story = 0
  // }

  // dot( 
  //   center.x + Math.sin( story ) * 30, 
  //   center.y + Math.cos( story ) * 30, 
  //   3, 'red' )

  trilaxy.animate()
  trilaxy.draw()

  ctx.font = "30px Arial";
  ctx.fillStyle = 'white'
  ctx.fillText("Trilaxy Software", center.x - 100, center.y );

  if( animationTimer ) {
    clearTimeout( animationTimer )
    animationTimer = null
  }

  animationTimer = setTimeout( () => {
    requestAnimationFrame( draw )
  }, speed )

}

function dot( x, y, r, color ) {

  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc( x, y, r, 0, Math.PI * 2 )
  ctx.closePath()
  ctx.fill()

}

startAnimation()



