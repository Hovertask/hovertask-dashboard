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
import SellerInfoAside from "../../shared/components/SellerInfoAside";
import shareProduct from "../../utils/shareProduct";
import addProductToWishlist from "./utils/addProductToWishlist";
import useProductWithSeller from "../../hooks/useProductWithSeller";
import ResellerLinkModal from "../../shared/components/ResellerLinkModal";
import apiEndpointBaseURL from "../../utils/apiEndpointBaseURL";
import getAuthorization from "../../utils/getAuthorization";

export default function SingleProductPage() {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const imageCarouselRef = useRef<HTMLDivElement>(null);
  const timeout = useRef<number | null>(null);

  const demoImages = ["/assets/images/demo-product.png", "/assets/images/demo-product-2.png"];
  const { id } = useParams<{ id: string }>();
  const { product, seller, loading, error } = useProductWithSeller(id!);
  const dispatch = useDispatch();
  const cartProduct = useCartItem(id!);
  const ENABLE_CART_UI = false;
  // ✅ Use product images if available
  const images =
    product?.product_images && product.product_images.length > 0
      ? product.product_images.map((i) => i.file_path)
      : demoImages;

// Ensure full image URLs
const fullImages = images;

// Use seller.whatsapp or seller.phone
const whatsappNumber = seller?.phone;

// Build WhatsApp message
const finalPrice = product?.discount
  ? Number(product?.price - (product?.price * product?.discount) / 100)
  : product?.price || 0;

const whatsappMessage = `
Hello ${seller?.fname}, I’m interested in this product:

🛍 Product: ${product?.name}
💰 Price: ₦${finalPrice.toLocaleString()}

Here is the product image:
${fullImages[0]}

Please tell me more about it.
`;

// Final WhatsApp link
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  whatsappMessage
)}`;


  // Reseller modal state
  const [resellerModalOpen, setResellerModalOpen] = useState(false);
  const [resellerData, setResellerData] = useState<any>(null);

  const handleGenerateResellerLink = async () => {
    try {
      const res = await fetch(`${apiEndpointBaseURL}/products/reseller-link/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthorization(),
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to generate link");

      setResellerData(data);
      setResellerModalOpen(true);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    }
  };

  // ✅ scroll logic
  useEffect(() => {
    if (!imageCarouselRef.current) return;
    const singleSlideWidth = imageCarouselRef.current.clientWidth;
    imageCarouselRef.current.scroll({
      left: singleSlideWidth * activeImageIndex,
      behavior: "smooth",
    });
  }, [activeImageIndex]);

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
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4 sm:gap-6 max-w-6xl mx-auto p-2 sm:p-4 lg:p-6">
      {/* MAIN CONTENT */}
      <div className="bg-white shadow-md px-2 sm:px-4 lg:px-6 py-3 sm:py-5 lg:py-6 space-y-4 sm:space-y-6 rounded-md">
        {product && seller && (
          <>
            {/* Header */}
            <header className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
              <Link to={"/marketplace"} className="shrink-0">
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>

              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src={seller.avatar || "/images/default-user.png"}
                  width={40}
                  height={40}
                  className="rounded-full object-cover sm:w-11 sm:h-11"
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

            {/* IMAGE CAROUSEL */}
            <div className="space-y-3 sm:space-y-4">
              <div className="relative overflow-hidden rounded-lg">
                {/* Navigation arrows */}
                {images.length > 1 && (
                  <>
                    {activeImageIndex > 0 && (
                      <button
                        onClick={() => setActiveImageIndex(activeImageIndex - 1)}
                        className="absolute top-1/2 left-2 sm:left-3 -translate-y-1/2 z-20 p-1 sm:p-2 bg-white/90 rounded-full shadow"
                      >
                        <ChevronLeft size={18} className="sm:size-20" />
                      </button>
                    )}
                    {activeImageIndex < images.length - 1 && (
                      <button
                        onClick={() => setActiveImageIndex(activeImageIndex + 1)}
                        className="absolute top-1/2 right-2 sm:right-3 -translate-y-1/2 z-20 p-1 sm:p-2 bg-white/90 rounded-full shadow"
                      >
                        <ChevronRight size={18} className="sm:size-20" />
                      </button>
                    )}
                  </>
                )}

                {/* Images */}
                <div
                  ref={imageCarouselRef}
                  className="w-full overflow-x-auto snap-x snap-mandatory flex no-scrollbar"
                >
                  {images.map((src, i) => (
                    <div
                      key={src + i}
                      className="snap-center w-full flex-shrink-0 py-2 sm:py-4"
                    >
                      <img
                        src={src}
                        alt={`${product.name}-${i}`}
                        className="mx-auto max-h-[220px] sm:max-h-[360px] lg:max-h-[420px] object-contain"
                      />
                    </div>
                  ))}
                </div>

                {/* Thumbnails */}
                <div className="flex justify-center gap-2 sm:gap-3 py-2 flex-wrap">
                  {images.map((src, i) => (
                    <button
                      key={src + i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`w-8 h-8 sm:w-12 sm:h-12 rounded-md overflow-hidden border ${
                        activeImageIndex === i ? "border-primary" : "border-gray-300"
                      }`}
                    >
                      <img src={src} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="bg-gradient-to-b from-white to-[#F1F6FF] py-3 sm:py-5 px-3 sm:px-4 space-y-3 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Product details */}
                  <div className="col-span-12 md:col-span-9 space-y-1">
                    <h2 className="text-base sm:text-lg lg:text-xl font-semibold">{product.name}</h2>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                    <Info heading="Brand" value="None" />
                    <Info heading="Size" value="None" />
                    <Info heading="Colour" value="None" />
                  </div>

                  {/* Price + Actions */}
                  <div className="col-span-12 md:col-span-3 flex md:flex-col justify-between items-end gap-2">
                    <div className="text-right w-full">
                      {product.discount ? (
                        <p className="line-through text-gray-400 text-xs">
                          ₦{Number(product.price).toLocaleString()}
                        </p>
                      ) : null}
                      <p className="text-lg sm:text-xl font-medium text-black">
                        ₦
                        {product.discount
                          ? Number(
                              product.price - (product.price * product.discount) / 100
                            ).toLocaleString()
                          : product.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="p-1 sm:p-2 rounded-md"
                        onClick={() => addProductToWishlist(product.id)}
                      >
                        <span className="material-icons-outlined text-gray-500">favorite</span>
                      </button>
                      <button
                        className="p-1 sm:p-2 rounded-md"
                        onClick={() =>
                          shareProduct({
                            name: product.name,
                            id: product.id,
                            description: product.description,
                          })
                        }
                      >
                        <span className="material-icons-outlined text-gray-500">share</span>
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



               
                <div className="flex flex-wrap gap-2 mt-2">
                  <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-3 py-3 bg-green-600 rounded-lg text-white text-sm text-center active:scale-95"
                  >
                Contact Seller on WhatsApp
              </a>
                 {ENABLE_CART_UI && (
                  cartProduct ? ( 
                    <button
                      onClick={() => (dispatch(removeProduct(id)), toast.success("Removed from cart!"))}
                      className="flex-1 px-3 py-2 border-primary border rounded-lg text-xs sm:text-sm text-primary"
                    >
                      Remove from Cart
                    </button>
                  ) : (
                    <button
                      onClick={() => (dispatch(addProduct({ ...product, cartQuantity: 1 })), toast.success("Added to cart!"))}
                      className="flex-1 px-3 py-2 border-primary border rounded-lg text-xs sm:text-sm text-primary"
                    >
                      Add to Cart
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Feedback */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className="font-medium text-sm sm:text-base">Customer Feedback</h2>
              <Feedback
                name="Akeyande Nurudeen"
                rating={5}
                comment="Amazing sound quality and comfortable to wear!"
                date="Dec.26,2024"
              />
              <Feedback
                name="Abdullahi Bello Saidu"
                rating={4}
                comment="Great product, but I wish it came in more colour options."
                date="Dec.27,2024"
              />
            </div>

            {/* Reseller block */}
            <div className="space-y-2">
              <h2 className="text-primary text-sm font-medium">
                Want to resell this Product and earn profit?
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Click below to generate your reseller link. All sales made through your link
                will earn you commission.
              </p>
              <div className="flex flex-col lg:flex-row justify-between gap-3">
                <div>
                  <h3 className="text-sm sm:text-base font-semibold">💰 Commission Details:</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Earn ₦10,000 per sale through your reseller link.
                  </p>
                </div>
                <button
                  onClick={handleGenerateResellerLink}
                  className="px-3 py-2 bg-primary rounded-lg text-white text-xs sm:text-sm active:scale-95 transition-transform"
                >
                  Generate Reseller Link
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ASIDE */}
      <aside className="order-first lg:order-last">
        {seller && <SellerInfoAside {...seller} />}
      </aside>

      {/* Modal */}
      <ResellerLinkModal
        open={resellerModalOpen}
        onClose={() => setResellerModalOpen(false)}
        data={resellerData}
      />
    </div>
  );
}

function Info({ heading, value }: { heading: string; value: ReactNode }) {
  return (
    <p className="text-xs sm:text-sm">
      <b>{heading}:</b> <span className="text-gray-600">{value}</span>
    </p>
  );
}
