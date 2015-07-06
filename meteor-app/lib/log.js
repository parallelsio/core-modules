/*
 PURPOSE:
 Sets up granular logging, so as app grows, we can split/isolate
 logging across the app and show/hide specific areas/components
 that are relevant during dev of a specific feature, + leave out others

 PARAMS:
 - 1st: name of the logger. This will be prefixed with each log statement in console
 - 2nd: the level at which the logger logs. These are the log levels available

 log.trace(msg)
 log.debug(msg)
 log.info(msg)
 log.warn(msg)
 log.error(msg)

 if the level is set at "debug", everything including and below debug is logged
 if set to warn, everything including and below warn is logged

 so the method on `log` is the thing that dictates if and what level it is

 DOCS:
 https://github.com/practicalmeteor/meteor-loglevel/

 Currently using one logger across the app, set to the debug level.
 Turning that down to the info level will pretty much silence most logs
 then, you can use devlog in places where you want to see output by
 temporarily changing log.debug('some message') inline to devlog('some message')

 TODO:
 Component based logging, like:

 plomalog = loglevel.createAppLogger('ploma', 'info');
 bitsbaselog = loglevel.createAppLogger('bits/base', 'info');
 bitssketchlog = loglevel.createAppLogger('bits/sketch', 'info');
 bitstextlog = loglevel.createAppLogger('bits/text', 'debug');
 */

log = loglevel.createAppLogger('parallels', defaultLevel = 'debug');
devlog = loglevel.createLogger('dev', 'debug').debug;
