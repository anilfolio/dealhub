"""
Complete DealHub HD Brand Identity & Logo Suite Generator
Produces:
- Pure SVG vectors: Standalone Emblem (3D & Flat), Full Horizontal Lockups (Light & Dark), Stacked Lockup, DH Monogram
- HD Raster PNGs (2048x2048, 1024x1024, 512x512, etc.)
- Multi-resolution Favicons (16x16, 32x32, 48x48, 64x64, 128x128, 256x256, favicon.ico)
- App Icons (Squircle iOS/Android 180x180)
"""

import math
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = r"f:/Project-Personal-Portfolio/dealhub/public"
ORIGINAL_HD = r"C:/Users/DELL/.gemini/antigravity/brain/9e472a3a-d472-4d26-9af8-e2f2a61cc72c/.user_uploaded/media_1793451065740_6e58da65.jpg"

# ── OFFICIAL BRAND PALETTE (From Brand Guidelines) ──
RED_BASE = "#C8243A"       # Primary DealHub Red
RED_LIGHT = "#E8334E"      # Highlight Crimson
RED_VIVID = "#FF385C"      # Vibrant Crimson accent
RED_DARK = "#8B1228"       # Deep Crimson shade
RED_DEEP = "#5E0818"       # Deepest bevel shade
CHARCOAL = "#333333"       # Dark text for light mode
CHARCOAL_DARK = "#1E2229"  # Dark mode canvas background
CHARCOAL_CARD = "#0F1523"  # Deep cockpit navy card surface
WHITE = "#FFFFFF"

# ─────────────────────────────────────────────────────────────
# 1. PURE SVG DEFINITIONS
# ─────────────────────────────────────────────────────────────

def get_emblem_3d_svg(include_drop_shadow=True, bg_color=None):
    """
    High-Definition 3D Emblem Vector (ViewBox 0 0 1000 1000)
    Direct 1:1 vector translation of the attached DealHub icon.
    """
    bg_tag = f'<rect width="1000" height="1000" fill="{bg_color}" />' if bg_color else ""
    shadow_filter = 'filter="url(#dhEmblemDropShadow)"' if include_drop_shadow else ""

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="100%" height="100%">
  <defs>
    <!-- 1. Metallic Crimson Primary Face Gradient (Top-Left 10:30 Light Source) -->
    <linearGradient id="dhEmblemCrimson" x1="18%" y1="18%" x2="82%" y2="82%">
      <stop offset="0%" stop-color="#E8334E" />
      <stop offset="35%" stop-color="#C8243A" />
      <stop offset="80%" stop-color="#9C142B" />
      <stop offset="100%" stop-color="#7B0F22" />
    </linearGradient>

    <!-- 2. Inner Bevel Facet Shading (Tactile 3D Depth) -->
    <linearGradient id="dhEmblemBevel" x1="15%" y1="15%" x2="85%" y2="85%">
      <stop offset="0%" stop-color="#9E142C" />
      <stop offset="50%" stop-color="#780D20" />
      <stop offset="100%" stop-color="#540716" />
    </linearGradient>

    <!-- 3. Soft Realistic Drop Shadow -->
    <filter id="dhEmblemDropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#8B1228" flood-opacity="0.32" />
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.22" />
    </filter>
  </defs>

  {bg_tag}

  <g {shadow_filter}>
    <!-- ── ORBITAL TELEMETRY TRACKS & NODES ── -->
    <g fill="none" stroke="url(#dhEmblemCrimson)" stroke-width="12" stroke-linecap="round">
      <!-- Top-Left System: Dot at North (500, 204), counter-clockwise arcs to West (204, 500) -->
      <path d="M 500 204 A 296 296 0 0 0 423.5 214.2" />
      <path d="M 398.8 221.9 A 296 296 0 0 0 225.4 389.1" />
      <path d="M 215.5 418.4 A 296 296 0 0 0 204 500" />

      <!-- Bottom-Right System: Dot at East (796, 500), clockwise arcs to South (500, 796) -->
      <path d="M 796 500 A 296 296 0 0 1 781.5 591.5" />
      <path d="M 774.4 610.8 A 296 296 0 0 1 606.1 776.6" />
      <path d="M 581.6 784.5 A 296 296 0 0 1 500 796" />
    </g>

    <!-- 4 Cardinal Orbital Node Dots -->
    <g fill="url(#dhEmblemCrimson)">
      <circle cx="500" cy="204" r="19" />
      <circle cx="204" cy="500" r="19" />
      <circle cx="500" cy="796" r="19" />
      <circle cx="796" cy="500" r="19" />
    </g>

    <!-- ── OUTER CIRCULAR RING ── -->
    <!-- Outer diameter: 472 (R=236), Inner diameter: 372 (R=186), Thickness: 50 -->
    <g fill-rule="evenodd">
      <!-- Main Face Ring -->
      <path d="
        M 500 264
        A 236 236 0 1 1 499.9 264
        Z
        M 500 314
        A 186 186 0 1 0 500.1 314
        Z"
        fill="url(#dhEmblemCrimson)" />

      <!-- Inner Beveled Facet Rim -->
      <path d="
        M 500 288
        A 212 212 0 1 1 499.9 288
        Z
        M 500 314
        A 186 186 0 1 0 500.1 314
        Z"
        fill="url(#dhEmblemBevel)" opacity="0.82" />
    </g>

    <!-- ── LETTER 'D' (Stem, Top Bar, Curved Spine, Bottom Bar) ── -->
    <!-- Left vertical stem cleanly terminates just above the 45-deg diagonal speed arrow -->
    <g fill="url(#dhEmblemCrimson)">
      <!-- Vertical Stem of D -->
      <path d="
        M 370 360
        L 422 360
        L 422 546
        L 370 598
        Z" />

      <!-- Top Bar and Outer Curved Spine -->
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

      <!-- Bottom Bar Inner 3D Shading -->
      <path d="
        M 434 630
        L 540 630
        C 610 630 638 580 638 495
        L 626 505
        C 624 570 600 616 540 616
        L 448 616
        Z"
        fill="url(#dhEmblemBevel)" opacity="0.75" />
    </g>

    <!-- ── 45-DEGREE SPEED ARROW & ARROWHEADS ── -->
    <g fill="url(#dhEmblemCrimson)">
      <!-- Diagonal Speed Shaft: Merges with ring at bottom-left, shoots up-right through D -->
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
      <path d="
        M 542 464
        L 464 480
        L 480 498
        L 524 498
        L 550 524
        L 550 472
        Z" />

      <!-- Outer Speed Spear Arrowhead (Top-Right, breaks out of circular boundary) -->
      <path d="
        M 766 234
        L 644 260
        L 672 288
        L 718 334
        L 746 362
        Z" />

      <!-- Outer Arrowhead 3D Bevel Facet (Lower shadowed half) -->
      <path d="
        M 766 234
        L 718 334
        L 746 362
        Z"
        fill="url(#dhEmblemBevel)" opacity="0.65" />
    </g>
  </g>
