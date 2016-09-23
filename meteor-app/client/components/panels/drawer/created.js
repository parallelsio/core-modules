Template.drawer.onCreated(function () {

  var instance = this;
  // var data = instance.data;

	console.log('drawer created');

  // 2. Autorun
  // will re-run when the "limit" reactive variables changes
  instance.autorun(function () {

    var data = Template.currentData();
    var subscription = instance.subscribe('Drawer.bits');
  });

  // 3. assign cursor to an instance variable, so template can render it
  // can also do this in the helper
  // instance.drawerBitsNow = function() { 
  //   return Bits.find({}, { limit:  10 });
  // }

});



