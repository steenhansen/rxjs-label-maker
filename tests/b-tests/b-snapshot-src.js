
function test_b() {


  style_values.unsubscribeRx();

  var g_label_component$ = label_maker.buildLabelMaker('nz-mail', 'mailType-parliament');
  var g_label_maker_unsub = g_label_component$.subscribe(mail_data => label_maker.fillMailLabel(mail_data))

  style_values.doClick('terms-accept');
  style_values.doClick('terms-accept');
  label_maker.changeSelect('nzpost-delivery', 2); // Overnight
  style_values.doClick('parliamentNz-right');
  style_values.setTextBox('parliament-name', 'nz parliamentor')


  var container_size = diff_color.containerSize();
  if (container_size == 'large') {
    style_values.showErrors('B', b_snapshot_large_expected);
  } else if (container_size == 'medium') {
    style_values.showErrors('B', b_snapshot_medium_expected);
  } else {
    style_values.showErrors('B', b_snapshot_small_expected);
  }

}











