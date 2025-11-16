import React, { useState, useEffect, useCallback, useMemo } from "react";
import type { Product } from "./config";
import { API_BASE_URL } from "./config";

import ProductForm from "./components/ProductForm/ProductForm";
import ProductCard from "./components/ProductCard/ProductCard";

import { Boxes, AlertTriangle } from "lucide-react";
import "./App.css";

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // ----------------------------
  // Toast
  // ----------------------------
  const showToast = useCallback((msg: string, isError = false) => {
    setError(isError ? msg : null);
    setMessage(isError ? "" : msg);

    setTimeout(() => {
      setMessage("");
      setError(null);
    }, 3500);
  }, []);

  // ----------------------------
  // Carregar produtos
  // ----------------------------
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_BASE_URL);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data: Product[] = await response.json();
      setProducts(data);
    } catch (e) {
      if (e instanceof Error) {
        showToast(`Erro ao carregar produtos: ${e.message}`, true);
      }
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ----------------------------
  // Adicionar produto
  // ----------------------------
  const addProduct = useCallback(
    async (product: Omit<Product, "id">) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(API_BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        });

        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const newProduct: Product = await response.json();
        setProducts((prev) => [newProduct, ...prev]);

        showToast(`Produto "${newProduct.name}" adicionado!`);
      } catch (e) {
        if (e instanceof Error) {
          showToast(`Falha ao adicionar: ${e.message}`, true);
        }
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  // ----------------------------
  // Lista de produtos (memoizada)
  // ----------------------------
  const ProductList = useMemo(() => {
    if (loading) {
      return (
        <div className="list-loading-state">
          <svg
            className="spinner-list"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Carregando produtos...
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="list-empty-state">
          <Boxes className="empty-icon" />
          <p className="empty-title">Nenhum produto cadastrado</p>
          <p className="empty-subtitle">
            Adicione seu primeiro produto pelo formulário ao lado.
          </p>
        </div>
      );
    }

    return (
      <div className="product-list-wrapper">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }, [products, loading]);

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <div className="app-container">
      {(message || error) && (
        <div
          className={`toast-notification ${
            error ? "toast-error" : "toast-success"
          }`}
        >
          {error && <AlertTriangle className="toast-icon" />}
          {message || error}
        </div>
      )}

      <header className="app-header">
        <h1 className="header-title">Gerenciador de Produtos</h1>
      </header>

      <main className="app-main-layout">
        <div className="form-column">
          <ProductForm onAddProduct={addProduct} isLoading={loading} />
        </div>

        <div className="list-column-container">
          <div className="list-header">
            <h2 className="list-header-title">Catálogo de Produtos</h2>
          </div>
          <div className="list-body">{ProductList}</div>
        </div>
      </main>
    </div>
  );
};

export default App;
