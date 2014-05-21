'use strict';

angular.module('ia8queensApp')
    .controller('MainCtrl', function ($scope, HillClimbing, Genetic) {
        $scope.board = [
            [0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 1, 0, 0, 0],
            [0, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0]
        ];
		$scope.message = null;
        $scope.cls_message = null;
        $scope.strategies = ['hc', 'sa', 'g'];
        $scope.strategy = 'g';
        
        $scope.g_options = {
            startSize: 75, // Population size at start
            maxEpochs: 1000, // Arbitrary number of test cycles
            matingProbability: 0.7, // Probability of two chromosomes mating. Range: 0.0 < MATING_PROBABILITY < 1.0
            mutationRate: 0.001, // Mutation Rate. Range: 0.0 < MUTATION_RATE < 1.0
            minSelect: 10,
            maxSelect: 50,
            offspringPerGeneration: 20,
            minShuffles: 8,
            maxShuffles: 20,
            PBCMax: 4,
            maxLength: 8
        };
        
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
                var problem = new Genetic(
                    $scope.g_options.startSize,
                    $scope.g_options.maxEpochs,
                    $scope.g_options.matingProbability,
                    $scope.g_options.mutationRate,
                    $scope.g_options.minSelect,
                    $scope.g_options.maxSelect,
                    $scope.g_options.offspringPerGeneration,
                    $scope.g_options.minShuffles,
                    $scope.g_options.maxShuffles,
                    $scope.g_options.PBCMax,
                    $scope.g_options.maxLength
                );
                problem.initializeChromosomes();
                problem.solve();
                var solution = _.filter(problem.solution.data, function (value) { return !_.isUndefined(value) });
                console.log("best solution: ", solution);
                if (solution.length === 8) {
                    for (var i = 0; i < solution.length; i++) {
                        for (var j = 0; j < solution.length; j++) {
                            if (solution[i] === j) {
                                $scope.board[i][j] = 1;
                            } else {
                                $scope.board[i][j] = 0;
                            }
                        }
                    }
                    $scope.message = "Solution found!";
                    $scope.cls_message = "alert-success";
                } else {
                    $scope.message = "Solution not found!";
                    $scope.cls_message = "alert-danger";
                }
            }
                
		};
    });
