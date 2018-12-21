'use strict'

// example of keyboard definitions: 

let keyboardDefinition = [{
    tone: new Tone(`9/8`),
    shape: {
        type: `rectangle`, // mozne hodnoty: `rectangle`, `ellipse`, `diamond`
        sizeX: 50,
        sizeY: 100,
        roundingX: 4, // toto je irelevantne pre `ellipse`
        roundingY: 6, // toto je irelevantne pre `ellipse`
        rotation: 30,
        offsetX: 0,
        offsetY: 10,
        shapeCollor: `#92a8d1`,
        borderCollor: `#ffffff`,
        borderThickness: 2,
    },
}, {
    tone: new Tone(`5/4`),
    shape: {
        type: `ellipse`, // mozne hodnoty: `rectangle`, `ellipse`, `diamond`
        sizeX: 40,
        sizeY: 80,
        roundingX: null, // toto je irelevantne pre `ellipse`
        roundingY: null, // toto je irelevantne pre `ellipse`
        rotation: 20,
        offsetX: 0,
        offsetY: 0,
        shapeCollor: `#aaaaaa`,
        borderCollor: `#bbbbbb`,
        borderThickness: 2,
    }
},
{
    tone: new Tone(`3/2`),
    shape: {
        type: `rectangle`, // mozne hodnoty: `rectangle`, `ellipse`, `diamond`
        sizeX: 30,
        sizeY: 120,
        roundingX: 5, // toto je irelevantne pre `ellipse`
        roundingY: 10, // toto je irelevantne pre `ellipse`
        rotation: 30,
        offsetX: 5,
        offsetY: 5,
        shapeCollor: `#aaaaaa`,
        borderCollor: `#bbbbbb`,
        borderThickness: 2,
    }
},
];






