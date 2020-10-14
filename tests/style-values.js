var style_values = (function () {

  const check_styles = ["background-color",
    "bottom",
    "color",
    "display",
    "flex-direction",
    "float",
    "font-size",
    "height",
    "left",
    //    "margin",   //  too much work to unify differences of FF versus Chrome
    "marginBottom",
    "marginLeft",
    "marginRight",
    "marginTop",
    "opacity",
    "order",
    //   "padding",        // too much work to unify differences of FF versus Chrome
    "pointer-events",
    "position",
    "overflow",
    //"right",          // too much work to unify differences of FF versus Chrome
    "text-align",
    "top",
    // "user-select",   // too much work to unify differences of FF versus Chrome
    "visibility",
    "width",
    "x",
    "y",
    "z-index"];

  function unsubscribeRx() {
    if (style_values.isPlainObject(g_label_maker_unsub)) {
      g_label_maker_unsub.unsubscribe();
    }
  }

  function showFileChanges(acutal_snapshot, test_name, the_size) {
    const lower_name = test_name.toLowerCase();
    const test_css_br = diff_color.nl2br(acutal_snapshot);
    const fix_name = lower_name + "_snapshot_" + the_size + "_actual";
    const file_name = lower_name + "_snapshot_" + the_size + ".js";
    const the_instructions = fix_name + ", copy below code into " + file_name;
    const the_correct_text = "<br><div style='color:blue; font-size:10px; font-family:Courier' > " + test_css_br + "</br></br></br></br></div>";
    diff_color.failAppendDocument(the_instructions, the_correct_text);
  }

  function showFileDifferencesFail(test_name, the_size, acutal_snapshot, expected_snapshot) {
    const css_diff = diff_color.showDifferences(acutal_snapshot, expected_snapshot);
    if (  css_diff.match(/actual cutout-service/) && css_diff.match(/expected CUTOUT-SERVICE/)) {
      logMess('Pass CHECK test ' + the_size);
      return false;
    }else{
      logMess('****** FAIL TEST CHECK ' + the_size);
      const lower_name = test_name.toLowerCase();
      const error_name = lower_name + "_snapshot_" + the_size + "_difference";
      diff_color.failAppendDocument(error_name, css_diff);
      return true;
   }
 }

  function showFileDifferences(test_name, the_size, acutal_snapshot, expected_snapshot) {
    const lower_name = test_name.toLowerCase();
    const failed_test = '****** FAIL TEST ' + test_name + ' ' + the_size;
    logMess(failed_test);
    const css_diff = diff_color.showDifferences(acutal_snapshot, expected_snapshot);
    const error_name = lower_name + "_snapshot_" + the_size + "_difference";
    diff_color.failAppendDocument(error_name, css_diff);
  }

  function showErrorsCheck(test_name, expected_snapshot) {
    const the_size = diff_color.containerSize()
    const acutal_snapshot = getStylesValues('rx-label-container');
    const fail_failed = showFileDifferencesFail(test_name, the_size, acutal_snapshot, expected_snapshot);
    if (fail_failed){
      showFileChanges(acutal_snapshot, test_name, the_size);
    }else{
      const passed_test = 'Pass test ' + test_name + ' ' + the_size;
      diff_color.passAppendDocument(passed_test);
    }
  }

  function showErrors(test_name, expected_snapshot) {
    const the_size = diff_color.containerSize()
    var acutal_snapshot = getStylesValues('rx-label-container');
    if (acutal_snapshot == expected_snapshot) {
      const passed_test = 'Pass test ' + test_name + ' ' + the_size;
      logMess(passed_test);
      diff_color.passAppendDocument(passed_test);
    } else {
      showFileDifferences(test_name, the_size, acutal_snapshot, expected_snapshot);
      if (test_name =='CHECK'){
        diff_color.failAppendDocument('This signals that the tests catch differences. This is EXPECTED to FAIL. Change one small thing only at end of snapshot to uppercase.', '');
      }
        showFileChanges(acutal_snapshot, test_name, the_size)
    }
  }

  function setTextBox(text_id, text_value) {
    const text_input = document.getElementById(text_id);
    text_input.value = text_value;
    const input_event = new Event('input');
    text_input.dispatchEvent(input_event);
  }

  function doClick(checkbox_id) {
    document.getElementById(checkbox_id).click();
  }

  const valueUnderscores = the_element => {
    const the_value = the_element.value;
    const under_values = the_value.replace(/ /g, "_");
    const the_under_value = "[=" + under_values + ']';
    return the_under_value;
  }

  const classNameCommas = the_element => {
    const class_names = the_element.className;
    const commas_names = class_names.replace(/ /g, ".");
    const class_commas = "{." + commas_names + '}';
    return class_commas;
  }

  const getInnerText = the_element => {
    const inner_html = the_element.innerHTML;
    const inner_comments = inner_html.replace(/<!--(.|\n)*?-->/g, '');
    const inner_spaces = inner_comments.replace(/<[^>]*>/g, '');      ///   <!-- <div class="fullscreen-can"> --> crashes it
    const inner_nbsp = inner_spaces.replace(/&nbsp;/g, '')
    const inner_text = inner_nbsp.replace(/\s/g, "");
    return inner_text;
  }

  const getAttributes = the_element => {
    if (isInteresting(the_element)) {
      const inner_text = getInnerText(the_element);
      const all_attributes = [
        the_element.id ? "#" + the_element.id : "",
        the_element.name ? "NAME=" + the_element.name : "",
        the_element.className ? classNameCommas(the_element) : "",
        the_element.checked ? "checked=" + the_element.checked : "",
        the_element.value ? valueUnderscores(the_element) : "",
        the_element.tagName ?? "",
        the_element.disabled ? "DISABLED" : "",
        the_element.type ?? "",
        the_element.required ? "REQUIRED" : "",
        !the_element.validity ? '' : the_element.validity.valid ? "VALID" : "NOT_VALID",
        inner_text ? inner_text : ''
      ]
      const valid_attributes = all_attributes.filter(an_attribute => an_attribute !== '');
      const attribute_str = valid_attributes.join(';');
      return attribute_str;
    } else {
      return '';
    }
  }

  function trimLinesText(test_string, split_str) {
    const lines_vector = test_string.split(split_str);
    const trimmed_vector = lines_vector.map(text_line => text_line.trim());
    const full_vector = trimmed_vector.filter(text_line => text_line != '');
    const nl_str = full_vector.join("\n");
    return nl_str;
  }

  function floatToIntStr(float_string) {
    if (float_string.match(/\d\.\d/)) {       // 123.456px
      const as_float = parseFloat(float_string);
      const rounded_int = Math.round(as_float);
      if (float_string.match(/px$/)) {       // 123.456px
        const int_str = rounded_int + 'px';
        return int_str;
      } else {
        return rounded_int;
      }
      return rounded_int;
    }
    return float_string;
  }

  function adjustFfToChrome(prop_name, prop_value, element_tagname) {
    let new_prop_value;
    if (element_tagname == 'OPTION') {
      if (prop_name == 'background-color') {
        new_prop_value = 'IGNORE'
      } else if (prop_name == 'color') {
        new_prop_value = 'IGNORE'
      }
    } else if (prop_name == 'width' || prop_name == 'height' || prop_name == 'left' || prop_name == 'top' || prop_name == 'bottom') {
      new_prop_value = floatToIntStr(prop_value);
    } else {
      new_prop_value = prop_value;
    }
    return new_prop_value;
  }

  const makeStylesReducer = the_element => {
    const css_styles = window.getComputedStyle(the_element);
    const styleReducer = (accum_styles, prop_name) => {
      const prop_value = css_styles.getPropertyValue(prop_name);
      const adjusted_value = adjustFfToChrome(prop_name, prop_value, the_element.tagName);     // (fireFox) margin: => margin:0px (chrome)
      const prop_style = prop_name + '=' + adjusted_value;
      const prop_no_space = prop_style.replace(/ /g, '');
      accum_styles.push(prop_no_space);
      return accum_styles;
    }
    return styleReducer;
  }

  function getStyles(the_element) {
    const styleReducer = makeStylesReducer(the_element);
    const styles_vector = check_styles.reduce(styleReducer, [])
    const style_str = styles_vector.join(";");
    return style_str;
  }

  const getChildren = (the_element, current_level) => {
    if (current_level == 0) {
      return [];
    }
    let values_vector = [];
    for (let child_index = 0; child_index < the_element.children.length; child_index++) {
      const current_child = the_element.children[child_index];
      const child_values = getStylesValuesHtml(current_child, current_level);
      if (child_values !== '') {
        values_vector.push(child_values);
      }
    }
    return values_vector;
  }

  const isInteresting = the_element => (the_element.name || the_element.id || the_element.checked || the_element.value || the_element.className);

  function getStylesValuesHtml(the_element, num_levels) {
    const current_level = num_levels - 1;
    const children_vector = getChildren(the_element, current_level);
    const the_children = children_vector.join("\n");
    const elem_attributes = getAttributes(the_element);
    const show_interesting = isInteresting(the_element);
    const the_css_new = getStyles(the_element);

    if (children_vector.length > 0 && show_interesting) {
      var show_state = "\n" + elem_attributes + "\n" + the_css_new + "\n" + the_children;
    } else if (show_interesting) {
      var show_state = "\n" + elem_attributes + "\n" + the_css_new;
    } else if (children_vector.length > 0) {
      var show_state = "\n" + the_children;
    } else {
      var show_state = '';
    }
    return show_state;
  }

  function getStylesValues(the_id, num_levels = -1) {
    const an_elem = document.getElementById(the_id);
    const style_values = getStylesValuesHtml(an_elem, num_levels);
    const trimmed_styles = style_values.trim();
    return trimmed_styles;
  }

  function isPlainObject(any_variable) {
    const is_pojo = typeof any_variable == 'object' && any_variable instanceof Object && !(any_variable instanceof Array);
    return is_pojo;

  }

  return {
    unsubscribeRx: unsubscribeRx,
    trimLinesText: trimLinesText,
    showErrorsCheck:showErrorsCheck,
    showErrors: showErrors,
    setTextBox: setTextBox,
    doClick: doClick,
    getStylesValues: getStylesValues,
    isPlainObject: isPlainObject

  };
})();











