/*!
 * jsPOS
 *
 * Copyright 2010, Percy Wegmann
 * Licensed under the LGPLv3 license
 * http://www.opensource.org/licenses/lgpl-3.0.html
 */

module.exports = POSTagger;
function POSTagger(){
    this.lexicon = require('./lexicon HtD');
}

/**
 * Indicates whether or not this string starts with the specified string.
 * @param {Object} string
 */
function startsWith($this, string){ 
    if (!string)
        return false;
    return $this.indexOf(string) == 0;
}

/**
 * Indicates whether or not this string ends with the specified string.
 * @param {Object} string
 */
function endsWith($this, string){
    if (!string || string.length > $this.length) 
        return false;
    return $this.indexOf(string) == $this.length - string.length;
}

POSTagger.prototype.wordInLexicon = function(word){
    var ss = this.lexicon[word];
    if (ss != null) 
        return true;
    // 1/22/2002 mod (from Lisp code): if not in hash, try lower case:
    if (!ss) 
        ss = this.lexicon[word.toLowerCase()];
    if (ss) 
        return true;
    return false;
}

POSTagger.prototype.tag = function(words){
    var ret = new Array(words.length);
    for (var i = 0, size = words.length; i < size; i++) {
        var ss = this.lexicon[words[i]];
        // 1/22/2002 mod (from Lisp code): if not in hash, try lower case:
        if (!ss) 
            ss = this.lexicon[words[i].toLowerCase()];
        if (!ss && words[i].length == 1) 
            ret[i] = words[i] + "^";
        // We need to catch scenarios where we pass things on the prototype
        // that aren't in the lexicon: "constructor" breaks this otherwise
        // HtD: how can ss be a function?
        if (!ss || typeof ss === "function") 
            ret[i] = "NN";
        else 
            ret[i] = ss[0];
    }
	
	/**
     * Apply transformational rules
     **/
    for (var i = 0; i < words.length; i++) {
        var word = ret[i];
        //  rule 1: DT, {VBD | VBP} --> DT, NN
        //  HtD: code also allows VB
        //  HtD: VBD NN PREV-TAG DT
        //  HtD: VBP NN PREV-TAG DT
        //  HtD: VB NN PREV-TAG DT
        if (i > 0 && (ret[i - 1] === "DT")) {
            if (word == "VBD" ||
            word == "VBP" ||
            word == "VB") {
                ret[i] = "NN";
            }
        }
        // rule 2: convert a noun to a number (CD) if "." appears in the word
        // HtD: NN, NNP, NNPS, NNS are allowed here
        // HtD: So we have four rules here; for NN this looks like:
        // HtD: NN CD CURRENT-WORD-IS-NUMBER YES
        // HtD: Same way we have four rules for URLs:
        // HtD: NN URL CURRENT-WORD-IS-URL YES
        if (startsWith(word, "N")) {
        if (words[i].indexOf(".") > -1) {
              // url if there are two contiguous alpha characters
              if (/[a-zA-Z]{2}/.test(words[i]))
                ret[i] = "URL";
              else
                ret[i] = "CD";
            }
			// Attempt to convert into a number
            if (parseFloat(words[i]))
                ret[i] = "CD";
        }
        // rule 3: convert a noun to a past participle if words[i] ends with "ed"
        // HtD: NN VBN CURRENT-WORD-ENDS-WITH ed
        if (startsWith(ret[i], "N") && endsWith(words[i], "ed")) 
            ret[i] = "VBN";
        // rule 4: convert any type to adverb if it ends in "ly";
        // HtD: * RB CURRENT-WORD-ENDS-WITH ly
        if (endsWith(words[i], "ly")) 
            ret[i] = "RB";
        // rule 5: convert a common noun (NN or NNS) to a adjective if it ends with "al"
        // HtD: NN JJ CURRENT-WORD-ENDS-WITH al
        if (startsWith(ret[i], "NN") && endsWith(word, "al")) 
            ret[i] = i, "JJ";
        // rule 6: convert a noun to a verb if the preceding work is "would"
        // HtD: NN VB PREV-WORD-IS would
        if (i > 0 && startsWith(ret[i], "NN") && words[i - 1].toLowerCase() == "would")
            ret[i] = "VB";
        // rule 7: if a word has been categorized as a common noun and it ends with "s",
        //         then set its type to plural common noun (NNS)
        // HtD: NN NNS CURRENT-WORD-ENDS-WITH s
        if (ret[i] == "NN" && endsWith(words[i], "s")) 
            ret[i] = "NNS";
        // rule 8: convert a common noun to a present participle verb (i.e., a gerund)
        // HtD: NN VBG CURRENT-WORD-ENDS-WITH ing
        if (startsWith(ret[i], "NN") && endsWith(words[i], "ing"))
            ret[i] = "VBG";
    }
	var result = new Array();
	for (i in words) {
		result[i] = [words[i], ret[i]];
	}
    return result;
}

POSTagger.prototype.prettyPrint = function(taggedWords) {
	for (i in taggedWords) {
        print(taggedWords[i][0] + "(" + taggedWords[i][1] + ")");
    }
}

//print(new POSTagger().tag(["i", "went", "to", "the", "store", "to", "buy", "5.2", "gallons", "of", "milk"]));
