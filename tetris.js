let LEFT = 37
let UP = 38
let RIGHT = 39
let DOWN = 40
let SPACE = 32
let ESC = 27
let B = 66
let R = 82

/**
 * abcd 
 * efgh
 * ijkl
 * mnop
 */
class Piece {
  
  constructor( x, y, shapes, shapeIndex, color ) {
    this.x = x
    this.y = y
    this.color = color
    this.shapes = shapes
    this.shapeIndex = shapeIndex % this.shapes.length
    this.shape = this.shapes[ this.shapeIndex ]
    this.left = -1
    this.top = -1
    this.right = -1
    this.bottom = -1
    for( let i = 0; i < this.shape.length; i++ ) {
      let c = this.letter2coordinates( this.shape[ i ] )
      if( this.left == -1 || c.x < this.left ) {
        this.left = c.x
      }
      if( this.right == -1 || c.x > this.right ) {
        this.right = c.x
      }
      if( this.top == -1 || c.y < this.top ) {
        this.top = c.y
      }
      if( this.bottom == -1 || c.y > this.bottom ) {
        this.bottom = c.y
      }
    }
  }
  
  draw() {
    this.drawImpl( game.ctx, game.blocksize, this.x, this.y )
  }
  
  drawPreview() {
    this.drawImpl( game.ctxPreview, game.previewBlocksize, 0, 0 )
  }

  drawPieceKeeper() {
    this.drawImpl( game.ctxPieceKeeper, game.keeperBlocksize, 0, 0 )
  }

  drawImpl( ctx, blocksize, x, y ) {
    ctx.fillStyle = this.color
    for( let i = 0; i < this.shape.length; i++ ) {
      let c = this.letter2coordinates( this.shape[ i ] );
      ctx.fillRect( ( x + c.x ) * blocksize, 
        ( y + c.y ) * blocksize, blocksize, blocksize )
    }
  }

  /**
   * @returns Duplicate copy of piece
   */
  duplicate() {
    return this.move( 0, 9 )
  }

  /**
   * Create new piece which is x,y blocks removed from original
   * 
   * @param {*} x Move by x horizontally
   * @param {*} y Move by y vertically
   * @returns 
   */
  move( x, y ) {

    // game.sound1.start()
    // game.sound1.stop()
    // //game.sound1.stop( game.audio.currentTime + 2 )

    return new Piece( this.x + x, this.y + y, this.shapes, 
      this.shapeIndex, this.color )

  }

  rotate( ticks ) {
    return new Piece( this.x, this.y, this.shapes, 
      this.shapeIndex + ticks, this.color )
  }

  inPlayArea() {
    return this.x + this.left >= 0 
      && this.x + this.right < game.playFieldWidth
      && this.y + this.top >= 0
      && this.y + this.bottom < game.playFieldHeight
  }
  
  collision() {
    for( let i = 0; i < this.shape.length; i++ ) {
      let c = this.letter2coordinates( this.shape[ i ] )
      if( !game.playfield.isEmpty( this.x + c.x, this.y + c.y ) ) {
        return true
      }
    }
    return false
  }

  letter2coordinates( c ) {
    let num = c.charCodeAt(0) - 'a'.charCodeAt(0)
    let y = Math.floor( num / 4 )
    let x = num - y * 4
    return {
      x: x, y: y
    }
  }

  /**
   * Convert into dead stones at the bottom of the playfield
   */
  makeSediment() {
    for( let i = 0; i < this.shape.length; i++ ) {
      let c = this.letter2coordinates( this.shape[ i ] )
      game.playfield.addSediment( this.x + c.x, this.y + c.y, this.color )
    }
  }

  toString() {
    return this.x + ":" + this.y
  }

}

class Playfield {
  
  sediment = {}

  addSediment( x, y, color ) {
    this.sediment[ x + ':' + y ] = color
  }

  removeSediment( x, y ) {
    delete this.sediment[ x + ':' + y ]
  }

  isEmpty( x, y ) {
    return !this.getColor( x, y )
  }

  isRowFull( row ) {
    for( let i = 0; i < game.playFieldWidth; i++ ) {
      if( this.isEmpty( i, row ) ) {
        return false
      }
    }
    return true
  }

  removeRow( row ) {
    for( let r = row - 1; r > 0; r-- ) {
      for( let i = 0; i < game.playFieldWidth; i++ ) {
        this.addSediment( i, r + 1, this.getColor( i, r ) )
      }
    }
    for( let i = 0; i < game.playFieldWidth; i++ ) {
      this.removeSediment( i, 0 )
    }
  }

  explodeFullLines() {
    let count = 0
    let row = game.playFieldHeight - 1
    while( row >= 0 ) {
      if( this.isRowFull( row ) ) {
        this.removeRow( row )
        count++
      }
      else {
        row--
      }  
    }
    if( count == 4 ) {
      game.scoreCount += 100 * game.factor
    }
    else {
      game.scoreCount += ( count * 10 ) * game.factor
    }
    return count
  }

  getColor( x, y ) {
    return this.sediment[ x + ':' + y ]
  }

