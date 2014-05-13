'use strict';

angular.module('ia8queensApp')
    .factory('Node', function () {
        var Node = Class.extend({
            /**
             * Create a search tree Node, derived from a parent by an action.
             * @param state
             * @param parent default null
             * @param action default null
             * @param pathCost default 0
             */
            init: function (state, parent, action, pathCost) {
                this.state = state;
                this.parent = parent || null;
                this.action = action | null;
                this.pathCost = pathCost || 0;
                this.depth = 0;

                if (parent != null) {
                    this.depth = parent.depth + 1;
                }
            },
            /**
             * List the nodes reachable in one step from this node.
             */
            expand: function (problem) {
                var actions = problem.actions(this.state) || [];
                console.log("actions: ", actions);
                var len = actions.length;
                var result = [];
                for (var i = 0; i < len; i++) {
                    result.push(this.childNode(problem, actions[i]));
                }
                console.log("expanded nodes: ", result); // debug
                return result;
            },
            childNode: function (problem, action) {
                var next = problem.result(this.state, action);
                return new Node(next, this, action,
                    problem.pathCost(this.pathCost, this.state, action, next));
            },
            /**
             * Return the sequence of actions to go from the root to this node.
             */
            solution: function () {
                var result = [];
                var path = this.path();
                var len = path.length;
                for (var i = 1; i < len; i++) {
                    result.push(path[i].action);
                }
                return result;
            },
            /**
             * Return a list of nodes forming the path from the root to this node.
             */
            path: function () {
                var node = this;
                var pathBack = [];
                while (node) {
                    pathBack.unshift(node);
                    node = node.parent;
                }
                return pathBack;
            },
            equals: function (other) {
                return (other instanceof Node) && this.state === other.state;
            }
        });
        
        return Node;
    });