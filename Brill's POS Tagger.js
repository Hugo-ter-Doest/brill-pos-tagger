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

var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=UTF-8'
  });
  
  res.end('Hello from Brill\'s POS Tagger.\n');
          
}).listen(9080, "");
