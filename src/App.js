import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './styles.css';
import { getRecipes } from './services/recipeService';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import RecipeDetail from './components/RecipeDetail';
import AddRecipe from './components/AddRecipe';
import Favorites from './components/Favorites';
import Categories from './components/Categories';
import AddedRecipes from './components/AddedRecipes'; // Importa el nuevo componente
import UserProfile from './components/UserProfile'; // Importa el nuevo componente de perfil de usuario

const ITEMS_PER_PAGE = 12;

function App() {
    const [recipes, setRecipes] = useState([]);
    const [paginatedRecipes, setPaginatedRecipes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [language, setLanguage] = useState('es');
    const [favorites, setFavorites] = useState([]);
    const [searchMessage, setSearchMessage] = useState('');

    useEffect(() => {
        // Cargar favoritos desde localStorage
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            const fetchRecipes = async () => {
                try {
                    const data = await getRecipes();
                    setRecipes(data || []);
                    setCurrentPage(1); // Resetear la página actual al obtener recetas
                } catch (error) {
                    console.error('Error al obtener las recetas:', error);
                }
            };

            fetchRecipes();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (recipes.length > ITEMS_PER_PAGE) {
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            setPaginatedRecipes(recipes.slice(startIndex, endIndex));
        } else {
            setPaginatedRecipes(recipes);
        }
    }, [recipes, currentPage]);

    const handleSearch = async (event) => {
        event.preventDefault();
        const searchTerm = event.target.elements.searchInput.value.trim();
        try {
            const data = await getRecipes(searchTerm);
            if (data && data.length > 0) {
                setRecipes(data);
                setSearchMessage('');
            } else {
                setRecipes([]);
                setSearchMessage('No se encontraron recetas para el término de búsqueda.');
            }
        } catch (error) {
            console.error('Error al buscar recetas:', error);
            setRecipes([]);
            setSearchMessage('Error al buscar recetas. Por favor, intenta de nuevo.');
        }
    };

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    const handleRegister = (userData) => {
        console.log('Registrando usuario:', userData);
        setIsAuthenticated(true);
        setShowRegisterForm(false);
    };

    const handleLogin = (loginData) => {
        console.log('Iniciando sesión con:', loginData);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    const switchToRegister = () => {
        setShowRegisterForm(true);
    };

    const switchToLogin = () => {
        setShowRegisterForm(false);
    };

    const addToFavorites = (recipe) => {
        if (favorites.some(fav => fav.idMeal === recipe.idMeal)) {
            return;
        }
        const updatedFavorites = [...favorites, recipe];
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    const removeFromFavorites = (recipeId) => {
        const updatedFavorites = favorites.filter(recipe => recipe.idMeal !== recipeId);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(recipes.length / ITEMS_PER_PAGE);

    return (
        <Router>
            <div className="App">
                {!isAuthenticated ? (
                    showRegisterForm ? (
                        <div className="register-form-container">
                            <RegisterForm onRegister={handleRegister} switchToLogin={switchToLogin} />
                        </div>
                    ) : (
                        <div className="login-form-container">
                            <LoginForm onLogin={handleLogin} switchToRegister={switchToRegister} />
                        </div>
                    )
                ) : (
                    <>
                        <header>
                            <nav>
                                <ul>
                                    <li><Link to="/">Inicio</Link></li>
                                    <li><Link to="/categories">Categorías</Link></li>
                                    <li><Link to="/add-recipe">Añadir Receta</Link></li>
                                    <li><Link to="/favorites">Favoritos</Link></li>
                                    <li><Link to="/added-recipes">Recetas Añadidas</Link></li> {/* Nuevo enlace */}
                                </ul>
                                <div className="nav-right">
                                    <Link to="/profile">Perfil</Link>
                                    <a href="#" onClick={handleLogout}>Cerrar sesión</a>
                                </div>
                            </nav>
                            <div className="header-content">
                                <h1>Todo para los amantes de la cocina</h1>
                                <p>Recetas tradicionales con los mejores ingredientes.</p>
                                <form onSubmit={handleSearch} className="search-form">
                                    <input
                                        type="text"
                                        name="searchInput"
                                        placeholder="Buscar recetas..."
                                        className="search-input"
                                    />
                                    <button type="submit" className="search-button">Buscar</button>
                                </form>
                                {searchMessage && <p className="search-message">{searchMessage}</p>}
                            </div>
                        </header>

                        <main>
                            <Routes>
                                <Route path="/" element={
                                    <div>
                                        <div className="recipes">
                                            {paginatedRecipes.length ? (
                                                paginatedRecipes.map(recipe => (
                                                    <div className="recipe" key={recipe.idMeal}>
                                                        <img src={recipe.strMealThumb} alt={recipe.strMeal} />
                                                        <div className="recipe-name">{recipe.strMeal}</div>
                                                        <Link to={`/recipe/${recipe.idMeal}`} className="view-more-button">Ver Más</Link>
                                                        <button
                                                            className="favorite-button"
                                                            onClick={() => addToFavorites(recipe)}
                                                        >
                                                            {favorites.some(fav => fav.idMeal === recipe.idMeal) ? '⭐' : '☆'}
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>{searchMessage || 'No se encontraron recetas.'}</p>
                                            )}
                                        </div>
                                        {recipes.length > ITEMS_PER_PAGE && (
                                            <div className="pagination">
                                                {Array.from({ length: totalPages }, (_, index) => (
                                                    <button
                                                        key={index + 1}
                                                        onClick={() => handlePageChange(index + 1)}
                                                        className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                                                    >
                                                        {index + 1}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                } />
                                <Route path="/categories" element={<Categories />} />
                                <Route path="/recipe/:id" element={<RecipeDetail addToFavorites={addToFavorites} />} />
                                <Route path="/add-recipe" element={<AddRecipe />} />
                                <Route path="/favorites" element={<Favorites favorites={favorites} removeFromFavorites={removeFromFavorites} />} />
                                <Route path="/added-recipes" element={<AddedRecipes />} /> {/* Nueva ruta */}
                                <Route path="/profile" element={<UserProfile />} /> {/* Nueva ruta */}
                            </Routes>
                        </main>

                        <footer>
                            <div className="footer-section">
                                <h3>Envío gratuito de ingredientes</h3>
                                <p>¡Recibe los ingredientes de tu receta directamente en tu puerta sin costo adicional! Solo en áreas seleccionadas.</p>
                            </div>
                            <div className="footer-section">
                                <h3>Recetas veganas</h3>
                                <p>Explora nuestra colección de recetas veganas deliciosas y saludables, ideales para todos los gustos y necesidades dietéticas.</p>
                            </div>
                            <div className="footer-section">
                                <h3>Consejos de cocina</h3>
                                <p>Descubre trucos y técnicas de cocina que te ayudarán a mejorar tus habilidades culinarias y a preparar platos exquisitos.</p>
                            </div>
                            <div className="footer-section">
                                <h3>Los mejores ingredientes</h3>
                                <p>Seleccionamos los ingredientes más frescos y de alta calidad para tus recetas. Conoce más sobre nuestros proveedores y productos.</p>
                            </div>
                        </footer>
                    </>
                )}
            </div>
        </Router>
    );
}

export default App;
