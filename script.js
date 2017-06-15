vm.toDecimals = function (number, decimals) {
    if (number)
        return Number((Math.round(number * Math.pow(10, decimals)) / 100).toFixed(decimals));
    return 0;
}

vm.percent = function (values, numerators) {
    var total = 0;
    var results = [];

    //celkový počet (jmenovatel)
    Object.keys(values).map(function (key, index) {
        total += values[key];
    });

    //výsledky pro jednotlivé čitatele
    numerators.forEach(function (numerator, index) {
        results.push(numerator / total);
    }, this);

    results = vm.controlPercent(results);

    return results;
}

vm.controlPercent = function (values) {
    var total = 0;
    var roundValues = [];

    //pro kontrolované hodnoty
    values.forEach(function (value, index) {
        //zaokrouhlená hodnota
        roundValues.push(vm.toDecimals(value, 2));
        //celkový počet (jmenovatel)
        total += roundValues[index];
    }, this);

    //total == 100% (1)
    if (total == 100) {
        return null;
    //total != 100% (1)
    } else {
        var diff = [];

        //pro každou hodnotu získání rozdílu mezi počátečním a zaokrouhleným číslem
        values.forEach(function (value, index) {
            //rozdíl '0.005' je největší a nejideálnější, který může být a dále hledat netřeba
            if (Math.abs(roundValues[index] - value) == 0.005) {
                (total > 100) ? (roundValues[index] -= 0.01) : (roundValues[index] += 0.01);
                return roundValues;
            } else {
                //ukládání rozdílů
                diff.push(roundValues[index] - value);
            };
        }, this);

        (total > 100) ?
            /** Najdeme ten největší rozdíl, jelikož v nejkrajnějším případě je původní číslo _._051 a zaokrouhlené je _._1 => rozdíl 0.0049.
             *  Pak tedy odečtením 0.01 je rozdíl od původního čísla maximálně 0.0051.
             * 
             *  Kdybychom hledali nejmenší, v nejkrajnějším případě dostaneme _._49 a zaokrouhlené je _._0 => rozdíl -0.0049.
             *  Pak tedy odečtením 0.01 je rozdíl od původního čísla maximálně -0.0149 => což je daleko větší než 0.0051 výše zmiňované.
             * 
             *  Dojde tedy k nejmenšímu zkreslení reálného výsledku!
             */
            (roundValues[diff.indexOf(Math.max(...diff))] -= 0.01)
            :
            (roundValues[diff.indexOf(Math.min(...diff))] += 0.01);

        return roundValues;
    }
}