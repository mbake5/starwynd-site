"""Turn a first=last-frame model clip into a smooth, seamless web loop.

1. Even motion: the model's frames advance in bursts (a bigger jump every 3-4
   frames). Optical flow measures the motion between neighbouring frames, new
   frames are spaced evenly along that motion and synthesised by warping the two
   nearest source frames towards each other, at 60 fps.
2. Seamless loop: the model's opening frames are softer than its later ones, so
   even a perfect shape match "pops" at the loop point. The clip's tail is
   crossfaded into its head while both keep moving (no slow-down, no pop); the
   loop is shorter than the clip by the crossfade.

    python smooth.py <clip.mp4> <out_desktop.mp4> <out_phone.mp4> <phone crop centre 0-1> [height]
"""
import subprocess
import sys
import time

import cv2
import numpy as np

src, out_desktop, out_phone, crop_cx = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4])
MASTER = out_desktop.endswith(".mkv")
TARGET_HEIGHT = int(sys.argv[5]) if len(sys.argv) > 5 else 0   # e.g. 1080 to upscale a 720p clip (Lanczos)
FPS = 60
CROSSFADE_SECONDS = 1.25
started = time.time()

cap = cv2.VideoCapture(src)
in_fps = cap.get(cv2.CAP_PROP_FPS) or 24.0
frames = []
while True:
    ok, frame = cap.read()
    if not ok:
        break
    frames.append(frame)
cap.release()
n = len(frames)
H, W = frames[0].shape[:2]

# Flow for each neighbouring pair, at half resolution.
SCALE = 0.5
dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
gray = [cv2.cvtColor(cv2.resize(f, None, fx=SCALE, fy=SCALE, interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY)
        for f in frames]
forward, backward, motion = [], [], []
for i in range(n - 1):
    f1 = dis.calc(gray[i], gray[i + 1], None)
    forward.append(f1)
    backward.append(dis.calc(gray[i + 1], gray[i], None))
    motion.append(float(np.sqrt((f1 ** 2).sum(axis=2)).mean()) + 1e-6)
motion = np.array(motion)
travelled = np.concatenate([[0.0], np.cumsum(motion)])   # motion needed to reach each source frame

grid_x, grid_y = np.meshgrid(np.arange(W, dtype=np.float32), np.arange(H, dtype=np.float32))


def warp(image, flow_small, t):
    flow = cv2.resize(flow_small, (W, H), interpolation=cv2.INTER_LINEAR) * np.float32(1 / SCALE)
    t = np.float32(t)
    return cv2.remap(image, grid_x - t * flow[..., 0], grid_y - t * flow[..., 1], cv2.INTER_LINEAR,
                     borderMode=cv2.BORDER_REFLECT)


def frame_at(fraction):
    """The clip at a point measured in motion travelled (0 = first frame, 1 = last frame)."""
    position = fraction * travelled[-1]
    i = int(np.clip(np.searchsorted(travelled, position, side="right") - 1, 0, n - 2))
    a = (position - travelled[i]) / motion[i]
    if a <= 1e-3:
        return frames[i]
    if a >= 1 - 1e-3:
        return frames[i + 1]
    # Content at q was at q - a*F(i->i+1) in frame i and will be at q - (1-a)*F(i+1->i) in frame i+1.
    return cv2.addWeighted(warp(frames[i], forward[i], a), 1 - a, warp(frames[i + 1], backward[i], 1 - a), a, 0)


steps = round((n - 1) / in_fps * FPS)          # output steps across the whole clip
fade = round(CROSSFADE_SECONDS * FPS)
loop = steps - fade                            # the loop's length in frames


def encoder(path, vf, maxrate):
    return subprocess.Popen([
        "ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", "%dx%d" % (W, H),
        "-framerate", str(FPS), "-i", "-", "-an", "-vf", vf + ",setsar=1",
        "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-maxrate", maxrate, "-bufsize", "10M", "-bf", "0",
        # A keyframe every second keeps quality even, so the loop point shows no compression "pop".
        "-x264-params", "keyint=%d:min-keyint=%d:scenecut=0" % (FPS, FPS),
        "-pix_fmt", "yuv420p", "-use_editlist", "0", "-movflags", "+faststart", path], stdin=subprocess.PIPE)


upscale = ",scale=-2:%d:flags=lanczos" % TARGET_HEIGHT if TARGET_HEIGHT else ""
crop_w = round(H * 9 / 16) // 2 * 2
crop_x = int(np.clip(round(crop_cx * W - crop_w / 2), 0, W - crop_w))
if MASTER:
    desktop = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", "%dx%d" % (W, H),
        "-framerate", str(FPS), "-i", "-", "-c:v", "ffv1", "-level", "3", "-pix_fmt", "bgr0", out_desktop], stdin=subprocess.PIPE)
    phone = None
else:
    desktop = encoder(out_desktop, ("scale=-2:%d:flags=lanczos" % TARGET_HEIGHT) if TARGET_HEIGHT
                      else "scale=trunc(iw/2)*2:trunc(ih/2)*2", "6M")
    phone = encoder(out_phone, "crop=%d:%d:%d:0%s" % (crop_w, H, crop_x, upscale), "3M")
for k in range(loop):
    frame = frame_at(k / steps)
    if k < fade:
        # Start of the loop: the clip's tail (which the previous loop just ended on) dissolves into its head.
        weight = (k + 1) / (fade + 1)
        frame = cv2.addWeighted(frame_at((k + loop) / steps), 1 - weight, frame, weight, 0)
    data = frame.tobytes()
    desktop.stdin.write(data)
    if phone:
        phone.stdin.write(data)
for process in (p for p in (desktop, phone) if p):
    process.stdin.close()
    if process.wait():
        raise SystemExit("ffmpeg failed")
print("%d source frames @ %g fps -> %d-frame loop @ %d fps (%.2f s), %.2f s crossfade; %.0f s" % (
    n, in_fps, loop, FPS, loop / FPS, fade / FPS, time.time() - started))
