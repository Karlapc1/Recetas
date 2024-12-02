import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getRecipesByCategory } from '../services/recipeService';
import '../styles.css';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [favorites, setFavorites] = useState([]);
    const recipesPerPage = 5;

    useEffect(() => {
        // Cargar favoritos desde localStorage
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error al obtener las categorías:', error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory) {
            const fetchRecipes = async () => {
                try {
                    const data = await getRecipesByCategory(selectedCategory);
                    setRecipes(data);
                    setCurrentPage(1); // Resetear a la primera página cuando se selecciona una nueva categoría
                } catch (error) {
                    console.error('Error al obtener las recetas:', error);
                }
            };

            fetchRecipes();
        }
    }, [selectedCategory]);

    // Obtener las recetas actuales
    const indexOfLastRecipe = currentPage * recipesPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
    const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Manejar favoritos
    const handleFavorite = (recipe) => {
        let updatedFavorites;
        if (favorites.some(fav => fav.idMeal === recipe.idMeal)) {
            // Si ya es favorito, eliminarlo
            updatedFavorites = favorites.filter(fav => fav.idMeal !== recipe.idMeal);
        } else {
            // Si no es favorito, agregarlo
            updatedFavorites = [...favorites, recipe];
        }
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    return (
        <div className="categories">
            <h2>Recetas por Categoría</h2>
            <div className="category-select">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">Selecciona una categoría</option>
                    {categories.map(category => (
                        <option key={category.strCategory} value={category.strCategory}>
                            {category.strCategory}
                        </option>
                    ))}
                </select>
            </div>
            <div className="recipes">
                {currentRecipes.length ? (
                    currentRecipes.map(recipe => (
                        <div className="recipe" key={recipe.idMeal}>
                            <img src={recipe.strMealThumb} alt={recipe.strMeal} />
                            <h3>{recipe.strMeal}</h3>
                            <p>{recipe.strInstructions ? recipe.strInstructions.substring(0, 100) + '...' : 'No hay descripción disponible.'}</p>
                            <Link to={`/recipe/${recipe.idMeal}`} className="view-more-button">Ver Más</Link>
                            <button
                                className="favorite-button"
                                onClick={() => handleFavorite(recipe)}
                                aria-label={favorites.some(fav => fav.idMeal === recipe.idMeal) ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
                            >
                                {favorites.some(fav => fav.idMeal === recipe.idMeal) ? '⭐' : '☆'}
                            </button>
                        </div>
                    ))
                ) : (
                    selectedCategory && <p>No se encontraron recetas para esta categoría.</p>
                )}
            </div>
            <div className="pagination">
                {Array.from({ length: Math.ceil(recipes.length / recipesPerPage) }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={currentPage === index + 1 ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Categories;
