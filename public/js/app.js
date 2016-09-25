var app = angular.module('chatApp', []);

app.controller('MessageCtrl', ['$scope', '$interval', '$http',
	function($scope, $interval, $http) {
		
		$scope.messages = [];
		$scope.init = ()=>{
			$scope.lastPollingTS = new Date()
			$scope.generateNewUser();
			$scope.initPolling();
		}
		$scope.generateNewUser = ()=>{
			$http.get('api/generateNewUser')
		      	.then( res=>{
		      		console.log('res.data.newUser='+res.data.newUser)
		          	$scope.nickname = 'Guest '+res.data.newUser;
		        }, resErr=>{
		          	// $scope.messages = resErr.data || 'Request failed';
		          	$scope.status = resErr.status;
		          	console.error($scope.messages +' '+$scope.status)
		      });
		}
		$scope.initPolling = ()=>{
			$scope.intervalInstance = $interval(function() {
              console.log('retreive messages')
              $scope.fetchMessages()
          	}, 1500);
		}
		$scope.fetchMessages = ()=>{
	      $http.get('api/getMessages', {params: {'fetchMsgsFrom': $scope.lastPollingTS, 'nickname': $scope.nickname}})
	      	.then( res=>{
	      		$scope.lastPollingTS = new Date()
	      		if (!!res.data){
	      			for(i in res.data){
	      				$scope.messages.push(res.data[i].messages)
	      			}
	          	}
	          	
	        }, resErr=>{
	          	// $scope.messages = resErr.data || 'Request failed';
	          	$scope.status = resErr.status;
	          	console.error('error: '+$scope.messages +' '+$scope.status)
	          	$scope.stopPolling();
	      });
		}
		$scope.stopPolling = ()=>{
			$scope.intervalInstance = null;
		}
		$scope.sendMessage = ()=>{
			var newMessage = {
				name : $scope.nickname,
				message : $scope.myNewMessage
			}
			$http.post('/api/newMessage', {msg : newMessage})
				.then( res=>{
					console.log(newMessage)
					console.log($scope.messages)
					$scope.messages.push(newMessage);
					$scope.myNewMessage = '';
				}, resErr=>{
	          		$scope.status = resErr.status;
	          		// alert(resErr)
				})
		}
}]);