'use strict';

angular.module('ia8queensApp')
    .factory('Chromosome', function () {
        // Referência: http://www.mnemstudio.org/ai/ga/nqueens_python_ex1.txt
        var Chromosome = Class.extend({
            init: function (maxLength) {
                this.maxLength = maxLength;
                this.fitness = 0.0;
                this.selected = false;
                this.selectionProbability = 0.0;
                this.conflicts = 0;
                
                this.data = [];
                for (var i = 0; i < this.maxLength; i++) {
                    this.data.push(i);
                }
            },
            computeConflicts: function () {
                var x           = 0,
                    y           = 0,
                    tempx       = 0,
                    tempy       = 0,
                    board       = [],
                    conflicts   = 0,
                    dx          = [-1, 1, -1, 1],
                    dy          = [-1, 1, 1, -1];
                    //done        = false;
                
                for (var i = 0; i < this.maxLength; i++) {
                    board[i] = arrayOf(this.maxLength);
                    board[i][this.data[i]] = 1;
                }
                
                // Walk through each of the Queens and compute the number of conflicts.
                for (var i = 0; i < this.maxLength; i++) {
                    x = i;
                    y = this.data[i];
                    
                    // check diagonals
                    for (var j = 0; j < dx.length; j++) {
                        tempx = x;
                        tempy = y;
                        //done = false;
                        while (! done) {
                            tempx += dx[j];
                            tempy += dy[j];
                            if ((tempx < 0 || tempx >= this.maxLength)
                                    || (tempy < 0 || tempy >= this.maxLength)) {
                                //done = true;
                                break;
                            } else {
                                if (board[tempx][tempy] === 1) {
                                    conflicts++;
                                }
                            }
                        }
                    }
                }
                this.conflicts = conflicts;
            }
        });
        
        return Chromosome;
    });