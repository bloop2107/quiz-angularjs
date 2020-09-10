var app = angular.module('myApp',['ngRoute']);

app.config(function($routeProvider){
    $routeProvider
    .when('/',{
        templateUrl: 'home.html'
    })
    .when('/monhoc',{
        templateUrl: 'monhoc2.html',
        controller:'subjectCtrl'
    })
    .when('/quiz/:id/:name',{
        templateUrl: 'quiz.html',
        controller:'quizsCtrl'
    })
})

app.controller('subjectCtrl',function($scope,$http){
    $scope.list_subject = [];
    $http.get('../db/Subjects.js').then(function(res){
        $scope.list_subject = res.data;
    });
});

app.controller('quizsCtrl',function($scope,$http,$routeParams,quizFactory){
    $http.get('../db/Quizs/'+ $routeParams.id +'.js').then(function(res){
        quizFactory.questions = res.data; 
    });
});

app.directive('quizfpoly',function(quizFactory,$routeParams){
    return {
        restrict: 'AE', 
        scope: {},
        templateUrl: 'template-quiz.html',
        link: function(scope,elem,attrs){
            scope.start = function(){
                quizFactory.getQuestions().then(function(){
                    scope.subjectName = $routeParams.name;
                    scope.id = 1;
                    scope.inProgess = true;
                    scope.getQuestion();
                    scope.quizOver = false;
                })
            };
            scope.reset = function(){
                scope.inProgess = false;
                scope.score = 0;
            };
            scope.getQuestion = function(){
                var quiz = quizFactory.getQuestion(scope.id);
                if(quiz){

                scope.question = quiz.Text;
                scope.options = quiz.Answers;

                scope.answer = quiz.AnswerId;
                scope.answerMode = true;
                } else {
                    scope.quizOver = true;
                }
            }
            scope.checkAnswer = function(){
                // alert('answer')
                if(!$('input[name="answer"]:checked').length) return;;
                var ans = $('input[name="answer"]:checked').val();
                if(ans == scope.answer){
                    // alert('Bạn đã chọn đáp án đúng');
                    scope.score++;
                    scope.correctAns = true;
                } else {
                    // alert('Đáp án sai!');
                    scope.correctAns = false;
                }
                scope.answerMode = false;
            }
            scope.nextQuestion = function(){
                scope.id++;
                scope.getQuestion();
            }
            scope.reset();
        }
    }
});

app.factory('quizFactory', function($http,$routeParams){
    
    return {
        getQuestions:function(){
            return $http.get('../db/Quizs/'+ $routeParams.id +'.js').then(function(res){
                questions = res.data;
                // alert(questions.length);
            });
        },
        getQuestion:function(id){
            var randomItem = questions[Math.floor(Math.random() * questions.length)];
            var count = questions.length;
            if(count > 10){
                count = 10;
            };
            if(id < count){
                return randomItem;
            } else {
                return false;
            }
        }
    }
})