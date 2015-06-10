[![Build Status](https://travis-ci.org/parallelsio/core-modules.svg?branch=master)](https://travis-ci.org/parallelsio/core-modules)

<img src="http://i.imgur.com/lI0HhvV.png" />

##[Parallels](http://parallels.io) (working title) : A free, digital tool for creativity + play, enabling you to fluidly create, remix + share documents as networks of ideas. 

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

> * [Heroku](https://www.heroku.com) Cloud hosting platform, with good API's + plugin system


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
> * [Neo4j](http://www.neo4j.com) 
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



#### Install [Neo4j](http://neo4j.com/)
> We use Neo4j to graph the relationship between Bits and more. We recommend installing using a package manager. Our preference is Brew but feel free to use whatever you're comfortable with.
> [Installation Instructions](http://brewformulas.org/Neo4j)



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

> 3) To our sandbox server, at [https://makeparallels.herokuapp.com](https://makeparallels.herokuapp.com)
> This link is public + persists. Our production sandbox for now.
> Please take care what you clip here.
> `$ npm run prod`



### Install The Extension
> Point the Chrome browser to the extension source code folder: `/extensions/chrome/source`
> [Detailed directions](https://developer.chrome.com/extensions/getstarted#unpacked)


### Start The Neo4j Server
> We assume your Neo4j instance will be up and running at localhost:7474. If not, you'll need to update the meteor-app/settings.json with your environment's location.
> `$ neo4j start`



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



### Development Workflow Scripts
> There are several scripts available using `npm` that are designed to make the development process as painless as possible:

> `npm run test`: Runs all tests in the project. Combines `npm run units` + `npm run e2e`
<br>
> `npm run units`: Run only the unit tests
<br>
> `npm run e2e`: Run only the end-to-end (e2e) tests
<br>
> `npm run local`: Build a version of the clipper to extensions/chrome/build that points to localhost
<br>
> `npm run ci`: Build a version of the clipper to extensions/chrome/build that points to parallels-ci.meteor.com
<br>
> `npm run prod`: Build a version of the clipper to extensions/chrome/build that points to makeparallels.herokuapp.com
<br>
> `npm run server`: Starts the meteor app and livereload for the clipper source
<br>
> `npm run resetdb`: Drops all data in meteor's mongo DB and the Neo4j DB
<br>
> `npm run exportlog`: Export your canvas's data to a json file. The data will be ouptut to `meteor-app/private/data-backups/canvas.events.json`. (IMPORTANT: the app must be running when you run this command)
<br>
> `npm run importlog`: Rebuild your canvas from scratch by importing a json file of canvas events to be replayed. The task will read events data from `meteor-app/private/data-backups/canvas.events.json`. (IMPORTANT: the app must be running when you run this command. However, you probably want to run the resetdb command above before running the import although it isn't necessary.)
<br>
> You can see a lists of all commands/scripts available by running `npm run`.



### Opening an issue
> If you come across a bug, please open a Github issue to report it to us. It would be great if you could include your environment information including:

> * Version of dependencies e.g. NodeJS, MongoDB, Meteor, and Neo4j
> * Version of browser you are running the app in
> * Your local instance eventlog. You can extract this by running `npm run exportlog` while the app is running. Take the output and create a gist to include in the issue. This output will include all activity in your local instance of Parallels. Be careful not to include any private activity you don't want shared! 

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

> __A__: Run `$ npm run test`


<br>
> __Q__: Can I see the chrome extension unit tests in one place?

> __A__: Yup, go to [http://localhost:9000/_SpecRunner.html](http://localhost:9000/_SpecRunner.html) after you have your local server running 


<br>
> __Q__: I made changes to the Chrome extension source code. Why are my changes not being recognized by the extension when I try to clip/save a tab? 

> __A__: The system which listens for changes automatically reload your newest changes, *without you having to reconfigure the extension, unpack or copy files anywhere. 

> However, you *will need to refresh the tab in which you are testing the clipper, every time you edit the source code

<br>

> __Q__: How do I close the server after running `npm run server`?

> __A__: Press Control X, Control C to kill the process.

<br>

> __Q__: I'm trying to run Meteor commands, and I keep seeing errors/output like 
` You are not in a Meteor project directory`

> __A__: Our project has 2 sub-projects in it: The web canvas, in `/meteor-app`, and the extensions, in `/extensions` part. You need to enter the Meteor directory to run Meteor commands. Try `cd meteor-app` from the project root.

<br>

> __Q__: I'm trying to run `npm run server` to start the server and get going. I see:

```
xxx@username:~/code/parallels-core-modules/meteor-app(flocking-audio)]$ npm run server
npm ERR! Error: ENOENT, open '/Users/xxxxx/code/parallels-core-modules/meteor-app/package.json'
npm ERR! If you need help, you may report this *entire* log,
npm ERR! including the npm and node versions, at:
npm ERR!     <http://github.com/npm/npm/issues>

npm ERR! System Darwin 13.4.0
npm ERR! command "node" "/usr/local/bin/npm" "run" "server"
npm ERR! cwd /Users/xxxxx/code/parallels-core-modules/meteor-app
npm ERR! node -v v0.10.32
npm ERR! npm -v 1.4.28
npm ERR! path /Users/xxxxx/code/parallels-core-modules/meteor-app/package.json
npm ERR! code ENOENT
npm ERR! errno 34
npm ERR!
npm ERR! Additional logging details can be found in:
npm ERR!     /Users/xxxxx/Code/code/parallels-core-modules/meteor-app/npm-debug.log
npm ERR! not ok code 0

```

> __A__: `npm` commands need to be run from the project root. 

<br>


> __Q__: I dont want to run all the stuff that happens when `npm run server` runs. I just want the one meteor run command. 

> __A__: `cd meteor-app` and run your meteor commands there. To start the server, you'll need to start with the settings file. Try `meteor run --settings settings.json --port 3000`, or update the port number to change to another port. This is useful if you have something else you are working on that defaults to port `3000`

<br>


> __Q__: I just finished adding some code and am trying to run `npm run e2e` to make sure I didn't break anything. THe terminal process hangs, and the browser never actually opens to run the end to end test. My hangs, after something like this: 

> ```
> Running "bgShell:e2e" (bgShell) task
> Starting Selenium server...
> Starting Meteor App with DB: mongodb://localhost:27017/parallels_test
> ```


> __A__: `npm run server` or your Meteor server is running because you turned it on manually in another tab. You'll need to stop it to run your tests. Do: Control X, and Control C on the tab running `npm run server`, and try running your tests again with `npm run e2e`

<br>

> __Q__: I did `cd meteor-app` and then `meteor reset` to clear the Mongo db, but I'm getting an error:

> ```
> reset: Meteor is running.

> This command does not work while Meteor is running your application. Exit the running Meteor development server.
> ```

> __A__: You can't run this command while Meteor is running. Shut down your meteor server by closing all open terminal windows that are running `npm run server` (which runs the Meteor server under the hood). 

> If there are none, there's probably an orphan lock and some Meteor process still running. Try

>`ps -x | grep meteor` , which should gives you some output like :

> ```
> 50136 ??         0:03.24 /Users/xxxxx/.meteor/packages/velocity_meteor-tool/.1.1.3_3.1ieennv++os.osx.x86_64+web.browser+web.cordova/mt-os.osx.x86_64/dev_bundle/mongodb/bin/mongod --bind_ip 127.0.0.1 --smallfiles --port 3001 --dbpath /Users/thoughtworker/Code/code/parallels-core-modules/meteor-app/.meteor/local/db --oplogSize 8 --replSet meteor
> 51804 ttys000    0:00.00 grep meteor
> ```

> take the process ID for the Meteor entry, in this case `50136`, and run the kill command, like so:

> `kill -s KILL 50136`

> Now try `meteor reset`

<br>

> __Q__: I have a Wacom tablet plugged in, and am trying to create a sketch bit (using the S key command). I see the sketch bit created, but the system doesn't recognize my Wacom tablet?

> __A__: You need to take several steps to allow your browser (and thus Parallels), to see your device:

> * 1: If you have Chrome, enable the NPAPI plugin, which allows the browser to communicate with the tablet hardware: Go to custom settings by going to [chrome://flags/#enable-npapi](chrome://flags/#enable-npapi). 

> * 2: After enabling, browser will prompt you for access to the plugin. Allow it, and then you should be able to use your Wacom's stylus, sketching on the bit, in Parallels

<br>

> __Q__: I've run my unit tests, either manually via with `npm run units`, or as part of the full testing suite run with `npm run tests`. It hangs, after this output:

> ```
> ^X^C[15:01][xxxx@xxxx:~/Code/code/parallels-core-modules(master)]$ npm run units

> parallels@0.0.1 units /Users/thoughtworker/Code/code/parallels-core-modules
> grunt unit-tests

> Running "jshint:all" (jshint) task

> ✔ No problems

> Running "bgShell:meteorTests" (bgShell) task
> => Using velocity:METEOR@1.1.0.2_2 as requested (overriding Meteor 1.1.0.2)

> stream error Network error: ws://localhost:3000/websocket: connect ECONNREFUSED
> I20150610-15:02:18.965(2)? Meteor is successfully connected to Neo4j on http://localhost:7474
> I20150610-15:02:19.362(2)? [velocity] jasmine-client-integration is starting a mirror at http://localhost:58949/.
> I20150610-15:02:19.367(2)? [velocity] jasmine-server-integration is starting a mirror at http://localhost:58950/.
> I20150610-15:02:19.370(2)? [velocity] You can see the mirror logs at: tail -f /Users/thoughtworker/Code/code/parallels-core-modules/meteor-app/.meteor/local/log/jasmine-client-integration.log
> I20150610-15:02:19.372(2)? [velocity] You can see the mirror logs at: tail -f /Users/thoughtworker/Code/code/parallels-core-modules/meteor-app/.meteor/local/log/jasmine-server-integration.log
> ```

> __A__: Velocity, the Meteor testing framework used, spins up in another thread to run the tests. Its error output is not piped back to your current terminal, so you'll need to look at the logs, as the error output instructs to see the error(s).

<br>



---------



### Having trouble? 

> Tweet to us [@makeparallels](http://www.twitter.com/makeparallels), [email](mailto:steven@parallels.io), or [post a Github Issue](https://github.com/parallelsio/core-modules/issues/new). 

> We'll get back to you pronto, and if necessary, arrange for a remote pairing session to set you up!



### Contribute! 

> We'd love for you to join us. There are many ways to contribute: code is an important, but only one, aspect.

> #### Current challenges:

> * Map-based coordinate system for layout/content
> * Designing a realtime, multi-client environment that supports simoultaneous collaboration
> * Storing, modeling documents in a combination of databases, used for different purposes
> * Browser extensions for clipping web content
> * Physics-based UI animations + transitions, via Greensock JS, SVG, CSS3, WebGL 
> * Procedural audio, for dynamic, realtime sound synthesis, where UI input are used as parameters to shape sound
> * Interactive documentation, think Bret Vector's definition of [reactive documents](http://worrydream.com/ExplorableExplanations/), to help prevent [this](https://i.imgur.com/Ssz6pjF.png)
> * mobile apps: iOS / Android / FireFoxOS
> * Decentralized (cloud-less) infrastructure / file storage + blockchain explorations


<br>
> #### Designers + Developers:

> * [Fork the project](https://help.github.com/articles/fork-a-repo), instead of cloning, in the setup details above. Modify the code. 

> * Run the end-to-end test suite when finished with a unit of work.
> This runs all the tests which ensure the components still work (clipper, web canvas)  
`$ npm run e2e` 

> * If tests pass, please [submit a Github Pull Request](https://help.github.com/articles/using-pull-requests)




