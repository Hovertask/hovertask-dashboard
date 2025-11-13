import { useState } from "react";
import advertsCategories from "../utils/advertsCategories";
import cn from "../../../../../utils/cn";
import { Link } from "react-router";
import AvailableJobs from "./../Availablejobs";

export default function TasksTabs() {
    const [currentCategory, setCurrentCategory] =
        useState<(typeof advertsCategories)[number]["key"]>("social_media");

    return (
        <div className="space-y-6">
            <p className="text-xs text-center text-secondary max-w-[637px] mx-auto">
                Earn steady income by promoting businesses and top brands on your social
                media platforms. To qualify for posting adverts on Facebook, Instagram,
                Twitter or TikTok, your account must have a minimum if 1,000 followers.
            </p>

            <div className="flex gap-3 max-w-full overflow-x-auto items-center w-fit mx-auto border border-zinc-300 p-4 rounded-2xl">
                {advertsCategories.map((category) => (
                    <button
                        type="button"
                        key={category.key}
                        onClick={() =>
                            setCurrentCategory(category.key as typeof currentCategory)
                        }
                        className={cn("p-2 rounded-lg text-xs whitespace-nowrap", {
                            "bg-primary text-white transition-all active:scale-x-90":
                                currentCategory === category.key,
                            "text-secondary bg-zinc-300 border border-zinc-400":
                                currentCategory !== category.key,
                        })}
                    >
                        {category.label}
                    </button>
                ))}
            </div>

            <div className="flex justify-end max-w-[676px] mx-auto pr-8">
                <Link to="/earn/tasks-history" className="text-primary hover:underline">
                    Check advert-task history
                </Link>
            </div>

            <div>
                <img src="/images/Group 1000004395.png" alt="" />
            </div>

            <AvailableJobs filter={currentCategory} />
        </div>
    );
}
