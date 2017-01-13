angular.module('chefsource.controllers', [])

.controller('RegistrationCtrl', ['$scope','UsersModel','$resource','$q','$rootScope','GeolocationInitializer','$state',function($scope,UsersModel,$resource,$q,$rootScope,GeolocationInitializer,$state) {
  $rootScope.position = [];

  $rootScope.promise = GeolocationInitializer.initialize();

  $scope.create = function(user) {
    //var username;
    //WHILE COMCAST IS BEING A SHITLORD
    //var username='gtyellowjacket';
    //var firstName='Zack';
    //var lastName='Tufford';
    //var email='ztufford3@gatech.edu';
    //var street='6040 Coldwater Point';
    //var city='Johns Creek';
    //var zip='30097';
    //var password='password';
    //var diet='Lactose Intolerantoweijfaiow;ejgo;wirgjbo;eitbnetiogo;ijjfwo';
    //var state='Georgia';

//needs user.
      var body = {
        'user': {
          'username': user.username,
          'firstName': user.firstName,
          'lastName': user.lastName,
          'email': user.email,
          'appName': 'Chefsource',
          'anonymous': true,
          'language': 'en'
        },
        'location': {
          'name': 'My house',
          'type': 10,
          'timezone': {
            'id': 'US/Pacific'
          },
          'addrStreet1': user.street,
          'addrCity': user.city,
          'state': {
            'id': 1
          },
          'country': {
            'id': 1
          },
          'zip': user.zip
        }
    };

    //needs user. again
    var userdata = {'username':user.username,
    'password':user.password,
    'first':user.firstName,
    'last':user.lastName,
    'email':user.email,
    'street':user.street,
    'city':user.city,
    'state':user.state,
    'zip':user.zip,
    'userid':'',
	  'apikey':'',
    'diet':user.diet
    };

    //hard code temporary
    userdata['apikey']='wofjo94jo382onggor3go3h3480248rgj';
    userdata['userid']= Math.floor(Math.random() * 1000000);
/*
    var promise = UsersModel.newUser(body, user.userdata);

    promise.then(function(resp) {
      
      console.log('create user success: ' + JSON.stringify(resp));
      user.userdata['userid'] = resp['userId'];
      user.userdata['apikey'] = resp['key'];
      console.log('userid: ' + user.userdata['userid']);
      console.log('response apikey: ' + resp['key']);
      console.log('apikey: ' + user.userdata['apikey']);
      //$rootScope.currentUser = user.userdata['userid'];
      //console.log($rootScope.currentUser);
      
      UsersModel.currentUser = user.userdata;
      UsersModel.initializeUserInDatabase(user.userdata);
    }, function(resp) {
    	console.log('User creation failed.');
    })*/

  //TEMPORARY
  UsersModel.currentUser=userdata;
  UsersModel.initializeUserInDatabase(userdata).then(function(resp) {
    console.log('INITIALIZED');
    $state.go('bulletin');
  });
  }

}])

.controller('LoginCtrl', ['$scope','$resource','UsersModel',function($scope,$resource,UsersModel) {
  $scope.login = function(username, password) {
    var promise = UsersModel.loginUser(username, password);
    promise.then(function(resp) {
      console.log('Login successful! ' + JSON.stringify(resp));
    }, function(resp) {
      console.log('Login unsuccessful.');
    })
  }
}])

.controller('ProfileCtrl', ['UsersModel','$scope','$state','$stateParams','$rootScope','$q','$timeout','ItemsModel','$httpParamSerializer',function(UsersModel,$scope, $state, $stateParams,$rootScope,$q,$timeout, ItemsModel,$httpParamSerializer) {
  

  //Use id to pull relevant information from database to page
  //If no id is supplied, it should fill in the user's information
  


  //UsersModel.getProfileInfo($scope.id);
  $scope.back = function() {
    $state.go('bulletin');
  }

  $scope.$on('$stateChangeSuccess', function() {
  $scope.id = $stateParams.profileId;
  console.log("STATE PARAMS: " + $stateParams.profileId);
  if(!$scope.id) {
    $scope.id = UsersModel.currentUser['userid'];
  }
    var datapromise = UsersModel.getProfileInfo($scope.id,['firstname', 'lastname','city','state','zip','diet','shared','received']);
    datapromise.then(function(resp) {
      var userdata = resp['data'];

      $scope.fullname = userdata['firstname'] + ' ' + userdata['lastname'];
      $scope.loc = userdata['city'] + ', ' + userdata['state'] + ' ' + userdata['zip'];
      $scope.diet = userdata['diet'];
      $scope.itemsshared = userdata['shared'];
      $scope.itemsreceived = userdata['received'];
      if(!$stateParams.profileId)
        UsersModel.currentUser = userdata;
      userdata['userid'] = $scope.id;
      console.log(userdata['diet']);
      ItemsModel.getItems(userdata['userid']).then(function(resp) {
        var output = [];
        var parseResponse=JSON.stringify(resp);
        var arr=resp['data'];
        var i;
        for(i = 0;i<arr.length;i++) {
          output[i] = (arr[i])['item'];
        }

        $scope.pantrylist = output;
      })
      

    })
  });


}])

