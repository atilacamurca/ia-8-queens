'use strict';

angular.module('ia8queensApp')
    .controller('MainCtrl', function ($scope, HillClimbing, Genetic) {
        $scope.board = [
            [0, 0, 0, 1, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 1],
            [0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0],
            [0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0]
        ];
		$scope.message = null;
        $scope.cls_message = null;
        $scope.strategies = ['hc', 'sa', 'g'];
        $scope.strategy = 'g';
        
        $scope.color = function(x, y) {
            var isBlack = (x % 2 === 0);
            var isBlack = (y % 2 === 0 ? isBlack : !isBlack);
            
            return isBlack;
        };
        
        /*var problem = new NQueensProblem();
        var solution = hillClimbing.solve(problem);
        console.log(solution);
        console.log(problem.goalTest(solution));*/
		$scope.solve = function () {
            if ($scope.strategy === "hc") {
                var problem = new HillClimbing();
                $scope.board = problem.solve();
                if (problem.cost != 0) {
                    $scope.message = "Solution not found!";
                    $scope.cls_message = "alert-danger";
                } else {
                    $scope.message = "Solution found!";
                    $scope.cls_message = "alert-success";
                }
            } else if ($scope.strategy === "g") {
                var problem = new Genetic();
                problem.initializeChromosomes();
                problem.solve();
                console.dir(problem.solution);
            }
                
		};
    });
