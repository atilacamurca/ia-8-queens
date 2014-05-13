'use strict';

angular.module('ia8queensApp')
    .factory('HillClimbing', function (Node) {
        /**
         * From the initial node, keep choosing the neighbor with highest value,
         * stopping when no neighbor is better.
         * @param problem instance of Class Problem
         */
        function hillClimbing (problem) {
            var currentNode = new Node(problem.initial);
            var tmp_limit = 1000, limit = 0;
            while (true && tmp_limit > limit) {
                var neighbors = currentNode.expand(problem);
                if (neighbors.length === 0) {
                    break;
                }
                
                var neighbor = argmax_random_tie(neighbors, function (node) {
                    return problem.value(node.state);
                });
                
                if (problem.value(neighbor.state) <= problem.value(currentNode.state)) {
                    break;
                }
                currentNode = neighbor;
                limit++;
            }
            return currentNode.state;
        }
    });