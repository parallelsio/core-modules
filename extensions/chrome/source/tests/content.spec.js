define(['Squire', 'browser', 'jquery'], function(Squire, browser, $) {

  var injector = new Squire();

  injector.mock('browser', browser);

  var Content;

  beforeEach(injector.run(['content/main'], function(content) {
    Content = content;
  }));

  describe('Clipper', function() {

    beforeEach(function() {
      $('#parallels-dialog-iframe-wrapper').remove();
      Content.loadClipperIframe($('body'));
    });

    // it('should animate open', function() {
    //   Content.showClipper();
    //   expect($('#parallels-dialog-iframe-wrapper').length).toEqual(1);
    // });

    // it('should animate closed', function() {
    //   Content.showClipper();
    //   Content.closeClipper();
    //   expect($('#parallels-dialog-iframe-wrapper').length).toEqual(1);
    // });

  });
});