  draw() {
    for( let y = 0; y < game.playFieldHeight; y++ ) {
      for( let x = 0; x < game.playFieldWidth; x++ ) {
        let color = this.getColor( x, y )
        if( color ) {
          game.ctx.fillStyle = color;
          game.ctx.fillRect( x * game.blocksize, 
            y * game.blocksize, game.blocksize, game.blocksize );  
        }
      }
    }
    game.ctx.strokeStyle = 'red'
    game.ctx.beginPath()
    game.ctx.moveTo( 0, 4 * game.blocksize )
    game.ctx.lineTo( game.playFieldWidth * game.blocksize, 4 * game.blocksize )
    game.ctx.stroke()
  }

  toString() {
    let result = ""
    for( let y = 0; y < game.playFieldHeight; y++ ) {
      let line = ""
      for( let x = 0; x < game.playFieldWidth; x++ ) {
        let color = this.getColor( x, y )
        line += " " + ( color ? "x" : "_" )
      }
      result += "<br>" + line
    }
    return result
  }

}

function drawAll() {
  game.score.innerHTML = "Score: " + game.scoreCount
  game.ctx.fillStyle = 'white'
  game.ctx.fillRect( 0, 0, game.canvas.width, game.canvas.height )
  game.piece.draw()  
  game.playfield.draw()
}

function drawPreview() {
  game.ctxPreview.clearRect( 0, 0, game.canvas.width, game.canvas.height )
  if( game.nextPiece ) {
    game.nextPiece.drawPreview()  
  }
}

function drawPieceKeeper() {
  game.ctxPieceKeeper.clearRect( 0, 0, game.canvas.width, game.canvas.height )
  if( game.keepPiece ) {
    game.keepPiece.drawPieceKeeper()  
  }
}

function animate() {
  if( !game.over && !game.pause ) {
    game.timeout = setTimeout( move, game.speed )  
  }
}

function move() {

    let newPiece = game.piece.move( 0, 1 );
    if( newPiece.inPlayArea() && !newPiece.collision() ) {
      game.piece = newPiece
      requestAnimationFrame( animate )
      drawAll()
    }
    else {
      //game.debug.innerHTML = newPiece.x + "/" + newPiece.right
      game.scoreCount += game.factor
      requestAnimationFrame( animate )
      drawAll()
      game.piece.makeSediment()
      game.playfield.explodeFullLines()

      if( game.piece.y < 4 ) {
        drawAll()
        game.over = true
        game.status.innerHTML = "Game Over<br>Score:" + game.scoreCount 
        game.restart.style.display = "block"
    
      }
      else {
        addPiece()
      }

    }

}

function keypress( ev ) {
  if( ev.keyCode == R ) {
    if( game.timeout ) {
      clearTimeout( game.timeout )
      game.timeout = null
    }
    start()
    return
  }
  if( game.over ) {
    return
  }
  if( !game.over && ev.keyCode == ESC ) {
    game.pause = !game.pause
    if( game.pause ) {
      game.status.innerHTML = "Pause"
      if( game.timeout ) {
        clearTimeout( game.timeout )
        game.timeout = null
      }
      return
    }
    else {
      game.status.innerHTML = ""
      animate()
    }
  }
  if( game.pause ) {
    return
  }
  let x = 0, y = 0
  if( ev.keyCode == LEFT ) {
    x = -1
  }
  else if( ev.keyCode == RIGHT ) {
    x = 1
  }
  else if( ev.keyCode == UP ) {
    let newPiece = game.piece.rotate( 1 )
    while( newPiece.x + newPiece.left < 0 ) {
      newPiece = newPiece.move( 1, 0 )
    } 
    while( newPiece.x + newPiece.right >= game.playFieldWidth ) {
      newPiece = newPiece.move( -1, 0 )
    } 
    if( newPiece.inPlayArea() && !newPiece.collision() ) {
      game.piece = newPiece
      drawAll()
    }
    return
  }
  else if( ev.keyCode == SPACE ) {
    if( game.timeout ) {
      clearTimeout( game.timeout )
      game.timeout = null
    }
    let newPiece = game.piece.move( 0, 1 )
    let dropHeight = 0
    while( newPiece.inPlayArea() && !newPiece.collision() ) {
      game.piece = newPiece
      newPiece = game.piece.move( 0, 1 )
      dropHeight++
    }
    game.scoreCount += dropHeight
    drawAll()
    move()
    return
  }
  else if( ev.keyCode == DOWN ) {
    let newPiece = game.piece.move( 0, 1 )
    if( newPiece.inPlayArea() && !newPiece.collision() ) {
      game.piece = newPiece
      newPiece = game.piece.move( 0, 1 )
    }  
    drawAll()
    return
  }
  else if( ev.keyCode == B ) {
    if( game.switchCount == 0 ) {
      if( !game.keepPiece ) {
        game.keepPiece = game.piece
        game.keepPiece.x = 0
        game.keepPiece.y = 0
        game.piece = game.nextPiece
        if( game.piece.collision() ) {
          game.piece = game.piece.move( 0, -1 )
        }  
      }
      else {
        game.switchCount = 1
        let switchPiece = game.keepPiece
        switchPiece.x = game.piece.x
        switchPiece.y = game.piece.y
        game.keepPiece = game.piece
        game.keepPiece.x = 0
        game.keepPiece.y = 0
        game.piece = switchPiece
        if( game.piece.collision() ) {
          game.piece = game.piece.move( 0, -1 )
        }  
      }
      drawPieceKeeper()
      drawPreview()
      drawAll()
    }
    return
  }
  else {
    return
  }
  let newPiece = game.piece.move( x, 0 )
  if( newPiece.inPlayArea() && !newPiece.collision() ) {
    game.piece = newPiece
    drawAll()
  }
}

