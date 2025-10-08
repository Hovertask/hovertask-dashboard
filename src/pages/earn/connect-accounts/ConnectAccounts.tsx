import { ArrowLeft } from "lucide-react";
import { type ChangeEvent, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import type { ActivationState } from "../../../../types";
import useDebounced from "../../../hooks/useDebounced";
import ConnectAccountInputGroup from "./components/ConnectAccountInputGroup";
import validateConnectAccountFormGroup from "./utils/validateConnectAccountFormGroup";
import connectAccountFormInitialState from "./utils/connectAccountFormInitialState";
import connectAccount from "./utils/connectAccount"; // ✅ keep this since we’ll use it

export default function ConnectAccountsPage() {
	const resetGroupActivationState = useDebounced(
		(groupName: keyof ActivationState) =>
			setActivationState({ ...activationState, [groupName]: false }),
		600,
	);

	const [form, setForm] = useState(connectAccountFormInitialState);
	const [activationState, setActivationState] = useState<ActivationState>({
		facebook: false,
		twitter: false,
		instagram: false,
		tikTok: false,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// ✅ Handle full form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const validGroups = Object.entries(activationState).filter(
			([, state]) => state === true
		);

		if (validGroups.length === 0) {
			toast.error("Please validate at least one social account before submitting.");
			return;
		}

		try {
			setIsSubmitting(true);

			// ✅ Submit only validated accounts
			const activeAccounts = Object.entries(form)
				.filter(([key]) => activationState[key as keyof ActivationState] === true)
				.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

			await connectAccount(activeAccounts); // ✅ now actively used
			toast.success("Accounts submitted successfully!");
		} catch (error) {
			console.error(error);
			toast.error("Failed to submit accounts. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="mobile:grid mobile:max-w-[724px] gap-4 min-h-full">
			<div className="bg-white shadow p-4 pt-10 space-y-12 min-h-full">
				<div className="flex">
					<div className="flex gap-4 flex-1">
						<Link className="mt-1" to="/earn">
							<ArrowLeft />
						</Link>

						<div className="space-y-2">
							<h1 className="text-xl font-semibold">
								Connect Your Social Media Accounts
							</h1>
							<p className="text-secondary">
								Provide your social media usernames and profile links to verify
								your eligibility to post adverts.
							</p>
						</div>
					</div>

					<div className="max-sm:hidden">
						<img
							src="/images/0c3e01cf-a60e-4e42-8a1d-6ba21eb32eeb-removebg-preview 3.png"
							width={180}
							alt=""
						/>
					</div>
				</div>

				<form
					className="space-y-12 p-4 rounded-3xl border border-zinc-300"
					onSubmit={handleSubmit}
				>
					{/* ✅ Facebook */}
					<ConnectAccountInputGroup
						index={1}
						platform="facebook"
						changeHandlers={[
							(e: ChangeEvent<HTMLInputElement>) => {
								setForm({
									...form,
									facebook: { ...form.facebook, username: e.target.value },
								});
								resetGroupActivationState("facebook");
							},
							(e: ChangeEvent<HTMLInputElement>) => {
								setForm({
									...form,
									facebook: {
										...form.facebook,
										profileLink: e.target.value,
									},
								});
								resetGroupActivationState("facebook");
							},
						]}
						validateFn={() =>
							validateConnectAccountFormGroup(
								"facebook",
								form.facebook,
								setActivationState
							)
						}
						validationState={activationState.facebook}
						values={[form.facebook.username, form.facebook.profileLink]}
						placeholders={[
							"Enter your Facebook username",
							"Enter your Facebook profile link",
						]}
					/>

					{/* ✅ Instagram */}
					<ConnectAccountInputGroup
						index={2}
						platform="instagram"
						changeHandlers={[
							(e: ChangeEvent<HTMLInputElement>) => {
								setForm({
									...form,
									instagram: { ...form.instagram, username: e.target.value },
								});
								resetGroupActivationState("instagram");
							},
							(e: ChangeEvent<HTMLInputElement>) => {
								setForm({
									...form,
									instagram: {
										...form.instagram,
										profileLink: e.target.value,
									},
								});
								resetGroupActivationState("instagram");
							},
						]}
						validateFn={() =>
							validateConnectAccountFormGroup(
								"instagram",
								form.instagram,
								setActivationState
							)
						}
						validationState={activationState.instagram}
						values={[form.instagram.username, form.instagram.profileLink]}
						placeholders={[
							"Enter your Instagram username",
							"Enter your Instagram profile link",
						]}
					/>

					{/* ✅ Twitter */}
					<ConnectAccountInputGroup
						index={3}
						platform="twitter"
						changeHandlers={[
							(e: ChangeEvent<HTMLInputElement>) => {
								setForm({
									...form,
									twitter: { ...form.twitter, username: e.target.value },
								});
								resetGroupActivationState("twitter");
							},
							(e: ChangeEvent<HTMLInputElement>) => {
								setForm({
									...form,
									twitter: {
										...form.twitter,
										profileLink: e.target.value,
									},
								});
								resetGroupActivationState("twitter");
							},
						]}
						validateFn={() =>
							validateConnectAccountFormGroup(
								"twitter",
								form.twitter,
								setActivationState
							)
						}
						validationState={activationState.twitter}
						values={[form.twitter.username, form.twitter.profileLink]}
						placeholders={[
							"Enter your Twitter username",
							"Enter your Twitter profile link",
						]}
					/>

					{/* ✅ TikTok */}
					<ConnectAccountInputGroup
						index={4}
						platform="tikTok"
						changeHandlers={[
							(e: ChangeEvent<HTMLInputElement>) => {
								setForm({
									...form,
									tikTok: { ...form.tikTok, username: e.target.value },
								});
								resetGroupActivationState("tikTok");
							},
							(e: ChangeEvent<HTMLInputElement>) => {
								setForm({
									...form,
									tikTok: {
										...form.tikTok,
										profileLink: e.target.value,
									},
								});
								resetGroupActivationState("tikTok");
							},
						]}
						validateFn={() =>
							validateConnectAccountFormGroup(
								"tikTok",
								form.tikTok,
								setActivationState
							)
						}
						validationState={activationState.tikTok}
						values={[form.tikTok.username, form.tikTok.profileLink]}
						placeholders={[
							"Enter your TikTok username",
							"Enter your TikTok profile link",
						]}
					/>

					<p className="text-sm">
						Need help finding your profile link?{" "}
						<Link to="#" className="text-primary">
							Click here
						</Link>
					</p>

					<div className="space-x-4">
						<button
							className="p-2 rounded-2xl text-sm transition-all bg-primary text-white active:scale-95 disabled:opacity-50"
							type="submit"
							disabled={
								isSubmitting ||
								!Object.values(activationState).some((s) => s === true)
							}
						>
							{isSubmitting ? "Submitting..." : "Submit Details"}
						</button>

						<button
							className="p-2 rounded-2xl text-sm transition-all bg-primary text-white active:scale-95"
							onClick={() => setForm(connectAccountFormInitialState)}
							type="reset"
						>
							Clear All Fields
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
