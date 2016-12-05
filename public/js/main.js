var app = angular.module('app', []);
app.controller('MainCtrl', function ($http ,$scope) {
	$scope.images=[];
    $scope.onFileUpload = function($event){
        $event.preventDefault();
    	var fd = new FormData();    
        fd.append( 'files', $('#input-image')[0].files );
        $.ajax({
          url: '/upload',
          data: fd,
          processData: false,
          contentType: false,
          type: 'POST',
          success: function(data){
            alert(data);
          }
        });
    }
});
