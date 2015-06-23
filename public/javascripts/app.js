var nodeAcad = angular.module('nodeAcad', []);

var get_func = function($scope, $http) {

    var ret_func;
    if($scope.is_faculty) {
        ret_func = $http.get('/api/faculty')
    }
    else if($scope.is_students) {
        ret_func = $http.get('/api/students');
    }
    else {
        ret_func = $http.get('/api/courses');
    }
    ret_func.success(function(data) {
        $scope.list_data = data;
    } )
    ret_func.error(function(error) {
        console.log('Error: ' + error);
    });

}

var add_func = function($scope, $http) {

    var ret_func;
    console.log($scope.formData);
    if($scope.is_faculty) {
        ret_func = $http.post('/api/faculty', $scope.formData);
    }
    else if($scope.is_students) {
        ret_func = $http.post('/api/students', $scope.formData);
    }
    else {
        ret_func = $http.post('/api/courses', $scope.formData);
    }
    ret_func.success(function(data) {
        $scope.formData = {};
        $scope.list_data = data;
        console.log(data);
    })
    ret_func.error(function(error) {
        console.log('Error: ' + error);
    });

}

var delete_func = function($scope, $http, id) {

    var ret_func;
    if($scope.is_faculty) {
        ret_func = $http.delete('/api/faculty/' + id);
    }
    else if($scope.is_students) {
        ret_func = $http.delete('/api/students/' + id);
    }
    else {
        ret_func = $http.delete('/api/courses/' + id);
    }
    ret_func.success(function(data) {
        $scope.list_data = data;
        console.log(data);
    })
    ret_func.error(function(error) {
        console.log('Error: ' + error);
    });

}

var modify_func = function($scope, $http, id) {

    var ret_func;
    if($scope.is_faculty) {
        ret_func = $http.put('/api/faculty/' + id, $scope.formData);
    }
    else if($scope.is_students) {
        ret_func = $http.put('/api/students/' + id, $scope.formData);
    }
    else {
        ret_func = $http.put('/api/courses/' + id, $scope.formData);
    }
    ret_func.success(function(data) {
        $scope.formData = {};
        $scope.list_data = data;
        console.log(data);
    })
    ret_func.error(function(error) {
        console.log('Error: ' + error);
    });

}

var query_func = function($scope, $http, id) {
    var ret_func;
    var keyword;
    var query;
    var data = id;
    if(data === undefined) {
        console.log("Data is undefined");
        return;
    }
    // Search of keywords.
    if (data.search("name") > -1) {
        keyword = "name";
        query = data.replace("name=", "");
    } else if(data.search("code") > -1) {
        keyword = "code";
        query = data.replace("code=", "");
    } else if (data.search("entry") > -1) {
        keyword = "entry";
        query = data.replace("entry=", "");
    }
    else if (data.search("dept") > -1) {
        keyword = "dept";
        query = data.replace("dept=", "");
    }
    else {
        // TODO show error here;
        console.log("Invalid keyword");
        return;
    }

    if($scope.is_faculty) {
        console.log("Sending query");
        ret_func = $http.post('/api/faculty/query', {key:keyword, queryWord:query});
    }
    
    if($scope.is_courses) {
        ret_func = $http.post('/api/courses/query', {key:keyword, queryWord:query});
    }

    if($scope.is_students) {
        ret_func = $http.post('api/students/query', {key:keyword, queryWord:query});
    }

    ret_func.success(function(data) {
        console.log(data);
        console.log("Success");
        $scope.formData = {};
        $scope.list_data = data;
        console.log(data);
    })
    
    ret_func.error(function(error) {
        console.log('Error: ' + error);
    });
}

nodeAcad.controller('mainController', function($scope, $http) {
    $scope.formData = {};
    $scope.facultyData = {};
    $scope.studentsData = {};
    $scope.coursesData = {};
    $scope.list_data = {};
    $scope.radio = {};
    $scope.is_faculty = true;
    $scope.is_students = false;
    $scope.is_courses = false;

    get_func($scope, $http);
    $scope.add = function() {
        add_func($scope, $http);
    }
    $scope.delete_entry = function() {
        delete_func($scope, $http, $scope.radio.id);
    }
    $scope.modify = function() {
        modify_func($scope, $http, $scope.radio.id);
    }
    $scope.query = function() {
        query_func($scope, $http, $scope.formData.query);
    }

    $scope.mark_faculty = function() {
        $scope.is_faculty = true;
        $scope.is_students = false;
        $scope.is_courses = false;
        get_func($scope, $http);
    }

    $scope.mark_students= function() {
        $scope.is_faculty = false;
        $scope.is_students = true;
        $scope.is_courses = false;
        get_func($scope, $http);
    }

    $scope.mark_courses = function() {
        $scope.is_faculty = false;
        $scope.is_students = false;
        $scope.is_courses = true;
        get_func($scope, $http);
    }

});