.controller('EditCtrl', ['$scope','$state','UsersModel',function($scope,$state,UsersModel) {
  $scope.back = function() {
    $state.go('profileOwn');
  };

  $scope.updateRestrictions = function(dietRestrictions) {
    
    UsersModel.updateUser(UsersModel.currentUser['userid'], {'diet':dietRestrictions}).then(function(resp) {
      var arr = resp['data'];
      var newdietrestr = arr['diet'];
      console.log('new diet string: ' + newdietrestr);
      UsersModel.currentUser['diet'] = newdietrestr;
      $state.go('profileOwn');
    }, function() {
      console.log('failed to update diet restrictions');
    })
  };

  $scope.$on('$stateChangeSuccess', function() {
    var keys = ['diet'];
    var datapromise = UsersModel.getProfileInfo(UsersModel.currentUser['userid'], keys);
    datapromise.then(function(resp) {
      var newrestrictions = JSON.stringify(resp['data']);
      console.log('oewijfoiewjoj ' + JSON.stringify(resp));
      $scope.dietRestrictions = JSON.stringify(resp['data'])['diet'];
    }, function(resp) {
      console.log('Failed to display user diet restritions for editing');
    })
  });

}])

.controller('ChatroomCtrl', ['$scope','$state','$stateParams',function($scope, $state, $stateParams) {

  $scope.$on('$stateChangeSuccess', function() {
    var hash = $stateParams.chatId;
    $state.myIndex = 0;
    $scope.messages = [];
    $scope.curr = {'userid':UsersModel.currentUser['userid'], 'firstname': UsersModel.currentUser['firstName']};
    $scope.other = {'userid': $stateParams.otheruser, 'firstname':'placeholder'};
    UsersModel.getMessages($scope.curr['userid'], hash, -1).then(function(resp) {
      var msg = resp['data'];
      var i;
      for(i = 0; i < $scope.messages.length; i++) {
        $scope.messages[i] = {user: msg['firstnameSender'], index: msg['convindex'], text: msg['message']};
      }
      $scope.myIndex = i;
    })
  });

  $scope.send = function(text) {
    var promise = UsersModel.sendMessage({'useridSender':$scope.curr['userid'],
                                          'useridReceiver':$scope.other['userid'],
                                          'firstnameSender':$scope.curr['firstname'],
                                          'firstnameReceiver':$scope.other['firstname'],
                                          'hash':hash,
                                          'message':text})
  }

  $scope.back = function() {
    $state.go('conversations');
  };

}])

.controller('SettingsCtrl', function($scope, $state) {
  $scope.back = function() {
    $state.go('bulletin');
  };
})

.controller('ConversationsCtrl', ['$scope','$state','$stateParams','UsersModel','$q',function($scope, $state, $stateParams,UsersModel,$q) {
  $scope.$on('$stateChangeSuccess', function() {
    $scope.conversations = [];
    var userid = UsersModel.currentUser['userid'];
    var promise = UsersModel.getConversations(userid);
    promise.then(function(resp) {
      var convs = resp['data'];
      var i;
      for(i = 0; i < convs.length; i++) {
        var conv = convs[i];
        console.log('userid: ' + userid + ' other userid: ' + conv['useridSh']);
        $scope.conversations[i] = { otherUser: userid==(conv['useridRec'])?conv['firstnameRec']:conv['firstnameSh'],
                                    chatid: conv['hash']};
      }
    });
  })

    $scope.back = function() {
    $state.go('bulletin');
  };

}])


