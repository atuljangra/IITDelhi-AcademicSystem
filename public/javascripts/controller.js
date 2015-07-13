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
   $scope.is_faculty = false; //initially faculty records are hidden
   $scope.is_courses_offered = false; //initially faculty records are hidden
   $scope.is_courses_registered = false; //initially faculty records are hidden

//when department is clicked
   $scope.select_deptMaster = function(){
    $scope.is_students = false;
    $scope.is_courseMaster = false;
    $scope.is_faculty = false;
    $scope.is_deptMaster = true;
    $scope.is_courses_offered = false; 
    $scope.is_courses_registered = false; 
}

//when course is clicked 
$scope.select_courseMaster = function(){
        $scope.is_deptMaster=false; //to hide the instructor record container in crud.html 
        $scope.is_courseMaster = true; // to display the course record container in crud.html
        $scope.is_students = false;
        $scope.is_faculty = false;
        $scope.is_courses_offered = false; 
        $scope.is_courses_registered = false; 

    }

//when faculty is clicked   
    $scope.select_faculty = function(){
        $scope.is_faculty = true; // to display the student record container in crud.html
        $scope.is_deptMaster=false; //to hide the instructor record container in crud.html 
        $scope.is_courseMaster = false; // to display the course record container in crud.html
        $scope.is_students = false;
        $scope.is_courses_offered = false; 
        $scope.is_courses_registered = false; 
    }

//when student is clicked    
    $scope.select_students = function(){
        $scope.is_courseMaster=false; //to hide the instructor record container in crud.html 
        $scope.is_students = true; //hide the student record container in crud.html
        $scope.is_deptMaster = false;
        $scope.is_faculty = false;
        $scope.is_courses_offered = false; 
        $scope.is_courses_registered = false; 
    }

//when Course Offering is clicked    
    $scope.select_courses_offered = function(){
        $scope.is_courseMaster=false; //to hide the instructor record container in crud.html 
        $scope.is_students = false; //hide the student record container in crud.html
        $scope.is_deptMaster = false;
        $scope.is_faculty = false;
        $scope.is_courses_offered = true; 
        $scope.is_courses_registered = false; 
    }

//when Course Offering is clicked    
    $scope.select_courses_registered = function(){
        $scope.is_courseMaster=false; //to hide the instructor record container in crud.html 
        $scope.is_students = false; //hide the student record container in crud.html
        $scope.is_deptMaster = false;
        $scope.is_faculty = false;
        $scope.is_courses_offered = false; 
        $scope.is_courses_registered = true; 
    }

}]);

 //function to add -->sends query to the model 
var add_record = function($scope, $http){
    var req_url;
    console.log($scope.formData);
    if($scope.is_deptMaster){
        req_url = $http.post('/deptmaster/addrecord', $scope.formData);
    }
    else if($scope.is_courseMaster){
        req_url = $http.post('/coursemaster/addrecord', $scope.formData);
    }
    else if($scope.is_faculty){
        req_url = $http.post('/faculty/addrecord', $scope.formData);
    }
    else if($scope.is_students){
        req_url = $http.post('/students/addrecord', $scope.formData);
    }
    else if($scope.is_courses_offered){
        $scope.formData.totalapplicants = 0;
        $scope.formData.statuscode = "Open";
        req_url = $http.post('/coursesoffered/addrecord', $scope.formData);
    }
    else if($scope.is_courses_registered){
        req_url = $http.post('/coursesregistered/addrecord', $scope.formData);
    }
    req_url.success(function(response){
        $scope.formData = {};
        console.log("Data Added to Database");
    })
}

//delete record --> deleted the record with id passed as parameter
var delete_record = function($scope, $http, id){
    var req_url;

    if($scope.is_deptMaster){
     req_url = $http.delete('/deptmaster/' + id.id);
 }
 else if($scope.is_faculty){
    req_url = $http.delete('/faculty/' + id.id);
}
else if($scope.is_courseMaster){
    req_url = $http.delete('/coursemaster/' + id.id);
}

else if($scope.is_students){
    req_url = $http.delete('/students/' + id.id)
}
else if($scope.is_courses_offered){
    req_url = $http.delete('/coursesoffered/' + id.crid + '/' + id.facid + '/' + id.semid)
}
else if($scope.is_courses_registered){
    req_url = $http.delete('/coursesregistered/' + id.crid + '/' + id.stid + '/' + id.semid)
}
req_url.success(function(response){
    $scope.data = {};
    $scope.searchkey.id = '';
})
}

