$('#uriForm').keyup(function() {
  $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + sandbox.requestUrl + $('#uriForm').val());
});

$('#searchForm').keyup(function() {
  $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + '?text=' + $('#searchForm').val());
});

$('#extract').click(function() {
  if ($('#extract').is(":checked")) {
    $('#requestUrlForm').val($('#requestUrlForm').val() + '&extracted=true');
  } else {
    $('#requestUrlForm').val($('#requestUrlForm').val().replace('&extracted=true',''));
  }
});

sandbox = {
  sweref99: '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  platsrEndpoint: 'http://localhost:10080/platsr/api/v1/', // CORS enabled proxy
  dummyUrlPlaceholder: 'http://www.platsr.se/platsr/api/v1/',
  itemTypes: [
              'bookmark',
              'collection',
              'comment',
              'copyright',
              'image',
              'place',
              'sound',
              'story',
              'tag',
              'user',
              'video'
            ],
  platsrMethods: [
                   'text',
                   'radius',
                   'bbbox'
  ],
  requestUrl: '',
  requestType: '',


  platsrRequest: function(requestString) {
    $.ajax({
      url: requestString,
      dataType: 'text',
      success: function(result) {
        result = result.replace(/</g, '&lt;');
        result = result.replace(/>/g, '&gt;');

        $('#resultContainer').text(result);
      }
    });
  },

  itemInit: function(typeString) {
    $('#fieldContainer').children().hide();
    $('#uriField').show();
    $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + typeString + '/');
    $('.active').removeClass('active');

    sandbox.requestUrl = typeString + '/';
    sandbox.requestType = typeString;
  },

  methodInit: function(methodString) {
    $('#fieldContainer').children().hide();
    $('.active').removeClass('active');

    switch (methodString) {
      case 'text':
        $('#searchField').show();
        $('#extractField').show();

        if ($('#extract').is(":checked")) {
          sandbox.requestUrl = '?text=' + $('#searchForm').val() + '&extracted=true';
          $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + '?text=' + $('#searchForm').val() + '&extracted=true');
        } else {
          sandbox.requestUrl = '?text=' + $('#searchForm').val();
          $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + '?text=' + $('#searchForm').val());
        }
        break;
      case 'bbbox':
        $('#bboxField').show();
        $('#extractField').show();

        if ($('#extract').is(":checked")) {
          sandbox.requestUrl = '?bbox=' + $('#bboxForm').val() + '&extracted=true';
          $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + '?bbox=' + $('#bboxForm').val() + '&extracted=true');
        } else {
          sandbox.requestUrl = '?bbox=' + $('#bboxForm').val();
          $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + '?bbox=' + $('#bboxForm').val());
        }
        break;
      default: //radius
        $('#lradiusField').show();
        $('#extractField').show();

        if ($('#extract').is(":checked")) {
        sandbox.requestUrl = '?point=' + $('#lradiusForm').val() + '&radius=' + $('#dradiusForm').val() + '&extracted=true';
        $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + '?point=' + $('#lradiusForm').val() + '&radius=' + $('#dradiusForm').val() + '&extracted=true');
        } else {
        sandbox.requestUrl = '?point=' + $('#lradiusForm').val() + '&radius=' + $('#dradiusForm').val();
        $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + '?point=' + $('#lradiusForm').val() + '&radius=' + $('#dradiusForm').val());
        }
        break;
    }
  },

  prepareRequest: function() {
    if ($.inArray(sandbox.requestType, sandbox.itemTypes) != -1) {
      requestString = sandbox.platsrEndpoint + sandbox.requestType + '/' + $('#uriForm').val() + '?prettyPrinting=true';
      console.log(requestString)
      sandbox.platsrRequest(requestString);
    } else if($.inArray(sandbox.requestType, sandbox.platsrMethods) != -1) {
      console.log('weehoo method exists');
    }
  }
}