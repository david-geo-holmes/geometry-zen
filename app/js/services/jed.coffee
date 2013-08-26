locale_data_multi =
  "messages_3":
    "":
      domain: "messages_3",
      lang: "en",
      "plural-forms": "nplurals=2; plural=(n != 1);"

    "test": [null, "test_1"],
    "test singular": ["test plural", "test_1 singular", "test_1 plural"],
    "context\u0004test": [null, "test_1 context"],
    "context\u0004test singular": ["test context plural", "test_1 context singular", "test_1 context plural"]

  "messages_4":
    "":
      domain: "messages_4",
      lang: "en",
      "plural-forms": "nplurals=2; plural=(n != 1);"

    "test": [null, "test_2"],
    "test singular": ["test plural", "test_2 singular", "test_2 plural"],
    "context\u0004test": [null, "test_2 context"],
    "context\u0004test singular": ["test context plural", "test_2 context singular", "test_2 context plural"]

# This is the Jed shim for AngularJS.
# It's purpose is to create an injectable service
# Maybe should be a service, not a factory?
angular.module('jed', []).factory 'i18n', ['$window', (w) ->
  return new w.Jed
    domain: "the_domain"
    missing_key_callback: (key) -> console.log key
    locale_data:
      "the_domain":
        "":
          domain: "the_domain"
          lang: "en"
          "plural-forms": "nplurals=2; plural=(n != 1);"
        "Create a New Gist": [null, "Create a New Gist"],
        "Create gist": [null, "Create gist"],
        "Gist": [null, "Gist", "Gists"],
        "Gist name": [null, "Gist name"],
        "My Gist": [null, "My Gist", "My Gists"],
        "Great gist names are short and memorable.": [null, "Great gist names are short and memorable."],
        "Initialize this gist with a README.md": [null, "Initialize this gist with a README.md"],
        "This will allow you to clone the gist immediately in GitHub.": [null, "This will allow you to clone the gist immediately in GitHub."],

        "Create a New Repo": [null, "Create a New Repository"],
        "Create repo": [null, "Create repository"],
        "Repo": [null, "Repository", "Repositories"],
        "Repo name": [null, "Repository name"],
        "My Repo": [null, "My Repository", "My Repository"],
        "Great repo names are short and memorable.": [null, "Great repository names are short and memorable."],
        "Initialize this repo with a README.md": [null, "Initialize this repository with a README.md"],
        "This will allow you to clone the repo immediately in GitHub.": [null, "This will allow you to clone the repository immediately in GitHub."],

        "Create a New File": [null, "Create a New File"],
        "Create file": [null, "Create file"],
        "File": [null, "File", "Files"],
        "File name": [null, "File name"],

        "My Space": [null, "My Universe"],

        "icon-gist": [null, "icon-briefcase"],
        "icon-repo": [null, "icon-briefcase"],
        "icon-dir": [null, "icon-book"],
        "icon-file": [null, "icon-file-alt"],
        "icon-question": [null, "icon-question"]
]