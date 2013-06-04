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
angular.module('jed', []).factory 'i18n', ['$window', (w) ->
  return new w.Jed
    domain: "the_domain"
    missing_key_callback: (key) ->
      console.log key
    locale_data:
      "the_domain":
        "":
          domain: "the_domain"
          lang: "en"
          "plural-forms": "nplurals=2; plural=(n != 1);"
        "Repo": [null, "Book", "Books"],
        "Library": [null, "Thing", "Things"],
        "My Repo": [null, "My Book", "My Books"]
]