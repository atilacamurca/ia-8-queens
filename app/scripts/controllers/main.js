'use strict';

angular.module('ia8queensApp')
    .controller('MainCtrl', function ($scope, HillClimbing, NQueensProblem) {
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
        	var problem = new HillClimbing();
        	$scope.board = problem.solve();
			$scope.message = (problem.cost != 0 ? "Solution not found!" : "Solution found!");
		};
    });
