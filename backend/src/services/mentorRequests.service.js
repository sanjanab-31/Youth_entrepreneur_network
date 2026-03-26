const mentorRequests = [
  { id: 'mr1', startupId: 's1', mentorId: 'u2', status: 'pending' }
];

export function getAllMentorRequests() {
  return mentorRequests;
}

export function getMentorRequestById(requestId) {
  return mentorRequests.find((request) => request.id === requestId) || null;
}

export function createMentorRequest(payload = {}) {
  const newRequest = {
    id: `mr${mentorRequests.length + 1}`,
    startupId: payload.startupId || null,
    mentorId: payload.mentorId || null,
    status: 'pending'
  };

  mentorRequests.push(newRequest);
  return newRequest;
}

export function updateMentorRequest(requestId, payload = {}) {
  const request = getMentorRequestById(requestId);
  if (!request) {
    return null;
  }

  Object.assign(request, payload);
  return request;
}

export function deleteMentorRequest(requestId) {
  const index = mentorRequests.findIndex((request) => request.id === requestId);
  if (index === -1) {
    return null;
  }

  const [deletedRequest] = mentorRequests.splice(index, 1);
  return deletedRequest;
}

export function acceptMentorRequest(requestId) {
  const request = getMentorRequestById(requestId);
  if (!request) {
    return null;
  }

  request.status = 'accepted';
  return request;
}

export function rejectMentorRequest(requestId) {
  const request = getMentorRequestById(requestId);
  if (!request) {
    return null;
  }

  request.status = 'rejected';
  return request;
}