</svg>"""

def get_emblem_flat_svg(color=RED_BASE):
    """
    Pure flat 2D vector version (Monochrome / Solid Red / Watermark)
    ViewBox 0 0 1000 1000
    """
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="100%" height="100%">
  <!-- Orbital Tracks & Nodes -->
  <g fill="none" stroke="{color}" stroke-width="12" stroke-linecap="round">
    <path d="M 500 204 A 296 296 0 0 0 423.5 214.2" />
    <path d="M 398.8 221.9 A 296 296 0 0 0 225.4 389.1" />
    <path d="M 215.5 418.4 A 296 296 0 0 0 204 500" />
    <path d="M 796 500 A 296 296 0 0 1 781.5 591.5" />
    <path d="M 774.4 610.8 A 296 296 0 0 1 606.1 776.6" />
    <path d="M 581.6 784.5 A 296 296 0 0 1 500 796" />
  </g>
  <g fill="{color}">
    <circle cx="500" cy="204" r="19" />
    <circle cx="204" cy="500" r="19" />
    <circle cx="500" cy="796" r="19" />
    <circle cx="796" cy="500" r="19" />
  </g>

  <!-- Outer Ring -->
  <path d="M 500 264 A 236 236 0 1 1 499.9 264 Z M 500 314 A 186 186 0 1 0 500.1 314 Z" fill="{color}" fill-rule="evenodd" />

  <!-- Letter 'D' -->
  <g fill="{color}">
    <path d="M 370 360 L 422 360 L 422 546 L 370 598 Z" />
    <path d="M 422 360 L 540 360 C 610 360 638 410 638 495 C 638 580 610 630 540 630 L 434 630 L 472 592 L 540 592 C 586 592 598 555 598 495 C 598 435 586 408 540 408 L 422 408 Z" />
  </g>

  <!-- 45-deg Speed Arrow -->
  <g fill="{color}">
    <path d="M 314 654 L 352 616 L 668 300 L 706 338 L 390 654 L 352 692 C 334 682 323 669 314 654 Z" />
    <path d="M 542 464 L 464 480 L 480 498 L 524 498 L 550 524 L 550 472 Z" />
    <path d="M 766 234 L 644 260 L 672 288 L 718 334 L 746 362 Z" />
  </g>
</svg>"""

