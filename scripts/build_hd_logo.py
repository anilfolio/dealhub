"""
DealHub HD Vector Logo Suite Generator
Creates pure, high-precision SVG vector assets and multi-resolution HD raster renders
matching the official DealHub Brand Identity Logo Suite.
"""

import math
import os
from PIL import Image, ImageDraw, ImageFilter

# ── BRAND COLOR PALETTE ──
RED_BASE = "#C8243A"       # Primary DealHub Crimson Red
RED_LIGHT = "#E8334E"      # Highlight Crimson (illuminated bevel)
RED_VIVID = "#FF385C"      # Vibrant Crimson accent
RED_DARK = "#8B1228"       # Deep Crimson shade
RED_DEEP = "#6B0A1D"       # Darkest shadow/bevel facet
CHARCOAL = "#333333"       # Primary wordmark text on light canvas
CHARCOAL_DARK = "#1E2229"  # Dark canvas background
CHARCOAL_SURFACE = "#0E131F" # Dark cockpit navy background
WHITE = "#FFFFFF"

# ── 1. MATHEMATICAL GEOMETRY FOR THE STANDALONE EMBLEM ──
# ViewBox: 0 0 1000 1000, Center: (500, 500)

def generate_emblem_svg(mode="3d", bg_color=None):
    """
    Generates pure SVG for the standalone DealHub HD emblem.
    mode="3d" includes rich metallic crimson gradients and bevel facets.
    mode="flat" generates clean monochrome/flat crimson geometry.
    """
    bg_xml = f'<rect width="1000" height="1000" fill="{bg_color}" rx="0"/>' if bg_color else ''

    # Gradients & Shadows for 3D mode
    defs_3d = """
    <defs>
      <!-- Main illuminated face gradient (Top-Left to Bottom-Right) -->
      <linearGradient id="dhCrimsonFace" x1="20%" y1="15%" x2="85%" y2="90%">
        <stop offset="0%" stop-color="#E8334E" />
        <stop offset="40%" stop-color="#C8243A" />
        <stop offset="100%" stop-color="#8B1228" />
      </linearGradient>

      <!-- Inner Bevel Shadow Gradient (gives tactile 3D depth) -->
      <linearGradient id="dhBevelShade" x1="10%" y1="10%" x2="90%" y2="90%">
        <stop offset="0%" stop-color="#9A1430" />
        <stop offset="50%" stop-color="#7B0D22" />
        <stop offset="100%" stop-color="#5B0717" />
      </linearGradient>

      <!-- Outer Ring Inner Edge Shadow -->
      <radialGradient id="dhInnerRingShade" cx="45%" cy="45%" r="55%">
        <stop offset="70%" stop-color="#C8243A" stop-opacity="0" />
        <stop offset="100%" stop-color="#550716" stop-opacity="0.45" />
      </radialGradient>

      <!-- Multi-tier realistic drop shadow -->
      <filter id="dhRealisticShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#8B1228" flood-opacity="0.28" />
        <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.22" />
      </filter>
    </defs>
    """ if mode == "3d" else """
    <defs></defs>
    """

    fill_face = "url(#dhCrimsonFace)" if mode == "3d" else RED_BASE
    fill_shade = "url(#dhBevelShade)" if mode == "3d" else "#9B132B"
    filter_attr = 'filter="url(#dhRealisticShadow)"' if mode == "3d" else ''

    # ── Geometry Definition ──
    # Outer Ring: R_outer = 236, R_inner = 186, Center = (500, 500)
    # The outer ring has an opening/integration at the bottom-left and top-right where the arrow cuts through.
    # In pure SVG, we construct the outer ring, the D mark, the speed arrow, and the orbital tracks.

    # Orbital tracks: Radius = 296, Center = (500, 500)
    # 4 Node dots at (500, 204), (204, 500), (500, 796), (796, 500)
    # Node dot radius = 18.5
    # Orbital lines with stroke-width = 12

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="100%" height="100%">
  {defs_3d}
  {bg_xml}
  <g {filter_attr}>
    <!-- ── 1. ORBITAL SATELLITE TELEMETRY TRACKS & NODES ── -->
    <g fill="none" stroke="{fill_face}" stroke-width="12" stroke-linecap="round">
      <!-- Top-Left System: Dot at North (500, 204), arcs around to West (204, 500) -->
      <!-- Arc 1: 270 deg down to 255 deg -->
      <path d="M 500 204 A 296 296 0 0 0 423.5 214.2" />
      <!-- Arc 2: 250 deg down to 202 deg -->
      <path d="M 398.8 221.9 A 296 296 0 0 0 225.4 389.1" />
      <!-- Arc 3: 196 deg down to 180 deg -->
      <path d="M 215.5 418.4 A 296 296 0 0 0 204 500" />

      <!-- Bottom-Right System: Dot at East (796, 500), arcs around to South (500, 796) -->
      <!-- Arc 4: 0 deg down to 18 deg -->
      <path d="M 796 500 A 296 296 0 0 1 781.5 591.5" />
      <!-- Arc 5: 22 deg down to 69 deg -->
      <path d="M 774.4 610.8 A 296 296 0 0 1 606.1 776.6" />
      <!-- Arc 6: 74 deg down to 90 deg -->
      <path d="M 581.6 784.5 A 296 296 0 0 1 500 796" />
    </g>

    <!-- 4 Cardinal Orbital Node Dots -->
    <g fill="{fill_face}">
      <circle cx="500" cy="204" r="19" />
      <circle cx="204" cy="500" r="19" />
      <circle cx="500" cy="796" r="19" />
      <circle cx="796" cy="500" r="19" />
    </g>

    <!-- ── 2. OUTER CIRCULAR RING (Beveled 3D Band) ── -->
    <!-- Outer face & inner bevel rim -->
    <g fill-rule="evenodd">
      <!-- Full Outer Ring with inner cutout -->
      <path d="
        M 500 264
        A 236 236 0 1 1 499.9 264
        Z
        M 500 314
        A 186 186 0 1 0 500.1 314
        Z"
        fill="{fill_face}" />

      {"<!-- Inner bevel shading band -->" if mode == "3d" else ""}
      {f'<path d="M 500 286 A 214 214 0 1 1 499.9 286 Z M 500 314 A 186 186 0 1 0 500.1 314 Z" fill="{fill_shade}" opacity="0.85" />' if mode == "3d" else ""}
    </g>

    <!-- ── 3. LETTER 'D' (Stem, Top Bar, Bottom Bar, Curved Spine) ── -->
    <!-- The D has a vertical stem on the left, horizontal top bar, curved spine, and bottom bar.
         The bottom-left stem cleanly cuts just above the 45-degree arrow trajectory. -->
    <g fill="{fill_face}">
      <!-- Vertical Stem of D: x=370..422, y=360 down to 45-deg cut at y=560 -->
      <path d="
        M 370 360
        L 422 360
        L 422 546
        L 370 598
        Z" />

      <!-- Top Bar & Outer Curved Spine of D -->
      <!-- Curves from x=422, y=360 to x=540, then outer arc to (628, 495), down to (540, 630), then inner counter -->
      <path d="
        M 422 360
        L 540 360
        C 610 360 638 410 638 495
        C 638 580 610 630 540 630
        L 434 630
        L 472 592
        L 540 592
        C 586 592 598 555 598 495
        C 598 435 586 408 540 408
        L 422 408
        Z" />

      {"<!-- Bevel accent along bottom horizontal bar of D -->" if mode == "3d" else ""}
      {f'<path d="M 434 630 L 540 630 C 610 630 638 580 638 495 L 626 505 C 624 570 600 616 540 616 L 448 616 Z" fill="{fill_shade}" opacity="0.75" />' if mode == "3d" else ""}
    </g>

    <!-- ── 4. SPEED ARROW (Diagonal Shaft, Inner Wedge Arrow, & Outer Spear Arrowhead) ── -->
    <g fill="{fill_face}">
      <!-- Diagonal Shaft from Bottom-Left Ring (approx 225 deg) through the D up to Top-Right Outer Arrowhead -->
      <!-- Left edge: x + y = 968, Right edge: x + y = 1022 -->
      <path d="
        M 314 654
        L 352 616
        L 668 300
        L 706 338
        L 390 654
        L 352 692
        C 334 682 323 669 314 654
        Z" />

      <!-- Inner Speed Arrowhead (Points UPWARD inside the D Counter cavity) -->
      <!-- Tip at (542, 464), Left Barb at (464, 480), Notch at (480, 498), Right vertical flank at x=550 -->
      <path d="
        M 542 464
        L 464 480
        L 480 498
        L 524 498
        L 550 524
        L 550 472
        Z" />

      <!-- Outer Speed Spear Arrowhead (Top-Right, pointing diagonally at 45 deg) -->
      <!-- Tip: (766, 234), Left Barb: (644, 260), Left Notch: (672, 288), Right Barb: (746, 362), Right Notch: (718, 334) -->
      <path d="
        M 766 234
        L 644 260
        L 672 288
        L 718 334
        L 746 362
        Z" />

      {"<!-- 3D Bevel Facet on Arrowhead (Lower-Right Shadowed Half) -->" if mode == "3d" else ""}
      {f'<path d="M 766 234 L 718 334 L 746 362 Z" fill="{fill_shade}" opacity="0.6" />' if mode == "3d" else ""}
    </g>
  </g>
</svg>"""
    return svg

print("generate_emblem_svg function ready")

