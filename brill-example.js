/*
    Brill's POS Tagger main file
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
var Tagger = require("./lib/brill_pos_tagger");

var base_folder = "/home/hugo/workspace/brill-pos-tagger";
//var base_folder = "/Eclipse Workspace/brill-pos-tagger";
var rules_file = base_folder + "/data/tr_from_pos.txt";
var lexicon_file = base_folder + "/data/lexicon.json";

var tagger = new Tagger(lexicon_file, rules_file, function(error) {
  if (error) {
    console.log(error);
  }
  else {
    var sentence = ["I", "see", "the", "man", "with", "the", "telescope"];
    console.log(JSON.stringify(tagger.tag(sentence)));
  }
});