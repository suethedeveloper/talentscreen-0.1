/**
 * Created by Whitebox on 2/16/2016.
 */

talentScreen.controller('fbcontroller', [ '$scope','signUpService','$location','$auth','$cookieStore','loginService','$state','forgotPasswordService','referenceCodeService','passwordChangeService','emailActivateService', function($scope,signUpService,$location,$auth,$cookieStore,loginService,$state,forgotPasswordService,referenceCodeService,passwordChangeService,emailActivateService){
    var emailpassword="";
    $scope.forgotDiv=true;
    $scope.forgotEmailDiv=false;
    $scope.buttonSubmit=false;
    $scope.buttonReference=true;
    $scope.newPasswordDiv=true;
    $scope.confirmPasswordDiv=true;
    $scope.buttonChange=true;
    $scope.emailActiveDiv=false;
    $scope.emailActiveSubmitDiv=false;
    $scope.emailCodeDiv=true;
    $scope.enterDiv=true;
    $scope.authenticate = function(provider) {

        $auth.authenticate(provider)
            .then(function(response) {
                var userdata={
                    data:response.data.Results,
                    token:response.data.Token
                };
                $cookieStore.put("session",userdata);
                var url="#/website-student/dashboard";
                $location.url(url);
            })
            .catch(function(error) {
                if (error.error) {
                    console.log(error.error);
                } else if (error.data) {
                    console.log( error.status);
                } else {
                    console.log(error);
                }
            });
    };
    $scope.emplogin=function(){
        var jsonData={
               email:$scope.username,
               password:MD5($scope.password)
        }
        loginService.postData(jsonData).then(function (response) {
            var userData={data:response.Results,token:response.Token};
            if(response.Message == '201'){
                $cookieStore.put("empSession",userData);
                $state.go('website-instructor.dashboard')
            }else if(response.Message=='202'){
                $cookieStore.put("session",userData);
                $state.go('website-student.dashboard')

            }else{
                alert('credentials not valid');
            }
        });
    };
    $scope.forgot=function(){
        var jsonData={
            type:"forgotEmail",
            email:$scope.forgotEmail
        }
        forgotPasswordService.postData(jsonData).then(function (response){
            console.log(response);
            var userData={data:response.Results};
            if(response.Message == '400'){
                alert('the mail is not registered');
            }
            else{
                $state.go('forgot')
                $scope.forgotEmailDiv=true;
                $scope.buttonSubmit=true;
                $scope.forgotDiv=false;
                $scope.buttonReference=false;
            }
        });
    }
    $scope.reference=function(){
        var jsonData={
            type:"forgot",
            referencecode:$scope.referenceCode,
        }
        referenceCodeService.postData(jsonData).then(function(response){
            console.log(response);
            emailpassword=response.Results.email;
            var userData={data:response.Result};
           if(response.Message =='400'){
               alert('the code is not valid');
           }
            else{
               $state.go('forgot');
               $scope.forgotDiv=true;
               $scope.buttonReference=true;
               $scope.newPasswordDiv=false;
               $scope.confirmPasswordDiv=false;
               $scope.buttonChange=false;
           }
        });
    }
    $scope.change=function(){
        var jsonData={
            password:MD5($scope.newPassword),
            email:emailpassword
        }
        passwordChangeService.postData(jsonData).then(function(response){
            console.log(response);
            var userData={data:response.Result};
            if(response.Message =='400'){
                alert('the code is not valid');
            }
            else{
                $state.go('login');

            }
        });
    }
    $scope.emailActiveSubmit=function(){
        var jsonData={
            type:"email",
            emailactive:$scope.emailActive
        }
        forgotPasswordService.postData(jsonData).then(function(response){
            console.log(response);
            var userData={data:response.Result};
            if(response.Message =='400'){
                alert('the code is not valid');
            }
            else{
                $state.go('emailActive');
                $scope.emailActiveDiv=true;
                $scope.emailActiveSubmitDiv=true;
                $scope.emailCodeDiv=false;
                $scope.enterDiv=false;

            }
        });
    }
    $scope.enter=function(){
        var jsonData={
            type:"AccountActivation",
            emailCode:$scope.emailCode
        }
        referenceCodeService.postData(jsonData).then(function(response){
            console.log(response);
            var userData={data:response.Result};
            if(response.Message =='400'){
                alert('the code is not valid');
            }
            else{
                $state.go('login');

            }
        });
    }
}]);
talentScreen.controller('employeeDetails',function($scope,$cookieStore,$location){
    var sessiondata=$cookieStore.get("empSession");
    console.log(sessiondata.data.source);
    $scope.email=sessiondata.data.email;
    $scope.name=sessiondata.data.firstname;
    $scope.myimage  ='images/user-default.png';
     $scope.password=function(){
        if(sessiondata.data.source=="employee"){
            return true;
        }else{
            return false;
        }
    }
    $scope.empLogout=function(){
        $cookieStore.remove("empSession");
        $location.path('/login');
    }
});
