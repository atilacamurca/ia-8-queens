
/**
 * Return an element with lowest callback(array[i]) score; break ties at random.
 * Thus, for all s,f: argmin_random_tie(s, f) in argmin_list(s, f)
 */
function argmin_random_tie (array, callback) {
    array = array || [];
    var len = array.length;
    if (len === 0) {
        return null;
    }
    var bestScore = callback(array[0]);
    var best = null;
    var n = 0;
    for (var i = 0; i < len; i++) {
        var node = array[i];
        var xscore = callback(node);
        if (xscore < bestScore) {
            best = node;
            bestScore = xscore;
            n = 1;
        } else if (xscore === bestScore) {
            n++;
            if (_.random(0, n) === 0) {
                best = node;
            }
        }
    }
    return best;
}

/**
 * Return an element with highest fn(seq[i]) score; break ties at random.
 * @param array
 * @param callback
 */
function argmax_random_tie (array, callback) {
    return argmin_random_tie(array, function (x) {
        return callback(x) * -1;
    });
}

/**
 * @license Copyright 2014 - Chris West - MIT Licensed
 */
(function(RGX) {
    fracPart = function(num) {
        return +(+num).toExponential().replace(RGX, function(m, neg, num, dot, offset) {
            var zeroes = Array(Math.abs(offset) + 2).join('0');
            num = (zeroes + num + (dot ? '' : '.') + zeroes).split('.');
            return +(neg + '.' + num.join('').slice(+offset + num[0].length));
        });
    };
})(/(-?)(\d+(\.?)\d*)e(.+)/);

/**
 * returns an array of values with the especified size.
 * @param size
 * @param value default 0
 */
function arrayOf(size, value) {
    value = value || 0;
    var array = [];
    for (var i = 0; i < size; i++) {
        array[i] = 0;
    }
    return array;
}