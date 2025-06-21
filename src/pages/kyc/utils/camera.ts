export async function startCamera(cb: () => void) {
  try {
    const video = document.getElementById("video") as HTMLVideoElement;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    video.srcObject = stream;
    cb();
  } catch {
    setTimeout(startCamera, 1000);
  }
}

export function stopCamera() {
  const video = document.getElementById("video") as HTMLVideoElement;
  const stream = video.srcObject as MediaStream;

  if (stream) {
    const tracks = stream.getTracks();
    for (const track of tracks) track.stop();
    video.srcObject = null;
  }
}