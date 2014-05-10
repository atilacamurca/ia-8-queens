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
                this.parent = parent;
                this.action = action;
                this.pathCost = pathCost;
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
                var len = actions.length;
                for (var i = 0; i < len; i++) {
                    this.childNode(problem, actions[i]);
                }
            },
            childNode: function (problem, action) {
                next = problem.result(this.state, action);
                return new Node(next, this, action,
                    problem.pathCost(this.pathCost, this.state, action, next));
            }
        });
    });