exports.run_ch1 = function() {
    
    let respStr = "";
    let obj = new Array(1,2,3,4,5,6);
    
    respStr += obj.toString() + '\n'; 
    
    obj.push('A', 'B', 'C');
    respStr += obj.toString() + '\n';

    obj.pop();
    respStr += obj.toString() + '\n';

    obj.unshift('X', 'Y', 'Z');
    respStr += obj.toString() + '\n';

    obj.shift();
    respStr += obj.toString() + '\n';

    for (key in obj) {
        respStr += key.toString() + ',';
    }
    respStr += '\n';

    for (value of obj) {
        respStr += value.toString() + ',';
    }
    respStr += '\n';

    obj.slice(0);
    respStr += obj.toString() + '\t' + "slice(0)\n";

    respStr += JSON.stringify({array: obj.toString()}) + '\t' + "JSON.stringify(..)\n";

    respStr += range(1, 10).toString() + '\t' + "range(1, 10)\n";
    respStr += sum(range(1,10)).toString() + '\t' + "sum(range(1, 10))\n";
    
    respStr += range(1, 10, 2).toString() + '\t' + "range(1, 10, 2)\n";
    respStr += range(10, 1, -2).toString() + '\t' + "range(10, 1, -2)\n";
    respStr += range(1, 1).toString() + '\t' + "range(1, 1)\n";
    respStr += range(1, 1, -1).toString() + '\t' + "range(1, 1, -1)\n";
    respStr += range(1, 2, -1).toString() + '\t' + "range(1, 2, -1)\n";
    respStr += reverseArray(range(1,10)).toString() + '\t' + "reverseArray(range(1, 10))\n";
    
    array = range(1,10);
    reverseArrayInPlace(array);
    respStr += array.toString() + '\t' + "reverseArrayInPlace(range(1, 10))\n";

    respStr += reverseArrayInPlace(range(1,3)).toString() + '\t' + "reverseArrayInPlace(range(1, 3))\n";
    respStr += reverseArrayInPlace(range(1,2)).toString() + '\t' + "reverseArrayInPlace(range(1, 2))\n";
    respStr += reverseArrayInPlace(range(1,1)).toString() + '\t' + "reverseArrayInPlace(range(1, 1))\n";

    respStr += JSON.stringify(arrayToList(range(1,3))) + "\t" + "arrayToList(..)\n"
    respStr += listToArray(arrayToList(range(1,3))) + "\t" + "listToArray(..)\n"

    respStr += deepEqual([1,2,3], [1,2,3]) + "\t" + "deepEqual([1,2,3],[1,2,3])\n"
    respStr += deepEqual([1,2,3], [1,3,2]) + "\t" + "deepEqual([1,2,3],[1,3,2])\n"
    respStr += deepEqual(null, 0) + "\t" + "deepEqual(null,0)\n"
    respStr += deepEqual(null, null) + "\t" + "deepEqual(null,null)\n"
    respStr += deepEqual(false, 0) + "\t" + "deepEqual(false, 0)\n"
    respStr += deepEqual(false, false) + "\t" + "deepEqual(false, false)\n"
    respStr += deepEqual({a:1, b:2}, {a:1, b:2}) + "\t" + "deepEqual({a:1, b:2}, {a:1, b:2})\n"
    respStr += deepEqual({a:1, b:2}, {a:1, b:3}) + "\t" + "deepEqual({a:1, b:2}, {a:1, b:3})\n"
    respStr += deepEqual({a:1, b:2}, {a:1, c:2}) + "\t" + "deepEqual({a:1, b:2}, {a:1, c:2})\n"
    respStr += deepEqual({a:1, b:2}, {a:1, b:2, c:3}) + "\t" + "deepEqual({a:1, b:2}, {a:1, b:2, c:3})\n"

    respStr += JSON.stringify([{v:1},{v:2},{v:3}].reduce((a,b) => {return {v:(a.v + b.v)}})) + "\t" + "[1,2,3].reduce(..))\n"
    respStr += JSON.stringify([{v:1},{v:2},{v:3}].reduce((a,b) => (a + b.v), 0)) + "\t" + "[1,2,3].reduce(..))\n"
    respStr += JSON.stringify([{v:1}].reduce((a,b) => (a + b.v), 0)) + "\t" + "[1,2,3].reduce(..))\n";

    respStr += "[+] 5.1\n";
    respStr += convolArray(range(1,10), range(5,15)) + "\t" + "convolArray([1..10], [5..15])\n";
    
    respStr += "[+] 5.2\n";
    {
        let str = "a";
        loop(1,
             (n) => n < 5,
             (_) => str += String.fromCharCode(str.charCodeAt(str.length - 1) + 1),
             (n) => n + 1); 
        respStr += str + "\t" + "loop(a..e)\n";
    }

    respStr += "[+] 5.3\n";
    respStr += everyA(range(1,10,1), (n) => (n % 2 == 0)) + "\t" + "everyA(..) -> false\n";
    respStr += everyA(range(2,10,2), (n) => (n % 2 == 0)) + "\t" + "everyA(..) -> true\n";
    respStr += everyB(range(1,10,1), (n) => (n % 2 == 0)) + "\t" + "everyB(..) -> false\n";
    respStr += everyB(range(2,10,2), (n) => (n % 2 == 0)) + "\t" + "everyB(..) -> true\n";

    {
        let start = 0, total = 0;

        start = Date.now() + "\n";
        total = 0;
        for (let a of range(1,1000000).map(n => {return {"v": n};})) {
            if ((a.v % 2) == 0) {
                total += a.v;
            }
        }
        respStr += total + "\t" + (Date.now() - start) + "ms\n";

        start = Date.now() + "\n";
        total = 0;
        for (let n = 1; n <= 1000000; n++) {
            if (n%2 == 0) {
                total += n;
            }
        }
        respStr += total + "\t" + (Date.now() - start) + "ms\n";

        start = Date.now() + "\n";
        respStr += range(1,1000000)
                   .map(n => {return {"v": n};})
                   .filter(a => ((a.v % 2) == 0))
                   .reduce((acc, a) => (acc + a.v), 0)
                   + "\t" + (Date.now() - start) + "ms\n";

        
    }

    respStr += "Object properties: \n";
    for(var property of Object.getOwnPropertyNames(obj)) {

        respStr += " - " + property.toString() + "\n";
    } 

    return respStr;
}

