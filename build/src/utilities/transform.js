"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pickUser = void 0;
var _lodash = require("lodash");
var pickUser = function pickUser(user) {
  if (!user) return {};
  return (0, _lodash.pick)(user, ['_id', 'email', 'username', 'displayName', 'avatar', 'coverPhoto', 'role', 'location', 'savedSuggestions', 'savedPlaces', 'followerIds', 'followingIds', 'notifIds', 'receivePoints', 'lostPoints', 'birthday', 'createdAt', 'updatedAt']);
};
exports.pickUser = pickUser;