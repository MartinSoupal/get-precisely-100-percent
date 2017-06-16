<p align="center">
  <h1 align="center">Get-precisely-100-percent</h1>
  <p align="center">Control if total of percentage will get precisely 100%.</p>
</p>

Status: Alfa
Version: 0.0.1

Script pro zajištění, aby po výpočtu a zaokrouhlení výsledků na dvě desetinná místa byla jejich suma === 1.<br>
Použití:
- pro výpočet jednotlivých podílů z celku(procenta);

## Documentation

volá se argumentem, který je pole jednotlivých prvků
vrací pole s výsledky
```js
    var array = [1, 2, 3];
    var results = this.percent(array);
```

pole zkontroluje vstupní hodnoty a vypočítá si sumu
```js
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
```

vypočítá podíl jednotlivých prvků
```js
    values.forEach(function (value) {
        results.push(value / total);
    });
```

zavolá se kontrola vypočítaných podílů
```js
    results = this.controlPercent(results, decimals);
```
```js
    return results;
```

zaokrouhlí jednotlivé podíly
```js
    var total = 0;
    var roundResults = [];

    results.forEach(function (result) {
        roundResults.push(this.toDecimals(result, decimals));
    }, this);
```

suma zaokrouhlených podílů
```js
    total = roundResults.reduce((a, b) => { return a + b; }, 0);
```

může nastat, že suma zaokrouhlených podílů nedá přesně 1 a proto se vyhledá nejvhodnější kandidát, u kterého se buď přičte, nebo odečte potřebné číslo.
```js
    if (total != 1) {
        var diff = [];
```
zjistíme si rozdíly mezi zaokrouhleními hodnotami a reálnými hodnotami
- pokud rozdíl bude přesně 0.005, tz. že jsme našli už nejvhodnějšího kandidáta a netřeba dále hledat.  
```js
        results.forEach(function (result, index) {
            if (Math.abs(roundResults[index] - result) == 0.005) {
                (total > 1) ? (roundResults[index] -= 0.01) : (roundResults[index] += 0.01);
                return roundResults;
            } else {
                diff.push(roundResults[index] - result);
            };
        }, this);
```

podle toho jestli byla suma větší, nebo menší než 1 najde vhodného kandidáta a přičte, nebo odečte 0.01
vrátí pole s upravenými hodnotami
```js
        (total > 1) ?
            (roundResults[diff.indexOf(Math.max(...diff))] -= 0.01)
            :
            (roundResults[diff.indexOf(Math.min(...diff))] += 0.01);
    }
    return roundResults;
} 
```

### Jak se najde nejvhodnější kandidát?
TO-DO

- pomocná funkce pro zaokrouhlování
```js
this.toDecimals = function (number, decimals) {
    if (number)
        return Number((Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals));
    return 0;
}
```