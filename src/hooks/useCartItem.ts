import { useSelector } from "react-redux";
import { CartProduct } from "../../types";

export default function useCartItem(id: string) {
	return (
		useSelector<any, CartProduct | undefined>((state: any) =>
			state.cart.value.find((product: CartProduct) => product.id == id),
		) || null
	);
}
