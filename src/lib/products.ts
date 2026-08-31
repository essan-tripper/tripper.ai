export type Product = {
  id: string;
  label: string;
  image: string;
  price: number;
  originalPrice?: number;
};

export const magnetVariants: Product[] = [
  { id: "kedarnath", label: "Kedarnath", image: "https://res.cloudinary.com/dbciv3dc2/image/upload/v1783888040/kedanathmagnet_ffan1z.jpg", price: 129, originalPrice: 149 },
  { id: "dwarka", label: "Dwarka", image: "https://res.cloudinary.com/dbciv3dc2/image/upload/v1783888040/dwarkamaget_vsf8f1.jpg", price: 129, originalPrice: 149 },
  { id: "puri", label: "Puri", image: "https://res.cloudinary.com/dbciv3dc2/image/upload/v1783888043/purimagnet_oftu0g.jpg", price: 129, originalPrice: 149 },
  { id: "rameshwaram", label: "Rameshwaram", image: "https://res.cloudinary.com/dbciv3dc2/image/upload/v1783888041/rameshwarammagnet_qms6zx.jpg", price: 129, originalPrice: 149 },
  { id: "badrinath", label: "Badrinath", image: "https://res.cloudinary.com/dbciv3dc2/image/upload/v1783888040/badrinath_loydl8.jpg", price: 129, originalPrice: 149 },
  { id: "gangotri", label: "Gangotri", image: "https://res.cloudinary.com/dbciv3dc2/image/upload/v1783888039/gangotri_vmeluz.jpg", price: 129, originalPrice: 149 },
  { id: "yamunotri", label: "Yamunotri", image: "https://res.cloudinary.com/dbciv3dc2/image/upload/v1783888042/yamunotri_qokjwk.jpg", price: 129, originalPrice: 149 },
  { id: "pack", label: "Pack of 4", image: "https://res.cloudinary.com/dbciv3dc2/image/upload/v1783888041/combomagnets_joxpoc.jpg", price: 399, originalPrice: 599 },
];

export const posterProduct: Product = {
  id: "poster-kedarnath",
  label: "Surreal Pilgrimage Route Poster",
  image: "https://res.cloudinary.com/dbciv3dc2/image/upload/v1783888332/Posters1_cv871p.jpg",
  price: 1299,
};

export type CheckoutProduct = Product & {
  productType: "magnet" | "poster";
};

export const PACK_CART_ID_PREFIX = "magnet-pack:";

export const checkoutProducts = new Map<string, CheckoutProduct>();

for (const variant of magnetVariants) {
  if (variant.id !== "pack") {
    checkoutProducts.set(`magnet-${variant.id}`, {
      productType: "magnet",
      ...variant,
    });
  }
}

checkoutProducts.set(posterProduct.id, {
  productType: "poster",
  ...posterProduct,
});

export function getCheckoutProduct(id: string): CheckoutProduct | undefined {
  const product = checkoutProducts.get(id);
  if (product) return product;

  if (!id.startsWith(PACK_CART_ID_PREFIX)) return undefined;

  const shrineIds = id.slice(PACK_CART_ID_PREFIX.length).split(",");
  if (shrineIds.length !== 4 || new Set(shrineIds).size !== 4) return undefined;

  const shrines = shrineIds.map((shrineId) =>
    checkoutProducts.get(`magnet-${shrineId}`)
  );
  if (shrines.some((shrine) => !shrine)) return undefined;

  return {
    id,
    productType: "magnet",
    label: `Pack of 4 (${shrines.map((shrine) => shrine!.label).join(", ")})`,
    image: magnetVariants.find((variant) => variant.id === "pack")!.image,
    price: magnetVariants.find((variant) => variant.id === "pack")!.price,
  };
}
