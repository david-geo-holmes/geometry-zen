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
    cookie.setItem("test1", "\u00E0\u00E8\u00EC\u00F2\u00F9")
    expect(cookie.getItem("test1")).toEqual("àèìòù")
    return

  it "Expiration Date", () ->
    cookie.setItem("test2", "Hello world!", new Date(2020, 5, 12))
    expect(cookie.getItem("test2")).toEqual("Hello world!")
    return

  it "Expiration String", () ->
    cookie.setItem("test4", "Hello world!", "Sun, 06 Nov 2022 21:43:15 GMT")
    expect(cookie.getItem("test4")).toEqual("Hello world!")
    return

  it "Expiration Infinity becomes Fri, 31 Dec 9999 23:59:59 GMT", () ->
    cookie.setItem("test2", "Hello world!", Infinity)
    expect(cookie.getItem("test2")).toEqual("Hello world!")
    return

  it "Expiration Finite", () ->
    cookie.setItem("test6", "Hello world!", 150)
    expect(cookie.getItem("test4")).toEqual("Hello world!")
    return

  it "test3", () ->
    cookie.setItem("test3", "Hello world!", new Date(2027, 2, 3), "/blog")
    expect(cookie.getItem("test3")).toEqual("Hello world!")
    return


  it "test5", () ->
    cookie.setItem("test5", "Hello world!", "Tue, 06 Dec 2022 13:11:07 GMT", "/home")
    expect(cookie.getItem("test4")).toEqual("Hello world!")
    return


  it "test7", () ->
    cookie.setItem("test7", "Hello world!", 245, "/content")
    expect(cookie.getItem("test4")).toEqual("Hello world!")
    return

  it "test8", () ->
    cookie.setItem("test8", "Hello world!", null, null, "example.com")
    expect(cookie.getItem("test4")).toEqual("Hello world!")
    return

  it "test9", () ->
    cookie.setItem("test9", "Hello world!", null, null, null, true)
    expect(cookie.getItem("test4")).toEqual("Hello world!")
    return

  it "unexistingCookie", () ->
    expect(cookie.getItem("unexistingCookie")).toEqual(null)
    return

  it "No arguments", () ->
    expect(cookie.getItem()).toEqual(null)
    return
  return

