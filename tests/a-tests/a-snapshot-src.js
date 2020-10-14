
function test_a() {


  style_values.unsubscribeRx();

  var g_label_component$ = label_maker.buildLabelMaker('can-mail', 'mailType-person');
  var g_label_maker_unsub = g_label_component$.subscribe(mail_data => label_maker.fillMailLabel(mail_data))

  style_values.doClick('terms-accept');
  style_values.doClick('terms-accept');
  label_maker.changeSelect('canpost-delivery', 2); // Xpresspost
  style_values.doClick('personSalutation-dr');
  style_values.setTextBox('person-name', 'a person')
  style_values.setTextBox('address-street', '7-123456 yonge st')
  style_values.setTextBox('city-place', 'a city')
  style_values.doClick('province-on');
  style_values.setTextBox('cancode-system', 'a1b2c3')



  var container_size = diff_color.containerSize();
  if (container_size == 'large') {
    style_values.showErrors('A', a_snapshot_large_expected);
  } else if (container_size == 'medium') {
    style_values.showErrors('A', a_snapshot_medium_expected);
  } else {
    style_values.showErrors('A', a_snapshot_small_expected);
  }

}









