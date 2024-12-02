import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRecipeDetails, addCommentToRecipe, rateRecipe, getLocalRecipeData } from '../services/recipeService';
import '../styles.css';

const RecipeDetail = ({ addToFavorites }) => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const data = await getRecipeDetails(id);
        setRecipe(data);
        const localData = getLocalRecipeData();
        if (localData[data.idMeal]) {
          setComments(localData[data.idMeal].comments || []);
          setRating(localData[data.idMeal].rating || 0);
        }
      } catch (error) {
        console.error('Error al obtener detalles de la receta:', error);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleCommentChange = (e) => setComment(e.target.value);

  const submitComment = () => {
    if (comment.trim() === '') return;
    addCommentToRecipe(recipe.idMeal, comment);
    setComments([...comments, comment]);
    setComment('');
  };

  const submitRating = () => {
    if (rating < 1 || rating > 5) return; // Validar rating
    rateRecipe(recipe.idMeal, rating);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.strMeal,
          text: `Check out this recipe: ${recipe.strMeal}`,
          url: window.location.href // O la URL de la receta específica
        });
        console.log('Recipe shared successfully');
      } else {
        console.log('Share API not supported');
      }
    } catch (error) {
      console.error('Error sharing recipe:', error);
    }
  };

  if (!recipe) return <p>Cargando...</p>;

  return (
    <div className="recipe-detail">
      {/* Botones de navegación */}
      <div className="navigation-buttons">
        <button className="favorites-button" onClick={() => addToFavorites(recipe)}>
          <span role="img" aria-label="star">⭐</span> Agregar a Favoritos
        </button>
        <button className="back-button">
          <Link to="/">Volver</Link>
        </button>
      </div>

      <img src={recipe.strMealThumb} alt={recipe.strMeal} />
      <button className="share-button" onClick={handleShare}>
        Compartir
      </button>
      <h1>{recipe.strMeal}</h1>
      <h2>{recipe.strCategory}</h2>
      <h3>{recipe.strArea}</h3>
      <h4>Ingredientes:</h4>
      <ul>
        {Array.from({ length: 20 }, (_, index) => (
          recipe[`strIngredient${index + 1}`] && (
            <li key={index}>
              {recipe[`strIngredient${index + 1}`]} - {recipe[`strMeasure${index + 1}`]}
            </li>
          )
        ))}
      </ul>
      <h4>Instrucciones:</h4>
      <p>{recipe.strInstructions}</p>

      <div className="rating-section">
        <h4>Calificación</h4>
        <div className="rating-checklist">
          {[1, 2, 3, 4, 5].map((value) => (
            <div key={value} className="rating-option">
              <input 
                type="radio" 
                id={`rating-${value}`} 
                name="rating" 
                value={value} 
                checked={rating === value} 
                onChange={() => handleRatingChange(value)} 
              />
              <label htmlFor={`rating-${value}`}>{value} Estrella{value > 1 ? 's' : ''}</label>
            </div>
          ))}
        </div>
        <button onClick={submitRating}>Calificar</button>
        <div className="selected-rating">
          {[...Array(rating)].map((_, index) => (
            <span key={index} role="img" aria-label="star">⭐</span>
          ))}
          {[...Array(5 - rating)].map((_, index) => (
            <span key={index} role="img" aria-label="star-outline">☆</span>
          ))}
          <span>{rating}/5</span>
        </div>
      </div>

      <div className="comments-section">
        <h4>Comentarios</h4>
        <textarea 
          value={comment} 
          onChange={handleCommentChange} 
          placeholder="Añade un comentario"
        />
        <button onClick={submitComment}>Enviar Comentario</button>
        <div className="comments-list">
          {comments.map((c, index) => (
            <p key={index}>{c}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
