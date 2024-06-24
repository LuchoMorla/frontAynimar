import React/* , { useContext }  */from 'react';
import Image from 'next/image';
/* import AppContext from '@context/AppContext'; 
import addToCartImage from '@icons/addreciclar.svg';
import addedToCartImage from '@icons/bt_added_to_cart.svg'; */
import Link from 'next/link';
import styles from '@styles/ProductItem.module.scss';

const WasteItem = ({ waste }) => {
	/* const { addToMetacircle } = useContext(AppContext); */

	/* const handleClick = item => {
		console.log('in cart: ', state.metacircle.includes(item)); 
		addToMetacircle(item);
	};*/

	return (
		<div className={styles.ProductItem}>
			<Link href={`/recycling/${waste.id}`} className={styles['go_product']} passHref>
			<Image src={waste.image} width={240} height={240} alt={waste.description} /* className={styles['go_product']} *//>
			</Link>
			<div className={styles['product-info']}>
				<div>
					<p>${waste.price}</p>
					<Link href={`/recycling/${waste.id}`} passHref>
					<p>{waste.name}</p>
					</Link>
				</div>
{/* 				<figure className={styles['more-clickable-area']}
					onClick={() => handleClick(waste)}
					aria-hidden="true"
					>
					{state.metacircle.includes(waste) ? <Image
						className={(styles.disabled, styles['add-to-cart-btn'])}
						src={addedToCartImage}
						alt="added to cart"
					/> : <Image className={(styles['add-to-cart-btn'], styles.pointer)} src={addToCartImage} alt="add to cart" />} 
				</figure>*/}
			</div>
		</div>
	);
};

export default WasteItem;