[![Build Status](https://travis-ci.org/parallelsio/core-modules.svg?branch=master)](https://travis-ci.org/parallelsio/core-modules)

<img src="http://i.imgur.com/lI0HhvV.png" />

##[Parallels](http://parallels.io) (working title): <br>A free tool for creative expression + play, enabling you to fluidly create, remix + share docs as networks of ideas. 

> When we say document, we imagine playing with fragments, or bits, of media just like digital Lego. These documents are more like digital collections, that you can 

>-  create and remix on your own
>-  work on together with groups of friends +co-workers
>-  publish for people you've yet to meet. 
> 
> Parallels is an engine for the discovery of ideas.

<br>
> We're a [diverse, distributed](https://hackpad.com/Parallels-Cast-Friends-XGzlw9Mxg39) community of designers, developers, artists + researchers interested in changing the way we organize and connect ideas. 

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

> * [Heroku](https://www.heroku.com) Cloud hosting platform, with good API's + plugin system


### Special thanks for free licenses + support from:

> * [Screenhero](https://www.screenhero.com), for remote screenshare / pairing

> * [Doodle](https://www.doodle.com), great for scheduling team meetings across time zones

> * [Ghost](https://ghost.org/about) Simple, open source blogging platform 



### Components

> 2 main components, meant to run together, in this repository:
> 
> [/app](https://github.com/parallelsio/core-modules/tree/master/app) - the reactive, web app: a digital canvas where documents are created, remixed and shared. Based on [Meteor JS](http://www.meteor.com)
> 
> 
> [/extensions/chrome/source](https://github.com/parallelsio/core-modules/tree/master/extensions/chrome/source) - a Chrome extension for easily tagging + saving browser content found on the web, to your Parallels canvas

> This is an alpha version, a proof of concept. It is incomplete, with bugs and continuously changing code, design + features

> It currently only works locally (on your computer) - the extension is not yet published to the Extension Store, and the web app is not yet hosted as a service. You'll need to point this extension to your source code in Chrome after enabling Developer mode. 



### Privacy Notice

> All of the data you create while running a local build of Parallels stays private to you. Unlike other systems, any action you've taken in Parallels, since the beginning of time is still part of your activity stream, even if deleted. This is by design, as our project aims to be a [PIMS](http://cacm.acm.org/magazines/2015/5/186024-managing-your-digital-life/fulltext). We've already laid down the experimental architecture infrastructure to support this, but have not yet designed the UI to intuitively make this characteristic evident. Since this is running locally on your machine, there is little to be concerned about in terms of data privacy.

> **If you contribute to this project and/or are submitting a bug or issue with an included export of your database activity, please note your entire Parallels activity is included**. You can see what is in your Event history at any time by pressing the `H` key when running the web canvas. 

> If you have any questions or concerns, please contact us **before** posting your data.




### Requirements + Dependencies

> * OSX / Linux (Windows dev may work, but it has not been tested)
> * [Node.js](https://nodejs.org) (0.10.38) Server Runtime [Meteor requires the latest .10.x, no higher](https://forums.meteor.com/t/meteor-nodejs-0-12/2769/3)
> * [NVM](https://github.com/creationix/nvm) (Node version manager). Optional, but recommended
> * [NPM](https://www.npmjs.com) (Node package manager)
> * [Meteor JS](https://www.meteor.com) platform
> * [MongoDB](docs.mongodb.org) NoSQL database
> * [Neo4j](http://www.neo4j.com) graph database
> * [git](https://git-scm.herokuapp.com) distributed version control system
> * [Evergreen](http://eisenbergeffect.bluespire.com/evergreen-browsers) (self-updating, modern) browsers: Chrome, Firefox, Safari, FireFox, IE10+
 


### Setup

> Having any trouble at all? Ping us on Twitter [@makeparallels](http://www.twitter.com/makeparallels), or [email](mailto:steven@parallels.io) us to arrange for a remote pairing session to set you up!



#### Install [Node.js](https://nodejs.org) + [NPM](https://www.npmjs.com) (Node Package Manager)
 
> __1) via [NVM](https://github.com/creationix/nvm) (Node Version Manager) - preferred__ 
> Allows you to keep various versions of Node.js in your development environment (your computer) at once. Useful if you intend on using node.js for other projects besides Parallels.
> [Install instructions](https://github.com/creationix/nvm) [](http://stackoverflow.com/questions/8108609/install-multiple-version-of-node-js-using-nvm-ubuntu)

> After installing NVM, install the version of node required by Meteor and set it as the default

> ```
> $ nvm install 0.10.38
> $ nvm use 0.10.38
> $ nvm alias default 0.10.38
> ```

##### - - - OR - - - 

> __2) Manually__
> All projects you use on your computer will be tied to one version of Node.js. Considering Meteor needs an older version of Node, this is not a great option

> * [OSX, via Homebrew](http://thechangelog.com/install-node-js-with-homebrew-on-os-x ) 
> * [Linux via Apt ](https://www.digitalocean.com/community/tutorials/how-to-use-npm-to-manage-node-js-packages-on-a-linux-server)



#### Install [Meteor](https://www.meteor.com) 
> `$ curl install.meteor.com | sh`



#### Make a copy of this repository on your computer
> ```
> $ git clone https://github.com/parallelsio/core-modules.git parallels-core-modules
> $ cd parallels-core-modules
>```



#### Install [Mongo database](https://www.mongodb.org)
> A Mongo instance is used for the end to end tests, to avoid conflicting with local Mongo install used by the Meteor app
> [Installation Instructions](http://docs.mongodb.org/manual/installation)



#### Install + start the [Neo4j](http://neo4j.com/) database
> We use Neo4j to graph the relationship between Bits and more. We recommend installing using a package manager to install: our preference is with homebrew
> [Installation Instructions](http://brewformulas.org/Neo4j)

> After install is complete, run `$ neo4j start` to start the neo4j server, which defaults to `http://localhost:7474`. If you've changed this to another URL, you'll need to add an entry for the Neo4j location, to the `/app/settings.json` file. Have a look at the `app/settings.json.sample` for an example how to set this location
> 



#### Download + install all of the Node.js packages the Parallels project relies on
> `$ npm install`




### Start The Web App

> Run the  `$ npm run server` command, which a task that several steps to boot the server:
> 
> * Compiles the SCSS files into CSS
> * Compiles the Jade template files
> * Runs `bower install` to get all front-end dependencies (JavaScript libraries etc)
> * Boots up a local Meteor JS server
> * Runs a watcher, listening for changes to Chrome's extension source code, which lives in `/extensions/chrome/source`

> When server has finished booting, your terminal output should look something like this:
> <img src="http://i.imgur.com/5zxxnoC.png" />

> We've **disabled** the built in Meteor Hot Code, wihch automatically refreshed your browser whenever a change to the Meteor code was detected. We found it was slow and unpredictable. Make changes to `/app` and refresh manually to see your changes on `http://localhost:3000`. Note there is a slight delay for file changes to "kick in".
> 
> We've also added [Kadira's Meteor Debug](https://kadira.io/blog/introducing-kadira-debug) package, which provides an interactive log of the important events happening in the Meteor web app. You'll use 2 URL's in tandem while developing, after running `npm run server` to get everything going:

> * http://localhost:3000 - the local instance of the Parallels Meteor web app
> * http://debug.kadiraio.com/debug - the local Kadira Debug dashboard, providing a realtime view of what's happening in the web app on http://localhost:3000



### Build + Install The Chrome Extension (Optional)
> The Parallels Chrome extension allows you to save and send web pages you come across in different tabs, directly to the Parallels web canvas. Before you install and use our Chrome extension, you'll need to build (compile) it. 
> 
> Once you do so, and then install the built/compiled files into Chrome, where bits go when the extension is used, is 'frozen' and determined by how you built it the extension. 

> #### Build the Chrome Extension
 
> The three ways to build the extension are:

> 1) `$ npm run local` : the bits get sent to the local Parallels server, at [http://localhost:3000](http://localhost:3000). No one will see your data with this option. Your data is persistent, in that it will survive reloading the Meteor web canvas, and when you run your local end-to-end tests via `npm run e2e`

> ---------- OR ------------

> 2) `$ npm run ci` : bits get sent to the CI (Continous Integration) Parallels server at [http://parallels-ci.meteor.com](http://parallels-ci.meteor.com)
> This data is public, but not persistent: it gets cleared whenever 
> someone pushes new code to master. You should not need to use this directly, this is generally reserved for test automation.
> 
  
> ---------- OR ------------

> 3) `$ npm run prod` : bits get sent to the sandbox server, at [https://makeparallels.herokuapp.com](https://makeparallels.herokuapp.com), our production sandbox server. You should not use this directly, as this is a shared, public demo server, not for personal use.
> 

<br>
> #### Install the Chrome Extension
> Point the Chrome browser to the extension source code folder: `/extensions/chrome/source`
> [Detailed directions](https://developer.chrome.com/extensions/getstarted#unpacked)

> You can modify the extension source code and your extension will automatically update, if you have Developer Mode enabled in Chrome-> Extensions. 

> You can rebuild your extension at any time by re-running whichever of the 3 build options you prefer, though you'll have to remove/uninstall your extension from Chrome, and then re-install it by pointing it to your latest build

<br>
> When the server is running, and your extension is installed, save a web page using the web clipper. You should see that 'bit' instantly on your Parallels canvas. 

> The clipper currently only clips websites on http. 
> SSL-secured websites (https), will not work, as Chrome places restrictions on SSL content locally.

> <img src="http://i.imgur.com/yMwBRaY.png" />

<br>
<br>

### More Workflow Task Scripts
We've added more tasks to make ease development:

#### Testing tasks

> `npm run units`: Run only the unit tests
<br>
> `npm run e2e`: Run only the end-to-end (e2e) tests
<br>
> `npm run test`: Combines both  `npm run units` + `npm run e2e`, to run all the tests
<br>





#### Database tasks

> `npm run resetdb`: Drops **all** data in Meteor's mongo DB and the Neo4j DB. This removes all bit data + event stream history, resetting your application to a fresh state.

> <br>
> 
> `npm run exportlog`: Export your canvas's data to a json file. The data will be ouptut to `app/private/data-backups/canvas.events.json`. **This task only works while the web app is running (via `npm run server`)**

> <br>

> `npm run importlog`: Rebuild your canvas from scratch by importing a json file of canvas events to be replayed. This task will read events data from the file at: `app/private/data-backups/canvas.events.json`. **This task only works when the web app is running (via `npm run server`). ** You will probably want to clear/reset the databases before importing, although it isn't necessary.
<br>

<br>

> You can see a full list available by running `npm run`.


### FAQ + Contact

> Having trouble? Please contact us - we want to do everything possible to help get you set up quickly.
> 
>-  have a look at many common questions + answers at the [FAQ](https://github.com/parallelsio/core-modules/wiki/FAQ) Wiki. 

>- Tweet to us [@makeparallels](http://www.twitter.com/makeparallels)

>- [email](mailto:steven@parallels.io) us


> Interested in learning more about our stack + tools? Check out our [Contributor Onboarding Resources](https://github.com/parallelsio/core-modules/wiki/Onboarding-Resources) Wiki

> 



### Opening an issue
> If you come across a bug, please [post a Github Issue](https://github.com/parallelsio/core-modules/issues/new) to let us know. Helpful info to include:

>-  Version of dependencies e.g. NodeJS, MongoDB, Meteor, and Neo4j
> <br>
>-  OS, Type, version of browser, ie `OSX 10.10, Chrome, Version 43.0.2357.124 (64-bit)` 
> <br>
>-  Your local instance eventlog. You can extract this by running `npm run exportlog` while the Meteor app is running via `npm run server`. Take the output and [create a gist](https://gist.github.com) to include in the issue, or directly upload the exported JSON file. 
><br>The file exported as a result of running `npm run exportlog` will include all activity in your local instance of Parallels: **Please read the [Privacy Notice](https://github.com/parallelsio/core-modules#privacy-notice) before sharing/uploading this file, to understand what data will be included in it**






### Contribute! 

> We'd love for you to join us. Code is only one aspect of contribution and there are many ways to help.

> #### Current challenges:

>-  Map-based coordinate system for layout/content
><br>
>-  Designing a realtime, multi-client environment that supports simultaneous collaboration
><br>
>-  Storing, modeling documents in a combination of databases used for different purposes (aka polyglot database architecture)
><br>
>-  Browser extensions for clipping web content
><br>
>-  Physics-based UI animations + transitions, via Greensock JS, SVG, CSS3, WebGL 
><br>
>-  Procedural audio, for dynamic, realtime sound synthesis, where UI input is used as parameters for shaping sound
><br>
>-  Interactive documentation, think Bret Vector's definition of [reactive documents](http://worrydream.com/ExplorableExplanations/), to help prevent [this](https://i.imgur.com/Ssz6pjF.png)
><br>
>-  mobile apps: iOS / Android / FireFoxOS
><br>
>-  Decentralized (cloud-less) infrastructure / file storage + blockchain explorations

> Wanna learn more about our stack + tools? Check out our [Contributor Onboarding Resources](https://github.com/parallelsio/core-modules/wiki/Onboarding-Resources) Wiki


<br>
> #### Designers + Developers:

> * [Fork the project](https://help.github.com/articles/fork-a-repo), rather than cloning in the setup details above. Modify the code. 
><br>
> * Run the end-to-end test suite when finished with a unit of work.
> This runs all the tests which ensure the components still work (clipper, web canvas)  
`$ npm run test` 
><br>
> * If tests pass, please [submit a Github Pull Request](https://help.github.com/articles/using-pull-requests). **Please ensure you've excluded any of your data or export files. See our [Privacy Notice](https://github.com/parallelsio/core-modules#privacy-notice) to learn more**




