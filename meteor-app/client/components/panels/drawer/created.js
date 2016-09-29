Template.drawer.onCreated(function () {

  var instance = this;
  // var data = instance.data;

	console.log('drawer created');

  // instance.bgColor = new ReactiveVar();
  // instance.bgColor.set('#333555');

  // 2. Autorun
  // // will re-run when the "limit" reactive variables changes
  instance.autorun(function() {
    // var data = Template.currentData();
    var subscription = instance.subscribe('Drawer.bits');

      // TODO: why doesnt this work?
      // Related?: https://github.com/meteor/meteor/issues/3194
      // https://stackoverflow.com/questions/34777586/template-subscriptionsready-disables-onrendered-functionality
    //   if (instance.subscriptionsReady()) {
    //     console.log('ready with drawer bits', $(".drawer-bits .bit"), " : ", $(".drawer-bits .bit").length);
    //     $(".drawer-bits .bit").show();
    // }
  });



  // instance.drawerBitsNow = new ReactiveVar();
  
  // 3. assign cursor to an instance variable, so template can render it
  // can also do this in the helper
  // instance.drawerBitsNow = function() { 
  //   return Bits.find( {}, { sort: { createdAt: -1 }, limit: 50 });
  // }



});



