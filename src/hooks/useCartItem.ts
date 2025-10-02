import { useSelector } from "react-redux";
import type { CartProduct } from "../../types.d";

export default function useCartItem(id: string) {
  return (
    useSelector<any, CartProduct | undefined>((state: any) =>
      state.cart.value.find((product: CartProduct) => String(product.id) === String(id))
    ) || null
  );
}
