import React, { useState, useEffect } from 'react';
import { getRecipes } from '../services/recipeService';
import Recipe from './RecipeList.js';
import './styles.css';

const HomePage = () => {
    const [recipes, setRecipes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recipesPerPage = 10;

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const data = await getRecipes();
                setRecipes(data);
                setCurrentPage(1); // Resetear a la primera página al cargar recetas
            } catch (error) {
                console.error('Error al obtener las recetas:', error);
            }
        };

        fetchRecipes();
    }, []);

    // Obtener las recetas actuales
    const indexOfLastRecipe = currentPage * recipesPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
    const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

    // Cambiar de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <main>
            <header>
                <div className="header-content">
                    <h1>Bienvenido a la Página de Recetas</h1>
                    <p>Explora nuestras deliciosas recetas.</p>
                    <a href="/favorites" className="explore-button">Ver Favoritos</a>
                </div>
            </header>
            <section className="recipes">
                {currentRecipes.length ? (
                    currentRecipes.map(recipe => (
                        <Recipe key={recipe.idMeal} recipe={recipe} />
                    ))
                ) : (
                    <p>No se encontraron recetas.</p>
                )}
            </section>
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
        </main>
    );
};

export default HomePage;