.controller('BulletinCtrl', ['$scope','$state','$rootScope','UsersModel','$q',function($scope,$state,$rootScope,UsersModel,$q) {
  

  //Notes array
  //$scope.notes = [];

  //I don't want to make a habit of passing things via the root scope, but this seemed like the most efficient,
  //reliable method to start obtaining the geolocation as early as possible and utilize it in another controller
  //asynchronously without doing something sloppy like setTimeout.
  $scope.$on('$stateChangeSuccess', function() {
    $scope.notes = [];
  $rootScope.promise.then(function(resp) {
    var defaultradius = 50; //miles
    $rootScope.position['latitude'] = resp.coords.latitude;
    $rootScope.position['longitude'] = resp.coords.longitude;
    UsersModel.getRequestsNearMe(UsersModel.currentUser['userid'],defaultradius,$rootScope.position['latitude'],$rootScope.position['longitude']).then(function(resp) {
      console.log('Updating Bulletin');
      var i;
      for(i = 0; i < resp.length; i++) {
        var request = resp[i];
        if(!request['open'])
          continue;
        $scope.notes[i] = {user: request['username'],userid:request['userid'], type: 'Request',timer:request['time'],detail: (request['items']).toString(),'hash':request['hash'],open:request['open'],status:request['open']==1?'[Open]':'[Closed]'};
      }
    });
  });
})
  console.log('IN BULLETIN');
//});

  $scope.profile = function() {
    $state.go('profileOwn');
  };
  $scope.conversations = function() {
    $state.go('conversations');
  };
  $scope.settings = function() {
    $state.go('settings');
  };
  $scope.transactions = function() {
    $state.go('transactions');
  };
  $scope.logout = function() {
    $state.go('login');
    //Logout function
  };
  /*$scope.dismiss = function(note) {
    var i;
    for(i = 0; i < $scope.notes.length; i++) {
      console.log('trying to dismiss: ' + note['hash']);
      console.log('current hash: ' + ($scope.notes[i])['hash']);
      if(($scope.notes[i])['hash'] === note['hash'])
        ($scope.notes).splice(i,1);
    }
  };*/
  $scope.viewProfile = function(userid) {
    $state.go('profileOther/:profileId',{profileId:userid});
  }
  
  $scope.accept = function(note) {
    var promise = UsersModel.acceptRequest(UsersModel.currentUser['userid'],note['hash']);
    note['open'] = 0;
    note['status'] = '[Closed]';
    promise.then(function(resp) {
      if(!resp)
        alert('Sorry, that request has closed!');
      else {
        UsersModel.createConversation(UsersModel.currentUser['userid'],{'hash':note['hash'],'userid':note['userid']})
        .then(function(resp) {
          //todo
        })
      }
    })
  }

}])

