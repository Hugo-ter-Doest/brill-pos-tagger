{

  function isNumeric(num) {
    return (!isNaN(num));
  }

  function current_word_is_number(tagged_sentence, i, parameter) {
    var is_number = isNumeric(tagged_sentence[i][0]);
    // Attempt to parse it as a float
    if (!is_number) {
      is_number = parseFloat(tagged_sentence[i][0]);
    }
    return((parameter === "YES") ? is_number : !is_number);
  }

  // Checks if the current word is a url
  // Adapted from the original Javascript Brill tagger
  function current_word_is_url(tagged_sentence, i, parameter) {
    var is_url = false;
    if (tagged_sentence[i][0].indexOf(".") > -1) {
      // url if there are two contiguous alpha characters
      if (/[a-zA-Z]{2}/.test(tagged_sentence[i][0])) {
        is_url = true; 
      }
    }
    return((parameter === "YES") ? is_url : !is_url);
  }

  function prev_word_is(tagged_sentence, i, parameter) {
    return(tagged_sentence[i][0].toLowerCase() === parameter.toLowerCase());
  }

  // Indicates whether or not this string ends with the specified string.
  // Adapted from the original Javascript Brill tagger
  function current_word_ends_with(tagged_sentence, i, parameter) {
    var word = tagged_sentence[i][0];
    if (!parameter|| parameter.length > word.length) {
      return false;
    }
    return(word.indexOf(parameter) === (word.length - parameter.length));
  }

  function next_tag_is(tagged_sentence, i, parameter) {
    if (i < tagged_sentence.length - 1) {
      return(tagged_sentence[i+1][1] === parameter);
    }
    else {
      return(false);
    }
  }

  function next_word_is_cap(tagged_sentence, i, parameter) {
    if (i < tagged_sentence.length - 1) {
      var next_word = tagged_sentence[i+1][0];
      return(next_word[0] === next_word[0].toUpperCase());
    }
    else {
      return(false);
    }
  }

  function prev_1_or_2_or_3_tag(tagged_sentence, i, parameter) {
    var prev_1 = null;
    if (i > 0) {
      prev_1 = tagged_sentence[i-1][1];
    }
    var prev_2 = null;
    if (i > 1) {
      prev_2 = tagged_sentence[i-2][1];
    }
    var prev_3 = null;
    if (i > 2) {
      prev_3 = tagged_sentence[i-2][1];
    }
    return((prev_1 === parameter) || (prev_2 === parameter) || (prev_3 === parameter));
  }

  function prev_1_or_2_tag(tagged_sentence, i, parameter) {
    var prev_1 = null;
    if (i > 0) {
      prev_1 = tagged_sentence[i-1][1];
    }
    var prev_2 = null;
    if (i > 1) {
      prev_2 = tagged_sentence[i-2][1];
    }
    return((prev_1 === parameter) || (prev_2 === parameter));
  }

  function next_word_is_tag(tagged_sentence, i, parameter) {
    var next_tag = null;
    if (i < tagged_sentence.length - 1) {
      next_tag = tagged_sentence[i+1][1];
    }
    return(next_tag === parameter);
  }

  function prev_tag_is(tagged_sentence, i, parameter) {
    var prev = null;
    if (i > 0) {
      prev = tagged_sentence[i-1][1];
    }
    return(prev === parameter);
  }

  function current_word_is_tag(tagged_sentence, i, parameter) {
    return(tagged_sentence[i][0] === parameter);
  }

  function prev_word_is_cap(tagged_sentence, i, parameter) {
    var prev_word = null;
    if (i > 0) {
      prev_word = tagged_sentence[i-1][0];
      return(prev_word[0] === prev_word[0].toUpperCase());
    }
    return(false);
  }

  function current_word_is_cap(tagged_sentence, i, parameter) {
    var current_word = tagged_sentence[i][0];
    return(current_word[0] === current_word[0].toUpperCase());
  }
  
  function default_transformation_rule(tagged_sentence, i, parameter) {
    return(false);
  }
  
  var predicates = {
    "NEXT-TAG": next_tag_is,
    "NEXT-WORD-IS-CAP": next_word_is_cap,
    "PREV-1-OR-2-OR-3-TAG": prev_1_or_2_or_3_tag,
    "PREV-1-OR-2-TAG": prev_1_or_2_tag,
    "NEXT-WORD-IS-TAG": next_word_is_tag,
    "PREV-TAG": prev_tag_is,
    "CURRENT-WORD-IS-TAG": current_word_is_tag,
    "PREV-WORD-IS-CAP": prev_word_is_cap,
    "CURRENT-WORD-IS-CAP": current_word_is_cap,
    "CURRENT-WORD-IS-NUMBER": current_word_is_number,
    "CURRENT-WORD-IS-URL": current_word_is_url,
    "CURRENT-WORD-ENDS-WITH": current_word_ends_with,
    "PREV-WORD-IS": prev_word_is
  };

  var category_wild_card = "*";

  function TransformationRule(c1, c2, predicate, parameter) {
    this.literal = [c1, c2, predicate, parameter];
    this.predicate = predicates[predicate];
    if (!this.predicate) {
      this.predicate = default_transformation_rule;
    }
    console.log("X" + predicate + "X");
    console.log(this.predicate);
    this.parameter = parameter;
    this.old_category = c1;
    this.new_category = c2;
  }

  TransformationRule.prototype.apply = function(tagged_sentence, position) {
    if ((tagged_sentence[position][1] === this.old_category) ||
        (this.old_category === category_wild_card)) {
      if (this.predicate(tagged_sentence, position, this.parameter)) {
        tagged_sentence[position][1] = this.new_category;
      }
    }
  };
}

transformation_rules = rules: (S transformation_rule S) +
{
  var result = [];

  for (var i =0; i < rules.length; i++) {
    result.push(rules[i][1]);
  }
  return(result);
}

transformation_rule = c1: category1 c2: category2 pred: predicate par1: parameter par2: parameter ?
{
  // Construct rule
  var result = new TransformationRule(c1, c2, pred, par1);
  return(result);
}

category1 = wild_card / identifier

category2 = identifier

predicate = identifier

parameter = identifier

identifier =
  characters: [a-zA-Z_0-9_\-\.,()]+ S_no_eol
  {
   var s = "";
   for (var i = 0; i < characters.length; i++) {
     s += characters[i];
   }
   return(s);
  }

wild_card = "*" S_no_eol

// Blanks
EOL =
  '\r\n' / '\n' / '\r'
Comment =
  "\/\/" (!EOL .)* (EOL/EOI)
S =
  (' ' / '\t' / EOL / Comment)*
S_no_eol =
  (' ' / '\t' / Comment)*
EOI= 
  !.