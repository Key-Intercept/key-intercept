export class NormalizedString {
    str: string;
    nfkdStr: string;
    indices: IndexMatch[]; // list of mappings of range in pre-normalized to ranges in post-normalized
    verbose: boolean;

    constructor(str: string, verbose: boolean) {
        this.str = str;
        this.verbose = verbose;
        this.nfkdStr = '';
        this.indices = [];
        this.rebuildNFKDMappings();
    }

    /**
     * We need to read through the input string and compare against regex to find matches
     * We will then to to update the string as we go and continue matching
     * 
     * @param regex Regular Expression to match
     * @param fn Callback for each match - returns a string that is the value to replace with
     */
    replace(regex: RegExp, fn: (match: string, ...args: any) => string) {
        const regexWithIndices = new RegExp(regex, 'gid');
        let match;
        while ((match = regexWithIndices.exec(this.nfkdStr)) != null) {
            const indices = match.indices!;
            let postStart = indices[0]![0];
            let postEnd = indices[0]![1];

            if (this.verbose) { console.log(`match found between ${postStart} to ${postEnd} on normalized string`); }

            let preRange = this.convertToPreNormalizedIndices(postStart, postEnd);
            
            if (this.verbose) { console.log(`corresponds to ${preRange.start} to ${preRange.stop} on pre-normalized string`); }

            this.str = this.str.substring(0, preRange.start) + fn(match[0]) + this.str.substring(preRange.stop);

            this.rebuildNFKDMappings();
        }
        return this.str;
    }

    /**
     * Builds a NFKD normalized string and maps indices of values in that string, to the corresponding values in the orginal string
     * 
     * Maps arbitrary indices of pre-normalized string to arbitrary ranges in post-normalized
     * PRE      [A]   [SURROGATE 1] [SURROGATE 2]           [Å]
     * POST     [A]        [Single item]               [A] [angstrom]
     */
    rebuildNFKDMappings() {
        this.nfkdStr = '';
        this.indices = [];

        for (let i = 0; i < this.str.length; i++) {
            let char = this.str[i];
            let preIndx = [i, i + 1];
            let charCode = char.charCodeAt(0);

            if (charCode >= 0xd800 && charCode <= 0xdfff) { // this is a surrogate pair
                char = this.str.substring(i, i + 2);
                preIndx[1] = i + 2;
                i++;
            }

            const nfkdChar = char.normalize('NFKD');
            let postIndx = [this.nfkdStr.length, this.nfkdStr.length + nfkdChar.length];

            this.indices.push(new IndexMatch(new IndexRange(preIndx[0], preIndx[1]), new IndexRange(postIndx[0], postIndx[1])));
            this.nfkdStr += nfkdChar;
        }
    }

    /**
     * Convert a range of from the post-normalized string, to the corresponding
     * range on the pre-normalized string
     * 
     * @param postStart Starting index from post-normalized string
     * @param postEnd Ending index from post-normalized string
     * @returns Range of equilvalent characters in pre-normalized string
     */
    convertToPreNormalizedIndices(postStart: number, postEnd: number): IndexRange {
        let preStart = -1, preEnd = -1;
        for (let index of this.indices) {
            if (preStart == -1 &&
                index.postNormalized.start <= postStart &&
                index.postNormalized.stop > postStart
            ) {
                preStart = index.preNormalized.start;
            }
            if (preEnd == -1 &&
                index.postNormalized.start < postEnd &&
                index.postNormalized.stop >= postEnd
            ) {
                preEnd = index.preNormalized.stop;
            }
        }
        return new IndexRange(preStart, preEnd);
    }
}

class IndexMatch {
    preNormalized: IndexRange;
    postNormalized: IndexRange;

    constructor(preNormalized: IndexRange, postNormalized: IndexRange) {
        this.preNormalized = preNormalized;
        this.postNormalized = postNormalized;
    }
}

class IndexRange {
    start: number;
    stop: number;

    constructor(start: number, stop: number) {
        this.start = start;
        this.stop = stop;
    }
}
