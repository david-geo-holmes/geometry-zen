# geometry-zen

Geometry Zen is an online application for learning and researching Physics and Engineering using Geometric Algebra with Python programming and WebGL.

## Install and Development

```sh
  $ git clone git://github.com/david-geo-holmes/geometry-zen.git
  $ cd geometry-zen
  $ npm install -g lineman (if you don't already have lineman installed)
  $ npm install
  $ lineman run --force
  $ open your web browser to localhost:8000
```
### On the server
_(Coming soon)_

### In the browser
Geometry Zen is a single-page application that is run in a web browser.

A WebGL-compliant browser such as Chrome is recommended.

## Production

```sh
  $ lineman clean
  
  $ lineman build
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
_(Coming soon)_

## Release History
_(Nothing yet)_

## Developer Notes

### Lineman Primer
```sh
  $ npm install -g lineman (sudo)

  $ lineman new <project name>

  $ cd <project name>

  $ lineman run

  $ lineman build

  $ lineman clean

  $ lineman spec
```
### Lineman Features

* local development server
* compiles CoffeeScript
* compiles Sass and Less
* tools to stub out back-end services with express
* compiles JS templates to window.JST
* proxy XHR
* Testem
* Heroku deploy
* dist
* CI

## Tests

```sh
  $ lineman spec
```


## License
(The MIT License)

Copyright (c) 2013 David Holmes < [david.geo.holmes@gmail.com](mailto:david.geo.holmes@gmail.com) >

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.