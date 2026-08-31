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
