'use strict';

angular.module('ia8queensApp')
    .factory('NQueensProblem', function (Problem) {
        var NQueensProblem = Problem.extend({
            /**
             * @param boardSize int default 8
             */
            init: function (boardSize) {
                this.boardSize = boardSize || 8;
                this.initial = new Array(boardSize);
                for (var i = 0; i < boardSize; i++) {
                    this.initial[i] = null;
                }
            },
            /**
             * In the leftmost empty column, try all non-conflicting rows.
             */
            actions: function (state) {
                var len = state.length;
                if (state[len - 1] === null) {
                    return [];
                } else {
                    col = state.indexOf(null);
                    var result = [];
                    for (var row = 0; row < this.boardSize; row++) {
                        if (! this.conflicted(state, row, col)) {
                            result.push(row);
                        }
                    }
                    return result;
                }
            },
            conflicted: function (state, row, col) {
                // TODO
            }
        });
    });