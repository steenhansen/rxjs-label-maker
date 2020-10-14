
const HTML_FUNCTIONS = (function () {

  const LABEL_CONSTANTS = labelConstants();

  function escapeProvState() {
    window.addEventListener('keydown', (event) => {
      hideProvStates();
    });
  }

  function pageInIframe() {
    const html_page_in_iframe = (window.self !== window.top);
    return html_page_in_iframe;
  }

  function changeSelect(select_id, select_index) {
    const select_input = document.getElementById(select_id);
    select_input.selectedIndex = select_index;
    const change_event = new Event('change');
    select_input.dispatchEvent(change_event);

  }

  // this cleans up after changes
  const freshBlankLabel = _ => {
    const rx_label_container = document.getElementById("rx-label-container");
    const rx_label_maker = document.getElementById("rx-label-maker");
    const rx_label_copy = rx_label_maker.cloneNode(true);
    rx_label_container.replaceChild(rx_label_copy, rx_label_maker);
  }

  const makeId = (element_id, id_suffix) => {
    try {
      const the_id = element_id.split('-')[0] + '-' + id_suffix;
      return the_id;
    } catch (e) {
      logMess('ERROR makeId(element_id, id_suffix) no dash : ', element_id, id_suffix)
    }
  }

  const containerId = (element_id) => {
    const container_id = makeId(element_id, 'container');
    return container_id;
  }

  const copyStyles = (from_id, to_id, style_names) => {
    const from_elem = document.querySelector('#' + from_id);
    const to_elem = document.querySelector('#' + to_id);
    const from_styles = window.getComputedStyle(from_elem);
    style_names.map(a_style => to_elem.style[a_style] = from_styles[a_style])
  }


  const neededId = (element_id) => {
    try {
      const container_id = makeId(element_id, 'need');
      return container_id;
    } catch (e) {
      logMess('ERROR neededId(element_id) does not exist : ', element_id)
    }
  }

  const requiredCss = (element_id) => {
    const container_id = makeId(element_id, 'required');
    return container_id;
  }


  const needData = section_id => {
    try {
      const el = document.getElementById(section_id);
      el.classList.add('need-data');
      el.classList.remove('have-data');
    } catch (e) { 'ERROR visibleNeed(section_id) not exist : ', section_id; }
  }

  const haveData = section_id => {
    try {
      const el = document.getElementById(section_id);
      el.classList.add('have-data');
      el.classList.remove('need-data');
    } catch (e) { 'ERROR hiddenNeed(section_id) not exist : ', section_id; }
  }

  const showGoodBadWords = (is_valid, the_id) => {
    try {
      const need_id = neededId(the_id);
      is_valid ? haveData(need_id) : needData(need_id);
    } catch (e) {
      logMess('ERROR showGoodBadWords(is_valid, the_id, container_elem, need_id) : ', is_valid, the_id, container_elem, need_id)
    }
  }

  const templateReplace = (the_template, curr_key_text) => {
    const [current_key, current_text] = curr_key_text;
    const data_replaced = the_template.replace(current_key, current_text);
    return data_replaced;
  }

  const trimLines = completed_address => {
    const address_vector = completed_address.split("\n");
    const trimmed_vector = address_vector.map(address_line => address_line.trim());
    const trimmed_address = trimmed_vector.join("\n");
    return trimmed_address;
  }

  const extraSpaceCityProv = (replace_template, output_text) =>{
    const city_state_space =  (replace_template=='city_place' || replace_template=='prov_state') ? ' ' : '';
    return output_text + city_state_space;
  }


 const templateData = data_arr => {
    const template_data = data_arr.map(data_obj => {
      const label_data = extraSpaceCityProv(data_obj.replace_template, data_obj.output_text)
      return [data_obj.replace_template, label_data];
    })
    return template_data;
  }

  const templatizeKeys = data_arr => {
    const templatize_keys = data_arr.map(key_value => { return [LABEL_CONSTANTS.START_REPLACE + key_value[0] + LABEL_CONSTANTS.END_REPLACE, key_value[1]] })
    return templatize_keys;
  }


  const allIsValid = (accum_tf, curr_tf) => {
    return accum_tf && curr_tf.is_valid;
  }

  const checkInputs = (all_inputs) => {
    const data_list = all_inputs[1].concat(all_inputs[2]);
    const all_valid = data_list.reduce(allIsValid, true);
    return all_valid;
  }

  const showHideByCountry = the_country => {
    const hide_class = '.' + makeId(the_country, 'off');
    const show_class = '.' + makeId(the_country, 'on');
    const hide_elements = [...document.querySelectorAll(hide_class)];
    const show_elements = [...document.querySelectorAll(show_class)];
    hide_elements.map(currentValue => { currentValue.style.display = 'none'; })
    show_elements.map(currentValue => { currentValue.style.display = 'unset'; })
  }

  const showHideByReceiver = the_receiver => {
    const hide_class = '.' + the_receiver + '-off';
    const show_class = '.' + the_receiver + '-on';
    const hide_elements = [...document.querySelectorAll(hide_class)];
    const show_elements = [...document.querySelectorAll(show_class)];
    hide_elements.map(currentValue => { currentValue.style.display = 'none'; })
    show_elements.map(currentValue => { currentValue.style.display = 'unset'; })
  }

  const showAllProvinces = _ => {
    const can_provinces = document.getElementById('can-provinces-container');
    can_provinces.style.display = 'unset';
    const fullscreen_can = document.getElementById('fullscreen-can');
    fullscreen_can.style.display = 'block';
  }

  const showAllStates = _ => {
    const usa_states = document.getElementById('usa-states-container');
    usa_states.style.display = 'unset';
    const fullscreen_usa = document.getElementById('fullscreen-usa');
    fullscreen_usa.style.display = 'block';
  }

  const colorIncomplete = event_data => {
    const { is_valid, source_id, highlight_id } = event_data;
    showGoodBadWords(is_valid, source_id);      
  }

  const resetCountry = country_mail => {
    clearAllRadios('honourific_salutation');
    const country_radio = document.querySelector('#' + country_mail);
    country_radio.click();
  }

  const resetMailType = type_id => {
    const type_radio = document.querySelector('#' + type_id);
    type_radio.click();
  }

  const fixByCountryReceiver = (mail_country, mail_type) => {
    showHideByCountry(mail_country);
    showHideByReceiver(mail_type.source_id); 
  }

  const notExistInCountry = (mail_country, mail_type) => {
    const whouse_checked = document.querySelector('#mailType-whouse').checked;
    const parliament_checked = document.querySelector('#mailType-parliament').checked;
    const senate_checked = document.querySelector('#mailType-senate').checked;
    const person_mail = document.querySelector('#mailType-person');

      (mail_country=="can-mail" && whouse_checked)                         ? person_mail.click() 
    : (mail_country=="nz-mail"  && (whouse_checked || senate_checked))     ? person_mail.click() 
    : (mail_country=="usa-mail" && (parliament_checked || senate_checked)) ? person_mail.click()
    : fixByCountryReceiver(mail_country, mail_type);
  }

  const fixProvinceSelect = province_data => {
    const short_province = provinceConvert(province_data.output_text);
    const state_province = document.getElementById("can-state");
    const province_value =  province_data.is_valid ? province_data.output_text : "";
    state_province.value = province_value;
    hideProvStates();
  }

  const hideProvStates = () => {
    const can_provinces = document.getElementById('can-provinces-container');
    can_provinces.style.display = 'none';
    const fullscreen_can = document.getElementById('fullscreen-can');
    fullscreen_can.style.display = 'none';

    const usa_states = document.getElementById('usa-states-container');
    usa_states.style.display = 'none';
    const fullscreen_usa = document.getElementById('fullscreen-usa');
    fullscreen_usa.style.display = 'none';
  }

  const fixStateSelect = state_data => {
    const short_state = stateConvert(state_data.output_text);
    const state_textbox = document.getElementById("usa-state");
    const state_value =  state_data.is_valid ? state_data.output_text : "";
    state_textbox.value = state_value;
    hideProvStates();
  }

  const setRightTabBorders = (person_off, firm_off, parliament_off, senate_off, whouse_off) => {
    const css_vars = document.documentElement;
    css_vars.style.setProperty('--person-chosen', person_off);
    css_vars.style.setProperty('--firm-chosen', firm_off);
    css_vars.style.setProperty('--parliament-chosen', parliament_off);
    css_vars.style.setProperty('--senate-chosen', senate_off);
    css_vars.style.setProperty('--whouse-chosen', whouse_off);
  }

  const selectedTypeBack = (person_back, firm_back, parliament_back, senate_back, whouse_back) => {
    const person_type = document.getElementById('tab-type--person');
    const firm_type = document.getElementById('tab-type--firm');
    const parliament_type = document.getElementById('tab-type--parliament');
    const senate_type = document.getElementById('tab-type--senate');
    const whouse_type = document.getElementById('tab-type--whouse');

    person_type.style.backgroundColor = person_back
    firm_type.style.backgroundColor = firm_back
    parliament_type.style.backgroundColor = parliament_back
    senate_type.style.backgroundColor = senate_back
    whouse_type.style.backgroundColor = whouse_back
  }

  const setCssProperty = function (var_name) {
    return function (var_value) {
      const css_vars = document.documentElement;
      css_vars.style.setProperty(var_name, var_value);
    }
  }

  const setCssBorderColor = setCssProperty('--country-color');
  const setCssFont = setCssProperty('--receiver-font');

  const setCanTabHeight = setCssProperty('--can-tab-height');
  const setNzTabHeight = setCssProperty('--nz-tab-height');
  const setUsaTabHeight = setCssProperty('--usa-tab-height');

  const setPersonTabLeft = setCssProperty('--person-set-left');
  const setFirmTabLeft = setCssProperty('--firm-set-left');
  const setParliamentTabLeft = setCssProperty('--parliament-set-left');
  const setWhouseTabLeft = setCssProperty('--whouse-set-left');
  const setSenateTabLeft = setCssProperty('--senate-set-left');

  const setPersonTabTop = setCssProperty('--person-set-top');
  const setFirmTabTop = setCssProperty('--firm-set-top');
  const setParliamentTabTop = setCssProperty('--parliament-set-top');
  const setWhouseTabTop = setCssProperty('--whouse-set-top');
  const setSenateTabTop = setCssProperty('--senate-set-top');
  const setAddressFont = setCssProperty('--current-type-style');

  const selectedCountryBack = country_classnames => {
    const [can_classname, nz_classname, usa_classname] = country_classnames;
    const selected_canada = document.getElementById('tab-country--can');
    const selected_nz = document.getElementById('tab-country--nz');
    const selected_usa = document.getElementById('tab-country--usa');
    selected_canada.className = can_classname;
    selected_nz.className = nz_classname;
    selected_usa.className = usa_classname;
  }

  const setTabBorders = tab_type =>
      tab_type=="mailType-person"      ? setRightTabBorders('1px', '0px', '0px', '0px', '0px')
    : tab_type=="mailType-firm"        ? setRightTabBorders('0px', '1px', '0px', '0px', '0px')
    : tab_type=="mailType-parliament"  ? setRightTabBorders('0px', '0px', '1px', '0px', '0px') 
    : tab_type=="mailType-senate"      ? setRightTabBorders('0px', '0px', '0px', '1px', '0px')
    :                                    setRightTabBorders('0px', '0px', '0px', '0px', '1px')
  const setTabBackground = tab_type =>
      tab_type=="mailType-person"      ? selectedTypeBack("var(--back-ground-color)", "", "", "", "")
    : tab_type=="mailType-firm"        ? selectedTypeBack("", "var(--back-ground-color)", "", "", "")
    : tab_type=="mailType-parliament"  ? selectedTypeBack("", "", "var(--back-ground-color)", "", "")
    : tab_type=="mailType-senate"      ? selectedTypeBack("", "", "", "var(--back-ground-color)", "")
    :                                    selectedTypeBack("", "", "", "", "var(--back-ground-color)")

  const rightTabBorders = mail_type_id => {
    const person_type = document.getElementById('tab-type--person');
    const firm_type = document.getElementById('tab-type--firm');
    const parliament_type = document.getElementById('tab-type--parliament');
    const senate_type = document.getElementById('tab-type--senate');
    const whouse_type = document.getElementById('tab-type--whouse');
    setTabBorders(mail_type_id);
    setTabBackground(mail_type_id);
  }

  const outlineCanada = mail_type_id => {
    setCssBorderColor(0);
    setCanTabHeight(LABEL_CONSTANTS.IS_OUTLINED_COUNTRY);        
    setNzTabHeight(LABEL_CONSTANTS.NOT_OUTLINED_COUNTRY); 
    setUsaTabHeight(LABEL_CONSTANTS.NOT_OUTLINED_COUNTRY);  
    selectedCountryBack(['country-selected', '', '']);
    rightTabBorders(mail_type_id);
  }

  const outlineNewZealand = mail_type_id => {
    setCssBorderColor(1);
    setCanTabHeight(LABEL_CONSTANTS.NOT_OUTLINED_COUNTRY);  
    setNzTabHeight(LABEL_CONSTANTS.IS_OUTLINED_COUNTRY);       
    setUsaTabHeight(LABEL_CONSTANTS.NOT_OUTLINED_COUNTRY);
    selectedCountryBack(['', 'country-selected', '']);
    rightTabBorders(mail_type_id);
  }

  const outlineUsa = mail_type_id => {
    setCssBorderColor(-1);
    setCanTabHeight(LABEL_CONSTANTS.NOT_OUTLINED_COUNTRY);  
    setNzTabHeight(LABEL_CONSTANTS.NOT_OUTLINED_COUNTRY);  
    setUsaTabHeight(LABEL_CONSTANTS.IS_OUTLINED_COUNTRY);      
    selectedCountryBack(['', '', 'country-selected']);
    rightTabBorders(mail_type_id);
  }

  const fixMailTypes = country_type => {
    const [mail_country, mail_type] = country_type;
      mail_country=="can-mail" ? outlineCanada(mail_type.source_id)
    : mail_country=="nz-mail"  ? outlineNewZealand(mail_type.source_id)
    :                            outlineUsa(mail_type.source_id);
    notExistInCountry(mail_country, mail_type);
  }

  const removeUnusedTags = completed_address => {
    const small_address = completed_address.replace(LABEL_CONSTANTS.REMOVE_TEMPLATE_TAGS, '');
    return small_address;
  }

  const fillMailLabel = mail_data => {
    const [label_id, template_data] = mail_data;
    const completed_address = template_data.reduce(templateReplace, LABEL_CONSTANTS.MAIL_LABEL_TEMPLATE);
    const small_address = removeUnusedTags(completed_address)
    const trimmed_address = trimLines(small_address)
    document.getElementById(label_id).innerHTML = trimmed_address;
  }

  function clearAllRadios(radio_name) {
    const salutaions_vector = [...document.getElementsByName(radio_name)];
    salutaions_vector.map(salutaion_radio => salutaion_radio.checked = false)
  }

  const provinceConvert = long_province => {
    const lower_province = long_province.toLowerCase();
    const short_province = LABEL_CONSTANTS.PROVINCES_LONG[lower_province];
    return short_province;
  }

  const stateConvert = long_state => {
    const lower_state = long_state.toLowerCase();
    const short_state = LABEL_CONSTANTS.STATES_LONG[lower_state];
    return short_state;
  }

  function wordsCapitalized(a_name) {
    const trimmed_name = a_name.trim();
    const name_vector = trimmed_name.split(" ");
    const no_blanks_name = name_vector.filter(word => word!='');
    const upper_vector = no_blanks_name.map(word => { return word[0].toUpperCase() + word.substr(1) });
    return upper_vector.join(" ");
  }

  const spacedPcode = can_postalcode => {
    const upper_case = can_postalcode.toUpperCase();
    const first_part = upper_case.substr(0, 3);
    const second_part = upper_case.substr(3);
    const spaced_upper = first_part + ' ' + second_part.trim();
    return spaced_upper;
  }

  const firstUpperWords = input_text => {
    return {
      "is_valid": input_text.is_valid,
      "highlight_id": input_text.highlight_id,
      "source_id": input_text.source_id,
      "output_text": wordsCapitalized(input_text.output_text),
      "replace_template": input_text.replace_template
    }
  }

  return {
    escapeProvState: escapeProvState,
    pageInIframe: pageInIframe,
    changeSelect: changeSelect,
    freshBlankLabel: freshBlankLabel,
    containerId: containerId,
    templateData: templateData,
    templatizeKeys: templatizeKeys,
    allIsValid: allIsValid,
    showAllProvinces: showAllProvinces,
    showAllStates: showAllStates,
    colorIncomplete: colorIncomplete,
    resetCountry: resetCountry,
    resetMailType: resetMailType,
    fixProvinceSelect: fixProvinceSelect,
    fixStateSelect: fixStateSelect,
    fixMailTypes: fixMailTypes,
    fillMailLabel: fillMailLabel,
    provinceConvert: provinceConvert,
    stateConvert: stateConvert,
    wordsCapitalized: wordsCapitalized,
    spacedPcode: spacedPcode,
    firstUpperWords: firstUpperWords
  };

})();


