// src/components/UserProfile.js
import React, { useState } from 'react';
import '../styles.css'; // Asegúrate de que este archivo CSS esté actualizado

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    profileImage: '/path/to/default-image.jpg',
    recipes: ['Receta 1', 'Receta 2'] // Ejemplo de recetas añadidas
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState('');
  const [editedName, setEditedName] = useState(userInfo.name);
  const [editedEmail, setEditedEmail] = useState(userInfo.email);

  const handleImageChange = (e) => {
    setNewImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleSave = () => {
    if (newImage) {
      setUserInfo((prevInfo) => ({ ...prevInfo, profileImage: newImage }));
    }
    setUserInfo((prevInfo) => ({ ...prevInfo, name: editedName, email: editedEmail }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNewImage('');
    setEditedName(userInfo.name);
    setEditedEmail(userInfo.email);
    setIsEditing(false);
  };

  return (
    <div className="user-profile">
      <h1>Perfil de Usuario</h1>
      <div className="profile-info">
        <img src={userInfo.profileImage} alt="Profile" className="profile-image" />
        <div className="profile-details">
          {isEditing ? (
            <>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
              />
              <input 
                type="text" 
                value={editedName} 
                onChange={(e) => setEditedName(e.target.value)} 
                placeholder="Nombre" 
              />
              <input 
                type="email" 
                value={editedEmail} 
                onChange={(e) => setEditedEmail(e.target.value)} 
                placeholder="Correo Electrónico" 
              />
              <button onClick={handleSave}>Guardar</button>
              <button onClick={handleCancel}>Cancelar</button>
            </>
          ) : (
            <>
              <p><strong>Nombre:</strong> {userInfo.name}</p>
              <p><strong>Email:</strong> {userInfo.email}</p>
              <button onClick={() => setIsEditing(true)}>Editar Perfil</button>
            </>
          )}
        </div>
      </div>
      <div className="user-recipes">
        <h2>Recetas Añadidas</h2>
        {userInfo.recipes.length > 0 ? (
          <ul>
            {userInfo.recipes.map((recipe, index) => (
              <li key={index}>{recipe}</li>
            ))}
          </ul>
        ) : (
          <p>No has añadido ninguna receta todavía.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
