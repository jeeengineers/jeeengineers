import os
import sys
from PIL import Image

def optimize_images(directory="img", quality=80):
    """
    Scans the given directory for PNG/JPG images, converts and optimizes them to WebP format.
    
    Parameters:
        directory (str): Path to folder containing images (default: 'img').
        quality (int): Lossy compression quality (1-100, default: 80 for optimal web compression).
    """
    if not os.path.exists(directory):
        print(f"Error: Directory '{directory}' does not exist.")
        return

    supported_extensions = ('.png', '.jpg', '.jpeg')
    image_files = [f for f in os.listdir(directory) if f.lower().endswith(supported_extensions)]

    if not image_files:
        print(f"No supported images (.png, .jpg, .jpeg) found in '{directory}'.")
        return

    print(f"Found {len(image_files)} image(s) in '{directory}'. Starting optimization (Quality: {quality}%)...\n")
    print(f"{'Original File':<40} | {'Original Size':<12} | {'WebP Size':<12} | {'Savings':<10}")
    print("-" * 82)

    total_orig_bytes = 0
    total_new_bytes = 0
    converted_count = 0

    for filename in image_files:
        orig_path = os.path.join(directory, filename)
        base_name = os.path.splitext(filename)[0]
        webp_filename = f"{base_name}.webp"
        webp_path = os.path.join(directory, webp_filename)

        try:
            with Image.open(orig_path) as img:
                # Convert color modes properly (preserve alpha for PNG transparency)
                if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
                    converted_img = img.convert("RGBA")
                else:
                    converted_img = img.convert("RGB")

                # Save with WebP optimization parameters (quality=80, max compression effort method=6)
                converted_img.save(webp_path, "WEBP", quality=quality, method=6)

            orig_size = os.path.getsize(orig_path)
            webp_size = os.path.getsize(webp_path)
            
            total_orig_bytes += orig_size
            total_new_bytes += webp_size
            converted_count += 1

            savings_percent = ((orig_size - webp_size) / orig_size) * 100
            
            orig_kb = f"{orig_size / 1024:.1f} KB"
            webp_kb = f"{webp_size / 1024:.1f} KB"
            savings_str = f"{savings_percent:+.1f}%" if savings_percent >= 0 else f"{savings_percent:.1f}%"

            print(f"{filename:<40} | {orig_kb:<12} | {webp_kb:<12} | {savings_str:<10}")

        except Exception as e:
            print(f"Failed to process {filename}: {e}")

    print("-" * 82)
    if total_orig_bytes > 0:
        total_savings = ((total_orig_bytes - total_new_bytes) / total_orig_bytes) * 100
        print(f"Total Processed: {converted_count} file(s)")
        print(f"Total Original Size: {total_orig_bytes / 1024 / 1024:.2f} MB")
        print(f"Total WebP Size:     {total_new_bytes / 1024 / 1024:.2f} MB")
        print(f"Overall Space Saved: {total_savings:.1f}%\n")

if __name__ == "__main__":
    target_dir = sys.argv[1] if len(sys.argv) > 1 else "img"
    quality_val = int(sys.argv[2]) if len(sys.argv) > 2 else 80
    optimize_images(target_dir, quality_val)
