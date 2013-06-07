(
  function($window, $document, $tagName, $analyticsJsURL, $gbl, $newNode, $refNode) {
    
    // Not sure why we do this, maybe as a means of indirection?
    $window['GoogleAnalyticsObject'] = $gbl;

    // Initialize the global object once.
    // Make sure the global object has a "q" property initialized with the arguments to this function.
    // Also make sure that the global has an "l" property containing the time this was initialized.
    $window[$gbl] = $window[$gbl] || function() { ($window[$gbl].q=$window[$gbl].q||[]).push(arguments) }, $window[$gbl].l=1*new Date();

    // Munge the HTML by inserting the Google Analytics script before any other that is defined.
    // Execute the script asynchronously as soon as it is available (even before page has been parsed).
    $newNode=$document.createElement($tagName), $refNode=$document.getElementsByTagName($tagName)[0];
    $newNode.async=1;
    $newNode.src=$analyticsJsURL;
    $refNode.parentNode.insertBefore($newNode,$refNode)
  }
)(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
