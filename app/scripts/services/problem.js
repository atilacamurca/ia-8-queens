'use strict';

angular.module('ia8queensApp')
    .factory('Problem', function () {
        var Problem = Class.extend({
            init: function (initial, goal) {
                this.initial = initial;
                this.goal = goal;
            },
            actions: function (state) {
                return null;
            },
            result: function (state, action) {
                return null;
            },
            goalTest: function (state) {
                return state === this.goal;
            },
            pathCost: function (cost, state1, action, state2) {
                return cost + 1;
            },
            value: function (state) {
                return null;
            }
        });
        
        return Problem;
    });