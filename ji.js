'use strict'

let JI = {

    _dimension: 8,
    _primes: [2, 3, 5, 7, 11, 13, 17, 19],
    _limit: 19,
    _refPitch: 440, // 440 * 3 / 5,  //334.125,
    _refLetter: 'A', // 'C',  // 'D', 

    set limit(value) {
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

    get limit() {
        return this._limit;
    },

    set dimension(value) {
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

    get dimension() {
        return this._dimension;
    },

    get primes() {
        return this._primes;
    },

    set refPitch(value) {
        if (Number.isNaN(value) || value < 0) {
            throw new Error(`The value of refPitch must be a positive number.`)
        }
        this._refPitch = value;
    },

    get refPitch() {
        return this._refPitch;
    },

    set refLetter(value) {
        if (/[^CDEFGAB]/.test(value)) {
            throw new Error(`Reference pitch must one of the letters: C, D, E, F, G, A, B.`)
        }
        this._refLetter = value;
    },

    get refLetter() {
        return this.refLetter;
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

    gcd: function (a, b) {
        if (b) {
            return this.gcd(b, a % b);
        } else {
            return Math.abs(a);
        }
    },



    findEndOfBrackets: function (inputString, startPosition) {
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


    findEndOfSegment(inputString, startPosition, includedOperators, dividingOperators) {

        let cursorPosition = this.findEndOfBrackets(inputString, startPosition);
        let continueCursor = cursorPosition < inputString.length;
        while (continueCursor) {
            let testedOperator = inputString[cursorPosition];
            if (includedOperators.includes(testedOperator)) {
                cursorPosition = this.findEndOfBrackets(inputString, cursorPosition + 1);
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


class Frac extends Array {

    constructor(value) {
        super();
        if (typeof value == 'number') {
            value = value.toString()
        }
        if (typeof value == 'string') {
            this.setFormula(value);
        } else {
            if (value instanceof Array) {
                this.setArray(value)
            } else {
                throw new Error(`Format of the fraction constructor ${value} is incorrect.`)
            }
        }
    }

    setArray(inputFracArr) {
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
        let divisor = JI.gcd(a, b);
        this[0] = a == 0 ? 0 : a / divisor;
        this[1] = a == 0 ? 1 : b / divisor;
    }

    setFormula(inputFracForm) {
        // Just basic syntax is considered, without nested operations.  This is allowed: '2', '1/12', '(-1/12)'
        inputFracForm = inputFracForm.replace(/\s/g, '');

        let resultArray = [];
        if (inputFracForm[0] === `(` && inputFracForm[inputFracForm.length - 1] === `)`) {
            inputFracForm = inputFracForm.slice(1, -1);
        }

        resultArray = inputFracForm.split(`/`, 2);
        resultArray[0] = parseInt(resultArray[0]);
        resultArray[1] = resultArray.length < 2 ? 1 : parseInt(resultArray[1]);

        this.setArray(resultArray);
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
        if (typeof value == 'string' || Array.isArray(value)) {
            value = new Frac(value);
        }
        if (value instanceof Frac) {
            let resultArray = [
                this[0] * value[0],
                this[1] * value[1]
            ];
            return new Frac(resultArray);
        } else {
            throw new Error(`The format of the fraction ${value} is incorrect.`)
        }
    }

    divide(value) {
        if (typeof value == 'string' || Array.isArray(value)) {
            value = new Frac(value);
        }
        if (value instanceof Frac) {
            let resultArray = [
                this[0] * value[1],
                this[1] * value[0]
            ];
            return new Frac(resultArray);
        } else {
            throw new Error(`The format of the fraction ${value} is incorrect.`)
        }
    }

    add(value) {
        if (typeof value == 'string' || Array.isArray(value)) {
            value = new Frac(value);
        }
        if (value instanceof Frac) {
            let resultArray = [
                this[0] * value[1] + this[1] * value[0],
                this[1] * value[1]
            ];
            return new Frac(resultArray);
        } else {
            throw new Error(`The format of the fraction ${value} is incorrect.`)
        }
    }

    subtract(value) {
        if (typeof value == 'string' || Array.isArray(value)) {
            value = new Frac(value);
        }
        if (value instanceof Frac) {
            let resultArray = [
                this[0] * value[1] - this[1] * value[0],
                this[1] * value[1]
            ];
            return new Frac(resultArray);
        } else {
            throw new Error(`The format of the fraction ${value} is incorrect.`)
        }
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
            let fraction = new Frac(value[i]);
            this[i] = fraction;
        }

        // if needed, extend JI.dimension
        if (this.length > JI.dimension) {
            JI.dimension = this.length;
        }
    }

    setByFormula(inputFormula) {
        // include letters:  if (type == 'letter')

        let rawInputFormula = inputFormula;
        inputFormula = inputFormula.replace(/\s/g, '');
        if (/[^0-9\(\)\-\*\/\^]/.test(inputFormula)) {
            throw new Error('Incorrect format of Tone formula. Allowed characters: 0123456789-*/^().');
        };

        let resultToneArray;
        let cursorStart = 0;
        let cursorEnd;
        let operator;
        let resultTone;

        // phase 1: the input formula split at: '*' and '/'
        cursorEnd = JI.findEndOfSegment(inputFormula, 0, `^`, `*/`);
        if (cursorEnd < inputFormula.length) {
            resultTone = new Tone(inputFormula.slice(cursorStart, cursorEnd));
            operator;
            while (cursorEnd < inputFormula.length) {
                operator = inputFormula[cursorEnd];
                cursorStart = cursorEnd + 1;
                cursorEnd = JI.findEndOfSegment(inputFormula, cursorStart, `^`, `*/`);
                let nextTone = new Tone(inputFormula.slice(cursorStart, cursorEnd));
                switch (operator) {
                    case `*`:
                        resultTone = resultTone.multiply(nextTone);
                        break;
                    case `/`:
                        resultTone = resultTone.divide(nextTone);
                        break;
                    default:
                        throw new Error(`Error in parsing tone ${inputFormula}.`);
                }
            }
        } else {


            // phase 2: the input formula split at: '^'
            cursorEnd = JI.findEndOfSegment(inputFormula, 0, ``, `^`);
            if (cursorEnd < inputFormula.length) {
                let baseTone = new Tone(inputFormula.slice(cursorStart, cursorEnd));
                let toneExponent = new Frac(inputFormula.slice(cursorEnd + 1));
                resultTone = baseTone.power(toneExponent);
            } else {

                // phase 3a: a single segment - surrounding '()' removed
                cursorEnd = JI.findEndOfBrackets(inputFormula, 0);
                if (cursorEnd = inputFormula.length) {
                    if (/[^0-9]/.test(inputFormula)) {
                        resultTone = new Tone(inputFormula.slice(1, -1));
                    } else {

                        // phase 3b: a single segment - which is a single number          
                        let parsedInteger = parseInt(inputFormula);
                        let remainder = parsedInteger;
                        let resultToneArray = [
                            [0, 1]
                        ];
                        let prime = 2;
                        let primeIndex = 0;
                        while (remainder > 1) {
                            if (remainder % prime === 0) {
                                resultToneArray[primeIndex][0]++;
                                remainder = remainder / prime;
                            } else {
                                let p = prime + 1;
                                while (p <= remainder) {
                                    if (JI.isPrime(p)) {
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
                        if (primeIndex > JI.dimension) {
                            JI.dimension = primeIndex;
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
                    let a = 1;
                    let b = 1;
                    for (let i = 0; i < this.length; i++) {
                        if (this[i][0] >= 0) {
                            a = a * Math.pow(JI.primes[i], this[i][0]);
                        } else {
                            b = b * Math.pow(JI.primes[i], -this[i][0]);
                        }
                    }
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
                        resultArray.push(`${JI.primes[i]}^${this[i][0]}`);
                    } else {
                        if (this[i][1] === 1) {
                            resultArray.push(`${JI.primes[i]}^(${this[i][0]})`);
                        } else {
                            resultArray.push(`${JI.primes[i]}^(${this[i][0]}/${this[i][1]})`)
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

    // get formulaFraction() {
    //     if (this.isJI) {
    //         let result = '';
    //         let a = 1;
    //         let b = 1;
    //         for (let i = 0; i < this.length; i++) {
    //             if (this[i][0] >= 0) {
    //                 a = a * Math.pow(JI.primes[i], this[i][0]);
    //             } else {
    //                 b = b * Math.pow(JI.primes[i], -this[i][0]);
    //             }
    //         }
    //         if (b === 1) {
    //             result = a.toString(10);
    //         } else {
    //             result = a + '/' + b
    //         };
    //         return result;
    //     }
    // }

    // get formulaFactors() {
    //     if (this.length == 1 && this[0][0] === 0) {
    //         return '1';
    //     }

    //     let resultArray = [];
    //     for (let i = 0; i < this.length; i++) {
    //         if (this[i][0] === 0) {
    //             continue;
    //         }
    //         if (this[i][0] > 0 && this[i][1] === 1) {
    //             resultArray.push(`${JI.primes[i]}^${this[i][0]}`);
    //         } else {
    //             if (this[i][1] === 1) {
    //                 resultArray.push(`${JI.primes[i]}^(${this[i][0]})`);
    //             } else {
    //                 resultArray.push(`${JI.primes[i]}^(${this[i][0]}/${this[i][1]})`)
    //             };
    //         }
    //     }
    //     return resultArray.join(' * ');
    // }

    get ratio() {
        let ratio = 1;
        this.forEach(
            (value, index) =>
            ratio = ratio * Math.pow(JI.primes[index], value[0] / value[1])
        )
        return ratio;
    }

    get pitch() {
        return this.ratio * JI.refPitch;
    }

    get height() {
        return Math.log2(this.ratio);
    }

    get weight() {

    }

    power(value) {
        value = new Frac(value);
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
                if (i === resultArrayEnd && a === 0 && i > 0) {
                    resultArrayEnd--;
                } else {
                    b = this[i][1] * value[i][1];
                    divisor = JI.gcd(a, b);
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
        cursorEnd = JI.findEndOfSegment(inputFormula, 0, `^*/`, `+-`);
        if (cursorEnd < inputFormula.length) {
            resultHarmony = new Harmony(inputFormula.slice(cursorStart, cursorEnd));
            while (cursorEnd < inputFormula.length) {
                operator = inputFormula[cursorEnd];
                cursorStart = cursorEnd + 1;
                cursorEnd = JI.findEndOfSegment(inputFormula, cursorStart, `^*/`, `+-`);
                nextHarmony = new Harmony(inputFormula.slice(cursorStart, cursorEnd));
                switch (operator) {
                    case `+`:
                        resultHarmony = resultHarmony.add(nextHarmony);
                        break;
                    case `-`:
                        resultHarmony = resultHarmony.remove(nextHarmony);
                        break;
                    default:
                        throw new Error(`Error in parsing harmony ${inputFormula}.`);
                }
            }
        } else {


            // phase 1: the input formula split at: '*' and '/'
            cursorEnd = JI.findEndOfSegment(inputFormula, 0, `^`, `*/`);
            if (cursorEnd < inputFormula.length) {
                resultHarmony = new Harmony(inputFormula.slice(cursorStart, cursorEnd));
                while (cursorEnd < inputFormula.length) {
                    operator = inputFormula[cursorEnd];
                    cursorStart = cursorEnd + 1;
                    cursorEnd = JI.findEndOfSegment(inputFormula, cursorStart, `^`, `*/`);
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
                cursorEnd = JI.findEndOfSegment(inputFormula, 0, ``, `^`);
                if (cursorEnd < inputFormula.length) {
                    let baseHarmony = new Harmony(inputFormula.slice(cursorStart, cursorEnd));
                    let harmonyExponent = new Frac(inputFormula.slice(cursorEnd + 1));
                    resultHarmony = baseHarmony.power(harmonyExponent[0]);
                } else {

                    // phase 3: a single segment....
                    cursorEnd = JI.findEndOfBrackets(inputFormula, 0);
                    if (cursorEnd == inputFormula.length) {

                        // ... which is not a tone (contains braces and/or brackets):
                        if (/[\[\]\{\}]/.test(inputFormula)) {
                            let beginEnd = inputFormula[0] + inputFormula[inputFormula.length - 1];
                            let interior = inputFormula.slice(1, -1);
                            let interiorHarmony;


                            // phase 3a: parse interior if it comprises comma-separated list of tones
                            if (!/[^0-9\(\)\-\*\/\^\,]/.test(interior)) {
                                cursorEnd = JI.findEndOfSegment(interior, 0, `^*/`, `,`);
                                let firstTone = new Tone(interior.slice(cursorStart, cursorEnd));
                                interiorHarmony = new Harmony([firstTone]);
                                while (cursorEnd < interior.length) {
                                    operator = interior[cursorEnd];
                                    if (operator != ',') {
                                        throw new Error(`Error in parsing harmony ${inputFormula}.`);
                                    }
                                    cursorStart = cursorEnd + 1;
                                    cursorEnd = JI.findEndOfSegment(interior, cursorStart, `^*/`, `,`);
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
        let interior = this.map(
            (value) => value.getFormula(type)
        )
        return '{ ' + interior.join(', ') + ' }';
    }


    power(value) {
        value = new Frac(value);
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
                test = test && value[i].toString() !== this[j].toString();
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
        let denominator = JI.gcd
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










































// let tone1 = new Tone([
//     [0, 1],
//     [1, 3],
//     [3, 2],
//     [-1, 12],
//     [3, 12]
// ]);

// // let tone2 = new Tone(`abc`);

// let tone1a = new Tone([
//     [0, 1]
// ]);

// let tone3 = new Tone([
//     [-1, 2],
//     [-1, 3],
//     [-5, 2],
//     [4, 12],
//     [-3, 12]
// ])



// let tone5 = new Tone([
//     [-3, 1],
//     [2, 1]
// ])

// let tone4 = new Tone(`{1, 9/8, 5/4, 4/3, 3/2}`);

// console.log(tone1);
// console.log(tone1a);
// console.log(tone5);

// let test = `{1^(-5/12),2}*2^(-1/12)+{9/8}`
// let test2 = `{1,2}*2^(-1/`
// let x = JI.findEndOfSegment(test2, /[^0-9\(\)\{\}\[\]\-\+\*\/\^\,\s]/, ',', '*');
// let y = JI.findEndOfBrackets(test2, 0);
// console.log(`segment: ${x}, brackets: ${y}`);

// let test_jifraction = [
//     [2, 1], `2/3`, `8/6`, `-3/4`, `2/-1`, `0`, `2`, `-2`, `0/1`
// ]
// for (let x of test_jifraction) {
//     let t = new JIFraction(x);
//     console.log(t);
// }

// let a = new JIFraction(`8/6`).multiply(`(3/4)`).add([1, 2]).divide(`2`).subtract([2, -4])
// console.log(a);





// let JIFraction_test = [`3`, `1`, `-3`, `0`, `-6/-4`, `6 / -4`, `-6/ 4`, [-6, -4],
//     [-0, 4], `-0 / 4`, [0, -4],
//     [-0, -4]
// ];
// for (let x of JIFraction_test) {
//     console.log(`---> Frac test for '${x}'---------------------`)
//     let t = new Frac(x);
//     console.log(t);
//     console.log(`formula: ${t.getFormula()}`);
//     console.log(`formula - fraction: ${t.getFormula('fraction')}`);
//     console.log(``);
// };



// let Tone_test_formula = [
//     `9`, `2^3 * 5 ^(-1)`, `(2/3)*(6/4)`, `(2/3)/(2/3)`, `2^3`, `2^(-1/12)`, `2^0`, `(2 /3) ^0 `, `5^1*2^(-2)`, // `((3 / 2) ^ (-1)) * 71 ^ (-8/12)`,
// ];
// for (let x of Tone_test_formula) {
//     console.log(`---> Tone test (formulas) for '${x}'---------------------`)
//     let t = new Tone(x);
//     console.log(t);
//     console.log(`formula: ${t.getFormula('simple')}`);
//     console.log(`formula - pitch: ${t.getFormula('pitch')}`);
//     console.log(`formula - cents: ${t.getFormula('cents')}`);
//     console.log(`ratio: ${t.ratio}`);
//     console.log(`pitch: ${t.pitch}`);
//     console.log(`height: ${t.height}`);
//     console.log(`height: ${t.height}`);
//     console.log(`octave reduction: ${t.toOctave().getFormula()}`);
//     console.log(t.toOctave());
//     console.log(``)
// }


// let Tone_test_array = [
//     [[-3, 1], [2, 1]], 
// ];
// for (let x of Tone_test_array) {
//     console.log(`---> Tone test (arrays) for '${x}'---------------------`)
//     let t = new Tone(x);
//     console.log(t);
//     console.log(`formula: ${t.getFormula()}`);
//     console.log(``);
// }


// let Harmony_test = [
//     [
//         [
//             [-3, 1],
//             [2, 1]
//         ],
//     ],
//     `{9/8}`,
//     `{9/8, 3}`,
//     `{9/3, 4/3, 18/6}`,
//     `{2, 1}^3`,
//     `8/9 * {9/8, 5/4, 4/3}`
// ];
// for (let x of Harmony_test) {
//     console.log(`---> Harmony test for '${x}'---------------------`)
//     let t = new Harmony(x);
//     console.log(t);
//     console.log(`first tone:`)
//     console.log(t[0]);
//     console.log(`formula: ${t.getFormula()}`);
//     console.log(`formula - pitch: ${t.getFormula('pitch')}`);
//     console.log(`formula - cents: ${t.getFormula('cents')}`);
//     console.log(`octave reduction: ${t.toOctave().getFormula()}`);
//     console.log(t.toOctave());
//     console.log(``);
// }


let a = new Harmony(`[{1, 3} * {1, 3}^(-1) * {4, 5, 6}]`);
console.log(a.getFormula());
let b = a.sortByHeight();
console.log(b.getFormula())