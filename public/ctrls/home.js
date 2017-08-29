angular.module('complaintApp')
	.controller('homeCtrl', function ($scope, $rootScope, $http, $location, $state, $timeout, $window) {
		$rootScope.checkAuth();
		$scope.getCategories = function () {
			$http({
					method: 'GET',
					url: $rootScope.apiUrl + 'user/categories'
				})
				.then(function (res) {
					if (res.data.status == true) {
						$scope.categories = res.data.data;
					} else {
						swal({
							title: 'Failed',
							text: res.data.msg,
							type: 'error',
							timer: 2000,
							showConfirmButton: true
						});
					}
				}, function (res) {
					swal("Fail", "Some error occurred, try again.", "error");
				});
		};
		$scope.getCategories();
		$scope.addComplaint = function () {
			console.log($scope.addComplaintForm.scat.id)
			$scope.data = {
				title: $scope.addComplaintForm.title,
				des: $scope.addComplaintForm.des,
				sid: $scope.addComplaintForm.scat.id,
				authkey: $rootScope.authkey,
			};
			$http({
					method: 'POST',
					url: $rootScope.apiUrl + 'user/createComplaint',
					data: $scope.data
				})
				.then(function (res) {
					if (res.data.status == true) {
						swal({
							title: 'Success',
							text: res.data.msg,
							type: 'success',
							showConfirmButton: false
						});
						$timeout(function () {
							$window.location.reload();
						}, 2000);
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
		};
	});
