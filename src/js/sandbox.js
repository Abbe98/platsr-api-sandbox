$('#uriForm').keyup(function() {
  $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + sandbox.requestUrl + $('#uriForm').val());
});

$('#searchForm').keyup(function() {
  $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + 'place?text=' + $('#searchForm').val());
  sandbox.requestUrl = 'place?text=' + $('#searchForm').val();

  if ($('#extract').is(":checked")) {
    $('#requestUrlForm').val($('#requestUrlForm').val() + '&extracted=true');
    sandbox.requestUrl = sandbox.requestUrl + '&extracted=true';
  }
});

$('#bboxForm').keyup(function() {
  $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + 'place?bbox=' + $('#bboxForm').val());
  sandbox.requestUrl = 'place?bbox=' + $('#bboxForm').val();

  if ($('#extract').is(":checked")) {
    $('#requestUrlForm').val($('#requestUrlForm').val() + '&extracted=true');
    sandbox.requestUrl = sandbox.requestUrl + '&extracted=true';
  }
});

$('#lradiusForm').keyup(function() {
  $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + 'place?point=' + $('#lradiusForm').val() + '&radius=' + $('#dradiusForm').val());
  sandbox.requestUrl = sandbox.platsrEndpoint + 'place?point=' + $('#lradiusForm').val() + '&radius=' + $('#dradiusForm').val();

  if ($('#extract').is(":checked")) {
    $('#requestUrlForm').val($('#requestUrlForm').val() + '&extracted=true');
    sandbox.requestUrl = sandbox.requestUrl + '&extracted=true';
  }
});

$('#dradiusForm').keyup(function() {
  $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + 'place?point=' + $('#lradiusForm').val() + '&radius=' + $('#dradiusForm').val());
  sandbox.requestUrl = sandbox.platsrEndpoint + 'place?point=' + $('#lradiusForm').val() + '&radius=' + $('#dradiusForm').val();

  if ($('#extract').is(":checked")) {
    $('#requestUrlForm').val($('#requestUrlForm').val() + '&extracted=true');
    sandbox.requestUrl = sandbox.requestUrl + '&extracted=true';
  }
});

$('#extract').click(function() {
  if ($('#extract').is(":checked")) {
    $('#requestUrlForm').val($('#requestUrlForm').val() + '&extracted=true');
    sandbox.requestUrl = sandbox.requestUrl + '&extracted=true';
  } else {
    $('#requestUrlForm').val($('#requestUrlForm').val().replace('&extracted=true',''));
    sandbox.requestUrl = sandbox.requestUrl.replace('&extracted=true', '');
  }
});

$('#pointMapBtn').click(function() {
  sandbox.openModalPoint();
});

$('#bboxMapBtn').click(function() {
  sandbox.openModalBbox();
});

