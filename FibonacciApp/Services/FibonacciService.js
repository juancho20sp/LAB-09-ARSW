var bigInt = require("big-integer");

class FibonacciService {
    static getNthNumberInSequence(nth) {
        console.log(`The app is goint to calculate ${nth} number in Fibonacci Sequence.`)        

        let nth_1 = bigInt.one;
        let nth_2 = bigInt.zero;
        let answer = bigInt.zero;

        if (nth < 0)
            throw 'must be greater than 0'
        else if (nth === 0)
            answer = nth_2
        else if (nth === 1)
            answer = nth_1
        else {
            for (var i = 0; i < nth - 1; i++) {
                answer = nth_2.add(nth_1)
                nth_2 = nth_1
                nth_1 = answer
            }
        }

        return answer.toString()
    }
}

module.exports = FibonacciService