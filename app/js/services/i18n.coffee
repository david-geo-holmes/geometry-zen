TEXT_MARKETING_NAME = 0
TEXT_MARKETING_VERSION = 1
TEXT_MARKETING_TAG_LINE = 2

text = (key, $locale) ->
  switch key
    when TEXT_MARKETING_VERSION
      return "Hydrogen" # Hydrogen
    when TEXT_MARKETING_NAME
      return "Geometry Zen"
    when TEXT_MARKETING_TAG_LINE
      return "Looking at the multiverse from a Geometric Algebra perspective"
    else
      throw new Error("Unknown key #{key}")



###
 Internationalization (I18N)

 This module is used for performing lookups based upon universally understood symbolic constants.
 The implementation is probably quite naive and we should not be reinventing the wheel, which no doubt exists.
 However, this gives us a start on abstracting out the commonly used marketing terms.
 At some point in the future it should be injected with a locale context.

###
angular.module("app").factory 'i18n', ['$locale', ($locale) ->

  i18n = new Jed({
    domain: "the_domain"
    missing_key_callback: (key) ->
      console.error(key)
    locale_data:
      the_domain:
        "":
          domain: "the_domain"
          lang: "en"
          plural_forms: "nplurals=2; plural=(n != 1);"
        "a key": [null, "the translation", "the plural translations"]
        "%d key": [null, "%d key", "%d keys"]
        
        # Contexts are keys that are just prefixed with a context string
        # with a unicode \u0004 as the delimiter.
        # You can use it for anything. Usually it's just for being content aware
        # in some way (e.g. male vs. female, product vs. category)
        "context\u0004%d key": [null, "context %d key", "context %d keys"]


  });
  # $locale has an id property which resolves to something like "en[-us]" (alguage code and optional country code).
  # It also provides configuration data for that locale.
  # AngularJS appears to be stronger at localization and weaker at i18n.
  # Angular exposes this through directives such as ngPluralize.
  # console.log JSON.stringify($locale, null, 2)

  marketing:
    name: () -> text(TEXT_MARKETING_NAME, $locale)
    version: () -> text(TEXT_MARKETING_VERSION, $locale)
    tagLine: () -> text(TEXT_MARKETING_TAG_LINE, $locale)
]
