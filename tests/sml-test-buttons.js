
var sml_test_buttons = (function () {

   function setUpTest(test_id, css_control_width) {
      var i_f = document.getElementById('myIframe');
      const control_width = getComputedStyle(document.documentElement).getPropertyValue(css_control_width);
      i_f.width = control_width;
      i_f.contentWindow.postMessage(test_id, '*');  // NB calls diff_color.refreshCallTest()
   }

   function clearTests() {
      localStorage.setItem('_last_test_id_', 'no_test_yet');
   }


   function check_smallTest() {
      setUpTest('check', '--thin-max-width')  /* iFrame width of 389px and below gives SMALL control    */
   }

   function check_mediumTest() {
      setUpTest('check', '--medium-max-width') /* iFrame width of 390px to 499px gives MEDIUM control    */
   }

   function check_largeTest() {
      setUpTest('check', '--wide-min-width') /* iFrame width of 500px and up gives LARGE control    */
   }


   function a_smallTest() {
      setUpTest('a', '--thin-max-width')  /* iFrame width of 389px and below gives SMALL control    */
   }

   function a_mediumTest() {
      setUpTest('a', '--medium-max-width') /* iFrame width of 390px to 499px gives MEDIUM control    */
   }

   function a_largeTest() {
      setUpTest('a', '--wide-min-width') /* iFrame width of 500px and up gives LARGE control    */
   }


   function b_smallTest() {
      setUpTest('b', '--thin-max-width') /* iFrame width of 389px and below gives SMALL control    */
   }

   function b_mediumTest() {
      setUpTest('b', '--medium-max-width')  /* iFrame width of 390px to 499px gives MEDIUM control    */
   }

   function b_largeTest() {
      setUpTest('b', '--wide-min-width') /* iFrame width of 500px and up gives LARGE control    */
   }


   function c_smallTest() {
      setUpTest('c', '--thin-max-width') /* iFrame width of 389px and below gives SMALL control    */
   }

   function c_mediumTest() {
      setUpTest('c', '--medium-max-width')  /* iFrame width of 390px to 499px gives MEDIUM control    */
   }

   function c_largeTest() {
      setUpTest('c', '--wide-min-width')/* iFrame width of 500px and up gives LARGE control    */
   }


   return {
      clearTests: clearTests,
      setUpTest: setUpTest,
      check_smallTest, check_mediumTest, check_largeTest,
      a_smallTest, a_mediumTest, a_largeTest,
      b_smallTest, b_mediumTest, b_largeTest,
      c_smallTest, c_mediumTest, c_largeTest
   };

})();


sml_test_buttons.clearTests();

if (window.devicePixelRatio == 1) {          
   document.getElementById('zoom-100-percent').style.display='none';
}