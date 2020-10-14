
var diff_color = (function () {

  function nl2br(str) {
    return str.replace(/(?:\r\n|\r|\n)/g, '<br>');
  }

  function startSameText(string_a, string_b, first_difference) {
    let previous_1_newline = first_difference;
    const max_length = 10000;
    let max_1 = max_length;
    while (previous_1_newline > 0 && string_a[previous_1_newline] != "\n" && max_1 > 0) {
      previous_1_newline--;
      max_1--;
    }
    if (previous_1_newline > 1) {
      var previous_2_newline = previous_1_newline - 1;
      let max_2 = max_length;
      while (previous_2_newline > 0 && string_a[previous_2_newline] != "\n" && max_2 > 0) {
        previous_2_newline--;
        max_2--;
      }
    } else {
      previous_2_newline = 0;
    }
    return previous_2_newline;
  }

  function endSameText(string_a, string_b, first_difference) {
    const a_len = string_a.length;
    const b_len = string_b.length;
    let next_newline_a = first_difference;
    while (next_newline_a < a_len && string_a[next_newline_a] != "\n") {
      next_newline_a++;
    }
    let next_newline_b = first_difference;
    while (next_newline_b < b_len && string_b[next_newline_b] != "\n") {
      next_newline_b++;
    }
    while (string_a[next_newline_a] == string_b[next_newline_b]) {
      next_newline_a--;
      next_newline_b--;
    }
    return [next_newline_a, next_newline_b];
  }

  function scanForDiff(string_a, string_b) {
    let first_difference = 0;
    while (string_a[first_difference] == string_b[first_difference]) {
      first_difference++;
    }
    const previous_2_newline = startSameText(string_a, string_b, first_difference);
    const [next_newline_a, next_newline_b] = endSameText(string_a, string_b, first_difference);
    const start_same = string_a.slice(previous_2_newline, first_difference)
    const difference_line_a = string_a.slice(first_difference, next_newline_a + 10)
    const difference_line_b = string_b.slice(first_difference, next_newline_b + 10)
    const change_vector = [start_same, difference_line_a, difference_line_b]
    return change_vector;
  }

  function redGreenDiff(string_1, string_2) {
    const js_diff = JsDiff.diffChars(string_1, string_2);
    let same_line = '';
    js_diff.map(diff_part => {
      const diff_color = diff_part.added ? 'color:green' : diff_part.removed ? 'color:red' : 'color:black';
      const diff_bold = diff_part.added ? 'font-weight:bold' : diff_part.removed ? 'font-weight:bold' : 'font-weight:normal';
      same_line = same_line + `<span style="${diff_color}; ${diff_bold}">${diff_part.value}</span>`;
    })
    return same_line;
  }

  function showDifferences(string_a, string_b) {
    let [start_same, difference_line_a, difference_line_b] = scanForDiff(string_a, string_b);
    let same_line = nl2br(start_same) + "";
    let actual_expected_lines = `<div style='font-family: "Lucida Console", Courier, monospace;'>
                                    <br> &nbsp;&nbsp;actual ${difference_line_a} 
                                    <br> expected ${difference_line_b} 
                               </div>`;
    return same_line + redGreenDiff(difference_line_a, difference_line_b) + actual_expected_lines;
  }

  function passAppendDocument(test_number) {
    var end_element = document.createElement("div");
    end_element.innerHTML = `<div style='color:green' > ${test_number} </div>`;
    document.body.appendChild(end_element);
  }

  function failAppendDocument(test_number, test_text_styles) {
    var end_element = document.createElement("div");
    end_element.innerHTML = `<hr><div style='color:red' > ${test_number} </div> ${test_text_styles} `;
    document.body.appendChild(end_element);
  }

  function windowWidthSML(inner_width) {
    const a_small_control = getComputedStyle(document.documentElement).getPropertyValue('--thin-control-width');
    const a_medium_control = getComputedStyle(document.documentElement).getPropertyValue('--wide-control-width');
    if (inner_width <= a_small_control) {             /* 330px wide control */
      return 'small';
    } else if (inner_width < a_medium_control) {
      return 'medium';            /* 390px wide control */
    } else {
      return 'large'              /* 500px wide control */
    }
  }

  function containerSize() {
    const the_size = diff_color.getSmallMediumLargeWidth('#rx-label-container');
    return the_size;
  }

  function getSmallMediumLargeWidth(container_id) {
    const an_elem = document.querySelector(container_id);
    const container_width_str = getComputedStyle(an_elem).getPropertyValue("--container-width");
    const container_width_int = parseInt(container_width_str, 10);
    const sml_size = diff_color.windowWidthSML(container_width_int);
    return sml_size;
  }

  function isTestADeclared(func_name) {
    return typeof test_a === 'function';
  }

  function callTest() {
    var last_test_id = localStorage.getItem('_last_test_id_');
    if (isTestADeclared()) {
      if (last_test_id == 'check') {
        test_check();
      } else if (last_test_id == 'a') {
        test_a();
      } else if (last_test_id == 'b') {
        test_b();
      } else if (last_test_id == 'c') {
        test_c();
      }
    }
  }

  function refreshCallTest(test_id) {
    window.addEventListener('beforeunload', (event) => {
      localStorage.setItem('_last_test_id_', test_id);            // NB test to call on reloaded iFrame label-maker.html page
    });
    window.location = window.location;                              // NB refresh label-maker.html for each test
  }

  return {
    nl2br: nl2br,
    windowWidthSML: windowWidthSML,
    getSmallMediumLargeWidth: getSmallMediumLargeWidth,
    redGreenDiff: redGreenDiff,
    showDifferences: showDifferences,
    failAppendDocument: failAppendDocument,
    passAppendDocument: passAppendDocument,
    containerSize: containerSize,
    callTest: callTest,
    refreshCallTest: refreshCallTest
  };
})();

diff_color.callTest();

window.onmessage = function (event) {
  diff_color.refreshCallTest(event.data);
};