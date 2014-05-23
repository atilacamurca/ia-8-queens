'use strict';

angular.module('ia8queensApp')
    .factory('SimulatedAnnealing', function () {
        /**
         * Referência: http://herselfsai.com/2007/03/simulated-annealing.html
         */
        var SimulatedAnnealing = Class.extend({
            init: function (initialTemperature, finalTemperature, alpha, stepsPerChange) {
                this.initialTemperature     = initialTemperature;
                this.finalTemperature       = finalTemperature;
                this.alpha                  = alpha;
                this.stepsPerChange         = stepsPerChange;
                this.maxLength              = 8;
                
                this.currentSolution    = arrayOf(this.maxLength, -1);
                this.bestSolution       = arrayOf(this.maxLength, -1);
                this.workingSolution    = arrayOf(this.maxLength, -1);
                
                this.workingEnergy      = 0;
                this.bestEnergy         = 0;
                this.currentEnergy      = 0;
                this.setRandomNumberGenerator = false;
            },
            solve: function () {
                var step            = 0,
                    //solution        = false,
                    useNew          = false, // indicates when to use the new solution found
                    accepted        = 0,
                    temperature     = this.initialTemperature;
                
                // set up the initial board setting one queen to a row and
                // do not allow any queens in the same rows as previous queens.
                for (var i = 0; i < this.maxLength; i++) {
                    var x = this.getLargeRandom(this.maxLength);
                    // check that queens are in separate rows
                    for (var j = 0; j < i; j++) {
                        // if we have a row match need a new row
                        while (x === this.workingSolution[j]) {
                            x = this.getLargeRandom(this.maxLength);
                            j = 0; // check new match against numbers we've already checked
                        }
                    }
                    // set initial values for each array
                    this.workingSolution[i] = x;
                    this.currentSolution[i] = x;
                    this.bestSolution[i] = x;
                }
                
                // initialize energy
                this.workingEnergy = this.computeEnergy(this.workingSolution);
                this.currentEnergy = this.computeEnergy(this.currentSolution);
                this.bestEnergy = this.computeEnergy(this.bestSolution);
                
                // main loop continue until we reach lowest temperature
                while (temperature > this.finalTemperature) {
                    accepted = 0;
                    for (step = 0; step < this.stepsPerChange; step++) {
                        useNew = false;
                        this.tweakSolution(this.workingSolution);
                        this.workingEnergy = this.computeEnergy(this.workingSolution);
                        if (this.workingEnergy < this.currentEnergy) {
                            useNew = true;
                        } else {
                            // if workingEnergy more than current try this test
                            // P(dE) = exp ( -dE/T )
                            // this accepts worse solutions at higher temperatures
                            // this allows us to check more solutions at higher temperatures to help
                            // avoid local mins.
                            var randomTest = this.getSmallRandom();
                            var delta = this.workingEnergy - this.currentEnergy;
                            var calculation = Math.exp(-delta / temperature);
                            
                            if (calculation > randomTest) {
                                accepted++;
                                useNew = true;
                            }
                        }
                        
                        if (useNew) {
                            // copy working solution to current solution
                            useNew = false;
                            this.currentEnergy = this.workingEnergy;
                            for (var i = 0; i < this.maxLength; i++) {
                                this.currentSolution[i] = this.workingSolution[i];
                            }
                            
                            // if our new solution is better than the best solution so far
                            // > make that one the best solution
                            if (this.currentEnergy < this.bestEnergy) {
                                this.bestEnergy = this.currentEnergy;
                                for (var i = 0; i < this.maxLength; i++) {
                                    this.bestSolution[i] = this.currentSolution[i];
                                }
                            }
                        } else {
                            this.workingEnergy = this.currentEnergy;
                            for (var i = 0; i < this.maxLength; i++) {
                                this.workingSolution[i] = this.currentSolution[i];
                            }
                        }
                    }
                    
                    temperature *= this.alpha;
                    
                    // if we have solution no point continuing to loop
                    if (this.bestEnergy === 0) {
                        // solution found;
                        break; // break while
                    }
                }
                
                console.log("best energy: ", this.bestEnergy);
                console.log("steps: ", step);
                return this.bestSolution;
            },
            /**
             * return a random number between 0 and 1
             */
            getSmallRandom: function () {
                return Math.random();
            },
            /**
             * return a number between zero and maximum
             */
            getLargeRandom: function (maximum) {
                return _.random(0, maximum - 1);
            },
            /**
             * randomly perturn the solution
             */
            tweakSolution: function (array) {
                var tempValue = 0,
                    // pick an x and a y randomly to change
                    x = this.getLargeRandom(this.maxLength),
                    y = this.getLargeRandom(this.maxLength);
                
                // avoid duplicates
                while (x === y) {
                    y = this.getLargeRandom(this.maxLength);
                }
                
                // swap x and y
                tempValue = array[x];
                array[x] = array[y];
                array[y] = tempValue;
            },
            /**
             * compute energy  ie how many queens are on diagonals with other queens?
             */
            computeEnergy: function (array) {
                var conflicts = 0;
                
                //lets see what we have for conflicts
                //we aleady have set things up so neither horizontal or vertical
                //conflicts can happen.  So we just need to check the diagonals

                //move through each column left to right 
                // no one to right of last piece, nothing to check there so go to maxLength -1 only
                for (var i = 0; i < this.maxLength - 1; i++) {
                    var x = 0;
                    for (var j = i + 1; j < this.maxLength; j++) {
                        x++;
                        if (array[i] - x === array[j]) {
                            conflicts++;
                        }
                        if (array[i] + x === array[j]) {
                            conflicts++;
                        }
                    }
                }
                return conflicts;
            }
        });

        return SimulatedAnnealing;
    });