def get_horizontal_lockup_svg(theme="light"):
    """
    Primary Brand Lockup: Emblem on Left + Wordmark 'DealHub' + 'INTELLIGENCE PLATFORM'
    ViewBox 0 0 620 140
    """
    is_dark = (theme == "dark")
    bg_tag = f'<rect width="620" height="140" fill="{CHARCOAL_DARK if is_dark else WHITE}" rx="12" />' if is_dark else ""
    deal_color = WHITE if is_dark else CHARCOAL
    hub_color = RED_BASE
    sub_color = "#94A3B8" if is_dark else "#555555"

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 140" width="100%" height="100%">
  <defs>
    <!-- Emblem Crimson Gradient -->
    <linearGradient id="lockupCrimson" x1="20%" y1="20%" x2="80%" y2="80%">
      <stop offset="0%" stop-color="#E8334E" />
      <stop offset="40%" stop-color="#C8243A" />
      <stop offset="100%" stop-color="#8B1228" />
    </linearGradient>

    <!-- Bevel Facet Shading -->
    <linearGradient id="lockupBevel" x1="10%" y1="10%" x2="90%" y2="90%">
      <stop offset="0%" stop-color="#9E142C" />
      <stop offset="100%" stop-color="#540716" />
    </linearGradient>

    <!-- Subtle Icon Drop Shadow -->
    <filter id="lockupIconShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#8B1228" flood-opacity="0.25" />
      <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.18" />
    </filter>
  </defs>

  {bg_tag}

  <!-- ── 1. EMBLEM (Scale: 0.12, Position: (10, 10)) ── -->
  <g transform="translate(10, 10) scale(0.12)" filter="url(#lockupIconShadow)">
    <!-- Orbital Tracks -->
    <g fill="none" stroke="url(#lockupCrimson)" stroke-width="12" stroke-linecap="round">
      <path d="M 500 204 A 296 296 0 0 0 423.5 214.2" />
      <path d="M 398.8 221.9 A 296 296 0 0 0 225.4 389.1" />
      <path d="M 215.5 418.4 A 296 296 0 0 0 204 500" />
      <path d="M 796 500 A 296 296 0 0 1 781.5 591.5" />
      <path d="M 774.4 610.8 A 296 296 0 0 1 606.1 776.6" />
      <path d="M 581.6 784.5 A 296 296 0 0 1 500 796" />
    </g>
    <!-- Node Dots -->
    <g fill="url(#lockupCrimson)">
      <circle cx="500" cy="204" r="19" />
      <circle cx="204" cy="500" r="19" />
      <circle cx="500" cy="796" r="19" />
      <circle cx="796" cy="500" r="19" />
    </g>
    <!-- Outer Ring -->
    <path d="M 500 264 A 236 236 0 1 1 499.9 264 Z M 500 314 A 186 186 0 1 0 500.1 314 Z" fill="url(#lockupCrimson)" fill-rule="evenodd" />
    <path d="M 500 288 A 212 212 0 1 1 499.9 288 Z M 500 314 A 186 186 0 1 0 500.1 314 Z" fill="url(#lockupBevel)" opacity="0.82" fill-rule="evenodd" />
    <!-- Letter 'D' -->
    <g fill="url(#lockupCrimson)">
      <path d="M 370 360 L 422 360 L 422 546 L 370 598 Z" />
      <path d="M 422 360 L 540 360 C 610 360 638 410 638 495 C 638 580 610 630 540 630 L 434 630 L 472 592 L 540 592 C 586 592 598 555 598 495 C 598 435 586 408 540 408 L 422 408 Z" />
      <path d="M 434 630 L 540 630 C 610 630 638 580 638 495 L 626 505 C 624 570 600 616 540 616 L 448 616 Z" fill="url(#lockupBevel)" opacity="0.75" />
    </g>
    <!-- Arrow -->
    <g fill="url(#lockupCrimson)">
      <path d="M 314 654 L 352 616 L 668 300 L 706 338 L 390 654 L 352 692 C 334 682 323 669 314 654 Z" />
      <path d="M 542 464 L 464 480 L 480 498 L 524 498 L 550 524 L 550 472 Z" />
      <path d="M 766 234 L 644 260 L 672 288 L 718 334 L 746 362 Z" />
      <path d="M 766 234 L 718 334 L 746 362 Z" fill="url(#lockupBevel)" opacity="0.65" />
    </g>
  </g>

  <!-- ── 2. WORDMARK & TYPOGRAPHY ── -->
  <g transform="translate(145, 0)">
    <!-- Primary Brand Wordmark: DealHub -->
    <text x="0" y="78"
          font-family="'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          font-size="56"
          font-weight="900"
          letter-spacing="-1.8">
      <tspan fill="{deal_color}">Deal</tspan><tspan fill="{hub_color}">Hub</tspan>
    </text>

    <!-- Subtitle: INTELLIGENCE PLATFORM -->
    <text x="3" y="106"
          font-family="'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          font-size="14.5"
          font-weight="800"
          letter-spacing="5.4"
          fill="{sub_color}">
      INTELLIGENCE PLATFORM
    </text>
  </g>
