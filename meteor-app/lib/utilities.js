// use lodash instead of underscore
// https://github.com/meteor/meteor/issues/1009
_ = lodash;

Utilities = {



  // *************** BIT ****************
  // OQ: whats the diff between these 2?
  // When would I use each?
  getBitHtmlElement: function (bitDatabaseId){
    return $("[data-id='" + bitDatabaseId + "']");
  },

  getBitDataId: function (bitHtmlElement){
    // TODO:
    // Improve so either an HTML element/node, or a jQuery obj works.
    // Greensock does this, look at source
    return $(bitHtmlElement).data('id');
  },

  getBitTemplate: function (bitId){
    var $bit = $("[data-id='" + bitId + "']");
    return Blaze.getView( _.first($bit) );
  },

  // Usually, we'd just use jQuery's .position method.
  // In situations where the element is display:none, we can use the transform 
  // property, which is set, to get the position 
  getTransformedPosition: function(element){
    var cssTransform = element.style["transform"];
    var pattern = /[,();]|(px)|(em)|(rem)|(translate)|(matrix)|(3d)/gi;

    // slice + dice the string with a regexp to remove everything except
    // for number values. Split the string into an array.
    var array = _.words(cssTransform.replace(pattern, ''));

    return { 
      top: array[0],
      left: array[1]
    };
  },

  /* 
      GENERAL 
  */ 
  getClass: function(object){
    // http://phpjs.org/functions/getClass
    // http://kevin.vanzonneveld.net
    // +   original by: Ates Goral (http://magnetiq.com)
    // +   improved by: David James
    // +   improved by: David Neilsen

    // *     example 1: getClass(new (function MyClass() {}));
    // *     returns 1: "MyClass"

    // *     example 2: getClass({});
    // *     returns 2: "Object"

    // *     example 3: getClass([]);
    // *     returns 3: false

    // *     example 4: getClass(42);
    // *     returns 4: false

    // *     example 5: getClass(window);
    // *     returns 5: false

    // *     example 6: getClass(function MyFunction() {});
    // *     returns 6: false
    if (object && typeof object === 'object' &&
        Object.prototype.toString.call(object) !== '[object Array]' &&
        object.constructor && object !== this.window)
    {

      var arr = object.constructor.toString().match(/function\s*(\w+)/);

      if (arr && arr.length === 2) {
        return arr[1];
      }
    }

    return false;
  },

  getRandomColor: function() {
    return 'rgb('
      + Math.floor(Math.random() * 255) + ','
      + Math.floor(Math.random() * 255) + ','
      + Math.floor(Math.random() * 255) + ')';
  },

  getViewportCenter: function(){
    return { 
      x: verge.viewportW() / 2,
      y: verge.viewportH() / 2
    }
  }

};
