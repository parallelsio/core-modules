describe('MapEvents', function() {

  describe('dblclick(.map)', function () {
    it('should insert a new Bit', function (done) {
      Meteor.setTimeout(function(){
        // SETUP
        spyOn(window.Bits, 'insert');

        // EXCECUTE
        var dblClickMap = Inverter.get('map.events')['dblclick .map'];
        var event = { target : $('<div class="map"></div>')[0] };
        dblClickMap(event);

        // VERIFY
        expect(window.Bits.insert).toHaveBeenCalled();
        done();
      }, 600);
    });
  });
});
