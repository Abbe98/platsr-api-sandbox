var sandbox = {
  sweref99: '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  epsg4326: '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs',
  map: null,
  mapCreated: false,
  areaSelect: null,
  mapMode: undefined,
  activeMethod: undefined,

  platsrEndpoint: 'http://gae-proxy-platsr.appspot.com/platsr/api/v1/', // CORS enabled proxy
  dummyUrlPlaceholder: 'http://www.platsr.se/platsr/api/v1/',

  setExtractParameter: function() {
    if ($('#extract').is(':checked')) {
      $('#requestUrlForm').val(URI($('#requestUrlForm').val())
        .removeSearch('extracted')
        .addSearch('extracted', 'true')
        .readable());
    } else {
      $('#requestUrlForm').val(URI($('#requestUrlForm').val())
        .removeSearch('extracted'));
    }
  },

  setUserIdParameter: function() {
    if ($('#userIdField').val() !== '') {
            $('#requestUrlForm').val(URI($('#requestUrlForm').val())
              .removeSearch('userId')
              .addSearch('userId', $('#userIdField').val())
              .readable());
    } else {
      $('#requestUrlForm').val(URI($('#requestUrlForm').val())
        .removeSearch('userId'));
    }
  },

  setArchiveObjectUrlParameter: function() {
    if ($('#archiveObjectUrlField').val() !== '') {
      $('#requestUrlForm').val(
        URI($('#requestUrlForm').val())
          .removeSearch('archiveObjectUrl')
          .addSearch('archiveObjectUrl', $('#archiveObjectUrlField').val())
          .readable());
    } else {
      $('#requestUrlForm').val(URI($('#requestUrlForm').val())
        .removeSearch('archiveObjectUrl'));
    }
  },

  setOrderByParameter: function() {
    if ($('#userIdField').val() !== '' || $('#archiveObjectUrlField').val() !== '') {
      if ($('#orderByModifiedField').is(':checked')) {
        $('#requestUrlForm').val(URI($('#requestUrlForm').val())
          .removeSearch('orderBy')
          .addSearch('orderBy', 'modified')
          .readable());
      } else {
        $('#requestUrlForm').val(URI($('#requestUrlForm').val())
          .removeSearch('orderBy'));
      }
    }
  },

  setSortParameter: function() {
    if ($('#userIdField').val() !== '' || $('#archiveObjectUrlField').val() !== '') {
      if ($('#sortDescField').is(':checked')) {
        $('#requestUrlForm').val(URI($('#requestUrlForm').val())
          .removeSearch('sortBy')
          .addSearch('sortBy', 'desc')
          .readable());
      } else {
        $('#requestUrlForm').val(URI($('#requestUrlForm').val())
          .removeSearch('sortBy'));
      }
    }
  },

  setLimitParameter: function() {
    if ($('#userIdField').val() !== '' || $('#archiveObjectUrlField').val() !== '') {
      if ($('#limitField').val() !== '') {
        $('#requestUrlForm').val(URI($('#requestUrlForm').val())
          .removeSearch('limit')
          .addSearch('limit', $('#limitField').val())
          .readable());
      } else {
        $('#requestUrlForm').val(URI($('#requestUrlForm').val())
          .removeSearch('limit'));
      }
    }
  },

  setTextParameter: function() {
    if ($('#searchForm').val() !== '') {
      $('#requestUrlForm').val(URI($('#requestUrlForm').val())
        .removeSearch('text')
        .addSearch('text', $('#searchForm').val())
        .readable());
    } else {
      $('#requestUrlForm').val(URI($('#requestUrlForm').val())
        .removeSearch('text'));
    }
  },

  setRadiusParameter: function() {
    if ($('#dradiusForm').val() !== '' && $('#lradiusForm').val() !== '') {
      $('#requestUrlForm').val(URI($('#requestUrlForm').val())
        .removeSearch('radius')
        .addSearch('radius', $('#dradiusForm').val())
        .readable());
    } else {
      $('#requestUrlForm').val(URI($('#requestUrlForm').val())
        .removeSearch('radius'));
    }
  },

  setPointParameter: function() {
    if ($('#lradiusForm').val() !== '') {
      $('#requestUrlForm').val(URI($('#requestUrlForm').val())
        .removeSearch('point')
        .addSearch('point', $('#lradiusForm').val())
        .readable());
    } else {
      $('#requestUrlForm').val(URI($('#requestUrlForm').val())
        .removeSearch('point'));
    }
  },

  setBBoxParameter: function() {
    if ($('#bboxForm').val() !== '') {
      $('#requestUrlForm').val(URI($('#requestUrlForm').val())
        .removeSearch('bbox')
        .addSearch('bbox', $('#bboxForm').val())
        .readable());
    } else {
      $('#requestUrlForm').val(URI($('#requestUrlForm').val())
        .removeSearch('bbox'));
    }
  },

  setItemUri: function() {
    if ($('#uriForm').val() !== '') {
      $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + sandbox.activeMethod + '/' + $('#uriForm').val());
    } else {
      $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + sandbox.activeMethod);
    }
  },

  platsrRequest: function() {
    requestString = URI($('#requestUrlForm').val().replace(sandbox.dummyUrlPlaceholder, sandbox.platsrEndpoint)).addSearch('prettyPrinting', 'true');

    $.ajax({
      url: requestString,
      dataType: 'text',
      success: function(result) {
        result = result.replace(/</g, '&lt;');
        result = result.replace(/>/g, '&gt;');

        $('#resultContainer').text(result);
        hljs.initHighlighting.called = false;
        hljs.initHighlighting();
      },
      error: function() {
        $('.alert').show();
      }
    });
  },

  init: function(method) {
    // empty code container
    $('#resultContainer').empty();
    // reset all optional fields
    sandbox.resetOptionalFields();
    // reset all other fields
    $('#uriForm').val('');
    $('#searchForm').val('');
    $('#bboxForm').val('');
    $('#lradiusForm').val('');
    $('#dradiusForm').val('');
    $('#archiveObjectUrlField').val('');
    $('#userIdField').val('');
    // hide all fields by default
    $('#fieldContainer').children().hide();
    // clear active elements
    $('.active').removeClass('active');
    // update dummy URL
    $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + method);
    // all methods supports URIs? #TODO
    $('#uriField').show();
    // save method
    sandbox.activeMethod = method;

    if (method == 'place') {
      $('#extractField').show();

      $('#userIdSet').show();

      $('#searchField').show();
      $('#bboxField').show();
      $('#lradiusField').show();
      $('#archiveObjectUrlSet').show();

    } else if (method == 'copyright') {
      //do nothing.
    } else {
      $('#userIdSet').show();
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
          l = proj4(sandbox.epsg4326, sandbox.sweref99, [e.latlng.lng, e.latlng.lat]);

          $('#lradiusForm').val(Math.round(l[0]) + ',' + Math.round(l[1]));
          sandbox.setPointParameter();
          sandbox.displayRelevantFields();

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
        l[0] = proj4(sandbox.epsg4326, sandbox.sweref99, [box._northEast.lng, box._northEast.lat]);
        l[1] = proj4(sandbox.epsg4326, sandbox.sweref99, [box._southWest.lng, box._southWest.lat]);

          $('#bboxForm').val(Math.round(l[0][0]) + ',' + Math.round(l[0][1]) + ',' + Math.round(l[1][0]) + ',' + Math.round(l[1][1]));
          sandbox.setBBoxParameter();
          sandbox.displayRelevantFields();

        $('#bboxSubmitBtn').hide();
        $('#modal').modal('hide');
      });
    }, 500);
  },

  displayRelevantFields: function() {
    $('#uriField').hide();
    $('#extractField').hide();
    $('#userIdSet').hide();
    $('#archiveObjectUrlSet').hide();
    $('#optionalGroup').hide();
    $('#searchField').hide();
    $('#bboxField').hide();
    $('#lradiusField').hide();
    $('#dradiusField').hide();

    if ($('#uriForm').val() == '') {
      if ($('#searchForm').val() == '') {
        if ($('#bboxForm').val() == '') {
          if ($('#lradiusForm').val() == '' && $('#dradiusForm').val() == '') {
            if ($('#archiveObjectUrlField').val() == '' && $('#userIdField').val() == '') {
              sandbox.init(sandbox.activeMethod);
            } else {
              if (sandbox.activeMethod == 'place') {
                $('#extractField').show();
              }
              sandbox.resetOptionalFields();
              $('#optionalGroup').show();
              if ($('#archiveObjectUrlField').val() !== '') {
                $('#archiveObjectUrlSet').show();
              } else {
                sandbox.resetOptionalFields();
                $('#userIdSet').show();
              }
            }
          } else {
            sandbox.resetOptionalFields();
            $('#lradiusField').show();
            $('#dradiusField').show();
            $('#extractField').show();
          }
        } else {
          sandbox.resetOptionalFields();
          $('#bboxField').show();
          $('#extractField').show();
        }
      } else {
        sandbox.resetOptionalFields();
        $('#searchField').show();
        $('#extractField').show();
      }
    } else {
      sandbox.resetOptionalFields();
      $('#uriField').show();
    }
  },

  resetOptionalFields: function() {
    $('#extract').attr('checked', false);
    sandbox.setExtractParameter();

    $('#sortDescField').attr('checked', false);
    sandbox.setSortParameter();

    $('#orderByModifiedField').attr('checked', false);
    sandbox.setOrderByParameter();

    $('#limitField').val('');
    sandbox.setLimitParameter();
  }
}