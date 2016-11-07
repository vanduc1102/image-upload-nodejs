var app = angular.module('app', []);
app.controller('MainCtrl', function ($http ,$scope) {
	$scope.images=[];
    $scope.onUpload = function($event){
    	$http.post('/upload', {
    		files: $scope.files
    	},{
    		headers:{
    			"content-type": 'multipart/form-data; charset=utf-8',
    			"accept":'application/json, text/javascript'
    		}
    	}).then(function(response){
    		console.log(response);
    	},function(error){
    		console.log(error);
    	});
    }
});
