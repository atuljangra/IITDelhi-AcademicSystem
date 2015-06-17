angular.module('nodeAcad', [])

.controller('mainController', function($scope, $http) {
    $scope.formData = {};
    $scope.facultyData = {};
    
    // Get Faculty name
    $http.get('/api/faculty')
    .success(function(data) {
        $scope.facultyData = data;
        console.log(data);
    })
    
    .error(function(error) {
            console.log('Error:' + error);
    });

    $scope.createFaculty = function(facultyID) {
        console.log($scope.formData.name + " " +  $scope.formData.dept);
        $http.post('/api/faculty', $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.facultyData = data;
                console.log(data);
            })
            .error(function(error) {
                console.log('Error: ' + error);
            });
    };

    $scope.deleteFaculty = function(facultyID) {
        $http.delete('/api/faculty/' + facultyID)
            .success(function(data) {
                $scope.facultyData = data;
                console.log('Delete: ' + data);
            })
            .error(function(data) {
                console.log('Error: ' + error);
            });
    };
});