// -----------------------------------------------------
// 5.3 Every

let everyA = (array, condition) => {
    for (n of array) {
        if (!condition(n)) {
            return false;
        }
    }
    return true;
}

let everyB = (array, condition) => {
    return !(array.some((n) => (!condition(n))));
}

// -----------------------------------------------------
// 5.2 Loop
let loop = (n, condition, body, next) => {
    while(condition(n)) {
        body(n);
        n = next(n);
    }
}


// -----------------------------------------------------
// 5.1 Convolution of an array

let convolArray = (...arrays) => {
    return arrays.reduce((acc, a) => acc.concat(a), [])
                 .reduce((acc, n) => {
        return acc.includes(n) ? acc : acc.concat([n]);
    }, []);
}

// -----------------------------------------------------
// Deep equal
let deepEqual = (a, b) => {

    if ((a == null) ||
        (b == null) ||
        (typeof(a) != "object") ||
        (typeof(b) != "object")) {
          
        return (a === b);
    }
    
    if (Object.keys(a).length == Object.keys(b).length) {

        for (key of Object.keys(a)) {
            if (a[key] !== b[key]) {
                return false;
            }
        }

        return true;
    }
    
    return false;
}

// -----------------------------------------------------
// List

let arrayToList = (array) => {
    let list = null;
    for (entry of array.reverse()) {
        list = {value: entry, rest: list};
    }   
    return list;
}

let listToArray = (list) => {
    let array = [];
    while ((list != null) && (list != undefined)) {
        array.push(list.value);
        list = list.rest;
    }
    return array;
}

// -----------------------------------------------------

exports.range = function(start, end, step = 1) {

    let retval = [];

    if ((step == 0) || (((end - start) * step) < 0)) {
        return NaN;
    }
    
    for (let n = start; (end - n) * step >= 0; n += step) {
        retval.push(n);
    }

    return retval;
}

let sum = function ([...numbers]) {
    let retval = 0;
    for (let n of numbers) {
        retval += n;
    }
    return retval;
}

let reverseArray = ([...elements]) => {
    let retval = [];
    for (let ix = elements.length; ix > 0; ix--) {
        retval.push(elements[ix - 1]);
    }
    return retval;
}

let reverseArrayInPlace = (elements) => {

    for (let n = Math.floor(elements.length / 2); n > 0; n--) {
        let tmp = elements[n - 1];
        elements[n - 1] = elements[elements.length - n];
        elements[elements.length - n] = tmp;
    }
    
    return elements;
}