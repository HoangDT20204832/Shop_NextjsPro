import { io } from 'socket.io-client'
//kết nối tới socket ở phía server
const connectSocketIO = () => {
  const socket = io("http://localhost:3001")

  return socket
}
export default connectSocketIO