//displays all records
var show_record = function($scope, $http){
    var req_url;
    if($scope.is_deptMaster){
        req_url = $http.get('/deptmaster');
    }

    else if($scope.is_courseMaster){
        req_url = $http.get('/coursemaster/all');
    }
    else if($scope.is_faculty){
        req_url = $http.get('/faculty/all');
    }
    else if($scope.is_students){
        req_url = $http.get('/students/all');
    }
    else if($scope.is_courses_offered){
        req_url = $http.get('/coursesoffered/all');
    }
    else if($scope.is_courses_registered){
        req_url = $http.get('/coursesregistered/all');
    }
    req_url.success(function(response){
        $scope.full_list = response;
        console.log($scope.full_list);
    })
}

// update record with id sent as parameter
var update = function($scope, $http, id){
    var req_url;
  //  console.log($scope.data.id);
  if($scope.is_deptMaster){
    req_url = $http.put('/deptmaster/' + id.id, $scope.data)
}
else if($scope.is_faculty){
    req_url = $http.put('/faculty/' + id.id, $scope.data)
}

else if($scope.is_courseMaster){
    req_url = $http.put('/coursemaster/' + id.id, $scope.data)
}

else if($scope.is_students){
    req_url = $http.put('/students/' +id.id, $scope.data);
}
else if($scope.is_courses_offered){
    req_url = $http.put('/coursesoffered/' +id.crid + '/' + id.facid + '/' + id.semid, $scope.data);
}
else if($scope.is_courses_registered){
    req_url = $http.put('/coursesregistered/' +id.crid + '/' + id.stid + '/' + id.semid, $scope.data);
}

req_url.success(function(response){
    console.log(response);
    $scope.data = {};
    $scope.searchkey = {};
});
}


// display profile of the id 
var display_profile = function($scope, $http){
    var req_url;
    console.log($scope.searchkey.id);
    var id = $scope.searchkey.id; 
    var crid = $scope.searchkey.crid;
    var facid = $scope.searchkey.facid;
    var stid = $scope.searchkey.stid;
    var semid = $scope.searchkey.semid;
    if($scope.is_deptMaster){
        req_url = $http.get('/deptmaster/' +id);
    }
    else if($scope.is_courseMaster){
       req_url = $http.get('/coursemaster/' +id);
   }
   else if($scope.is_faculty){
       req_url = $http.get('/faculty/' +id);
   }
   else if($scope.is_students){
    req_url = $http.get('/students/' +id);
}
   else if($scope.is_courses_offered){
    req_url = $http.get('/coursesoffered/' + crid + '/' + facid + '/' + semid);
}
   else if($scope.is_courses_registered){
    req_url = $http.get('/coursesregistered/' + crid + '/' + stid + '/' + semid);
}

req_url.success(function(response){
    console.log(response);
    $scope.data = response;
    $scope.searchkey.id = '';
})
}

//get information to edit the form 
var edit = function($scope, $http, id){
    var req_url;
    console.log(id);
    if($scope.is_deptMaster){
        req_url = $http.get('/deptmaster/' +id.id);
    }
    else if($scope.is_courseMaster){
        req_url = $http.get('/coursemaster/' +id.id);
    }
    else if($scope.is_faculty){
        req_url = $http.get('/faculty/' +id.id);
    }
    else if($scope.is_students){
        req_url = $http.get('/students/' +id.id);
    }
    else if($scope.is_courses_offered){
        req_url = $http.get('/coursesoffered/' +id.crid + '/' + id.facid + '/' + id.semid);
    }
    else if($scope.is_courses_registered){
        req_url = $http.get('/coursesregistered/' +id.crid + '/' + id.stid + '/' + id.semid);
    }
    req_url.success(function(response){
        console.log("Edit information");
        console.log(response);
        $scope.data = response;
    });
}

//query
var query = function($scope, $http){
    var req_url;
    console.log($scope.querykey);
    if($scope.is_deptMaster){
        req_url =    $http.put('/deptmaster/query', $scope.querykey);
    }
    else if($scope.is_faculty){
        req_url = $http.put('/faculty/query', $scope.querykey);
    }
    else if($scope.is_courseMaster){
        req_url = $http.put('/coursemaster/query', $scope.querykey);
    }

    else if($scope.is_students){
        req_url = $http.put('/students/query', $scope.querykey);
    }
    else if($scope.is_courses_offered){
        req_url = $http.put('/coursesoffered/query', $scope.querykey);
    }
    else if($scope.is_courses_registered){
        req_url = $http.put('/coursesregistered/query', $scope.querykey);
    }

    req_url.success(function(response){
        $scope.full_list = response;
        $scope.querykey = {};
    });
}


