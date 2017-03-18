describe('Home', function () {

  beforeEach(function () {
    browser.get('/');
  });

  it('should have <ow-home>', function () {
    var home = element(by.css('ow-app ow-home'));
    expect(home.isPresent()).toEqual(true);
    expect(home.getText()).toEqual("Home Works!");
  });

});
