// src/pages/SingleProductPage.tsx
import { ArrowLeft, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router";
import { toast } from "sonner";
import useCartItem from "../../hooks/useCartItem";
import { addProduct, removeProduct } from "../../redux/slices/cart";
import Feedback from "../../shared/components/Feedback";
import Loading from "../../shared/components/Loading";
import SellerInfoAside from "../../shared/components/SellerInfoAside"; // ✅ restored
import shareProduct from "../../utils/shareProduct"; // ✅ restored
import addProductToWishlist from "./utils/addProductToWishlist"; // ✅ restored
import useProductWithSeller from "../../hooks/useProductWithSeller"; // ✅ merged hook

export default function SingleProductPage() {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const imageCarouselRef = useRef<HTMLDivElement>(null);
  const timeout = useRef<number | null>(null);
  const demoImages = [
    "/assets/images/demo-product.png",
    "/assets/images/demo-product-2.png",
  ];

  const { id } = useParams<{ id: string }>();
  const { product, seller, loading, error } = useProductWithSeller(id!);
  const dispatch = useDispatch();
  const cartProduct = useCartItem(id!);

  // ✅ Choose images (fallback to demo)
  const images =
    product?.product_images && product.product_images.length > 0
      ? product.product_images.map((i) => i.file_path)
      : demoImages;

  // scroll to active slide when activeImageIndex changes
  useEffect(() => {
    if (!imageCarouselRef.current) return;
    const singleSlideWidth = imageCarouselRef.current.clientWidth;
    imageCarouselRef.current.scroll({
      left: singleSlideWidth * activeImageIndex,
      behavior: "smooth",
    });
  }, [activeImageIndex]);

  // update active index on scroll end (debounced)
  useEffect(() => {
    if (!imageCarouselRef.current) return;

    const updateActiveIndexOnScrollEnd = () => {
      if (timeout.current) window.clearTimeout(timeout.current);
      timeout.current = window.setTimeout(() => {
        const singleSlideWidth = imageCarouselRef.current!.clientWidth;
        const scrollLeft = imageCarouselRef.current!.scrollLeft;
        setActiveImageIndex(Math.round(scrollLeft / singleSlideWidth));
      }, 100) as unknown as number;
    };

    const el = imageCarouselRef.current;
    el.addEventListener("scroll", updateActiveIndexOnScrollEnd);
    return () => {
      el.removeEventListener("scroll", updateActiveIndexOnScrollEnd);
      if (timeout.current) window.clearTimeout(timeout.current);
    };
  }, []);

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6 min-h-full max-w-6xl mx-auto p-3 sm:p-6">
      {/* MAIN COLUMN */}
      <div className="bg-white shadow-md px-3 sm:px-6 py-4 sm:py-6 space-y-6 overflow-hidden rounded-md">
        {product && seller && (
          <>
            {/* Header */}
            <header className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
              <Link to={"/marketplace"}>
                <ArrowLeft size={20} className="sm:size-22" />
              </Link>

              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src={seller.avatar || "/images/default-user.png"}
                  width={44}
                  height={44}
                  className="rounded-full object-cover"
                  alt="Seller avatar"
                />
                <div>
                  <h1 className="text-sm sm:text-base font-medium capitalize">
                    {seller.fname} {seller.lname}
                  </h1>
                  <Link
                    className="text-primary text-xs sm:text-sm hover:underline"
                    to={`/marketplace/s/${seller.id}`}
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </header>

            {/* Image area */}
            <div className="space-y-3 sm:space-y-4">
              <div className="relative overflow-hidden rounded-lg">
                {/* arrows */}
                {images.length > 1 && (
                  <>
                    {activeImageIndex > 0 && (
                      <button
                        onClick={() => setActiveImageIndex(activeImageIndex - 1)}
                        className="absolute top-1/2 left-2 sm:left-3 -translate-y-1/2 z-20 p-1.5 sm:p-2 bg-white/90 rounded-full shadow"
                        aria-label="previous image"
                      >
                        <ChevronLeft size={20} />
                      </button>
                    )}
                    {activeImageIndex < images.length - 1 && (
                      <button
                        onClick={() => setActiveImageIndex(activeImageIndex + 1)}
                        className="absolute top-1/2 right-2 sm:right-3 -translate-y-1/2 z-20 p-1.5 sm:p-2 bg-white/90 rounded-full shadow"
                        aria-label="next image"
                      >
                        <ChevronRight size={20} />
                      </button>
                    )}
                  </>
                )}

                {/* carousel */}
                <div
                  ref={imageCarouselRef}
                  className="w-full overflow-x-auto snap-x snap-mandatory flex no-scrollbar"
                >
                  {images.map((src, i) => (
                    <div
                      key={src + i}
                      className="snap-center snap-always w-full min-w-full max-w-full flex-shrink-0 py-3 sm:py-6"
                    >
                      <img
                        src={src}
                        alt={`${product.name}-${i}`}
                        className="mx-auto max-h-[240px] sm:max-h-[360px] lg:max-h-[420px] object-contain"
                      />
                    </div>
                  ))}
                </div>

                {/* thumbnails */}
                <div className="flex justify-center gap-2 sm:gap-3 py-2 sm:py-3 flex-wrap">
                  {images.map((src, i) => (
                    <button
                      key={src + i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`w-9 h-9 sm:w-12 sm:h-12 rounded-md overflow-hidden border ${
                        activeImageIndex === i ? "border-primary" : "border-[#E5E7EB]"
                      }`}
                    >
                      <img
                        src={src}
                        alt={`thumb-${i}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                {/* progress dots */}
                <div
                  style={{ gridTemplateColumns: `repeat(${images.length}, 14px)` }}
                  className="w-fit grid gap-2 mx-auto mt-1 sm:mt-2"
                >
                  {images.map((_, i) => (
                    <div
                      key={i}
                      className={`${
                        activeImageIndex === i
                          ? "bg-primary col-span-2"
                          : "bg-[#B3B3B3]"
                      } h-0.75 rounded`}
                    />
                  ))}
                </div>
              </div>

              {/* product description box */}
              <div className="bg-gradient-to-b from-white to-[#F1F6FF] py-3 sm:py-5 px-3 sm:px-4 space-y-3 sm:space-y-4 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6">
                  <div className="col-span-12 md:col-span-9 space-y-1 sm:space-y-2">
                    <h2 className="text-base sm:text-lg lg:text-xl font-semibold">
                      {product.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                      {product.description}
                    </p>

                    <Info heading="Brand" value={"None"} />
                    <Info heading="Size" value={"None"} />
                    <Info heading="Colour" value={"None"} />
                  </div>

                  <div className="col-span-12 md:col-span-3 flex md:flex-col justify-between items-end gap-2 md:gap-0">
                    <div className="text-right w-full">
                      {product.discount ? (
                        <p className="line-through text-[#77777A] text-[11px] sm:text-xs">
                          ₦{Number(product.price).toLocaleString()}
                        </p>
                      ) : null}
                      <p className="text-lg sm:text-2xl font-medium">
                        ₦
                        {product.discount
                          ? Number(
                              (
                                product.price -
                                (product.price * product.discount) / 100
                              ).toFixed(2)
                            ).toLocaleString()
                          : product.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-1.5 sm:gap-2">
                      <button
                        className="p-1.5 sm:p-2 rounded-md"
                        onClick={() => addProductToWishlist(product.id)}
                        aria-label="add to wishlist"
                      >
                        <span
                          style={{ fontSize: 16 }}
                          className="material-icons-outlined"
                        >
                          favorite
                        </span>
                      </button>

                      <button
                        className="p-1.5 sm:p-2 rounded-md"
                        onClick={() =>
                          shareProduct({
                            name: product.name,
                            id: product.id,
                            description: product.description,
                          })
                        }
                        aria-label="share product"
                      >
                        <span
                          style={{ fontSize: 16 }}
                          className="material-icons-outlined"
                        >
                          share
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="h-1 border-t border-dashed border-[#66666666] w-[85%] mx-auto mt-2"></div>

                {/* product meta */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4 text-xs sm:text-sm text-[#77777A] whitespace-nowrap flex-wrap">
                  <div className="flex gap-4 items-center">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        style={{ fontSize: 14 }}
                        className="material-icons-outlined"
                      >
                        location_on
                      </span>
                      Address not provided
                    </span>
                    <span className="hidden sm:inline">|</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Eye size={14} /> {product.reviews_count || 0} views
                    </span>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="text-primary">
                      ({product.reviews_count || 0} Reviews)
                    </span>
                    <span>{product.stock || 0} units</span>
                    <span className="flex items-center gap-1">
                      <b className="text-black">{product.rating || 0}</b>
                      {Array(5)
                        .fill(true)
                        .map((_, i) => (
                          <span
                            style={{ fontSize: 14 }}
                            className="material-icons-outlined"
                            key={i}
                          >
                            star
                          </span>
                        ))}
                    </span>
                  </div>
                </div>

                {/* buttons */}
                <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-3">
                  <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-primary rounded-xl text-xs sm:text-sm text-white">
                    Contact Seller
                  </button>

                  {cartProduct ? (
                    <button
                      onClick={() =>
                        (dispatch(removeProduct(id)),
                        toast.success("Product removed from cart!"))
                      }
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border-primary border rounded-xl text-xs sm:text-sm text-primary"
                    >
                      Remove from Cart
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        (dispatch(addProduct({ ...product, cartQuantity: 1 })),
                        toast.success("Product added to cart!"))
                      }
                      className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border-primary border rounded-xl text-xs sm:text-sm text-primary"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* customer feedback */}
            <div className="space-y-2 sm:space-y-4">
              <h2 className="font-medium text-sm sm:text-base">
                Customer Feedback
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <Feedback
                  name="Akeyande Nurudeen"
                  rating={5}
                  comment="Amazing sound quality and super comfortable to wear! The battery life is a game-changer."
                  date="Dec.26,2024"
                />
                <Feedback
                  name="Abdullahi Bello Saidu"
                  rating={4}
                  comment="Great product, but I wish it came in more colour options."
                  date="Dec.27,2024"
                />
              </div>
            </div>

            {/* reseller block */}
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-primary text-xs sm:text-sm font-medium">
                You want to resell this Product and make profit?
              </h2>
              <p className="font-light text-xs sm:text-sm">
                To start reselling this product, simply click the button below to
                generate your unique reseller link. This personalized link will track
                all your sales for this specific product.
              </p>

              <div className="flex flex-col lg:flex-row justify-between gap-2 items-start lg:items-end">
                <div>
                  <h3 className="text-sm sm:text-lg">💰 Commission Details:</h3>
                  <p className="font-light text-xs sm:text-sm">
                    You will earn a reseller commission of ₦10,000 every time
                    someone purchases this product using your unique link.
                  </p>
                </div>
                <button className="px-3 sm:px-4 py-2 active:scale-90 transition-transform bg-primary rounded-xl text-white text-xs sm:text-sm h-fit">
                  Generate Reseller Link
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ASIDE / SELLER CARD */}
      <aside className="order-first lg:order-last">
        {seller && <SellerInfoAside {...seller} />}
      </aside>
    </div>
  );
}

function Info({ heading, value }: { heading: string; value: ReactNode }) {
  return (
    <p className="text-xs sm:text-sm">
      <b>{heading}:</b> <span className="text-secondary">{value}</span>
    </p>
  );
}
