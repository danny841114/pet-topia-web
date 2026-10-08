import apiClient from '../apiClient'

const API_PREFIX = '/chatRoom/api'

export const chatRoomApi = {
  uploadPhotos(userId, image) {
    return apiClient.post(`${API_PREFIX}/uploadPhoto`, {
      userId,
      image,
    })
  },

  getMessages(senderId, receiverId) {
    return apiClient.get(`${API_PREFIX}/getChatMessagesHistory`, {
      params: {
        senderId,
        receiverId,
      },
    })
  },
}
