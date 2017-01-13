var app = angular.module('chefsource.services', []);

/*app.service('EnsembleConnection', [function() {


}])*/

app.service('GeolocationInitializer',['$q','$ionicPlatform',function($q,$ionicPlatform) {

  return {
    initialize: function() {
      var deferred = $q.defer();
      var watchID = navigator.geolocation.watchPosition(function(resp){}, function(err){console.log("error watching: " + err.message + " code: " + err.code);}, { enableHighAccuracy: false, timeout: 10000 });
      // !!!! set enableHighAccuracy below to true when running on a device, false when using ionic serve
      var positionOptions = {maximumAge: 5000, timeout: 10000, enableHighAccuracy: true};
      navigator.geolocation.getCurrentPosition(function(position) {
        console.log('Got user location');
        deferred.resolve(position);
      }, function(error) {
        console.log("Error: " + error.message + " Code: " + error.code);
      },positionOptions);

    return deferred.promise;
    }
  };
}]);


app.service('APIInterceptor', ['$rootScope','$q',function ($rootScope, $q) {
  var service = this;

  service.responseError = function (response) {
    if (response.status === 401) {
      $rootScope.$broadcast('unauthorized');
    }
    return $q.reject(response);
  };
}]);

/*app.factory('Connection', ['$resource',function ($resource) {
  var baseurl = 'https://app.presencepro.com/cloud/json/settingsServer?';
  return function(preferences) {
    'connect' : {
          method: 'GET',
          url: baseurl+'appapi'
    }
  }
}])*/

app.factory('User', ['$resource',function ($resource) {
  var serveraddress = '143.215.55.146';
  return function(userdata) {
  	var baseurl = 'https://app.presencepro.com/cloud/json';
    var sbaseurl = 'http://' + serveraddress + '';
  	return $resource(baseurl, {}, {

  	'createUser': {	
  				method:'POST',
          url: baseurl+'/user',
  				headers: { 'Content-Type' 	: 'application/json',
  							'PASSWORD'		: userdata['password']}
  				},
  	'getUser': { 
  				method: 'GET',
          url: baseurl+'?userId=:userid',
          params: {userid:userdata['userid']},
          data: false,
  				headers: { 'Content-Type'	: 'application/json',
  							'API_KEY'		: userdata['apikey']
                }
  			},
    'insertUserToDb': {
          method: 'POST',
          url: sbaseurl+'/newuser.php',
          headers: { 'Access-Control-Allow-Origin' : sbaseurl+'/**',
                      'Access-Control-Allow-Methods': 'POST'}
    },
    'loginUP': {
        method: 'GET',
        url: baseurl+'/login?username=:usern',
        params: {usern:userdata['username']},
        data: false,
        headers: { 'Content-Type' : 'application/json',
                   'PASSWORD'     : userdata['password']
        }
    }

	});
  };

}]);

