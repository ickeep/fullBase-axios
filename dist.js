'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Http = function () {
  function Http() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$conf = _ref.conf,
        conf = _ref$conf === undefined ? {} : _ref$conf,
        _ref$format = _ref.format,
        format = _ref$format === undefined ? { errno: 'errno', errmsg: 'errmsg', token: 'token', data: 'data' } : _ref$format,
        _ref$hosts = _ref.hosts,
        hosts = _ref$hosts === undefined ? {} : _ref$hosts,
        _ref$trim = _ref.trim,
        trim = _ref$trim === undefined ? false : _ref$trim;

    (0, _classCallCheck3.default)(this, Http);

    var dfConf = {
      timeout: 30000,
      responseType: 'json',
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    };

    this.conf = (0, _assign2.default)(dfConf, conf);
    this.hosts = hosts;
    this.format = format;
    this.dataDf = {};
    this.dataDf[format.errno] = '';
    this.dataDf[format.errmsg] = '';
    this.dataDf[format.data] = {};
    this.trim = trim;
    this.axios = _axios2.default.create(this.conf);
  }

  Http.prototype.stringParse = function stringParse(data) {
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        data = (0, _assign2.default)({}, this.dataDf);
      }
    }
    return data;
  };

  Http.prototype.serialize = function serialize(query) {
    var _this = this;

    var apart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '?';

    var urlText = '';
    if ((typeof query === 'undefined' ? 'undefined' : (0, _typeof3.default)(query)) === 'object') {
      (0, _keys2.default)(query).forEach(function (key) {
        var value = query[key];
        _this.trim && value && typeof value.trim === 'function' ? value = value.trim() : '';
        if (typeof value !== 'undefined' && value !== 'undefined' && value !== '') {
          if (apart === '?') {
            urlText += '&' + key + '=' + value;
          } else {
            urlText += '/' + key + '/' + value;
          }
        }
      });
    }
    return urlText.replace(/^&/, '?');
  };

  Http.prototype.processUrl = function processUrl(url) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var apart = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '?';

    var hostKeys = (0, _keys2.default)(this.hosts);
    var newUrl = url;
    for (var i = 0; i < hostKeys.length; i += 1) {
      var tmpKey = hostKeys[i];
      if (url.indexOf('/' + tmpKey + '/') === 0) {
        newUrl = url.replace('/' + tmpKey, this.hosts[tmpKey]);
        newUrl = '' + newUrl + this.serialize(opt, apart);
        break;
      }
    }

    return newUrl;
  };

  Http.prototype.errHandle = function errHandle(e) {
    var tmpData = {};
    tmpData[this.format.errno] = 600;
    tmpData[this.format.errmsg] = e.message;
    return (0, _assign2.default)(this.dataDf, tmpData);
  };

  Http.prototype.resultHandle = function resultHandle(res) {
    var tokenKey = this.format.token;
    var reqToken = res.config && res.config.headers ? res.config.headers[tokenKey] : '';
    var resToken = res.headers ? res.headers[tokenKey] : '';
    var token = '';
    if (resToken && resToken !== reqToken) {
      token = resToken;
    }
    var tmpData = {};
    if (res.status !== 200) {
      tmpData[this.format.errno] = res.status;
      tmpData[this.format.errmsg] = res.statusText;
    } else {
      tmpData = this.stringParse(res.data);
    }
    if (token) {
      tmpData[tokenKey] = token;
    }
    return (0, _assign2.default)(this.dataDf, tmpData);
  };

  Http.prototype.get = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(url) {
      var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var conf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var res;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              res = void 0;
              _context.prev = 1;
              _context.next = 4;
              return this.axios.get(this.processUrl(url, opt), conf);

            case 4:
              res = _context.sent;
              _context.next = 13;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context['catch'](1);

              console.log(_context.t0);

              if (_context.t0.response) {
                _context.next = 12;
                break;
              }

              return _context.abrupt('return', this.errHandle(_context.t0));

            case 12:
              res = _context.t0.response;

            case 13:
              return _context.abrupt('return', this.resultHandle(res));

            case 14:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[1, 7]]);
    }));

    function get(_x5) {
      return _ref2.apply(this, arguments);
    }

    return get;
  }();

  Http.prototype.post = function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(url) {
      var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var conf = arguments[2];
      var res;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              res = void 0;

              if (this.trim) {
                (0, _keys2.default)(opt).forEach(function (key) {
                  var value = opt[key];
                  typeof value.trim === 'function' ? opt[key] = value.trim() : '';
                });
              }
              _context2.prev = 2;
              _context2.next = 5;
              return this.axios.post(this.processUrl(url), opt, conf);

            case 5:
              res = _context2.sent;
              _context2.next = 14;
              break;

            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2['catch'](2);

              console.log(_context2.t0);

              if (_context2.t0.response) {
                _context2.next = 13;
                break;
              }

              return _context2.abrupt('return', this.errHandle(_context2.t0));

            case 13:
              res = _context2.t0.response;

            case 14:
              return _context2.abrupt('return', this.resultHandle(res));

            case 15:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this, [[2, 8]]);
    }));

    function post(_x8) {
      return _ref3.apply(this, arguments);
    }

    return post;
  }();

  return Http;
}();

exports.default = Http;
