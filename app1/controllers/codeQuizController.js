/**
 * Created by svelupula on 2/22/2016.
 */

talentScreen.controller('codeQuizController', ['$scope', '$http',
    function ($scope, $http) {

        $scope.language = '';
        $scope.quizStartAccepted = false;
        $scope.quizBegin = false;
        $scope.languageId = 0;
        $scope.languages = [{id: 17, name: "Javascript"}, {id: 15, name: "Assembly"}, {id: 1, name: "C#"}, {
            id: 7,
            name: "C++ (gcc)"
        }, {
            id: 27,
            name: "C++ (clang)"
        }, {id: 28, name: "C++ (vc++)"}, {id: 6, name: "C (gcc)"}, {id: 26, name: "C (clang)"}, {
            id: 29,
            name: "C (vc)"
        }, {id: 18, name: "Common Lisp"}, {id: 30, name: "D"}, {id: 3, name: "F#"}, {id: 20, name: "Go"}, {
            id: 11,
            name: "Haskell"
        }, {id: 4, name: "Java"}, {id: 14, name: "Lua"}, {
            id: 23,
            name: "Node.js"
        }, {id: 25, name: "Octave"}, {id: 10, name: "Objective-C"}, {id: 9, name: "Pascal"}, {
            id: 13,
            name: "Perl"
        }, {id: 8, name: "Php"}, {id: 19, name: "Prolog"}, {id: 5, name: "Python"}, {id: 24, name: "Python 3"}, {
            id: 31,
            name: "R"
        }, {id: 12, name: "Ruby"}, {id: 21, name: "Scala"}, {id: 22, name: "Scheme"}, {
            id: 16,
            name: "Sql Server"
        }, {id: 32, name: "Tcl"}, {id: 2, name: "Visual Basic"}];

        $scope.startQuiz = function () {
            $scope.quizStartAccepted = true;
            //$scope.selectLanguage = $scope.languages[0];
        };

        $scope.languageChanged = function () {
            if ($scope.selectLanguage) {
                $scope.quizBegin = true;
                $scope.languageId = $scope.selectLanguage;

                for (var i = 0; i < $scope.languages.length; i++) {
                    if ($scope.languages[i].id === Number($scope.languageId)) {
                        $scope.language = ' - ' + $scope.languages[i].name;
                        var lang = $scope.languages[i].name.toLowerCase();

                        $scope.cmOption = {
                            lineNumbers: true,
                            lineWrapping: true,
                            indentWithTabs: true,
                            mode: lang,
                            onLoad: function (_cm) {
                                // HACK to have the codemirror instance in the scope...
                                $scope.modeChanged = function () {
                                    _cm.setOption("mode", $scope.languages[i].name.toLowerCase());
                                };
                            }
                        };

                        $scope.cmModel = '//write your code here...\n';
                    }
                }

            }
        };

        $scope.compile = function () {
            var data1 = $.param({
                language: Number($scope.languageId),
                editor: 1,
                content: $scope.cmModel
            });

            $http({
                method: 'POST',
                url: 'http://104.197.157.127/api/v1/node/compiler',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: data1
            }).success(function (data, status, headers, config) {

                var message = '';

                if (data.Warnings) {
                    message += 'Warnings: ' + data.Warnings + '\n';
                }

                if (data.Errors) {
                    message += 'Errors: ' + data.Errors + '\n';
                }

                if (data.Stats) {
                    message += 'Errors: ' + data.Stats + '\n';
                }

                $scope.result = data.Result;
                $scope.info = message;
            }).error(function (data, status, header, config) {
                $scope.info = data;
            });
        };

    }]);
