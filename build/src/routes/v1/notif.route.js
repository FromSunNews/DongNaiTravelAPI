"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notifRoutes = void 0;
var _express = _interopRequireDefault(require("express"));
var _notif = require("../../controllers/notif.controller");
var router = _express["default"].Router();

// Create notif
router.route('/create_new').post(_notif.NotifController.createNewNotif);

// Get notifs
router.route('/get_notif').post(_notif.NotifController.getNotifs);

// Get notifs
router.route('/update').post(_notif.NotifController.updateNotif);

// Get notifs
router.route('/update_many').post(_notif.NotifController.updateManyNotifs);
var notifRoutes = router;
exports.notifRoutes = notifRoutes;