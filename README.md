Brill's POS Tagger
==============

#Lexicon
The lexicon is a JSON file that has the following structure:
```
{
  "word1": ["cat1"],
  "word2": ["cat2", "cat3"],
  ...
}
```
Words may have multiple categories in the lexicon file. The tagger uses only the first one.

#Specifying transformation rules
Transformation rules are specified as follows:
```
OLD_CAT_OLD NEW_CAT PREDICATE PARAMETER
```
This means that if the predicate is true that if the category of the current position is OLD_CAT, the category is replaced by NEW_CAT. The predicate may use the parameter in distinct ways: sometimes the parameter is used for specifying the outcome of the predicate:
```
NN CD CURRENT-WORD-IS-NUMBER YES
```
This means that if the outcome of CURRENT-WORD-IS-NUMBER must be YES, the category is replaced by <code>CD</code>
Also the parameter can be used to check the category of a word in the sentence:
```
VBD NN PREV-TAG DT
```
Here the category of the previous word must be <code>DT</code> for the rule to be applied.

#Adding a predicate
Predicates are defined in the grammar specification for transformation rules:
```
lib/PEG_grammar_for_transformation_rules.txt
```

In that file a function must be created that serves as predicate. A predicate accepts a tagged sentence, the current position in the sentence that being tagged, and the outcome of the predicate. An example of a predicate that checks the category of the current word:
```
function current_word_is_tag(tagged_sentence, i, parameter) {
  return(tagged_sentence[i][0] === parameter);
}
```
Next step is to map a keyword to this predicate so that it can be used in the transformation rules. The mapping is also defined in the grammar file:
```
  var predicates = {
    "CURRENT-WORD-IS-TAG": current_word_is_tag,
    "PREV-WORD-IS-CAP": prev_word_is_cap
  }
```