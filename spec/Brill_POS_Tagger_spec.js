/*
    Unit test for Brill's POS Tagger: test against the pos module
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

var fs = require('fs');
var natural = require('natural');
var pos = require('pos');
var Brill_POS_Tagger = require('../index');

var base_folder = "/home/hugo/Workspace/brill-pos-tagger";
//var base_folder = "/Eclipse Workspace/brill-pos-tagger";
var en_rules_file = base_folder + "/data/English/tr_from_posjs.txt";
var en_lexicon_file = base_folder + "/data/English/lexicon_from_posjs.json";
var en_ex_sentences = [["I", "see", "the", "man", "with", "the", "telescope"],
                       ["The", "run", "lasted", "thirty", "minutes"],
                       ["We", "run", "three", "miles", "every", "day"],
                       ["He", "will", "race", "the", "car"],
                       ["He", "will", "not", "race", "the", "car"],
                       ["When", "will", "the", "race", "end"]
                      ];
                      
var en_ex_nyt_article = base_folder + "/data/English/NYT-20150205-picassos-granddaughter-plans-to-sell-art-worrying-the-market.txt";              

var du_rules_file = base_folder + "/data/Dutch/brill_CONTEXTRULES.jg";
var du_lexicon_file = base_folder + "/data/Dutch/brill_LEXICON.jg";
var du_ex_sentence = ["ik", "zie", "de", "man", "met", "de", "verrekijker"];

describe('Brill\'s POS Tagger', function() {
  var old_brill_tagger = new pos.Tagger();
  var brill_pos_tagger;
  it('should initialise correctly', function(done) {
    brill_pos_tagger = new Brill_POS_Tagger(en_lexicon_file, en_rules_file, function(error) {
      done();
    });
  });

  en_ex_sentences.forEach(function(en_ex_sentence) {
    it('should process tag sentences just like the old pos module', function() {
      var taggedWords_expected = old_brill_tagger.tag(en_ex_sentence);
      var taggedWords = brill_pos_tagger.tag(en_ex_sentence);
      expect(taggedWords).toEqual(taggedWords_expected);
    });
  });

  var sentences;
  it('should correctly read a NYT article about Picasso', function(done) {
    fs.readFile(en_ex_nyt_article, 'utf8', function (error, text) {
      sentences = text.split('\n');
      done();
    });
  });
  var tokenizer = new natural.WordTokenizer();

  it('should process tag sentences just like the old pos module', function() {
    sentences.forEach(function(sentence){
    var tokenized_sentence = tokenizer.tokenize(sentence);
      var taggedWords_expected = old_brill_tagger.tag(tokenized_sentence);
      var taggedWords = brill_pos_tagger.tag(tokenized_sentence);
      expect(taggedWords).toEqual(taggedWords_expected);
      console.log(taggedWords)
    });
  });
});
