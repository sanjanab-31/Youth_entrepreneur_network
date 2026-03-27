import * as usersService from '../services/users.service.js';

export async function getUsers(req, res) {
  try {
    const users = await usersService.getAllUsers();
    return res.status(200).json({ data: users });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
}

export async function getUserById(req, res) {
  try {
    const user = await usersService.getUserById(req.params.user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch user' });
  }
}

export async function createUser(req, res) {
  try {
    const user = await usersService.createUser(req.body);
    return res.status(201).json({ data: user });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create user' });
  }
}

export async function updateUser(req, res) {
  try {
    const user = await usersService.updateUser(req.params.user_id, req.body);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update user' });
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await usersService.deleteUser(req.params.user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete user' });
  }
}
