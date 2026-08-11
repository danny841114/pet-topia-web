import axios from 'axios'

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/vendor_admin`,
  timeout: 10000,
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export const vendorAdminApi = {
  getActivityReviews(activityId) {
    return apiClient.get(`/activityreviews`, {
      params: {
        vendorActivityId: activityId,
      },
      headers: {
        Accept: 'application/json',
      },
    })
  },

  deleteActivityReview(activityId, reviewId) {
    return apiClient.delete(`/activityreviews/delete/${reviewId}`)
  },

  getTop5Activities() {
    return apiClient.get('/activity/top5')
  },

  getActivitiesByUserId(userId, token) {
    return apiClient.get(`/activity/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  },

  checkTimeConflict(vendorId, activityId, startTime, endTime) {
    return apiClient.get(`/activity/checkConflictDetail`, {
      params: {
        vendorId,
        activityId,
        startTime,
        endTime,
      },
    })
  },

  checkTimeConflicts(vendorId, startTime, endTime) {
    return apiClient.get(`/activity/checkConflict`, {
      params: {
        vendorId,
        startTime,
        endTime,
      },
    })
  },

  getActivity(activityId) {
    return apiClient.get(`/vendor_admin_activityDetail`, {
      params: {
        activityId,
      },
    })
  },

  getActivityRegistrations(activityId) {
    return apiClient.get(`/activity/registration`, {
      params: {
        activityId,
      },
      headers: {
        Accept: 'application/json',
      },
    })
  },

  acceptRegister(registerId) {
    return apiClient.put(`/registration/confirmById/${registerId}`)
  },

  rejectRegister(registerId) {
    return apiClient.put(`/registration/cancelById/${registerId}`)
  },

  // API 需要修改
  notifyMember(memberId, activityId, title, content, token) {
    return apiClient.post(`/registration/notification/${memberId}/${activityId}`, {
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
    return apiClient.delete(`/registration/deleteById/${registerId}`)
  },

  getActivitiesByUserIdWithoutToken(userId) {
    return apiClient.get(`/activity/${userId}`, {
      headers: {
        Accept: `application/json`,
      },
    })
  },

  addActivity(
    vendorId,
    activityName,
    activityTypeId,
    activityDescription,
    activityAddress,
    startTime,
    endTime,
    isRegistrationRequired,
    maxParticipants,
    imagePreviews
  ) {
    const formdata = new FormData()
    formdata.append('vendor_id', vendorId)
    formdata.append('activity_name', activityName)
    formdata.append('activity_type_id', activityTypeId)
    formdata.append('activity_description', activityDescription)
    formdata.append('activity_address', activityAddress)
    formdata.append('start_time', startTime)
    formdata.append('end_time', endTime)
    formdata.append('is_registration_required', isRegistrationRequired)
    formdata.append('max_participants', maxParticipants)
    imagePreviews.forEach((preview) => {
      formdata.append('files', preview.file)
    })

    return apiClient.post(`/add`, formdata)
  },

  getActivityTypes() {
    return apiClient.get(`/activity/allTypes`)
  },

  // API要修改
  updateEvent(id, eventId, eventTitle, startTime, endTime, color) {
    return apiClient.put(`/calendar/update/${eventId}`, null, {
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
    return apiClient.get(`/calendar/${vendorId}`)
  },

  addCalendar(vendorId, eventTitle, startTime, endTime, color) {
    const formData = new FormData()
    formData.append('vendorId', vendorId)
    formData.append('eventTitle', eventTitle)
    formData.append('start_time', startTime)
    formData.append('end_time', endTime)
    formData.append('color', color)

    return apiClient.post(`/calendar/add`, formData)
  },

  // API 需要修改
  updateCalendar(eventId, eventTitle, startTime, endTime, color) {
    return apiClient.put(`/calendar/update/${eventId}`, null, {
      params: {
        eventTitle,
        start_time: startTime,
        end_time: endTime,
        color: color,
      },
    })
  },

  deleteCalendar(eventId) {
    return apiClient.delete(`/calendar/delete/${eventId}`)
  },

  getCertificationByVendorId(vendorId) {
    return apiClient.get(`/certification/${vendorId}`)
  },

  isCertificationExisiting(vendorId, tagId) {
    return apiClient.get(`/certification/exists/${vendorId}/${tagId}`)
  },

  addCertification(vendorId, tagId) {
    const formData = new FormData()
    formData.append('vendorId', vendorId)
    formData.append('tagId', tagId)

    return apiClient.post(`/certification/add`, formData)
  },

  deleteCertification(recordId) {
    return apiClient.get(`/certification/delete/${recordId}`)
  },

  getProfile(vendorId, token) {
    return apiClient.get(`/profile`, {
      params: vendorId,
      headers: { Authorization: `Bearer ${token}` },
    })
  },
}
