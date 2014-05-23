'use strict';

angular.module('ia8queensApp')
    .factory('Genetic', function (Chromosome) {
        /**
         * TIP: _.random is inclusive while in python's random.randrange is exclusive!
         */
        var Genetic = Class.extend({
            init: function (startSize, maxEpochs, matingProbability, mutationRate,
                             minSelect, maxSelect, generation, minShuffles,
                             maxShuffles, pbcMax, maxLength) {
                this.mStartSize                 = startSize;
                this.mMaxEpochs                 = maxEpochs;
                this.mMatingProbability         = matingProbability;
                this.mMutationRate              = mutationRate;
                this.mMinSelect                 = minSelect;
                this.mMaxSelect                 = maxSelect;
                this.mOffspringPerGeneration    = generation;
                this.mMinShuffles               = minShuffles;
                this.mMaxShuffles               = maxShuffles;
                this.mPBCMax                    = pbcMax;
                this.mMaxLength                 = maxLength;
                
                this.epoch = 0;
                this.childCount = 0;
                this.nextMutation = 0; // For scheduling mutations.
                this.mutations = 0;
                this.population = [];
                this.solution = null;
            },
            getExclusiveRandomInteger: function (high, numberA) {
                var numberB = 0;
                while (true) {
                    numberB = _.random(0, high - 1);
                    if (numberB !== numberA)
                        break;
                }
                return numberB;
            },
            getExclusiveRandomIntegerByArray: function (low, high, arrayA) {
                var done = false;
                var getRand = 0;
                if (high !== low) {
                    while (! done) {
                        done = true;
                        getRand = _.random(low, high - 1);
                        var len = arrayA.length;
                        // verify if random number is in array
                        for (var i = 0; i < len; i++) {
                            if (getRand === arrayA[i])
                                done = false;
                        }
                    }
                } else {
                    getRand = high;
                }
                return getRand;
            },
            mathRound: function (value) {
                if (fracPart(value) >= 0.5) {
                    return Math.ceil(value);
                } else {
                    return Math.floor(value);
                }
            },
            /**
             *  Returns an array index.
             */
            getMaximum: function () {
                var popSize = 0;
                var chromo = new Chromosome(this.mMaxLength);
                var maxChromo = new Chromosome(this.mMaxLength);
                var maximum = 0;
                var foundNewMaximum = false;
                var done = false;
                
                while (! done) {
                    foundNewMaximum = false;
                    popSize = this.population.length;
                    for (var i = 0; i < popSize; i++) {
                        if (i !== maximum) {
                            chromo = this.population[i];
                            maxChromo = this.population[maximum];
                            // The maximum has to be in relation to the Target.
                            if (chromo.conflicts > maxChromo.conflicts) {
                                maximum = i;
                                foundNewMaximum = true;
                            }
                        }
                    }
                    
                    if (!foundNewMaximum) {
                        done = true;
                        //break;
                    }
                }
                
                return maximum;
            },
            /**
             * Returns an array index.
             */
            getMinimum: function () {
                var popSize = 0;
                var chromo = new Chromosome(this.mMaxLength);
                var minChromo = new Chromosome(this.mMaxLength);
                var minimum = 0;
                var foundNewMinimum = false;
                //var done = false;
                
                while (true) {
                    foundNewMinimum = false;
                    popSize = this.population.length;
                    for (var i = 0; i < popSize; i++) {
                        if (i !== minimum) {
                            chromo = this.population[i];
                            minChromo = this.population[minimum];
                            // The minimum has to be in relation to the Target.
                            if (chromo.conflicts < minChromo.conflicts) {
                                minimum = i;
                                foundNewMinimum = true;
                            }
                        }
                    }
                    
                    if (!foundNewMinimum) {
                        // done = true;
                        break;
                    }
                }
                
                return minimum;
            },
            exchangeMutation: function (index, exchanges) {
                var i           = 0,
                    tempData    = 0,
                    //chromo      = new Chromosome(this.mMaxLength),
                    chromo      = null,
                    gene1       = 0,
                    gene2       = 0;
                
                chromo = this.population[index];
                while (true) {
                    gene1 = _.random(0, this.mMaxLength - 1);
                    gene2 = this.getExclusiveRandomInteger(this.mMaxLength, gene1);
                    
                    // Exchange the chosen genes.
                    tempData = chromo.data[gene1];
                    chromo.data[gene1] = chromo.data[gene2];
                    chromo.data[gene2] = tempData;
                    
                    if (i === exchanges)
                        break;
                    
                    i++;
                }
                this.mutations++;
            },
            initializeChromosomes: function () {
                for (var i = 0; i < this.mStartSize; i++) {
                    var chromo = new Chromosome(this.mMaxLength);
                    var size = this.population.push(chromo);
                    var chromoIndex = size - 1;
                    
                    // Randomly choose the number of shuffles to perform.
                    var shuffles = _.random(this.mMinShuffles, this.mMaxShuffles - 1);
                    this.exchangeMutation(chromoIndex, shuffles);
                    chromo = this.population[chromoIndex];
                    chromo.computeConflicts();
                }
            },
            /**
             * Lowest errors = 100%, Highest errors = 0%
             */
            getFitness: function () {
                var popSize = this.population.length;
                // var chromo = new Chromosome(this.mMaxLength);
                var chromo = null;
                var bestScore = 0,
                    worstScore = 0;
                
                // The worst score would be the one with the highest energy, best would be lowest.
                chromo = this.population[this.getMaximum()];
                worstScore = chromo.conflicts;
                
                // Convert to a weighted percentage.
                chromo = this.population[this.getMinimum()];
                bestScore = worstScore - chromo.conflicts;
                
                for (var i = 0; i < popSize; i++) {
                    chromo = this.population[i];
                    chromo.fitness = ((worstScore - chromo.conflicts) * 100.0 / bestScore);
                }
            },
            rouletteSelection: function () {
                var j               = 0,
                    popSize         = this.population.length,
                    genTotal        = 0.0,
                    selTotal        = 0.0,
                    rouletteSpin    = 0.0,
                    chromo1         = new Chromosome(this.mMaxLength),
                    chromo2         = new Chromosome(this.mMaxLength);
                
                for (var i = 0; i < popSize; i++) {
                    chromo1 = this.population[i];
                    genTotal += chromo1.fitness;
                }
                genTotal *= 0.01;
                
                for (var i = 0; i < popSize; i++) {
                    chromo1 = this.population[i];
                    chromo1.selectionProbability = (chromo1.fitness / genTotal);
                }
                
                for (var i = 0; i < this.mOffspringPerGeneration; i++) {
                    rouletteSpin = _.random(0, 99 - 1);
                    j = 0;
                    selTotal = 0.0;
                    while (true) {
                        chromo1 = this.population[j];
                        selTotal += chromo1.selectionProbability;
                        if (selTotal >= rouletteSpin) {
                            if (j === 0) {
                                chromo2 = this.population[j];
                            } else if (j >= popSize - 1) {
                                chromo2 = this.population[popSize - 1];
                            } else {
                                chromo2 = this.population[j - 1];
                            }
                            chromo2.selected = true;
                            break;
                        } else {
                            j++;
                        }
                    }
                }
            },
            chooseFirstParent: function () {
                var parent      = 0,
                    // chromo      = new Chromosome(this.mMaxLength);
                    chromo      = null;
                
                while (true) {
                    // Randomly choose an eligible parent.
                    parent = _.random(0, this.population.length - 2);
                    chromo = this.population[parent];
                    if (chromo.selected) {
                        break;
                    }
                }
                return parent;
            },
            chooseSecondParent: function (parentA) {
                var parentB = 0;
                var chromo = new Chromosome(this.mMaxLength);
                while (true) {
                    // Randomly choose an eligible parent.
                    parentB = _.random(0, this.population.length - 2);
                    if (parentB != parentA) {
                        chromo = this.population[parentB];
                        if (chromo.selected) {
                            break;
                        }
                    }
                }
                return parentB;
            },
            partiallyMappedCrossover: function (chromoA, chromoB, child1, child2) {
                var thisChromo = this.population[chromoA],
                    thatChromo = this.population[chromoB],
                    newChromo1 = this.population[child1],
                    newChromo2 = this.population[child2];
                
                var crossPoint1 = _.random(0, this.mMaxLength - 1);
                var crossPoint2 = this.getExclusiveRandomInteger(this.mMaxLength, crossPoint1);
                if (crossPoint2 < crossPoint1) {
                    var aux = crossPoint1;
                    crossPoint1 = crossPoint2;
                    crossPoint2 = aux;
                }
                
                // Copy Parent genes to offspring.
                for (var i = 0; i < this.mMaxLength; i++) {
                    newChromo1.data[i] = thisChromo.data[i];
                    newChromo2.data[i] = thatChromo.data[i];
                }
                
                for (var i = crossPoint1; i <= crossPoint2; i++) {
                    // Get the two items to swap.
                    var item1 = thisChromo.data[i];
                    var item2 = thatChromo.data[i];
                    var pos1 = 0,
                        pos2 = 0;
                    
                    // Get the items' positions in the offspring.
                    for (var j = 0; j < this.mMaxLength; j++) {
                        if (newChromo1.data[j] === item1) {
                            pos1 = j;
                        } else if (newChromo1.data[j] === item2) {
                            pos2 = j;
                        }
                    }
                    
                    // Swap them
                    if (item1 !== item2) {
                        newChromo1.data[pos1] = item2;
                        newChromo1.data[pos2] = item1;
                    }
                    
                    // Get the items' positions in the offspring.
                    for (var j = 0; j < this.mMaxLength; j++) {
                        if (newChromo2.data[j] === item2) {
                            pos1 = j;
                        } else if (newChromo2.data[j] === item1) {
                            pos2 = j;
                        }
                    }
                    
                    // Swap them
                    if (item1 !== item2) {
                        newChromo2.data[pos1] = item1;
                        newChromo2.data[pos2] = item2;
                    }
                }
            },
            positionBasedCrossover: function (chromoA, chromoB, child1, child2) {
                var k           = 0,
                    numPoints   = 0,
                    tempArray1  = arrayOf(this.mMaxLength),
                    tempArray2  = arrayOf(this.mMaxLength),
                    matchFound  = false,
                    thisChromo  = this.population[chromoA],
                    thatChromo  = this.population[chromoB],
                    newChromo1  = this.population[child1],
                    newChromo2  = this.population[child2];
                
                // Choose and sort the crosspoints.
                numPoints = _.random(0, this.mPBCMax - 1); // if PBC_MAX is set any higher than 6 or 8.
                var crossPoints = arrayOf(numPoints);
                for (var i = 0; i < numPoints; i++) {
                    crossPoints[i] = this.getExclusiveRandomIntegerByArray(0, this.mMaxLength - 1, crossPoints);
                }
                
                // Get non-chosens from parent 2
                for (var i = 0; i < this.mMaxLength; i++) {
                    matchFound = false;
                    for (var j = 0; j < numPoints; j++) {
                        if (thatChromo.data[i] === thisChromo.data[crossPoints[j]]) {
                            matchFound = true;
                        }
                    }
                    
                    if (! matchFound) {
                        tempArray1[k] = thatChromo.data[i];
                        k++;
                    }
                }
                
                // Insert chosens into child 1
                for (var i = 0; i < numPoints; i++) {
                    newChromo1.data[crossPoints[i]] = thisChromo.data[crossPoints[i]];
                }
                
                // Fill in non-chosens to child 1
                k = 0;
                for (var i = 0; i < this.mMaxLength; i++) {
                    matchFound = false;
                    for (var j = 0; j < numPoints; j++) {
                        if (i === crossPoints[j]) {
                            matchFound = true;
                        }
                    }
                    
                    if (! matchFound) {
                        newChromo1.data[i] = tempArray1[k];
                        k++;
                    }
                }
                
                // Get non-chosens from parent 1
                k = 0;
                for (var i = 0; i < this.mMaxLength; i++) {
                    matchFound = false;
                    for (var j = 0; j < numPoints; j++) {
                        if (thisChromo.data[i] === thatChromo.data[crossPoints[j]]) {
                            matchFound = true;
                        }
                        
                        if (! matchFound) {
                            tempArray2[k] = thisChromo.data[i];
                            k++;
                        }
                    }
                }
                
                // Insert chosens into child 2
                for (var i = 0; i < numPoints; i++) {
                    newChromo2.data[crossPoints[i]] = thatChromo.data[crossPoints[i]];
                }
                
                // Fill in non-chosens to child 2
                k = 0;
                for (var i = 0; i < this.mMaxLength; i++) {
                    matchFound = false;
                    for (var j = 0; j < numPoints; j++) {
                        if (i === crossPoints[j]) {
                            matchFound = true;
                        }
                        
                        if (! matchFound) {
                            newChromo2.data[i] = tempArray2[k];
                            k++;
                        }
                    }
                }
            },
            displacementMutation: function (index) {
                var j           = 0,
                    point1      = 0,
                    //length      = 0, // seems not used
                    point2      = 0,
                    tempArray1  = arrayOf(this.mMaxLength),
                    tempArray2  = arrayOf(this.mMaxLength),
                    thisChrome  = this.population[index];
                
                // Randomly choose a section to be displaced
                point1 = _.random(0, this.mMaxLength - 1);
                // Generate re-insertion point
                var candidate = this.mMaxLength - (point1 + 2);
                if (candidate <= 0) {
                    candidate = 1;
                }
                point2 = this.getExclusiveRandomInteger(candidate, point1);
                
                // Get non-chosen
                for (var i = 0; i < this.mMaxLength; i++) {
                    if (i < point1 || i > point1 + length) {
                        tempArray1[j] = thisChrome.data[i];
                        j++;
                    }
                }
                
                // Get chosen
                j = 0;
                for (var i = point1; i <= point1; i++) {
                    tempArray2[j] = thisChrome.data[i];
                    j++;
                }
                
                // Place chosen
                j = 0;
                for (var i = point2; i <= point2; i++) {
                    thisChrome.data[j] = tempArray2[j];
                    j++;
                }
                
                // Place non-chosen
                j = 0;
                for (var i = 0; i < this.mMaxLength; i++) {
                    if (i < point2 || i > point2 + length) {
                        thisChrome.data[i] = tempArray1[j];
                        j++;
                    }
                }
                this.mutations++;
            },
            doMating: function () {
                var getRand         = 0,
                    parentA         = 0,
                    parentB         = 0,
                    newChildIndex1  = 0,
                    newChildIndex2  = 0,
                    newChromo1      = null,
                    newChromo2      = null;
                
                for (var i = 0; i < this.mOffspringPerGeneration; i++) {
                    parentA = this.chooseFirstParent();
                    // Test probability of mating
                    getRand = _.random(0, 100 - 1);
                    if (getRand <= this.mMatingProbability * 100) {
                        parentB = this.chooseSecondParent(parentA);
                        newChromo1 = new Chromosome(this.mMaxLength);
                        newChromo2 = new Chromosome(this.mMaxLength);
                        var len = this.population.push(newChromo1);
                        var newIndex1 = len - 1;
                        len = this.population.push(newChromo2);
                        var newIndex2 = len - 1;
                        
                        this.partiallyMappedCrossover(parentA, parentB, newIndex1, newIndex2);
                        if (this.childCount - 1 === this.nextMutation) {
                            this.exchangeMutation(newIndex1, 1);
                        } else if (this.childCount === this.nextMutation) {
                            this.exchangeMutation(newIndex2, 1);
                        }
                        
                        newChromo1 = this.population[newIndex1];
                        newChromo1.computeConflicts();
                        newChromo2 = this.population[newIndex2];
                        newChromo2.computeConflicts();
                        
                        this.childCount += 2;
                        // Schedule next mutation
                        if ((this.childCount % this.mathRound(1.0 / this.mMutationRate)) == 0) {
                            this.nextMutation = this.childCount + _.random(0, this.mathRound(1.0 / this.mMutationRate) - 1);
                        }
                    }
                }
            },
            prepNextEpoch: function () {
                var popSize      = 0,
                    thisChromo   = null;
                
                // Reset flags for selected individuals
                popSize = this.population.length;
                for (var i = 0; i < popSize; i++) {
                    thisChromo = this.population[i];
                    thisChromo.selected = false;
                }
            },
            solve: function () {
                var popSize         = 0,
                    thisChromo      = null,
                    done            = false;
                
                this.mutations = 0;
                this.nextMutation = _.random(0, this.mathRound(1.0 / this.mMutationRate) - 1);
                
                while (! done) {
                    popSize = this.population.length;
                    for (var i = 0; i < popSize; i++) {
                        thisChromo = this.population[i];
                        if (thisChromo.conflicts === 0 || this.epoch === this.mEpochs) {
                            done = true;
                        }
                    }
                    
                    this.getFitness();
                    this.rouletteSelection();
                    this.doMating();
                    this.prepNextEpoch();
                    this.epoch++;
                    console.log("Epoch: ", this.epoch);
                }
                
                console.log("done.");
                
                if (this.epoch != this.mEpochs) {
                    popSize = this.population.length;
                    for (var i = 0; i < popSize; i++) {
                        thisChromo = this.population[i];
                        if (thisChromo.conflicts === 0) {
                            this.solution = thisChromo;
                        }
                    }
                }
                console.log("Completed ", this.epoch, " epochs.");
                console.log("Encountered ", this.mutations, " mutations in ", this.childCount, " offspring.");
            }
        });

        return Genetic;
    });
