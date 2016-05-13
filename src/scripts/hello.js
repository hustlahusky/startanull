module.exports = (function() {
  return {
    run: function() {
      console.log('Hello, world!');
    },

    err: function(err) {
      console.error(err || 'Some error');
    }
  };
})();
