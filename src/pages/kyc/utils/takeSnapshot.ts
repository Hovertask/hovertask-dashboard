export default function takeSnapshot(cb: (url: string) => void) {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const context = canvas.getContext("2d");
  const video = document.getElementById("video") as HTMLVideoElement;
  let dataUrl: string | null = null;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context?.drawImage(video, 0, 0, canvas.width, canvas.height);

  dataUrl = canvas.toDataURL("image/png");
  cb(dataUrl);
}