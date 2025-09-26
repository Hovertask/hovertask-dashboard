import { Link } from "react-router";

export default function AdvertCard({
  platform,
  description,
  price,
  iconUrl,
  bgColor,
  borderColor,
}: any) {
  return (
    <div
      className={`flex items-center gap-4 p-4 max-sm:flex-col rounded-xl border ${borderColor} ${bgColor}`}
    >
      <img src={iconUrl} alt="" />
      <div className="flex-1">
        <h3 className="font-medium text-sm sm:text-base">
          Get Your Adverts on {platform}
        </h3>
        <p className="text-xs sm:text-sm text-gray-700 mt-1">{description}</p>
        <p className="text-xs font-medium text-black mt-2">
          <span className="font-semibold">Price:</span> {price} per Advert Post
        </p>
      </div>
      <Link
        to={`/advertise/post-advert?platform=${platform}`} // ✅ pass platform via query string
        className="bg-primary text-white text-xs px-4 py-2 rounded-full hover:bg-primary/90 transition"
      >
        Create Advert
      </Link>
    </div>
  );
}
