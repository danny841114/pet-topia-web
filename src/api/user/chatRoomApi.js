import axios from 'axios'

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/chatRoom/api`,
  timeout: 10000,
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const chatRoomApi = {
  uploadPhotos(userId, image) {
    return apiClient.post('/uploadPhoto', {
      userId,
      image,
    })
  },

  getMessages(senderId, receiverId) {
    return apiClient.get('/getChatMessagesHistory', {
      params: {
        senderId,
        receiverId,
      },
    })
  },
}
