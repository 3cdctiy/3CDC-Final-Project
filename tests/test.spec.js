describe('ToDoosy Angular ToDo Web App Testing', function()
{
  beforeEach(module('app'));

  describe('CTask Testing', function()
  {
    var loginCtrl;

    beforeEach(inject(function($controller)
	{
      vm = $controller('CTask');
    }));

    it('Should return back whether the task filter is set to All, Current, or Completed', function()
	{
      vm.setTaskView().should.be.a('string');
    });

  });
});
