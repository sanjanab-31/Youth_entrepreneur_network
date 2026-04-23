import * as mentorRequestsService from '../services/mentorRequests.service.js';

export async function getMentorRequests(req, res) {
  try {
    const requests = await mentorRequestsService.getAllMentorRequests();
    res.status(200).json({ data: requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getMentorRequestById(req, res) {
  try {
    const request = await mentorRequestsService.getMentorRequestById(req.params.request_id);
    if (!request) {
      return res.status(404).json({ message: 'Mentor request not found' });
    }
    return res.status(200).json({ data: request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createMentorRequest(req, res) {
  try {
    const request = await mentorRequestsService.createMentorRequest(req.body);
    res.status(201).json({ data: request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateMentorRequest(req, res) {
  try {
    const request = await mentorRequestsService.updateMentorRequest(req.params.request_id, req.body);
    if (!request) {
      return res.status(404).json({ message: 'Mentor request not found' });
    }
    return res.status(200).json({ data: request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteMentorRequest(req, res) {
  try {
    const request = await mentorRequestsService.deleteMentorRequest(req.params.request_id);
    if (!request) {
      return res.status(404).json({ message: 'Mentor request not found' });
    }
    return res.status(200).json({ data: request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function acceptMentorRequest(req, res) {
  try {
    const request = await mentorRequestsService.acceptMentorRequest(req.params.request_id);
    if (!request) {
      return res.status(404).json({ message: 'Mentor request not found' });
    }
    return res.status(200).json({ data: request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function rejectMentorRequest(req, res) {
  try {
    const request = await mentorRequestsService.rejectMentorRequest(req.params.request_id);
    if (!request) {
      return res.status(404).json({ message: 'Mentor request not found' });
    }
    return res.status(200).json({ data: request });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

