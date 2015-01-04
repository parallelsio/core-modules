<img src="http://i.imgur.com/lI0HhvV.png" />

##[Parallels](http://parallels.io) : A free + open source platform for creating, connecting + sharing documents as networks of ideas. 

The project consists of 2 main components which need to run side by side, included in this repository:
   

###[/meteor-app](https://github.com/parallelsio/core-modules/tree/master/meteor-app)
---
The web application: a digital canvas where documents are created + remixed. Based on the [Meteor JS](http://www.meteor.com) platform

      

###[/extensions/chrome](https://github.com/parallelsio/core-modules/tree/master/extensions/chrome)
---
A Chrome extension for easily tagging + saving browser content found on the web, to your Parallels canvas

[![Build Status](https://travis-ci.org/parallelsio/chrome-clipper.svg?branch=master)](https://travis-ci.org/parallelsio/chrome-clipper)

---  
#### Notes
 
* This is an alpha version, a proof of concept. It is incomplete, with bugs and continuously changing code, design + features
* It currently only works locally (on your computer) - the extension is not yet published to the Extension Store, and the web app is not yet hosted as a service. This means all of the data you create while running this stays private to you.

---  
### Tested with latest versions:

* OSX / Linux. (Windows dev may work, but it has not been tested)
* Node (0.10.26)
* Ruby (2.0.0p247) (needed only for Compass)
* NPM (1.4.28) 
* Meteor JS (1.0.2.1)
* git (2.1.0)
* [Evergreen](http://eisenbergeffect.bluespire.com/evergreen-browsers) (self-updating, modern) browsers: Chrome, Firefox, Safari, FireFox, IE10+
 
---

### Contact + tools we use

* Twitter: [@makeparallels](http://www.twitter.com/makeparallels)

* [Slack](http://parallelsio.slack.com) for realtime chat + collaboration. [Email](mailto:steven@parallels.io) or [tweet](http://www.twitter.com/makeparallels) for access

* [Trello](https://trello.com/b/XtenDuNO/parallels-design-dev) for keeping track of stories (units of development work)

* [Screenhero](https://screenhero.com/) and Google Hangouts for remote screenshare / pairing

---

### Contribute

We're a diverse, distributed team of designers, developers and researchers with a goal of changing the way we organize and connect ideas. We'd love you to join us: get in touch if would like to contribute. No contribution is too small.


#### Current challenges:

* A zoomable user interface (ZUI) with coordinate system for map-based layout/content
* Modeling documents in graph-based data structures (potential candidates are Neo4J, MongoDB, TitanDB, OrientDB, Datomic, Arango, ReThink DB) 
* Decentralized (cloud-less) infrastructure / file storage
* Browser extensions for clipping web content
* Physics-based UI animations + transitions, via WebGL, CSS3, Canvas + JS 
* Interactive documentation, think Bret Vector reactive documents
* iOS / Android apps

---

### License

GNU Affero General Public License. Pay it forward.


---  
### Setup, Building + Developing

Having any trouble at all? Ping us on Twitter [@makeparallels](http://www.twitter.com/makeparallels), or [email](mailto:steven@parallels.io) to arrange for a remote pairing session to set you up!

---

#### Install node.js + NPM ( [OSX, via Homebrew](http://thechangelog.com/install-node-js-with-homebrew-on-os-x ) ) ( [Linux via Apt ] (https://www.digitalocean.com/community/tutorials/how-to-use-npm-to-manage-node-js-packages-on-a-linux-server) )


```
# to install Meteor:
$ curl install.meteor.com | sh
```

```
# enter the directory where you wish to store your source code:
$ mkdir your-code-directory         # if it doesn't yet exist
$ cd your-code-directory
```

```
# make a copy of this repository to your computer
$ git clone https://github.com/parallelsio/core-modules.git
$ cd core-modules
```

```
# install Bower, a dependency manager which will download all the 
# front-end assets (libraries) needed to run this project
$ npm install bower -g 
```

```
# install Compass, a Ruby gem used to compile SCSS stylesheets into CSS 
$ gem install compass
```

```
# download + install all the JS libraries this project requires, 
# using Npm, the node packaging system
$ npm install
```

```
#  install grunt, the Javascript-based task runner
$ npm install grunt-cli -g
```

```
# when ready to run the extension locally, run the Grunt task to prep the files, 
# run the local web server, and load the extension
$ grunt

# This does several things, including:
# ---- Checks the quality of the JS code via jshint

# ---- Compiles the SCSS files into CSS via Compass

# ---- Compiles the Jade template files

# ---- Boots up a local Meteor JS Server, and listens for changes 
#      to the Meteor source code, which lives in /meteor-app

# ---- Runs a watcher, listening for changes to your extension source code, 
#      which lives in /extensions/chrome
```

```
# When grunt is complete, your terminal output should look something like this:
```
<img src="http://i.imgur.com/5zxxnoC.png" />

```
# This means 2 things are running in the background:
# --- the core Meteor app, available on http://localhost:3000
# --- AND ---
# --- the associated web clipper, as a Chrome Extension
```

```
# Now, set up the Chrome extension into the Chrome browser. 
# You only need to do this once, the first time. Details here: 
# https://developer.chrome.com/extensions/getstarted#unpacked

# When Chrome prompts you for the project directory, point it to the 
# /extensions/chrome folder of this repository
```
```
# you should now be able to click the Extension icon in Chrome on a web page to
# bring up the web clipper dialog box

# Currently, the clipper will only work on http websites, not https
# This is only locally during dev, as Chrome places restrictions on SSL (https) content

# Save a web page using the web clipper. You should see that 'bit' instantly on 
# your Parallels canvas at http://localhost:3000
```
<img src="http://i.imgur.com/yMwBRaY.png" />

```
# Note, while editing the Chrome extension source code, the browser  *should 
# automatically reload your newest changes, *without you having to reconfigure 
# the extension, unpack or copy files anywhere.

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
# disable, then re-enable the extension via Chrome Settings: 
# http://chrome://extensions
```

---

### FAQ

Q: I'm getting an error: `bash: bundle: command not found`

A: Bundler, the required Ruby packager, is not installed. Do:
`gem install bundler'

------

Q: I know I've installed Npm, but when I try to run it `npm install`, I'm getting all sorts of errors.

A: You might've installed Npm with `sudo` (root permissions). This can be problematic. Follow [this](https://gist.github.com/DanHerbert/9520689) tutorial to re-install it

-------

Q: Why do you combine the 2 modules (Meteor app + Chrome extension)? Isn't it better to be modular and separate the repositories out?

A: Yes, generally it is. However, since the 2 parts depend on each other at this early stage, we wanted to get integration tests running across the 2 modules, to make sure when a page, or bit, as we call them is clipped, it indeeds arrives onto the canvas. 

By combining everything under one umbrella, testing is now signficantly easier. Once the 2 codebases mature, we'll consider separating them

----------

#### Still having trouble? 

Tweet to us [@makeparallels](http://www.twitter.com/makeparallels), [email](mailto:steven@parallels.io), or [post a Github Issue](https://github.com/parallelsio/core-modules/issues/new). 

We'll get back to you pronto, and if necessary, arrange for a remote pairing session to set you up!

