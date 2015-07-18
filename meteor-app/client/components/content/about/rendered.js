Template.aboutContent.onRendered(function () {
  var template = this;

  var bit = Bits.findOne( { type: 'image' });
  var img = $(Utilities.getBitElement(bit._id)).find('img')
  img.css('width', '300px')

  template.waveInstance = Parallels.Animation.Image.waveSlice({
    $img: img,
    prependTo: ".wave-slice",
    replaceOriginalBit: false
  })

  // .shimmer in content, with X button
  // bindscape e

});
   