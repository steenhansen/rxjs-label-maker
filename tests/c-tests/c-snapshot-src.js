function test_c() {


  style_values.unsubscribeRx();

  var g_label_component$ = label_maker.buildLabelMaker('usa-mail', 'mailType-firm');
  var g_label_maker_unsub = g_label_component$.subscribe(mail_data => label_maker.fillMailLabel(mail_data))

  style_values.doClick('terms-accept');
  style_values.doClick('terms-accept');
  label_maker.changeSelect('usapost-delivery', 3); // Xpresspost


  style_values.setTextBox('attn-name', 'the big boss')

  style_values.setTextBox('firm-name', 'acme corp')


  style_values.setTextBox('address-street', '7-123456 main ave')
  style_values.setTextBox('city-place', 'Biloxi')
  style_values.doClick('state-ms');
  style_values.setTextBox('usacode-system', '98765')



  var container_size = diff_color.containerSize();
  if (container_size == 'large') {
    style_values.showErrors('C', c_snapshot_large_expected);
  } else if (container_size == 'medium') {
    style_values.showErrors('C', c_snapshot_medium_expected);
  } else {
    style_values.showErrors('C', c_snapshot_small_expected);
  }

}











