import { Sun, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import cn from "../../../utils/cn";
import { startCamera, stopCamera } from "../utils/camera";
import takeSnapshot from "../utils/takeSnapshot";

export default function FaceVerificationForm({
	setFormStep,
	formStep,
}: {
	setFormStep: React.Dispatch<React.SetStateAction<number>>;
	formStep: number;
}) {
	const [capturing, setCapturing] = useState(false);
	const [capturedImgUrl, setCapturedImgUrl] = useState("");

	return (
		<div className={cn("space-y-6 w-full", { hidden: formStep !== 2 })}>
			<div className="text-center">
				<h2 className="text-xl font-medium">Live Face Detection</h2>
				<p className="text-primary text-sm">
					Scan your face to verify your ID.
				</p>
			</div>

			<div>
				{!capturing && capturedImgUrl && (
					<div className="max-w-lg">
						<img
							src={capturedImgUrl}
							alt=""
							id="selfie"
							className="w-full h-auto max-h-96 rounded-3xl border border-dashed bg-zinc-100 block mx-auto"
						/>
					</div>
				)}

				<div hidden={!capturing}>
					{/* biome-ignore lint/a11y/useMediaCaption: */}
					<video
						src=""
						className="max-w-lg rounded-3xl border border-dashed aspect-video bg-zinc-200/40 mx-auto w-full"
						id="video"
						autoPlay
					/>
					<canvas id="canvas" className="h-0 w-0" />
					<div className="flex justify-between items-center text-xs text-primary max-w-lg mx-auto">
						<span className="flex items-center gap-1 p-4">
							<User size={12} /> Uncover face
						</span>
						<span className="flex items-center gap-1 p-4">
							<Sun size={12} /> Good lighting
						</span>
					</div>
				</div>
			</div>

			<div className="text-sm text-center space-y-4">
				{capturing && (
					<button
						onClick={() =>
							takeSnapshot((url) => {
								setCapturedImgUrl(url);
								stopCamera();
								setCapturing(false);
							})
						}
						id="snap-btn"
						type="button"
						className="px-4 py-1.5 w-full bg-primary text-white text-sm max-w-lg mx-auto block rounded-full"
					>
						Take a snapshot
					</button>
				)}

				{!capturing && capturedImgUrl && (
					<>
						<button
							onClick={() => startCamera(() => setCapturing(true))}
							type="button"
							className="px-4 py-1.5 w-full border border-primary text-primary text-sm max-w-lg mx-auto block rounded-full"
						>
							Retake Selfie
						</button>

						<button
							onClick={() => setFormStep(3)}
							type="button"
							className="px-4 py-1.5 w-full bg-primary text-white text-sm max-w-lg mx-auto block rounded-full"
						>
							Continue
						</button>
					</>
				)}

				{/* Show the start test button if the test has not started or has been reset */}
				{!capturedImgUrl && !capturing && (
					<button
						onClick={async () => {
							await startCamera(() => {
								setCapturing(true);
							});
						}}
						type="button"
						className="px-4 py-1.5 w-full bg-primary text-white text-sm max-w-lg mx-auto block rounded-full"
					>
						Start the Test
					</button>
				)}

				<p>We will automatically detect your face</p>
				<Link to="#" className="text-primary text-sm block hover:underline">
					Continue on phone
				</Link>
			</div>
		</div>
	);
}
