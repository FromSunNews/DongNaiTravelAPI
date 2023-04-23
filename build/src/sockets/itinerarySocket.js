"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTravelItinerary = void 0;
var _geolib = require("geolib");
var _OpenRouteServiceProvider = require("../providers/OpenRouteServiceProvider");
var _environtment = require("../config/environtment");
var _ChatGptProvider = require("../providers/ChatGptProvider");
var createTravelItinerary = function createTravelItinerary(io, socket, socketIdMap) {
  socket.on('c_create_travel_itinerary', function (data) {
    console.log('🚀 ~ file: itinerarySocket.js:8 ~ socket.on ~ data:', data);
    console.log('socketIdMap[data.currentUserId]: ', socketIdMap);
    _ChatGptProvider.ChatGptProvider.handleItineraryRequest(data.content, io, socketIdMap, data.currentUserId);
  });
};
exports.createTravelItinerary = createTravelItinerary;