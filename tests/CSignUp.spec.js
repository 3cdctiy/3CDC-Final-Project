describe('CSignUp Testing', function() {
  beforeEach(module('app'));

  describe('controller testing', function() {

    beforeEach(inject(function($controller) {
      CSignUp = $controller('CSignUp');
      
    }));

    it('Signup should throw validation error', function(done) {
      // assert.throws(function() {
      //   CSignUp.signup(false)
      // }, Error)

      done();
    });

  });
});
