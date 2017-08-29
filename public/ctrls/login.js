angular.module('complaintApp')
	.controller('loginCtrl', function ($scope, $rootScope, $http, $location, $state) {
		$rootScope.checkAuth();
		$scope.login = function (x) {
			console.log(x)
//			$http({
			//				method: 'POST',
			//				url: $rootScope.apiUrl + 'user/login',
			//				data: $scope.user
			//			}).then(function (res) {
			//				if (res.data.status == true) {
			//					var authkey = res.data.authkey;
			//					Cookies.set('authkey', authkey);
			//					console.log(authkey)
			//					$location.path('/home');
			//					swal({
			//						title: 'Success',
			//						text: 'You have successfully Signed In !!',
			//						type: 'success',
			//						showConfirmButton: true
			//					});
			//				} else {
			//					swal({
			//						title: 'Failed',
			//						text: res.data.msg,
			//						type: 'error',
			//						timer: 2000,
			//						showConfirmButton: true
			//					});
			//				}
			//			}, function (res) {
			//				swal("Fail", "Some error occurred, try again.", "error");
			//			});
		};
	});
