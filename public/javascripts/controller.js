var acPortal = angular.module('acPortal', []);

acPortal.controller('parentCtrl', ['$scope', '$http', function($scope, $http){
	console.log("Hello from the the controller");

/*Following are the functions in the parentCtrl controller:
select_instructor() - For selecting the instructor view
select_student() - For selecting the student view
select_courses() - For selecting the student view 

Following are the functions outside any controller
add_record($scope, $http) - for calling the POST request (Adding a new record to database)
delete_record($scope, $http, id) - DELETE Request(Deleting a record from database)
show_record($scope, $http ) - GET req(Displaying all the records in table )
update($scope, $http, id) - PUT(update a particular record)
display_profile($scope, $http) - (GET information for a particular record)
edit($scope, $http, id) - Information for a record
query($scope, $http) -  perform a query based on the fields entered in the form 

Functions in the mainCtrl controller:
add() - called when the Add button is pressed. It in turn calls the add_record() function
displayprofile() - called when we enter a key to delete a record. It displays the profile of the person
displayedit(id) - displays the information in a form with editable fields for updating a record
delete(id) - called when delete button is pressed. In turn calls the function delete_record()
updaterecord(id) - when update button is clicked. Calls update() function 
querysearch() - when we enter information in the query form and press Query button. It calls query() function

showAddInst()/showAddStud()/showAddCourses() - for displaying the Add record form and hiding other HTML views
showAllInst()/showAllStud()/showAllCourses() -  for displaying (HTML) list of all the instructors/students/courses
deleteInst()/deleteStud()/deleteCourses() - for displaying the delete form and hiding other HTML views
updateInst()/updateStud()/updateCourses() - for displaying the update form and hiding other HTML views
queryInst()/queryStud()/queryCourses() - for displaying query form and hiding other hTML views
 */    

    //==========Variables and functions to show and hide tables/forms/buttons==========\\ 

   $scope.is_students = false;//initally student records are hidden
   $scope.is_instructor=false;//Initially instructor records are hidden, will be displayed when we click instructor button
   $scope.is_deptMaster = false; //initially courses records are hiddedn
    $scope.select_deptMaster = function(){
        $scope.is_students = false;
        $scope.is_courseMaster = false;
        $scope.is_deptMaster = true;
    }

    $scope.select_courseMaster = function(){
        $scope.is_deptMaster=false; //to hide the instructor record container in crud.html 
        $scope.is_courseMaster = true; // to display the course record container in crud.html
        $scope.is_students = false;
    }

    $scope.select_students = function(){
        $scope.is_courseMaster=false; //to hide the instructor record container in crud.html 
        $scope.is_students = true; //hide the student record container in crud.html
        $scope.is_deptMaster = false;
    }

}]);



var add_record = function($scope, $http){
    var req_url;
    console.log($scope.formData);
    if($scope.is_deptMaster){
        req_url = $http.post('/deptmaster/addrecord', $scope.formData);
    }
    else if($scope.is_courseMaster){
        req_url = $http.post('/coursemaster/addrecord', $scope.formData);
    }

    else{
        req_url = $http.post('/students/addrecord', $scope.formData);
    }
    req_url.success(function(response){
        $scope.formData = {};
        console.log("Data Added to Database");
    })
}

var delete_record = function($scope, $http, id){
    var req_url;

    if($scope.is_deptMaster){
       req_url = $http.delete('/deptmaster/' + id);
    }

    else if($scope.is_courseMaster){
        req_url = $http.delete('/coursemaster/' + id);
    }

    else{
        req_url = $http.delete('/students/' + id)
    }
    req_url.success(function(response){
        $scope.data = {};
        $scope.searchkey.id = '';
    })
}

var show_record = function($scope, $http){
    var req_url;
    if($scope.is_deptMaster){
        req_url = $http.get('/deptmaster');
    }

    else if($scope.is_courseMaster){
        req_url = $http.get('/coursemaster/all');
    }

    else{
        req_url = $http.get('/students/all');
    }
    req_url.success(function(response){
        $scope.full_list = response;
        console.log($scope.full_list);
    })
}


var update = function($scope, $http, id){
    var req_url;
  //  console.log($scope.data.id);
    if($scope.is_deptMaster){
        req_url = $http.put('/deptmaster/' + id, $scope.data)
    }

    else if($scope.is_courseMaster){
        req_url = $http.put('/coursemaster/' + id, $scope.data)
    }

    else{
        req_url = $http.put('/students/' +id, $scope.data);
    }

    req_url.success(function(response){
        $scope.data = {};
        $scope.searchkey = {};
    });
}


var display_profile = function($scope, $http){
    var req_url;
    console.log($scope.searchkey.id);
    var id = $scope.searchkey.id; 
    if($scope.is_deptMaster){
        req_url = $http.get('/deptmaster/' +id);
    }
    else if($scope.is_courseMaster){
         req_url = $http.get('/coursemaster/' +id);
    }
    else{
        req_url = $http.get('/students/' +id);
    }

    req_url.success(function(response){
        console.log(response);
        $scope.data = response;
        $scope.searchkey.id = '';
    })
}

