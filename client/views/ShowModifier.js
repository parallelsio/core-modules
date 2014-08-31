// mitigates not being able to delete famous nodes from the RenderTree
// https://stackoverflow.com/questions/23087980/how-to-remove-nodes-from-the-render-tree
// RenderTree: https://famo.us/guides/render-tree
// from https://gist.github.com/markmarijnissen/13ba9224719fc0ab14b4
// WARNING: Adding/removing DOM-nodes by manipulating the renderspec might cause a performance penalty!

var Transform = require('famous/core/Transform');
 
function ShowModifier(options) {
  this.visible = !!options.visible;
  this._output = {
    transform: Transform.identity,
    opacity: 1,
    origin: null,
    align: null,
    size: null,
    target: null
  };
}
 
ShowModifier.prototype.modify = function(target){
  this._output.target = this.visible? target: null;
  return this._output;
};
 
ShowModifier.prototype.show = function show(){
  this.visible = true;
};
 
ShowModifier.prototype.hide = function hide() {
  this.visible = false;
};
 
module.exports = ShowModifier;