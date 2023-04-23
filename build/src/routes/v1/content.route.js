"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.contentRoutes = void 0;
var _express = _interopRequireDefault(require("express"));
var _content = require("../../controllers/content.controller");
var _content2 = require("../../validations/content.validation");
var router = _express["default"].Router();
router.route('/create_new').post(_content.ContentController.createNew);
router.route('/text_to_speech').post(_content.ContentController.getTextToSpeech);
var contentRoutes = router;
exports.contentRoutes = contentRoutes;