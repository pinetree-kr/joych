'use strict';

var _ = require('lodash');
var Busline = require('./busline.model');

// Get list of buslines
exports.index = function(req, res) {
  Busline.find()
  .sort({
    created:1
  })
  .exec(function (err, buslines) {
    if(err) { return handleError(res, err); }
    return res.json(200, buslines);
  });
};

// Get a single busline
exports.show = function(req, res) {
  Busline.findById(req.params.id, function (err, busline) {
    if(err) { return handleError(res, err); }
    if(!busline) { return res.send(404); }
    return res.json(busline);
  });
};

// Creates a new busline in the DB.
exports.create = function(req, res) {
  Busline.create(req.body, function(err, busline) {
    if(err) { return handleError(res, err); }
    return res.json(201, busline);
  });
};

// Updates an existing busline in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Busline.findById(req.params.id, function (err, busline) {
    if (err) { return handleError(res, err); }
    if(!busline) { return res.send(404); }
    busline.stations = undefined;
    busline.routes = undefined;
    var updated = _.merge(busline, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, busline);
    });
  });
};

// Deletes a busline from the DB.
exports.destroy = function(req, res) {
  Busline.findById(req.params.id, function (err, busline) {
    if(err) { return handleError(res, err); }
    if(!busline) { return res.send(404); }
    busline.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}