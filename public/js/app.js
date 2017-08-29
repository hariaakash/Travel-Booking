var app = angular.module("tourismApp", []);

app.controller('globalCtrl', function ($scope, $scope, $location, $http, $window, $timeout) {
	$scope.apiUrl = 'http://localhost:3000/';
	$scope.logout = function () {
		Cookies.remove('authkey');
		$window.location.reload();
	};
	$scope.openModal = function (x) {
		$('#' + x).modal('show');
	};
	$scope.checkAuth = function () {
		if (Cookies.get('authkey')) {
			$scope.authkey = Cookies.get('authkey');
			$http({
					method: 'GET',
					url: $scope.apiUrl + 'user',
					params: {
						authkey: $scope.authkey
					}
				})
				.then(function (res) {
					if (res.data.status == true) {
						$scope.homeData = res.data.data;
						var booking = $scope.homeData.booking;
						var payment = $scope.homeData.payment;
						for (i = 0; i < booking.length; i++) {
							if (booking[i].r == 1) {
								var q = booking[i].source;
								booking[i].source = booking[i].destination;
								booking[i].destination = q;
							}
							booking[i].amount = payment[i].amount;
						}
						$scope.homeData.booking = booking;
					} else {
						$scope.logout();
						swal({
							title: 'Failed',
							text: res.data.msg,
							type: 'error',
							timer: 2000,
							showConfirmButton: true
						});
					}
				}, function (res) {
					$('#btnLoad').button('reset');
					swal("Fail", "Some error occurred, try again.", "error");
				});
			$scope.signStatus = true;
		} else {
			$scope.authkey = '';
			$scope.signStatus = false;
			$('#login').modal({
				backdrop: 'static',
				keyboard: false
			});
			$scope.openModal('login');
		}
	};
	$scope.checkAuth();
	$scope.login = function (x) {
		$http({
				method: 'POST',
				url: $scope.apiUrl + 'user/login',
				data: {
					email: x.email,
					password: x.password
				}
			})
			.then(function (res) {
				if (res.data.status == true) {
					var authkey = res.data.authkey;
					Cookies.set('authkey', authkey);
					$('#login').modal('hide');
					swal({
						title: 'Success',
						text: 'You have successfully Signed In !!',
						type: 'success',
						showConfirmButton: true
					});
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
	$scope.addNewSD = function (x) {
		x.authkey = $scope.authkey;
		$http({
				method: 'POST',
				url: $scope.apiUrl + 'user/addSD',
				data: x
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
	}
	$scope.bookModal = function (x) {
		$('#book').modal('show');
		$scope.book = x;
	};
	$scope.swapSD = function () {
		var t = $scope.book.source;
		$scope.book.source = $scope.book.destination;
		$scope.book.destination = t;
	}
	$scope.bookTicket = function (x, y) {
		x.sdid = $scope.book.id;
		x.tid = x.transport.id;
		x.amount = y;
		x.authkey = $scope.authkey;
		$http({
				method: 'POST',
				url: $scope.apiUrl + 'user/addB',
				data: x
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
	$scope.cancelTicket = function (x) {
		var data = {};
		data.id = x;
		data.authkey = $scope.authkey;
		$http({
				method: 'POST',
				url: $scope.apiUrl + 'user/cancelB',
				data: data
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
