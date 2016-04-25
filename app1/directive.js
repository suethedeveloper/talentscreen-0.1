/**
 * Created by Sandeep on 16-Feb-16.
 */
talentScreen.directive('instructorDashboard',function(){
    return{
        restrict:"E",
        templateUrl:"website/topinstructordashboard.html"
    }
}).directive('testTypes',function(){
    return{
        restrict:"E",
        templateUrl:"website/testtypes.html"
    }
})
    .directive('videoAngular',function(){
        return{
            restrict:"E",
            templateUrl:"website/videoAngular.html"
        }
    })
    .directive('videoQuiz',function(){
    return{
        restrict:"E",
        templateUrl:"website/videoQuizTemplate.html"
    }
})
    .directive('quizLevel',function(){
    return{
        restrict:"E",
        templateUrl:"website/quizlevel.html"
    }
}).directive('quizSubject',function(){
    return{
        restrict:"E",
        templateUrl:"website/quizsubject.html"
    }
}).directive('choiceQuiz',function(){
    return{
        restrict:"E",
        templateUrl:"website/choceQuizTemplate.html"
    }
}).directive('codingQuiz',function(){
    return{
        restrict:"E",
        templateUrl:"website/codingQuizTemplate.html"
    }
}).directive('quizResults',function(){
    return{
        restrict:"E",
        templateUrl:"website/quizresultspage.html"
    }
}).directive('subjectDisplay',function(){
    return{
        restrict:"E",
        templateUrl:"website/subjectsdisplay.html"
    }
});
talentScreen.directive('listDisplay',function(){
    return{
        restrict:"E",
        templateUrl:"website/subjectlistdisplay.html"
    }
});
talentScreen.directive('profileData',function(){
    return{
        restrict:"E",
        templateUrl:"website/profiledetails.html"
    }
});
talentScreen.directive('footer',function()
{
    return{
        restrict:"E",
        templateUrl:"website/footer.html"
    }
});
talentScreen.directive('studentDashboard',function(){
    return{
        restrict:"E",
        templateUrl:"website/topstudentdashboard.html"
    }
});
talentScreen.directive('homePage',function(){
    return{
        restrict:"E",
        templateUrl:"website/tophomepage.html"
    }
});
talentScreen.directive('topSignNav',function(){
    return {
        restrict:"E",
        templateUrl:"website/topsignin.html"
    }
});
talentScreen.directive('subjectLibrary',function(){
    return {
        restrict:"E",
        templateUrl:"website/subjectlibrary.html"
    }
});
talentScreen.directive('subjectLibrary1',function(){
    return {
        restrict:"E",
        templateUrl:"website/subjectlist1.html"
    }
});
talentScreen.directive('topNavBar',function(){
    return {
        restrict:"E",
        templateUrl:"website/topsignup.html"
    }
}).directive('nameValidation',function(){
        return {
            require:'ngModel',
            link:function(scope,elm,attrs,ctrl){
                ctrl.$parsers.unshift(function(viewValue){
                    var isBlank = viewValue === '';
                    ctrl.$setValidity('isBlank',!isBlank);                    
                })
            }
        }
    }

).directive('emailValidation', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue)
                {
                    var reg=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    var isBlank = viewValue === '';
                    var invalidChars = !isBlank &&!reg.test(viewValue);
                    ctrl.$setValidity('isBlank', !isBlank);
                    ctrl.$setValidity('invalidChars', !invalidChars);
                    scope.emailIsGood=!isBlank&&!invalidChars
                })
            }
        }
    }).directive('passwordCheck', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue) {
                    var isBlank = viewValue === ''
                    var invalidLen = !isBlank && (viewValue.length < 8 || viewValue.length > 20)
                    var isWeak = !isBlank && !invalidLen && !/(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z])/.test(viewValue)
                    ctrl.$setValidity('isBlank', !isBlank);
                    ctrl.$setValidity('isWeak', !isWeak);
                    ctrl.$setValidity('invalidLen', !invalidLen);
                    scope.passwordGood=!isBlank && !isWeak && !invalidLen
                })
            }
        }
    }).directive('passwordMatch', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue, $scope) {
                    var isBlank = viewValue === ''
                    var noMatch = viewValue != scope.mySignUpForm.ePassword.$viewValue;
                    ctrl.$setValidity('isBlank', !isBlank);
                    ctrl.$setValidity('noMatch', !noMatch);
                    scope.passwordCGood=!isBlank && !noMatch
                   })
            }
        }
    });
talentScreen.directive("directiveWhenScrolled", function() {
    return function(scope, elm, attr) {
        var raw = elm[0];

        elm.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.directiveWhenScrolled);
            }
        });
    };
}).filter('formatTimer', function() {
    return function(input)
    {
        function z(n) {return (n<10? '0' : '') + n;}
        var seconds = input % 60;
        var minutes = Math.floor(input / 60);
        return (z(minutes)+':'+z(seconds));
    };
}) .directive('blink', function($timeout) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
        },
        controller: function($scope, $element,$attrs) {
            $scope.speed = $attrs.speed;
            $scope.promise;
            $scope.blinking = true;
            function showElement() {
                $element.css("visibility", "visible");
                $scope.promise = $timeout(hideElement,$scope.speed);
            }
            function hideElement() {
                $element.css("visibility", "hidden");
                $scope.promise =  $timeout(showElement,$scope.speed);

            }

            showElement();
        },
        template: '<span ng-transclude></span>',
        replace: true
    };
});
/*
talentScreen.directive('resize', function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        var changeHeight = function() {element.css('height', (w.height() -20) + 'px' );};
        w.bind('resize', function () {
            changeHeight();   // when window size gets changed
        });
        changeHeight(); // when page loads
    }
})*/
