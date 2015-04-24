[![Build Status](https://travis-ci.org/parallelsio/core-modules.svg?branch=master)](https://travis-ci.org/parallelsio/core-modules)

<img src="http://i.imgur.com/lI0HhvV.png" />

##[Parallels](http://parallels.io) : A free, digital tool for creativity + play, enabling you to fluidly create, remix + share documents as networks of ideas. 

> When we say document, we imagine playing with fragments, or bits, of media just like digital Lego. These documents are more like digital collections, that you can create and remix on your own, work on together with a group of friends and co-workers, or publish for people you've yet to meet. 
> Parallels is an engine for the discovery of ideas.

> We're a [diverse, distributed](https://hackpad.com/Parallels-Cast-Friends-XGzlw9Mxg39) team of designers, developers and researchers with a goal of changing the way we organize and connect ideas. 

> * [Motivation, goals, open research questions](http://bit.ly/1JbkU4y)
> * [Blog](http://parallels.ghost.io)




### License

> GNU Affero General Public License. Pay it forward.




### Tools we use

> * Twitter: [@makeparallels](http://www.twitter.com/makeparallels)

> * [Slack](http://parallelsio.slack.com) for realtime chat + collaboration. [Email](mailto:steven@parallels.io) or [tweet](http://www.twitter.com/makeparallels) for access

> * [Trello](https://trello.com/b/XtenDuNO/parallels-design-dev) for keeping track of stories (units of design + development work)

> * [TravisCI](http://www.travis-ci.com), a Continous Integration system to run automate running our tests and deployment.

> * [Saucelabs](https://www.saucelabs.com) Automated cross-browser testing on various platforms



### Special thanks for free licenses + support from:

> * [Screenhero](https://www.screenhero.com), for remote screenshare / pairing

> * [Doodle](https://www.doodle.com), great for scheduling team meetings across time zones

> * [Ghost](https://ghost.org/about) Simple, open source blogging platform 



### Components

> 2 main components, meant to run together, in this repository:
> 
> [/meteor-app](https://github.com/parallelsio/core-modules/tree/master/meteor-app) - the reactive, web app: a digital canvas where documents are created, remixed and shared. Based on [Meteor JS](http://www.meteor.com)
> 
> 
> [/extensions/chrome/source](https://github.com/parallelsio/core-modules/tree/master/extensions/chrome/source) - a Chrome extension for easily tagging + saving browser content found on the web, to your Parallels canvas



### Requirements + Dependencies

> This is an alpha version, a proof of concept. It is incomplete, with bugs and continuously changing code, design + features

> It currently only works locally (on your computer) - the extension is not yet published to the Extension Store, and the web app is not yet hosted as a service. You'll need to point this extension to your source code in Chrome after enabling Developer mode. This means all of the data you create while running this stays private to you.

> * OSX / Linux (Windows dev may work, but it has not been tested)
> * [NVM](https://github.com/creationix/nvm) (optional, but recommended)
> * [Node.js](https://nodejs.org) (0.10.38) [Meteor requires the latest .10.x, no higher](https://forums.meteor.com/t/meteor-nodejs-0-12/2769/3)
> * [NPM](https://www.npmjs.com) 
> * [Meteor JS](https://www.meteor.com) 
> * [git](https://git-scm.herokuapp.com)
> * [Evergreen](http://eisenbergeffect.bluespire.com/evergreen-browsers) (self-updating, modern) browsers: Chrome, Firefox, Safari, FireFox, IE10+
 


### Setup, Building + Developing

> Having any trouble at all? Ping us on Twitter [@makeparallels](http://www.twitter.com/makeparallels), or [email](mailto:steven@parallels.io) to arrange for a remote pairing session to set you up!



#### Install [Node.js](https://nodejs.org) + [NPM](https://www.npmjs.com) (Node Package Manager)
 
> __1) via [NVM](https://github.com/creationix/nvm) (Node Version Manager) - preferred__ 
> - allows you to keep various versions of Node.js in your development environment (your computer) at once. Useful if you intend on using node.js for other projects besides Parallels.
> [Install instructions](https://github.com/creationix/nvm) [](http://stackoverflow.com/questions/8108609/install-multiple-version-of-node-js-using-nvm-ubuntu)

> After installing NVM, install version of node required by Meteor

> ```
> $ nvm install 0.10.38
> $ nvm use 0.10.38
> ```

##### - - - OR - - - 

> __2) Manually__
> All projects you use on your computer will be tied to one version of Node.js.
> Considering Meteor needs an older version of Node, this is not a good option

> * [OSX, via Homebrew](http://thechangelog.com/install-node-js-with-homebrew-on-os-x ) 
> * [Linux via Apt ](https://www.digitalocean.com/community/tutorials/how-to-use-npm-to-manage-node-js-packages-on-a-linux-server)



#### Install [Meteor](https://www.meteor.com) 
> `$ curl install.meteor.com | sh`



#### Copy this repository to your computer
> ```
> $ git clone https://github.com/parallelsio/core-modules.git parallels-core-modules
> $ cd parallels-core-modules
>```



#### Install [Mongo Database](https://www.mongodb.org)
> A Mongo instance is used for the end to end tests, to avoid conflicting with local Mongo install used by the Meteor app
> [Installation Instructions](http://docs.mongodb.org/manual/installation)



#### Download + install all required Node.js packages 
> `$ npm install`



#### Build the Chrome Extension

> Before you install the Chrome extension, you'll need to configure 
> where the bits that you clip / save will go, when extension is used.
> To do so, build the extension in one of three ways:



> 1) to the local server, at [http://localhost:3000](http://localhost:3000)
> No one will see your data with this option.
> Your data is persistent, in that it will survive reloading Meteor
> and when you run your local end-to-end tests
> `$ npm run local`

---------- OR ------------

> 2) to the CI (Continous Integration) server at [http://parallels-ci.meteor.com](http://parallels-ci.meteor.com)
> This data is public, but not persistent: it gets cleared whenever 
> someone pushes new code to master
> `$ npm run ci`
  
---------- OR ------------

> 3) To our sandbox server, at [http://parallels.meteor.com](http://parallels.meteor.com)
> This link is public + persists. Our production sandbox for now.
> Please take care what you clip here.
> `$ npm run prod`



### Install The Extension
> Point the Chrome browser to the extension source code folder: `/extensions/chrome/source`
> [Detailed directions](https://developer.chrome.com/extensions/getstarted#unpacked)

### Development Workflow Scripts
> There are several scripts available using `npm` that are designed to make the development process as painless as possible:

> * `npm test`: Runs all tests in the project
> * `npm run units`: Run only units tests for the extensions and meteor
> * `npm run e2e`: Run only e2e tests
> * `npm run local`: Build a version of the clipper to extensions/chrome/build that points to localhost
> * `npm run ci`: Build a version of the clipper to extensions/chrome/build that points to parallels-ci.meteor.com
> * `npm run prod`: Build a version of the clipper to extensions/chrome/build that points to parallels.meteor.com
> * `npm run server`: Starts the meteor app and livereload for the clipper source

> You can see all these scripts (and maybe more) by running `npm run`.

### Start The Web App
> We created a task that does a few things at once:

> * Compiles the SCSS files into CSS
> * Compiles the Jade template files
> * Runs `bower install` to get all front-end dependencies (JavaScript libraries etc)
> * Boots up a local Meteor JS server, and listens for changes to the Meteor source code in `/meteor-app`
> * Runs a watcher, listening for changes to Chrome's extension source code, which lives in `/extensions/chrome/source`

> `$ npm run server`

> When server has finished booting, your terminal output should look something like this:
> <img src="http://i.imgur.com/5zxxnoC.png" />



### Design, Develop + Carry on!

> You should now be able to modify either of the components (Meteor web app, JS Chrome extension).

> Save a web page using the web clipper. You should see that 'bit' instantly on 
> your Parallels canvas. 

> Note: currently, the clipper will only work on http websites, not https
> This is only locally during dev, as Chrome places restrictions on SSL (https) content locally.

> <img src="http://i.imgur.com/yMwBRaY.png" />



### FAQ

> __Q__: I know I've installed Npm, but when I try to run it `npm install`, I'm getting all sorts of errors.

> __A__: You might've installed Npm with `sudo` (root permissions). This can be problematic. Follow [this](https://gist.github.com/DanHerbert/9520689) tutorial to re-install it


<br>
> __Q__: Why do you combine the 2 modules (Meteor app + Chrome extension)? Isn't it better to be modular and separate the repositories out?

> __A__: Yes, generally it is. However, since the 2 parts depend on each other at this early stage, we wanted to get integration tests running across the 2 modules, to make sure when a page, or bit, as we call them is clipped, it indeeds arrives onto the canvas. 

> By combining everything under one umbrella, testing is now signficantly easier. Once the 2 codebases mature, we'll consider separating them


<br>
> __Q__: How do I run the end to end tests manually?

> __A__: Run `$ npm run e2e`


<br>
> __Q__: How do I run the unit tests manually?

> __A__: Run `$ npm run units`


<br>
> __Q__: How do I run all the tests?

> __A__: Run `$ npm test`


<br>
> __Q__: Can I see the chrome extension unit tests in one place?

> __A__: Yup, go to [http://localhost:9000/_SpecRunner.html](http://localhost:9000/_SpecRunner.html) after you have your local server running 


<br>
> __Q__: I made changes to the Chrome extension source code. Why are my changes not being recognized by the extension when I try to clip/save a tab? 

> __A__: The system which listens for changes automatically reload your newest changes, *without you having to reconfigure the extension, unpack or copy files anywhere. 

> However, you *will need to refresh the tab in which you are testing the clipper, every time you edit the source code



### Having trouble? 

> Tweet to us [@makeparallels](http://www.twitter.com/makeparallels), [email](mailto:steven@parallels.io), or [post a Github Issue](https://github.com/parallelsio/core-modules/issues/new). 

> We'll get back to you pronto, and if necessary, arrange for a remote pairing session to set you up!



### Contribute! 

> We'd love for you to join us. There are many ways to contribute: code is an important, but only one, aspect.

> #### Current challenges:

> * A zoomable user interface (ZUI) with coordinate system for map-based layout/content
> * Modeling documents in graph-based databases. Currently exploring neo4j
> * Browser extensions for clipping web content
> * Physics-based UI animations + transitions, via Greensock JS, SVG, CSS3, WebGL 
> * Interactive documentation, think Bret Vector's definition of [reactive documents](http://worrydream.com/ExplorableExplanations/), to help prevent [this](https://i.imgur.com/Ssz6pjF.png)
> * iOS / Android apps

> #### Later:
> * Decentralized (cloud-less) infrastructure / file storage


<br>
> #### Designers + Developers:

> * [Fork the project](https://help.github.com/articles/fork-a-repo), instead of cloning, in the setup details above. Modify the code. 

> * Run the end-to-end test suite when finished with a unit of work.
> This runs all the tests which ensure the components still work (clipper, web canvas)  
`$ npm run e2e` 

> * If tests pass, please [submit a Github Pull Request](https://help.github.com/articles/using-pull-requests)




