'use strict';

angular.module('ia8queensApp')
    .factory('Board', function () {
        var Board = Class.extend({
            init: function () {
                // board
                this.matrix = [
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0]
                ];
                this.boardSize = this.matrix.length;
                
                for (var i = 0; i < this.boardSize; i++) {
                    var random = _.random(0, this.boardSize - 1);
                    this.matrix[i][random] = 1;
                }
				// initialize queens at random places
				/*for (var i = 0; i < this.boardSize; i++) {
					while (true) {
						var rand_row = _.random(0, this.boardSize - 1);
						var rand_col = _.random(0, this.boardSize - 1);
						if (this.matrix[rand_row][rand_col] === 0) {
							this.matrix[rand_row][rand_col] = 1;
							break;
						}
					}
				}*/
                // console.log("matrix board: ", this.print());
            },
            print: function () {
                var string = "<";
                string += this.matrix[0].indexOf(1);
                for (var i = 1; i < this.boardSize; i++) {
                    string += "," + this.matrix[i].indexOf(1);
                }
                string += ">";
                return string;
            },
            toOneDimension: function () {
                var len = this.boardSize;
                var matrix = [];
                for (var i = 0; i < len; i++) {
                    matrix[i] = this.matrix[i].indexOf(1);
                }
                return matrix;
            }
        });
        
        return Board;
    });
