(function () {
  'use strict';
  var expect = require('chai').expect;
  var page = require('webpage').create();
  var rootUrl = 'http://localhost:3000';
  withGame('Example', function () {
    expect(getText('#word')).to.equal('_______');
    page.evaluate(function () {
      $(document).ajaxComplete(window.callPhantom);
    });
    page.sendEvent('keydown', page.event.key.E);
    page.onCallback = verify(function () {
      expect(getText('#word')).to.equal('E_____E');
      expect(getText('#missedLetters')).to.be.empty;
      page.sendEvent('keydown', page.event.key.T);
      page.onCallback = verify(function () {
        expect(getText('#word')).to.equal('E_____E');
        expect(getText('#missedLetters')).to.equal('T');
        phantom.exit();
      });
    });
  });
  function withGame(word, callback) {}
  function getText(selector) {
    return page.evaluate(function (s) {
      return $(s).text();
    }, selector);
  }
  function verify(expectations) {
    return function () {
      try {
        expectations();
      } catch (e) {
        console.log('Test failed!');
        handleError(e.message);
      }
    };
  }
  function handleError(message) {
    console.log(message);
    phantom.exit(1);
  }
  phantom.onError = page.onError = handleError;
})();
