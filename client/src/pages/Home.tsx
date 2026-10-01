import React from 'react';
import { Link } from 'react-router-dom';
//import { FaHoneyPot, FaLeaf, FaMedal, FaShippingFast } from 'react-icons/fa';
import '../styles/global.css';
import '../styles/products.css';
import '../styles/Home.css';
import { useEffect, useState } from 'react';
import { fetchProducts } from '../api/productService';

type Product = Awaited<ReturnType<typeof fetchProducts>>[number] & {
    origine?: string;
};

// 👇 Préfixe de base : '/' en dev, '/miel-ecommerce/' en build de production
const BASE = import.meta.env.BASE_URL;

const Home: React.FC = () => {
      const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const products = await fetchProducts();
                setFeaturedProducts(products);
                setLoading(false);
            } catch (err) {
                setError('Erreur lors du chargement des produits');
                setLoading(false);
                console.error(err);
            }
        };

        loadProducts();
    }, []);
    return (
        <div className="home-container">
            {/* Hero Banner */}
            <section className="hero-banner">
                <div className="hero-content">
                    <h1 className="heading-primary--main">Miels d'exception du Cameroun</h1>
                    <p className="heading-primary--sub">Découvrez nos miels 100% naturels, récoltés par des apiculteurs passionnés</p>
                    <Link to="/boutique" className="cta-button-banner">Découvrir la boutique</Link>
                </div>
            </section>

            {/* Featured Products */}
            <section className="featured-products">
                <h2 className="heading-secondary">Nos miels à l'honneur</h2>

                {loading ? (
                    <div className="loading-spinner">Chargement...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <div className="products-grid">
                        {featuredProducts.slice(0, 4).map((product) => (
                            <div key={product._id} className="product-card">
                                <img 
                                    src={product.images[0]} 
                                    alt={product.name}
                                    className="product-image"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `${BASE}images/placeholder-honey.jpg`;
                                    }}
                                />
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <p className="product-origin">{product.origine}</p>
                                    <p className="product-price">
                                        À partir de {product.contenants[0].prix} XAF
                                    </p>
                                    <Link 
                                        to={`/produit/${product._id}`} 
                                        className="view-product"
                                    >
                                        Voir les options
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Quality Promise */}
            <section className="quality-promise">
                <h2 className="heading-secondary">Notre engagement qualité</h2>
                <div className="promise-grid">
                    <div className="promise-item">
                        {/* <FaLeaf className="promise-icon" /> */}
                        <h3>100% Naturel</h3>
                        <p>Aucun additif ni conservateur</p>
                    </div>
                    <div className="promise-item">
                        {/* <FaMedal className="promise-icon" /> */}
                        <h3>Qualité Premium</h3>
                        <p>Sélection rigoureuse des producteurs</p>
                    </div>
                    <div className="promise-item">
                        {/* <FaHoneyPot className="promise-icon" /> */}
                        <h3>Production éthique</h3>
                        <p>Respect des abeilles et de l'environnement</p>
                    </div>
                    <div className="promise-item">
                        {/* <FaShippingFast className="promise-icon" /> */}
                        <h3>Livraison rapide</h3>
                        <p>Expédition sous 48h</p>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="about-section">
                <h2 className="heading-secondary about-section-heading">Notre passion pour le miel camerounais</h2>

                <div className="about-content-wrapper">
                    <div className="about-content">
                        <p>
                            Depuis 2015, nous collaborons avec des apiculteurs locaux pour vous proposer 
                            les meilleurs miels des différentes régions du Cameroun. Chaque pot de miel 
                            raconte une histoire et reflète le terroir unique de sa région d'origine.
                        </p>
                        <div className="about-cta">
                            <Link to="/blog" className="cta-button secondary">Découvrir notre histoire</Link>
                            <Link to="/contact" className="cta-button">Nous contacter</Link>
                        </div>
                    </div>
                    <div className="composition">
                        <img src={`${BASE}images/aaron-burden-6csuZQ9oZcI-unsplash.jpg`} alt="Apiculteur camerounais" className="composition__photo composition__photo composition__photo--p1" />
                        <img src={`${BASE}images/benyamin-bohlouli-Rcj302Npzis-unsplash.jpg`} alt="Miels camerounais" className="composition__photo composition__photo composition__photo--p2" />
                        <img src={`${BASE}images/gerardo-covarrubias--_Tzr3lFNH8-unsplash.jpg`} alt="Apiculture au Cameroun" className="composition__photo composition__photo composition__photo--p3" />
                    </div>
                </div>
            </section>

            {/* Honey Categories */}
            <section className="categories-section">
                <h2 className="heading-secondary">Découvrez nos catégories</h2>
                <div className="categories-grid">
                    <Link to="/boutique?category=monofloral" className="category-card">
                        <img src={`${BASE}images/benyamin-bohlouli-Rcj302Npzis-unsplash.jpg`} alt="Miels monofloraux" />
                        <h3>Miels monofloraux</h3>
                    </Link>
                    <Link to="/boutique?category=polyfloral" className="category-card">
                        <img src={`${BASE}images/matthias-munning-Ci2etarp4zI-unsplash.jpg`} alt="Miels polyfloraux" />
                        <h3>Miels polyfloraux</h3>
                    </Link>
                    <Link to="/boutique?category=special" className="category-card">
                        <img src={`${BASE}images/gerardo-covarrubias--_Tzr3lFNH8-unsplash.jpg`} alt="Produits spéciaux" />
                        <h3>Coffrets cadeaux</h3>
                    </Link>
                </div>
            </section>
        </div>
    );
};


export default Home

















// import React from 'react';
// import { Link } from 'react-router-dom';
// //import { FaHoneyPot, FaLeaf, FaMedal, FaShippingFast } from 'react-icons/fa';
// import '../styles/global.css';
// import '../styles/products.css';
// import '../styles/Home.css';
// import { useEffect, useState } from 'react';
// import { fetchProducts } from '../api/productService';



// const Home: React.FC = () => {
//       const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const loadProducts = async () => {
//             try {
//                 const products = await fetchProducts();
//                 setFeaturedProducts(products);
//                 setLoading(false);
//             } catch (err) {
//                 setError('Erreur lors du chargement des produits');
//                 setLoading(false);
//                 console.error(err);
//             }
//         };

//         loadProducts();
//     }, []);
//     return (
//         <div className="home-container">
//             {/* Hero Banner */}
//             <section className="hero-banner">
//                 <div className="hero-content">
//                     <h1 className="heading-primary--main">Miels d'exception du Cameroun</h1>
//                     <p className="heading-primary--sub">Découvrez nos miels 100% naturels, récoltés par des apiculteurs passionnés</p>
//                     <Link to="/boutique" className="cta-button-banner">Découvrir la boutique</Link>
//                 </div>
//             </section>

//             {/* Featured Products */}
//             <section className="featured-products">
//                 <h2 className="heading-secondary">Nos miels à l'honneur</h2>
                
//                 {loading ? (
//                     <div className="loading-spinner">Chargement...</div>
//                 ) : error ? (
//                     <div className="error-message">{error}</div>
//                 ) : (
//                     <div className="products-grid">
//                         {featuredProducts.slice(0, 4).map((product) => (
//                             <div key={product._id} className="product-card">
//                                 <img 
//                                     src={product.images} 
//                                     alt={product.name}
//                                     className="product-image"
//                                     onError={(e) => {
//                                         (e.target as HTMLImageElement).src = '/placeholder-honey.jpg';
//                                     }}
//                                 />
//                                 <div className="product-info">
//                                     <h3>{product.name}</h3>
//                                     <p className="product-origin">{product.origine}</p>
//                                     <p className="product-price">
//                                         À partir de {product.contenants[0].prix} XAF
//                                     </p>
//                                     <Link 
//                                         to={`/produit/${product._id}`} 
//                                         className="view-product"
//                                     >
//                                         Voir les options
//                                     </Link>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </section>

//             {/* Quality Promise */}
//             <section className="quality-promise">
//                 <h2 className="heading-secondary">Notre engagement qualité</h2>
//                 <div className="promise-grid">
//                     <div className="promise-item">
//                         {/* <FaLeaf className="promise-icon" /> */}
//                         <h3>100% Naturel</h3>
//                         <p>Aucun additif ni conservateur</p>
//                     </div>
//                     <div className="promise-item">
//                         {/* <FaMedal className="promise-icon" /> */}
//                         <h3>Qualité Premium</h3>
//                         <p>Sélection rigoureuse des producteurs</p>
//                     </div>
//                     <div className="promise-item">
//                         {/* <FaHoneyPot className="promise-icon" /> */}
//                         <h3>Production éthique</h3>
//                         <p>Respect des abeilles et de l'environnement</p>
//                     </div>
//                     <div className="promise-item">
//                         {/* <FaShippingFast className="promise-icon" /> */}
//                         <h3>Livraison rapide</h3>
//                         <p>Expédition sous 48h</p>
//                     </div>
//                 </div>
//             </section>

//             {/* About Section */}
//             <section className="about-section">
//                 <h2 className="heading-secondary about-section-heading">Notre passion pour le miel camerounais</h2>
                
//                 <div className="about-content-wrapper">
//                     <div className="about-content">
//                         <p>
//                             Depuis 2015, nous collaborons avec des apiculteurs locaux pour vous proposer 
//                             les meilleurs miels des différentes régions du Cameroun. Chaque pot de miel 
//                             raconte une histoire et reflète le terroir unique de sa région d'origine.
//                         </p>
//                         <div className="about-cta">
//                             <Link to="/blog" className="cta-button secondary">Découvrir notre histoire</Link>
//                             <Link to="/contact" className="cta-button">Nous contacter</Link>
//                         </div>
//                     </div>
//                     <div className="composition">
//                         <img src="/images/aaron-burden-6csuZQ9oZcI-unsplash.jpg" alt="Apiculteur camerounais" className="composition__photo composition__photo composition__photo--p1" />
//                         <img src="/images/benyamin-bohlouli-Rcj302Npzis-unsplash.jpg" alt="Miels camerounais" className="composition__photo composition__photo composition__photo--p2" />
//                         <img src="/images/gerardo-covarrubias--_Tzr3lFNH8-unsplash.jpg" alt="Apiculture au Cameroun" className="composition__photo composition__photo composition__photo--p3" />
//                     </div>
//                 </div>
//             </section>

//             {/* Honey Categories */}
//             <section className="categories-section">
//                 <h2 className="heading-secondary">Découvrez nos catégories</h2>
//                 <div className="categories-grid">
//                     <Link to="/boutique?category=monofloral" className="category-card">
//                         <img src="/images/benyamin-bohlouli-Rcj302Npzis-unsplash.jpg" alt="Miels monofloraux" />
//                         <h3>Miels monofloraux</h3>
//                     </Link>
//                     <Link to="/boutique?category=polyfloral" className="category-card">
//                         <img src="/images/matthias-munning-Ci2etarp4zI-unsplash.jpg" alt="Miels polyfloraux" />
//                         <h3>Miels polyfloraux</h3>
//                     </Link>
//                     <Link to="/boutique?category=special" className="category-card">
//                         <img src="/images/gerardo-covarrubias--_Tzr3lFNH8-unsplash.jpg" alt="Produits spéciaux" />
//                         <h3>Coffrets cadeaux</h3>
//                     </Link>
//                 </div>
//             </section>
//         </div>
//     );
// };


// export default Home