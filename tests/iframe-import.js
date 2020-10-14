



var iframe_import = (function () {

  function loadScript(file_name) {
    var new_js = document.createElement("script");
    new_js.async = false;
    new_js.src = file_name; 
    var first_js = document.getElementsByTagName('script')[0];
    first_js.parentNode.insertBefore(new_js, first_js);
  }

  function includeTest(test_number) {
    loadScript("tests/" + test_number + "-tests/" + test_number + "-snapshot-large.js");
    loadScript("tests/" + test_number + "-tests/" + test_number + "-snapshot-medium.js");
    loadScript("tests/" + test_number + "-tests/" + test_number + "-snapshot-small.js");
    loadScript("tests/" + test_number + "-tests/" + test_number + "-snapshot-src.js");
  }

  function runTests(get_url) {
    loadScript("lib/kpdecker-jsdiff.js");
    loadScript("tests/style-values.js");

    includeTest('check');

    includeTest('a');
    includeTest('b');
    includeTest('c');

    loadScript("tests/diff-color.js");  // NB must be after tests are all declared

    window.onmessage = function (event) {
      diff_color.refreshCallTest(event.data);
    };
  }

  return {
    runTests: runTests
  };

})();


if (HTML_FUNCTIONS.pageInIframe()) {          
   document.getElementById('link-to-tests').style.display='none';
   iframe_import.runTests();                   
}



