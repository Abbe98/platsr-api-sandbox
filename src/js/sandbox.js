var sandbox = {
  sweref99: '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  epsg4326: '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs',
  map: null,
  mapCreated: false,
  areaSelect: null,
  mapMode: undefined,
  activeMethod: undefined,
  initized: false,

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
        $('#resultContainer').focus();
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
    if (!sandbox.initized && sandbox.getUrlParameter('uri')) {
      $('#uriForm').val(sandbox.getUrlParameter('uri'));
    } else {
      $('#uriForm').val('');
    }

    if (!sandbox.initized && sandbox.getUrlParameter('text')) {
      $('#searchForm').val(sandbox.getUrlParameter('text'));
    } else {
      $('#searchForm').val('');
    }

    if (!sandbox.initized && sandbox.getUrlParameter('bbox')) {
      $('#bboxForm').val(sandbox.getUrlParameter('bbox'));
    } else {
      $('#bboxForm').val('');
    }

    if (!sandbox.initized && sandbox.getUrlParameter('point')) {
      $('#lradiusForm').val(sandbox.getUrlParameter('point'));
    } else {
      $('#lradiusForm').val('');
    }

    if (!sandbox.initized && sandbox.getUrlParameter('radius')) {
      $('#dradiusForm').val(sandbox.getUrlParameter('radius'));
    } else {
      $('#dradiusForm').val('');
    }

    if (!sandbox.initized && sandbox.getUrlParameter('archiveObject')) {
      $('#archiveObjectUrlForm').val(sandbox.getUrlParameter('archiveObject'));
    } else {
      $('#archiveObjectUrlForm').val('');
    }

    if (!sandbox.initized && sandbox.getUrlParameter('userId')) {
      $('#userIdField').val(sandbox.getUrlParameter('userId'));
    } else {
      $('#userIdField').val('');
    }

    // hide all fields by default
    $('#fieldContainer').children().hide();
    // clear active elements
    $('.active').removeClass('active');
    // set new active btn
    $('#' + method).addClass('active');
    // update dummy URL
    $('#requestUrlForm').val(sandbox.dummyUrlPlaceholder + method);
    // show uri field for all methods
    $('#uriField').show();
    // save method
    sandbox.activeMethod = method;

    if (method == 'place') {
      $('#extractField').show();

      $('#userIdSet').show();
      sandbox.setUserIdParameter();

      $('#searchField').show();
      sandbox.setTextParameter();
      $('#bboxField').show();
      sandbox.setBBoxParameter();
      $('#lradiusField').show();
      sandbox.setPointParameter();
      $('#archiveObjectUrlSet').show();
      sandbox.setArchiveObjectUrlParameter();

    } else if (method != 'copyright' && method != 'user') {
      $('#userIdSet').show();
      sandbox.setUserIdParameter();
    }

    if (sandbox.getUrlParameter('method') && !sandbox.initized) {
      sandbox.displayRelevantFields();
    }

    if (sandbox.getUrlParameter('uri')) {
      sandbox.setItemUri();
    }

    if (sandbox.getUrlParameter('run') && sandbox.initized == false) {
      sandbox.platsrRequest();
    }

    sandbox.initized = true;
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
    if (!sandbox.initized && sandbox.getUrlParameter('extracted')) {
      $('#extract').attr('checked', true);
    } else {
      $('#extract').attr('checked', false);
    }
    sandbox.setExtractParameter();

    if (!sandbox.initized && sandbox.getUrlParameter('sortBy')) {
      $('#sortDescField').attr('checked', true);
    } else {
      $('#sortDescField').attr('checked', false);
    }
    sandbox.setSortParameter();

    if (!sandbox.initized && sandbox.getUrlParameter('orderBy')) {
      $('#orderByModifiedField').attr('checked', true);
    } else {
      $('#orderByModifiedField').attr('checked', false);
    }
    sandbox.setOrderByParameter();

    if (!sandbox.initized && sandbox.getUrlParameter('limit')) {
      $('#limitField').val(sandbox.getUrlParameter('limit'));
    } else {
      $('#limitField').val('');
    }
  },

  getUrlParameter: function(parameter) {
    var url = window.location.search.substring(1);
    var vars = url.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (pair[0].toLowerCase() == parameter.toLowerCase()) {
        return pair[1];
      }
    }
    return(false);
  },

  buildQueryParameter: function() {
    var queryValue = $('#requestUrlForm').val().replace(sandbox.dummyUrlPlaceholder, '');
    console.log(queryValue)
    if (queryValue.indexOf('?') >= 0) {
      queryValue = queryValue.replace('?', '&');
      return '?method=' + queryValue;
    } else {
      var pair = queryValue.split('/');
      if (pair[1] != undefined) {
        return '?method=' + pair[0] + '&uri=' + pair[1];
      }
    }
  },

  getQueryLink: function() {
    var base = window.location.pathname.replace(/index\.html.+/g, '');
    return base + sandbox.buildQueryParameter();
  }
}