if [[ "$TRAVIS_PULL_REQUEST" == "false" && "$TRAVIS_TEST_RESULT" == "0" ]]; then

  echo -e "Starting to update distribution folder...\n"
  # configure Git to commit as Travis
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis"

  cd $HOME

  # clone davinci
  git clone --quiet https://${GH_TOKEN}@github.com/geometryzen/davinci.git      davinci      # > /dev/null
  # clone davinci-dist
  git clone --quiet https://${GH_TOKEN}@github.com/geometryzen/davinci-dist.git davinci-dist # > /dev/null
  
  # compare tags
  cd $HOME
  cd davinci
  git tag > ../tags-davinci

  cd $HOME
  cd davinci-dist
  git tag > ../tags-davinci-dist
  cd ..
  
  # compare two files per line.
  # -F, --fixed-strings
  #              Interpret PATTERN as a list of fixed strings, separated by newlines, any of which is to be matched.
  # -x, --line-regexp
  #              Select only those matches that exactly match the whole line.
  # -v, --invert-match
  #              Invert the sense of matching, to select non-matching lines.
  # -f FILE, --file=FILE
  #              Obtain patterns from FILE, one per line. The empty file contains zero patterns, and therefore matches nothing.
  grep -Fxvf tags-davinci-dist tags-davinci > new-tags
  
  for TAG in $(cut -d, -f2 < new-tags)
  do
    echo "Found new tag: $TAG"
    # we have a new tag
    export NEWTAG=true
    # build davinci at this tag
    cd $HOME/davinci
    git checkout tags/$TAG
    ./davinci.py dist -u
    # create zip and tarbals
    cd dist
    tar -czf davinci-latest.tar.gz *.js
    zip davinci-latest.zip *.js
    mkdir -p ../doc/static/dist
    mv *.zip ../doc/static/dist/
    mv *.tar.gz ../doc/static/dist/
    # update davinci for the site.
    cp davinci.min.js ../doc/static/
    cp davinci-stdlib.js ../doc/static/
    cp *.js ../../davinci-dist/
    cd ..
    cp bower.json ../davinci-dist
    cp .bowerrc ../davinci-dist
    # put the new version in the dist repository
    cd ../davinci-dist
    git add .
    git commit -m "DaVinci version: $TAG"
    git tag $TAG
    git push -fq --tags origin master > /dev/null
  done

  # reset davinci-dist repository to HEAD just to be sure
  cd $HOME
  cd davinci-dist
  git reset HEAD --hard
  cd $HOME

  # build DaVinci
  cd davinci
  git reset HEAD --hard
  ./davinci.py dist -u
  cd dist
  cp *.js ../../davinci-dist/

  cd ..
  cp bower.json ../davinci-dist
  cp .bowerrc ../davinci-dist

  # add, commit and push files to the distribution repository
  cd ../davinci-dist
  git add .
  git commit -m "Travis build $TRAVIS_BUILD_NUMBER pushed"
  git push -fq origin master > /dev/null

  echo -e "Done magic with coverage\n"
else
  echo -e "Not updating distribution folder because TRAVIS_PULL_REQUEST = $TRAVIS_PULL_REQUEST and TRAVIS_TEST_RESULT = $TRAVIS_TEST_RESULT"
fi
