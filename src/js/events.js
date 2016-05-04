$('#uriForm').on('input', function() {
  sandbox.setItemUri();
  sandbox.displayRelevantFields();
});

$('#userIdField').on('input', function() {
  sandbox.setUserIdParameter();
  sandbox.displayRelevantFields();
});

$('#archiveObjectUrlField').on('input', function() {
  sandbox.setArchiveObjectUrlParameter();
  sandbox.displayRelevantFields();
});

$('#searchForm').on('input', function() {
  sandbox.setTextParameter();
  sandbox.displayRelevantFields();
});

$('#bboxForm').on('input', function() {
  sandbox.setBBoxParameter();
  sandbox.displayRelevantFields();
});

$('#lradiusForm').on('input', function() {
  sandbox.setPointParameter();
  sandbox.displayRelevantFields();
});

$('#dradiusForm').on('input', function() {
  sandbox.setRadiusParameter();
  sandbox.displayRelevantFields();
});

// Check boxes

$('#orderByModifiedField').click(function() {
  sandbox.setOrderByParameter();
  sandbox.displayRelevantFields();
});

$('#sortDescField').click(function() {
  sandbox.setSortParameter();
});

$('#extract').click(function() {
  sandbox.setExtractParameter();
});

// Map Buttons
$('#pointMapBtn').click(function() {
  sandbox.openModalPoint();
});

$('#bboxMapBtn').click(function() {
  sandbox.openModalBbox();
});

// Copy Functions

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
  if (sandbox.mapMode == 'bbox') {
    sandbox.areaSelect.remove();
  }
  $('#bboxSubmitBtn').hide();
});