.controller('PantryCtrl', ['$scope','$state','$q','$http','UsersModel','ItemsModel',function($scope, $state, $q, $http,UsersModel,ItemsModel) {
  $scope.tagsarr = [];
  
  $scope.$on('$stateChangeSuccess', function() {
    $scope.tagsarr = [];
    $scope.tags = [];
  })

  $scope.loadTags = function($query) {

    return $http.get('js/food.json', { cache: true}).then(function(response) {
      var food = response.data;
      //console.log('guesses: '+JSON.stringify(response.data));
      return food.filter(function(food) {
        return food.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    });
  };

  $scope.pushItem = function(tag) {
    var ingredient = tag;
    $scope.tagsarr.push(ingredient);
    return true;
  }

  $scope.popItem = function(tag) {
    var ingredient = tag;
    $scope.tagsarr.pop(ingredient);
    return true;
  }

  $scope.addItems = function(items) {
    var userid = UsersModel.currentUser['userid'];
    console.log('INTO ADD ' + userid);
    ItemsModel.addItems(userid, items);
    $state.go('profileOwn');
  }

  $scope.back = function() {
    $state.go('profileOwn');
  }


}])

.controller('RequestCtrl', ['$scope','$state','$http','$q','UsersModel','$rootScope',function($scope, $state,$http,$q,UsersModel,$rootScope) {
  
  $scope.tagsarr = [];
  $scope.maxLength = 250;
  $scope.req = {duration:'1 hour'};

  $scope.$on('$stateChangeSuccess', function() {
    $scope.tagsarr = [];
    $scope.tagss = [];
    $scope.reqnote=null;
    $scope.req.duration='1 hour'
  })

  $scope.loadTags = function($query) {

    return $http.get('js/food2.json', { cache: true}).then(function(response) {
      var food = response.data;
      //console.log('guesses: '+JSON.stringify(response.data));
      return food.filter(function(food) {
        return food.name.toLowerCase().indexOf($query.toLowerCase()) != -1;
      });
    });
  };

  $scope.pushItem = function(tag) {
    var ingredient = tag;
    $scope.tagsarr.push(ingredient);
    return true;
  }

  $scope.popItem = function(tag) {
    var ingredient = tag;
    $scope.tagsarr.pop(ingredient);
    return true;
  }

  $scope.back = function() {
    $state.go('bulletin');
  };
  $scope.makeRequest = function() {
    if(!$scope.req.duration)
      return;
    var user = UsersModel.currentUser;
    UsersModel.createRequest(user['userid'],
      {'items':$scope.tagsarr,'location':[user['street'],user['city'],user['state'],user['zip'],$rootScope.position['latitude'],$rootScope.position['longitude']],'duration':$scope.req.duration,'note':$scope.reqnote,'username':user['username']})
    .then(function(resp) {
      console.log('Request made: ' + JSON.stringify(resp));
      $scope.tagsarr = [];
      $scope.tagss = [];
      $scope.reqnote=null;
      $scope.req.duration='1 hour'
    }, function(resp) {
      console.log('Request failed.');
    })
  };

}])

.controller('TransactionsCtrl', ['$scope','$state','$q','UsersModel',function($scope, $state,$q,UsersModel) {
  //Notes array
  $scope.transactions = [];

  $scope.$on('$stateChangeSuccess', function() {
    $scope.transactions = [];
    UsersModel.getRequests(UsersModel.currentUser['userid']).then(function(resp) {
      var requests = resp['data'];
      var i;
      var myRequests = 0;
      for(i = 0; i < requests.length; i++) {
        var request = requests[i];
        if(request['userid'].localeCompare(UsersModel.currentUser['userid']))
          continue;
        $scope.transactions[i] = {items: (request['items']).toString(), location: request['street'], date: request['date'], note: request['note'], status: request['open']==0?'Closed':'Open',open:request['open'],type:'Request',hash:request['hash']};
      }
      UsersModel.getTransactions(UsersModel.currentUser['userid']).then(function(resp) {
        var transctns = resp['data'];
        var j;
        for(j = 0; j < transctns.length; j++) {
          var transaction = transctns[j];
          $scope.transactions[i+j] = {items: (transaction['items']).toString(), date: transaction['dateof'], note: transaction['note'], status: transaction['open']==0?'Closed':'Open',open:transaction['open'],type:'Transaction',hash:transaction['hash']}
        }
      })
    })
  });

  $scope.dismiss = function(transaction) {
    if(!transaction['type'].localeCompare('Request')) {
      UsersModel.updateRequest(transaction['hash']).then(function(resp) {
        var i;
        //remove the request from the list of transactions
        for(i = 0; i < $scope.transactions.length; i++) {
          if($scope.transactions[i] === transaction)
            $scope.transactions.splice(i,1);
          //update any relative transaction
          if(i<$scope.transactions.length&&!($scope.transactions[i])['hash'].localeCompare(transaction['hash']) && !($scope.transactions[i])['type'].localeCompare('Transaction'))
            ($scope.transactions[i])['status'] = 'Deleted';
        }
      })
    } else {
      //if just abandoning a transaction
      UsersModel.updateTransaction(transaction['hash']).then(function(resp) {
        if(transaction['open']==1) {
          transaction['status']='Deleted';
          transaction['open']=0;

          var k;
          for(k = 0; k < $scope.transactions.length; k++) {
            if(!($scope.transactions[k])['type'].localeCompare('Request') && !($scope.transactions[k])['hash'].localeCompare(transaction['hash']) && ($scope.transactions[k])['open']==0) {
              ($scope.transactions[k])['open'] = 1;
              ($scope.transactions[k])['status'] = 'Open';
            }
          }
        }

      })
    }
  };
  $scope.respond = function() {
    //Respond to note
  };
  $scope.back = function() {
    $state.go('bulletin');
  };
}])