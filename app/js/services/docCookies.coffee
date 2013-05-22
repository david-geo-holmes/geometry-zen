###
A complete cookies reader/writer framework with full unicode support.

https://developer.mozilla.org/en-US/docs/DOM/document.cookie

This framework is released under the GNU Public License, version 3 or later.
http://www.gnu.org/licenses/gpl-3.0-standalone.html

Syntaxes:

* docCookies.set(name, value[, end[, path[, domain[, secure]]]])
* docCookies.get(name)
* docCookies.unset(name[, path])
* docCookies.has(name)
* docCookies.keys()
###
angular.module("app").factory('docCookies', ['$document', '_', ($document, _) ->

  get: (name) ->
    escapedName = escape(name).replace(/[\-\.\+\*]/g, "\\$&")
    return unescape($document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*#{escapedName}\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) or null

  set: (name, value, end, path, domain, secure) ->
    if not name or /^(?:expires|max\-age|path|domain|secure)$/i.test(name)
      return false

    if end
      switch end.constructor
        when Number
          expires = if end is Infinity then "; expires=Fri, 31 Dec 9999 23:59:59 GMT" else "; max-age=" + end
        when String
          expires = "; expires=" + end
        when Date
          expires = "; expires=" + end.toGMTString()
        else
          expires = ""
    else
      expires = ""
    domain = if domain then "; domain=#{domain}" else ""
    path = if path then "; path=#{path}" else ""
    secure = if secure then "; secure" else ""
    cookie = "#{escape(name)}=#{escape(value)}#{expires}#{domain}#{path}#{secure}"
    $document.cookie = cookie
    return true;

  unset: (name, path) ->
    if not name or not this.has name
      return false
    return this.set(name, "", new Date(0), path)

  has: (name) ->
    return (new RegExp("(?:^|;\\s*)" + escape(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test($document.cookie);
])