app.service('UsersModel', ['$http','$q','$resource','User','$rootScope','$httpParamSerializerJQLike',function ($http,$q,$resource,User,$rootScope,$httpParamSerializerJQLike) {
  var currentUser;
  var serveraddress = '143.215.55.146';
	return {
    
		newUser: function(body, userdata) {
   	 		var deferred = $q.defer();
    		User(userdata).createUser(body, function(resp) {
        		if(resp) {
          			deferred.resolve(resp);
        		} else {
          			deferred.reject(resp);
        		}
    		});
    		return deferred.promise;
		},
		getUserAccInfo: function(userdata) {
			var deferred = $q.defer();
			if(!userdata['userid']) {
				console.log('No userid! Cant access user account info');
				return;
			}

      
			User(userdata).getUser({},{},function(resp) {
				if(resp) {
					deferred.resolve(resp);
				} else {
					deferred.reject(resp);
				}
			}, function(resp) {
				if(resp) {
					deferred.resolve(resp);
				} else {
					deferred.reject(resp);
				}
			});
			return deferred.promise;
		},
    initializeUserInDatabase: function(userdata) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: 'http://' + serveraddress + '/newuser.php',
        data: userdata
      }).then(function(resp) {
          console.log('SERVICE INIT USER' + JSON.stringify(resp));
          deferred.resolve(resp);
        }, function(resp) {
          console.log('Failed to insert user into db ' + JSON.stringify(resp));
        });
      return deferred.promise;
    },
    loginUser: function(username, password) {
      var deferred = $q.defer();
      var userdata = {'username':username,'password':password};
      User(userdata).loginUP({},{},function(resp) {
        if(resp) {
          deferred.resolve(resp);
        } else {
          deferred.reject(resp);
        }
      }, function(resp) {
        if(resp) {
          deferred.resolve(resp);
        } else {
          deferred.reject(resp);
        }
      });
      return deferred.promise;
    },
    getProfileInfo: function(id, keys) {
      var deferred = $q.defer();
      var parameters = $httpParamSerializerJQLike({'keys':keys});
      var idparam = $httpParamSerializerJQLike({'userid':id});
      $http({
        method: 'GET',
        url: 'http://' + serveraddress + '/user.php?'+idparam+'&'+parameters,
        params: {},
        data: false
      }).then(function(resp) {
          console.log('Succeeded retrieving User Profile' + JSON.stringify(resp));
          deferred.resolve(resp);
        }, function(resp) {
          console.log('Failed to retrieve Profile ' + JSON.stringify(resp));
        });
      
      return deferred.promise;
    },
    updateUser: function(id, userdata) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: 'http://' + serveraddress + '/updateuser.php?userid='+id,
        params: {},
        data: userdata}).then(function(resp) {
          console.log('Updated user information' + JSON.stringify(resp));
          deferred.resolve(resp);
        }, function(resp) {
          console.log('Failed to update user information');
          deferred.reject(resp);
        })
        return deferred.promise;
    },
    createRequest: function(id, requestdata) {
      var deferred = $q.defer();
      var idparam = $httpParamSerializerJQLike({'userid':id});
      $http({
        method: 'POST',
        url: 'http://' + serveraddress + '/newrequest.php?'+idparam,
        params: {},
        data: requestdata}).then(function(resp) {
          console.log('Request creation success: ' + JSON.stringify(resp));
          deferred.resolve(resp);
        }, function(resp) {
          console.log('Request creation failed');
          deferred.reject(resp);
        })
        return deferred.promise;
    },
    getRequests: function(id) {
      var deferred = $q.defer();
      var idparam = $httpParamSerializerJQLike({'userid':id});
      $http({
        method: 'GET',
        url: 'http://' + serveraddress + '/request.php?'+idparam,
        //headers: {'Access-Control-Request-Method': 'GET'},
        params: {},
        data: false
      }).then(function(resp) {
        console.log('Retrieved Requests: ' + JSON.stringify(resp));
        deferred.resolve(resp);
      }, function(resp) {
        console.log('Retrieving Requests Failed.');
        deferred.reject(resp);
      })
      return deferred.promise;
    },
    getRequestsNearMe: function(id, radius, latitude, longitude) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: 'http://' + serveraddress + '/request.php',
        params: {},
        data: false
      }).then(function(resp) {
        console.log('Calculating distance');
        console.log(resp);
        var requests = resp['data'];
        var i;
        var out = [];
        var count = 0;
        var radiusInMeters = radius * 1609.34;
        for(i = 0; i < requests.length; i++) {
          var request = requests[i];
          if(!request['userid'].localeCompare(id) || !request['open']) {
            console.log('skip for ' + request['userid']+' currid: ' +id+' open: '+request['open']);
            continue;
          }
          //Utilize Haversine Formula
          var earthsradius = 6371000; //meters
          var latitude2 = request['latitude'];
          var longitude2 = request['longitude'];
          var phi1 = latitude*(Math.PI/180);
          var phi2 = (latitude2)*(Math.PI/180);
          var deltaphi = (latitude2-latitude)*(Math.PI/180);
          var deltalambda = (longitude2-longitude)*(Math.PI/180);
          console.log('latitude: ' + latitude + ' longitude: ' + longitude + ' latitude2: ' + latitude2 + ' longitude2: ' + longitude2);
          console.log('phi1: ' + phi1 + ' phi2: ' + phi2 + ' deltaphi: ' + deltaphi + ' deltalambda: ' + deltalambda);
          var a = Math.sin(deltaphi/2)*Math.sin(deltaphi/2)+Math.cos(phi1)*Math.cos(phi2)*Math.sin(deltalambda/2)*Math.sin(deltalambda/2);
          var c = 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
          var d = earthsradius*c;

          if(d <= radiusInMeters) {
            request['distance'] = (d/1609.34);
            out[count] = request;
            count++;
          }
        }
        deferred.resolve(out);
      })
    return deferred.promise;
    },
    acceptRequest: function(id, hash) {
      var deferred = $q.defer();
      var idparam = $httpParamSerializerJQLike({'userid':id});
      $http({
        method: 'POST',
        url: 'http://' + serveraddress + '/maketransaction.php?'+idparam,
        params: {},
        data: {'hash':hash}
      }).then(function(resp) {
        console.log('Transaction response: ' + JSON.stringify(resp));
        deferred.resolve(resp);
      }, function(resp) {
        console.log('New Transaction Failed.');
        deferred.reject(resp);
      })
      return deferred.promise;
    },
    updateRequest: function(hash) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: 'http://' + serveraddress + '/updaterequest.php',
        params: {},
        data: {'hash':hash}
      }).then(function(resp) {
        console.log('Request was updated successfully' + JSON.stringify(resp));
        deferred.resolve(resp);
      }, function(resp) {
        console.log('Failed to update request.' + JSON.stringify(resp));
        deferred.reject(resp);
      })
      return deferred.promise;
    },
    updateTransaction: function(hash) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: 'http://' + serveraddress + '/updatetransaction.php',
        params: {},
        data: {'hash':hash}
      }).then(function(resp) {
        console.log('Transaction was updated successfully' + JSON.stringify(resp));
        deferred.resolve(resp);
      }, function(resp) {
        console.log('Failed to update transaction.' + JSON.stringify(resp));
        deferred.reject(resp);
      })
      return deferred.promise;
    },
    getTransactions: function(id) {
      var deferred = $q.defer();
      var idparam = $httpParamSerializerJQLike({'userid':id});
      $http({
        method: 'GET',
        url: 'http://' + serveraddress + '/transactions.php?'+idparam,
        //headers: {'Access-Control-Request-Method': 'GET'},
        params: {},
        data: false
      }).then(function(resp) {
        console.log('Retrieved Transactions: ' + JSON.stringify(resp));
        deferred.resolve(resp);
      }, function(resp) {
        console.log('Retrieving Transactions Failed.');
        deferred.reject(resp);
      })
      return deferred.promise;
    },
    createConversation: function(id,convdata) {
      var deferred = $q.defer();
      var idparam = $httpParamSerializerJQLike({'userid':id});
      $http({
        method: 'POST',
        url: 'http://' + serveraddress + '/newconversation.php?'+idparam,
        params: {},
        data: convdata
      }).then(function(resp) {
        console.log('Create Conversation response: ' + JSON.stringify(resp));
        deferred.resolve(resp);
      }, function(resp) {
        console.log('New Conversation Failed.');
        deferred.reject(resp);
      })
      return deferred.promise;
    },
    getConversations: function(id) {
      var deferred = $q.defer();
      var idparam = $httpParamSerializerJQLike({'userid':id});
      $http({
        method: 'GET',
        url: 'http://' + serveraddress + '/conversation.php?'+idparam,
        params: {},
        data: false
      }).then(function(resp) {
        console.log('Received conversations: ' + JSON.stringify(resp));
        deferred.resolve(resp);
      }, function(resp) {
        console.log('Get conversations Failed.');
        deferred.reject(resp);
      })
      return deferred.promise;
    },
    getMessages: function(id, hash, index) {
      var deferred = $q.defer();
      var urlparam = $httpParamSerializerJQLike({'userid':id, 'hash':hash, 'index':index});
      $http({
        method: 'GET',
        url: 'http://' + serveraddress + '/messages.php?'+urlparam,
        params: {},
        data: false
      }).then(function(resp) {
        console.log('Received current messages: ' + JSON.stringify(resp));
        deferred.resolve(resp);
      }, function(resp) {
        console.log('Get conversations Failed.');
        deferred.reject(resp);
      })
      return deferred.promise;
    },
    sendMessage: function(msg) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: 'http://' + serveraddress + '/newmessage.php',
        params: {},
        data: msg
      }).then(function(resp) {
        console.log('New message response: ' + JSON.stringify(resp));
        deferred.resolve(resp);
      }, function(resp) {
        console.log('New message Failed.');
        deferred.reject(resp);
      })
      return deferred.promise;
    }

	};
}]);

app.service('ItemsModel', ['$http','$q',function ($http,$q) {

    var serveraddress = '143.215.55.146';

    return {
      getItems: function(userid) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: 'http://' + serveraddress + '/items.php?userid='+userid,
        params: {},
        data: false
      }).then(function(resp) {
          console.log('Succeeded retrieving ingredients ' + JSON.stringify(resp));
          deferred.resolve(resp);
        }, function(resp) {
          console.log('Failed to retrieve ingredients ' + JSON.stringify(resp));
          return JSON.stringify(resp);
        });
      
      return deferred.promise;

      },
      addItems: function(userid, items) {
        $http({
        method: 'POST',
        url: 'http://' + serveraddress + '/newitems.php?userid='+userid,
        data: items
      }).then(function(resp) {
          console.log('succeeding in inserting items into db ' + JSON.stringify(resp));
        }, function(resp) {
          console.log('Failed to insert items into db ' + JSON.stringify(resp));
        });
      return;
      }
    }

}]);
