'use strict';

angular.module('joychApp')
	.service('BuslineResource', function($resource){
		return $resource('/api/buslines/:id/:controller', {
      id: '@_id'
    },{
    	/*/
    	get : {
        method: 'GET',
        params : {},
        isArray : true
      },
      /**/
      getAll : {
        method : 'GET',
        isArray : true,
        /*/
        transformResponse : function(data, header){
          var jsonData = angular.fromJson(data);
          var items = [];
          angular.forEach(jsonData, function(item){
            items.push(item);
          });
          //console.log(angular.fromJson(data).getAll);
          return items;
        }
        /**/
      },
      updateLine : {
        method : 'PUT'
      },
      addLine : {
      	method : 'POST',
      },
      delLine : {
        method : 'DELETE'
      },
      getLine : {
        method : 'GET',
        isArray : false
      }
    });
	})
  .factory('BuslineService', function (BuslineResource) {
    return {
    	getLines : BuslineResource.getAll,
      getLine : BuslineResource.getLine,
    	addLine : BuslineResource.addLine,
      delLine : BuslineResource.delLine,
      updateLine : BuslineResource.updateLine,
    }
  });
