'use strict';

angular.module('ia8queensApp')
    .factory('NQueensProblem', function (Problem) {
        /* private methods */
        
        /**
         * returns the number of conflicted queens
         */
        function numConflicted(state, row, col) {
            var result = 0;
            for (var i = 0; i < col; i++) {
                result += numConflicts(row, col, state[i], i);
            }
            return result;
        }
        
        function numConflicts(rowA, colA, rowB, colB) {
            var result = 0;
            
            if (rowA === rowB) {
                result += 1;
            }
            
            if (colA === colB) {
                result += 1;
            }
            
            if (rowA - colA === rowB - colB) {
                result += 1;
            }
            
            if (rowA + colA === rowB + colB) {
                result += 1;
            }
            console.log("num conflicts: ", result);
            return result;
        }
        
        var NQueensProblem = Problem.extend({
            /**
             * @param boardSize int default 8
             */
            init: function (boardSize) {
                this.boardSize = boardSize || 8;
                this.initial = new Array(this.boardSize);
                for (var i = 0; i < this.boardSize; i++) {
                    //this.initial[i] = null;
                    this.initial[i] = _.random(0, this.boardSize - 1);
                }
                this.solved = -1; // indicate the column already solved, -1 for none.
                
                console.log("board: ", this.initial); // debug
            },
            /**
             * In the leftmost empty column, try all non-conflicting rows.
             */
            actions: function (state) {
                // TODO: refazer este trecho para não depender de valores null no state.
                if (this.solved == -1) {
                    this.solved = 0;
                }
                var col = this.solved;
                var result = [];
                for (var row = 0; row < this.boardSize; row++) {
                    if (! this.conflicted(state, row, col)) {
                        result.push(row);
                    }
                }
                console.log("actions: ", result); // debug
                this.solved++;
                return result;
            },
            /**
             * Place the next queen at the given row.
             */
            result: function (state, row) {
                var col = state[this.solved];
                var array = [];
                var len = state.length;
                for (var i = 0; i < len; i++) {
                    array.push(state[i]);
                }
                array[col] = row;
                return array;
            },
            /**
             * Would placing a queen at (row, col) conflict with anything?
             * @return boolean true if conflicted, false otherwise.
             */
            conflicted: function (state, row, col) {
                for (var i = 0; i < col; i++) {
                    if (this.conflict(row, col, state[i], i)) {
                        return true;
                    }
                }
                return false;
            },
            /**
             * Would putting two queens in (rowA, colB) and (rowA, colB) conflict?
             */
            conflict: function (rowA, colA, rowB, colB) {
                return (
                    rowA === rowB ||                // same row
                    colA === colB ||                // same col
                    rowA - colA === rowB - colB ||  // same \ diagonal
                    rowA + colA === rowB + colB     // same / diagonal
                );
            },
            /**
             * Check if all columns filled, no conflicts.
             */
            goalTest: function (state) {
                var len = state.length;
                /*if (state[len - 1] === null) {
                    return false;
                }*/
                
                for (var col = 0; col < len; col++) {
                    if (this.conflicted(state, state[col], col)) {
                        return false;
                    }
                }
                return true;
            },
            /**
             * Estimates the distance to goal by the number of attacking pairs of queens on the board.
             */
            value: function (state) {
                // TODO: usar heurística de
                // https://code.google.com/p/aima-java/source/browse/trunk/aima-core/src/main/java/aima/core/environment/nqueens/AttackingPairsHeuristic.java
                // https://code.google.com/p/n-queens-hillclimb/source/browse/trunk/src/Board.java
                var len = state.length;
                var result = 0;
                for (var i = 0; i < len; i++) {
                    for (var j = 1; j + i < len; j++) {
                        // row
                        if (state[i] === state[j + i]) {
                            result++;
                        }
                        
                        // upper diagonal
                        if (state[i] - j === state[j + i]) {
                            result++;
                        }
                        
                        // lower diagonal
                        if (state[i] + j === state[j + i]) {
                            result++;
                        }
                    }
                }
                console.log("result: ", result);
                return result;
            }
        });
        
        return NQueensProblem;
    });