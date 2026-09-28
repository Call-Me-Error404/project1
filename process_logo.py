import os
from PIL import Image, ImageDraw, ImageFilter

input_path = r"C:/Users/Administrator/.gemini/antigravity/brain/fce3b66b-3b64-4686-aa51-b4c1d320bf2d/.user_uploaded/media_1790578830468.jpg"
output_dir = r"c:/Users/Administrator/Downloads/freelance/assets"
os.makedirs(output_dir, exist_ok=True)

img = Image.open(input_path).convert("RGBA")
w, h = img.size
print(f"Original image size: {w}x{h}")

# The logo is a circle centered around (512, 531) with radius around 388.
# Let's inspect the bounding circle precisely:
# Center is (512, 531)
cx, cy = 512, 531
radius = 389

# Method 1: Flood fill exterior black pixels to preserve the exact organic circular edge with splatters
# We find all pixels connected to corners that are near-black
visited = bytearray(w * h)
queue = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
for x, y in queue:
    visited[y * w + x] = 1

pixels = img.load()
head = 0
while head < len(queue):
    qx, qy = queue[head]
    head += 1
    for dx, dy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
        nx, ny = qx + dx, qy + dy
        if 0 <= nx < w and 0 <= ny < h:
            idx = ny * w + nx
            if not visited[idx]:
                visited[idx] = 1
                r, g, b, a = pixels[nx, ny]
                # If dark exterior background pixel
                if r < 35 and g < 35 and b < 35:
                    queue.append((nx, ny))

print(f"Exterior background pixels found: {len(queue)}")

# Create alpha mask from exterior
alpha_mask = Image.new("L", (w, h), 255)
alpha_pixels = alpha_mask.load()
for qx, qy in queue:
    alpha_pixels[qx, qy] = 0

# Smooth the edge slightly for crisp anti-aliasing
alpha_mask_smooth = alpha_mask.filter(ImageFilter.GaussianBlur(radius=0.7))

transparent_img = img.copy()
transparent_img.putalpha(alpha_mask_smooth)

# Crop to the circle bounding box with a small margin
bbox = (cx - radius - 10, cy - radius - 10, cx + radius + 10, cy + radius + 10)
cropped_transparent = transparent_img.crop(bbox)

# Method 2: Perfect geometric circle mask with subtle anti-aliased border
clean_circle = Image.new("RGBA", (radius * 2, radius * 2), (0, 0, 0, 0))
# High-res supersampling for pristine antialiasing
super_res = (radius * 4, radius * 4)
super_mask = Image.new("L", super_res, 0)
super_draw = ImageDraw.Draw(super_mask)
super_draw.ellipse((0, 0, super_res[0], super_res[1]), fill=255)
circle_mask = super_mask.resize((radius * 2, radius * 2), Image.Resampling.LANCZOS)

# Crop circle area from original
cropped_circle_raw = img.crop((cx - radius, cy - radius, cx + radius, cy + radius))
cropped_circle_raw.putalpha(circle_mask)

# Save both versions:
# 1. Original transparent with organic ink edge and splatters
transparent_img.save(os.path.join(output_dir, "logo-full-transparent.png"), "PNG")
# 2. Tight cropped version
cropped_transparent.save(os.path.join(output_dir, "logo-transparent.png"), "PNG")
# 3. Clean circular avatar/badge
cropped_circle_raw.save(os.path.join(output_dir, "logo-circle.png"), "PNG")

# Also save a 128x128 favicon
favicon = cropped_circle_raw.resize((128, 128), Image.Resampling.LANCZOS)
favicon.save(os.path.join(output_dir, "favicon.png"), "PNG")

print("All logo assets generated successfully!")
