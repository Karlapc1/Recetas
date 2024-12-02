// src/components/AddedRecipes.js
import React, { useState, useEffect } from 'react';
import { getAddedRecipes } from '../services/recipeService';
import '../styles.css';
import api from '../services/api';  // Importar el servicio de API

const AddedRecipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchAddedRecipes = async () => {
      try {
        const data = await getAddedRecipes();
        setRecipes(data);
      } catch (error) {
        console.error('Error al obtener las recetas añadidas:', error);
      }
    };

    fetchAddedRecipes();
  }, []);

  return (
    <div className="recipes">
      <h2>Recetas Añadidas</h2>
      {recipes.length ? (
        recipes.map(recipe => (
          <div className="recipe" key={recipe.idMeal}>
            <img src={recipe.strMealThumb} alt={recipe.strMeal} />
            <h3>{recipe.strMeal}</h3>
            <button className="view-more-button">Ver Más</button>
          </div>
        ))
      ) : (
        <p>No se han añadido recetas.</p>
      )}
    </div>
  );
};

export default AddedRecipes;
