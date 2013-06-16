# geometry-zen

Geometry Zen is an online application for learning and researching Physics and Engineering using Geometric Algebra with Python programming and WebGL.

Geometry Zen consists of a Single Page Application (SPA) served up by a companion Node.JS server. The purpose of the server
is to provide some extra flexibility over a CDN solution, circumvent CORS issues and overcome some security challenges.

[security-related limitations](http://blog.vjeux.com/2012/javascript/github-oauth-login-browser-side.html), Github prevents you from implementing the OAuth Web Application Flow on a client-side only application.

## API

```
GET http://localhost:8080/authenticate/TEMPORARY_CODE
```

## OAuth Steps

Also see the [documentation on Github](http://developer.github.com/v3/oauth/).

1. Redirect users to request GitHub access.

   ```
   GET https://github.com/login/oauth/authorize
   ```

2. GitHub redirects back to your site including a temporary code you need for the next step.

   You can grab it like so:
   
   ```js
   var code = window.location.href.match(/\?code=(.*)/)[1];
   ```
   
3. Request the actual token using your instance of Gatekeeper, which knows your `client_secret`.
   
   ```js
   $.getJSON('http://localhost:8080/authenticate/'+code, function(data) {
     console.log(data.token);
   });
   ```

## Installation

```sh
  $ git clone git://github.com/geometryzen/geometryzen.git
  $ cd geometryzen
  $ sudo npm install -g lineman (if you don't already have lineman installed)
  $ npm install
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

## Execution (Using Lineman)

   The purpose of running Lineman is to watch and rebuild the server.
   Lineman is not the the best server to use for development.

```sh
  $ lineman run --force
  $ open your web browser to localhost:8000
```
   With Lineman, the following functionality will not work:
   * the icons will not be displayed correctly.

## Execution (Using Node)

```
$ node server.js
```

## Deploy on Heroku

1. Create a new Heroku app
   
   ```
   cake heroku:create
   ```

2. Rename it (optional)
   
   ```
   heroku apps:rename NEW_NAME
   ```

3. Provide OAUTH_CLIENT_ID and OAUTH_CLIENT_SECRET:

   ```
   cake -c OAUTH_CLIENT_ID -s OAUTH_CLIENT_SECRET heroku:config
   ```

4. Push changes to heroku

   ```
   cake heroku:push
   ```

### On the server
_(Coming soon)_

### In the browser
Geometry Zen is a single-page application that is run in a web browser.

A WebGL-compliant browser such as Chrome is recommended.

## Development

```sh
  $ lineman clean

  $ lineman build

  $ lineman run
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