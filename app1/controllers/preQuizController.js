/**
 * Created by Sue on 4/27/2016.
 */
talentScreen.controller("preQuizController",['$scope','$cookieStore','$localStorage','tsQuizTemplate','codeCompiler','$timeout','quizResults',function($scope,$cookieStore,$localStorage,tsQuizTemplate,codeCompiler,$timeout,quizResults){
    console.log("preQuizController");




    $scope.selectSubjectChanged=function(){
        $scope.levels=[];
        $scope.quizSubject=false;
        var subjects=$localStorage.subject;
        for(var i=0;i<subjects.length;i++)
        {
            if(subjects[i].id==$scope.selectSubject)
            {
                $scope.subjectName=subjects[i].name;
                $scope.iconurl=subjects[i].icon_class;
                $scope.heading="Subject";
            }

        }
        var jsonData={type:"level",token:$scope.sessiondata.token,subjectid:$scope.selectSubject,testtype:$scope.testtype};
        tsQuizTemplate.query(jsonData).$promise.then(function (data) {
            if(data[0].status==400 || data[0].status==403 ||data[0].status==404 || data[0].status==500){
                alert(data[0].message);
            }  else{
                $localStorage.level=data;
                $scope.levels=data;
                $scope.quizLevels=true;}
        });

    };

    $scope.selectLevelChanged=function(){
        var level=$localStorage.level;
        for(var i=0;i<level.length;i++){
            if(level[i].id==$scope.selectedLevel)
            {
                levelCount=level[i].count;
            }
        }
        if ($scope.testtype === 2){
            var jsonData={type:"language",token:$scope.sessiondata.token,subjectid:$scope.selectSubject};
            tsQuizTemplate.query(jsonData).$promise.then(function (data) {
                $scope.language=data[0].name;
                $scope.languageid=data[0].id;
                $scope.codeTextTemplate=data[0].template;
            });
        }
        $scope.quizLevels=false;
        $scope.quizStartAccepted=true;

    };











    ///////END OF THIS???////////////////////////////////////////////////////



    //////// NEED TO REFACTOR /////////
    //$scope.startQuiz=function(){
    //    if ($scope.testtype === 3) {
    //        UserMedia.get().then(function (response) {
    //            if(response.status==400){
    //                $scope.videoQuizContainer=false;
    //                $scope.videoNotSupported=true;
    //                $scope.startButton=false;
    //            }
    //            else{
    //                window.stream=response.stream;
    //                $scope.quizStartAccepted=false;
    //                $scope.countDown=true;
    //                $localStorage.quiz="";
    //                var jsonData={type:"questions",token:sessiondata.token,candidateid:sessiondata.data._id,testtype:3,testlevel:$scope.selectedLevel,testsubject:$scope.selectSubject,count:levelCount};
    //                tsQuizTemplate.show(jsonData).$promise.then(function (data){
    //                    $localStorage.quiz=data;
    //                });
    //                mytimeout = $timeout($scope.onTimeout, 1000);
    //            }
    //        });
    //    } else {
    //        $scope.quizStartAccepted=false;
    //        $scope.countDown=true;
    //        $localStorage.quiz="";
    //        var jsonData={type:"questions",token:sessiondata.token,candidateid:sessiondata.data._id,testtype:$scope.testtype,testlevel:$scope.selectedLevel,testsubject:$scope.selectSubject,count:levelCount};
    //        tsQuizTemplate.show(jsonData).$promise.then(function (data){
    //            $localStorage.quiz=data;
    //        });
    //        mytimeout = $timeout($scope.onTimeout, 1000);
    //    }
    //};
    //
    //$scope.onTimeout = function() {
    //    if($scope.counter ===  1) {
    //        $scope.$broadcast('timer-stopped', 0);
    //        $timeout.cancel(mytimeout);
    //        $scope.normalTimer=false;
    //        $scope.timerBlink=true;
    //    } else if($scope.counter<12) {
    //        $scope.normalTimer=true;
    //        $scope.timerBlink=false;
    //    }
    //
    //    $scope.counter--;
    //    mytimeout = $timeout($scope.onTimeout, 1000);
    //
    //};
    //
    //$scope.$on('timer-stopped', function(event, remaining) {
    //    if ($scope.testtype === 1) {
    //        if (count === 1) {
    //            $scope.questions = $localStorage.quiz.questions;
    //        }
    //        if (remaining === 0) {
    //            $scope.normalTimer = false;
    //            $scope.timerBlink = true;
    //            if ($localStorage.quiz.questions) {
    //                $scope.countDown = false;
    //                if (count != 1) {
    //                    $scope.totalTimeTaken = $scope.totalTimeTaken + (60 - $scope.counter);
    //                    choiceStudentAnswer(count - 1);
    //                }
    //                if (count > $scope.questions.length) {
    //                    choiceQuizValidation();
    //                }
    //                else {
    //                    $scope.counter = 59;
    //                    choiceQuestion(count);
    //                    if (count == $scope.questions.length) {
    //                        $scope.count14 = true;
    //                        $scope.count15 = false;
    //                    }
    //                    mytimeout = $timeout($scope.onTimeout, 1000);
    //                    $scope.quizBegin = true;
    //                    count++;
    //                }
    //            }
    //        }
    //    } else if ($scope.testtype === 2) {
    //        if($scope.resultStatus){
    //            $scope.totalTimeTaken=$scope.totalTimeTaken+($localStorage.quiz.questions[count-2].time-$scope.counter);
    //            totalTimeForCodingQuiz=totalTimeForCodingQuiz+$localStorage.quiz.questions[count-2].time;
    //            $scope.resultStatus=false;
    //            $scope.counter=10;
    //            $scope.codingQuizBegin=false;
    //            codingCompilation(count-1);
    //            mytimeout = $timeout($scope.onTimeout, 1000);
    //
    //        }else {
    //            if(count===1){$scope.questions=$localStorage.quiz.questions;}
    //            if(remaining === 0) {
    //                $scope.countDown=false;
    //                var lang = $scope.language;
    //                $scope.cmOption = {
    //                    lineNumbers: true,
    //                    lineWrapping: true,
    //                    indentWithTabs: true,
    //                    theme: 'twilight',
    //                    electricChars: true,
    //                    mode: lang.toLowerCase(),
    //                    onLoad: function (_cm) {
    //                        $scope.modeChanged = function () {
    //                            _cm.setOption("mode", lang.toLowerCase());
    //                        };
    //                        $scope.codemirrorLoaded = function (_editor) {
    //                            var _doc = _editor.getDoc();
    //                            _editor.clear();
    //                            _editor.focus();
    //                            _doc.markClean();
    //                        };
    //
    //                    }
    //                };
    //                $scope.cmModel = $scope.codeTextTemplate;
    //                if (count > $scope.questions.length) {
    //                    codingQuizValidation()
    //                }
    //                else {
    //                    if (count > 1) {
    //                        if (!$scope.resultStatus && $scope.counter > 1) {
    //                            $scope.totalTimeTaken = $scope.totalTimeTaken + ($localStorage.quiz.questions[count - 2].time - $scope.counter);
    //                            totalTimeForQuiz = totalTimeForQuiz + $localStorage.quiz.questions[count - 2].time;
    //
    //                        }
    //                    }
    //                    $scope.counter = $localStorage.quiz.questions[count - 1].time;
    //                    $scope.codingQuizBegin = true;
    //                    $scope.cmModel = null;
    //                    codingQuestion(count);
    //                    if (count == $scope.questions.length) {
    //                        $scope.count14 = true;
    //                        $scope.count15 = false;
    //                    }
    //                    $scope.codingQuizBeginresult = true;
    //                    count++;
    //                    $scope.resultStatus = true;
    //                    mytimeout = $timeout($scope.onTimeout, 1000);
    //                }
    //
    //
    //            }
    //        }
    //    } else if ($scope.testtype === 3) {
    //        if(remaining === 0) {
    //            if(count === 1){
    //                $scope.questions=$localStorage.quiz.questions;
    //            }
    //            if (count > 1) {
    //                recordAudio.stopRecording(function(url) {
    //                    recordAudio.getDataURL(function(audioDataURL) {
    //                        videourl[blobCount]=url;
    //                        postFiles(blobCount, audioDataURL);
    //                        blobCount++;
    //                    });
    //                });
    //                $scope.totalTimeTaken = $scope.totalTimeTaken + ($localStorage.quiz.questions[count - 2].time - $scope.counter);
    //                $localStorage.quiz.questions[count - 2].candidatetime = $scope.counter;
    //                totalTimeForQuiz = totalTimeForQuiz + $localStorage.quiz.questions[count - 2].time;
    //            }
    //            if (count > $scope.questions.length) {
    //                $scope.recordingShow=false;
    //                $scope.normalTimer = true;
    //                $scope.timerBlink = true;
    //                $timeout.cancel(mytimeout);
    //                $scope.count15 = true;
    //                window.stream.getTracks().forEach(function(track) {
    //                    track.stop();});
    //                showRecordings();
    //            }
    //            else {
    //                $scope.counter = $localStorage.quiz.questions[count - 1].time;
    //                if (count == $scope.questions.length) {
    //                    $scope.count14 = true;
    //                    $scope.count15 = false;
    //                }
    //                videoQuestion(count);
    //                $scope.videoQuizBegin = true;
    //                count++;
    //                mytimeout = $timeout($scope.onTimeout, 1000);
    //            }
    //        }
    //    }
    //});


}]);