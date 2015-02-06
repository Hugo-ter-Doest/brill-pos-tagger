Brill's POS Tagger
==============
# Installation
```
npm install brill-pos-tagger
```

# Usage
```
var Tagger = require("./lib/brill_pos_tagger");

var base_folder = "/home/hugo/workspace/brill-pos-tagger";
var rules_file = base_folder + "/data/tr_from_pos.txt";
var lexicon_file = base_folder + "/data/lexicon.json";
var default_category = 'N';

var tagger = new Tagger(lexicon_file, rules_file, default_category, function(error) {
  if (error) {
    console.log(error);
  }
  else {
    var sentence = ["I", "see", "the", "man", "with", "the", "telescope"];
    console.log(JSON.stringify(tagger.tag(sentence)));
  }
});
```

# Lexicon
The lexicon is either a JSON file that has the following structure:
```
{
  "word1": ["cat1"],
  "word2": ["cat2", "cat3"],
  ...
}
```
or a text file:
```
word1 cat1 cat2
word2 cat3
...
```
Words may have multiple categories in the lexicon file. The tagger uses only the first one.

# Specifying transformation rules
Transformation rules are specified as follows:
```
OLD_CAT NEW_CAT PREDICATE PARAMETER
```
This means that if the predicate is true that if the category of the current position is OLD_CAT, the category is replaced by NEW_CAT. The predicate may use the parameter in distinct ways: sometimes the parameter is used for specifying the outcome of the predicate:
```
NN CD CURRENT-WORD-IS-NUMBER YES
```
This means that if the outcome of CURRENT-WORD-IS-NUMBER is YES, the category is replaced by <code>CD</code>
The parameter can also be used to check the category of a word in the sentence:
```
VBD NN PREV-TAG DT
```
Here the category of the previous word must be <code>DT</code> for the rule to be applied.

# Algorithm
The tagger applies transformation rules that may change the category of words. The input sentence must be split into words which are assigned with categories. The tagged sentence is then processed from left to right. At each step all rules are applied once; rules are applied in the order in which they are specified. Algorithm:
```
function(sentence) {
  var tagged_sentence = new Array(sentence.length);

  // snip

  // Apply transformation rules
  for (var i = 0, size = sentence.length; i < size; i++) {
    this.transformation_rules.forEach(function(rule) {
      rule.apply(tagged_sentence, i);
    });
  }
  return(tagged_sentence);
}
```

# Adding a predicate
Predicates are defined in module <code>lib/Predicate.js</code>. In that file a function must be created that serves as predicate. A predicate accepts a tagged sentence, the current position in the sentence that is being tagged, and the outcome(s) of the predicate. An example of a predicate that checks the category of the current word:
```
function current_word_is_tag(tagged_sentence, i, parameter) {
  return(tagged_sentence[i][0] === parameter);
}
```
Some predicates accept two parameters. Next step is to map a keyword to this predicate so that it can be used in the transformation rules. The mapping is also defined in the grammar file:
```
var predicates = {
  "CURRENT-WORD-IS-TAG": current_word_is_tag,
  "PREV-WORD-IS-CAP": prev_word_is_cap
}
```

# Acknowledgements/references
* Part of speech tagger by Percy Wegmann, https://code.google.com/p/jspos/
* Node.js version of jspos: https://github.com/neopunisher/pos-js
* A simple rule-based part of speech tagger, Eric Brill, Published in: Proceeding ANLC '92 Proceedings of the third conference on Applied natural language processing, Pages 152-155. http://dl.acm.org/citation.cfm?id=974526