</svg>"""

def get_stacked_lockup_svg(theme="light"):
    """
    Stacked Brand Lockup: Emblem Centered on Top + Wordmark Below
    ViewBox 0 0 360 420
    """
    is_dark = (theme == "dark")
    bg_tag = f'<rect width="360" height="420" fill="{CHARCOAL_DARK if is_dark else WHITE}" rx="16" />' if is_dark else ""
    deal_color = WHITE if is_dark else CHARCOAL
    hub_color = RED_BASE
    sub_color = "#94A3B8" if is_dark else "#555555"

    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 420" width="100%" height="100%">
  <defs>
    <linearGradient id="stackedCrimson" x1="20%" y1="20%" x2="80%" y2="80%">
      <stop offset="0%" stop-color="#E8334E" />
      <stop offset="40%" stop-color="#C8243A" />
      <stop offset="100%" stop-color="#8B1228" />
    </linearGradient>
    <linearGradient id="stackedBevel" x1="10%" y1="10%" x2="90%" y2="90%">
      <stop offset="0%" stop-color="#9E142C" />
      <stop offset="100%" stop-color="#540716" />
    </linearGradient>
    <filter id="stackedShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#8B1228" flood-opacity="0.25" />
    </filter>
  </defs>

  {bg_tag}

  <!-- Emblem Centered (width: 200, scale: 0.20, translate: (80, 20)) -->
  <g transform="translate(80, 20) scale(0.20)" filter="url(#stackedShadow)">
    <g fill="none" stroke="url(#stackedCrimson)" stroke-width="12" stroke-linecap="round">
      <path d="M 500 204 A 296 296 0 0 0 423.5 214.2" />
      <path d="M 398.8 221.9 A 296 296 0 0 0 225.4 389.1" />
      <path d="M 215.5 418.4 A 296 296 0 0 0 204 500" />
      <path d="M 796 500 A 296 296 0 0 1 781.5 591.5" />
      <path d="M 774.4 610.8 A 296 296 0 0 1 606.1 776.6" />
      <path d="M 581.6 784.5 A 296 296 0 0 1 500 796" />
    </g>
    <g fill="url(#stackedCrimson)">
      <circle cx="500" cy="204" r="19" />
      <circle cx="204" cy="500" r="19" />
      <circle cx="500" cy="796" r="19" />
      <circle cx="796" cy="500" r="19" />
    </g>
    <path d="M 500 264 A 236 236 0 1 1 499.9 264 Z M 500 314 A 186 186 0 1 0 500.1 314 Z" fill="url(#stackedCrimson)" fill-rule="evenodd" />
    <path d="M 500 288 A 212 212 0 1 1 499.9 288 Z M 500 314 A 186 186 0 1 0 500.1 314 Z" fill="url(#stackedBevel)" opacity="0.82" fill-rule="evenodd" />
    <g fill="url(#stackedCrimson)">
      <path d="M 370 360 L 422 360 L 422 546 L 370 598 Z" />
      <path d="M 422 360 L 540 360 C 610 360 638 410 638 495 C 638 580 610 630 540 630 L 434 630 L 472 592 L 540 592 C 586 592 598 555 598 495 C 598 435 586 408 540 408 L 422 408 Z" />
    </g>
    <g fill="url(#stackedCrimson)">
      <path d="M 314 654 L 352 616 L 668 300 L 706 338 L 390 654 L 352 692 C 334 682 323 669 314 654 Z" />
      <path d="M 542 464 L 464 480 L 480 498 L 524 498 L 550 524 L 550 472 Z" />
      <path d="M 766 234 L 644 260 L 672 288 L 718 334 L 746 362 Z" />
      <path d="M 766 234 L 718 334 L 746 362 Z" fill="url(#stackedBevel)" opacity="0.65" />
    </g>
  </g>

  <!-- Typography Stacked Below -->
  <g text-anchor="middle">
    <!-- DealHub -->
    <text x="180" y="295"
          font-family="'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          font-size="52"
          font-weight="900"
          letter-spacing="-1.5">
      <tspan fill="{deal_color}">Deal</tspan><tspan fill="{hub_color}">Hub</tspan>
    </text>

    <!-- PLATFORM -->
    <text x="180" y="332"
          font-family="'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          font-size="18"
          font-weight="800"
          letter-spacing="9"
          fill="{sub_color}">
      PLATFORM
    </text>
  </g>
</svg>"""

