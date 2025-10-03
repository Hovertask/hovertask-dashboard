// src/shared/components/ResellerLinkModal.tsx
import { useEffect } from "react";
import { X, Copy } from "lucide-react";
import { toast } from "sonner";

type ProductImage = {
  file_path?: string;
  [key: string]: any;
};

type ResellerData = {
  product: {
    id: number;
    name: string;
    description?: string;
    price?: number;
    product_images?: ProductImage[];
    [key: string]: any;
  };
  reseller_url: string;
};

export default function ResellerLinkModal({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: ResellerData | null;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const product = data?.product;
  const url = data?.reseller_url || "";

  const primaryImage =
    product?.product_images?.[0]?.file_path || "/assets/images/demo-product.png";

  const copyToClipboard = async (text: string, successMsg = "Copied!") => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(successMsg);
    } catch (err) {
      console.error("copy failed", err);
      toast.error("Unable to copy");
    }
  };

  const downloadImage = async (imgUrl?: string, filename = "image.jpg") => {
    if (!imgUrl) {
      toast.error("No image available");
      return;
    }
    try {
      const res = await fetch(imgUrl);
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
      toast.success("Download started");
    } catch (err) {
      console.error("download failed", err);
      toast.error("Failed to download image");
    }
  };

  const shareToPlatform = (platform: string) => {
    const encoded = encodeURIComponent(url);
    const text = encodeURIComponent(
      `Check this out: ${product?.name} — ${url}`
    );

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encoded}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${text}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${text}`;
        break;
      case "instagram":
        shareUrl = `https://www.instagram.com/`;
        break;
      case "tiktok":
        shareUrl = `https://www.tiktok.com/`;
        break;
      default:
        shareUrl = url;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const promoMessage = `Upgrade your tech game with ${product?.name} — durable, affordable, and reliable. Get yours here: ${url}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative bg-white rounded-2xl sm:rounded-[28px] shadow-2xl w-full max-w-[920px] overflow-auto max-h-[90vh]">
        {/* close button */}
        <button
          onClick={onClose}
          aria-label="Close reseller modal"
          className="absolute right-3 top-3 sm:right-4 sm:top-4 z-20 p-1.5 sm:p-2 rounded-full bg-white hover:bg-gray-100 shadow-sm"
        >
          <X size={18} className="sm:w-5 sm:h-5" />
        </button>

        <div className="px-4 py-5 sm:px-8 sm:py-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left content */}
            <div className="flex-1">
              <h2 className="text-lg sm:text-2xl font-semibold underline decoration-primary decoration-2 underline-offset-4 text-left">
                Your Reseller Link is Ready!
              </h2>

              <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                Share your unique reseller link along with product images and
                descriptions across your social networks.
              </p>

              <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-zinc-800">
                Earn ₦10,000 every time someone purchases this product using your link!
              </p>

              {/* Link row */}
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 bg-[#F3F5FF] rounded-full px-3 py-2 sm:px-4 sm:py-3 shadow-inner text-xs sm:text-sm break-words">
                  <span className="block text-[10px] sm:text-xs text-zinc-500">
                    Your Reseller Link:
                  </span>
                  <div className="mt-1 text-zinc-800 break-words">{url}</div>
                </div>

                <button
                  onClick={() => copyToClipboard(url, "Reseller link copied")}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-primary text-white rounded-full text-xs sm:text-sm shadow"
                >
                  <Copy size={14} className="sm:w-4 sm:h-4" /> Copy Link
                </button>
              </div>

              {/* Social share grid */}
              <div className="mt-5 sm:mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <ShareRow onShare={() => shareToPlatform("facebook")} title="Resell on Facebook" />
                <ShareRow onShare={() => shareToPlatform("twitter")} title="Resell on Twitter" />
                <ShareRow onShare={() => shareToPlatform("instagram")} title="Resell on Instagram" />
                <ShareRow onShare={() => shareToPlatform("tiktok")} title="Resell on TikTok" />
                <ShareRow onShare={() => shareToPlatform("whatsapp")} title="Resell on WhatsApp" />
              </div>

              {/* Divider */}
              <div className="mt-5 sm:mt-6 border-t border-zinc-200" />

              {/* Download images + promo message */}
              <div className="mt-5 sm:mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                <div className="space-y-2 sm:space-y-3">
                  <h4 className="text-sm font-medium">Download Product Images</h4>
                  <div className="flex flex-col gap-2 mt-2 sm:mt-3">
                    {(product?.product_images?.length || 0) > 0 ? (
                      product!.product_images!.slice(0, 3).map((img, i) => (
                        <button
                          key={i}
                          className="text-left px-3 py-2 rounded-full border border-zinc-200 bg-white text-xs sm:text-sm"
                          onClick={() =>
                            downloadImage(img.file_path, `${product!.name || "product"}-${i + 1}.jpg`)
                          }
                        >
                          Image {i + 1}
                        </button>
                      ))
                    ) : (
                      <button
                        className="px-3 py-2 rounded-full border border-zinc-200 bg-white text-xs sm:text-sm"
                        onClick={() =>
                          downloadImage(primaryImage, `${product?.name || "product"}-1.jpg`)
                        }
                      >
                        Download Image
                      </button>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <h4 className="text-sm font-medium">Custom Promo Message</h4>
                  <div className="mt-2 sm:mt-3 bg-white border border-zinc-100 rounded-xl p-3 sm:p-4 shadow-sm">
                    <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
                      {promoMessage}
                    </p>

                    <div className="mt-3 flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => copyToClipboard(promoMessage, "Promo message copied")}
                        className="flex-1 sm:flex-none px-3 py-2 bg-primary text-white rounded-full text-xs sm:text-sm flex items-center justify-center gap-2"
                      >
                        <Copy size={12} className="sm:w-4 sm:h-4" /> Copy Message
                      </button>
                      <button
                        onClick={() => copyToClipboard(promoMessage, "Promo message copied")}
                        className="flex-1 sm:flex-none px-3 py-2 border border-zinc-200 rounded-full text-xs sm:text-sm"
                      >
                        Share Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* footer */}
              <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href={`/marketplace`}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-[#2F6AE2] text-white rounded-full text-xs sm:text-sm shadow"
                >
                  Check More Products
                </a>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 border border-zinc-200 rounded-full text-xs sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Right product preview */}
            <div className="w-full lg:w-[240px] flex justify-center lg:justify-end items-start">
              <div className="w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] lg:w-[200px] lg:h-[200px] bg-white rounded-xl sm:rounded-2xl flex items-center justify-center shadow">
                <img
                  src={primaryImage}
                  alt={product?.name}
                  className="max-w-[85%] max-h-[85%] object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- small subcomponents ---------- */
function ShareRow({ onShare, title }: { onShare: () => void; title: string }) {
  return (
    <button
      onClick={onShare}
      className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-md border border-zinc-100 bg-white text-left text-xs sm:text-sm shadow-sm"
    >
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center bg-[#F3F5FF]" />
      <div className="flex-1">
        <div className="font-medium">{title}</div>
        <div className="text-primary text-[11px] sm:text-xs">Share</div>
      </div>
    </button>
  );
}
