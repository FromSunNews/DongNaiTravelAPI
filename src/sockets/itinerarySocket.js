import { findNearest, getDistance } from 'geolib'
import { OpenRouteServiceProvider } from 'providers/OpenRouteServiceProvider'
import { env } from 'config/environtment'
import { ChatGptProvider } from 'providers/ChatGptProvider'

export const createTravelItinerary = (io, socket, socketIdMap) => {
  socket.on('c_create_travel_itinerary', async (data) => {
    console.log('🚀 ~ file: itinerarySocket.js:8 ~ socket.on ~ data:', data)

    console.log('socketIdMap[data.currentUserId]: ', socketIdMap)
    await ChatGptProvider.handleItineraryCreate(data.question, data.travelPlaces, data.fnbPlaces, io, socketIdMap, data.currentUserId)
  })
}
