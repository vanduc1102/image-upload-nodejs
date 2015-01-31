var app = angular.module('app', []);
app.controller('MainCtrl', function ($scope, fileReader) {
	$scope.images=[];
	
	$scope.getFile = function () {
        fileReader.readAsDataUrl($scope.files, $scope).then(function(imageDataURLs) {
			for(var i = 0; i < imageDataURLs.length ; i ++){
				var image ={
					"url":imageDataURLs[i]
				};
				$scope.images.push(image);
			}    
			
		});
    };
});
app.factory("fileReader",["$q", "$log",function ($q, $log) {
	var onLoad = function(reader, deferred, scope) {
		return function () {
			scope.$apply(function () {
				deferred.resolve(reader.result);
			});
		};
	};

	var onError = function (reader, deferred, scope) {
		return function () {
			scope.$apply(function () {
				deferred.reject(reader.result);
			});
		};
	};

	var onProgress = function(reader, scope) {
		return function (event) {
			scope.$broadcast("fileProgress",
				{
					total: event.total,
					loaded: event.loaded
				});
		};
	};

	var getReader = function(deferred, scope) {
		var reader = new FileReader();
		reader.onload = onLoad(reader, deferred, scope);
		reader.onerror = onError(reader, deferred, scope);
		reader.onprogress = onProgress(reader, scope);
		return reader;
	};

	var readOneFileAsDataURL= function (file, scope) {
		var deferred = $q.defer();
		var reader = getReader(deferred, scope);         
		reader.readAsDataURL(file);
		return deferred.promise;
	};
	var readManyFileAsDataURL = function(files, scope){
		var promises=[];
		for(var i = 0 ; i < files.length; i ++){
			promises.push(readOneFileAsDataURL(files[i], scope));
		}
		return $q.all(promises);
	};
	return {
		readAsDataUrl: readManyFileAsDataURL  
	};
}]);
app.directive("ngFileSelect",function(){    
  return {
    link: function($scope,el){          
      el.bind("change", function(e){          
        $scope.files = (e.srcElement || e.target).files;
        $scope.getFile();
      });          
    }        
  }
});