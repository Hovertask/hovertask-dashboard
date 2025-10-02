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
import useProductWithSeller from "../../hooks/useProductWithSeller"; // ✅ new hook

export default function SingleProductPage() {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const imageCarouselRef = useRef<HTMLDivElement>(null);
  const timeout = useRef<number>(null);
  const demoImages = [
    "/assets/images/demo-product.png",
    "/assets/images/demo-product-2.png",
  ];

  const { id } = useParams<{ id: string }>();
  const { product, seller, loading, error } = useProductWithSeller(id!); // ✅ merged hook
  const dispatch = useDispatch();
  const cartProduct = useCartItem(id!);

  useEffect(() => {
    if (!imageCarouselRef.current) return;
    const singleSlideWidth = imageCarouselRef.current?.clientWidth;
    imageCarouselRef.current?.scroll({
      left: singleSlideWidth! * activeImageIndex,
    });
  }, [activeImageIndex]);

  useEffect(() => {
    if (!imageCarouselRef.current) return;

    const updateActiveIndexOnScrollEnd = () => {
      if (timeout.current) clearTimeout(timeout.current!);
      timeout.current = setTimeout(() => {
        const singleSlideWidth = imageCarouselRef.current?.clientWidth;
        const scrollLeft = imageCarouselRef.current?.scrollLeft;
        setActiveImageIndex(Math.round(scrollLeft! / singleSlideWidth!));
      }, 100);
    };

    imageCarouselRef.current.addEventListener("scroll", updateActiveIndexOnScrollEnd);
    return () => {
      imageCarouselRef.current?.removeEventListener("scroll", updateActiveIndexOnScrollEnd);
    };
  });

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mobile:grid grid-cols-[1fr_200px] gap-4 min-h-full">
      <div className="bg-white shadow-md px-4 py-8 space-y-8 overflow-hidden">
        {product && seller && (
          <>
            <header className="flex gap-4">
              <Link to={"/marketplace"}>
                <ArrowLeft size={25} />
              </Link>
              <div className="flex items-center gap-4">
                <img
                  src={seller.avatar || "/assets/images/demo-avatar.png"}
                  width={52}
                  alt="Seller avatar"
                />
                <div>
                  <h1 className="text-xl font-medium capitalize">
                    {seller.fname} {seller.lname}
                  </h1>
                  <Link
                    className="text-primary hover:underline"
                    to={`/marketplace/s/${seller.id}`}
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </header>

            {/* Image carousel */}
            <div>
              <div className="relative overflow-hidden space-y-3">
                {/* Nav buttons */}
                {product.product_images?.length > 1 && (
                  <>
                    {activeImageIndex > 0 && (
                      <button
                        onClick={() => setActiveImageIndex(activeImageIndex - 1)}
                        className="cursor-pointer p-2 absolute top-1/2 left-4 -translate-y-1/2"
                      >
                        <ChevronLeft size={30} />
                      </button>
                    )}
                    {activeImageIndex < product.product_images.length - 1 && (
                      <button
                        onClick={() => setActiveImageIndex(activeImageIndex + 1)}
                        className="cursor-pointer p-2 absolute top-1/2 right-4 -translate-y-1/2"
                      >
                        <ChevronRight size={30} />
                      </button>
                    )}
                  </>
                )}

                <div
                  ref={imageCarouselRef}
                  className="max-w-full overflow-auto snap-mandatory snap-x flex no-scrollbar"
                >
                  {product.product_images?.map((image) => (
                    <div
                      className="snap-center snap-always w-full min-w-full max-w-full"
                      key={image.file_path}
                    >
                      <img
                        className="max-w-[90%] block mx-auto"
                        src={image.file_path}
                        alt=""
                      />
                    </div>
                  ))}
                </div>

                <div className="flex overflow-auto justify-end gap-4">
                  {demoImages.map((image, i) => (
                    <button
                      className="cursor-pointer"
                      onClick={() => setActiveImageIndex(i)}
                      key={i}
                    >
                      <img className="h-[52px] w-auto" src={image} alt="" />
                    </button>
                  ))}
                </div>

                <div
                  style={{ gridTemplateColumns: `repeat(${demoImages.length + 1}, 14px)` }}
                  className="w-fit grid gap-2 mx-auto"
                >
                  {demoImages.map((_, i) => (
                    <div
                      key={i}
                      className={`${
                        activeImageIndex === i ? "bg-primary col-span-2" : "bg-[#B3B3B3]"
                      } h-0.75`}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Product description */}
              <div className="bg-gradient-to-b from-white to-[#DAE2FF] py-8 px-1 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                  <div className="space-y-1 col-span-9">
                    <h2 className="text-lg font-medium">{product.name}</h2>
                    <p className="text-sm text-secondary">{product.description}</p>
                    <Info heading="Brand" value="None" />
                    <Info heading="Size" value="None" />
                    <Info heading="Color" value="None" />
                  </div>

                  <div className="col-span-2 flex flex-col justify-between space-y-3">
                    {/* Price */}
                    <div className="relative before:absolute before:w-full before:h-full before:bg-gradient-to-b before:from-[#4B70F5] before:to-[#2C418F00] before:rounded-lg before:-rotate-6 before:z-0 before:opacity-20 w-fit">
                      {product.discount && (
                        <p className="line-through text-[#77777A] text-xs relative">
                          ₦{Number(product.price).toLocaleString()}
                        </p>
                      )}
                      <p className="text-lg font-medium relative">
                        ₦
                        {product.discount
                          ? Number(
                              (
                                product.price -
                                (product.price * product.discount) / 100
                              ).toFixed(2),
                            ).toLocaleString()
                          : product.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-3 justify-center p-2 rounded-md bg-gradient-to-b from-[#DAE2FF] to-[#DAE2FF00] w-fit">
                      <button
                        className="active:scale-95 transition-transform"
                        onClick={() => addProductToWishlist(product.id)}
                      >
                        <span style={{ fontSize: 18 }} className="material-icons-outlined">
                          favorite
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          shareProduct({
                            name: product.name,
                            id: product.id,
                            description: product.description,
                          })
                        }
                        className="active:scale-95 transition-transform"
                      >
                        <span style={{ fontSize: 18 }} className="material-icons-outlined">
                          share
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="h-1 border-t border-dashed border-[#66666666] w-[80%] mx-auto"></div>

                <div className="flex gap-x-4 gap-y-2 justify-between text-sm text-[#77777A] whitespace-nowrap flex-wrap">
                  <div className="flex gap-6 items-center">
                    <span className="inline-flex items-center gap-2">
                      <span style={{ fontSize: 14 }} className="material-icons-outlined">
                        location_on
                      </span>{" "}
                      Address not provided
                    </span>
                    <span>|</span>
                    <span className="inline-flex items-center gap-2">
                      <Eye size={14} /> {product.reviews_count || 0} views
                    </span>
                  </div>
                  <div className="flex gap-6">
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

                <div className="flex gap-6 flex-wrap">
                  <button className="px-4 py-2 active:scale-90 transition-transform bg-primary rounded-xl text-sm text-white">
                    Contact Seller
                  </button>
                  {cartProduct ? (
                    <button
                      onClick={() => (
                        dispatch(removeProduct(id)),
                        toast.success("Product removed from cart!")
                      )}
                      className="px-4 py-2 active:scale-90 transition-transform border-primary border-1 rounded-xl text-sm text-primary"
                    >
                      Remove from Cart
                    </button>
                  ) : (
                    <button
                      onClick={() => (
                        dispatch(addProduct({ ...product, cartQuantity: 1 })),
                        toast.success("Product added to cart!")
                      )}
                      className="px-4 py-2 active:scale-90 transition-transform border-primary border-1 rounded-xl text-sm text-primary"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Customer feedback */}
            <div className="space-y-4">
              <h2 className="font-medium">Customer Feedback</h2>
              <div className="space-y-6">
                <Feedback
                  name="Onah Victor"
                  rating={3}
                  comment="Amazing sound quality and super comfortable to wear! The battery life is a game-changer."
                  date="Dec.29,2024"
                />
                <Feedback
                  name="Onah Victor"
                  rating={5}
                  comment="Amazing sound quality and super comfortable to wear! The battery life is a game-changer."
                  date="Dec.29,2024"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-primary text-[13.34px] font-medium">
                You want to resell this product and make profit?
              </h2>
              <p className="font-light">
                To start reselling this product, simply click the button below to generate
                your unique reseller link. This personalized link will track all your sales
                for this specific product. 💰 Commission Details: You will earn a reseller
                commission of ₦10,000 every time someone purchases this product using your
                unique link. Take Action Now! Click the button below and start earning today!
              </p>
              <div>
                <h3 className="text-lg">💰Commission Details:</h3>
                <p className="font-light">
                  You will earn a reseller commission of ₦10,000 every time someone
                  purchases this product using your unique link.
                </p>
              </div>
              <div className="flex justify-between flex-wrap gap-2 items-end">
                <div>
                  <h3 className="text-lg">Take Action Now!</h3>
                  <p className="font-light">Click the button to start earning today.</p>
                </div>
                <button className="px-4 py-2 active:scale-90 transition-transform bg-primary rounded-xl text-white text-sm h-fit">
                  Generate Reseller Link
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div>{seller && <SellerInfoAside {...seller} />}</div>
    </div>
  );
}

function Info({ heading, value }: { heading: string; value: ReactNode }) {
  return (
    <p className="text-sm">
      <b>{heading}:</b> <span className="text-secondary">{value}</span>
    </p>
  );
}
