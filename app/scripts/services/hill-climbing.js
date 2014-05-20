'use strict';

angular.module('ia8queensApp')
    .factory('HillClimbing', function (Board) {
        /**
         * From the initial node, keep choosing the neighbor with highest value,
         * stopping when no neighbor is better.
         * @param problem instance of Class Problem
         */
        /*function solve (problem) {
            var currentNode = new Node(problem.initial);
            var tmp_limit = 100000, limit = 0;
            while (true && tmp_limit > limit) {
                
                console.log("state: ", currentNode.state); // debug
                
                var neighbors = currentNode.expand(problem);
                if (neighbors.length === 0) {
                    console.log("no neighbors.") // debug
                    break;
                }
                
                var neighbor = argmax_random_tie(neighbors, function (node) {
                    return problem.value(node.state);
                });
                console.log("neighbor: ", neighbor);
                console.log("neighbor value: ", problem.value(neighbor.state), ", current node value: ", problem.value(currentNode.state));
                
                if (problem.value(neighbor.state) <= problem.value(currentNode.state)) {
                    break;
                }
                currentNode = neighbor;
                limit++;
            }
            return currentNode.state;
        }
        
        return {
            solve: solve
        };*/
        
        var HillClimbing = Class.extend({
            init: function () {
                this.board = new Board();
                this.cost = this.heuristic(this.board);
				console.log("initial board: ", this.board.print());
                console.log("initial cost: ", this.cost);
            },
            solve: function () {
                var limit = 500;
                var count = 0;
                while (true && count < limit) {
                    var curViolations = this.cost;
                    this.findLowerCostBoard();
					console.log("cost: ", this.cost);
                    if (curViolations === this.cost) {
                        break;
                    }
                    
                    console.log("Number of violations: ", this.heuristic(this.board));
                    // colocar array com as casas em outro array para depois mostrar como foi a solução
                    console.log("number of steps: ", count);
                    count++;
                }
                
                if (this.cost != 0) {
                    console.log("solution not found");
                } else {
                    console.log("solution found");
                }
                console.log(this.board.print());
				return this.board.matrix;
            },
            findLowerCostBoard: function () {
                var lowCost = this.heuristic(this.board);
                var lowestAvailable = this.board;
                var len = this.board.boardSize;
                for (var row = 0; row < len; row++) {
                    for (var col = 0; col < len; col++) {
                        if (this.board.matrix[row][col] === 1) {
                            // get the lowest cost by moving this queen
                            for (var rowAux = 0; rowAux < len; rowAux++) {
                                for (var colAux = 0; colAux < len; colAux++) {
                                    if (this.board.matrix[rowAux][colAux] !== 1) {
                                        // try placing the queen here and see if it's any better
                                        var copy = this.clone(this.board);
                                        copy.matrix[row][col] = 0;
                                        copy.matrix[rowAux][colAux] = 1;
                                        var copyCost = this.heuristic(copy);
                                        if (copyCost < lowCost) {
                                            lowCost = copyCost;
                                            lowestAvailable = copy;
                                        }
                                        //copy = null;
                                    }
                                }
                            }
                        }
                    }
                }
                this.board = lowestAvailable;
                this.cost = lowCost;
            },
            heuristic: function (board) {
                var result = 0;
                var len = board.boardSize;
                // console.log("board: ", board);
                // var matrix = board.toOneDimension();
                
                /*for (var i = 0; i < len; i++) {
                    for (var j = 1; j + i < len; j++) {
                        // row
                        if (matrix[i] === matrix[j + i]) {
                            result += 1;
                        }
                        
                        // upper diagonal
                        if (matrix[i] - j === matrix[j + i]) {
                            result += 1;
                        }
                        
                        // lower diagonal
                        if (matrix[i] + j === matrix[j + i]) {
                            result += 1;
                        }
                    }
                }*/
				var hvcost = 0; // horizontal and vertical cost
				var dcost = 0;  // diagonal cost
				for (var i = 0; i < len; i++) {
					for (var j = 0; j < len; j++) {
						// if this node is a queen, calculate all violations
						// calculate horizontal and vertical
						if (board.matrix[i][j] === 1) {
							hvcost -= 2; // don't count yourself
							for (var k = 0; k < len; k++) {
								if (board.matrix[i][k] === 1)
									hvcost++;

								if (board.matrix[k][j] === 1)
									hvcost++;
							}

							// calculate diagonal
							var k = i + 1;
							var l = j + 1;
							while (k < len && l < len) {
								if (board.matrix[k][l] === 1)
									dcost++;

								k++;
								l++;
							}

							k = i + 1;
							l = j - 1;
							while (k < len && l >= 0) {
								if (board.matrix[k][l] === 1)
									dcost++;

								k++;
								l--;
							}

							k = i - 1;
							l = j + 1;
							while (k >= 0 && l < len) {
								if (board.matrix[k][l] === 1)
									dcost++;

								k--;
								l++;
							}

							k = i - 1;
							l = j - 1;
							while (k >= 0 && l >= 0) {
								if (board.matrix[k][l] === 1)
									dcost++;

								k--;
								l--;
							}
						}
					}
				}
                return ((dcost + hvcost) / 2);
            },
            clone: function (object) {
                var len = object.boardSize;
                var board = new Board();
                for (var i = 0; i < len; i++) {
                    for (var j = 0; j < len; j++) {
                        board.matrix[i][j] = object.matrix[i][j];
                    }
                }
                return board;
            }
        });
        
        return HillClimbing;
    });
