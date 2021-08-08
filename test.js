let test = new Test( 'Tetris' )

//test.run( 'testRandomPiecePosition' )
test.runAll()

test.showResults( 'output' )

function testRandomPieceFullArrayRange() {

  this.assertEqual( '(almost) highest random number should produce hightes array index', 
    pieces.length - 1, Math.floor( 0.999999 * pieces.length ) )

  this.assertEqual( 'lowest random number should produce lowest array index', 
    0, Math.floor( 0.000001 * pieces.length ) )

  }

function testRandomPiecePosition() {

  init()
  for( let i = 0; i < pieces.length; i++ ) {
    let piece = pieces[ i ]
    let copy = piece.duplicate()
    copy = moveToXPosition( copy, 0 )
    test.assertEqual( "Piece " + i + " Position 0", 0, copy.x + copy.left )
  }

}
