
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