def get_squircle_app_icon_svg():
    """
    Official App Icon (Squircle container with DealHub Emblem inside)
    Matches the 64x64 app icon from Image 2 brand suite.
    """
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <!-- Premium Crimson Gradient for App Icon Squircle Background -->
    <linearGradient id="appIconBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E8334E" />
      <stop offset="50%" stop-color="#C8243A" />
      <stop offset="100%" stop-color="#8B1228" />
    </linearGradient>

    <!-- Subtle Bevel Stroke -->
    <linearGradient id="appIconBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFA4B2" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#550716" stop-opacity="0.6" />
    </linearGradient>
  </defs>

  <!-- Outer Squircle Frame (iOS / Android Adaptive Standard) -->
  <rect x="16" y="16" width="480" height="480" rx="112" ry="112"
        fill="url(#appIconBg)"
        stroke="url(#appIconBorder)"
        stroke-width="4" />

  <!-- Crisp White Emblem Inside -->
  <g transform="translate(68, 68) scale(0.376)">
    <!-- Orbital Tracks -->
    <g fill="none" stroke="#FFFFFF" stroke-width="14" stroke-linecap="round">
      <path d="M 500 204 A 296 296 0 0 0 423.5 214.2" />
      <path d="M 398.8 221.9 A 296 296 0 0 0 225.4 389.1" />
      <path d="M 215.5 418.4 A 296 296 0 0 0 204 500" />
      <path d="M 796 500 A 296 296 0 0 1 781.5 591.5" />
      <path d="M 774.4 610.8 A 296 296 0 0 1 606.1 776.6" />
      <path d="M 581.6 784.5 A 296 296 0 0 1 500 796" />
    </g>
    <!-- Node Dots -->
    <g fill="#FFFFFF">
      <circle cx="500" cy="204" r="21" />
      <circle cx="204" cy="500" r="21" />
      <circle cx="500" cy="796" r="21" />
      <circle cx="796" cy="500" r="21" />
    </g>
    <!-- Outer Ring -->
    <path d="M 500 264 A 236 236 0 1 1 499.9 264 Z M 500 314 A 186 186 0 1 0 500.1 314 Z" fill="#FFFFFF" fill-rule="evenodd" />
    <!-- Letter 'D' -->
    <g fill="#FFFFFF">
      <path d="M 370 360 L 422 360 L 422 546 L 370 598 Z" />
      <path d="M 422 360 L 540 360 C 610 360 638 410 638 495 C 638 580 610 630 540 630 L 434 630 L 472 592 L 540 592 C 586 592 598 555 598 495 C 598 435 586 408 540 408 L 422 408 Z" />
    </g>
    <!-- 45-deg Speed Arrow -->
    <g fill="#FFFFFF">
      <path d="M 314 654 L 352 616 L 668 300 L 706 338 L 390 654 L 352 692 C 334 682 323 669 314 654 Z" />
      <path d="M 542 464 L 464 480 L 480 498 L 524 498 L 550 524 L 550 472 Z" />
      <path d="M 766 234 L 644 260 L 672 288 L 718 334 L 746 362 Z" />
    </g>
  </g>
