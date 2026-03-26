import * as mentorRequestsService from '../services/mentorRequests.service.js';

export function getMentorRequests(req, res) {
  const requests = mentorRequestsService.getAllMentorRequests();
  res.status(200).json({ data: requests });
}

export function getMentorRequestById(req, res) {
  const request = mentorRequestsService.getMentorRequestById(req.params.request_id);
  if (!request) {
    return res.status(404).json({ message: 'Mentor request not found' });
  }

  return res.status(200).json({ data: request });
}

export function createMentorRequest(req, res) {
  const request = mentorRequestsService.createMentorRequest(req.body);
  res.status(201).json({ data: request });
}

export function updateMentorRequest(req, res) {
  const request = mentorRequestsService.updateMentorRequest(req.params.request_id, req.body);
  if (!request) {
    return res.status(404).json({ message: 'Mentor request not found' });
  }

  return res.status(200).json({ data: request });
}

export function deleteMentorRequest(req, res) {
  const request = mentorRequestsService.deleteMentorRequest(req.params.request_id);
  if (!request) {
    return res.status(404).json({ message: 'Mentor request not found' });
  }

  return res.status(200).json({ data: request });
}

export function acceptMentorRequest(req, res) {
  const request = mentorRequestsService.acceptMentorRequest(req.params.request_id);
  if (!request) {
    return res.status(404).json({ message: 'Mentor request not found' });
  }

  return res.status(200).json({ data: request });
}

export function rejectMentorRequest(req, res) {
  const request = mentorRequestsService.rejectMentorRequest(req.params.request_id);
  if (!request) {
    return res.status(404).json({ message: 'Mentor request not found' });
  }

  return res.status(200).json({ data: request });
}
