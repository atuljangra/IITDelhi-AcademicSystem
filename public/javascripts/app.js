angular.module('nodeAcad', [])

.controller('mainController', function($scope, $http) {
    $scope.formData = {};
    $scope.acadData = {};
                
    $http.get('/api/faculty')
    .success(function(data) {
        $scope.acadData = data;
        console.log(data);
    })
    
    .error(function(error)
        {
            console.log('Error:' + error);
        });
});

