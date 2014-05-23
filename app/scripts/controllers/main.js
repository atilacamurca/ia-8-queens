'use strict';

angular.module('ia8queensApp')
    .controller('MainCtrl', function ($scope, HillClimbing, Genetic, SimulatedAnnealing) {
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
        $scope.g_info = null;
        $scope.strategies = ['hc', 'sa', 'ga'];
        $scope.strategy = 'ga';
        
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
        $scope.sa_options = {
            initialTemperature: 30.0,
            finalTemperature: 0.5,
            alpha: 0.99,
            stepsPerChange: 100
        };
        
        $scope.color = function(x, y) {
            var isBlack = (x % 2 === 0);
            var isBlack = (y % 2 === 0 ? isBlack : !isBlack);
            
            return isBlack;
        };
        
		$scope.solve = function () {
            // reset values
            $scope.message = null;
            $scope.cls_message = null;
            $scope.g_info = null;
            
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
            } else if ($scope.strategy === "ga") {
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
                var solution = problem.solution.data;
                console.log("best solution: ", solution);
                if (solution.length === 8) {
                    fillBoard(solution);
                    $scope.message = "Solution found!";
                    $scope.cls_message = "alert-success";
                } else {
                    $scope.message = "Solution not found!";
                    $scope.cls_message = "alert-danger";
                }
                $scope.g_info = {
                    epoch: problem.epoch,
                    mutations: problem.mutations,
                    childCount: problem.childCount,
                    solution: solution
                };
            } else if ($scope.strategy === "sa") {
                
                var problem = new SimulatedAnnealing(
                    $scope.sa_options.initialTemperature,
                    $scope.sa_options.finalTemperature,
                    $scope.sa_options.alpha,
                    $scope.sa_options.stepsPerChange
                );
                var solution = problem.solve();
                console.log(solution);
                fillBoard(solution);
                $scope.message = "Solution found!";
                $scope.cls_message = "alert-success";
            }
		};
        
        var fillBoard = function(arraySolution) {
            for (var i = 0; i < arraySolution.length; i++) {
                for (var j = 0; j < arraySolution.length; j++) {
                    if (arraySolution[i] === j) {
                        $scope.board[i][j] = 1;
                    } else {
                        $scope.board[i][j] = 0;
                    }
                }
            }
        };
    });
