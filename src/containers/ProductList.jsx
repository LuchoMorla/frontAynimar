import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import endPoints from '@services/api/index';
import useGetProducts from '@hooks/useGetProducts';
import ProductItem from '@components/ProductItem';
import Paginacion from '@common/Paginacion';
import styles from '@styles/ProductList.module.scss';

const ProductList = () => {
	const router = useRouter();
	const PRODUCT_LIMIT = 16;
	const [offsetProducts, setOffsetProducts] = useState(0);

	// Estados para los filtros - NUEVO
	const [nameFilter, setNameFilter] = useState('');
	const [priceMin, setPriceMin] = useState('');
	const [priceMax, setPriceMax] = useState('');
	const [showPriceFilters, setShowPriceFilters] = useState(false);
	
	// Estados para filtros aplicados (con debounce) - NUEVO
	const [appliedNameFilter, setAppliedNameFilter] = useState('');
	const [appliedPriceMin, setAppliedPriceMin] = useState('');
	const [appliedPriceMax, setAppliedPriceMax] = useState('');

	// Sync nameFilter from URL ?search= param (set by header search)
	useEffect(() => {
		if (router.query.search !== undefined) {
			setNameFilter(router.query.search || '');
			setOffsetProducts(0);
		}
	}, [router.query.search]);

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
		setShowPriceFilters(false);
	};

	return (
		<section className={styles["main-container"]}>
			{/* Panel de filtros mejorado */}
			<div style={{
				// background: '#ffffff',
				padding: '14px',
				// marginBottom: '24px',
				borderRadius: '12px',
				border: '1px solid #e8eaed',
				// boxShadow: '0 1px 6px 0 rgba(32,33,36,.28)',
				maxWidth: '800px',
				margin: '0 auto 0 auto'
			}}>
				
				{/* Campo de búsqueda principal estilo Google */}
				<div style={{ marginBottom: '20px' }}>
					<div style={{
						position: 'relative',
						maxWidth: '584px',
						margin: '0 auto'
					}}>
						<input
							type="text"
							placeholder="Buscar productos..."
							value={nameFilter}
							onChange={(e) => {
								setNameFilter(e.target.value);
								setOffsetProducts(0); // Reset paginación
							}}
							style={{
								width: '100%',
								padding: '12px 16px',
								border: '1px solid #dfe1e5',
								borderRadius: '24px',
								fontSize: '16px',
								outline: 'none',
								transition: 'all 0.2s ease-in-out',
								backgroundColor: '#fafafa',
								boxShadow: '0 2px 5px 1px rgba(64,60,67,.16)',
								fontFamily: 'arial,sans-serif'
							}}
							onFocus={(e) => {
								e.target.style.backgroundColor = '#ffffff';
								e.target.style.borderColor = '#4285f4';
								e.target.style.boxShadow = '0 2px 8px 1px rgba(64,60,67,.24)';
							}}
							onBlur={(e) => {
								if (!nameFilter) {
									e.target.style.backgroundColor = '#fafafa';
									e.target.style.borderColor = '#dfe1e5';
									e.target.style.boxShadow = '0 2px 5px 1px rgba(64,60,67,.16)';
								}
							}}
						/>
						{/* Icono de búsqueda opcional 
						<div style={{
							position: 'absolute',
							right: '16px',
							top: '50%',
							transform: 'translateY(-50%)',
							color: '#9aa0a6',
							pointerEvents: 'none'
						}}>
							🔍
						</div>*/}
					</div>
				</div>
				
				{/* Botón para mostrar/ocultar filtros de precio */}
				<div style={{ textAlign: 'center' }}>
					<button
						onClick={() => setShowPriceFilters(!showPriceFilters)}
						style={{
							background: '#f3f4f6',
							color: '#1f2937',
							border: 'none',
							padding: '10px 20px',
							borderRadius: '8px',
							cursor: 'pointer',
							fontSize: '14px',
							fontWeight: '600',
							transition: 'all 0.2s ease-in-out',
							display: 'inline-flex',
							alignItems: 'center',
							gap: '4px'
						}}
						onMouseOver={(e) => {
							e.target.style.backgroundColor = '#f8f9fa';
						}}
						onMouseOut={(e) => {
							e.target.style.backgroundColor = 'transparent';
						}}
					>
						{showPriceFilters ? '🔼' : '🔽'} Mas Filtros
					</button>
				</div>
				
				{/* Filtros de precio (se muestran/ocultan condicionalmente) */}
				{showPriceFilters && (
					<div style={{
						display: 'flex',
						justifyContent: 'center',
						gap: '16px',
						flexWrap: 'wrap',
						marginBottom: '8px'
					}}>
						<div style={{ minWidth: '140px' }}>
							<label style={{ 
								display: 'block', 
								marginBottom: '6px', 
								fontWeight: '500',
								fontSize: '14px',
								color: '#5f6368'
							}}>
								Precio mínimo:
							</label>
							<input
								type="number"
								min="0"
								step="0.01"
								placeholder="Ej: 10.00"
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
									padding: '10px 12px',
									border: '1px solid #dadce0',
									borderRadius: '8px',
									fontSize: '14px',
									outline: 'none',
									transition: 'border-color 0.2s ease-in-out'
								}}
								onFocus={(e) => {
									e.target.style.borderColor = '#4285f4';
								}}
								onBlur={(e) => {
									e.target.style.borderColor = '#dadce0';
								}}
							/>
						</div>
						
						<div style={{ minWidth: '140px' }}>
							<label style={{ 
								display: 'block', 
								marginBottom: '6px', 
								fontWeight: '500',
								fontSize: '14px',
								color: '#5f6368'
							}}>
								Precio máximo:
							</label>
							<input
								type="number"
								min="0"
								step="0.01"
								placeholder="Ej: 1000.00"
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
									padding: '10px 12px',
									border: '1px solid #dadce0',
									borderRadius: '8px',
									fontSize: '14px',
									outline: 'none',
									transition: 'border-color 0.2s ease-in-out'
								}}
								onFocus={(e) => {
									e.target.style.borderColor = '#4285f4';
								}}
								onBlur={(e) => {
									e.target.style.borderColor = '#dadce0';
								}}
							/>
						</div>
					</div>
				)}
				
				{/* Botón limpiar filtros */}
				{(nameFilter || priceMin || priceMax) && (
					<div style={{ textAlign: 'center', marginTop: '20px' }}>
						<button
							onClick={clearFilters}
							style={{
								background: '#f8f9fa',
								color: '#3c4043',
								border: '1px solid #f8f9fa',
								padding: '8px 16px',
								borderRadius: '20px',
								cursor: 'pointer',
								fontSize: '14px',
								fontWeight: '500',
								transition: 'all 0.2s ease-in-out',
								boxShadow: '0 1px 1px rgba(0,0,0,.1)'
							}}
							onMouseOver={(e) => {
								e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,.2)';
								e.target.style.borderColor = '#dadce0';
							}}
							onMouseOut={(e) => {
								e.target.style.boxShadow = '0 1px 1px rgba(0,0,0,.1)';
								e.target.style.borderColor = '#f8f9fa';
							}}
						>
							Limpiar filtros
						</button>
					</div>
				)}
			</div>

			{/* Lista de productos - SIN CAMBIOS */}
			<div className={styles.ProductList}>
				{products.map((product, index) => (
					<ProductItem product={product} key={product.id} priority={index < 4} />
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
