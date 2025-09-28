import { useDisclosure } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
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
  Calendar,
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

const platformConfig: Record<
  string,
  { inputLabel: string; inputDescription: string; registerKey: string }
> = {
  WhatsApp: {
    inputLabel: "Select Number of WhatsApp Status to Post",
    inputDescription:
      "Enter the number of WhatsApp status advert posts you'd like to request.",
    registerKey: "no_of_status_post",
  },
  Instagram: {
    inputLabel: "Select Number of Instagram Story Posts",
    inputDescription:
      "Enter how many Instagram story adverts you'd like to request.",
    registerKey: "no_of_status_post",
  },
  Facebook: {
    inputLabel: "Select Number of Facebook Timeline Posts",
    inputDescription:
      "Enter the number of Facebook timeline adverts you'd like to request.",
    registerKey: "no_of_status_post",
  },
  X: {
    inputLabel: "Select Number of X (Twitter) Posts",
    inputDescription: "Enter how many X (Twitter) posts you'd like to request.",
    registerKey: "no_of_status_post",
  },
  TikTok: {
    inputLabel: "Select Number of TikTok Videos",
    inputDescription:
      "Enter how many TikTok video adverts you'd like to request.",
    registerKey: "no_of_status_post",
  },
};

type AdvertRequestFormProps = {
  platform?: string;
};

export default function AdvertRequestForm({ platform }: AdvertRequestFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const successModalProps = useDisclosure();
  const modalProps = useDisclosure();

  const isEngagementTask =
    new URLSearchParams(window.location.search).get("type") === "engagement";

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
    }
  }, [platform, setValue]);

  // watch participants + payment to compute cost
  const participants = watch("number_of_participants") || 0;
  const paymentPerTask = watch("payment_per_task") || 0;

  useEffect(() => {
    const cost = Number(participants) * Number(paymentPerTask);
    setValue("estimated_cost", cost, { shouldValidate: true });
  }, [participants, paymentPerTask, setValue]);

  const config = selectedPlatform ? platformConfig[selectedPlatform] : null;

  return (
    <>
      <form id="advert-form" className="p-6 space-y-6" ref={formRef}>
        {/* Title */}
        {config && (
          <Input
            className="rounded-full bg-white"
            label={
              <Label
                title="Title of advert"
                description="Enter the title of your advert that will be displayed to others."
              />
            }
            icon={<Speaker size={16} />}
            placeholder="Enter the title of your advert"
            {...register("title", {
              required: "Enter the title of your advert",
              pattern: {
                value: /\w+(?:\s*.+)*/,
                message: "Enter a valid title.",
              },
            })}
            errorMessage={errors.title?.message as string}
          />
        )}

        {/* Platform Selection for advert */}
        {config && (
          <CustomSelect
            options={socialMedia}
            aria-label="Selected Platform"
            label={
              <Label
                title={
                  platform
                    ? "Selected Platform"
                    : "Choose Platform to create engagement On"
                }
                description={
                  platform
                    ? "This field is read-only because the platform was already selected on the advertise page."
                    : "Choose the platform where you'd like to advertise."
                }
              />
            }
            placeholder="Select platform"
            className="[&_button]:rounded-full max-w-[250px] [&_button]:bg-white"
            startContent={<Globe />}
            defaultSelectedKeys={platform ? [platform.toLowerCase()] : []}
            isDisabled
            onChange={(value) => {
              const platformValue = Array.isArray(value) ? value[0] : value;
              setSelectedPlatform(platformValue);
              setValue("platforms", platformValue, { shouldValidate: true });
            }}
            errorMessage={errors.platforms?.message as string}
          />
        )}

        {/* Platform Selection for engagement */}
        {isEngagementTask && (
          <CustomSelect
            options={socialMedia}
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
        )}

        {/* Hidden input so react-hook-form submits it */}
        <input
          type="hidden"
          {...register("platforms", { required: "Platform is required" })}
        />

        {/* Dynamic input (based on platform) */}
        {config && (
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
        {isEngagementTask && (
          <Input
            className="max-w-[250px] rounded-full bg-white"
            label={
              <Label
                title="Payment Per Task"
                description="Enter the amount to be paid per task engagement."
              />
            }
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
        )}

        {/* Estimated Cost */}
        {isEngagementTask && (
          <Input
            className="max-w-[250px] rounded-full bg-white"
            label={
              <Label
                title="Estimated Cost"
                description="Automatically calculated as participants × payment per task."
              />
            }
            icon={<DollarSign size={16} />}
            placeholder="0"
            value={
              participants && paymentPerTask
                ? participants * paymentPerTask
                : ""
            }
            readOnly
            {...register("estimated_cost", { required: true })}
          />
        )}

        {/* Deadline */}
        {isEngagementTask && (
          <Input
            className="max-w-[250px] rounded-full bg-white"
            type="date"
            label={
              <Label
                title="Deadline"
                description="Select the deadline date for this advert engagement."
              />
            }
            icon={<Calendar size={16} />}
            {...register("deadline", {
              required: "Select a deadline",
            })}
            errorMessage={errors.deadline?.message as string}
          />
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
            {...register("url", {
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

        {/* Description */}
        <div className="space-y-1 text-sm">
          <Label
            title="Enter Advert Text or Caption"
            description="Write the text or caption for your advert."
          />
          <textarea
            {...register("description", {
              required: "Enter task description.",
              pattern: descriptionValidation,
              min: { value: 20, message: "Description is too short." },
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

        {/* Media Upload */}
        <div>
          <Label
            title="Choose Your Advert Media Upload Option"
            description="Upload media for your advert."
          />
          <div className="flex gap-6 items-center">
            <div className="flex flex-col gap-2">
              <label
                className="text-sm px-2 py-1 rounded-lg bg-primary/10 border border-primary text-primary"
                htmlFor="images"
              >
                Upload video advert
              </label>
              <label
                className="text-sm px-2 py-1 rounded-lg bg-primary/10 border border-primary text-primary"
                htmlFor="images"
              >
                Upload image advert
              </label>
            </div>
            <div className="max-w-[250px]">
              <ImageInput id="images" maxLength={3} required />
            </div>
          </div>
        </div>

        {/* Payment */}
        <SetPaymentMethod
          onAdvertPreviewOpen={modalProps.onOpen}
          isFormValid={isValid}
          triggerValidationFn={trigger}
        />

        {/* Modals */}
        {isValid && (
          <AdvertSummaryModal
            modalProps={modalProps}
            getFormValue={getValues}
            successModalProps={successModalProps}
			setError={setError}
          />
        )}
        <AdvertUploadSuccessModal {...successModalProps} />
      </form>

      {isSubmitting && <Loading fixed />}
    </>
  );
}
