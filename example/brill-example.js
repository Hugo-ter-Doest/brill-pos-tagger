/*
    Example Brill's POS Tagger
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

var Tagger = require("../index");

var base_folder = "/home/hugo/Workspace/brill-pos-tagger";
//var base_folder = "/Eclipse Workspace/brill-pos-tagger";
var en_rules_file = base_folder + "/data/English/tr_from_posjs.txt";
var en_lexicon_file = base_folder + "/data/English/lexicon_from_posjs.json";
var en_ex_sentence = ["I", "see", "the", "man", "with", "the", "telescope"];

var du_rules_file = base_folder + "/data/Dutch/brill_CONTEXTRULES.jg";
var du_lexicon_file = base_folder + "/data/Dutch/brill_LEXICON.jg";
var du_ex_sentence = ["ik", "zie", "de", "man", "met", "de", "verrekijker"];

var tagger = new Tagger(en_lexicon_file, en_rules_file, function(error) {
  if (error) {
    console.log(error);
  }
  else {
    console.log(JSON.stringify(tagger.tag(en_ex_sentence)));
  }
});

/*
tagger = new Tagger(du_lexicon_file, du_rules_file, function(error) {
  if (error) {
    console.log(error);
  }
  else {
    console.log(JSON.stringify(tagger.tag(du_ex_sentence)));
  }
});
*/
