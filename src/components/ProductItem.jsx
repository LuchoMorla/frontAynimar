import React/*,  { useContext } */ from 'react';
import Image from 'next/image';/* 
import AppContext from '@context/AppContext';*/
import Link from 'next/link'; /* 
import addToCartImage from '@icons/bt_add_to_cart.svg';
import addedToCartImage from '@icons/bt_added_to_cart.svg';  */
import styles from '@styles/ProductItem.module.scss';

const ProductItem = ({ product }) => {
	/* 	const { state, addToCart } = useContext(AppContext);

	const handleClick = item => {
	console.log('in cart: ', state.cart.includes(item)); 
		addToCart(item);
	};*/

	return (
		<div className={styles.ProductItem}>
			<Link href={`/store/${product.id}`} className={styles['go_product']} passHref>
				<Image src={product.image} width={240} height={240} alt={product.description} />
			</Link>
			<div className={styles['product-info']}>
				<div>
					<p>${product.price}</p>
					<Link href={`/store/${product.id}`} className={styles['go_product']} passHref>
					<p>{product.name}</p>
					</Link>
				</div>{/* 
				<figure className={styles['more-clickable-area']}
					onClick={() => handleClick(product)}
					aria-hidden="true"
					>
					{state.cart.includes(product) ? <Image
						className={(styles.disabled, styles['add-to-cart-btn'])}
						src={addedToCartImage}
						alt="added to cart"
					/> : <Image className={(styles['add-to-cart-btn'], styles.pointer)} src={addToCartImage} alt="add to cart" />}
				</figure> */}
			</div>
		</div>
	);
};

export default ProductItem;