function makeRandomPiece() {
  let r = Math.floor( Math.random() * pieces.length )
  let piece = pieces[ r ]
  piece = piece.rotate( Math.floor( Math.random() * 4 ) )
  let position = Math.floor( Math.random() * game.playFieldWidth )
  piece = moveToXPosition( piece, position )
  //game.debug.innerHTML = piece.x + "/" + piece.right
  while( piece.x + piece.right > 9 ) {
    piece = piece.move( -1, 0 )
  }
  return piece
}

/**
 * Calculate the moves (- left or + right) to move the piece to
 * the given position. Also do not move the piece out of the right
 * side of the playfield.
 * 
 */
function moveToXPosition( piece, position ) {

  let moves = position - ( piece.x + piece.left )
  if( piece.x + piece.right + moves >= game.playFieldWidth ) {
    let outsideOfField = ( piece.x + piece.right + moves ) - ( game.playFieldWidth - 1 )
    moves -= outsideOfField  
  }
  return piece.move( moves, 0 )

}

function addPiece() {
  game.pieceCount++
  game.switchCount = 0
  if( game.pieceCount % 30 == 0 && game.speed > 150 ) {
    game.speed *= 0.7
    game.factor++
  }
  game.level.innerHTML = "Level: " + game.factor
  //game.debug.innerHTML = game.pieceCount + " / " + game.speed + " / " + game.factor
  game.piece = game.nextPiece
  drawAll()
  game.nextPiece = makeRandomPiece()
  drawPreview()
}

/*
abcd 
efgh
ijkl
mnop
 */
let pieces = [
  new Piece( 0, 0, ['abef'], 0, '#a800a8' ), // square
  new Piece( 0, 0, ['efgh','cgko','efgh','bfjn'], 0, '#35b5ff' ), // I
  new Piece( 0, 0, ['bfjk','efgi','abfj','cefg'], 0, '#2e9599' ), // L
  new Piece( 0, 0, ['cgjk','aefg','bcfj','efgk'], 0, '#f36943' ), // reverse L
  new Piece( 0, 0, ['aefj','bcef'], 0, '#f72078' ), // S
  new Piece( 0, 0, ['befi','abfg'], 0, '#f7dc66' ), // Z
  new Piece( 0, 0, ['efgj','befj','befg','bfgj'], 0, '#3a579a' ) // T
]

let game = {}

function init() {
  game = {}
  game.playFieldWidth = 10
  game.playFieldHeight = 24
}

function start() {

  init()

  game.pause = false
  game.over = false
  game.status = ""
  game.scoreCount = 0
  game.pieceCount = 0
  game.factor = 1
  game.speed = 1000

  game.audio = new AudioContext()  
  game.sound1 = game.audio.createOscillator()
  game.gainNode = game.audio.createGain();
  game.gainNode.connect( game.audio.destination )
  game.gainNode.gain.linearRampToValueAtTime(0.0001, game.audio.currentTime + 1 )
  game.sound1.connect( game.gainNode );
  game.sound1.type = "sine"
  //game.sound1.connect( game.audio.destination )
  
  game.canvas = document.querySelector( '#playfield' )
  game.debug = document.querySelector( '#debug' )
  game.status = document.querySelector( '#status' )
  game.score = document.querySelector( '#score' )
  game.level = document.querySelector( '#level' )
  game.restart = document.querySelector( '#restart' )
  game.preview = document.querySelector( '#preview' )
  game.pieceKeeper  = document.querySelector( '#piecekeeper' )

  game.ctx = game.canvas.getContext( '2d' )
  game.ctxPreview = game.preview.getContext( '2d' )
  game.ctxPieceKeeper = game.pieceKeeper.getContext( '2d' )
  
  game.blocksize = game.canvas.width / game.playFieldWidth  
  game.previewBlocksize = Math.min( game.preview.width, game.preview.height ) / 4
  game.keeperBlocksize = Math.min( game.pieceKeeper.width, game.pieceKeeper.height ) / 4

  document.body.onkeydown = keypress
  game.canvas.onkeydown = keypress

  game.restart.style.display = "none"
  game.status.innerHTML = ""
  game.debug.innerHTML = ""
  
  game.playfield = new Playfield()
  game.piece
  game.nextPiece = makeRandomPiece()

  addPiece()
  animate()

}

