import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

const BASE_URL = "https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd";

export default async function loadFfmpeg(): Promise<FFmpeg> {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load({
    coreURL: await toBlobURL(`${BASE_URL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(
      `${BASE_URL}/ffmpeg-core.wasm`,
      "application/wasm",
    ),
  });
  return ffmpeg;
}
