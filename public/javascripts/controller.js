    var acPortal = angular.module('acPortal', []);



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
        else{
            req_url = $http.post('/students/addrecord', $scope.formData);
        }
        req_url.success(function(response){
            $scope.formData = {};
            console.log("Data Added to Database");
        })
    }

    //delete record --> deleted the record with id passed as parameter
    var delete_record = function($scope, $http, id){
        var req_url; 

        console.log("This is the delete functon");
        console.log(id);

        if($scope.is_deptMaster){
            console.log(id);

            req_url = $http.delete('/deptmaster/' + id);
        }
        else if($scope.is_faculty){
            req_url = $http.delete('/faculty/' + id);
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
        else{
            req_url = $http.get('/students/all');
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
        req_url = $http.put('/deptmaster/' + id, $scope.data)
    }
    else if($scope.is_faculty){
        req_url = $http.put('/faculty/' + id, $scope.data)
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


    // display profile of the id 
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
     else if($scope.is_faculty){
         req_url = $http.get('/faculty/' +id);
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

    //get information to edit the form 
    var edit = function($scope, $http, id){
        var req_url;
        console.log(id);
        if($scope.is_deptMaster){
            req_url = $http.get('/deptmaster/' +id);
        }
        else if($scope.is_courseMaster){
            req_url = $http.get('/coursemaster/' +id);
        }
        else if($scope.is_faculty){
            req_url = $http.get('/faculty/' +id);
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

        else{
            req_url = $http.put('/students/query', $scope.querykey);
        }

        req_url.success(function(response){
            $scope.full_list = response;
            $scope.querykey = {};
        });
    }


    //child controller -- > will take care of the various calls to instructor, student etc.

    acPortal.controller('mainCtrl', ['$scope','$http', '$window', function($scope, $http, $window){

        $scope.is_login = true;
        $scope.user_list = ['faculty','student','admin'];
        var login_id; 

        $scope.login_user = function(data){
         $scope.user_type = data.type;
         $scope.is_login = false;
         $scope.is_loggedin = true;
         if(data.type === 'student'){
            login_id = data.userid;
            $scope.show_studentContainer = true;
            $scope.show_facultyContainer = false;
            $scope.show_adminContainer = false;
        }
        else if(data.type === 'faculty'){

            login_id = data.userid;
            $scope.show_facultyContainer = true;
            $scope.show_studentContainer = false;
            $scope.show_adminContainer = false;
        }
        else if(data.type === 'admin'){
          $scope.show_facultyContainer = false;
          $scope.show_studentContainer = false;
          $scope.show_adminContainer = true;
      }
  }



        //==========Variables and functions to show and hide tables/forms/buttons==========\\ 

        $scope.show_addContainer  = false;
        $scope.show_infoContainer = false;

       $scope.is_students = false;//initally student records are hidden
       $scope.is_instructor=false;//Initially instructor records are hidden, will be displayed when we click instructor button
       $scope.is_deptMaster = false; //initially courses records are hiddedn
       $scope.is_faculty = false; //initially faculty records are hidden

       $scope.listOfOptions = ['Departments', 'Courses', 'Students', 'Faculty'];

       $scope.selectedItemChanged = function(){
        if(angular.equals($scope.selectedItem, "Departments")){
            $scope.is_students = false;
            console.log("Clicked department");
            $scope.is_courseMaster = false;
            $scope.is_faculty = false;
            $scope.is_deptMaster = true;
            displayInfo();
        }
        if(angular.equals($scope.selectedItem, "Courses")){
                $scope.is_deptMaster=false; //to hide the instructor record container in crud.html 
                $scope.is_courseMaster = true; // to display the course record container in crud.html
                $scope.is_students = false;
                $scope.is_faculty = false;
                displayInfo();
            }
            if(angular.equals($scope.selectedItem, "Students")){
                $scope.is_courseMaster=false; //to hide the instructor record container in crud.html 
                $scope.is_students = true; //hide the student record container in crud.html
                $scope.is_deptMaster = false;
                $scope.is_faculty = false;
                displayInfo();
            }
            if(angular.equals($scope.selectedItem, "Faculty")){
                $scope.is_faculty = true; // to display the student record container in crud.html
                $scope.is_deptMaster=false; //to hide the instructor record container in crud.html 
                $scope.is_courseMaster = false; // to display the course record container in crud.html
                $scope.is_students = false;
                displayInfo();
            }

        }

    //function to display the table

    var displayInfo = function(){

        if($scope.show_adminContainer){
            $scope.show_infoContainer = true;
            $scope.show_addContainer = false;
            $scope.show_profileContainer = false;

            console.log("I am in display");
            $scope.show_addContainer = false;

            if($scope.is_deptMaster){
                $scope.show_departments = true;
                $scope.show_courses = false;
                $scope.show_students = false;
                $scope.show_faculty = false;
                show_record($scope, $http); //call the display function

            }

            else if($scope.is_courseMaster){
                $scope.show_departments = false;
                $scope.show_courses = true;
                $scope.show_students = false;
                $scope.show_faculty = false;
                show_record($scope, $http); //call the display function
            }

            else if($scope.is_students){
                $scope.show_departments = false;
                $scope.show_courses = false;
                $scope.show_students = true;
                $scope.show_faculty = false;
                show_record($scope, $http); //call the display function
            }

            else{
                $scope.show_departments = false;
                $scope.show_courses = false;
                $scope.show_students = false;
                $scope.show_faculty = true;
                show_record($scope, $http); //call the display function
            }
        }
    }

    //called when the button to +Add is clicked to open the add form
    $scope.new_record = function(){

        $scope.show_infoContainer = false; //all the tables with record will be hidden
        $scope.show_profileContainer = false;

        $scope.show_addContainer  = true;
        console.log("Wants to add something!");
        if($scope.is_deptMaster){
            showAddDepartments();
            console.log("We are going to add dept.");
        }
        else if($scope.is_courseMaster){
            showAddCourses();
        }
        else if($scope.is_students){
            showAddStudents();
        }
        else //when faculty is selected!
        {
            showAddFaculty();
        }
    }

       // to display information of the record with id, on an editable form 
       $scope.displayedit  = function(id){

        if($scope.show_adminContainer){
            $scope.show_infoContainer = false;
            $scope.show_addContainer = false;

            $scope.show_profileContainer = true;

            edit($scope, $http, id);
            if($scope.is_deptMaster){
             $scope.update_courses = false;
             $scope.update_students =  false;
             $scope.update_faculty = false;      
             $scope.update_departments = true;
         }
         else if($scope.is_courseMaster){
             $scope.update_courses = true;
             $scope.update_students =  false;
             $scope.update_faculty = false;      
             $scope.update_departments = false;
         }
         else if($scope.is_students){
             $scope.update_courses = false;
             $scope.update_students =  true;
             $scope.update_faculty = false;      
             $scope.update_departments = false;
         }
         else{
             $scope.update_courses = false;
             $scope.update_students =  false;
             $scope.update_faculty = true;      
             $scope.update_departments = false;
         }
     }
     if($scope.show_studentContainer){
        $scope.myStudProfile  = true;
        edit($scope, $http, login_id);

    }
    if($scope.show_facultyContainer){
        $scope.myFacProfile = true;
        console.log("Hey fac prf");
        edit($scope, $http, login_id);
    }
}

        //delete a record
        $scope.delete = function(id){
            //delete confirmation
            console.log("Function called after delte button clicked");

            deleteUser = $window.confirm('Are you sure you want to delete?');
            if(deleteUser){
                console.log($scope.id);
                delete_record($scope, $http, id);
                show_record($scope, $http); //call the display function  
                if($scope.is_deptMaster){getDeptList(); } //to update the list of department

            }
        }

        //update record
        $scope.updaterecord = function(id){
            update($scope, $http, id);
            show_record($scope, $http); //call the display function
            if($scope.is_deptMaster){getDeptList(); } //to update the list of department

        }


    //---------------------For adding the information to any table     -----------\\

        //when record form to add data 
        var showAddDepartments = function(){
            $scope.add_departments = true; //show the add record form 
            $scope.add_courses = false; //hide the add course record form 
            $scope.add_students = false; //hide the add student record form 
            $scope.add_faculty = false; //hide the add faculty record form 
            console.log("Will hide faculty");
            $scope.formData = {};

        }

        //when record form to add data 
        var showAddCourses = function(){
            $scope.add_courses = true; //show the add record form 
            $scope.add_departments = false; //show the add record form 
            $scope.add_students = false; //hide the add student record form 
            $scope.add_faculty = false; //hide the add faculty record form 

            $scope.formData = {};

        }

        //when record form to add data 
        var showAddStudents = function(){
            $scope.add_students = true; //show the add record form 
            $scope.add_courses = false; //show the add record form 
            $scope.add_departments = false; //show the add record form 
            $scope.add_faculty = false; //hide the add faculty record form 

            $scope.formData = {};

        }

        var showAddFaculty = function(){
            $scope.add_faculty = true; //display the add new faculty form
            $scope.add_students = false; //show the add record form 
            $scope.add_courses = false; //show the add record form 
            $scope.add_departments = false; //show the add record form 

            $scope.formData = {};
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

    //department list
    var getDeptList = function(){
        $scope.dpid_list =[];
        var req_url = $http.get('/deptmaster');
        req_url.success(function(response){
            $scope.dpid_list = response;
            console.log($scope.dpid_list);
        });  
    }

    getDeptList(); //to create the list first time

        //list for titles
       // $scope.title_list = ["Mr.", "Ms.", "Mrs.", "Dr.(Mr)", "Dr.(Mrs.)", "Dr.(Ms.)", "Prof", "Asst. Prof", "Asst"]

        //when add operation is to be performed. Executed to POST data entered in add record form
        $scope.add = function(){
            add_record($scope, $http);
            if($scope.is_deptMaster){getDeptList(); } //to update the list of department
        }

    //for query
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