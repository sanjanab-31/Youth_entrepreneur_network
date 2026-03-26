const users = [
  { id: 'u1', name: 'Alice Founder', email: 'alice@example.com', role: 'founder' },
  { id: 'u2', name: 'Mark Mentor', email: 'mark@example.com', role: 'mentor' }
];

export function getAllUsers() {
  return users;
}

export function getUserById(userId) {
  return users.find((user) => user.id === userId) || null;
}

export function createUser(payload = {}) {
  const newUser = {
    id: `u${users.length + 1}`,
    name: payload.name || 'New User',
    email: payload.email || `new-user-${users.length + 1}@example.com`,
    role: payload.role || 'founder'
  };

  users.push(newUser);
  return newUser;
}

export function updateUser(userId, payload = {}) {
  const user = getUserById(userId);
  if (!user) {
    return null;
  }

  Object.assign(user, payload);
  return user;
}

export function deleteUser(userId) {
  const index = users.findIndex((user) => user.id === userId);
  if (index === -1) {
    return null;
  }

  const [deletedUser] = users.splice(index, 1);
  return deletedUser;
}