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
        $scope.cnf = {
            dimacs: '',
            numQueens: 4,
            options: [4, 5, 6, 7, 8]
        };
        $scope.strategies = [
            {
                id: 'hc',
                description: 'Hill Climbing'
            },
            {
                id: 'sa',
                description: 'Simulated Annealing'
            },
            {
                id: 'ga',
                description: 'Genetic Algorithm'
            },
            {
                id: 'tab',
                description: 'Tableaux'
            },
            {
                id: 'res',
                description: 'Resolution'
            }
        ];
        $scope.strategy = 'tab';

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
            } else if ($scope.strategy === 'tab') {
                generateDimacsCNF();
            } else if ($scope.strategy === 'res') {
                generateDimacsCNF();
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

        function generateDimacsCNF() {
            var nq = $scope.cnf.numQueens;
            var cntr1 = nq;
            var cntr2 = 0
            var cntr3 = 0
            var cntr4 = 0
            var result = 'c\n';
            result += 'c DIMACS generated for ' + nq + ' queens\n';
            result += 'c\n';

            // constraint: at least one queen per line
            var line1 = 'c at least one queen per line\n'
            // constraint: not 2 queens on the same line
            var line2 = 'c not (2 queens on the same line)\n'
            // constraint: not 2 queens on the same column
            var line3 = 'c not (2 queens on the same column)\n'
            // constraint: not 2 queens on the same right diagonal
            var line4 = 'c not (2 queens on the same diagonal)\n'
            for (var i = 0; i < nq; i++) {
                for (var j = 0; j < nq; j++) {
                    line1 += '' + ((i * nq) + j + 1) + ' '

                    for (var k = j + 1, m = 0; k < nq; k++) {
                        line2 += '-' + ((i * nq) + j + 1) + ' '
                        line2 += '-' + ((i * nq) + k + 1) + ' 0\n'
                        cntr2++

                        line3 += '-' + ((j * nq) + i + 1) + ' '
                        line3 += '-' + ((k * nq) + i + 1) + ' 0\n'
                        cntr3++

                        if (i + 1 < nq && j + 1 < nq
                                && m + i < nq - 1 && m + j < nq - 1) {
                            m++
                            line4 += '-' + (i + 1) + '' + (j + 1) + ' '
                            line4 += '-' + (m + i + 1) + (m + j + 1) + ' 0\n'
                            cntr4++
                        }
                    }
                }
                line1 += '0\n'
            }
            // formula
            result += 'p cnf ' + (nq * nq) + ' ' + (cntr1 + cntr2 + cntr3 + cntr4) + '\n'
            result += line1;
            result += line2;
            result += line3;
            result += line4;

            $scope.cnf.dimacs = result;
        }
    });
