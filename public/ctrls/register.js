angular.module('complaintApp')
	.controller('registerCtrl', function ($scope, $rootScope, $location, $http) {
		$rootScope.checkAuth();
		$scope.register = function () {
			if ($scope.user.pass1 == $scope.user.pass2) {
				$scope.data = {
					email: $scope.user.email,
					password: $scope.user.pass1
				};
				$http({
					method: 'POST',
					url: $rootScope.apiUrl + 'user/register',
					data: $scope.data
				}).then(function (res) {
					console.log(res)
					if (res.data.status == true) {
						swal({
							title: 'Success',
							text: res.data.msg,
							type: 'success',
							showConfirmButton: false
						});
					} else {
						swal({
							title: 'Failed',
							text: res.data.msg,
							type: 'error',
							showConfirmButton: true
						});
					}
				}, function (res) {
					swal("Fail", "Some error occurred, try again.", "error");
				});
			} else {
				swal("Fail", "Password's are not same, try again.", "error");
			}
		};
	});
