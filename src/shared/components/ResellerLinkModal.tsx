// src/shared/components/ResellerLinkModal.tsx
import React, { useEffect } from "react";
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
        // Twitter is now X, still use intent url
        shareUrl = `https://twitter.com/intent/tweet?text=${text}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${text}`;
        break;
      case "instagram":
        // Instagram doesn't support direct share URLs for links. Open profile and instruct copy.
        shareUrl = `https://www.instagram.com/`;
        break;
      case "tiktok":
        shareUrl = `https://www.tiktok.com/`;
        break;
      default:
        shareUrl = url;
    }

    // open in new window
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  // custom promo message (uses product name and reseller url)
  const promoMessage = `Upgrade your tech game with ${product?.name} — durable, affordable, and reliable. Get yours here: ${url}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative bg-white rounded-[28px] shadow-2xl max-w-[920px] w-full overflow-auto max-h-[90vh]">
        {/* close */}
        <button
          onClick={onClose}
          aria-label="Close reseller modal"
          className="absolute right-4 top-4 z-20 p-2 rounded-full bg-white hover:bg-gray-100 shadow-sm"
        >
          <X size={20} />
        </button>

        <div className="px-6 py-6 sm:px-10 sm:py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left content */}
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-semibold underline decoration-primary decoration-2 underline-offset-4 text-left">
                Your Reseller Link is Ready!
              </h2>

              <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                Share your unique reseller link along with product images and
                descriptions across your social networks, including WhatsApp,
                Facebook, Instagram, and more. Start earning by promoting the
                product today!
              </p>

              <p className="mt-3 text-sm font-medium text-zinc-800">
                Earn ₦10,000 every time someone purchases this product using your
                link!
              </p>

              {/* Link row */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex-1 bg-[#F3F5FF] rounded-full px-4 py-3 shadow-inner text-sm break-words">
                  <span className="text-xs text-zinc-500">Your Reseller Link:</span>
                  <div className="mt-1 text-sm text-zinc-800 break-words">{url}</div>
                </div>

                <button
                  onClick={() => copyToClipboard(url, "Reseller link copied")}
                  className="ml-2 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm shadow"
                >
                  <Copy size={16} /> Copy Link
                </button>
              </div>

              {/* social share grid */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <ShareRow
                  onShare={() => shareToPlatform("facebook")}
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.3V12h2.3V9.6c0-2.3 1.4-3.6 3.4-3.6.98 0 2 .18 2 .18v2.2h-1.12c-1.1 0-1.44.68-1.44 1.37V12h2.46l-.39 2.9h-2.07v7A10 10 0 0022 12z" />
                    </svg>
                  }
                  title="Resell on Facebook"
                />

                <ShareRow
                  onShare={() => shareToPlatform("twitter")}
                  icon={<XIcon />}
                  title="Resell on Twitter"
                />

                <ShareRow
                  onShare={() => shareToPlatform("instagram")}
                  icon={<InstagramIcon />}
                  title="Resell on Instagram"
                />

                <ShareRow
                  onShare={() => shareToPlatform("tiktok")}
                  icon={<TikTokIcon />}
                  title="Resell on TikTok"
                />

                <ShareRow
                  onShare={() => shareToPlatform("whatsapp")}
                  icon={<WhatsAppIcon />}
                  title="Resell on WhatsApp"
                />

                {/* one more slot for spacing or other platform */}
                <div />
              </div>

              {/* Divider */}
              <div className="mt-6 border-t border-zinc-200" />

              {/* Download images + promo message */}
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Download Product Images</h4>
                  <p className="text-xs text-zinc-500">
                    Click the buttons below to download product images directly to your device.
                  </p>

                  <div className="flex flex-col gap-2 mt-3">
                    {(product?.product_images?.length || 0) > 0 ? (
                      product!.product_images!.slice(0, 3).map((img, i) => (
                        <button
                          key={i}
                          className="text-left px-3 py-2 rounded-full border border-zinc-200 bg-white text-sm"
                          onClick={() =>
                            downloadImage(img.file_path, `${product!.name || "product"}-${i + 1}.jpg`)
                          }
                        >
                          Image {i + 1}
                        </button>
                      ))
                    ) : (
                      <>
                        <button
                          className="text-left px-3 py-2 rounded-full border border-zinc-200 bg-white text-sm"
                          onClick={() => downloadImage(primaryImage, `${product?.name || "product"}-1.jpg`)}
                        >
                          Image 1
                        </button>
                        <button
                          className="text-left px-3 py-2 rounded-full border border-zinc-200 bg-white text-sm"
                          onClick={() => downloadImage(primaryImage, `${product?.name || "product"}-2.jpg`)}
                        >
                          Image 2
                        </button>
                        <button
                          className="text-left px-3 py-2 rounded-full border border-zinc-200 bg-white text-sm"
                          onClick={() => downloadImage(primaryImage, `${product?.name || "product"}-3.jpg`)}
                        >
                          Image 3
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <h4 className="text-sm font-medium">Custom Message to Promote your Link</h4>
                  <p className="text-xs text-zinc-500">
                    Use or customise the message below when sharing on social media.
                  </p>

                  <div className="mt-3 bg-white border border-zinc-100 rounded-xl p-4 shadow-sm">
                    <p className="text-sm text-zinc-700 leading-relaxed">
                      {promoMessage}
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <button
                        onClick={() => copyToClipboard(promoMessage, "Promo message copied")}
                        className="px-3 py-2 bg-primary text-white rounded-full text-sm flex items-center gap-2"
                      >
                        <Copy size={14} /> Copy Link
                      </button>

                      <button
                        onClick={() => {
                          // open share dialog fallback: copy and notify
                          copyToClipboard(promoMessage, "Promo message copied");
                        }}
                        className="px-3 py-2 border border-zinc-200 rounded-full text-sm"
                      >
                        Share Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* footer actions */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-start items-stretch">
                <a
                  href={`/marketplace`}
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#2F6AE2] text-white rounded-full text-sm shadow"
                >
                  Check more Product
                </a>
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center px-6 py-3 border border-zinc-200 rounded-full text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Right product art */}
            <div className="w-full lg:w-[240px] flex justify-center lg:justify-end items-start">
              <div className="w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] bg-white rounded-2xl flex items-center justify-center shadow-lg">
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

/* ---------- small subcomponents & icons ---------- */

function ShareRow({
  onShare,
  icon,
  title,
}: {
  onShare: () => void;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <button
      onClick={onShare}
      className="flex items-center gap-3 px-3 py-2 rounded-md border border-zinc-100 bg-white text-left text-sm shadow-sm"
    >
      <div className="w-8 h-8 rounded-md flex items-center justify-center bg-[#F3F5FF]">
        {icon}
      </div>
      <div className="flex-1 text-xs sm:text-sm">
        <div className="font-medium">{title}</div>
        <div className="text-primary text-xs">Share</div>
      </div>
    </button>
  );
}

function XIcon() {
  // simple X / Twitter placeholder
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012 7v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 7.5A4 4 0 1016 14a4 4 0 00-4-4.5zm4.8-3.2a1.2 1.2 0 11-1.2-1.2 1.2 1.2 0 011.2 1.2z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 3v12a4 4 0 104 4V7h3V3h-7z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 3.77A11.94 11.94 0 0012 1C6 1 1 6 1 12c0 2.12.56 4.1 1.54 5.84L1 23l5.48-1.42A11.94 11.94 0 0012 23c6 0 11-5 11-11 0-1-.12-1.97-.32-2.93zM12 19.5c-2.1 0-4.03-.8-5.5-2.1l-.4-.35-2.6.67.7-2.55-.33-.42A8.5 8.5 0 013.5 12c0-4.69 3.81-8.5 8.5-8.5 2.27 0 4.36.88 5.95 2.47v3.38h-1.9a3.2 3.2 0 00-3.1-2.2 3.2 3.2 0 00-3.2 3.2c0 .5.12.98.35 1.4.12.25.05.55-.2.72l-1.07.8c.5 1 1.37 1.78 2.44 2.12.58.2 1.2.31 1.82.31 1.14 0 2.24-.35 3.14-1V19.5z" />
    </svg>
  );
}
