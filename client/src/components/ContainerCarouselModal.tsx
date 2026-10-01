// src/components/ContainerCarouselModal.tsx
import React, { useState } from 'react';
import { Product, Contenant } from '../types';

interface Props {
  product: Product;
  onClose: () => void;
  onAdd: (product: Product, contenant: Contenant) => void;
}

export default function ContainerCarouselModal({ product, onClose, onAdd }: Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(product.contenants[0]);

  const next = () => setCurrent((prev) => (prev + 1) % product.contenants.length);
  const prev = () => setCurrent((prev) => (prev - 1 + product.contenants.length) % product.contenants.length);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-carousel" onClick={(e) => e.stopPropagation()}>
        <h3>{product.name}</h3>

        {/* Carousel */}
        <div className="carousel">
          <button className="carousel-arrow left" onClick={prev}>‹</button>
          <div className="carousel-slide">
            <img
              src={product.contenants[current].image_pot || product.images}
              alt={product.contenants[current].type}
            />
          </div>
          <button className="carousel-arrow right" onClick={next}>›</button>
        </div>

        {/* Infos */}
        <p>{product.contenants[current].type} – {product.contenants[current].prix} FCFA</p>

        {/* Sélection */}
        <label htmlFor="contenant-select" className="visually-hidden">
          Choisir un contenant
        </label>
        <select
          id="contenant-select"
          aria-label="Choisir un contenant"
          value={selected.type}
          onChange={(e) => setSelected(product.contenants.find(c => c.type === e.target.value)!)}
        >
          {product.contenants.map(c => (
            <option key={c.type} value={c.type}>
              {c.type} – {c.prix} FCFA
            </option>
          ))}
        </select>

        <button className="btn-add-carousel" onClick={() => onAdd(product, selected)}>Ajouter au panier</button>
        <button className="btn-close" onClick={onClose}>✕</button>
      </div>
    </div>
  );
}