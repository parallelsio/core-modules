mousetrap
====================

Mousetrap is a simple library for handling keyboard shortcuts in Javascript.

Find the original documentation at [http://craig.is/killing/mice](http://craig.is/killing/mice)  

====================
## Installation

First, install the mousetrap package from the command line, like so:

````js
mrt add mousetrap
````

Alternatively, if you'd like to bypass Atmosphere, and install directly from GitHub, you could update your application's smart.json file, like so:

````json
{
  "meteor": {
    "branch": "master"
  },
  "packages": {
    "mousetrap": {
      "git": "https://github.com/awatson1978/mousetrap.git"
    }
  }
}
````

====================
## Keyboard Bindings

```js
Meteor.startup(function(){
    Mousetrap.bind('4', function() { console.log('4'); });
    Mousetrap.bind("?", function() { console.log('show shortcuts!'); });
    Mousetrap.bind('esc', function() { console.log('escape'); }, 'keyup');

    // combinations
    Mousetrap.bind('command+shift+k', function() { console.log('command shift k'); });

    // map multiple combinations to the same callback
    Mousetrap.bind(['command+k', 'ctrl+k'], function() {
        console.log('command k or control k');

        // return false to prevent default browser behavior
        // and stop event from bubbling
        return false;
    });

    // gmail style sequences
    Mousetrap.bind('g i', function() { console.log('go to inbox'); });
    Mousetrap.bind('* a', function() { console.log('select all'); });

    // konami code!
    Mousetrap.bind('up up down down left right left right b a enter', function() {
        console.log('konami code');
    });
})
```