let ji = {

    _dimension: 8,
    _primes: [2, 3, 5, 7, 11, 13, 17, 19],
    _limit: 19,
    _referencePitch: 440, // 440 * 3 / 5,  //334.125,
    _referenceLetter: 'A', // 'C',  // 'D', 

    setLimit(value) {
        if (!Number.isInteger(value) || value < 0 || !this.isPrime(value)) {
            throw new Error(`Limit must be a positive integer and prime.`);
        }
        this._limit = value;
        this._primes = [];
        for (let p = 2; p <= this._limit; p++) {
            if (this.isPrime(p)) {
                this._primes.push(p);
            }
        }
        this._dimension = this._primes.length;
    },

    getLimit() {
        return this._limit;
    },

    setDimension(value) {
        if (!Number.isInteger(value) || value < 0) {
            throw new Error(`Dimension must be a positive integer.`);
        }
        this._dimension = value;
        this._primes = [];
        let p = 2;
        while (this._primes.length < this._dimension) {
            if (this.isPrime(p)) {
                this._primes.push(p);
            }
            p++;
        }
        this._limit = this._primes[this._dimension - 1];
    },

    getDimension() {
        return this._dimension;
    },

    primes() {
        return this._primes;
    },

    setReferencePitch(value) {
        if (Number.isNaN(value) || value < 0) {
            throw new Error(`The value of reference pitch must be a positive number.`)
        }
        this._referencePitch = value;
    },

    getReferencePitch() {
        return this._referencePitch;
    },

    setReferenceLetter(value) {
        if (/[^CDEFGAB]/.test(value)) {
            throw new Error(`Reference pitch must one of the letters: C, D, E, F, G, A, B.`)
        }
        this._referenceLetter = value;
    },

    getReferenceLetter() {
        return this._referenceLetter;
    },

    isPrime: function (value) {
        if (!Number.isInteger(value) || value < 0) {
            throw new Error(`Value must be a positive integer.`);
        }
        if (value === 1) {
            return false;
        }
        let result = true;
        for (let i = 2; i <= Math.sqrt(value); i++) {
            if (value % i === 0) {
                result = false;
                break;
            }
        }
        return result;
    },

    gcd: function (...args) {
        if (args.length > 2) {
            return this.gcd(args.pop(), this.gcd(...args));
        }
        if (args[1]) {
            return this.gcd(args[1], args[0] % args[1]);
        } else {
            return Math.abs(args[0]);
        }
    },

    lcm: function (...args) {
        if (args.length > 2) {
            return this.lcm(args.pop(), this.lcm(...args));
        }
        if (args.length = 2) {
            return args[0] * args[1] / this.gcd(args[0], args[1]);
        }
        if (args.length = 1) {
            return Math.abs(args[0]);
        }
    },

    _findEndOfBrackets: function (inputString, startPosition) {
        // This function finds ending position +1 of a segment starting at the 'startPosition' of the 'inputString'. 
        // A segment is an integer or a substring enclosed in matching braces/bracket/parenthesis. 
        startPosition = startPosition || 0;
        let substring = inputString.slice(startPosition);

        // test whether the string starts  with a brace/bracket/parenthesis/number
        if (/^[^\{\[\(0-9]/.test(substring)) {
            x = substring[0];
            throw new Error(`Incorrect syntax: '${x}' must not be at the beginning of a segment.`);
        };

        // if the harmony starts with a digit, return position of first non-digit or length
        if (/^[0-9]/.test(substring)) {
            if (/[^0-9]/.test(substring)) {
                return startPosition + substring.search(/[^0-9]/);
            } else {
                return inputString.length;
            };
        };

        // otherwise, parse braces/brackets/parentheses:
        let thread = [];
        let isClosing = false;
        let closingMatch = '';

        for (let i = 0; i < substring.length; i++) {
            switch (substring[i]) {
                case '{':
                case '[':
                case '(':
                    thread.push(substring[i]);
                    break;

                case '}':
                    isClosing = true;
                    closingMatch = '{';
                    break;
                case ']':
                    isClosing = true;
                    closingMatch = '[';
                    break;
                case ')':
                    isClosing = true;
                    closingMatch = '(';
                    break;
            };

            if (isClosing) {
                if (thread[thread.length - 1] === closingMatch) {
                    thread.pop();
                    if (thread.length === 0) {
                        return startPosition + i + 1;
                    }
                } else {
                    throw new Error(`A non-mathing '${closingMatch}'.`)
                };
                isClosing = false;
                closingMatch = '';
            };
        };

        // if the end of segment was not returned until now, throw an error:
        throw new Error('Incorrect syntax.');
    },


    _findEndOfSegment(inputString, startPosition, includedOperators, dividingOperators) {

        let cursorPosition = this._findEndOfBrackets(inputString, startPosition);
        let continueCursor = cursorPosition < inputString.length;
        while (continueCursor) {
            let testedOperator = inputString[cursorPosition];
            if (includedOperators.includes(testedOperator)) {
                cursorPosition = this._findEndOfBrackets(inputString, cursorPosition + 1);
                continueCursor = cursorPosition < inputString.length;
            } else {
                if (dividingOperators.includes(testedOperator)) {
                    continueCursor = false;
                } else {
                    throw new Error(`The syntax of the input string '${inputString}' is incorrect.`)
                }
            }
        }

        return cursorPosition;
    },


}


class Fraction extends Array {

    constructor(value) {
        super();
        if (typeof value == 'number') {
            value = value.toString()
        }
        if (typeof value == 'string') {
            this.setByFormula(value);
        } else {
            if (value instanceof Array) {
                this.setByArray(value)
            } else {
                throw new Error(`Format of the fraction constructor ${value} is incorrect.`)
            }
        }
    }

    setByArray(inputFracArr) {
        let test = inputFracArr instanceof Array &&
            inputFracArr.length === 2 &&
            Number.isInteger(inputFracArr[0]) &&
            Number.isInteger(inputFracArr[1]);
        if (!test) {
            throw new Error(`Format of the fraction ${inputFracArr} is incorrect.`)
        }

        let a = inputFracArr[0];
        let b = inputFracArr[1];
        if (b == 0) {
            throw new Error(`The denominator of a fraction must be non zero: ${a} / ${b}.`)
        }
        if (b < 0) {
            a = -a;
            b = -b;
        }

        // simplify the fraction array and assign values:        
        let divisor = ji.gcd(a, b);
        this[0] = a == 0 ? 0 : a / divisor;
        this[1] = a == 0 ? 1 : b / divisor;
    }

    setByFormula(inputFracForm) {
        // Just basic syntax is considered, without nested operations.  This is allowed: '2', '1/12', '(-1/12)'
        inputFracForm = inputFracForm.replace(/\s/g, '');

        let resultArray = [];
        if (inputFracForm[0] === `(` && inputFracForm[inputFracForm.length - 1] === `)`) {
            inputFracForm = inputFracForm.slice(1, -1);
        }

        resultArray = inputFracForm.split(`/`, 2);
        resultArray[0] = parseInt(resultArray[0]);
        resultArray[1] = resultArray.length < 2 ? 1 : parseInt(resultArray[1]);

        this.setByArray(resultArray);
    }

    getFormula(type) {
        type = type || 'simple';
        let [a, b] = [this[0], this[1]]
        switch (type) {
            case 'simple':
                return b == 1 ? a.toString(10) : a + '/' + b;
            case 'fraction':
                return a + '/' + b;
            default:
                throw new Error(`Unrecognized type of formula (${type}). Valid formula types: 'simple' (default) or 'fraction'.`)
        }
    }



    multiply(value) {
        value = new Fraction(value);
        let resultArray = [
            this[0] * value[0],
            this[1] * value[1]
        ];
        return new Fraction(resultArray);
    }

    divide(value) {
        value = new Fraction(value);
        let resultArray = [
            this[0] * value[1],
            this[1] * value[0]
        ];
        return new Fraction(resultArray);
    }

    add(value) {
        value = new Fraction(value);
        let resultArray = [
            this[0] * value[1] + this[1] * value[0],
            this[1] * value[1]
        ];
        return new Fraction(resultArray);
    }

    subtract(value) {
        value = new Fraction(value);
        let resultArray = [
            this[0] * value[1] - this[1] * value[0],
            this[1] * value[1]
        ];
        return new Fraction(resultArray);
    }

    invert() {
        let resultArray = [
            this[1],
            this[0]
        ];
        return new Fraction(resultArray);
    }

    toNumber() {
        return this[0] / this[1]
    }


}



class Tone extends Array {

    constructor(value) {
        super();
        if (typeof value === 'string') {
            if (/[A-Ga-g]/.test(value)) {
                this.setByFormula(value, 'letter');
            } else {
                this.setByFormula(value);
            }
        }
        if (value instanceof Array) {
            this.setByArray(value);
        }
    }

    setByArray(value) {
        for (let i = 0; i < value.length; i++) {
            let fraction = new Fraction(value[i]);
            this[i] = fraction;
        }

        // if needed, extend JI.dimension
        if (this.length > ji.getDimension()) {
            ji.setDimension(this.length);
        }
    }

    setByFormula(inputFormula) {
        // include letters:  if (type == 'letter')

        let rawInputFormula = inputFormula;
        inputFormula = inputFormula.replace(/\s/g, '');
        if (/[^0-9\(\)\-\*\/\^]/.test(inputFormula)) {
            throw new Error('Incorrect format of Tone formula. Allowed characters: 0123456789-*/^().');
        };

        let cursorStart = 0;
        let cursorEnd;
        let operator;
        let resultTone;

        // phase 1: the input formula split at: '*' and '/'
        cursorEnd = ji._findEndOfSegment(inputFormula, 0, `^`, `*/`);
        if (cursorEnd < inputFormula.length) {
            resultTone = new Tone(inputFormula.slice(cursorStart, cursorEnd));
            operator;
            while (cursorEnd < inputFormula.length) {
                operator = inputFormula[cursorEnd];
                cursorStart = cursorEnd + 1;
                cursorEnd = ji._findEndOfSegment(inputFormula, cursorStart, `^`, `*/`);
                let nextTone = new Tone(inputFormula.slice(cursorStart, cursorEnd));
                switch (operator) {
                    case `*`:
                        resultTone = resultTone.multiply(nextTone);
                        break;
                    case `/`:
                        resultTone = resultTone.divide(nextTone);
                        break;
                    default:
                        throw new Error(`Error in parsing tone ${rawInputFormula}.`);
                }
            }
        } else {


            // phase 2: the input formula split at: '^'
            cursorEnd = ji._findEndOfSegment(inputFormula, 0, ``, `^`);
            if (cursorEnd < inputFormula.length) {
                let baseTone = new Tone(inputFormula.slice(cursorStart, cursorEnd));
                let toneExponent = new Fraction(inputFormula.slice(cursorEnd + 1));
                resultTone = baseTone.power(toneExponent);
            } else {

                // phase 3a: a single segment - surrounding '()' removed
                cursorEnd = ji._findEndOfBrackets(inputFormula, 0);
                if (cursorEnd = inputFormula.length) {
                    if (/[^0-9]/.test(inputFormula)) {
                        resultTone = new Tone(inputFormula.slice(1, -1));
                    } else {

                        // phase 3b: a single segment - which is a single number          
                        let parsedInteger = parseInt(inputFormula);
                        if (parsedInteger <= 0) {
                            throw new Error(`The must not be negative or zero (${parseInt}).`)
                        }
                        let resultToneArray = [];
                        if (parsedInteger > 1) {
                            let remainder = parsedInteger;
                            let prime = 2;
                            let primeIndex = 0;
                            resultToneArray.push([0, 1]);
                            while (remainder > 1) {
                                if (remainder % prime === 0) {
                                    resultToneArray[primeIndex][0]++;
                                    remainder = remainder / prime;
                                } else {
                                    let p = prime + 1;
                                    while (p <= remainder) {
                                        if (ji.isPrime(p)) {
                                            prime = p;
                                            primeIndex++;
                                            resultToneArray.push([0, 1]);
                                            break;
                                        } else {
                                            p++;
                                        }
                                    }
                                }
                            }
                            if (primeIndex > ji.getDimension()) {
                                ji.setDimension(primeIndex);
                            }
                        }
                        resultTone = new Tone(resultToneArray);
                    }
                }
            }
        }

        resultTone.forEach(
            (value, index) => this[index] = value
        );


    }

    getFormula(type) {
        /* These types of formulas are considered: 
            - 'simple'
            - 'fraction'
            - 'factors'
            - 'pitch'
            - 'cents'
            - 'letter' (todo)        
        */
        type = type || 'simple';
        switch (type) {
            case 'simple':
                return this.getFormula('fraction') || this.getFormula('factors');

            case 'fraction':
                if (this.isJI) {
                    let result = '';
                    let [a, b] = this.fraction();
                    if (b === 1) {
                        result = a.toString(10);
                    } else {
                        result = a + '/' + b
                    };
                    return result;
                }
                break;

            case 'factors':
                if (this.length == 1 && this[0][0] === 0) {
                    return '1';
                }

                let resultArray = [];
                for (let i = 0; i < this.length; i++) {
                    if (this[i][0] === 0) {
                        continue;
                    }
                    if (this[i][0] > 0 && this[i][1] === 1) {
                        resultArray.push(`${ji.primes()[i]}^${this[i][0]}`);
                    } else {
                        if (this[i][1] === 1) {
                            resultArray.push(`${ji.primes()[i]}^(${this[i][0]})`);
                        } else {
                            resultArray.push(`${ji.primes()[i]}^(${this[i][0]}/${this[i][1]})`)
                        };
                    }
                }
                return resultArray.join(' * ');

            case 'pitch':
                return this.pitch.toFixed(2) + ' Hz';

            case 'cents':
                return (1200 * this.height).toFixed(2) + 'c';

            case 'letter':
                // todo   

            default:
                throw new Error(`Unrecognized type of formula (${type}). Valid formula types: 'simple' (default), 'fraction', 'factors', 'pitch', 'cents', 'letter'.`)
        }
    }


    fraction() {
        if (this.isJI) {
            let a = 1;
            let b = 1;
            for (let i = 0; i < this.length; i++) {
                if (this[i][0] >= 0) {
                    a = a * Math.pow(ji.primes()[i], this[i][0]);
                } else {
                    b = b * Math.pow(ji.primes()[i], -this[i][0]);
                }
            }
            return new Fraction([a, b]);
        }
    }


    ratio() {
        let ratio = 1;
        this.forEach(
            (value, index) =>
            ratio *= Math.pow(ji.primes()[index], value[0] / value[1])
        )
        return ratio;
    }

    pitch() {
        return this.ratio * ji.getReferencePitch();
    }

    height() {
        return Math.log2(this.ratio);
    }

    width(primeWidths) {
        let width = 0;
        if (primeWidths instanceof Array) {
            this.forEach(
                (fraction, index) =>
                width += fraction.toNumber() * primeWidths[index]
            )
        }
        if (typeof primeWidths == 'function') {
            this.forEach(
                (fraction, index) =>
                width += fraction.toNumber() * primeWidths(index)
            )
        }
        return width;
    }

    power(value) {
        value = new Fraction(value);
        if (value[0] == 0) {
            return new Tone(`1`)
        }
        let resultArray = [];
        for (let i = 0; i < this.length; i++) {
            resultArray[i] = value.multiply(this[i]);
        }
        return new Tone(resultArray);
    }


    multiply(value) {
        value = new Tone(value);

        let shorterEnd = Math.min(this.length, value.length) - 1;
        let longerEnd = Math.max(this.length, value.length) - 1;
        let resultArrayEnd = longerEnd;
        let resultArray = [];

        let a = 1;
        let b = 1;
        let divisor = 1;
        for (let i = longerEnd; i >= 0; i--) {
            if (i > shorterEnd) {
                resultArray[i] = this[i] || value[i];
            } else {
                a = this[i][0] * value[i][1] + this[i][1] * value[i][0];
                if (i === resultArrayEnd && a === 0) {
                    resultArrayEnd--;
                } else {
                    b = this[i][1] * value[i][1];
                    divisor = ji.gcd(a, b);
                    resultArray[i] = [a === 0 ? 0 : a / divisor, b / divisor];
                }
            }
        }
        return new Tone(resultArray);

    }

    divide(value) {
        value = new Tone(value);
        return this.multiply(value.power(`-1`))
    }

    toOctave(octave) {
        octave = octave || 0;
        let correction = octave - Math.floor(this.height);
        let correctionTone = new Tone('2').power(correction);
        return this.multiply(correctionTone);
    }

    isJI() {
        let test = true;
        for (let i = 0; i < this.length; i++) {
            test = test && this[i][1] === 1;
        }
        return test;
    }

}




class Harmony extends Array {

    constructor(value) {
        super();
        if (typeof value === 'string') {
            if (/[A-Ga-g]/.test(value)) {
                this.setByFormula(value, 'letter');
            } else {
                this.setByFormula(value);
            }
        }
        if (value instanceof Array) {
            this.setByArray(value);
        }
    }

    setByArray(value) {
        for (let i = 0; i < value.length; i++) {
            let tone = new Tone(value[i]);
            this[i] = tone;
        }
    }

    setByFormula(inputFormula, type) {
        // include letters:  if (type == 'letter')

        let rawInputFormula = inputFormula;
        inputFormula = inputFormula.replace(/\s/g, '');
        if (/[^0-9\(\)\{\}\[\]\+\-\*\/\^\,]/.test(inputFormula)) {
            throw new Error('Incorrect format of Harmony formula. Allowed characters: 0123456789+-*/^(){}[].');
        }

        let cursorStart = 0;
        let cursorEnd;
        let resultHarmony;
        let operator;
        let nextHarmony;

        // phase 0: the input formula split at: '+' and '-'
        cursorEnd = ji._findEndOfSegment(inputFormula, 0, `^*/`, `+-`);
        if (cursorEnd < inputFormula.length) {
            resultHarmony = new Harmony(inputFormula.slice(cursorStart, cursorEnd));
            while (cursorEnd < inputFormula.length) {
                operator = inputFormula[cursorEnd];
                cursorStart = cursorEnd + 1;
                cursorEnd = ji._findEndOfSegment(inputFormula, cursorStart, `^*/`, `+-`);
                nextHarmony = new Harmony(inputFormula.slice(cursorStart, cursorEnd));
                switch (operator) {
                    case `+`:
                        resultHarmony = resultHarmony.add(nextHarmony);
                        break;
                    case `-`:
                        resultHarmony = resultHarmony.remove(nextHarmony);
                        break;
                    default:
                        throw new Error(`Error in parsing harmony ${rawInputFormula}.`);
                }
            }
        } else {


            // phase 1: the input formula split at: '*' and '/'
            cursorEnd = ji._findEndOfSegment(inputFormula, 0, `^`, `*/`);
            if (cursorEnd < inputFormula.length) {
                resultHarmony = new Harmony(inputFormula.slice(cursorStart, cursorEnd));
                while (cursorEnd < inputFormula.length) {
                    operator = inputFormula[cursorEnd];
                    cursorStart = cursorEnd + 1;
                    cursorEnd = ji._findEndOfSegment(inputFormula, cursorStart, `^`, `*/`);
                    nextHarmony = new Harmony(inputFormula.slice(cursorStart, cursorEnd));
                    switch (operator) {
                        case `*`:
                            resultHarmony = resultHarmony.multiply(nextHarmony);
                            break;
                        case `/`:
                            resultHarmony = resultHarmony.divide(nextHarmony);
                            break;
                        default:
                            throw new Error(`Error in parsing harmony ${inputFormula}.`);
                    }
                }
            } else {


                // phase 2: the input formula split at: '^'
                cursorEnd = ji._findEndOfSegment(inputFormula, 0, ``, `^`);
                if (cursorEnd < inputFormula.length) {
                    let baseHarmony = new Harmony(inputFormula.slice(cursorStart, cursorEnd));
                    let harmonyExponent = new Fraction(inputFormula.slice(cursorEnd + 1));
                    resultHarmony = baseHarmony.power(harmonyExponent[0]);
                } else {

                    // phase 3: a single segment....
                    cursorEnd = ji._findEndOfBrackets(inputFormula, 0);
                    if (cursorEnd == inputFormula.length) {

                        // ... which is not a tone (contains braces and/or brackets):
                        if (/[\[\]\{\}]/.test(inputFormula)) {
                            let beginEnd = inputFormula[0] + inputFormula[inputFormula.length - 1];
                            let interior = inputFormula.slice(1, -1);
                            let interiorHarmony;


                            // phase 3a: parse interior if it comprises comma-separated list of tones
                            if (!/[^0-9\(\)\-\*\/\^\,]/.test(interior)) {
                                cursorEnd = ji._findEndOfSegment(interior, 0, `^*/`, `,`);
                                let firstTone = new Tone(interior.slice(cursorStart, cursorEnd));
                                interiorHarmony = new Harmony([firstTone]);
                                while (cursorEnd < interior.length) {
                                    operator = interior[cursorEnd];
                                    if (operator != ',') {
                                        throw new Error(`Error in parsing harmony ${inputFormula}.`);
                                    }
                                    cursorStart = cursorEnd + 1;
                                    cursorEnd = ji._findEndOfSegment(interior, cursorStart, `^*/`, `,`);
                                    let nextTone = new Tone(interior.slice(cursorStart, cursorEnd));
                                    interiorHarmony = interiorHarmony.add([nextTone]);
                                }


                                // phase 3b: parse interior if it contains harmonies
                            } else {
                                interiorHarmony = new Harmony(interior);
                            }

                            // phase 3c: parse the begin-end brackets/braces
                            switch (beginEnd) {
                                case `[]`:
                                    resultHarmony = interiorHarmony.toOctave();
                                    break;
                                case `{}`:
                                    resultHarmony = interiorHarmony;
                                    break;
                                default:
                                    throw new Error(`Error in parsing harmony ${inputFormula}.`);
                            }



                            // ... which is a single tone:    
                        } else {
                            let singleton = new Tone(inputFormula);
                            resultHarmony = new Harmony([singleton]);
                        }
                    }
                }
            }
        }

        resultHarmony = resultHarmony.sortByHeight();

        resultHarmony.forEach(
            (value, index) => this[index] = value
        )

    }

    getFormula(type) {
        // Same types as in getFormula for Tones. 
        // let interior = this.map(
        //     (value) => value.getFormula(type)
        // )
        let interior = [];
        for (let i = 0; i < this.length; i++) {
            interior.push(this[i].getFormula(type));
        }
        return '{ ' + interior.join(', ') + ' }';
    }


    power(value) {
        value = new Fraction(value);
        if (value[1] !== 1) {
            throw new Error(`The exponent of harmony exponentiation must be integer: ${inputFormula}.`)
        }

        let exponent = value[0];
        if (exponent == 0) {
            return new Harmony(`{1}`);
        }

        if (exponent < 0) {
            exponent = -exponent;
            for (let i = 0; i < this.length; i++) {
                for (let j = 0; j < this[i].length; j++) {
                    this[i][j][0] = -this[i][j][0];
                }
            }
        }

        let resultHarmony = new Harmony(this);
        for (let i = 0; i < exponent - 1; i++) {
            resultHarmony = resultHarmony.multiply(this);
        }

        return resultHarmony;
    }


    multiply(value) {
        value = new Harmony(value);
        let resultHarmony = new Harmony();
        for (let i = 0; i < this.length; i++) {
            for (let j = 0; j < value.length; j++) {
                let toneI = this[i];
                let toneJ = value[j];
                let candidate = toneI.multiply(toneJ);
                let candidateTest = true;
                for (let k = 0; k < resultHarmony.length; k++) {
                    candidateTest = candidateTest && candidate.toString() !== resultHarmony[k].toString();
                }
                if (candidateTest) {
                    resultHarmony.push(candidate);
                }
            }
        }
        return resultHarmony;
    }

    divide(value) {
        value = new Harmony(value);
        return this.multiply(value.power(`-1`));
    }


    add(value) {
        value = new Harmony(value);
        let resultHarmony = new Harmony(this);
        for (let i = 0; i < value.length; i++) {
            let test = true;
            for (let j = 0; j < this.length; j++) {
                test = test && value[i].toString() !== this[j].toString();
            }
            if (test) {
                resultHarmony.push(value[i]);
            }
        }
        return resultHarmony;
    }

    remove(value) {
        value = new Harmony(value);
        let resultHarmony = new Harmony();
        for (let i = 0; i < this.length; i++) {
            let test = true;
            for (let j = 0; j < value.length; j++) {
                test = test && value[j].toString() !== this[i].toString();
            }
            if (test) {
                resultHarmony.push(this[i]);
            }
        }
        return resultHarmony;
    }


    toOctave(octave) {
        let result = new Harmony();
        for (let i = 0; i < this.length; i++) {
            let candidate = this[i].toOctave(octave);
            let test = true;
            for (let j = 0; j < result.length; j++) {
                test = test && candidate.toString() != result[j].toString();
            }
            if (test) {
                result.push(candidate);
            }
        }
        return result;
    }

    toCanonic() {
        if (this.isJI()) {
            let denominators = [];
            this.forEach(
                (value) => {
                    denominators.push(value.fraction()[1])
                }
            )
            let commonMultiplier = ji.lcm(...denominators);
            return this.multiply(commonMultiplier.toString());
        }
    }

    sortByHeight() {
        return this.sort((x, y) => x.height - y.height);
    }

    isJI() {
        let test = true;
        this.forEach((value) => test && value.isJI);
        return test;
    }

};



class jiBasis extends Harmony {
    constructor(value) {
        super(value);
        let reduction = jiBasis._reduce(value);
        if (reduction.isBasis) {
            this._reduced = reduction.reduced;
            this._inverted = reduction.inverted;
            this._primeIndices = reduction.primeIndices;
        } else {
            throw new Error(`The constructor harmony is not a basis (${value}).`)
        }
        Object.freeze(this);
    }

    static _reduce(harmony) {
        let reduced = new Harmony(harmony);

        // initiate invertedBasis: generate diagonal unit matrix 
        let inverted = new Harmony();
        for (let i = 0; i < reduced.length; i++) {
            inverted[i] = new Tone();
            for (let j = 0; j < i; j++) {
                inverted[i].push(new Fraction([0, 1]));
            }
            inverted[i].push(new Fraction([1, 1]));
        }

        // initiate primeIndices
        let primeIndices = [];

        // calculate max length of tone/vectors included in Reduction
        let maxLength = 1;
        reduced.forEach(
            (value) => maxLength = (value.length > maxLength) ? value.length : maxLength
        )

        // reduce reducedBasis, and in parallel calculate invertedBasis and primeIndices
        let mainRowIndex = 0;
        let mainColumnIndex = 0;
        let subRowIndex = 0;
        let subColumnIndex = 0;

        for (mainRowIndex = 0; mainRowIndex < reduced.length; mainRowIndex++) {
            let searchReduction = true;

            for (subColumnIndex = mainColumnIndex; searchReduction && subColumnIndex < maxLength; subColumnIndex++) {
                for (subRowIndex = mainRowIndex; searchReduction && subRowIndex < reduced.length; subRowIndex++) {
                    if (reduced[subRowIndex][subColumnIndex] && reduced[subRowIndex][subColumnIndex][0] !== 0) {
                        // swap rows
                        reduced[mainRowIndex] = reduced.splice(subRowIndex, 1, reduced[mainRowIndex])[0];
                        inverted[mainRowIndex] = inverted.splice(subRowIndex, 1, reduced[mainRowIndex])[0];

                        // reduce main row
                        inverted[mainRowIndex] = inverted[mainRowIndex]
                            .power(
                                reduced[mainRowIndex][subColumnIndex].invert());
                        reduced[mainRowIndex] = reduced[mainRowIndex]
                            .power(
                                reduced[mainRowIndex][subColumnIndex].invert());

                        // reduce other rows
                        for (let i = 0; i < reduced.length; i++) {
                            if (i !== mainRowIndex && reduced[i][subColumnIndex] && reduced[i][subColumnIndex][0] !== 0) {
                                inverted[i] = inverted[i]
                                    .multiply(
                                        inverted[mainRowIndex]
                                        .power(reduced[i][subColumnIndex].multiply(-1))
                                    )
                                reduced[i] = reduced[i]
                                    .multiply(
                                        reduced[mainRowIndex]
                                        .power(reduced[i][subColumnIndex].multiply(-1))
                                    )
                            }
                        }

                        mainColumnIndex = subColumnIndex;
                        primeIndices.push(mainColumnIndex);
                        mainColumnIndex++;
                        searchReduction = false;

                    };
                }
            }
        }

        let isBasis = reduced[reduced.length - 1].length > 0;

        return {
            reduced: reduced,
            inverted: inverted,
            primeIndices: primeIndices,
            isBasis: isBasis,
        };

    }

    static reduceHarmony(harmony) {
        return jiBasis._reduce(harmony).reduced;
    }

    static invertHarmony(harmony) {
        return jiBasis._reduce(harmony).inverted;
    }

    static isBasis(harmony) {
        return jiBasis._reduce(harmony).isBasis;
    }

    reduce() {
        return new jiBasis(this._reduced);
    }

    invert() {
        return new jiBasis(this._inverted);
    }

    primeIndices() {
        let result = [];
        this._primeIndices.map(
            (value) => result.push(value)
        );
        return result;
    }

    // test for a single tone:
    isIndependent(tone) {
        tone = new Tone(tone);
        let expandedBasis = this.add(tone);
        return jiBasis.isBasis(expandedBasis);
    }

    // test whether a basis is equivalent with another one
    isEquivalent(basis) {
        let basis = new jiBasis(basis);
        return this.toString = basis.toString;
    }

    // promote some active methods from Harmony: 
    add(value) {
        let harmony = new Harmony(this).add(value);
        return new jiBasis(harmony);
    }

    remove(value) {
        let harmony = new Harmony(this).remove(value);
        return new jiBasis(harmony);
    }


}



class jiWidths {
    constructor(basis, widths) {
        basis = new jiBasis(basis);

        // test wether widths is an array of numbers
        let test = Array.isArray(widths);
        widths.forEach(
            (value) => test = test && typeof value === `number`
        )
        if (!test) {
            throw new Error(`Basis widths must be an array of numbers.`)
        }

        this._basis = basis;
        this._widths = widths;

        // set prime widths
        this._primeWidths = [];
        let primeIndices = basis.primeIndices();
        let invertedBasis = basis.invert();
        for (let i = 0; i < primeIndices.length; i++) {
            let w = 0;
            for (let j = 0; j < invertedBasis.length; j++) {
                let width = widths[j] || 0;
                let invertedBasisNumber = invertedBasis[i][j] ? invertedBasis[i][j].toNumber() : 0;
                w += invertedBasisNumber * width;
            }
            this._primeWidths[primeIndices[i]] = w;
        }

    }

    getBasis() {
        return new jiBasis(this._basis);
    }

    setBasis(basis) {
        let newBasis = new jiBasis(basis);
        let newWidths = [];
        newBasis.forEach(
            (value) => newWidths.push(value.width(this.primeWidths()))
        );
        return new jiWidths(newBasis, newWidths);
    }

    getWidths() {
        return this._widths.map(
            (value) => value
        )
    }

    setWidths(widths) {
        return new jiWidths(this._basis, widths);
    }


    primeWidths() {
        return this._primeWidths.map(
            (value) => value
        )
    }
}







