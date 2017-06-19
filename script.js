//version 0.0.1

this.toDecimals = function (number, decimals) {
    if (number)
        return Number((Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals));
    return 0;
}

this.controlPercent = function (results, decimals) {
    var total = 0;
    var roundResults = [];

    results.forEach(function (result) {
        roundResults.push(this.toDecimals(result, decimals));
    }, this);

    total = roundResults.reduce((a, b) => { return a + b; }, 0);

    if (total != 1) {
        var diff = [];

        results.forEach(function (result, index) {
            if (Math.abs(roundResults[index] - result) == 0.005) {
                (total > 1) ? (roundResults[index] -= 0.01) : (roundResults[index] += 0.01);
                return roundResults;
            } else {
                diff.push(roundResults[index] - result);
            };
        }, this);

        (total > 1) ?
            (roundResults[diff.indexOf(Math.max(...diff))] -= 0.01)
            :
            (roundResults[diff.indexOf(Math.min(...diff))] += 0.01);
    }
    return roundResults;
}

this.percent = function (values) {
    var total = 0;
    var results = [];
    var decimals = 2;

    if (!angular.isArray(values) || values.length == 0) {
        console.error("Type Error: argument in function 'percent' must be array of minimum length = 1!");
        return null;
    }

    for (var index = 0; index < values.length; index++) {
        if (angular.isUndefined(values[index])) {
            values[index] = 0;
        } else if ((!angular.isNumber(values[index])) || (values[index] < 0)) {
            console.error("Type Error: " + values[index] + "(type: " + typeof (values[index]) + ")" + " is not number or smaller then 0!");
            total = 0;
            break;
        } else {
            total += values[index];
        }
    }

    if (!total) {
        return Array.apply(null, Array(values.length)).map(Number.prototype.valueOf, 0);
    }

    values.forEach(function (value) {
        results.push(value / total);
    });

    results = this.controlPercent(results, decimals);

    return results;
}