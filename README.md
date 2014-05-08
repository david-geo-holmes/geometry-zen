# geometry-zen

Geometric Physics is an online application for learning and researching Physics and Engineering using Geometric Algebra
with Python programming and WebGL.

Geometric Physics consists of a Single Page Application (SPA) served up by a companion Node.JS server. The purpose of the
server is to provide some extra flexibility over a CDN solution, circumvent CORS issues and overcome some security
challenges.

## Installation

You will need to have Node, Lineman and Bower installed.

```sh
$ git clone git://github.com/geometryzen/geometryzen.git
$ cd geometryzen
$ npm install
$ bower update
```

## Configuration

1. Copy config.example.json to config.local.json

```sh
$ cp config.example.json config.local.json
```

2. Adjust config.local.json

```js
{
  "HOST": "localhost",
  "PORT": 8080,
  "GITHUB_APPLICATION_CLIENT_ID": "???",
  "GITHUB_APPLICATION_CLIENT_SECRET": "???",
  "GITHUB_HOST": "github.com",
  "GITHUB_PORT": 443,
  "GITHUB_PATH": "/login/oauth/access_token",
  "GITHUB_METHOD": "POST"
}
```

You can also set environment variables to override the settings if you don't want Git to track your adjusted config.json file. Just use UPPER_CASE keys.

## Execution

The purpose of running Lineman is to watch and rebuild the server.

```sh
$ lineman clean
$ lineman build
$ lineman run --force
```
At this point, Lineman is actually running a server on port 8000, but we use a Node.JS server.

In a new terminal window, 

```sh
$ npm start
```
Open your web browser to localhost:8080. GeometryZen should now be running.

## License
_(The MIT License)_

Copyright (c) 2013 David Holmes < [david.geo.holmes@gmail.com](mailto:david.geo.holmes@gmail.com) >

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the 'Software'), to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of
the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
