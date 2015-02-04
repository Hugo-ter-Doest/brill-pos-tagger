/*
    Predicates for the Brill tagger
    Copyright (C) 2014 Hugo W.L. ter Doest

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.setLevel('ERROR');

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
};

function prev_word_is(tagged_sentence, i, parameter) {
  if (i > 0) {
    return(tagged_sentence[i-1][0].toLowerCase() === parameter.toLowerCase());
  }
  else {
    return(false);
  }
};

// Indicates whether or not this string ends with the specified string.
// Adapted from the original Javascript Brill tagger
function current_word_ends_with(tagged_sentence, i, parameter) {
  var word = tagged_sentence[i][0];
  if (!parameter || (parameter.length > word.length)) {
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

function default_transformation_rule (tagged_sentence, i, parameter) {
  return(false);
}

function Predicate(name, parameter1, parameter2) {
  this.name = name;
  this.parameter1 = parameter1;
  if (parameter2) {
    this.parameter2 = parameter2;
  }
  this.function = predicates[name];
  if (!this.function) {
    this.predicate = default_transformation_rule;
  }
  logger.debug(this.name);
  logger.debug(this.function);
}

Predicate.prototype.evaluate = function(tagged_sentence, position) {
  return(this.function(tagged_sentence, position, this.parameter1, this.parameter2));
};

module.exports = Predicate;