$('#copy').click(function() {
  // select request url(.copy-source)
  element = document.querySelector('.copy-source');
  range = document.createRange();
  range.selectNode(element);
  window.getSelection().addRange(range);

  // try copy selected url
  try {
    document.execCommand('copy');
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
})

sandbox = {
  sweref99: '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  epsg4326: '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs',
  map: null,
  mapCreated: false,
  areaSelect: null,
  mapMode: undefined,

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
      },
      error: function() {
        $('.alert').show();
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
        sandbox.requestType = 'text';

        if ($('#extract').is(":checked")) {
          sandbox.requestUrl = 'place?text=' + $('#searchForm').val() + '&extracted=true';
          $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + 'place?text=' + $('#searchForm').val() + '&extracted=true');
        } else {
          sandbox.requestUrl = 'place?text=' + $('#searchForm').val();
          $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + 'place?text=' + $('#searchForm').val());
        }
        break;
      case 'bbbox':
        $('#bboxField').show();
        $('#extractField').show();
        sandbox.requestType = 'bbbox';

        if ($('#extract').is(":checked")) {
          sandbox.requestUrl = 'place?bbox=' + $('#bboxForm').val() + '&extracted=true';
          $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + 'place?bbox=' + $('#bboxForm').val() + '&extracted=true');
        } else {
          sandbox.requestUrl = 'place?bbox=' + $('#bboxForm').val();
          $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + 'place?bbox=' + $('#bboxForm').val());
        }
        break;
      default: //radius
        $('#lradiusField').show();
        $('#extractField').show();
        sandbox.requestType = 'radius';

        if ($('#extract').is(":checked")) {
          sandbox.requestUrl = 'place?point=' + $('#lradiusForm').val() + '&radius=' + $('#dradiusForm').val() + '&extracted=true';
          $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + '?point=' + $('#lradiusForm').val() + '&radius=' + $('#dradiusForm').val() + '&extracted=true');
        } else {
          sandbox.requestUrl = 'place?point=' + $('#lradiusForm').val() + '&radius=' + $('#dradiusForm').val();
          $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + '?point=' + $('#lradiusForm').val() + '&radius=' + $('#dradiusForm').val());
        }
        break;
    }
  },

  prepareRequest: function() {
    if ($.inArray(sandbox.requestType, sandbox.itemTypes) != -1) {
      requestString = sandbox.platsrEndpoint + sandbox.requestType + '/' + $('#uriForm').val() + '?prettyPrinting=true';
      sandbox.platsrRequest(requestString);
    } else if($.inArray(sandbox.requestType, sandbox.platsrMethods) != -1) {
      sandbox.platsrRequest(sandbox.platsrEndpoint + sandbox.requestUrl + '&prettyPrinting=true');
    }
  },

  createMap: function() {
    if (!sandbox.mapCreated) {
      sandbox.map = L.map('leaflet').setView([59.3251172, 18.0710935], 10);
      L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors & <a href="http://openstreetmap.se/">OpenStreetMap Sverige</a>',
        maxZoom: 18,
        subdomains: 'abc'
      }).addTo(sandbox.map);
      sandbox.mapCreated = true;
    }
  },

  openModalPoint: function() {
    sandbox.mapMode = 'point';
    window.setTimeout(function() {
      sandbox.createMap();

      $('#leaflet').css('cursor', 'crosshair');

      sandbox.map.on('click', function(e) {
        if (sandbox.mapMode !== 'bbox') {
          l = proj4(sandbox.epsg4326, sandbox.sweref99, [e.latlng.lat, e.latlng.lng]);

          $('#lradiusForm').val(Math.round(l[0]) + ',' + Math.round(l[1]));
          $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + 'place?point=' + $('#lradiusForm').val() + '&radius=' + $('#dradiusForm').val());
          sandbox.requestUrl = sandbox.platsrEndpoint + 'place?point=' + $('#lradiusForm').val() + '&radius=' + $('#dradiusForm').val();

          if ($('#extract').is(":checked")) {
            $('#requestUrlForm').val($('#requestUrlForm').val() + '&extracted=true');
            sandbox.requestUrl = sandbox.requestUrl + '&extracted=true';
          }

          $('#modal').modal('hide');
          $('#leaflet').css('cursor', 'default');
        }
      });
    }, 500);
  },

  openModalBbox: function() {
    sandbox.mapMode = 'bbox';
    window.setTimeout(function() {
      sandbox.createMap();
      sandbox.areaSelect = L.areaSelect({width:200, height:300});
      sandbox.areaSelect.addTo(sandbox.map);
      $('#bboxSubmitBtn').show();

      $('#bboxSubmitBtn').click(function() {
        box = sandbox.areaSelect.getBounds();
        l = [];
        l[0] = proj4(sandbox.epsg4326, sandbox.sweref99, [box._northEast.lat, box._northEast.lng]);
        l[1] = proj4(sandbox.epsg4326, sandbox.sweref99, [box._southWest.lat, box._southWest.lng]);

          $('#bboxForm').val(Math.round(l[0][0]) + ',' + Math.round(l[0][1]) + ',' + Math.round(l[1][0]) + ',' + Math.round(l[1][1]));
          $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + 'place?bbox=' + $('#bboxForm').val());
          sandbox.requestUrl = sandbox.platsrEndpoint + 'place?bbox=' + $('#bboxForm').val();

        $('#bboxSubmitBtn').hide();
        $('#modal').modal('hide');
      });
    }, 500);
  }
}