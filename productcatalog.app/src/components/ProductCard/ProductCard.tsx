import React from "react";
import formatCurrency from "../../utils/formatCurrent";
import type { Product } from "../../config";
import { DollarSign } from "lucide-react";
import "../../styles/ProductCard.css";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-card-header">
        <h3 className="product-card-title">{product.name}</h3>
      </div>

      <div className="product-card-details">
        <p className="product-card-price">
          <DollarSign className="icon-dollar" />
          {formatCurrency(product.price)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
