var util = Npm.require('util');
var Entity = Npm.require('sourced').Entity;
var MongoRepository = Npm.require('sourced-repo-mongo').Repository;

EntityRepository = function EntityRepository (entityType) {
  var self = this;
  self.cache = {};
  MongoRepository.call(this, entityType);
};
util.inherits(EntityRepository, MongoRepository);

_.extend(EntityRepository.prototype, {
  get: function (id, cb) {
    var self = this;
    var getEntity = Meteor.wrapAsync(function (callback) {
      var entity = self.cache[id];

      if (!entity) {
        EntityRepository.super_.prototype.get.call(self, id, function (err, entity) {
          if (!entity) {
            entity = new self.entityType([], []);
            entity.id = id;
          }
          self.cache[id] = entity;

          InfiniteUndo.CommandRegistry.registeredEvents.forEach(function (event) {
            entity.on(event, function (payload) {
              InfiniteUndo.EventStream.emit('entity.' + event, {
                data: {
                  payload: payload,
                  entity: _.pick(entity, 'id', 'version', 'timestamp')
                }
              });
            });
          });

          callback(null, entity);
        });
      } else {
        callback(null, entity);
      }
    });

    var entity = getEntity();

    cb(null, entity);
  }
});

_.extend(InfiniteUndo, {
  Entity: Entity,
  EntityRepository: EntityRepository
});
