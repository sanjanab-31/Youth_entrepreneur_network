import * as usersService from '../services/users.service.js';

export function getUsers(req, res) {
  const users = usersService.getAllUsers();
  res.status(200).json({ data: users });
}

export function getUserById(req, res) {
  const user = usersService.getUserById(req.params.user_id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json({ data: user });
}

export function createUser(req, res) {
  const user = usersService.createUser(req.body);
  res.status(201).json({ data: user });
}

export function updateUser(req, res) {
  const user = usersService.updateUser(req.params.user_id, req.body);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json({ data: user });
}

export function deleteUser(req, res) {
  const user = usersService.deleteUser(req.params.user_id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json({ data: user });
}
