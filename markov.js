export class MarkovGenerator {
    start = '__START__';
    words = [];
    wordIndexes = {};
    weights = {};

    constructor(messages) {
        for (const message of messages) {
            for (let word of this.#getWordsInMessage(message)) {
                if (this.words.indexOf(word) == -1) this.words.push(word);
            }
        }

        for (let i = 0; i < this.words.length; i++) {
            this.wordIndexes[this.words[i]] = i;
        }

        this.weights[this.start] = {};
        for (const message of messages) {
            // make an 
            let wordsInMessage = [this.start, ...this.#getWordsInMessage(message)];
            
            for (let i = 0; i < wordsInMessage.length - 1; i++) { 
                let currentWord = wordsInMessage[i];
                let nextWord = wordsInMessage[i + 1];
                if (!this.weights[currentWord]) this.weights[currentWord] = {};
                let followingWeight = (this.weights[currentWord])[nextWord];
                this.weights[currentWord][nextWord] = (followingWeight ? followingWeight + 1 : 1);
            }
        }
    }

    getMessage(maxLength) {
        let nextWord = this.#weightedRandom(this.weights[this.start]);
        let message = nextWord;
        let length = 1;

        do {
            const nextRandomWord = this.#weightedRandom(this.weights[nextWord]);

            if (nextRandomWord !== null && length < maxLength) {
                nextWord = nextRandomWord;
                message += " " + nextWord;
                length++;
            } else {
                nextWord = null;
            }
        } while (nextWord)
        return message;
    }

    #getWordsInMessage(message) {
        let words = message.split(/\s/);
        words = words.map(x => this.#cleanWord(x));
        words = words.filter(x => x);
        return words;
    }

    #cleanWord(word) {
        if (word == word.toUpperCase) return word;
        word = word.toLowerCase();
    
        let checkSymmetry = [['|', '|'], ['*', '*'], ['_', '_'], ["\"", "\""], ['(', ')']];
        let truncateStart = 0;
        let truncateEnd = 0;
    
        // symmetry checks
        for (const charPair of checkSymmetry) {
            if (word.startsWith(charPair[0]) && !word.endsWith(charPair[1])) {
                for (let i = 0; i < word.length; i++) {
                    if (word[i] == charPair[0]) truncateStart++;
                    else break;
                }
            } else if (word.endsWith(charPair[1]) && !word.startsWith(charPair[0])) {
                for (let i = word.length - 1; i >= 0; i--) {
                    if (word[i] == charPair[1]) truncateEnd++;
                    else break;
                }
            }
        }
    
        let cleanedWord = word.substring(truncateStart, word.length - truncateEnd);
        return cleanedWord
    }

    #weightedRandom(wordWeights) {
        if (!wordWeights) return null;

        let weightValues = Object.values(wordWeights);
        let totalWeight = weightValues.reduce((x, y) => x += y, 0);

        let rand = Math.ceil(Math.random() * totalWeight);

        for (const key of Object.keys(wordWeights)) {
            totalWeight -= wordWeights[key];
            if (totalWeight < rand) return key;
        }

        // Shouldn't be possible
        throw "What the hell?";
    }
}