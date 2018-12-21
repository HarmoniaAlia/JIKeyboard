


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


// let a = new Harmony(`{3/2, 9/8, 5/4}`);
// console.log(a);
// console.log(a.getFormula('fraction'));
// let b = a.sortByHeight();
// console.log(b.getFormula());
// let c = b.toCanonic();
// console.log(c.getFormula());



// let a = new Harmony(`{1}^(-1) * {1}`);
// console.log(a);



// let Basis_test = [
//     `{2, 15, 75}`, `{2/3, 5, 15, 13/8}`,
// ]
// for (let t of Basis_test) {
//     let x = new jiBasis(t);
//     console.log(`---> Basis test for ${t}-------------------`);
//     console.log(`Basis:`);
//     console.log(x.getFormula());
//     console.log(x);
//     console.log(`Reduced:`)
//     console.log(x.reduce().getFormula())
//     console.log(`Inverted:`)
//     console.log(x.invert().getFormula())
//     console.log(`Prime indices:`)
//     console.log(x.primeIndices())
//     console.log(`Canonic form:`)
//     console.log(x.toCanonic().getFormula());

//     console.log(`Prime widths:`)
//     let z = new jiWidths(x, [2, 5, 18])
//     console.log(z.primeWidths());

//     let u = z.setBasis(`{3/2,5/4, 7/4, 13/8, 2}`)
//     console.log(u.primeWidths())

// }