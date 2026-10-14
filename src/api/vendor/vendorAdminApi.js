import apiClient from '../apiClient'

const API_PREFIX = '/api/vendor_admin'

export const vendorAdminApi = {
  getActivityReviews(activityId) {
    return apiClient.get(`${API_PREFIX}/activityreviews`, {
      params: {
        vendorActivityId: activityId,
      },
    })
  },

  deleteActivityReview(activityId, reviewId) {
    return apiClient.delete(`${API_PREFIX}/activityreviews/delete/${reviewId}`)
  },

  getTop5Activities() {
    return apiClient.get(`${API_PREFIX}/activity/top5`)
  },

  getActivitiesByUserId(userId, token) {
    return apiClient.get(`${API_PREFIX}/activity/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  checkTimeConflict(vendorId, activityId, startTime, endTime) {
    return apiClient.get(`${API_PREFIX}/activity/checkConflictDetail`, {
      params: {
        vendorId,
        activityId,
        startTime,
        endTime,
      },
    })
  },

  checkTimeConflicts(vendorId, startTime, endTime) {
    return apiClient.get(`${API_PREFIX}/activity/checkConflict`, {
      params: {
        vendorId,
        startTime,
        endTime,
      },
    })
  },

  getActivity(activityId) {
    return apiClient.get(`${API_PREFIX}/vendor_admin_activityDetail`, {
      params: {
        id: activityId,
      },
    })
  },

  getActivityRegistrations(activityId) {
    return apiClient.get(`${API_PREFIX}/activity/registration`, {
      params: {
        activityId,
      },
    })
  },

  acceptRegister(registerId) {
    return apiClient.put(`${API_PREFIX}/registration/confirmById/${registerId}`)
  },

  rejectRegister(registerId) {
    return apiClient.put(`${API_PREFIX}/registration/cancelById/${registerId}`)
  },

  // API 需要修改
  notifyMember(memberId, activityId, title, content, token) {
    return apiClient.post(`${API_PREFIX}/registration/notification/${memberId}/${activityId}`, {
      params: {
        title,
        content,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  deleteRegister(registerId) {
    return apiClient.delete(`${API_PREFIX}/registration/deleteById/${registerId}`)
  },

  getActivitiesByUserIdWithoutToken(userId) {
    return apiClient.get(`${API_PREFIX}/activity/${userId}`)
  },

  addActivity(
    vendorId,
    activityName,
    typeId,
    description,
    address,
    startTime,
    endTime,
    isRegistrationRequired,
    maxParticipants,
    images
  ) {
    const formdata = new FormData()
    formdata.append('vendorId', vendorId)
    formdata.append('activityName', activityName)
    formdata.append('typeId', typeId)
    formdata.append('description', description)
    formdata.append('address', address)
    formdata.append('startTime', startTime)
    formdata.append('endTime', endTime)
    formdata.append('isRegistrationRequired', isRegistrationRequired)
    formdata.append('maxParticipants', maxParticipants)
    images.forEach((image) => {
      formdata.append('files', image.file)
    })

    return apiClient.post(`${API_PREFIX}/add`, formdata)
  },

  updateActivity(
    vendorId,
    activityId,
    activityName,
    typeId,
    description,
    address,
    startTime,
    endTime,
    isRegistrationRequired,
    maxParticipants,
    deletedImageIds,
    images
  ) {
    const formData = new FormData()

    formData.append('vendorId', vendorId)
    formData.append('activityId', activityId)
    formData.append('activityName', activityName)
    formData.append('typeId', typeId)
    formData.append('description', description)
    formData.append('address', address)
    formData.append('startTime', startTime)
    formData.append('endTime', endTime)
    formData.append('isRegistrationRequired', isRegistrationRequired)
    formData.append('maxParticipants', maxParticipants)

    deletedImageIds.forEach((id) => formData.append('deletedImageIds', id))

    images.forEach((img) => formData.append('files', img.file))

    return apiClient.put(`${API_PREFIX}/update`, formData)
  },

  getActivityTypes() {
    return apiClient.get(`${API_PREFIX}/activity/allTypes`)
  },

  // API要修改
  updateEvent(id, eventId, eventTitle, startTime, endTime, color) {
    return apiClient.put(`${API_PREFIX}/calendar/update/${eventId}`, null, {
      params: {
        id, // 重複
        eventId, // 重複
        eventTitle,
        start_time: startTime,
        end_time: endTime,
        color,
      },
    })
  },

  getCalendarByVendor(vendorId) {
    return apiClient.get(`${API_PREFIX}/calendar/${vendorId}`)
  },

  addCalendar(vendorId, eventTitle, startTime, endTime, color) {
    const formData = new FormData()
    formData.append('vendorId', vendorId)
    formData.append('eventTitle', eventTitle)
    formData.append('start_time', startTime)
    formData.append('end_time', endTime)
    formData.append('color', color)

    return apiClient.post(`${API_PREFIX}/calendar/add`, formData)
  },

  // API 需要修改
  updateCalendar(eventId, eventTitle, startTime, endTime, color) {
    return apiClient.put(`${API_PREFIX}/calendar/update/${eventId}`, null, {
      params: {
        eventTitle,
        start_time: startTime,
        end_time: endTime,
        color: color,
      },
    })
  },

  deleteCalendar(eventId) {
    return apiClient.delete(`${API_PREFIX}/calendar/delete/${eventId}`)
  },

  getCertificationByVendorId(vendorId) {
    return apiClient.get(`${API_PREFIX}/certification/${vendorId}`)
  },

  isCertificationExisiting(vendorId, tagId) {
    return apiClient.get(`${API_PREFIX}/certification/exists/${vendorId}/${tagId}`)
  },

  addCertification(vendorId, tagId) {
    const formData = new FormData()
    formData.append('vendorId', vendorId)
    formData.append('tagId', tagId)

    return apiClient.post(`${API_PREFIX}/certification/add`, formData)
  },

  deleteCertification(recordId) {
    return apiClient.delete(`${API_PREFIX}/certification/delete/${recordId}`)
  },

  getProfile(vendorId, token) {
    return apiClient.get(`${API_PREFIX}/profile`, {
      params: { vendorId },
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  getVendorReviews(vendorId) {
    return apiClient.get(`${API_PREFIX}/review`, { params: { vendorId } })
  },

  getVendorReviewById(reviewId) {
    return apiClient.get(`${API_PREFIX}/vendor-reviews/${reviewId}`)
  },

  deleteVendorReview(reviewId) {
    return apiClient.delete(`${API_PREFIX}/vendor-reviews/${reviewId}`)
  },

  getUserStatus(userId) {
    return apiClient.get(`${API_PREFIX}/status/${userId}`)
  },

  deleteActivity(activityId) {
    return apiClient.delete(`${API_PREFIX}/${activityId}`)
  },

  getActivityPhotos(activityId, token) {
    return apiClient.get(`${API_PREFIX}/photos/ids`, {
      params: { vendorActivityId: activityId },
      headers: { Authorization: `Bearer ${token}` },
    })
  },

  getActivityPhotoById(photoId, token) {
    return apiClient.get(`${API_PREFIX}/photos/download`, {
      params: { photoId },
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob',
    })
  },
}
