'use strict';

angular.module('ia8queensApp')
    .factory('hillClimbing', function (Node) {
        /**
         * From the initial node, keep choosing the neighbor with highest value,
         * stopping when no neighbor is better.
         * @param problem instance of Class Problem
         */
        function solve (problem) {
            var currentNode = new Node(problem.initial);
            var tmp_limit = 10000, limit = 0;
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
        };
    });