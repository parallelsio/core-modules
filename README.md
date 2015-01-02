### [Parallels](http://parallels.io) : A free + open source platform for creating, connecting + sharing documents as networks of ideas. 

The project consists of 2 main components which need to run side by side, included in this repository:
   

/core-meteor-app 
---
The web application: a digital canvas where documents are created + remixed. Based on the [Meteor JS](http://www.meteor.com) platform

      

/extensions/chrome
---
A Chrome extension for easily tagging + saving browser content found on the web, to your Parallels canvas

[![Build Status](https://travis-ci.org/parallelsio/chrome-clipper.svg?branch=master)](https://travis-ci.org/parallelsio/chrome-clipper)

---  
#### Notes
 
* This is an alpha version, a proof of concept. It is incomplete, with bugs and continuously changing code, design + features
* It currently only works locally (on your computer) - the extension is not yet published to the Extension Store, and the web app is not yet hosted as a service. This means all of the data you create while running this stays private to you.

---  
## Supported Dependencies + Requirements

* OSX / Linux
* Node (tested with v0.10.29)
* Ruby 1.9+
* NPM (tested with v1.4.14) 
* Meteor 0.1.0.2
* git 2.0+
* [Evergreen](http://eisenbergeffect.bluespire.com/evergreen-browsers) (self-updating) browsers: Chrome, IE10+, Safari, FireFox
 
---

## Contact + tools we use

* twitter: [@makeparallels](http://www.twitter.com/makeparallels)

* [Slack](http://parallelsio.slack.com) for chat/collab

* [Trello](http://trello.com) for keeping track of stories (units of development work)

---

## Contribute

We're a diverse, distributed team of designers, developers and researchers with a goal of changing the way we organize and connect ideas. We'd love you to join us: get in touch if would like to contribute. No contribution is too small.


Current challenges:

* A zoomable user interface (ZUI) with coordinate system for map-based layout/content
* Modeling documents in graph-based data structures (potential candidates are Neo4J, MongoDB, TitanDB, OrientDB, Datomic, Arango, ReThink DB) 
* Decentralized (cloud-less) infrastructure / file storage
* Browser extensions for clipping web content
* Matrix transformations-heavy, physics-based interactions
* Interactive documentation, think Bret Vector reactive documents
* iOS / Android apps

---  
### Setup, Building + Developing



#### Install node.js + NPM ( [OSX, via Homebrew](http://thechangelog.com/install-node-js-with-homebrew-on-os-x ) ) ( [Linux via Apt ] (https://www.digitalocean.com/community/tutorials/how-to-use-npm-to-manage-node-js-packages-on-a-linux-server) )




```

# to install Meteor:
$ curl install.meteor.com | sh

```

  
  


```

# enter the directory where you store your code:
$ mkdir your-code-directory         # if it doesn't yet exist
$ cd your-code-directory

```


```

# make a copy of this repository to your computer
$ git clone https://github.com/parallelsio/app-meteor.git

```


```

# install Bower, a dependency manager which will download all the front-end assets (libraries) needed to run this project
$ npm install bower -g 

```

```

# install Compass, need to compile SCSS stylesheets into CSS 
$ bundle install compass
```


```

# automatically gets all the JS libraries required, using Npm, the node packaging system
$ npm install

```


```

# when ready to run the extension locally, run the Grunt task to prep the files, run the local web server, and load the extension
$ grunt

# This does several things, including:
# ---- Checks the quality of the JS code via jshint
# ---- Compiles the SASS files into CSS via Compass
# ---- Compiles the JADE template files 
# ---- Runs a watcher, listening for changes to your source code to reflect directly in the Chrome Extension

```



```

# Load the Chrome extension into the Chrome browser. Only required once, the first time to set up.
# Details here: # https://developer.chrome.com/extensions/getstarted#unpacked

# When Chrome prompts you for the project directory, point it to the 
# /extensions/chrome folder of this repository

```


```

# at this point, you should have both projects set up + running in separate terminal windows

# --- this repository, the web clipper chrome extension via 
$ grunt debug

# --- and --- 

# --- the core Meteor app, via:
$ meteor run --settings settings.json

# you should now be able to click the Extension icon in Chrome 
# on a web page to bring up the Web clipper popup. 
# Save a bit, and you should see that bit instantly 
# on your Parallels canvas at http://localhost:3000



```



```

# Now you can edit the clipper extension source code.

# The Chrome extension *should automatically reload your newest changes,
# *without you having to reconfigure the extension, unpack or copy files anywhere.

# However, you *will need to refresh the tab in which you are testing the clipper, 
# *every time you edit to the source code

```




```

# sometimes Chrome gets funky when trying to reload changes
# recompiling manually sometimes does the trick

# SCSS, with:
$ grunt compass:chrome 

# and your Jade templates, with:
$ grunt jade

# if all else fails, and your changes are not being picked up by the extension
# disable, then disable the extension via Chrome Settings: http://chrome://extensions


```



```

# run the test suite, to ensure nothing is broken
$ grunt test


```




## Road Map

Coming shortly. 


## License

GNU Affero General Public License. Pay it forward.

