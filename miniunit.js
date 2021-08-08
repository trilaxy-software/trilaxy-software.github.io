// mini unit tests
class Test {

  logger

  constructor( title ) {
    this.logger = new Log()
    this.log( '<h1>' + title + '</h1>' )
    document.head.insertAdjacentHTML("beforeend", 
      `<style>.error{color:red} .ok{color:green}</style>`)
  }

  assertEqual( message, expected, found ) {
    if( found == expected ) {
      this.log( this.ok( 'OK: ' + message + " - Expected: " + expected 
      + " found " + found ) )
    }
    else {
      this.log( this.error( message + " - Expected: " + expected 
        + " but found " + found ) )
    }
  }

  ok( line ) {
    return '<span class="ok">' + line + '</span>'
  }

  error( line ) {
    return '<span class="error">' + line + '</span>'
  }

  /**
   * Run all tests: all method starting with 'test'
   */
  runAll() {
    for( let f in window ) {
      if( (''+f).startsWith( 'test' ) ) {
        this.run( f )
      }
    }
  }

  run( testName ) {
    this.log( '<h2>Running: ' + testName + '</h2>' )
    window[testName].call( this )
  }

  log( line ) {
    this.logger.log( line )
  }

  showResults( element ) {
    this.logger.printTo( 'output' )
  }

}

class Log {

  content = ''

  log( line ) {
    this.content += line + "<br>"
  }

  /**
   * @return Log content as string
   */
  get() {
    return this.content
  }

  /**
   * Show log content as innerHTML of an html element
   * 
   * @param {*} element Name of an html element to show log on
   */
  printTo( element ) {
    let el = element
    if( typeof element == 'string' ) {
      el = document.getElementById( element )
    }
    el.innerHTML = this.content
  }

}

