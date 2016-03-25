$('#uriForm').keyup(function() {
  $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + sandbox.requestUrl + $('#uriForm').val());
});

$('#searchForm').keyup(function() {
  $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + 'place?text=' + $('#searchForm').val());
  sandbox.requestUrl = 'place?text=' + $('#searchForm').val();

  sandbox.setExtractParameter();
});

$('#bboxForm').keyup(function() {
  $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + 'place?bbox=' + $('#bboxForm').val());
  sandbox.requestUrl = 'place?bbox=' + $('#bboxForm').val();

  sandbox.setExtractParameter();
});

$('#lradiusForm').keyup(function() {
  $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + 'place?point=' + $('#lradiusForm').val() + '&radius=' + $('#dradiusForm').val());
  sandbox.requestUrl = sandbox.platsrEndpoint + 'place?point=' + $('#lradiusForm').val() + '&radius=' + $('#dradiusForm').val();

  sandbox.setExtractParameter();
});

$('#dradiusForm').keyup(function() {
  $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + 'place?point=' + $('#lradiusForm').val() + '&radius=' + $('#dradiusForm').val());
  sandbox.requestUrl = sandbox.platsrEndpoint + 'place?point=' + $('#lradiusForm').val() + '&radius=' + $('#dradiusForm').val();

  sandbox.setExtractParameter();
});

$('#extract').click(function() {
  sandbox.setExtractParameter();
});

$('#pointMapBtn').click(function() {
  sandbox.openModalPoint();
});

$('#bboxMapBtn').click(function() {
  sandbox.openModalBbox();
});

$('#copy').click(function() {
  // clear selection if there is any
  window.getSelection().removeAllRanges();

  // select request url(.copy-source)
  element = document.querySelector('.copy-source');
  range = document.createRange();
  range.selectNode(element);
  window.getSelection().addRange(range);

  // try copy selected url
  try {
    document.execCommand('copy');
    $('.alert-container').append('<div class="alert alert-info alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Copied!</strong></div>');
  } catch(err) {
    console.log('Copying failed, try a browser that isn\'t Safari.');
  }

  // clear selection
  window.getSelection().removeAllRanges();
});

$('#modal').on('hidden.bs.modal', function (e) {
  $('#leaflet').css('cursor', 'default');
  sandbox.areaSelect.remove();
  $('#bboxSubmitBtn').hide();
});
