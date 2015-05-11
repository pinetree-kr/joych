'use strict';

angular.module('joychApp')
  .config(function ($stateProvider) {
  	$stateProvider
      .state('busline', {
        url: '/busline',
        templateUrl: 'app/busline/busline.html',
        controller: 'BuslineCtrl'
      })
      .state('busline-edit', {
        url: '/busline/edit/:id',
        templateUrl: 'app/busline/busline.edit.html',
        controller: 'BuslineEditCtrl'
      });
  });