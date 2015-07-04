var path = require('path');
var fs = require('fs');

module.exports = function () {
  this.World = require("../support/world.js").World;
  var image = 'mine_flow_times_square_orange_curves_2_0749.jpg';

  this.When(/^I drag an image file onto the map$/, function (callback) {
    var self = this;

    self.browser.get('http://' + process.env.PARALLELS_DOMAIN).
      then(function () {
        return self.browser.executeScript("window.seleniumUpload = window.$('<input/>').attr({id: 'seleniumUpload', type:'file'}).appendTo('body');");
      }).
      then(function () {
        var imagePath = path.resolve('./meteor-app/public/images/1000', image);
        return self.browser.findElement(self.webdriver.By.id("seleniumUpload")).sendKeys(imagePath);
      }).
      then(function () {
        self.browser.sleep(3000); // wait for animations to be done
        return self.browser.executeScript("e = $.Event('drop'); e.originalEvent = { clientX: 20, clientY: 20, target: {}, dataTransfer : { files : window.seleniumUpload.get(0).files } }; $('.map').trigger(e);");
      }).
      then(function() {
        self.browser.sleep(3000);
        callback();
      }).
      then(null, function(err) {
        callback.fail(err);
      });
  });

  this.Then(/^I should see a new image bit$/, function (callback) {
    this.browser.isElementPresent({ xpath: "//div[@data-filename='mine_flow_times_square_orange_curves_2_0749.jpg']" }).
      then(function (isPresent) {
        if (isPresent) {
          var uploadedImagePath = path.resolve('./test-scripts/.tmp', image);
          fs.unlink(uploadedImagePath, callback);
        }
        else {
          callback.fail('Failed to find the newly uploaded image on the canvas');
        }
      });
  });

};
