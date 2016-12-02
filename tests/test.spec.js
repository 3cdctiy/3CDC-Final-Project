describe('NYE513 App Testing', function() {
  beforeEach(module('app'));

  describe('What Were Testing', function() {                  // Replace

    beforeEach(inject(function($controller) {
      CSignUp = $controller('CSignUp');                       // Replace with required controller
      
    }));

    it('Expected test result statemnt', function(done) {      // Replace
      
      // Test Goes Here
      // Remove comments before finished!

      done();
    });

  });
});
