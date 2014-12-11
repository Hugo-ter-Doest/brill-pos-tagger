/*
    Brill's POS Tagger
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

var fs = require("fs");

var TF_Parser = require("./TF_Parser");

//var base_folder = "home/hugo/workspace/Brill's POS Tagger";
var base_folder = "/Eclipse Workspace/brill-pos-tagger";
var transformation_rules_file = base_folder + "/data/transformation_rules.txt";
var lexicon_file = base_folder + "/data/lexicon.txt";

// Tags a sentence, sentence is an array of words
// Returns an array of tagged words; a tagged words is an array consisting of
// the word itself followed by its lexical category
Brill_POS_Tagger.prototype.tag = function(words) {
  var result = new Array(words.length);
  
  // Initialise result
  for (var i = 0, size = words.length; i < size; i++) {
    var ss = this.lexicon[words[i]];
    if (!ss) {
      ss = this.lexicon[words[i].toLowerCase()];
    }
    if (!ss && (words[i].length === 1)) {
      result[i] = words[i] + "^";
    }
    // We need to catch scenarios where we pass things on the prototype
    // that aren't in the lexicon: "constructor" breaks this otherwise
    if (!ss || typeof ss === "function") {
      result[i] = "NN";
    }
    else {
      result[i] = ss[0];
    }
  }
  // Apply transformation rules
  for (var i = 0, size = words.length; i < size; i++) {
    this.rules.forEach(function(rule) {
      result[i] = rule.apply(sentence, i);
    });
  }
  return(result);
};

Brill_POS_Tagger.prototype.read_lexicon = function(callback) {
  var that = this;
  
  // Read lexicon
  fs.readFile(lexicon_file, 'utf8', function (error, data) {
    if (error) {
      callback(error);
    }
    else {
      that.lexicon = JSON.parse(data);
      callback();
    }
  });
};

Brill_POS_Tagger.prototype.read_transformation_rules = function(callback) {
  var that = this;

  // Read transformation rules
  fs.readFile(transformation_rules_file, 'utf8', function (err, data) {
    if (err) {
      callback(err);
    }
    else {
      that.transformation_rules = TF_Parse.parse(data);
      callback();
    }
  });
};

function Brill_POS_Tagger(callback) {
  this.read_lexicon(function(error) {
    if (error) {
      callback(error);
    }
    else {
      this.read_transformation_rules(function(error) {
        if (error) {
          callback(error);
        }
        else {
          callback()
        }
      });
    }
  });
}

module.exports = Brill_POS_Tagger;