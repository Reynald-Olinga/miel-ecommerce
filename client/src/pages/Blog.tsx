import React, { useState } from 'react';
import styles from '../styles/blog.module.css';

// 👇 Préfixe de base : '/' en dev, '/miel-ecommerce/' en build de production
const BASE = import.meta.env.BASE_URL;

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  date: string;
  category: string;
};

const Blog = () => {
  const [blogPosts] = useState<BlogPost[]>([
    {
      id: 1,
      title: 'Les bienfaits du miel pour la santé',
      excerpt: 'Découvrez comment le miel peut améliorer votre santé au quotidien.',
      content:
        'Le miel est une source naturelle d’antioxydants, de vitamines et de minéraux. Il possède des propriétés antibactériennes et cicatrisantes, utiles pour soulager les maux de gorge, améliorer la digestion et renforcer le système immunitaire. Consommé avec modération, il peut remplacer le sucre raffiné dans de nombreuses recettes.',
      imageUrl: `${BASE}images/karyna-panchenko-yIjeu2mU1RM-unsplash.jpg`,
      date: '15 mai 2023',
      category: 'Santé',
    },
    {
      id: 2,
      title: 'Notre récolte de printemps',
      excerpt: 'Retour sur notre récolte exceptionnelle de miel.',
      content:
        'Ce printemps, nos abeilles ont butiné des champs de fleurs sauvages, donnant naissance à un miel doré et parfumé. Grâce à un climat idéal et un soin rigoureux, la récolte a été plus riche que prévu. Chaque pot contient l’essence de nos terroirs et le travail minutieux de nos apiculteurs.',
      imageUrl: `${BASE}images/shot--IHRgDwYjc8-unsplash.jpg`,
      date: '10 avril 2023',
      category: 'Actualités',
    },
    {
      id: 3,
      title: 'Les différents types de miel',
      excerpt: 'Acacia, lavande, châtaignier… Découvrez leurs goûts et bienfaits.',
      content:
        'Chaque type de miel possède une couleur, une texture et un goût uniques. Le miel d’acacia est doux et liquide, idéal pour sucrer les boissons. Celui de lavande est corsé et aromatique, parfait sur une tartine. Le miel de châtaignier, plus amer, est riche en minéraux et convient aux cuisines salées.',
      imageUrl: `${BASE}images/jana-ladia-hPk_ROIRoyQ-unsplash.jpg`,
      date: '22 juin 2023',
      category: 'Conseils',
    },
  ]);

  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const openModal = (post: BlogPost) => setSelectedPost(post);
  const closeModal = () => setSelectedPost(null);

  return (
    <div className={styles.blogContainer}>
      {/* <h1>Notre blog</h1> */}
      <p className={styles.blogIntro}>
        Découvrez nos articles sur le miel, l’apiculture et nos produits.
      </p>

      {/* Grille de 3 cartes */}
      <div className={styles.blogGrid}>
        {blogPosts.map((post) => (
          <article key={post.id} className={styles.blogPost}>
            <div className={styles.postImage}>
              <img src={post.imageUrl} alt={post.title} />
            </div>
            <span className={styles.postCategory}>{post.category}</span>
            <div className={styles.postContent}>
              <h2>{post.title}</h2>
              <p className={styles.postDate}>{post.date}</p>
              <p className={styles.postExcerpt}>{post.excerpt}</p>
            </div>
            <button onClick={() => openModal(post)} className={styles.readMoreBtn}>
                Lire la suite →
            </button>
          </article>
        ))}
      </div>

      {/* Modale */}
      {selectedPost && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={closeModal}>
              &times;
            </button>
            <h2>{selectedPost.title}</h2>
            <p className={styles.modalDate}>{selectedPost.date}</p>
            <img className={styles.modalImage} src={selectedPost.imageUrl} alt={selectedPost.title} />
            <div className={styles.modalContent}>{selectedPost.content}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;






























// import React, { useState } from 'react';
// import styles from '../styles/blog.module.css';

// type BlogPost = {
//   id: number;
//   title: string;
//   excerpt: string;
//   content: string;
//   imageUrl: string;
//   date: string;
//   category: string;
// };

// const Blog = () => {
//   const [blogPosts] = useState<BlogPost[]>([
//     {
//       id: 1,
//       title: 'Les bienfaits du miel pour la santé',
//       excerpt: 'Découvrez comment le miel peut améliorer votre santé au quotidien.',
//       content:
//         'Le miel est une source naturelle d’antioxydants, de vitamines et de minéraux. Il possède des propriétés antibactériennes et cicatrisantes, utiles pour soulager les maux de gorge, améliorer la digestion et renforcer le système immunitaire. Consommé avec modération, il peut remplacer le sucre raffiné dans de nombreuses recettes.',
//       imageUrl: '/images/karyna-panchenko-yIjeu2mU1RM-unsplash.jpg',
//       date: '15 mai 2023',
//       category: 'Santé',
//     },
//     {
//       id: 2,
//       title: 'Notre récolte de printemps',
//       excerpt: 'Retour sur notre récolte exceptionnelle de miel.',
//       content:
//         'Ce printemps, nos abeilles ont butiné des champs de fleurs sauvages, donnant naissance à un miel doré et parfumé. Grâce à un climat idéal et un soin rigoureux, la récolte a été plus riche que prévu. Chaque pot contient l’essence de nos terroirs et le travail minutieux de nos apiculteurs.',
//       imageUrl: '/images/shot--IHRgDwYjc8-unsplash.jpg',
//       date: '10 avril 2023',
//       category: 'Actualités',
//     },
//     {
//       id: 3,
//       title: 'Les différents types de miel',
//       excerpt: 'Acacia, lavande, châtaignier… Découvrez leurs goûts et bienfaits.',
//       content:
//         'Chaque type de miel possède une couleur, une texture et un goût uniques. Le miel d’acacia est doux et liquide, idéal pour sucrer les boissons. Celui de lavande est corsé et aromatique, parfait sur une tartine. Le miel de châtaignier, plus amer, est riche en minéraux et convient aux cuisines salées.',
//       imageUrl: '/images/jana-ladia-hPk_ROIRoyQ-unsplash.jpg',
//       date: '22 juin 2023',
//       category: 'Conseils',
//     },
//   ]);

//   const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

//   const openModal = (post: BlogPost) => setSelectedPost(post);
//   const closeModal = () => setSelectedPost(null);

//   return (
//     <div className={styles.blogContainer}>
//       <h1>Notre blog</h1>
//       <p className={styles.blogIntro}>
//         Découvrez nos articles sur le miel, l’apiculture et nos produits.
//       </p>

//       {/* Grille de 3 cartes */}
//       <div className={styles.blogGrid}>
//         {blogPosts.map((post) => (
//           <article key={post.id} className={styles.blogPost}>
//             <div className={styles.postImage}>
//               <img src={post.imageUrl} alt={post.title} />
//             </div>
//             <span className={styles.postCategory}>{post.category}</span>
//             <div className={styles.postContent}>
//               <h2>{post.title}</h2>
//               <p className={styles.postDate}>{post.date}</p>
//               <p className={styles.postExcerpt}>{post.excerpt}</p>
//             </div>
//             <button onClick={() => openModal(post)} className={styles.readMoreBtn}>
//                 Lire la suite →
//             </button>
//           </article>
//         ))}
//       </div>

//       {/* Modale */}
//       {selectedPost && (
//         <div className={styles.modalOverlay} onClick={closeModal}>
//           <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
//             <button className={styles.closeBtn} onClick={closeModal}>
//               &times;
//             </button>
//             <h2>{selectedPost.title}</h2>
//             <p className={styles.modalDate}>{selectedPost.date}</p>
//             <img className={styles.modalImage} src={selectedPost.imageUrl} alt={selectedPost.title} />
//             <div className={styles.modalContent}>{selectedPost.content}</div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Blog;






