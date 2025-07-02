import { ArrowLeft } from "lucide-react";
import { type ChangeEvent, useState } from "react";
import { Link } from "react-router";
import type { ActivationState } from "../../../../types";
import useDebounced from "../../../hooks/useDebounced";
import ConnectAccountInputGroup from "./components/ConnectAccountInputGroup";
import validateConnectAccountFormGroup from "./utils/validateConnectAccountFormGroup";
import connectAccountFormInitialState from "./utils/connectAccountFormInitialState";

export default function ConnectAccountsPage() {
	const resetGroupActivationState = useDebounced(
		(groupName: keyof ActivationState) =>
			setActivationState({ ...activationState, [groupName]: false }),
		600,
	);
	const [form, setForm] = useState(connectAccountFormInitialState);
	// Keeps track of the validation state of a social media input group.
	const [activationState, setActivationState] = useState<ActivationState>({
		facebook: false,
		twitter: false,
		instagram: false,
		tikTok: false,
	});

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

				<form className="space-y-12 p-4 rounded-3xl border border-zinc-300">
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
								setActivationState,
							)
						}
						validationState={activationState.facebook}
						values={[form.facebook.username, form.facebook.profileLink]}
						placeholders={[
							"Enter your FaceBook username",
							"Enter your FaceBook profile link",
						]}
					/>

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
								setActivationState,
							)
						}
						validationState={activationState.instagram}
						values={[form.instagram.username, form.instagram.profileLink]}
						placeholders={[
							"Enter your Instagram username",
							"Enter your Instagram profile link",
						]}
					/>

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
								setActivationState,
							)
						}
						validationState={activationState.twitter}
						values={[form.twitter.username, form.twitter.profileLink]}
						placeholders={[
							"Enter your Twitter username",
							"Enter your Twitter profile link",
						]}
					/>

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
								setActivationState,
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
							className="p-2 rounded-2xl text-sm transition-all bg-primary text-white active:scale-95"
							type="submit"
						>
							Submit Details
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
