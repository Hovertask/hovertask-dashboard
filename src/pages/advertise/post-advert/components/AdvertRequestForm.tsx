import { useDisclosure } from "@heroui/react";
import { useEffect, useRef, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import Input from "../../../../shared/components/Input";
import {
  Church,
  Globe,
  Hash,
  LinkIcon,
  Speaker,
  User,
  DollarSign,
  Users,
  X,
} from "lucide-react";
import CustomSelect from "../../../../shared/components/Select";
import {
  genders,
  religions,
  socialMedia,
  states,
} from "../../../../utils/selectAndAutocompletOptions";
import ImageInput from "../../../../shared/components/ImageInput";
import AdvertSummaryModal from "./AdvertSummaryModal";
import AdvertUploadSuccessModal from "./AdvertUploadSuccessModal";
import Loading from "../../../../shared/components/Loading";
import {
  descriptionValidation,
  urlValidation,
} from "../../../../utils/inputValidationPatterns";
import Label from "./Label";
import SetPaymentMethod from "./SetPaymentMethod";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { Button } from "@heroui/react";


const platformConfig: Record<
  string,
  {
    illustrativeTitle: string;
    inputLabel: string;
    inputDescription: string;
    registerKey: string;
    paymentPerAdvert: number;
  }
> = {
  whatsapp: {
    illustrativeTitle: "Promote Brands on Your WhatsApp ",
    inputLabel: "Select Number of WhatsApp  Post",
    inputDescription:
      "Earn by posting sponsored content on your WhatsApp status. Choose how many posts you want to share.",
    registerKey: "no_of_status_post",
    paymentPerAdvert: 100,
  },
  instagram: {
    illustrativeTitle: "Earn by Posting Brand Stories on Instagram",
    inputLabel: "Select Number of Instagram Story Posts",
    inputDescription:
      "Share brand adverts on your Instagram story and get paid per post.",
    registerKey: "no_of_status_post",
    paymentPerAdvert: 150,
  },
  facebook: {
    illustrativeTitle: "Help Businesses Grow on Facebook",
    inputLabel: "Select Number of Facebook Timeline Posts",
    inputDescription:
      "Promote business adverts on your Facebook timeline and earn rewards for each post.",
    registerKey: "no_of_status_post",
    paymentPerAdvert: 150,
  },
  x: {
    illustrativeTitle: "Post Sponsored Tweets and Get Paid",
    inputLabel: "Select Number of X (Twitter) Posts",
    inputDescription:
      "Support brands by tweeting their adverts on your X (Twitter) profile. Earn per post.",
    registerKey: "no_of_status_post",
    paymentPerAdvert: 150,
  },
  tiktok: {
    illustrativeTitle: "Create TikTok Videos for Brand Promotions",
    inputLabel: "Select Number of TikTok Videos",
    inputDescription:
      "Promote products or brands with short TikTok videos and earn money for each video you post.",
    registerKey: "no_of_status_post",
    paymentPerAdvert: 150,
  },
};

type AdvertRequestFormProps = {
  platform?: string;
};

export default function AdvertRequestForm({ platform }: AdvertRequestFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const successModalProps = useDisclosure();
  const modalProps = useDisclosure();
  const [pendingAdvert, setPendingAdvert] = useState<{
    id: number;
    user_id: number;
    type: string;
  } | null>(null);

  // 💰 Payment Summary Feature State
  const [showSummary, setShowSummary] = useState(false);

  const isEngagementTask =
    new URLSearchParams(window.location.search).get("type") === "engagement";

  const engagementType = new URLSearchParams(window.location.search).get(
    "engagementType"
  );

  const [selectedPlatform, setSelectedPlatform] = useState<string>(
    platform || ""
  );

  const {
    register,
    getValues,
    trigger,
    clearErrors,
    formState: { errors, isValid, isSubmitting },
    setValue,
    watch,
    setError,
  } = useForm();

  useEffect(() => {
    if (isValid) clearErrors();
  }, [isValid, clearErrors]);

  useEffect(() => {
    if (platform) {
      setValue("platforms", platform, { shouldValidate: true });
      setSelectedPlatform(platform);

      const config = platformConfig[platform.toLowerCase()];
      if (config) {
        setValue("payment_per_task", config.paymentPerAdvert);
        setValue("title", config.illustrativeTitle);
      }
    }
  }, [platform, setValue]);

  const config = selectedPlatform
    ? platformConfig[selectedPlatform.toLowerCase()]
    : null;

  const participants = watch("number_of_participants") || 0;
  const paymentPerTask = watch("payment_per_task") || 0;
  const noOfPosts = config ? watch(config.registerKey) || 0 : 0;

  useEffect(() => {
    let cost = 0;
    if (isEngagementTask) cost = Number(participants) * Number(paymentPerTask);
    else cost = Number(noOfPosts) * Number(paymentPerTask);

    setValue("estimated_cost", cost, { shouldValidate: true });
  }, [participants, paymentPerTask, noOfPosts, isEngagementTask, setValue]);

 


  // ✅ Auto-fill engagement templates (title, description, payment)
  useEffect(() => {
    if (isEngagementTask && engagementType) {
      const templates: Record<
        string,
        { title: string; description: string; payment: number }
      > = {
        "Get Real People to Like your Social Media Post": {
          title: "Like pepoles Social Media Post",
          description:
            "Engage real users to like your post and boost its visibility organically.",
          payment: 5,
        },
        "Get Real People to Follow you": {
          title: "Follow peoples Social Media Account",
          description:
            "Increase your social following with genuine and verified users.",
          payment: 10,
        },
        "Get Real People to Comment to your Social Media Post": {
          title: "Post Comments on peoples Social Media Post",
          description:
            "Encourage authentic comments to increase engagement and trust.",
          payment: 10,
        },
        "Get Real People to Subscribe to your Channel": {
          title: "subscribe to peoples Channel",
          description:
            "Get more subscribers who are interested in your content.",
          payment: 15,
        },
      };

      const selected = templates[engagementType];
      if (selected) {
        setValue("title", selected.title);
        setValue("description", selected.description);
        setValue("payment_per_task", selected.payment);
      }
    }
  }, [isEngagementTask, engagementType, setValue]);

  // ✅ Auto-set deadline for engagement tasks (30 days ahead)
  useEffect(() => {
    if (isEngagementTask) {
      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + 30);
      const formattedDate = futureDate.toISOString().split("T")[0];
      setValue("deadline", formattedDate);
    }
  }, [isEngagementTask, setValue]);


  /* ------------------------------- 👇 FIXED NEW LOGIC ------------------------------- */

  // ✅ Mapping of engagement types → allowed social platforms
  const engagementPlatformMap: Record<string, string[]> = {
    "Get Real People to Like your Social Media Post": [
      "Instagram",
      "Facebook",
      "X",
      "TikTok",
    ],
    "Get Real People to Follow you": ["Instagram", "X", "TikTok"],
    "Get Real People to Comment to your Social Media Post": [
      "Instagram",
      "Facebook",
      "X",
    ],
    "Get Real People to Subscribe to your Channel": ["YouTube"],
  };

  // ✅ Normalize helper for consistent string comparison
  const normalize = (s: unknown): string =>
    String(s ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, "");

      
  // ✅ Force all socialMedia items to match { key, label, value } shape
  type Option = { key: string; label: string; value: string };

  // ✅ Ensure the base list has uniform Option type
  const normalizedSocialMedia: Option[] = (socialMedia as any[]).map((opt) => {
    if (typeof opt === "string") {
      return { key: opt.toLowerCase(), label: opt, value: opt };
    }
    return {
      key: opt.key || opt.value || opt.label,
      label: opt.label || opt.value || opt.key,
      value: opt.value || opt.label || opt.key,
    };
  });

  // ✅ Filter social media options based on engagement type
  const filteredSocialMedia: Option[] = useMemo(() => {
    if (!isEngagementTask || !engagementType) return normalizedSocialMedia;

    const allowed = engagementPlatformMap[engagementType] ?? [];
    if (!allowed.length) return normalizedSocialMedia;

    const allowedNorm = allowed.map(normalize);

    return normalizedSocialMedia.filter((opt) =>
      allowedNorm.includes(normalize(opt.value))
    );
  }, [isEngagementTask, engagementType]); // ✅ cleaned dependency list

  // ✅ Auto-select platform if only one option remains
  useEffect(() => {
    if (!isEngagementTask) return;
    if (!filteredSocialMedia || filteredSocialMedia.length !== 1) return;

    const first = filteredSocialMedia[0];
    setValue("platforms", first.value, { shouldValidate: true });
    setSelectedPlatform(first.value);
  }, [filteredSocialMedia, isEngagementTask, setValue]);

  // ✅ Clear platform if current selection no longer allowed
  useEffect(() => {
    if (!isEngagementTask) return;

    const current = getValues("platforms");
    const allowed = engagementPlatformMap[engagementType ?? ""] ?? [];

    if (
      current &&
      allowed.length &&
      !allowed.map(normalize).includes(normalize(current))
    ) {
      setValue("platforms", "", { shouldValidate: true });
      setSelectedPlatform("");
    }
  }, [engagementType, isEngagementTask, getValues, setValue]);

  /* --------------------------------------------------------------------------- */


  const totalCost =
    (isEngagementTask ? participants : noOfPosts) * (paymentPerTask || 0);

  return (
    <>
      <form id="advert-form" className="p-6 space-y-6" ref={formRef}>
        {/* ✅ Engagement header */}
                {isEngagementTask && engagementType && (
                  <div className="bg-primary/10 border border-primary text-primary rounded-xl p-3 text-sm mb-3">
                    <strong>Selected Engagement Type:</strong> {engagementType}
                  </div>
                )}
        
                {/* Title */}
                {!isEngagementTask && config && (
                  <Input
                    className="hidden"    
                    icon={<Speaker size={16} />}
                    placeholder="Enter the title of your advert"
                    {...register("title", {
                      required: "Enter the title of your advert",
                      pattern: { value: /\w+(?:\s*.+)*/, message: "Enter a valid title." },
                    })}
                    errorMessage={errors.title?.message as string}
                  />
                )}
        
                {/* Hidden input for validation */}
                {isEngagementTask && (
               <input
                  type="hidden"
                  {...register("title", { required: "title is required" })}
                />
                )}
        
               {/* ✅ Platform selection for normal adverts */}
        {!isEngagementTask && (
          <CustomSelect
            options={
              platform
                ? [{ key: platform.toLowerCase(), label: platform }]
                : socialMedia
            }
            aria-label="Selected Platform"
            label={
              <Label
                title={platform ? "Selected Platform" : "Choose Platform to create advert on"}
                description="Choose the platform where you'd like to advertise."
              />
            }
            placeholder="Select platform"
            className="[&_button]:rounded-full max-w-[250px] [&_button]:bg-white"
            startContent={<Globe />}
            defaultSelectedKeys={platform ? [platform.toLowerCase()] : []}
            onChange={(value) => {
              const platformValue = Array.isArray(value) ? value[0] : value;
              setSelectedPlatform(platformValue);
              setValue("platforms", platformValue, { shouldValidate: true });
            }}
            errorMessage={errors.platforms?.message as string}
          />
        )}
        
        
                {/* ✅ Updated Platform Selection for Engagement */}
                {isEngagementTask && (
                  <div>
                    <CustomSelect
                      options={filteredSocialMedia}
                      aria-label="Select Platform"
                      label={
                        <Label
                          title="Select Platform"
                          description="Choose the platform where you'd like to create engagement on."
                        />
                      }
                      placeholder="Select platform"
                      className="[&_button]:rounded-full max-w-[250px] [&_button]:bg-white"
                      startContent={<Globe />}
                      onChange={(value) =>
                        setValue("platforms", value, { shouldValidate: true })
                      }
                      errorMessage={errors.platforms?.message as string}
                    />
        
                    {/* Helper note showing allowed platforms */}
                    {engagementType && (
                      <small className="block mt-2 text-xs text-zinc-500">
                        Platforms available for this engagement:{" "}
                        {(engagementPlatformMap[engagementType] ?? []).join(", ") || "All"}
                      </small>
                    )}
                  </div>
                )}
        
                {/* Hidden input for validation */}
                <input
                  type="hidden"
                  {...register("platforms", { required: "Platform is required" })}
                />
        
                {/* Dynamic input (based on platform) */}
                 {!isEngagementTask && config && (
                  <Input
                    className="max-w-[250px] rounded-full bg-white"
                    label={
                      <Label
                        title={config.inputLabel}
                        description={config.inputDescription}
                      />
                    }
                    icon={<Hash size={16} />}
                    placeholder="0"
                    {...register(config.registerKey, {
                      required: `Enter the number of ${selectedPlatform} posts you want`,
                      pattern: {
                        value: /^\d+$/,
                        message: "Enter a valid number",
                      },
                    })}
                    errorMessage={errors[config.registerKey]?.message as string}
                  />
                )}
        
                {/* Number of Participants */}
                {isEngagementTask && (
                  <Input
                    className="max-w-[250px] rounded-full bg-white"
                    label={
                      <Label
                        title="Number of Participants"
                        description="Enter how many participants should engage with this task."
                      />
                    }
                    icon={<Users size={16} />}
                    placeholder="0"
                    {...register("number_of_participants", {
                      required: "Enter number of participants",
                      pattern: {
                        value: /^\d+$/,
                        message: "Enter a valid number",
                      },
                    })}
                    errorMessage={errors.number_of_participants?.message as string}
                  />
                )}
        
                {/* Payment per Task */}
                <Input
                  className="hidden"
                  icon={<DollarSign size={16} />}
                  placeholder="0"
                  {...register("payment_per_task", {
                    required: "Enter payment per task",
                    pattern: {
                      value: /^\d+$/,
                      message: "Enter a valid number",
                    },
                  })}
                  errorMessage={errors.payment_per_task?.message as string}
                />
        
                {/* Estimated Cost */}
                <Input
                  className="hidden"
                  icon={<DollarSign size={16} />}
                  placeholder="0"
                  value={
                    isEngagementTask
                      ? participants && paymentPerTask
                        ? participants * paymentPerTask
                        : ""
                      : noOfPosts && paymentPerTask
                      ? noOfPosts * paymentPerTask
                      : ""
                  }
                  readOnly
                  {...register("estimated_cost", { required: true })}
                />
        
                {/* Deadline - hidden automatically set */}
                {isEngagementTask && (
                  <input type="hidden" {...register("deadline", { required: true })} />
                )}
        
        
                {/* Gender */}
                <CustomSelect
                  options={genders}
                  label={
                    <Label
                      title="Select Gender"
                      description="Choose the target gender for your audience."
                    />
                  }
                  placeholder="Select gender"
                  className="[&_button]:rounded-full max-w-[250px] [&_button]:bg-white"
                  startContent={<User />}
                  onChange={(value) =>
                    setValue("gender", value, { shouldValidate: true })
                  }
                  errorMessage={errors.gender?.message as string}
                />
                <input
                  type="hidden"
                  {...register("gender", { required: "Gender is required" })}
                />
        
                {/* Location */}
                <CustomSelect
                  options={states}
                  label={
                    <Label
                      title="Select Location"
                      description="Choose the preferred location for your advert audience."
                    />
                  }
                  className="[&_button]:rounded-full [&_button]:bg-white"
                  selectionMode="multiple"
                  onChange={(value) =>
                    setValue("location", value, { shouldValidate: true })
                  }
                  errorMessage={errors.location?.message as string}
                />
                <input
                  type="hidden"
                  {...register("location", { required: "Location is required" })}
                />
        
                {/* Religion */}
                <CustomSelect
                  options={religions}
                  label={
                    <Label
                      title="Select Religion"
                      description="Choose the target religion for your audience."
                    />
                  }
                  className="[&_button]:rounded-full [&_button]:bg-white"
                  selectionMode="multiple"
                  placeholder="Select religion"
                  startContent={<Church />}
                  onChange={(value) =>
                    setValue("religion", value, { shouldValidate: true })
                  }
                  errorMessage={errors.religion?.message as string}
                />
                <input
                  type="hidden"
                  {...register("religion", { required: "Religion is required" })}
                />
        
                {/* Engagement Task URL */}
                {isEngagementTask && (
                  <Input
                    className="rounded-full bg-white"
                    label={
                      <Label
                        title="Your Social Media Post Link"
                        description="Provide the link to your post for tracking and verification."
                      />
                    }
                    icon={<LinkIcon size={16} />}
                    placeholder="Enter your post link"
                    type="url"
                    {...register("social_media_url", {
                      required: "Enter your post link",
                      pattern: urlValidation,
                    })}
                    errorMessage={errors.url?.message as string}
                  />
                )}
        
                {/* Task type */}
                <input
                  type="hidden"
                  value={isEngagementTask ? "engagement" : "advert"}
                  {...register("type")}
                />
        
                {/* Task category */}
                <input type="hidden" value="social_media" {...register("category")} />
        
        {/* Description */}
        {config && (
          <div className="space-y-1 text-sm">
            <Label
              title={
                isEngagementTask &&
                engagementType ===
                  "Get Real People to Comment to your Social Media Post"
                  ? "Enter Comment Instruction or Example"
                  : "Enter Advert Text or Caption"
              }
              description={
                isEngagementTask &&
                engagementType ===
                  "Get Real People to Comment to your Social Media Post"
                  ? "Provide clear instructions for the comment you want users to make. Example: ‘Comment “Great work!” on our latest video.’"
                  : "Write the text or caption for your advert."
              }
            />
        
            {/* 👇 Added this explanatory helper text */}
            {!isEngagementTask && (
              <p className="text-xs text-gray-600 leading-relaxed mb-2">
                Please enter the advert text or caption. The advert text or caption should be well detailed.
                You can also include a link to your site, a phone number for people to contact you, or any
                information you want people to see on your advert.
              </p>
            )}
        
            <textarea
              {...register("description", {
                required: "Enter task description.",
                pattern: descriptionValidation,
                minLength: {
                  value: 20,
                  message: "Description is too short.",
                },
              })}
              id="description"
              className="bg-white border border-zinc-300 rounded-2xl w-full h-40 focus:outline-primary p-4"
            />
        
            {errors.description && (
              <small className="text-danger">
                {errors.description.message as string}
              </small>
            )}
          </div>
        )}
        
                 {isEngagementTask && (
                <input 
                  type="hidden"
                  {...register("description")}
                />
                )}


                
        {!isEngagementTask && config && (
          <div>
            <Label
              title="Choose Your Advert Media Upload Option"
              description="Upload media for your advert."
            />

            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm px-3 py-1.5 rounded-lg bg-primary/10 border border-primary text-primary cursor-pointer"
                  htmlFor="media"
                >
                  Upload Video Advert
                </label>
                <label
                  className="text-sm px-3 py-1.5 rounded-lg bg-primary/10 border border-primary text-primary cursor-pointer"
                  htmlFor="media"
                >
                  Upload Image Advert
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Max file size: 20MB (image or video)
                </p>
              </div>

              <div className="max-w-[250px]">
                <ImageInput id="media" maxLength={3} required />
              </div>
            </div>
          </div>
        )}

        {/* 💰 Payment Summary Button */}
<div className="flex justify-center mt-6">
  <Button
    type="button"
    variant="bordered"
    className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-white transition"
    onPress={() => setShowSummary(true)}
  >
    <DollarSign size={18} />
    View Payment Summary
  </Button>
</div>


        {/* 💰 Payment Summary Modal (HeroUI version) */}
<Modal isOpen={showSummary} onClose={() => setShowSummary(false)}>
  <ModalContent className="sm:max-w-md p-4 rounded-xl">
    <ModalHeader className="flex justify-between items-center border-b pb-2">
      <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
        <DollarSign size={20} /> Payment Summary
      </h3>
      <button
        onClick={() => setShowSummary(false)}
        className="text-gray-500 hover:text-gray-800"
      >
        <X size={18} />
      </button>
    </ModalHeader>

    <ModalBody className="mt-3 text-sm text-gray-700 space-y-2">
      {isEngagementTask ? (
        <p>
          You’re creating an <strong>engagement task</strong> where you’ll
          pay participants to interact with your post.
        </p>
      ) : (
        <p>
          You’re creating a <strong>social media advert</strong>. You’ll
          pay based on the number of posts you want shared.
        </p>
      )}

      <p>
        <strong>Calculation:</strong>{" "}
        {isEngagementTask
          ? "Participants × Pay per Task"
          : "Posts × Pay per Task"}
      </p>

      <div className="mt-4 bg-white p-4 rounded-xl border border-zinc-200 shadow-sm space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {isEngagementTask ? "Participants" : "Number of Posts"}
          </span>
          <span className="font-medium text-gray-900">
            {isEngagementTask ? participants || 0 : noOfPosts || 0}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Pay per Task</span>
          <span className="font-medium text-gray-900">
            ₦{paymentPerTask?.toLocaleString() || "0"}
          </span>
        </div>

        <hr className="my-2" />

        <div className="flex justify-between text-base font-semibold">
          <span>Total Estimated Cost</span>
          <span className="text-primary">
            ₦{totalCost?.toLocaleString() || "0"}
          </span>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">
        This is the total amount you’ll fund for this campaign. No hidden
        fees.
      </p>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => setShowSummary(false)}
          className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition"
        >
          Okay, Got it
        </button>
      </div>
    </ModalBody>
  </ModalContent>
</Modal>


        {/* Payment Method Section (unchanged) */}
        <SetPaymentMethod
          onAdvertPreviewOpen={modalProps.onOpen}
          isFormValid={isValid}
          triggerValidationFn={trigger}
          estimatedCost={watch("estimated_cost") || 0}
        />

        {/* Modals (unchanged) */}
        {isValid && (
          <AdvertSummaryModal
            modalProps={modalProps}
            getFormValue={getValues}
            successModalProps={successModalProps}
            setError={setError}
            setPendingAdvert={setPendingAdvert}
          />
        )}
        <AdvertUploadSuccessModal
          {...successModalProps}
          pendingAdvert={pendingAdvert}
        />
      </form>

      {isSubmitting && <Loading fixed />}
    </>
  );
}
