//version 0.0.1

this.toDecimals = function (number, decimals) {
    if (number)
        return Number((Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals));
    return 0;
}

this.controlPercent = function (results, decimals) {
    var total = 0;
    var roundResults = [];

    //pro kontrolované hodnoty
    results.forEach(function (result) {
        //zaokrouhlená hodnota
        roundResults.push(this.toDecimals(result, decimals));
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

//values must be array of values
//decimals >= 2
this.percent = function (values) {
    var total = 0;
    var results = [];
    var decimals = 2;

    if (!angular.isArray(values) || values.length == 0) {
        console.error("Type Error: argument in function 'percent' must be array of minimum length = 1!");
        return null;
    }

    //kontrola hodnot v poli
    for (var index = 0; index < values.length; index++) {
        if (angular.isUndefined(values[index]) || values[index] == null) {
            values[index] = 0;
        } else if ((!angular.isNumber(values[index])) || (values[index] < 0)) {
            console.error("Type Error: " + values[index] + "(type: " + typeof (values[index]) + ")" + " is not number or smaller then 0!");
            total = 0;
            break;
        } else {
            total += values[index];
        }
    }

    //suma je 0, nebo je některá z hodnot záporná
    //vrací pole plné nul o velikosti vloženého pole
    if (!total) {
        return Array.apply(null, Array(values.length)).map(Number.prototype.valueOf, 0);
    }

    //získání hodnot pro jednotlivé položky
    values.forEach(function (value) {
        results.push(value / total);
    });

    //výsledky poslány na kontrolu
    results = this.controlPercent(results, decimals);

    return results;
}