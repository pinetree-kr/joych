'use strict';

angular.module('joychApp')
	.config(function(dialogsProvider,$translateProvider){
		dialogsProvider.useBackdrop('static');
		dialogsProvider.useEscClose(true);
		dialogsProvider.useCopy(false);
		dialogsProvider.setSize('sm');
	})
	.config(function(paginationConfig){
		paginationConfig.itemsPerPage = 1;
	})
  .config(function(uiGmapGoogleMapApiProvider){
    uiGmapGoogleMapApiProvider.configure({
      v: '3.17',
      key : 'AIzaSyBGcG-_PhT5mV4-HMtpy7LqnfRwrWylVvk'
    });
  })
  .controller('BuslineCtrl', function ($scope, Auth, BuslineService, $state, dialogs) {
  	$scope.lines = [];
  	$scope.isAdmin = Auth.isAdmin;
    BuslineService.getLines(function(items){
    	angular.forEach(items, function(item){
    		$scope.lines.push(item);
    	});
    });
    $scope.delete = function(line){
    	dialogs.confirm("Delete","delete it?").result.then(function(result){
    		var index = $scope.lines.indexOf(line);
	    	line.$delete(function(result){
	    		$scope.lines.splice(index, 1);
	    	});
    	});
    }
    $scope.modify = function(line){
    	$state.go('busline-edit', {
    		id:line._id
    	});
    }
    $scope.add = function(){
    	$state.go('busline-edit');
    } 
  })
  .controller('BuslineMapRoutesCtrl', function($scope, $timeout, $filter, $modalInstance, uiGmapIsReady, data){
  	$scope.map = {
  		center:{
  			latitude: null,
  			longitude: null
  		},
  		options : {
  			minZoom : 12,
      	maxZoom : 16,
  			scrollwheel : false,
  		},
  		valid : false,
  		events : {
  			click : function(map, event, args){
  				var e = args[0];
  				var latlng = {
  					latitude : e.latLng.lat(),
  					longitude : e.latLng.lng()
  				}
  				$scope.line.routes.push(latlng);
  				e = null;
  				latlng = null;
  			}
  		},
  		routeEvents : {
	  		click : function(polyline, event, model, args){
	  			var e = args[0];
	  			var latitude = e.latLng.lat();
  				var longitude = e.latLng.lng();

	  			var filter = $filter('filter');
	  			var target = filter($scope.line.routes, function(item){
	  				return item.latitude === latitude && item.longitude === longitude;
	  			});
	  			if(target.length<1){return ;}
	  			var idx = $scope.line.routes.indexOf(target[0]);
	  			$scope.line.routes.splice(idx,1);
	  		}
	  	},
  		zoom: 13,
  		lineStyle: {
        color: '#333',
        weight: 5,
        opacity: 0.7
      },
  	};
  	$scope.line = data;
  	//$scope.stations = data.stations;

  	uiGmapIsReady.promise().then(function(maps){
			var map = maps[0].map;
			google.maps.event.trigger(map, 'resize');
			var nav = navigator.geolocation;
  		if(nav){
  			nav.getCurrentPosition(function(pos){
  				setMapCenter(pos.coords);
  				nav = null;
  			},function(err){
  				console.log(err);
  				nav = null;
  			});
  		}
			map = null;
		});
		var setMapCenter = function(coords){
			$timeout(function(){
				$scope.map.center = {
					latitude : coords.latitude,
					longitude : coords.longitude
				}
				//console.log(data);
			});
		}
		$scope.cancel = function(){
  		$modalInstance.dismiss('cancel');
  	}
  	$scope.save = function(){
  		//console.log($scope.routes);
  		$modalInstance.close($scope.line.routes);
  	}
  })
  .controller('BuslineTimePartsCtrl', function($scope, $timeout, $modalInstance, data){
    $scope.getArray = function(n){
      return new Array(n);
    }
    $scope.parts = {
      hasName : data.hasName || true,
      numbers : data.numbers || 1,
      names : data.names || $scope.getArray(data.numbers || 1)
    }

    $scope.cancel = function(){
      $modalInstance.dismiss('cancel');
    }
    $scope.save = function(){
      var data = {
        numbers : $scope.parts.numbers,
        names : new Array($scope.parts.numbers)
      };
      for(var i=0;i<data.numbers;i++){
        data.names[i] = $scope.parts.names[i] || "";
      }
      $modalInstance.close(data);
    }
  })
  .controller('BuslineStationTimesCtrl', function($scope, $timeout, $modalInstance, data){
    $scope.times = new Array(data.parts.numbers);
    if(angular.isArray(data.times)){
      for(var i=0; i<data.parts.numbers; i++){
        $scope.times[i] = new Date();
        if(data.times[i]){
          $scope.times[i].setHours(data.times[i].hour);
          $scope.times[i].setMinutes(data.times[i].min);
        }
      }
    }else{
      $scope.times[0] = new Date();
      if(data.times){
        var time = data.times.split(':');
        $scope.times[0].setHours(time[0]);
        $scope.times[0].setMinutes(time[1]);
      }
    }
    $scope.name = data.name;
    $scope.parts = data.parts;

    $scope.cancel = function(){
      $modalInstance.dismiss('cancel');
    }
    $scope.save = function(){
      var data = [];
      angular.forEach($scope.times, function(time, index){
        this.push({
          hour : time.getHours(),
          min : time.getMinutes()
        });
      }, data);
      $modalInstance.close(data);
    }
  })
  .controller('BuslineMapStationCtrl', function($scope, $timeout, $modalInstance, uiGmapIsReady, data){
  	$scope.map = {
  		center:{
  			latitude: null,
  			longitude: null
  		},
  		options : {
  			minZoom : 12,
      	maxZoom : 16,
  			scrollwheel : false,
  		},
  		zoom: 13,
  		valid : false,
  		marker : undefined,
  	};
  	$scope.marker = {
  		id : 'current',
  		coords : {
  			latitude: null,
  			longitude: null
  		},
  		options : {
  			draggable : true,
  		},
  		events : {
  			dragend : function(marker, event, args){
  				//console.log(marker);
  				//console.log($scope.marker.coords);
  			},
  		}
  	}
		uiGmapIsReady.promise().then(function(maps){
			var map = maps[0].map;
			google.maps.event.trigger(map, 'resize');
			if(!data){
				var nav = navigator.geolocation;
	  		if(nav){
	  			nav.getCurrentPosition(function(pos){
	  				setMapCenter(pos.coords);
	  				nav = null;
	  			},function(err){
	  				console.log(err);
	  				nav = null;
	  			});
	  		}
			}else{
				setMapCenter(data);
			}
  		map = null;
		});
		var setMapCenter = function(coords){
			$timeout(function(){
				$scope.map.center = {
					latitude : coords.latitude,
					longitude : coords.longitude
				}
				$scope.marker.coords = {
					latitude : coords.latitude,
					longitude : coords.longitude
				}
				$scope.map.valid = true;
			});
		}
  	$scope.cancel = function(){
  		$modalInstance.dismiss('cancel');
  	}
  	$scope.save = function(){
  		$modalInstance.close($scope.marker.coords);
  	}
  })
  .controller('BuslineEditCtrl', function ($scope, $state, $filter, $timeout, Auth, dialogs, $stateParams, BuslineService) {
  	$scope.weekdays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    $scope.errors = {};

    $scope.isAdmin = Auth.isAdmin;
    if($stateParams.id){
  		BuslineService.getLine({id:$stateParams.id}, function(result){
				setForm(result);
  		})
  	}else{
  		$scope.line = {
	    	local : true,
	    	week : ['sun'],
	    	routes : [],
	    	stations : [],
	    	parts : {
          names : [""],
          numbers : 1
        }
	    };
  	}

  	var setForm = function(data){
  		$scope.line = data;
  		setMapRoutes($scope.line.routes);
  		var filter = $filter('number');
  		angular.forEach($scope.line.stations, function(item, index){
				item.location = filter(item.coords.latitude,8)+','+filter(item.coords.longitude,8);
        item.getTimes = getTimes(item.times);
			});
			filter = null;
  	}
    var getTimes = function(data){
      var time = [];
      angular.forEach(data, function(value, index){
        var hour = value.hour<10 ? '0'+value.hour : value.hour;
        var min = value.min<10 ? '0'+value.min : value.min;
        this.push(hour + ":" + min);
      }, time);
      return time.toString();
    }

  	$scope.addStation = function(){
  		$scope.line.stations.push({
  			name : undefined,
				coords : undefined,
				time : undefined,
  		});
  	}
  	$scope.removeStation = function(idx){
			$scope.line.stations.splice(idx,1);
		}

    $scope.openTimePartInfo = function(){
      var dlg = dialogs.create(
        'app/busline/dialogs/dialog-time-parts-info.html',
        'BuslineTimePartsCtrl',
        $scope.line.parts,//routes : routes,
        {
          size: 'lg',
          keyboard: true,
          backdrop: true,
          windowClass: 'my-class',
          copy:true
        });
      dlg.result.then(function(result){
        setPartInfo(result);
      });
    }

    $scope.openStationTimes = function(parts, station){
      var dlg = dialogs.create(
        'app/busline/dialogs/dialog-station-times.html',
        'BuslineStationTimesCtrl',
        {
          parts : parts,
          name : station.name,
          times : station.times || station.time,
        },
        {
          size: 'lg',
          keyboard: true,
          backdrop: true,
          windowClass: 'my-class',
          copy:true
        });
      dlg.result.then(function(result){
        setStationTimes(station, result);
      });
    }

		$scope.openMapRoutes = function(routes, stations){
			var dlg = dialogs.create(
				'app/busline/dialogs/dialog-map-routes.html',
				'BuslineMapRoutesCtrl',
				{
					routes : routes,
					stations : stations
				},{
					size: 'lg',
					keyboard: true,
					backdrop: true,
					windowClass: 'my-class',
					copy:true
				});
			dlg.result.then(function(result){
				setMapRoutes(result);
			});
		}
    var setStationTimes = function(station, times){
      station.times = times;
      station.getTimes = getTimes(times);
    }
    var setPartInfo = function(partInfo){
      $scope.line.parts.names = partInfo.names;
      $scope.line.parts.numbers = partInfo.numbers;
    }
		var setMapRoutes = function(routes){
			$scope.line.routes = routes;
			var filter = $filter('number');
  		$scope.line.route = filter(routes[0].latitude,8)+','+filter(routes[0].longitude,8) + ' ~ '
  							+ filter(routes[routes.length-1].latitude,8)+','+filter(routes[routes.length-1].longitude,8);
			filter = null;
		}

		$scope.openMapStation = function(station){
			var dlg = dialogs.create(
				'app/busline/dialogs/dialog-map-station.html',
				'BuslineMapStationCtrl',
				station.coords,
				{
					size: 'lg',
					keyboard: true,
					backdrop: true,
					windowClass: 'my-class',
					copy:true
				});
			dlg.result.then(function(coords){
				station.coords = {
					latitude : coords.latitude,
					longitude : coords.longitude
				};
				station.location = coords.latitude+','+coords.longitude;
			});
		}

    $scope.submit = function(form){
    	$scope.submitted = true;
    	//return;
    	if(form.$valid && $scope.line.week.length>0) {
    		angular.forEach($scope.line.stations, function(item, index){
    			item._id = index + 1;
    		});
    		if($scope.line._id){
    			apply();
    		}else{
    			create();
    		}
    	}
    };
    var create = function(){
    	dialogs.confirm("Add","add it?").result.then(function(result){
	    	BuslineService.addLine($scope.line, function(result){
	    		$scope.submitted = false;
	  			$state.go('busline');
	  		});
	    });
    }
    var apply = function(){
    	dialogs.confirm("Modify","apply it?").result.then(function(result){
	    	$scope.line.$updateLine(function(result){
	    		$scope.submitted = false;
	    		//console.log(result);
	    		setForm(result);
	    	});
	    });
    }
  })
  ;
