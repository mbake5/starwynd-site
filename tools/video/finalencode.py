"""Web encodes of a seamless loop master (lossless .mkv from smooth.py).

- Grain: temporal denoise, fed the loop's own last 90 frames first so frame 0 is filtered with the
  same history as the loop's end (no asymmetry at the restart). The page adds its own film grain.
- One keyframe: periodic keyframes re-draw the grain and read as a small jump once a second.
- Keyframe quality equal to other frames (ipratio 1, no mb-tree, no psy tuning).
- Overlap tail: the loop's first OVERLAP frames are appended after its end. The page (ambient-backdrop.tsx,
  OVERLAP_SECONDS) starts a second copy from frame 0 when the first reaches the loop point and crossfades
  between them while both show the same moving picture, so nothing freezes at the restart.

    python finalencode.py <master.mkv> <out_desktop.mp4> <out_phone.mp4> <phone crop centre 0-1> [height]
"""
import json, subprocess, sys
master, out_desktop, out_phone, crop_cx = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4])
height = int(sys.argv[5]) if len(sys.argv) > 5 else 0
info = json.loads(subprocess.run(["ffprobe", "-v", "error", "-count_frames", "-select_streams", "v:0", "-show_entries",
                                  "stream=width,height,nb_read_frames,r_frame_rate", "-of", "json", master],
                                 capture_output=True, text=True, check=True).stdout)["streams"][0]
W, H, n = int(info["width"]), int(info["height"]), int(info["nb_read_frames"])
pre = min(90, n - 1)
OVERLAP = 24                         # 0.4 s at 60 fps; must match OVERLAP_SECONDS in ambient-backdrop.tsx
crop_w = round(H * 9 / 16) // 2 * 2
crop_x = max(0, min(W - crop_w, round(crop_cx * W - crop_w / 2)))
scale_desktop = ",scale=-2:%d:flags=lanczos" % height if height else ""
graph = ("[0:v]split=3[x][y][z];[x]trim=start_frame=%d,setpts=PTS-STARTPTS[tail];"
         "[z]trim=end_frame=%d,setpts=PTS-STARTPTS[head];[tail][y][head]concat=n=3:v=1[seq];"
         "[seq]hqdn3d=4:3:8:8,trim=start_frame=%d,setpts=PTS-STARTPTS,split=2[a][b];"
         "[a]scale=trunc(iw/2)*2:trunc(ih/2)*2%s,setsar=1[desk];[b]crop=%d:%d:%d:0%s,setsar=1[phone]") % (
    n - pre, OVERLAP, pre, scale_desktop, crop_w, H, crop_x, (",scale=-2:%d:flags=lanczos" % height) if height else "")
total = n + OVERLAP
params = "keyint=%d:min-keyint=%d:scenecut=0:ipratio=1.0:mbtree=0:aq-mode=3:psy-rd=0.0,0.0" % (total, total)
common = ["-an", "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-bf", "0", "-x264-params", params,
          "-pix_fmt", "yuv420p", "-use_editlist", "0", "-movflags", "+faststart"]
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", master, "-filter_complex", graph,
                "-map", "[desk]"] + common + ["-maxrate", "8M", "-bufsize", "16M", out_desktop,
                "-map", "[phone]"] + common + ["-maxrate", "3M", "-bufsize", "6M", out_phone], check=True)
print("encoded", out_desktop, "and", out_phone, ": %d-frame loop + %d-frame overlap tail; phone crop %dx%d at x=%d" % (n, OVERLAP, crop_w, H, crop_x))
