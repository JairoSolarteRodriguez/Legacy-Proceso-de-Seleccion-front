import React from 'react';
import { useSelector } from 'react-redux';
import usercss from './User.module.css';
const User = () => {

    const {user} = useSelector(state => state.auth)

    const handleLogout = () => {
        try {
            localStorage.removeItem('firstLogin')
            localStorage.removeItem('loggedAgoraUser')
            window.location.href = "/";
        } catch (err) {
            window.location.href = "/";
        }
    }

    return (
        <>
        <div className='d-flex align-items-center pointer box-logut'>
            <i className="far fa-user icon-user"/>
            <span className='text-user'>{user.names}</span>
            <i className="fas fa-chevron-down icon-arrow"/>
        <div className="logout d-flex flex-column justify-content-center">
            <span className='logout__text'>Editar perfil</span>
            <span className='logout__text' onClick={handleLogout}>Cerrar Sesión</span>
        </div>
        </div>
        </>
    )
}

export default User
