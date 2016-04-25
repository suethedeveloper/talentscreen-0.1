/**
 * Created by svelupula on 2/22/2016.
 */
talentScreen.controller('videoQuizController', ['$scope', '$sce', 'UserMedia',
    function ($scope, $sce, UserMedia) {

        $scope.subject = '';
        $scope.quizStartAccepted = false;
        $scope.quizBegin = false;
        $scope.subjectId = 0;
        $scope.subjects = [{id: 34, name: "ASP.NET Web Forms"}, {id: 35, name: "ASP.NET MVC and Web API"}, {
            id: 36,
            name: "Microsoft Entity Framework"
        }, {id: 37, name: "Microsoft .NET with C#"}, {id: 38, name: "Http and Web"}, {
            id: 39,
            name: "SDLC + Architectures"
        }, {id: 40, name: "Web Services"}, {id: 41, name: "Work Management Tools"}, {id: 42, name: "SQL"}, {
            id: 43,
            name: "CSS"
        }, {id: 44, name: "MongoDB"}, {id: 45, name: "NoSQL Fundamentals"}, {
            id: 46,
            name: "Android Fundamentals"
        }, {id: 47, name: "SOAPUI"}, {id: 48, name: "Java Programming"}, {
            id: 49,
            name: "Testing Fundamentals"
        }, {id: 50, name: "Performance Testing Fundamentalas"}, {id: 51, name: "Jmeter"}, {
            id: 52,
            name: "Unit Testing"
        }, {id: 53, name: "Selenium WebDriver"}, {id: 54, name: "QA Automation"}, {id: 55, name: "Appium"}, {
            id: 56,
            name: "Javascript Programming"
        }, {id: 57, name: "HTML5"}, {id: 58, name: "jQuery"}, {id: 59, name: "Bootstrap"}, {
            id: 60,
            name: "Javascript UI"
        }, {id: 61, name: "AngularJS"}, {id: 62, name: "Javascript Testing"}, {
            id: 63,
            name: "Javascript Build Automation"
        }, {id: 64, name: "NodeJS"}, {id: 65, name: "ExpressJS"}, {id: 97, name: "UNIX"}, {
            id: 98,
            name: "Java DevOps"
        }, {id: 99, name: "Python Programming"}, {id: 100, name: "QTP"}, {id: 101, name: "Loadrunner"}, {
            id: 102,
            name: "WebDesigning"
        }];
        $scope.questions = [{
            "rowno": 0,
            "severity": 5,
            "rowid": "81",
            "question": "___are suitable for Cloud Based Testing",
            "answer1": "Appium",
            "answer2": "selendroid",
            "answer3": "both A,B",
            "answer4": "none of these",
            "originalAnswer": "c",
            "candidateAnswer": "null",
            "answeredOrNot1": "N",
            "correctAnswerOrNot": "N"
        }, {
            "rowno": 1,
            "severity": 5,
            "rowid": "82",
            "question": "No support to run Appium Inspector on",
            "answer1": "linux systems",
            "answer2": "Apple devices",
            "answer3": "Microsoft Windows",
            "answer4": "none of these",
            "originalAnswer": "c",
            "candidateAnswer": "null",
            "answeredOrNot1": "N",
            "correctAnswerOrNot": "N"
        }, {
            "rowno": 2,
            "severity": 5,
            "rowid": "83",
            "question": "When Appium is downloaded and installed, then a server is setup on our machine that exposes a",
            "answer1": "REST API",
            "answer2": "java API",
            "answer3": "Soap call",
            "answer4": "none of these",
            "originalAnswer": "a",
            "candidateAnswer": "null",
            "answeredOrNot1": "N",
            "correctAnswerOrNot": "N"
        }, {
            "rowno": 3,
            "severity": 5,
            "rowid": "84",
            "question": "Appium responds back with____response",
            "answer1": "json",
            "answer2": "XML",
            "answer3": "plain text",
            "answer4": "HTTP",
            "originalAnswer": "d",
            "candidateAnswer": "null",
            "answeredOrNot1": "N",
            "correctAnswerOrNot": "N"
        }, {
            "rowno": 4,
            "severity": 5,
            "rowid": "85",
            "question": "Appium support language like___",
            "answer1": "php",
            "answer2": "Node.js",
            "answer3": "perl",
            "answer4": "All the above",
            "originalAnswer": "d",
            "candidateAnswer": "null",
            "answeredOrNot1": "N",
            "correctAnswerOrNot": "N"
        }, {
            "rowno": 5,
            "severity": 4,
            "rowid": "32",
            "question": "A single screen , the user sees on the device at one time, is known as __",
            "answer1": "service",
            "answer2": "GUI",
            "answer3": "activity",
            "answer4": "application",
            "originalAnswer": "c",
            "candidateAnswer": "null",
            "answeredOrNot1": "N",
            "correctAnswerOrNot": "N"
        }, {
            "rowno": 6,
            "severity": 4,
            "rowid": "33",
            "question": "adb command to the only running emulator instance.",
            "answer1": "-e",
            "answer2": "-d",
            "answer3": "-s",
            "answer4": "version",
            "originalAnswer": "a",
            "candidateAnswer": "null",
            "answeredOrNot1": "N",
            "correctAnswerOrNot": "N"
        }, {
            "rowno": 7,
            "severity": 4,
            "rowid": "34",
            "question": "Android is based on which kernel?",
            "answer1": "Linux kernel",
            "answer2": "Windows kernel",
            "answer3": "MAC kernel",
            "answer4": "Hybrid Kernel",
            "originalAnswer": "a",
            "candidateAnswer": "null",
            "answeredOrNot1": "N",
            "correctAnswerOrNot": "N"
        }, {
            "rowno": 8,
            "severity": 4,
            "rowid": "35",
            "question": "Appium is an __written using Node.js platform and drives iOS and Android session using Webdriver JSON wire protocol",
            "answer1": "HTTP Server",
            "answer2": "proxy server",
            "answer3": "FTP Server",
            "answer4": "none of these",
            "originalAnswer": "a",
            "candidateAnswer": "null",
            "answeredOrNot1": "N",
            "correctAnswerOrNot": "N"
        }, {
            "rowno": 9,
            "severity": 4,
            "rowid": "36",
            "question": "Clear the package previous set for debugging",
            "answer1": "clear-debug-app",
            "answer2": "set-debug-app [options] <PACKAGE>",
            "answer3": "both A,B",
            "answer4": "none of these",
            "originalAnswer": "a",
            "candidateAnswer": "null",
            "answeredOrNot1": "N",
            "correctAnswerOrNot": "N"
        }, {
            "rowno": 10,
            "severity": 3,
            "rowid": "23",
            "question": "___to find DOM element for Android application.",
            "answer1": "inspector",
            "answer2": "developer Tools",
            "answer3": "UIAutomateviewer",
            "answer4": "none of these",
            "originalAnswer": "c",
            "candidateAnswer": "null",
            "answeredOrNot1": "N",
            "correctAnswerOrNot": "N"
        }, {
            "rowno": 11,
            "severity": 3,
            "rowid": "24",
            "question": "___usually carried out by network carriers, is done by simulating the complete wireless network",
            "answer1": "Usability",
            "answer2": "Functional",
            "answer3": "Performance",
            "answer4": "Laboratory",
            "originalAnswer": "d",
            "candidateAnswer": "null",
            "answeredOrNot1": "N",
            "correctAnswerOrNot": "N"
        }, {
            "rowno": 12,
            "severity": 3,
            "rowid": "25",
            "question": "__It offers cross-platform application testing i.e. single API works for both Android and iOS platform test scripts.",
            "answer1": "Appium",
            "answer2": "selendroid",
            "answer3": "selenium webdriver",
            "answer4": "selenium java client",
            "originalAnswer": "a",
            "candidateAnswer": "null",
            "answeredOrNot1": "N",
            "correctAnswerOrNot": "N"
        }, {
            "rowno": 13,
            "severity": 3,
            "rowid": "26",
            "question": "__makes appropriate list of application data for the other applications",
            "answer1": "service provider",
            "answer2": "content provider",
            "answer3": "application provider",
            "answer4": "Resource",
            "originalAnswer": "b",
            "candidateAnswer": "null",
            "answeredOrNot1": "N",
            "correctAnswerOrNot": "N"
        }, {
            "rowno": 14,
            "severity": 3,
            "rowid": "27",
            "question": "__provides port-forwarding services, screen capture on the device, thread and heap information on the device, logcat, process, and radio state information, incoming call and SMS spoofing, location data spoofing",
            "answer1": "DVM",
            "answer2": "DDMS",
            "answer3": "both A,B",
            "answer4": "none of these",
            "originalAnswer": "b",
            "candidateAnswer": "null",
            "answeredOrNot1": "N",
            "correctAnswerOrNot": "N"
        }];

        $scope.startQuiz = function () {
            $scope.quizStartAccepted = true;
            //$scope.selectLanguage = $scope.languages[0];
        };

        $scope.subjectChanged = function () {
            if ($scope.selectSubject) {
                $scope.quizBegin = true;
                $scope.subjectId = $scope.selectSubject;

                UserMedia.get().then(function (stream) {
                    console.log('starting video', stream);
                    window.stream = stream; // stream available to console for dev
                    if (window.URL) {
                        console.log('using window.URL');
                        $scope.videostream = $sce.trustAsResourceUrl(window.URL.createObjectURL(stream));
                    } else {
                        $scope.videostream = $sce.trustAsResourceUrl(stream);
                    }
                });
                /*$scope.questionNo = 1;
                 $scope.questionText = $scope.questions[0].question;
                 $scope.answer1Text =  $scope.questions[0].answer1;
                 $scope.answer2Text =  $scope.questions[0].answer2;
                 $scope.answer3Text =  $scope.questions[0].answer3;
                 $scope.answer4Text =  $scope.questions[0].answer4;

                 for (var i = 0; i < $scope.subjects.length; i++) {
                 if ($scope.subjects[i].id === Number($scope.subjectId)) {
                 $scope.subject = ' - ' + $scope.subjects[i].name;
                 }
                 }

                 $scope.$broadcast('timer-start');
                 $scope.timerRunning = true;*/

            }
        };

        $scope.finished = function () {
            /*if ($scope.timerRunning) {
             $scope.$broadcast('timer-clear');
             $scope.timerRunning = false;
             }

             $scope.questionNo = $scope.questionNo + 1;
             var index = $scope.questionNo - 1;
             if(index < $scope.questions.length)
             {
             $scope.questionText = $scope.questions[index].question;
             $scope.answer1Text =  $scope.questions[index].answer1;
             $scope.answer2Text =  $scope.questions[index].answer2;
             $scope.answer3Text =  $scope.questions[index].answer3;
             $scope.answer4Text =  $scope.questions[index].answer4;
             $scope.$broadcast('timer-add-cd-seconds', 10);
             $scope.timerRunning = true;
             $scope.$apply();
             }*/


        }

        /* $scope.$on('timer-stopped', function(event, data) {
         timeStarted = true;


         });*/

        /*$scope.$on('timer-stopped', function (event, data){


         });
         */

    }]).controller('videoController',function($scope,$sce){
    function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
        navigator.mediaDevices.getUserMedia(mediaConstraints).then(successCallback).catch(errorCallback);
    }
    var mediaConstraints = {
        audio: !IsChrome && !IsOpera && !IsEdge, // record both audio/video in Firefox
        video: true
    };
    $scope.startRecording=function(){
        console.log("Started Recording");
        captureUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
    }

});
talentScreen.controller("video",["$sce", function ($sce,$scope) {


    }]
);
