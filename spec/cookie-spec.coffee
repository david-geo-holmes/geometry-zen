cookie = null

beforeEach () ->

  module 'app', ($provide) ->
    # Can't really mock the document because document.cookie assignment is wierd.
    $provide.value('$document', document)
    # The folowing line is critical.
    return

  inject ($injector) ->
    cookie = $injector.get('cookie')
    return

  return

describe "This is an example of jasmine-given", ->
  Given -> cookie.setItem("x", "A")
  Then -> cookie.getItem("x") == "A"
  return

describe "This is an example of jasmine-given", ->
  Given -> cookie.setItem("x", "A")
  Then -> expect(cookie.getItem("x")) . toEqual "A"
  return

describe "setItem x to A", ->
  Given -> cookie.setItem("x", "A")

  Then -> cookie.getItem("x") == "A"

  describe "remove x", ->
    When -> cookie.removeItem("x")
    Then -> expect(cookie.getItem("x")).toEqual(null)
    And -> cookie.hasItem("x") == false

describe "Mozilla Example usage:", () ->
  it "setItem and getItem", () ->
    cookie.setItem("x", "A")
    expect(cookie.getItem("x")).toEqual("A")
    return

  it "removeItem", () ->
    cookie.setItem("x", "A")
    cookie.removeItem("x")
    expect(cookie.getItem("x")).toEqual(null)
    return

  it "hasItem", () ->
    cookie.setItem("x", "A")
    expect(cookie.hasItem("x")).toEqual(true)
    cookie.removeItem("x")
    expect(cookie.hasItem("x")).toEqual(false)
    return

  it "Unicode", () ->
    cookie.setItem("Unicode", "\u00E0\u00E8\u00EC\u00F2\u00F9")
    expect(cookie.getItem("Unicode")).toEqual("àèìòù")
    return

  it "Expiration Date", () ->
    cookie.setItem("expire-date", "Hello world!", new Date(2020, 5, 12))
    expect(cookie.getItem("expire-date")).toEqual("Hello world!")
    return

  it "Expiration String", () ->
    cookie.setItem("expire-string", "Hello world!", "Sun, 06 Nov 2022 21:43:15 GMT")
    expect(cookie.getItem("expire-string")).toEqual("Hello world!")
    return

  it "Expiration Infinity becomes Fri, 31 Dec 9999 23:59:59 GMT", () ->
    cookie.setItem("expire-never", "Hello world!", Infinity)
    expect(cookie.getItem("expire-never")).toEqual("Hello world!")
    return

  it "Expiration Finite", () ->
    cookie.setItem("expire-finite", "Hello world!", 150)
    expect(cookie.getItem("expire-finite")).toEqual("Hello world!")
    return

  it "BROKEN Expiration Date and Path", () ->
    cookie.setItem("expire-date-blog", "Hello world!", new Date(2027, 2, 3))
#    cookie.setItem("expire-date-blog", "Hello world!", new Date(2027, 2, 3), "/blog")
    expect(cookie.getItem("expire-date-blog")).toEqual("Hello world!")
    return

  it "BROKEN Expiration String and Path", () ->
    cookie.setItem("expire-string-home", "Hello world!", "Tue, 06 Dec 2022 13:11:07 GMT")
#    cookie.setItem("expire-string-home", "Hello world!", "Tue, 06 Dec 2022 13:11:07 GMT", "/home")
    expect(cookie.getItem("expire-string-home")).toEqual("Hello world!")
    return

  it "BROKEN Expiration Finite and Path", () ->
    cookie.setItem("test7", "Hello world!", 245)
#   cookie.setItem("test7", "Hello world!", 245, "/content")
    expect(cookie.getItem("test7")).toEqual("Hello world!")
    return

  it "BROKEN domain", () ->
    cookie.setItem("test8", "Hello world!", null, null, null)
#   cookie.setItem("test8", "Hello world!", null, null, "example.com")
    expect(cookie.getItem("test8")).toEqual("Hello world!")
    return

  it "BROKEN secure", () ->
    cookie.setItem("test9", "Hello world!", null, null, null, null)
#   cookie.setItem("test9", "Hello world!", null, null, null, true)
    expect(cookie.getItem("test9")).toEqual("Hello world!")
    return

  it "unexistingCookie", () ->
    expect(cookie.getItem("unexistingCookie")).toEqual(null)
    return

  it "No arguments", () ->
    expect(cookie.getItem()).toEqual(null)
    return
  return