var edit = function($scope, $http, id){
    var req_url;
    console.log(id);
    if($scope.is_deptMaster){
        req_url = $http.get('/deptmaster/' +id);
    }
    else if($scope.is_courseMaster){
        req_url = $http.get('/coursemaster/' +id);
    }
    else{
        req_url = $http.get('/students/' +id);
    }
    req_url.success(function(response){
        console.log("Edit information");
        console.log(response);
        $scope.data = response;
    });
}

var query = function($scope, $http){
    var req_url;
    console.log($scope.querykey);
    if($scope.is_deptMaster){
        req_url =    $http.put('/deptmaster/query', $scope.querykey);
    }

    else if($scope.is_courseMaster){
        req_url = $http.put('/coursemaster/query', $scope.querykey);
    }

    else{
        req_url = $http.put('/students/query', $scope.querykey);
    }

    req_url.success(function(response){
        $scope.full_list = response;
        $scope.querykey = {};
    });
}


//child controller -- > will take care of the various calls to instructor, student etc.

acPortal.controller('mainCtrl', ['$scope','$http', function($scope, $http){
   

//---------------------For Departments --------Taking care of all HTML views------------\\
    //when record form to add data 
    $scope.showAddDepartments = function(){
        $scope.add_departments = true; //show the add record form 
        $scope.show_departments = false;
        $scope.delete_departments = false; //to fide the delete form with key text field
        $scope.update_departments = false; //hide update form to enter search key
        $scope.query_departments =false;

    }

    $scope.showAllDepartments = function(){
        $scope.data = {};
        $scope.add_departments = false; //to hide the add record form
        $scope.show_departments = true; //to display the entire instructor list 
        $scope.delete_departments = false; //to fide the delete form with key text field
        $scope.update_departments = false; //hide update form to enter search key
        $scope.query_departments =false;

        show_record($scope, $http); //call the display function
    }

    $scope.deleteDepartments = function(){
        $scope.data = {};
        $scope.add_departments = false; //hide the add record form
        $scope.show_departments = false; //hide instructor list
        $scope.delete_departments = true; //to display the delete form with key text field
        $scope.update_departments = false; //hide update form to enter search key
        $scope.query_departments =false;
        $scope.searchkey = {}; //refresh the searchekey        

    }

    $scope.updateDepartments = function(){
        $scope.data = {};
        $scope.add_departments = false; //hide the add record form
        $scope.show_departments = false; //hide instructor list
        $scope.delete_departments = false; //hide the delete form with key text field
        $scope.update_departments = true; //display update form to enter search key
        $scope.query_departments=false;
        $scope.showDeleteButton = false;
        $scope.searchkey = {}; //refresh the searchekey        
    }

    $scope.queryDepartments = function(){
        $scope.add_departments = false; //hide the add record form
        $scope.show_departments = false; //hide instructor list
        $scope.delete_departments = false; //hide the delete form with key text field
        $scope.update_departments = false; //display update form to enter search key
        $scope.query_departments = true;//show the query form (the advance search option)
    }



//---------------------For Courses --------Taking care of all HTML views------------\\
    //when record form to add data 
    $scope.showAddCourses = function(){
        $scope.add_courses = true; //show the add record form 
        $scope.show_courses = false;
        $scope.delete_courses = false; //to fide the delete form with key text field
        $scope.update_courses = false; //hide update form to enter search key
        $scope.query_courses =false;

    }

    $scope.showAllCourses = function(){
        $scope.data = {};
        $scope.add_courses = false; //to hide the add record form
        $scope.show_courses = true; //to display the entire instructor list 
        $scope.delete_courses = false; //to fide the delete form with key text field
        $scope.update_courses = false; //hide update form to enter search key
        $scope.query_courses =false;

        show_record($scope, $http); //call the display function
    }

    $scope.deleteCourses = function(){
        $scope.data = {};
        $scope.add_courses = false; //hide the add record form
        $scope.show_courses = false; //hide instructor list
        $scope.delete_courses = true; //to display the delete form with key text field
        $scope.update_courses = false; //hide update form to enter search key
        $scope.query_courses=false;
        $scope.searchkey = {}; //refresh the searchekey        

    }

    $scope.updateCourses = function(){
        $scope.data = {};
        $scope.add_courses = false; //hide the add record form
        $scope.show_courses = false; //hide instructor list
        $scope.delete_courses = false; //hide the delete form with key text field
        $scope.update_courses = true; //display update form to enter search key
        $scope.query_courses=false;
        $scope.showDeleteButton = false;
        $scope.searchkey = {}; //refresh the searchekey        
    }

    $scope.queryCourses = function(){
        $scope.add_courses = false; //hide the add record form
        $scope.show_courses = false; //hide instructor list
        $scope.delete_courses = false; //hide the delete form with key text field
        $scope.update_courses = false; //display update form to enter search key
        $scope.query_courses = true;//show the query form (the advance search option)
    }

//---------------------For Student Records --------Taking care of all HTML views------------\\
    //when record form to add data 
    $scope.showAddStudents = function(){
        $scope.add_students = true; //show the add record form 
        $scope.show_students = false;
        $scope.delete_students = false; //to fide the delete form with key text field
        $scope.update_students = false; //hide update form to enter search key
        $scope.query_students =false;

    }

    $scope.showAllStudents = function(){
        $scope.data = {};
        $scope.add_students = false; //to hide the add record form
        $scope.show_students = true; //to display the entire instructor list 
        $scope.delete_students = false; //to fide the delete form with key text field
        $scope.update_students = false; //hide update form to enter search key
        $scope.query_students =false;

        show_record($scope, $http); //call the display function
    }

    $scope.deleteStudents = function(){
        $scope.data = {};
        $scope.add_students = false; //hide the add record form
        $scope.show_students = false; //hide instructor list
        $scope.delete_students = true; //to display the delete form with key text field
        $scope.update_students = false; //hide update form to enter search key
        $scope.query_students =false;
        $scope.searchkey = {}; //refresh the searchekey        

    }

    $scope.updateStudents = function(){
        $scope.data = {};
        $scope.add_students = false; //hide the add record form
        $scope.show_students = false; //hide instructor list
        $scope.delete_students = false; //hide the delete form with key text field
        $scope.update_students = true; //display update form to enter search key
        $scope.query_students =false;
        $scope.showDeleteButton = false;
        $scope.searchkey = {}; //refresh the searchekey        
    }

    $scope.queryStudents = function(){
        $scope.add_students = false; //hide the add record form
        $scope.show_students = false; //hide instructor list
        $scope.delete_students = false; //hide the delete form with key text field
        $scope.update_students = false; //display update form to enter search key
        $scope.query_students = true;//show the query form (the advance search option)
    }




//------------------------All the CRUD Functions----------------------\\


    //when add operation is to be performed. Executed to POST data entered in add record form
    $scope.add = function(){
        add_record($scope, $http);
 //check this show_recrod if needed ---
  //      show_record($scope, $http); //call the display function
    }

    $scope.displayprofile = function(){
         display_profile($scope, $http);
    }

    $scope.displayedit  = function(id){
        edit($scope, $http, id);

        if($scope.show_students || $scope.show_courses|| $scope.show_departments)
            {
                $scope.showUpdateButton = true;
                $scope.showDeleteButton = true;
                $scope.update_departments = true;
                $scope.update_courses = true;
                $scope.show_students = false; //hide the entire student list
                $scope.show_courses = false; //hide the entire student list 
                $scope.show_departments = false;
             }
 
        else{
             $scope.showUpdateButton = true;
             $scope.showDeleteButton = false;
             $scope.show_students = false; //hide the entire student list
             $scope.show_courses = false; //hide the entire student list 
             $scope.show_departments = false;
            }
    }

    $scope.delete = function(id){
        delete_record($scope, $http, id);
        show_record($scope, $http); //call the display function
    }

    $scope.updaterecord = function(id){
        update($scope, $http, id);
        show_record($scope, $http); //call the display function
    }

    $scope.querysearch = function(){
        var querykey = $scope.querykey;
        if($scope.is_courseMaster){
                if(angular.isUndefined(querykey.crid))
                   querykey.crid="" ;
                if(angular.isUndefined(querykey.dpid))
                   querykey.dpid="" ;
                if(angular.isUndefined(querykey.coursename))
                   querykey.coursename="" ;
                if(angular.isUndefined(querykey.credits))
                   querykey.credits= -1 ;

               query($scope, $http);
               $scope.show_courses = true; //to display the entire instructor list 
               $scope.query_courses = false;//show the query form (the advance search option)

        }
        else if($scope.is_deptMaster){

                if(angular.isUndefined(querykey.id))
                   querykey.id="" ;
                if(angular.isUndefined(querykey.name))
                   querykey.name="" ;
               query($scope, $http);
               $scope.show_departments = true; //to display the entire department list 
               $scope.query_departments = false;//hide the query form (the advance search option)
        }

        else{
            if(angular.isUndefined(querykey.stid))
                   querykey.stid="" ;
                if(angular.isUndefined(querykey.name))
                   querykey.name="" ;
                if(angular.isUndefined(querykey.dpid))
                   querykey.dpid="" ;
                if(angular.isUndefined(querykey.year))
                   querykey.year= -1 ;
                if(angular.isUndefined(querykey.degree))
                   querykey.degree="" ;
               query($scope, $http);
               $scope.show_students = true; //to display the entire instructor list 
               $scope.query_students = false;//show the query form (the advance search option)
        }
    }
}]);