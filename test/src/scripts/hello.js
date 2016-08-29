export default (() => {
  return {
    run: () => {
      console.log('Hello, world!');
    },

    err: (err) => {
      console.error(err || 'Some error');
    }
  };
})();
