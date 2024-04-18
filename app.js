const axios = require('axios')
const protobuf = require('protobufjs')

const apiUrl = 'http://20.19.98.194:8328/Api/api/gtfs-realtime'

async function decodeProtobufResponse(responseData) {
  const root = await protobuf.load('gtfs-realtime.proto')
  const FeedMessage = root.lookupType('transit_realtime.FeedMessage')
  const message = FeedMessage.decode(responseData)
  const jsonMessage = FeedMessage.toObject(message, {
    longs: String,
    enums: String,
    bytes: String,
  })
  return jsonMessage
}

async function makeRequestAndDecode() {
  try {
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' })
    const decodedResponse = await decodeProtobufResponse(response.data)
    console.log(JSON.stringify(decodedResponse, null, 2)) // Detailed logging
  } catch (error) {
    console.error('Error:', error)
  }
}

makeRequestAndDecode()
