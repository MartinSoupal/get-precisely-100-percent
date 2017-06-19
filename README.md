<p align="center">
  <h1 align="center">Get-precisely-100-percent</h1>
  <p align="center">Control if total of percentage will get precisely 100%.</p>
</p>

Status: <strong>Alfa</strong><br>
Version: <strong>0.0.1</strong>

Script pro zajištění, aby po výpočtu a zaokrouhlení výsledků na dvě desetinná místa byla jejich suma === 1.<br>
Použití:
- pro výpočet jednotlivých podílů z celku(procenta)

# Princip

Budeme mít čísla **20.5**, **20.5** a **59**. A chceme vypočítat jejich podíl z celkového součtu.
Pro jednotlivé čísla tedy dostaneme:

| původní číslo | zlomek podílu | des. číslo podílu | zaokrouhlený podíl |
| --- | ---| --- | ---- |
| **20.4** | 20.4/100 | 0.204 | 0.20 |
| **20.4** | 20.4/100 | 0.204 | 0.20 |
| **59.2** | 59.2/100 | 0.592 | 0.59 |
| | | **SUMA** | **0.99** |

**Tady již vidíme problém, že součet zaokrouhlených hodnot není 1.00**<br>
Tento problém řeší právě naše funkce `controlPercent`.<br>
která si vypočítá odchylky mezi zaokrouhlenými a původními hodnotami:

| původní číslo | zaokrouhlené číslo | odchylka |
| --- | --- | --- |
| 0.204 | 0.20 | -0.004 |
| 0.204 | 0.20 | -0.004 |
| 0.592 | 0.59 | -0.002 |

Ví, že byla suma menší než 1.00, takže bude hledat nejmenší odchylku.<br>
- Nejmenší, protože budeme přičítat a potřebuje číslo, u kterého dojde k co nejmenšímu zkreslení původního výsledku!

| původní číslo | zaokrouhlené číslo | odchylka | upravená hodnota | odchylka od původní |
| --- | --- | --- | --- | --- |
| 0.204 | 0.20 | -0.004 | 0.21 | 0.006 |
| 0.204 | 0.20 | -0.004 | 0.21 | 0.006 |
| 0.592 | 0.59 | -0.002 | 0.60 | 0.008 |

K nejmenšímu zkreslení tedy dochází u čísel 0.20 a k jedné z nich se tedy přičte požadovaná hodnota.<br>
Budeme mít tedy čísla: **0.21**, **0.2** a **0.59**, která již vs oučtu dávají **1.00**

# Documentation

Hlavní funkce se volá s argumentem, který je pole jednotlivých prvků
```js
    var array = [1, 2, 3];
    var results = this.percent(array);
    // results = [0.17, 0.33, 0.5];
```

provede kontrolu vstupních dat a vypočítá si sumu(total)<br>
**return**: pole s finálními podíly
```js
this.percent = function (values) {
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

podíly se pošlou do pomocné funkce, která provádí kontrolu a případnou úpravu výsledků 
```js
    results = this.controlPercent(results, decimals);

    return results;
}
```

zaokrouhlí jednotlivé podíly
**return**: zaokrouhlené a upravené podíly
```js
this.controlPercent = function (results, decimals) {
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
```
zjistíme si odchylky mezi zaokrouhleními hodnotami a reálnými hodnotami
- pokud odchylka bude přesně 0.005, tz. že jsme našli už nejvhodnějšího kandidáta a netřeba dále hledat.  
```js
        var diff = [];
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
```js
        (total > 1) ?
            (roundResults[diff.indexOf(Math.max(...diff))] -= 0.01)
            :
            (roundResults[diff.indexOf(Math.min(...diff))] += 0.01);
    }
    return roundResults;
} 
```

Pomocná funkce pro zaokrouhlování
```js
this.toDecimals = function (number, decimals) {
    if (number)
        return Number((Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals));
    return 0;
}
```