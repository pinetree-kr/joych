/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Busline = require('./busline.model');

exports.register = function(socket) {
  Busline.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Busline.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('busline:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('busline:remove', doc);
}