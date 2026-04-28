import api from '../../services/api';

export const fetchUsers = async () => {
    const response = await api.get('/v1/users');
    return Array.isArray(response.data?.data) ? response.data.data : [];
};