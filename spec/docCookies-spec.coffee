docCookies = null

beforeEach () ->

  module 'app', ($provide) ->
    # Can't really mock the document because document.cookie assignment is wierd.
    $provide.value('$document', document)
    # The folowing line is critical.
    return

  inject ($injector) ->
    docCookies = $injector.get('docCookies')
    return

  return

describe "This is an example of jasmine-given", ->
  Given -> docCookies.set("x", "A")
  Then -> docCookies.get("x") == "A"
  return

describe "This is an example of jasmine-given", ->
  Given -> docCookies.set("x", "A")
  Then -> expect(docCookies.get("x")) . toEqual "A"
  return

describe "set x to A", ->
  Given -> docCookies.set("x", "A")

  Then -> docCookies.get("x") == "A"

  describe "remove x", ->
    When -> docCookies.unset("x")
    Then -> expect(docCookies.get("x")).toEqual(null)
    And -> docCookies.has("x") == false

describe "Mozilla Example usage:", () ->
  it "set and get", () ->
    docCookies.set("x", "A")
    expect(docCookies.get("x")).toEqual("A")
    return

  it "unset", () ->
    docCookies.set("x", "A")
    docCookies.unset("x")
    expect(docCookies.get("x")).toEqual(null)
    return

  it "has", () ->
    docCookies.set("x", "A")
    expect(docCookies.has("x")).toEqual(true)
    docCookies.unset("x")
    expect(docCookies.has("x")).toEqual(false)
    return

  it "Unicode", () ->
    docCookies.set("test1", "\u00E0\u00E8\u00EC\u00F2\u00F9")
    expect(docCookies.get("test1")).toEqual("àèìòù")
    return

  it "Expiration Date", () ->
    docCookies.set("test2", "Hello world!", new Date(2020, 5, 12))
    expect(docCookies.get("test2")).toEqual("Hello world!")
    return

  it "Expiration String", () ->
    docCookies.set("test4", "Hello world!", "Sun, 06 Nov 2022 21:43:15 GMT")
    expect(docCookies.get("test4")).toEqual("Hello world!")
    return

  it "Expiration Infinity becomes Fri, 31 Dec 9999 23:59:59 GMT", () ->
    docCookies.set("test2", "Hello world!", Infinity)
    expect(docCookies.get("test2")).toEqual("Hello world!")
    return

  it "Expiration Finite", () ->
    docCookies.set("test6", "Hello world!", 150)
    expect(docCookies.get("test4")).toEqual("Hello world!")
    return

  it "test3", () ->
    docCookies.set("test3", "Hello world!", new Date(2027, 2, 3), "/blog")
    expect(docCookies.get("test3")).toEqual("Hello world!")
    return


  it "test5", () ->
    docCookies.set("test5", "Hello world!", "Tue, 06 Dec 2022 13:11:07 GMT", "/home")
    expect(docCookies.get("test4")).toEqual("Hello world!")
    return


  it "test7", () ->
    docCookies.set("test7", "Hello world!", 245, "/content")
    expect(docCookies.get("test4")).toEqual("Hello world!")
    return

  it "test8", () ->
    docCookies.set("test8", "Hello world!", null, null, "example.com")
    expect(docCookies.get("test4")).toEqual("Hello world!")
    return

  it "test9", () ->
    docCookies.set("test9", "Hello world!", null, null, null, true)
    expect(docCookies.get("test4")).toEqual("Hello world!")
    return

  it "unexistingCookie", () ->
    expect(docCookies.get("unexistingCookie")).toEqual(null)
    return

  it "No arguments", () ->
    expect(docCookies.get()).toEqual(null)
    return
  return

