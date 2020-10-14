
function logMess(...log_messages) {
  const the_message = log_messages.reduce((accum_mess, current_mess) => { return accum_mess + ',' + current_mess; });
  console.log(the_message)
}

const labelConstants = (function () {

  return {
    SHOW_SUBMIT_BUTTON: 1,
    HIDE_SUBMIT_BUTTON: 10,
    SUBMIT_BUTTON_MARGIN: 11,
    START_REPLACE: '*{',
    END_REPLACE: '}*',
    REMOVE_TEMPLATE_TAGS: /\*{[^{]*}\*/gi,
    CHROME_EDGE_SELECT_WIDTH_INCREASE: 2,
    IS_OUTLINED_COUNTRY:'24px',
    NOT_OUTLINED_COUNTRY:'22px',
    PERSON_FONT: 'Arial, Helvetica, sans-serif',
    FIRM_FONT: '"Lucida Console", Courier, monospace',
    GOVERNMENT_FONT: '"Times New Roman", Times, serif',
    MAIL_LABEL_TEMPLATE: `<div class="cutout-label"> 
                   <div class="print-text">*{attn_name}*</div>                               
                   <div class="print-text">*{nz_parliament_sal}* *{can_parl_sen_sal}* *{honourific_salutation}* *{to_name}*    </div>
                   <div class="print-text">*{address_street}*                                                                  </div> 
                   
          <div  class="print-text">*{city_place}**{prov_state}**{pcode_system}*</div> 

          <div  class="print-text">*{city_place_nz_parliament}*</div> 
          <div  class="print-text">*{prov_state_nz_parliament}*</div> 
          <div  class="print-text">*{pcode_system_nz_parliament}*</div> 

                   <div  class="print-text">           *{goto_country}*                               </div>      </div>                      <br><br>
                            <div class="cutout-service">*{delivery_service}* </div> `,
    PROVINCE_IDS: ['province-none', 'province-ab', 'province-bc', 'province-mb', 'province-nb',
      'province-nl', 'province-nt', 'province-ns', 'province-nu', 'province-on',
      'province-pe', 'province-qc', 'province-sk', 'province-yt'],
    STATE_IDS: ['state-al', 'state-ak', 'state-az', 'state-ar', 'state-ca',
      'state-co', 'state-ct', 'state-de', 'state-fl', 'state-ga', 'state-hi',
      'state-id', 'state-il', 'state-in', 'state-ia', 'state-ks',
      'state-ky', 'state-la', 'state-me', 'state-md', 'state-ma', 'state-mi',
      'state-mn', 'state-ms', 'state-mo', 'state-mt', 'state-ne', 'state-nv',
      'state-nh', 'state-nj', 'state-nm', 'state-ny', 'state-nc',
      'state-nd', 'state-oh', 'state-ok', 'state-or', 'state-pa', 'state-ri',
      'state-sc', 'state-sd', 'state-tn', 'state-tx', 'state-ut', 'state-vt',
      'state-va', 'state-wa', 'state-wv', 'state-wi', 'state-wy',
      'state-none', 'state-dc', 'state-aa', 'state-ap', 'state-ae',
      'state-as', 'state-gu', 'state-mp', 'state-pr', 'state-um', 'state-vi'],
    PROVINCES_LONG: {
      "alberta": "AB",
      "british columbia": "BC",
      "manitoba": "MB",
      "new brunswick": "NB",
      "newfoundland and labrador": "NL",
      "northwest territories": "NT",
      "nova scotia": "NS",
      "nunavut": "NU",
      "ontario": "ON",
      "prince edward island": "PE",
      "quebec": "QC",
      "saskatchewan": "SK",
      "yukon": "YT"
    },
    STATES_LONG: {
      "alabama": "AL",
      "alaska": "AK",
      "arizona": "AZ",
      "arkansas": "AR",
      "california": "CA",
      "colorado": "CO",
      "connecticut": "CT",
      "delaware": "DE",
      "district of columbia": "DC",
      "florida": "FL",
      "georgia": "GA",
      "hawaii": "HI",
      "idaho": "ID",
      "illinois": "IL",
      "indiana": "IN",
      "iowa": "IA",
      "kansas": "KS",
      "kentucky": "KY",
      "louisiana": "LA",
      "maine": "ME",
      "maryland": "MD",
      "massachusetts": "MA",
      "michigan": "MI",
      "minnesota": "MN",
      "mississippi": "MS",
      "missouri": "MO",
      "montana": "MT",
      "nebraska": "NE",
      "nevada": "NV",
      "new hampshire": "NH",
      "new jersey": "NJ",
      "new mexico": "NM",
      "new york": "NY",
      "north carolina": "NC",
      "north dakota": "ND",
      "ohio": "OH",
      "oklahoma": "OK",
      "oregon": "OR",
      "pennsylvania": "PA",
      "rhode island": "RI",
      "south carolina": "SC",
      "south dakota": "SD",
      "tennessee": "TN",
      "texas": "TX",
      "utah": "UT",
      "vermont": "VT",
      "virginia": "VA",
      "washington": "WA",
      "west virginia": "WV",
      "wisconsin": "WI",
      "wyoming": "WY",
      "american samoa": "AS",
      "guam": "GU",
      "north mariana islands": "MP",
      "puerto rico": "PR",
      "united states minor outlying islands": "UM",
      "virgin islands": "VI",
      "af americas": "AA",
      "af pacific": "AP",
      "af others": "AE"
    },
    COUNTRY_NAMES: {
      "CAN": {
        "is_valid": true,
        "highlight_id": "usa_country_0987",
        "source_id": "usa_country_1234",
        "output_text": "Canada",
        "replace_template": "goto_country"
      },
      "NZ": {
        "is_valid": true,
        "highlight_id": "usa_country_0987",
        "source_id": "usa_country_1234",
        "output_text": "New Zealand",
        "replace_template": "goto_country"
      },
      "USA": {
        "is_valid": true,
        "highlight_id": "usa_country_0987",
        "source_id": "usa_country_1234",
        "output_text": "USA",
        "replace_template": "goto_country"
      }
    },
    START_PERSON_MAIL_TYPE: {
      "is_valid": true,
      "output_text": "on",
      "source_id": 'mailType-person',
      "highlight_id": "mailType-container",
      "replace_template": "mail_type"
    },

    CAN_PARLIAMENT_POSTALCODE: {
      "is_valid": true,
      "highlight_id": "usa_country_0987",
      "source_id": "usa_country_1234",
      "output_text": "K1A 0A6",
      "replace_template": "pcode_system"
    },
    CAN_PARLIAMENT_STREET: {
      "is_valid": true,
      "highlight_id": "usa_country_0987",
      "source_id": "usa_country_1234",
      "output_text": "House of Commons",
      "replace_template": "address_street"
    },
    CAN_SENATE_POSTALCODE: {
      "is_valid": true,
      "highlight_id": "usa_country_0987",
      "source_id": "usa_country_1234",
      "output_text": "K1A 0A4",
      "replace_template": "pcode_system"
    },
    CAN_SENATE_STREET: {
      "is_valid": true,
      "highlight_id": "usa_country_0987",
      "source_id": "usa_country_1234",
      "output_text": "the Senate of Canada",
      "replace_template": "address_street"
    },
    CAN_CAPITAL_INFO: {
      "CITY": {
        "is_valid": true,
        "highlight_id": "usa_country_0987",
        "source_id": "usa_country_1234",
        "output_text": "Ottawa ",
        "replace_template": "city_place"
      },
      "PROVINCE": {
        "is_valid": true,
        "highlight_id": "usa_country_0987",
        "source_id": "usa_country_1234",
        "output_text": "Ontario",
        "replace_template": "prov_state"
      }
    },
    NZ_BEEHIVE_INFO: {
      "STREET": {
        "is_valid": true,
        "highlight_id": "usa_country_0987",
        "source_id": "usa_country_1234",
        "output_text": "Freepost Parliament",
        "replace_template": "address_street"
      },
      "CITY": {
        "is_valid": true,
        "highlight_id": "usa_country_0987",
        "source_id": "usa_country_1234",
        "output_text": "Private Bag 18 888",
        "replace_template": "city_place_nz_parliament"
      },
      "PRIVATE_BAG": {
        "is_valid": true,
        "highlight_id": "usa_country_0987",
        "source_id": "usa_country_1234",
        "output_text": "Parliament Buildings",
        "replace_template": "prov_state_nz_parliament"
      },
      "POSTALCODE": {
        "is_valid": true,
        "highlight_id": "usa_country_0987",
        "source_id": "usa_country_1234",
        "output_text": "Wellington 6160",
        "replace_template": "pcode_system_nz_parliament"
      }
    },
    WHITE_HOUSE_INFO: {
      "PERSON": {
        "is_valid": true,
        "highlight_id": "usa_country_0987",
        "source_id": "usa_country_1234",
        "output_text": "The President of the United States",
        "replace_template": "to_name"
      },
      "CITY": {
        "is_valid": true,
        "highlight_id": "usa_country_0987",
        "source_id": "usa_country_1234",
        "output_text": "Washington",
        "replace_template": "city_place"
      },
      "ZIP": {
        "is_valid": true,
        "highlight_id": "usa_country_0987",
        "source_id": "usa_country_1234",
        "output_text": "20500",
        "replace_template": "pcode_system"
      },
      "STATE": {
        "is_valid": true,
        "highlight_id": "usa_country_0987",
        "source_id": "usa_country_1234",
        "output_text": "DC",
        "replace_template": "prov_state"
      },
      "STREET": {
        "is_valid": true,
        "highlight_id": "usa_country_0987",
        "source_id": "usa_country_1234",
        "output_text": "1600 Pennsylvania Avenue NW",
        "replace_template": "address_street"
      }
    },
  }

})

