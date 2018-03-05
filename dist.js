'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Http = function () {
  function Http(_ref) {
    var _ref$conf = _ref.conf,
        conf = _ref$conf === undefined ? {} : _ref$conf,
        _ref$format = _ref.format,
        format = _ref$format === undefined ? { errno: 'errno', errmsg: 'errmsg', token: 'token', data: 'data' } : _ref$format,
        _ref$hosts = _ref.hosts,
        hosts = _ref$hosts === undefined ? {} : _ref$hosts;

    _classCallCheck(this, Http);

    var dfConf = {
      timeout: 30000,
      responseType: 'json',
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    };

    this.conf = Object.assign(dfConf, conf);
    this.hosts = hosts;
    this.format = format;
    this.dataDf = {};
    this.dataDf[format.errno] = '';
    this.dataDf[format.errmsg] = '';
    this.dataDf[format.data] = {};
    this.axios = _axios2.default.create(this.conf);
  }

  Http.prototype.stringParse = function stringParse(data) {
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        data = Object.assign({}, this.dataDf);
      }
    }
    return data;
  };

  Http.prototype.serialize = function serialize(query) {
    var apart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '?';

    var urlText = '';
    if ((typeof query === 'undefined' ? 'undefined' : _typeof(query)) === 'object') {
      Object.keys(query).forEach(function (key) {
        if (typeof query[key] !== 'undefined' && query[key] !== 'undefined' && query[key] !== '') {
          if (apart === '?') {
            urlText += '&' + key + '=' + query[key];
          } else {
            urlText += '/' + key + '/' + query[key];
          }
        }
      });
    }
    return urlText.replace(/^&/, '?');
  };

  Http.prototype.processUrl = function processUrl(url) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var apart = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '?';

    var hostKeys = Object.keys(this.hosts);
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
    return Object.assign(this.dataDf, tmpData);
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
    return Object.assign(this.dataDf, tmpData);
  };

  Http.prototype.get = function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(url) {
      var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var conf = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var res;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              res = void 0;
              _context.prev = 1;
              _context.next = 4;
              return this.axios.get(this.processUrl(url, opt), conf);

            case 4:
              res = _context.sent;
              _context.next = 12;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context['catch'](1);

              if (_context.t0.response) {
                _context.next = 11;
                break;
              }

              return _context.abrupt('return', this.errHandle(_context.t0));

            case 11:
              res = _context.t0.response;

            case 12:
              return _context.abrupt('return', this.resultHandle(res));

            case 13:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[1, 7]]);
    }));

    function get(_x4) {
      return _ref2.apply(this, arguments);
    }

    return get;
  }();

  Http.prototype.post = function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(url) {
      var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var conf = arguments[2];
      var res;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              res = void 0;
              _context2.prev = 1;
              _context2.next = 4;
              return this.axios.post(this.processUrl(url), opt, conf);

            case 4:
              res = _context2.sent;
              _context2.next = 12;
              break;

            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2['catch'](1);

              if (_context2.t0.response) {
                _context2.next = 11;
                break;
              }

              return _context2.abrupt('return', this.errHandle(_context2.t0));

            case 11:
              res = _context2.t0.response;

            case 12:
              return _context2.abrupt('return', this.resultHandle(res));

            case 13:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this, [[1, 7]]);
    }));

    function post(_x7) {
      return _ref3.apply(this, arguments);
    }

    return post;
  }();

  return Http;
}();

exports.default = Http;
