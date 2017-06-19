vm.toDecimals = function (number, decimals) {
    if (number)
        return Number((Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals));
    return 0;
}

vm.controlPercent = function (results, decimals) {
    var total = 0;
    var roundResults = [];

    results.forEach(function (result) {
        roundResults.push(vm.toDecimals(result, decimals));
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

vm.percent = function (values) {
    var total = 0;
    var results = [];
    var decimals = 2;

    if (!angular.isArray(values)) {
        console.error("Argument must be array!");
        return;
    }

    values.forEach(function (value) {
        if ((!angular.isNumber(value)) || (value < 0)) {
            console.error(value + " is not number or smaller then 0!");
            return;
        }
        total += value;
    }, this);

    if (total == 0) {
        console.error("Total of all values is 0!");
        return;
    }

    values.forEach(function (value) {
        results.push(value / total);
    });

    results = vm.controlPercent(results, decimals);
    return results;
}