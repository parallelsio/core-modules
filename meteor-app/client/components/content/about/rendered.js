Template.aboutContent.onRendered(function () {
  var template = this;
  var img = $("<img src='/images/ui/about-cropped.png' class='about__wave-slice-image' width='245px' height='230px'>");
  img.appendTo('body');

  Parallels.Keys.unbindActions();

  template.waveInstance = Parallels.Animation.Image.waveSlice({
    $img: $(img),
    prependTo: ".wave-slice",
    replaceBitOnCanvas: false
  })

  $('.about__wave-slice-image').remove();

  // .shimmer in content, with X button
  // bindscape e

  // template.mousetrap = new Mousetrap(template);
  //   mousetrap.bind('esc', function (event) {
  //   event.stopPropagation();
  // });

});

