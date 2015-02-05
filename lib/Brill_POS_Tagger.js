/*
    Brill's POS Tagger
    Copyright (C) 2015 Hugo W.L. ter Doest

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
logger.setLevel('DEBUG');

var fs = require("fs");

var TF_Parser = require('./TF_Parser');

// Tags a sentence, sentence is an array of words
// Returns an array of tagged words; a tagged words is an array consisting of
// the word itself followed by its lexical category
Brill_POS_Tagger.prototype.tag = function(sentence) {
  var tagged_sentence = new Array(sentence.length);
  
  // Initialise result
  for (var i = 0, size = sentence.length; i < size; i++) {
    var ss = this.lexicon[sentence[i]];
    if (!ss) {
      ss = this.lexicon[sentence[i].toLowerCase()];
    }
    tagged_sentence[i] = [];
    tagged_sentence[i][0] = sentence[i];
    if (!ss) { // If not found in the lexicon default to NN
      tagged_sentence[i][1] = "NN";
    }
    else {
      tagged_sentence[i][1] = ss[0];
    }
  }
  // Apply transformation rules
  for (var i = 0, size = sentence.length; i < size; i++) {
    this.transformation_rules.forEach(function(rule) {
      rule.apply(tagged_sentence, i);
    });
  }
  return(tagged_sentence);
};

Brill_POS_Tagger.prototype.parse_lexicon = function(data) {
  var that = this;
  // Split into an array of non-empty lines
  arrayOfLines = data.match(/[^\r\n]+/g);
  this.lexicon = {};
  arrayOfLines.forEach(function(line) {
    // Split line by whitespace
    var elements = line.split(/\s+/);
    if (elements.length > 0) {
      that.lexicon[elements[0]] = elements.unshift();
    }
  });
};

Brill_POS_Tagger.prototype.read_lexicon = function(lexicon_file,callback) {
  var that = this;
  
  // Read lexicon
  fs.readFile(lexicon_file, 'utf8', function (error, data) {
    if (error) {
      callback(error);
    }
    else {
      if (data[0] === "{") {
        that.lexicon = JSON.parse(data);
        callback();
      }
      else {
        that.parse_lexicon(data)
        callback();
      }
    }
  });
};

Brill_POS_Tagger.prototype.read_transformation_rules = function(rules_file, callback) {
  var that = this;

  // Read transformation rules
  fs.readFile(rules_file, 'utf8', function (err, data) {
    if (err) {
      callback(err);
    }
    else {
      that.transformation_rules = TF_Parser.parse(data);
      logger.debug(that.transformation_rules);
      callback();
    }
  });
};

function Brill_POS_Tagger(lexicon_file, rules_file, callback) {
  var that = this;
  this.read_lexicon(lexicon_file, function(error) {
    if (error) {
      callback(error);
    }
    else {
      that.read_transformation_rules(rules_file, function(error) {
        if (error) {
          callback(error);
        }
        else {
          callback();
        }
      });
    }
  });
}

module.exports = Brill_POS_Tagger;