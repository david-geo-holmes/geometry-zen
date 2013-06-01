TEXT_MARKETING_NAME = 0
TEXT_MARKETING_VERSION = 1
TEXT_MARKETING_TAG_LINE = 2

text = (key) ->
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
angular.module("app").factory 'i18n', [() ->

  marketing:
    name: () -> text(TEXT_MARKETING_NAME)
    version: () -> text(TEXT_MARKETING_VERSION)
    tagLine: () -> text(TEXT_MARKETING_TAG_LINE)
]
