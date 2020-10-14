const label_maker = (function () {

  const LABEL_CONSTANTS = labelConstants();

  let my_inputNeeds$, my_country_and_type$, my_current_mail$;
  let my_parliament_can_type$, my_senate_can_type$, my_beehive_nz_type$, my_whouse_usa_type$;
  let my_can_senate$, my_can_person$, my_can_firm$, my_can_parliament$;
  let my_nz_person$, my_nz_firm$, my_nz_parliament$;
  let my_usa_person$, my_usa_firm$,  my_usa_whouse$;
  let my_countryNz$, my_countryUsa$, my_countryCanada$;
  let my_can_country$, my_nz_country$, my_usa_country$;
  let my_region_can$, my_can_state$, my_canprov_short$;
  let my_region_usa$, my_usa_state$, my_usastate_short$;
  let my_accept_input$, my_person_moniker$, my_firm_moniker$, my_parliament_moniker$, my_senate_moniker$, my_address_street$, my_city_place$;
  let my_cancode_system$, my_nzcode_system$, my_usacode_system$, my_usapost_delivery$, my_canpost_delivery$, my_nzpost_delivery$;
  let my_personSalutation$, my_parliamentCan$, my_parliamentNz$, my_attn_name$;
  let my_label_unsub_vector = [];

  const chooseCountry = element_id => {
    const receiver_elem = document.querySelector('#' + element_id)
    const reciever_event = Rx.Observable.fromEvent(receiver_elem, 'click')
      .pluck('target', 'id')
      .map(country_id => {
        return {
          "is_valid": true,
          "highlight_id": '_',
          "source_id": '_',
          "output_text": country_id,
          "replace_template": "goto_country"
        }
      })
    return reciever_event;
  }

  const radioReduce = (accum_radios$, radio_id) => {
    const next_radio = document.querySelector('#' + radio_id);
    const nextRadio$ = Rx.Observable.fromEvent(next_radio, 'click');
    const new_radios$ = Rx.Observable.merge(accum_radios$, nextRadio$);
    return new_radios$;
  }

  const radioBuild = radio_ids => {
    const container_id = HTML_FUNCTIONS.containerId(radio_ids[0]);
    const merged_radios$ = radio_ids.reduce((accum_radios$, radio_id) => radioReduce(accum_radios$, radio_id), Rx.Observable.of())
      .pluck('target')
      .map(the_target => {
        return {
          "is_valid": true,
          "output_text": the_target.value,
          "source_id": the_target.id,
          "highlight_id": container_id,
          "replace_template": the_target.name
        }
      })
    return merged_radios$;
  }

  const textBuild = textbox_id => {
    const container_id = HTML_FUNCTIONS.containerId(textbox_id);
    const text_elem = document.querySelector('#' + textbox_id);
    const textValidate$ = Rx.Observable.fromEvent(text_elem, 'input')
      .pluck('srcElement')
      .map(text_element => {
        return {
          "is_valid": text_element.validity.valid,
          "highlight_id": container_id,
          "source_id": textbox_id,
          "output_text": (text_element.value).trim(),
          "replace_template": text_element.name
        }
      })
    return textValidate$;
  }

  const checkBoxBuild = checkbox_id => {
    const container_id = HTML_FUNCTIONS.containerId(checkbox_id);
    const check_box = document.querySelector('#' + checkbox_id);
    const aCheckbox$ = Rx.Observable.fromEvent(check_box, 'click')
      .pluck('target')
      .map(the_checkbox => {
        return {
          "is_valid": the_checkbox.checked,
          "highlight_id": container_id,
          "source_id": checkbox_id,
          "output_text": the_checkbox.value,
          "replace_template": the_checkbox.name
        }
      })
    return aCheckbox$;
  }

  const selectBuild = select_id => {
    const container_id = HTML_FUNCTIONS.containerId(select_id);
    const select_elem = document.querySelector('#' + select_id);
    const selectValidate$ = Rx.Observable.fromEvent(select_elem, 'change')
      .pluck('srcElement')
      .map(select_element => {
        return {
          "is_valid": select_element.validity.valid,
          "highlight_id": container_id,
          "source_id": select_id,
          "output_text": "Via: " + select_element.value,
          "replace_template": select_element.name
        }
      })
    return selectValidate$;
  }

  const mailType = mail_type => Rx.Observable.from([mail_type])

  function buildInputs$() {
    my_accept_input$ = checkBoxBuild('terms-accept')
    my_person_moniker$ = textBuild('person-name').map(HTML_FUNCTIONS.firstUpperWords);
    my_firm_moniker$ = textBuild('firm-name').map(HTML_FUNCTIONS.firstUpperWords);
    my_parliament_moniker$ = textBuild('parliament-name').map(HTML_FUNCTIONS.firstUpperWords);
    my_senate_moniker$ = textBuild('senate-name').map(HTML_FUNCTIONS.firstUpperWords);
    my_address_street$ = textBuild('address-street').map(HTML_FUNCTIONS.firstUpperWords);
    my_city_place$ = textBuild('city-place').map(HTML_FUNCTIONS.firstUpperWords);

    my_cancode_system$ = textBuild('cancode-system')
                   .map(postal_code => { return {
          "is_valid": postal_code.is_valid,
          "highlight_id": postal_code.highlight_id,
          "source_id": postal_code.source_id,
          "output_text": HTML_FUNCTIONS.spacedPcode(postal_code.output_text),
          "replace_template": postal_code.replace_template } });

    my_nzcode_system$ = textBuild('nzcode-system');
    my_usacode_system$ = textBuild('usacode-system');
    my_usapost_delivery$ = selectBuild('usapost-delivery');
    my_canpost_delivery$ = selectBuild('canpost-delivery');
    my_nzpost_delivery$ = selectBuild('nzpost-delivery');
    my_personSalutation$ = radioBuild(['personSalutation-neutral', 'personSalutation-ms', 'personSalutation-mr', 'personSalutation-dr']);
    my_parliamentCan$ = radioBuild(['parliamentCan-not', 'parliamentCan-plain', 'parliamentCan-right']);
    my_parliamentNz$ = radioBuild(['parliamentNz-not', 'parliamentNz-plain', 'parliamentNz-right']);

    my_attn_name$ = textBuild('attn-name')
      .map(an_attention => {
        const attn_text = "Attn: " + HTML_FUNCTIONS.wordsCapitalized(an_attention.output_text) + "<br><br>";
        return {
          "is_valid": true,
          "output_text": (an_attention.output_text).length > 0 ? attn_text : '',
          "replace_template": "attn_name"
        }
      })
      .startWith({
        "is_valid": true,
        "output_text": "",
        "replace_template": "attn_name"
      })
  }







  function statesProvinces$() {
    my_region_can$ = Rx.Observable.fromEvent(document.querySelector('#can-state'), 'click');
    my_can_state$ = radioBuild(LABEL_CONSTANTS.PROVINCE_IDS);
    my_canprov_short$ = my_can_state$
      .map(a_province => {
        return {
          "is_valid": a_province.output_text !='',       
          "output_text": HTML_FUNCTIONS.provinceConvert(a_province.output_text),
          "replace_template": "prov_state"
        }
      })
    my_region_usa$ = Rx.Observable.fromEvent(document.querySelector('#usa-state'), 'click')
    my_usa_state$ = radioBuild(LABEL_CONSTANTS.STATE_IDS);
    my_usastate_short$ = my_usa_state$
    .map(a_state => {
      return {
        "is_valid": a_state.output_text !='',     
        "output_text": HTML_FUNCTIONS.stateConvert(a_state.output_text),
        "replace_template": "prov_state"
      }
    })
  }


  function pickCountry$() {
    my_countryNz$ = chooseCountry('nz-mail').map(_ => {
      return {
        "is_valid": true,
        "highlight_id": '_',
        "source_id": '_',
        "output_text": "nz-mail",
        "replace_template": "_"
      }
    })
      .startWith({
        "is_valid": true,
        "highlight_id": '_',
        "source_id": '_',
        "output_text": "nz-mail",
        "replace_template": "_"
      })

    my_countryUsa$ = chooseCountry('usa-mail').map(_ => {
      return {
        "is_valid": true,
        "highlight_id": '_',
        "source_id": '_',
        "output_text": "usa-mail",
        "replace_template": "_"
      }
    })
      .startWith({
        "is_valid": true,
        "highlight_id": '_',
        "source_id": '_',
        "output_text": "usa-mail",
        "replace_template": "_"
      })


    my_countryCanada$ = chooseCountry('can-mail').map(_ => {
      return {
        "is_valid": true,
        "highlight_id": '_',
        "source_id": '_',
        "output_text": "can-mail",
        "replace_template": "_"
      }
    })
      .startWith({
        "is_valid": true,
        "highlight_id": '_',
        "source_id": '_',
        "output_text": "can-mail",
        "replace_template": "_"
      })

  }

  function addToCountry$() {
    const country_of_can$ = Rx.Observable.from([LABEL_CONSTANTS.COUNTRY_NAMES.CAN]);
    const country_of_nz$ = Rx.Observable.from([LABEL_CONSTANTS.COUNTRY_NAMES.NZ]);
    const country_of_usa$ = Rx.Observable.from([LABEL_CONSTANTS.COUNTRY_NAMES.USA]);

     my_can_country$ = Rx.Observable.combineLatest(my_countryCanada$, my_accept_input$, my_canpost_delivery$, country_of_can$)
     my_nz_country$ = Rx.Observable.combineLatest(my_countryNz$, my_accept_input$, my_nzpost_delivery$, country_of_nz$)
     my_usa_country$ = Rx.Observable.combineLatest(my_countryUsa$, my_accept_input$, my_usapost_delivery$, country_of_usa$)
  }

  function countryAndType$() {
     const can_person_type$ = Rx.Observable.combineLatest(my_personSalutation$, my_person_moniker$, my_address_street$, my_city_place$, my_cancode_system$, my_canprov_short$)
     const nz_person_type$ = Rx.Observable.combineLatest(my_personSalutation$, my_person_moniker$, my_address_street$, my_city_place$, my_nzcode_system$)
     const usa_person_type$ = Rx.Observable.combineLatest(my_personSalutation$, my_person_moniker$, my_address_street$, my_city_place$, my_usacode_system$, my_usastate_short$)

     const can_firm_type$ = Rx.Observable.combineLatest(my_firm_moniker$, my_attn_name$, my_address_street$, my_city_place$, my_cancode_system$, my_canprov_short$)
     const nz_firm_type$ = Rx.Observable.combineLatest(my_firm_moniker$, my_attn_name$, my_address_street$, my_city_place$, my_nzcode_system$)
     const usa_firm_type$ = Rx.Observable.combineLatest(my_firm_moniker$, my_attn_name$, my_address_street$, my_city_place$, my_usacode_system$, my_usastate_short$)

      my_can_person$ = Rx.Observable.combineLatest(mailType('can-person'), my_can_country$, can_person_type$)
      my_can_firm$ = Rx.Observable.combineLatest(mailType('can-firm'), my_can_country$, can_firm_type$)
      my_can_parliament$ = Rx.Observable.combineLatest(mailType('can-parliament'), my_can_country$, my_parliament_can_type$)
      my_can_senate$ = Rx.Observable.combineLatest(mailType('can-senate'), my_can_country$, my_senate_can_type$)

      my_nz_person$ = Rx.Observable.combineLatest(mailType('nz-person'), my_nz_country$, nz_person_type$)
      my_nz_firm$ = Rx.Observable.combineLatest(mailType('nz-firm'), my_nz_country$, nz_firm_type$)
      my_nz_parliament$ = Rx.Observable.combineLatest(mailType('nz-parliament'), my_nz_country$, my_beehive_nz_type$)

      my_usa_person$ = Rx.Observable.combineLatest(mailType('usa-person'), my_usa_country$, usa_person_type$)
      my_usa_firm$ = Rx.Observable.combineLatest(mailType('usa-firm'), my_usa_country$, usa_firm_type$)
     my_usa_whouse$ = Rx.Observable.combineLatest(mailType('usa-whouse'), my_usa_country$,  my_whouse_usa_type$)
  }
 
  function addressData$() {
    const parliament_street$ = Rx.Observable.from([LABEL_CONSTANTS.CAN_PARLIAMENT_STREET]);
    const parliament_pcode$ = Rx.Observable.from([LABEL_CONSTANTS.CAN_PARLIAMENT_POSTALCODE]);
    const parliament_city$ = Rx.Observable.from([LABEL_CONSTANTS.CAN_CAPITAL_INFO.CITY]);
    const parliament_province$ = Rx.Observable.from([LABEL_CONSTANTS.CAN_CAPITAL_INFO.PROVINCE]);
    my_parliament_can_type$ = Rx.Observable.combineLatest(my_parliamentCan$, my_parliament_moniker$, parliament_street$, parliament_pcode$, parliament_city$, parliament_province$)

    const beehive_street$ = Rx.Observable.from([LABEL_CONSTANTS.NZ_BEEHIVE_INFO.STREET]);
    const beehive_pcode$ = Rx.Observable.from([LABEL_CONSTANTS.NZ_BEEHIVE_INFO.POSTALCODE]);
    const beehive_city$ = Rx.Observable.from([LABEL_CONSTANTS.NZ_BEEHIVE_INFO.CITY]);
    const beehive_province$ = Rx.Observable.from([LABEL_CONSTANTS.NZ_BEEHIVE_INFO.PRIVATE_BAG]);
    my_beehive_nz_type$ = Rx.Observable.combineLatest(my_parliamentNz$, my_parliament_moniker$, beehive_street$, beehive_pcode$, beehive_city$, beehive_province$)

    const senate_street$ = Rx.Observable.from([LABEL_CONSTANTS.CAN_SENATE_STREET]);
    const senate_pcode$ = Rx.Observable.from([LABEL_CONSTANTS.CAN_SENATE_POSTALCODE]);
    const senate_city$ = Rx.Observable.from([LABEL_CONSTANTS.CAN_CAPITAL_INFO.CITY]);
    const senate_province$ = Rx.Observable.from([LABEL_CONSTANTS.CAN_CAPITAL_INFO.PROVINCE]);
    my_senate_can_type$ = Rx.Observable.combineLatest(my_parliamentCan$, my_senate_moniker$, senate_street$, senate_pcode$, senate_city$, senate_province$)

    const whouse_person$ = Rx.Observable.from([LABEL_CONSTANTS.WHITE_HOUSE_INFO.PERSON]);
    const whouse_street$ = Rx.Observable.from([LABEL_CONSTANTS.WHITE_HOUSE_INFO.STREET]);
    const whouse_city$ = Rx.Observable.from([LABEL_CONSTANTS.WHITE_HOUSE_INFO.CITY]);
    const whouse_state$ = Rx.Observable.from([LABEL_CONSTANTS.WHITE_HOUSE_INFO.STATE]);

    const whouse_zip$ = Rx.Observable.from([LABEL_CONSTANTS.WHITE_HOUSE_INFO.ZIP]);
     my_whouse_usa_type$ = Rx.Observable.combineLatest(whouse_person$, whouse_street$, whouse_city$, whouse_state$, whouse_zip$)
  }

  function finalLabel$() {
    const merge_all_types$ =  my_can_senate$.merge( my_can_person$,  my_can_firm$,  my_can_parliament$,
       my_nz_person$,  my_nz_firm$,  my_nz_parliament$,
       my_usa_person$,  my_usa_firm$, my_usa_whouse$);
    const current_mail_defined$ = merge_all_types$
      .map(([mail_type, country_data, type_data]) => { return [mail_type, country_data.concat(type_data)] })
      .filter(([mail_type, address_data]) => address_data.reduce(HTML_FUNCTIONS.allIsValid, true))
      .map(([mail_type, address_data]) => { return [mail_type, HTML_FUNCTIONS.templateData(address_data)] })
      .map(([mail_type, address_data]) => { return [mail_type, HTML_FUNCTIONS.templatizeKeys(address_data)] });
    const current_mail_undefined$ = merge_all_types$
      .map(([mail_type, country_data, type_data]) => { return [mail_type, country_data.concat(type_data)] })
      .filter(([mail_type, address_data]) => !address_data.reduce(HTML_FUNCTIONS.allIsValid, true))
      .map(([mail_type, _address_data]) => [mail_type, [["*{address_street}*", "<strong>INCOMPLETE</strong>"]]]);
    my_current_mail$ = current_mail_defined$.merge(current_mail_undefined$);
  }

  function subscribeMinor$() {
    const region_usa_unsub = my_region_usa$.subscribe(_ => HTML_FUNCTIONS.showAllStates())
    const region_can_unsub = my_region_can$.subscribe(_ => HTML_FUNCTIONS.showAllProvinces())
    const can_state_unsub = my_can_state$.subscribe(province_data => HTML_FUNCTIONS.fixProvinceSelect(province_data))
    const usa_state_unsub = my_usa_state$.subscribe(state_data => HTML_FUNCTIONS.fixStateSelect(state_data))
    const input_need_unsub = my_inputNeeds$.subscribe(event_data => { HTML_FUNCTIONS.colorIncomplete(event_data) });
    const country_and_type_unsub = my_country_and_type$.subscribe(country_type => HTML_FUNCTIONS.fixMailTypes(country_type));
    my_label_unsub_vector = [region_usa_unsub, can_state_unsub, usa_state_unsub, region_can_unsub, input_need_unsub, country_and_type_unsub]
  }

  function unsubscribeMinor() {
    my_label_unsub_vector.map(minor_subcription => minor_subcription.unsubscribe());
  }

  const buildLabelMaker = (start_country_id = 'can-mail', start_type_id = "mailType-person") => {
    unsubscribeMinor();
    HTML_FUNCTIONS.freshBlankLabel();
    statesProvinces$();
    pickCountry$();
    const mail_country$ = Rx.Observable.merge(my_countryCanada$, my_countryNz$, my_countryUsa$)
      .pluck('output_text')
      .startWith(start_country_id);
    const mail_type$ = radioBuild(['mailType-person', 'mailType-firm', 'mailType-parliament', 'mailType-senate', 'mailType-whouse'])
      .startWith(LABEL_CONSTANTS.START_PERSON_MAIL_TYPE);
    my_country_and_type$ = Rx.Observable.combineLatest(mail_country$, mail_type$);
    buildInputs$();
    my_inputNeeds$ = Rx.Observable.merge(mail_type$, my_accept_input$,
      my_canpost_delivery$, my_nzpost_delivery$, my_usapost_delivery$,
      my_personSalutation$, my_parliamentCan$,
      my_parliamentNz$,
      my_person_moniker$, my_firm_moniker$, my_parliament_moniker$, my_senate_moniker$,
      my_address_street$, my_city_place$,
      my_can_state$, my_usa_state$,
      my_cancode_system$, my_nzcode_system$, my_usacode_system$);
    addToCountry$();
    addressData$();
    countryAndType$();
    finalLabel$();
    subscribeMinor$();
    HTML_FUNCTIONS.resetCountry(start_country_id);
    HTML_FUNCTIONS.resetMailType(start_type_id);
    HTML_FUNCTIONS.escapeProvState();
    return my_current_mail$;
  }

  return {
    changeSelect: HTML_FUNCTIONS.changeSelect,
    fillMailLabel: HTML_FUNCTIONS.fillMailLabel,
    buildLabelMaker: buildLabelMaker
  };

})();