</svg>"""

def get_dh_monogram_svg(color=RED_BASE):
    """
    Official DH Monogram Favicon (Ribbon-folded DH mark for micro 16x16 and 32x32)
    ViewBox 0 0 100 100
    """
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <!-- Stylized folded ribbon DH monogram -->
  <path d="
    M 20 18
    L 48 18
    C 62 18 68 26 68 36
    C 68 46 62 54 48 54
    L 34 54
    L 34 82
    L 20 82
    Z
    M 34 32
    L 46 32
    C 52 32 54 34 54 36
    C 54 38 52 40 46 40
    L 34 40
    Z"
    fill="{color}" />

  <!-- Diagonal interconnecting ribbon bridge forming 'H' -->
  <path d="
    M 50 44
    L 76 18
    L 86 18
    L 86 82
    L 72 82
    L 72 48
    L 50 70
    Z"
    fill="{color}" />
</svg>"""

# ─────────────────────────────────────────────────────────────
# 2. STUDIO-QUALITY HIGH RESOLUTION RASTER RENDERING (PIL)
# ─────────────────────────────────────────────────────────────

def render_raster_emblem(size=2048, mode="transparent"):
    """
    Renders the DealHub HD Emblem with supersampling and smooth anti-aliased gradients.
    size: Target output size (e.g. 2048, 1024, 512)
    mode: "transparent", "white", or "dark"
    """
    # Render at 2x resolution and downscale with Lanczos for studio sharpness
    render_scale = 2
    canvas_size = size * render_scale
    img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    scale_factor = canvas_size / 1000.0
    cx, cy = 500.0 * scale_factor, 500.0 * scale_factor

    # Helper coordinate transformer
    def pt(x, y):
        return (x * scale_factor, y * scale_factor)

    # 1. Colors
    col_face = (200, 36, 58, 255)       # #C8243A
    col_light = (232, 51, 78, 255)      # #E8334E
    col_shade = (139, 18, 40, 255)      # #8B1228
    col_deep = (90, 8, 22, 255)         # #5A0816

    # 2. Orbital Tracks
    r_orbit = 296.0 * scale_factor
    lw = int(12.0 * scale_factor)

    # Helper to draw arc with round caps
    def draw_thick_arc(start_deg, end_deg):
        bbox = [cx - r_orbit, cy - r_orbit, cx + r_orbit, cy + r_orbit]
        draw.arc(bbox, start=start_deg, end=end_deg, fill=col_face, width=lw)
        # Add round end caps
        for d in [start_deg, end_deg]:
            rad = math.radians(d)
            px = cx + r_orbit * math.cos(rad)
            py = cy + r_orbit * math.sin(rad)
            cap_r = lw / 2.0
            draw.ellipse([px - cap_r, py - cap_r, px + cap_r, py + cap_r], fill=col_face)

    # Draw the 6 arc segments
    draw_thick_arc(180, 196)
    draw_thick_arc(202, 250)
    draw_thick_arc(254, 270)
    draw_thick_arc(0, 18)
    draw_thick_arc(22, 69)
    draw_thick_arc(74, 90)

    # 4 Node Dots
    dot_r = 19.0 * scale_factor
    for x_d, y_d in [(500, 204), (204, 500), (500, 796), (796, 500)]:
        px, py = pt(x_d, y_d)
        draw.ellipse([px - dot_r, py - dot_r, px + dot_r, py + dot_r], fill=col_face)

    # 3. Outer Ring
    r_out = 236.0 * scale_factor
    r_in = 186.0 * scale_factor
    # Draw ring by filled outer circle minus inner cutout mask
    ring_img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    ring_draw = ImageDraw.Draw(ring_img)
    ring_draw.ellipse([cx - r_out, cy - r_out, cx + r_out, cy + r_out], fill=col_face)
    ring_draw.ellipse([cx - r_in, cy - r_in, cx + r_in, cy + r_in], fill=(0, 0, 0, 0))
    # Composite ring
    img.paste(ring_img, (0, 0), ring_img)

    # Inner bevel shading along outer ring
    r_mid = 212.0 * scale_factor
    bevel_img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(bevel_img)
    b_draw.ellipse([cx - r_mid, cy - r_mid, cx + r_mid, cy + r_mid], fill=(120, 13, 32, 190))
    b_draw.ellipse([cx - r_in, cy - r_in, cx + r_in, cy + r_in], fill=(0, 0, 0, 0))
    img.paste(bevel_img, (0, 0), bevel_img)

    # 4. Vertical Stem of D
    stem_poly = [pt(370, 360), pt(422, 360), pt(422, 546), pt(370, 598)]
    draw.polygon(stem_poly, fill=col_face)

    # 5. Top Bar & Curved Spine of D
    # We approximate the smooth cubic curve with points
    spine_pts = [pt(422, 360), pt(540, 360)]
    for step in range(30):
        t = step / 29.0
        # Outer cubic bezier: P0=(540, 360), P1=(610, 360), P2=(638, 410), P3=(638, 495)
        # then P3=(638, 495), P4=(638, 580), P5=(610, 630), P6=(540, 630)
        if t <= 0.5:
            u = t * 2.0
            x = (1-u)**3 * 540 + 3*(1-u)**2*u * 610 + 3*(1-u)*u**2 * 638 + u**3 * 638
            y = (1-u)**3 * 360 + 3*(1-u)**2*u * 360 + 3*(1-u)*u**2 * 410 + u**3 * 495
        else:
            u = (t - 0.5) * 2.0
            x = (1-u)**3 * 638 + 3*(1-u)**2*u * 638 + 3*(1-u)*u**2 * 610 + u**3 * 540
            y = (1-u)**3 * 495 + 3*(1-u)**2*u * 580 + 3*(1-u)*u**2 * 630 + u**3 * 630
        spine_pts.append(pt(x, y))

    spine_pts.extend([pt(434, 630), pt(472, 592), pt(540, 592)])
    # Inner cubic bezier counter: P0=(540, 592) to (540, 408)
    for step in range(30):
        t = step / 29.0
        if t <= 0.5:
            u = t * 2.0
            x = (1-u)**3 * 540 + 3*(1-u)**2*u * 586 + 3*(1-u)*u**2 * 598 + u**3 * 598
            y = (1-u)**3 * 592 + 3*(1-u)**2*u * 592 + 3*(1-u)*u**2 * 555 + u**3 * 495
        else:
            u = (t - 0.5) * 2.0
            x = (1-u)**3 * 598 + 3*(1-u)**2*u * 598 + 3*(1-u)*u**2 * 586 + u**3 * 540
            y = (1-u)**3 * 495 + 3*(1-u)**2*u * 435 + 3*(1-u)*u**2 * 408 + u**3 * 408
        spine_pts.append(pt(x, y))

    spine_pts.append(pt(422, 408))
    draw.polygon(spine_pts, fill=col_face)

    # 6. Diagonal Speed Arrow Shaft
    shaft_poly = [pt(314, 654), pt(352, 616), pt(668, 300), pt(706, 338), pt(390, 654), pt(352, 692)]
    draw.polygon(shaft_poly, fill=col_face)

    # 7. Inner Speed Arrowhead (Points UP)
    inner_arrow_poly = [pt(542, 464), pt(464, 480), pt(480, 498), pt(524, 498), pt(550, 524), pt(550, 472)]
    draw.polygon(inner_arrow_poly, fill=col_face)

    # 8. Outer Speed Arrowhead (Top-Right)
    outer_arrow_poly = [pt(766, 234), pt(644, 260), pt(672, 288), pt(718, 334), pt(746, 362)]
    draw.polygon(outer_arrow_poly, fill=col_face)
    outer_bevel_poly = [pt(766, 234), pt(718, 334), pt(746, 362)]
    draw.polygon(outer_bevel_poly, fill=(110, 10, 26, 170))

    # Downsample with Lanczos filter for crisp subpixel anti-aliasing
    final_img = img.resize((size, size), Image.Resampling.LANCZOS)

    # Apply background if requested
    if mode == "white":
        bg = Image.new("RGBA", (size, size), (255, 255, 255, 255))
        bg.paste(final_img, (0, 0), final_img)
        return bg.convert("RGB")
    elif mode == "dark":
        bg = Image.new("RGBA", (size, size), (30, 34, 41, 255))
        bg.paste(final_img, (0, 0), final_img)
        return bg.convert("RGB")

    return final_img

