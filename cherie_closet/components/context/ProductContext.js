import React, { createContext, useState } from 'react';
import { products as initialProducts } from '../data/product';

export const ProductContext = createContext();
import app from "../../firebaseConsole"; // your firebase config
import { getDatabase, ref, set, get } from "firebase/database";

const db = getDatabase(app);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(
    initialProducts.map((p) => ({ ...p, trashed: false }))
  );

  const updateProduct = (updatedProduct) => {
    setProducts((prev) => {
      const index = prev.findIndex((p) => p.id === updatedProduct.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = updatedProduct;
        return updated;
      } else {
        return [...prev, { ...updatedProduct, trashed: false }];
      }
    });
  };

  const deleteProductById = (id) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, trashed: true } : item
      )
    );
  };

  const deleteProduct = (name) => {
    const index = products.findIndex(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );
    if (index !== -1) {
      const id = products[index].id;
      deleteProductById(id);
      return true;
    }
    return false;
  };

  const restoreProduct = (id) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, trashed: false } : item
      )
    );
  };

  const trashedProducts = products.filter((item) => item.trashed);

  return (
    <ProductContext.Provider
      value={{
        products: products.filter((item) => !item.trashed),
        updateProduct,
        deleteProduct,
        deleteProductById,
        trashedProducts,
        restoreProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
