vm.toDecimals = function (number, decimals) {
    if (number)
        return Number((Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals));
    return 0;
}

//values must be array of values
//decimals >= 2
vm.percent = function (values) {
    var total = 0;
    var results = [];
    var decimals = 2;

    if (!angular.isArray(values)) {
        console.error("Argument must be array!");
        return;
    }

    values.forEach(function (value) {
        //hodnota není číslo, nebo je záporná
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

    //získání hodnot pro jednotlivé položky
    values.forEach(function (value) {
        results.push(value / total);
    });

    //výsledky poslány na kontrolu
    results = vm.controlPercent(results, decimals);

    return results;
}

vm.controlPercent = function (results, decimals) {
    var total = 0;
    var roundResults = [];

    //pro kontrolované hodnoty
    results.forEach(function (result) {
        //zaokrouhlená hodnota
        roundResults.push(vm.toDecimals(result, decimals));
    }, this);

    total = roundResults.reduce((a, b) => { return a + b; }, 0);

    //total == 100% (1)
    if (total != 1) {
        var diff = [];

        //pro každou hodnotu získání rozdílu mezi počátečním a zaokrouhleným číslem
        results.forEach(function (result, index) {
            //rozdíl '0.005' je největší a nejideálnější, který může být a dále hledat netřeba
            if (Math.abs(roundResults[index] - result) == 0.005) {
                (total > 1) ? (roundResults[index] -= 0.01) : (roundResults[index] += 0.01);
                return roundResults;
            } else {
                //ukládání rozdílů
                diff.push(roundResults[index] - result);
            };
        }, this);

        (total > 1) ?
            /** Najdeme ten největší rozdíl, jelikož v nejkrajnějším případě je původní číslo _._051 a zaokrouhlené je _._1 => rozdíl 0.0049.
             *  Pak tedy odečtením 0.01 je rozdíl od původního čísla maximálně 0.0051.
             * 
             *  Kdybychom hledali nejmenší, v nejkrajnějším případě dostaneme _._49 a zaokrouhlené je _._0 => rozdíl -0.0049.
             *  Pak tedy odečtením 0.01 je rozdíl od původního čísla maximálně -0.0149 => což je daleko větší než 0.0051 výše zmiňované.
             * 
             *  Dojde tedy k nejmenšímu zkreslení reálného výsledku!
             */
            (roundResults[diff.indexOf(Math.max(...diff))] -= 0.01)
            :
            (roundResults[diff.indexOf(Math.min(...diff))] += 0.01);

    }

    return roundResults;
}