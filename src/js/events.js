$(document).ready(function() {
  if (!sandbox.getUrlParameter('method')) {
    sandbox.init('place'); $('#place').addClass('active');
  } else {
    sandbox.init(sandbox.getUrlParameter('method'));
  }
});

$('#uriForm').on('input', function() {
  sandbox.setItemUri();
  sandbox.displayRelevantFields();
});

$('#userIdField').on('input', function() {
  sandbox.setUserIdParameter();
  sandbox.displayRelevantFields();
});

$('#limitField').on('input', function() {
  sandbox.setLimitParameter();
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

// Method menu
if ($('.nav-link').length) {
  for (var i = 0; i < document.getElementsByClassName('nav-link').length; i++) {
    if (document.getElementsByClassName('nav-link')[i].nodeName == 'LI') {
      document.getElementsByClassName('nav-link')[i].addEventListener('click', function() {
        sandbox.init(this.id);
      });
    }
  }
}

$('#run').click(function() {
  sandbox.platsrRequest();
});

// Copy Functions

$('#copy').click(function() {
  copy(document.querySelector('#requestUrlForm'));
});

$('#copyShare').click(function() {
  copy(document.querySelector('#shareUrl'));
});

function copy(element) {
  // disabled inputs can not be selected by select()...
  element.disabled = false;
  element.select();
  try {
    // copy
     var successful = document.execCommand('copy');
    $('.alert-container').append('<div class="alert alert-info alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Copied!</strong></div>');
  } catch(err) {
    console.log('Copying failed, try a browser that isn\'t Safari.');
  }

  element.disabled = true;
}

// Modals

$('#modal').on('hidden.bs.modal', function (e) {
  $('#leaflet').css('cursor', 'default');
  if (sandbox.mapMode == 'bbox') {
    sandbox.areaSelect.remove();
  }
  $('#bboxSubmitBtn').hide();
});