//child controller -- > will take care of the various calls to instructor, student etc.

acPortal.controller('mainCtrl', ['$scope','$http', '$window', function($scope, $http, $window){


//---------------------For Departments --------Taking care of all HTML views------------\\

    //when record form to add data 
    $scope.showAddDepartments = function(){
        $scope.add_departments = true; //show the add record form 
        $scope.show_departments = false;
        $scope.delete_departments = false; //to fide the delete form with key text field
        $scope.update_departments = false; //hide update form to enter search key
        $scope.query_departments =false;
        $scope.formData = {};

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



//---------------------For COURSES --------Taking care of all HTML views------------\\

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


//---------------------For STUDENT Records --------Taking care of all HTML views------------\\

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

//--------------------For FACULTY -- Taking care of all the html views--------------\\

$scope.showAllFaculty = function(){
        $scope.show_faculty = true; //display the list of all records
        $scope.add_faculty = false; //hide the add record data
        $scope.delete_faculty = false;//hide the delete form
        show_record($scope, $http); //call the display function
        $scope.update_faculty = false; //hide the form for key to enter
        $scope.query_faculty = false; //hide the query form
    }

    $scope.showAddFaculty = function(){
        $scope.delete_faculty = false; //hide the delete form 
        $scope.add_faculty = true; //display the add new faculty form
        $scope.show_faculty = false; //hide the list of facultys
        $scope.update_faculty = false; //hide the form for key to enter
        $scope.query_faculty = false; //hide the query form
    }

    $scope.deleteFaculty = function(){
        $scope.delete_faculty = true; //display the delete form to enter the key
        $scope.show_faculty = false; //hide the display screen
        $scope.add_faculty = false; //hide the add faculty form 
        $scope.update_faculty = false; //hide the form for key to enter
        $scope.query_faculty = false; //hide the query form
        $scope.data = {};
        $scope.searchkey = {}; //refresh the searchekey

    }

    $scope.updateFaculty = function(){
        $scope.update_faculty = true; //display the form for key to enter
        $scope.delete_faculty = false; //hide the delete form 
        $scope.add_faculty = false; //hide the add new faculty form
        $scope.show_faculty = false; //hide the list of facultys
        $scope.query_faculty = false; //hide the query form
        $scope.data={}; //to refresh the information stored in variable data
        $scope.searchkey = {}; //refresh the searchekey
        $scope.showDeleteButton = false; //to hide the delete button

    }

    $scope.queryFaculty = function(){
        $scope.query_faculty = true; //show the query form
        $scope.update_faculty = false; //hide the form for key to enter
        $scope.delete_faculty = false; //hide the delete form 
        $scope.add_faculty = false; //hide the add new faculty form
        $scope.show_faculty = false; //hide the list of facultys
    }


//--------------------For COURSE OFFERING -- Taking care of all the html views--------------\\

$scope.showAllCoursesOffered = function(){
        $scope.show_courses_offered = true; //display the list of all records
        $scope.add_courses_offered = false; //hide the add record data
        $scope.delete_courses_offered = false;//hide the delete form
        show_record($scope, $http); //call the display function
        $scope.update_courses_offered = false; //hide the form for key to enter
        $scope.query_courses_offered = false; //hide the query form
    }

    $scope.showAddCoursesOffered = function(){
        $scope.delete_courses_offered = false; //hide the delete form 
        $scope.add_courses_offered = true; //display the add new courses_offered form
        $scope.show_courses_offered = false; //hide the list of courses_offereds
        $scope.update_courses_offered = false; //hide the form for key to enter
        $scope.query_courses_offered = false; //hide the query form
    }

    $scope.deleteCoursesOffered = function(){
        $scope.delete_courses_offered = true; //display the delete form to enter the key
        $scope.show_courses_offered = false; //hide the display screen
        $scope.add_courses_offered = false; //hide the add courses_offered form 
        $scope.update_courses_offered = false; //hide the form for key to enter
        $scope.query_courses_offered = false; //hide the query form
        $scope.data = {};
        $scope.searchkey = {}; //refresh the searchekey

    }

    $scope.updateCoursesOffered = function(){
        $scope.update_courses_offered = true; //display the form for key to enter
        $scope.delete_courses_offered = false; //hide the delete form 
        $scope.add_courses_offered = false; //hide the add new courses_offered form
        $scope.show_courses_offered = false; //hide the list of courses_offereds
        $scope.query_courses_offered = false; //hide the query form
        $scope.data={}; //to refresh the information stored in variable data
        $scope.searchkey = {}; //refresh the searchekey
        $scope.showDeleteButton = false; //to hide the delete button

    }

    $scope.queryCoursesOffered = function(){
        $scope.query_courses_offered = true; //show the query form
        $scope.update_courses_offered = false; //hide the form for key to enter
        $scope.delete_courses_offered = false; //hide the delete form 
        $scope.add_courses_offered = false; //hide the add new courses_offered form
        $scope.show_courses_offered = false; //hide the list of courses_offereds
    }

//--------------------For COURSE REGISTRATION-- Taking care of all the html views--------------\\

$scope.showAllCoursesRegistered = function(){
        $scope.show_courses_registered = true; //display the list of all records
        $scope.add_courses_registered = false; //hide the add record data
        $scope.delete_courses_registered = false;//hide the delete form
        show_record($scope, $http); //call the display function
        $scope.update_courses_registered = false; //hide the form for key to enter
        $scope.query_courses_registered = false; //hide the query form
    }

    $scope.showAddCoursesRegistered = function(){
        $scope.delete_courses_registered = false; //hide the delete form 
        $scope.add_courses_registered = true; //display the add new courses_registered form
        $scope.show_courses_registered = false; //hide the list of courses_registereds
        $scope.update_courses_registered = false; //hide the form for key to enter
        $scope.query_courses_registered = false; //hide the query form
    }

    $scope.deleteCoursesRegistered = function(){
        $scope.delete_courses_registered = true; //display the delete form to enter the key
        $scope.show_courses_registered = false; //hide the display screen
        $scope.add_courses_registered = false; //hide the add courses_registered form 
        $scope.update_courses_registered = false; //hide the form for key to enter
        $scope.query_courses_registered = false; //hide the query form
        $scope.data = {};
        $scope.searchkey = {}; //refresh the searchekey

    }

    $scope.updateCoursesRegistered = function(){
        $scope.update_courses_registered = true; //display the form for key to enter
        $scope.delete_courses_registered = false; //hide the delete form 
        $scope.add_courses_registered = false; //hide the add new courses_registered form
        $scope.show_courses_registered = false; //hide the list of courses_registereds
        $scope.query_courses_registered = false; //hide the query form
        $scope.data={}; //to refresh the information stored in variable data
        $scope.searchkey = {}; //refresh the searchekey
        $scope.showDeleteButton = false; //to hide the delete button

    }

    $scope.queryCoursesRegistered = function(){
        $scope.query_courses_registered = true; //show the query form
        $scope.update_courses_registered = false; //hide the form for key to enter
        $scope.delete_courses_registered = false; //hide the delete form 
        $scope.add_courses_registered = false; //hide the add new courses_registered form
        $scope.show_courses_registered = false; //hide the list of courses_registereds
    }


//------------------------Functions/ Operations----------------------\\

    //array to store credit list
    $scope.credit_list = [0, 1, 2, 3, 4, 5];

    //array to store year list 
    var year_list = new Date().getFullYear();
    var range = [];
    range.push(year_list);
    for(var i=1;i<100;i++) {
      range.push(year_list - i);
  }
  $scope.years_list = range;

//list of degrees offered
  $scope.degree_list = ["B.Tech", "M.Tech", "PhD", "Research Assistant", "B.Arch"];
  $scope.status_list = ["Open", "Close"];
  $scope.sem_list = ["1501", "1502"];
//department list
var getDeptList = function(){
    $scope.dpid_list =[];
     var req_url = $http.get('/deptmaster');
    req_url.success(function(response){
        $scope.dpid_list = response;
        console.log($scope.dpid_list);
    });  
}

var getCourseList = function(){
    $scope.crid_list =[];
     var req_url = $http.get('/coursemaster');
    req_url.success(function(response){
        $scope.crid_list = response;
        console.log($scope.crid_list);
    });  
}

getDeptList(); //to create the list first time
getCourseList(); //to create the list first time

    //list for titles
   // $scope.title_list = ["Mr.", "Ms.", "Mrs.", "Dr.(Mr)", "Dr.(Mrs.)", "Dr.(Ms.)", "Prof", "Asst. Prof", "Asst"]
  
    //when add operation is to be performed. Executed to POST data entered in add record form
    $scope.add = function(){
        add_record($scope, $http);
        if($scope.is_deptMaster){getDeptList(); } //to update the list of department
    }

    //to display profile 
    $scope.displayprofile = function(){
       display_profile($scope, $http);
   }

   // to display information of the record with id, on an editable form 
   $scope.displayedit  = function(){

       if($scope.is_courses_offered)
        edit($scope, $http, {crid: arguments[0], facid: arguments[1], semid: arguments[2]});
       else if($scope.is_courses_registered)
        edit($scope, $http, {crid: arguments[0], stid: arguments[1], semid: arguments[2]});
       else
        edit($scope, $http, {id: arguments[0]});

    if($scope.show_students || $scope.show_courses|| $scope.show_departments||$scope.show_faculty || $scope.show_courses_offered || $scope.show_courses_registered)
    {
        $scope.showUpdateButton = true;
        $scope.showDeleteButton = true;
        $scope.update_departments = true;
        $scope.update_courses = true;
        $scope.update_students = true;
        $scope.update_faculty = true;
        $scope.update_courses_offered = true;
        $scope.update_courses_registered = true;

                $scope.show_students = false; //hide the entire student list
                $scope.show_courses = false; //hide the entire student list 
                $scope.show_departments = false;
                $scope.show_faculty = false; //hide the entire student list
                $scope.show_courses_offered = false; //hide the entire student list
                $scope.show_courses_registered= false; //hide the entire student list

            }

            else{
               $scope.showUpdateButton = true;
               $scope.showDeleteButton = false;
             $scope.show_students = false; //hide the entire student list
             $scope.show_courses = false; //hide the entire student list 
             $scope.show_departments = false;
            $scope.show_faculty = false; //hide the entire faculty list
            $scope.show_courses_offered = false; //hide the entire student list
            $scope.show_courses_registered = false; //hide the entire student list

        }
    }

    //delete a record
    $scope.delete = function(){
        //delete confirmation
        deleteUser = $window.confirm('Are you sure you want to delete?');
        if(deleteUser){
            if($scope.is_courses_offered)
                delete_record($scope, $http, {crid: arguments[0], facid: arguments[1], semid: arguments[2]});
            else if($scope.is_courses_registered)
                delete_record($scope, $http, {crid: arguments[0], stid: arguments[1], semid: arguments[2]});
            else
                delete_record($scope, $http, {id: arguments[0]});
            show_record($scope, $http); //call the display function  
            if($scope.is_deptMaster){getDeptList(); } //to update the list of department

        }
    }

    //update record
    $scope.updaterecord = function(){
        var id = {};
        if($scope.is_courses_offered) {
            id.crid = arguments[0];
            id.stid = arguments[1];
            id.semid = arguments[2];
        }
        else
            id.id = arguments[0];
        update($scope, $http, id);
        show_record($scope, $http); //call the display function
        if($scope.is_deptMaster){getDeptList(); } //to update the list of department

    }

    //perform search query
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
           else if($scope.is_faculty){
            if(angular.isUndefined(querykey.name))
             querykey.name="" ;
         if(angular.isUndefined(querykey.title))
             querykey.title="" ;
         if(angular.isUndefined(querykey.fcid))
             querykey.fcid="" ;
         if(angular.isUndefined(querykey.dpid))
             querykey.dpid="" ;
         if(angular.isUndefined(querykey.emailid))
             querykey.emailid="" ;
         if(angular.isUndefined(querykey.contactno))
             querykey.contactno="" ;
         if(angular.isUndefined(querykey.areas))
             querykey.areas="" ;

         query($scope, $http);
               $scope.show_faculty = true; //to display the entire faculty list 
               $scope.query_faculty = false;//hide the query form (the advance search option)

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

           else if($scope.is_students){
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

           else if($scope.is_courses_offered){
            if(angular.isUndefined(querykey.crid))
             querykey.crid="" ;
         if(angular.isUndefined(querykey.facid))
             querykey.facid="" ;
         if(angular.isUndefined(querykey.semid))
             querykey.semid="" ;
         if(angular.isUndefined(querykey.slotid))
             querykey.slotid= "" ;
         if(angular.isUndefined(querykey.numseats))
             querykey.numseats="0" ;
         if(angular.isUndefined(querykey.totalapplicants))
             querykey.totalapplicants="0" ;
         if(angular.isUndefined(querykey.statuscode))
             querykey.statuscode="" ;
         query($scope, $http);
               $scope.show_courses_offered = true; //to display the entire instructor list 
               $scope.query_courses_offered = false;//show the query form (the advance search option)
           }

           else if($scope.is_courses_registered){
            if(angular.isUndefined(querykey.crid))
             querykey.crid="" ;
         if(angular.isUndefined(querykey.stid))
             querykey.stid="" ;
         if(angular.isUndefined(querykey.semid))
             querykey.semid="" ;
         query($scope, $http);
               $scope.show_courses_registered= true; //to display the entire instructor list 
               $scope.query_courses_registered = false;//show the query form (the advance search option)
           }
       }
   }]);
