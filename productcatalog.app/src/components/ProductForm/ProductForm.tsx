import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { PackagePlus } from 'lucide-react';
import type { Product } from '../../config';
import '../../styles/ProductForm.css'; // Importa o arquivo CSS

interface ProductFormProps {
  onAddProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  isLoading: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ onAddProduct, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '0.00',
  });
  
  // Estado para erro local
  const [localError, setLocalError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalError('');
    const { name, value } = e.target;

    if (name === 'price') {
      // Remove tudo que não for número, ponto ou vírgula
      const cleanValue = value.replace(/[^0-9,.]/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: cleanValue.replace(',', '.'), // Usa ponto como separador decimal para JS
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (isLoading) return;

    if (!formData.name.trim() || !parseFloat(formData.price)) {
      setLocalError('Por favor, preencha o Nome e o Preço (válido).');
      return;
    }

    const newProductData = {
      name: formData.name.trim(),
      price: parseFloat(formData.price),
    };

    try {
      await onAddProduct(newProductData);
      setFormData({ name: '', price: '0.00' });
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
      setLocalError('Falha ao adicionar produto. Verifique a conexão do backend.');
    }
  };

  return (
    <div className="product-form-container">
      {/* Cabeçalho do Formulário */}
      <div className="form-header">
        <PackagePlus className="form-header-icon" />
        <div>
          <h2 className="form-header-title">Novo Produto</h2>
          <p className="form-header-subtitle">Adicione um novo produto ao seu catálogo</p>
        </div>
      </div>

      {/* Corpo do Formulário */}
      <form onSubmit={handleSubmit} className="form-body">
        {localError && (
          <div className="form-error-alert" role="alert">
            <strong className="form-error-bold">Erro:</strong>
            <span className="form-error-message">{localError}</span>
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Nome do Produto <span className="required-star">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Ex: Produto Premium"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price" className="form-label">
            Preço (R$) <span className="required-star">*</span>
          </label>
          <input
            id="price"
            name="price"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={formData.price}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="submit-button"
        >
          {isLoading ? (
            <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <PackagePlus className="submit-icon" />
          )}
          {isLoading ? 'Adicionando...' : 'Adicionar Produto'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;