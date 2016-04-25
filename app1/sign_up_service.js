talentScreen.service("signUpService",function($http){
    this.postData=function(elements){
        var uri= '/api/v1/talentscreen/social/'+elements.type;
            var promise =$http({
                method: 'post',
                url: uri,
                contentType:"application/json",
                data:elements
            }).then(function(response){
                return response.data;
            });
            return promise ;
    }
}).factory("tsQuizTemplate",function($resource){
    return $resource(apiURL+'/api/v1/talentscreen/testquiztemplate', {}, {
        query: {method: 'GET', isArray: true},
        create: {method: 'POST'},
        show: {method: 'GET'},
        update: {method: 'PUT', params: {id: '@id'}},
        delete: {method: 'DELETE', params: {id: '@id'}}
    });
}).service("quizResults",function($http){
    this.postData=function(elements){
        var uri=apiURL+'/api/v1/talentscreen/quizresults';
        var promise =$http({
            method: 'post',
            url: uri,
            contentType:"application/json",
            data:elements
        }).then(function(response){
            return response.data;
        });
        return promise ;
    }
}).service("codeCompiler",function($http){
    this.postData=function(elements){
        var promise = $http({
            method: 'POST',
            url: apiURL+'/api/v1/node/compiler',
            headers: {'Content-Type': 'application/json'},
            data: elements
        }).success(function (response){
            return response;
        });
        return promise ;
    }
});