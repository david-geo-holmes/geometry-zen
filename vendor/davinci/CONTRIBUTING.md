# Contributing to DaVinci

## How to accept a pull request and update the version.

1. Pull the latest code into your local repository.

   ```
   git pull origin master
   ```

2. Verify that the project builds, passes all tests, and update the build artifacts.

   ```
   ./m dist -u
   ```

3. Update the version number in bower.json

4. Verify again that the project builds, passes all tests, and update the build artifacts.

   ```
   ./m dist -u
   ```

4. Add the changed files.

   ```
   git add --all
   ```

5. Commit the change.

   ```
   git commit -m 'Changes for ...'
   ```

6. Tag the commit.

   ```
   git tag -a x.y.z -m 'davinci version x.y.z'
   ```

6. Push the changes, along with the tag.

   ```
   git push origin master --tags
   ```

## Using the Jasmine testing framework.

This framework is used to perform unit testing on the exported DaVinci APIs.

You should make sure that these tests run cleanly in addition to the Python suite tests.

You will need three terminals open as you develop.

Open the terminal where you submit your DaVinci build and test commands.

Update the Lineman dependencies for the DaVinci project (You will only need to do this once and update periodically):

```sh
$ npm install
```

Clean the DaVinci project (This is optional):

```sh
$ lineman clean
```

Build the DaVinci distribution:

```sh
$ ./skulpt.py dist -u
```

Open another terminal which will be used to watch the Jasmine test specifications.

Run Lineman so that it watches for changes to the test source:

```sh
$ lineman run
```

This terminal is now commited to watching the test source. Leave it running on your desktop.

Open another terminal which will be used to run the Jasmine framework.

Run the Jasmine specification testing framework:

```sh
$ lineman spec
```

The framework should open a browser at localhost:7357/3856 showing the results of the test specifications.

Leave the browser window open. Leave all the terminal windows open.

The tests should all be passing. Notice that the specification window has the options [Press ENTER to run tests; q to quit]. You should not need to press ENTER because the source code for the tests is being monitored.

Make your changes to the DaVinci product code and re-build the DaVinci distribution:

```sh
$ ./skulpt.py dist -u
```

The test results in the browser should alternate from green to red to green as the DaVinci output is deleted and rebuilt.

Update the test specifications in the `spec/` folder.

The specification runner should automatically track specification changes and update the results window.

If you want to change the browser used for testing, you must update the launcher in `config/spec.json`.
Your launcher options are `IE7`, `IE8`, `IE9`, `Firefox`, `Chrome`, and `PhantomJS`.

If you would like to run the Jasmine test headless (not a conventional browser) then you must install PhantomJS:

```sh
$ sudo apt-get install phantomjs
```

You can verify the installation with:

```sh
$ phantomjs --version
```

Once you have PhantomJS installed, you may run the tests in headless mode:

```sh
$ lineman spec-ci
```

Note: You can get more information on Lineman operation by adding the `--verbose` option to Lineman commands.
