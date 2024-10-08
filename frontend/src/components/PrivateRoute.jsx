import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PropTypes from 'prop-types';

export default function PrivateRoute({ children, requiredRole }) {
    const { currentUser, isSessionValid } = useAuth()

    if (!currentUser || !isSessionValid()) {
        return <Navigate to="/login" />
    }

    if (requiredRole && currentUser.role !== requiredRole) {
        return <Navigate to="/login" />
    }

    return children;
}

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
    requiredRole: PropTypes.string,
};