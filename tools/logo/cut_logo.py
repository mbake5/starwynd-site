"""Cut the Starwynd wordmark out of the 4K logo (public/images/Logo_4K_98.jpg) as a transparent WebP.

    python tools/logo/cut_logo.py <out.webp> <out-mask.webp> [preview.png]

The logo is a 3D wordmark on a starry background with a purple haze behind "RWY". Only the
letters are kept: their pale front faces plus their 3D sides, and none of the haze.

Faces: pale, bright pixels (the rim around every face is near-white), closed up, with the
textured, saturated insides filled back in; dark enclosed holes (the counter of the D) stay open.
Where a letter's bright 3D side touches its face, side pixels can pass that test, so on the edge
that faces the side the face is trimmed back to its rim, measured relative to that rim's own
whiteness (lilac rims are less white than blue ones).

Sides: the letters are extruded towards a point near the W, so letters left of it show their
side on the right and letters right of it on the left. The artwork's depth is not geometrically
consistent (about 7 to 41 px at 4K, even within one letter), so it comes from measurements
(DEPTH_POINTS). Each face is swept sideways by that depth, which keeps every edge straight, and
inside the swept band a pixel's opacity follows its brightness, so where the artwork shows no
side (around the W) nothing dark is added.
"""

import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SOURCE = os.path.join(ROOT, "public", "images", "Logo_4K_98.jpg")
BOX = (200, 1650, 3830, 2300)   # the band of the 4K image that holds the letters
VANISH_X = 1864                  # sides lie towards this x (BOX coordinates)
RIM_SEARCH = 14                  # how far in from a face edge to look for its rim, 4K px
RIM_KEEP = 0.82                  # the face ends where whiteness falls below this share of the rim's
OUT_WIDTH = 1800
PAD = 12


def base_faces(mx: np.ndarray, mn: np.ndarray) -> np.ndarray:
    face = (mx > 205) & (mn > 140)
    face = ndimage.binary_closing(face, np.ones((3, 3)), iterations=3)
    labels, count = ndimage.label(face)
    sizes = ndimage.sum(face, labels, range(1, count + 1))
    face = np.isin(labels, 1 + np.flatnonzero(sizes > 5000))
    holes = ndimage.binary_fill_holes(face) & ~face
    hole_labels, hole_count = ndimage.label(holes)
    brightness = ndimage.mean(mx, hole_labels, range(1, hole_count + 1))
    face |= np.isin(hole_labels, 1 + np.flatnonzero(np.asarray(brightness) >= 120))
    return ndimage.binary_opening(face, np.ones((3, 3)), iterations=1)


def trim_to_rim(face: np.ndarray, mn: np.ndarray) -> np.ndarray:
    """On each row, at every face edge that faces the letter's side, find the rim (the palest
    pixel within the outer RIM_SEARCH px) and end the face where whiteness falls clearly below
    it. Bright side pixels that passed the face test are trimmed off this way, whatever the
    letter's colour: lilac rims are less white than blue ones, so a fixed cut-off fails."""
    face = face.copy()
    height, width = face.shape
    for y in range(height):
        row = face[y]
        if not row.any():
            continue
        starts = np.flatnonzero(np.r_[row[0], row[1:] & ~row[:-1]])
        ends = np.flatnonzero(np.r_[row[:-1] & ~row[1:], row[-1]])
        for a, b in zip(starts, ends):
            if b < VANISH_X:                 # side on the right: trim the run's right end
                lo = max(a, b - RIM_SEARCH)
                peak = lo + int(np.argmax(mn[y, lo:b + 1]))
                keep = peak
                while keep < b and mn[y, keep + 1] >= RIM_KEEP * mn[y, peak]:
                    keep += 1
                face[y, keep + 1:b + 1] = False
            elif a >= VANISH_X:              # side on the left: trim the run's left end
                hi = min(b, a + RIM_SEARCH)
                peak = a + int(np.argmax(mn[y, a:hi + 1]))
                keep = peak
                while keep > a and mn[y, keep - 1] >= RIM_KEEP * mn[y, peak]:
                    keep -= 1
                face[y, a:keep] = False
    face = ndimage.binary_closing(face, np.ones((3, 3)), iterations=1)
    face = ndimage.binary_opening(face, np.ones((3, 3)), iterations=1)
    labels, count = ndimage.label(face)                 # trimming can leave stray specks
    sizes = ndimage.sum(face, labels, range(1, count + 1))
    return np.isin(labels, 1 + np.flatnonzero(sizes > 5000))


# Side depth in 4K pixels at points along the logo (BOX x coordinates), measured from the artwork:
# negative means the side shows on the letter's right, positive on its left. Between points the
# depth is interpolated, so each letter gets its own depth, varying smoothly across it.
DEPTH_POINTS = [
    (177, -38), (487, -36), (734, -30), (974, -26), (1159, -12), (1367, -11), (1660, -7),
    (1864, 0), (2134, 6), (2407, 14), (2533, 10), (2695, 22), (2985, 28), (3118, 31), (3474, 41),
]
SWEEP_MARGIN = 1.0


def sides(face: np.ndarray, mx: np.ndarray) -> np.ndarray:
    """Opacity of the 3D sides: the face swept sideways by the measured depth (which keeps every
    edge straight), then faded where the artwork has no bright side, so nothing dark is added."""
    height, width = face.shape
    xs = np.arange(width)
    points = np.array(DEPTH_POINTS, dtype=float)
    depth = np.interp(xs, points[:, 0], points[:, 1]) * SWEEP_MARGIN
    swept = np.zeros_like(face)
    columns = np.flatnonzero(face.any(axis=0))
    for t in np.linspace(0, 1, 64):
        target = np.clip(np.rint(xs[columns] - t * depth[columns]).astype(int), 0, width - 1)
        for source, destination in zip(columns, target):
            swept[:, destination] |= face[:, source]
    band = swept & ~face
    return band.astype(float)


def main() -> None:
    out_path, mask_path = sys.argv[1], sys.argv[2]
    preview_path = sys.argv[3] if len(sys.argv) > 3 else None
    crop = Image.open(SOURCE).convert("RGB").crop(BOX)
    rgb = np.asarray(crop).astype(float)
    mx, mn = rgb.max(2), rgb.min(2)
    face = trim_to_rim(base_faces(mx, mn), ndimage.uniform_filter(mn, 3))
    alpha = np.maximum(face.astype(float), sides(face, ndimage.uniform_filter(mx, 3)))
    alpha = np.clip(ndimage.gaussian_filter(alpha, 0.9) * 1.08, 0, 1)

    ys, xs = np.where(alpha > 0.02)
    y0, y1 = ys.min() - PAD, ys.max() + PAD
    x0, x1 = xs.min() - PAD, xs.max() + PAD
    rgba = np.dstack([np.asarray(crop)[y0:y1, x0:x1], (alpha[y0:y1, x0:x1] * 255).astype(np.uint8)])
    image = Image.fromarray(rgba, "RGBA")
    image = image.resize((OUT_WIDTH, round(image.height * OUT_WIDTH / image.width)), Image.LANCZOS)
    image.save(out_path, quality=92, method=6)

    mask = Image.new("RGBA", image.size, (255, 255, 255, 0))
    mask.putalpha(image.getchannel("A"))
    mask.save(mask_path, lossless=True, method=6)

    if preview_path:
        background = Image.new("RGBA", image.size, (12, 14, 40, 255))
        background.alpha_composite(image)
        background.convert("RGB").save(preview_path)
    print("saved %s (%dx%d) and %s" % (out_path, image.width, image.height, mask_path))


if __name__ == "__main__":
    main()
