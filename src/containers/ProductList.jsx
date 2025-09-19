import React, { useState, useEffect } from 'react';
import endPoints from '@services/api/index';
import useGetProducts from '@hooks/useGetProducts';
import ProductItem from '@components/ProductItem';
import Paginacion from '@common/Paginacion';
import styles from '@styles/ProductList.module.scss';

const ProductList = () => {
	const PRODUCT_LIMIT = 16;
	const [offsetProducts, setOffsetProducts] = useState(0);
	
	// Estados para los filtros - NUEVO
	const [nameFilter, setNameFilter] = useState('');
	const [priceMin, setPriceMin] = useState('');
	const [priceMax, setPriceMax] = useState('');
	
	// Estados para filtros aplicados (con debounce) - NUEVO
	const [appliedNameFilter, setAppliedNameFilter] = useState('');
	const [appliedPriceMin, setAppliedPriceMin] = useState('');
	const [appliedPriceMax, setAppliedPriceMax] = useState('');

	// Debounce para los filtros - NUEVO
	useEffect(() => {
		const timer = setTimeout(() => {
			setAppliedNameFilter(nameFilter);
			setAppliedPriceMin(priceMin);
			setAppliedPriceMax(priceMax);
		}, 300); // 300ms de delay

		return () => clearTimeout(timer);
	}, [nameFilter, priceMin, priceMax]);

	// Función para construir URL con filtros - NUEVO
	const buildProductsUrl = (limit, offset) => {
		// Si descomentaste la función mejorada en endpoints, usar esto:
		const minPrice = appliedPriceMin ? parseFloat(appliedPriceMin) : 0;
		const maxPrice = appliedPriceMax ? parseFloat(appliedPriceMax) : 10000000;
		
		let url = endPoints.products.getProducts(limit, offset, minPrice, maxPrice);
		
		// Agregar filtro de nombre si existe
		if (appliedNameFilter.trim()) {
			url += `&name=${encodeURIComponent(appliedNameFilter.trim())}`;
		}
		
		// Agregar show_shop si no está incluido
		if (!url.includes('show_shop')) {
			url += `&show_shop=true`;
		}
		
		// Debug temporal
		console.log('URL final:', url);
		
		return url;
	};

	// Mantiene la lógica original pero con filtros
	const products = useGetProducts(
		buildProductsUrl(PRODUCT_LIMIT, offsetProducts),
		offsetProducts
	);

	const totalProducts = useGetProducts(
		buildProductsUrl(10000000, 0)
	).length;

	// Función para limpiar filtros - NUEVO
	const clearFilters = () => {
		setNameFilter('');
		setPriceMin('');
		setPriceMax('');
		setOffsetProducts(0);
	};

	return (
		<section className={styles["main-container"]}>
			{/* Panel de filtros simple - NUEVO */}
			<div style={{
				background: '#f8f9fa',
				padding: '20px',
				marginBottom: '20px',
				borderRadius: '8px',
				border: '1px solid #dee2e6'
			}}>
				<h3 style={{ marginBottom: '15px', fontSize: '1.2rem', color: '#495057' }}>
					Filtros
				</h3>
				
				<div style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
					gap: '15px',
					marginBottom: '15px'
				}}>
					<div>
						<label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
							Buscar:
						</label>
						<input
							type="text"
							placeholder="Nombre del producto..."
							value={nameFilter}
							onChange={(e) => {
								setNameFilter(e.target.value);
								setOffsetProducts(0); // Reset paginación
							}}
							style={{
								width: '100%',
								padding: '8px',
								border: '1px solid #ccc',
								borderRadius: '4px',
								fontSize: '14px'
							}}
						/>
					</div>
					
					<div>
						<label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
							Precio mínimo:
						</label>
						<input
							type="number"
							min="0"
							step="0.01"
							placeholder="0.00"
							value={priceMin}
							onChange={(e) => {
								const value = e.target.value;
								// Solo permitir números positivos o campo vacío
								if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
									setPriceMin(value);
									setOffsetProducts(0);
								}
							}}
							style={{
								width: '100%',
								padding: '8px',
								border: '1px solid #ccc',
								borderRadius: '4px',
								fontSize: '14px'
							}}
						/>
					</div>
					
					<div>
						<label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>
							Precio máximo:
						</label>
						<input
							type="number"
							min="0"
							step="0.01"
							placeholder="999999"
							value={priceMax}
							onChange={(e) => {
								const value = e.target.value;
								// Solo permitir números positivos o campo vacío
								if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
									setPriceMax(value);
									setOffsetProducts(0);
								}
							}}
							style={{
								width: '100%',
								padding: '8px',
								border: '1px solid #ccc',
								borderRadius: '4px',
								fontSize: '14px'
							}}
						/>
					</div>
				</div>
				
				{(nameFilter || priceMin || priceMax) && (
					<button
						onClick={clearFilters}
						style={{
							background: '#6c757d',
							color: 'white',
							border: 'none',
							padding: '8px 16px',
							borderRadius: '4px',
							cursor: 'pointer',
							fontSize: '14px'
						}}
					>
						Limpiar filtros
					</button>
				)}
			</div>

			{/* Lista de productos - SIN CAMBIOS */}
			<div className={styles.ProductList}>
				{products.map((product) => (
					<ProductItem product={product} key={product.id} />
				))}
			</div>

			{/* Paginación - SIN CAMBIOS */}
			{totalProducts > 0 && (
				<Paginacion
					totalItems={totalProducts}
					itemsPerPage={PRODUCT_LIMIT}
					setOffset={setOffsetProducts}
					neighbours={3}
				/>
			)}
		</section>
	);
};

export default ProductList;