# ─────────────────────────────────────────────────────────────
# 3. GENERATION & ASSET DISPATCH
# ─────────────────────────────────────────────────────────────

def build_all_assets():
    print("==================================================")
    print("  DEALHUB OFFICIAL BRAND IDENTITY LOGO SUITE     ")
    print("==================================================")

    # ── 1. Write SVG Vector Assets ──
    svg_files = {
        "dealhub-emblem.svg": get_emblem_3d_svg(include_drop_shadow=True),
        "dealhub-emblem-flat.svg": get_emblem_flat_svg(RED_BASE),
        "hd-logo.svg": get_emblem_3d_svg(include_drop_shadow=True),
        "dealhub-logo.svg": get_horizontal_lockup_svg(theme="light"),
        "dealhub-logo-light.svg": get_horizontal_lockup_svg(theme="light"),
        "dealhub-logo-dark.svg": get_horizontal_lockup_svg(theme="dark"),
        "dealhub-logo-full.svg": get_horizontal_lockup_svg(theme="dark"),
        "dealhub-logo-stacked.svg": get_stacked_lockup_svg(theme="light"),
        "dealhub-logo-stacked-dark.svg": get_stacked_lockup_svg(theme="dark"),
        "dealhub-app-icon.svg": get_squircle_app_icon_svg(),
        "dealhub-monogram.svg": get_dh_monogram_svg(RED_BASE),
        "favicon.svg": get_emblem_flat_svg(RED_BASE),
    }

    for filename, content in svg_files.items():
        filepath = os.path.join(OUTPUT_DIR, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content.strip())
        print(f" [SVG] Created {filename} ({len(content)} bytes)")

    # ── 2. Render HD Raster PNGs via Supersampled PIL ──
    print("\n Rendering Studio-Grade High Resolution PNGs...")
    
    # 2048x2048 Ultra-HD Transparent PNG
    emblem_2048 = render_raster_emblem(size=2048, mode="transparent")
    emblem_2048.save(os.path.join(OUTPUT_DIR, "dealhub-emblem-hd.png"), "PNG")
    print(" [PNG] Saved dealhub-emblem-hd.png (2048x2048 transparent)")

    # 1024x1024 HD Transparent PNG (replaces old embedded dealhub-logo-transparent.png)
    emblem_1024 = render_raster_emblem(size=1024, mode="transparent")
    emblem_1024.save(os.path.join(OUTPUT_DIR, "dealhub-logo-transparent.png"), "PNG")
    emblem_1024.save(os.path.join(OUTPUT_DIR, "dealhub-emblem.png"), "PNG")
    print(" [PNG] Saved dealhub-logo-transparent.png (1024x1024 transparent)")

    # 2048x2048 White Canvas JPEG (High-Res Print & Media)
    emblem_white_2048 = render_raster_emblem(size=2048, mode="white")
    emblem_white_2048.save(os.path.join(OUTPUT_DIR, "dealhub-logo-hd.jpg"), "JPEG", quality=98)
    emblem_white_2048.save(os.path.join(OUTPUT_DIR, "dealhub-emblem-hd.jpg"), "JPEG", quality=98)
    print(" [JPG] Saved dealhub-logo-hd.jpg (2048x2048 white)")

    # Dark Theme HD PNG
    emblem_dark_1024 = render_raster_emblem(size=1024, mode="dark")
    emblem_dark_1024.save(os.path.join(OUTPUT_DIR, "dealhub-emblem-dark-hd.png"), "PNG")
    print(" [PNG] Saved dealhub-emblem-dark-hd.png (1024x1024 dark)")

    # ── 3. Multi-Resolution Favicon Suite ──
    print("\n Generating Multi-Resolution Favicon Suite...")
    fav_sizes = [16, 32, 48, 64, 128, 256]
    fav_images = []
    for s in fav_sizes:
        fav_img = emblem_1024.resize((s, s), Image.Resampling.LANCZOS)
        fav_img.save(os.path.join(OUTPUT_DIR, f"favicon-{s}x{s}.png"), "PNG")
        fav_images.append(fav_img)
        print(f" [FAV] Saved favicon-{s}x{s}.png")

    # 32x32 standard favicon.png
    fav_32 = emblem_1024.resize((32, 32), Image.Resampling.LANCZOS)
    fav_32.save(os.path.join(OUTPUT_DIR, "favicon.png"), "PNG")

    # Apple Touch Icon (180x180 squircle app icon)
    apple_icon = Image.new("RGBA", (180, 180), (200, 36, 58, 255))
    inner_emblem = emblem_1024.resize((140, 140), Image.Resampling.LANCZOS)
    apple_icon.paste(inner_emblem, (20, 20), inner_emblem)
    apple_icon.save(os.path.join(OUTPUT_DIR, "apple-touch-icon.png"), "PNG")
    print(" [APP] Saved apple-touch-icon.png (180x180)")

    # Multi-resolution Windows/Browser favicon.ico
    fav_images[0].save(
        os.path.join(OUTPUT_DIR, "favicon.ico"),
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    )
    print(" [ICO] Saved favicon.ico (multi-resolution 16..256)")

    print("\n All DealHub HD brand assets generated successfully!")

if __name__ == "__main__":
    build_all_assets()

