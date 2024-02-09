import os
from PIL import Image

def process_sim(directory, thumbnails_dir, gallery_lines):
    simID = os.path.basename(directory)
    title = simID  # Default title is the simID
    index_file = os.path.join(directory, 'index.md')

    # Check if index.md exists and extract the title
    if os.path.exists(index_file):
        with open(index_file, 'r') as file:
            for line in file:
                if line.startswith('#'):
                    title = line.strip('#').strip()
                    break

    # Find the first image (simID.png)
    image_file = os.path.join(directory, f'{simID}.png')
    if not os.path.exists(image_file):
        print(f"No image found for {simID}, skipping. To fix, create image /doc//sims/thumbnails/{simID}.png")
        return

    # Create a thumbnail
    thumbnail_path = os.path.join(thumbnails_dir, f'{simID}.png')
    with Image.open(image_file) as img:
        img.thumbnail((128, 128))
        img.save(thumbnail_path)

    # Add entry to the gallery lines
    gallery_lines.append(f"[{title}](../{simID}) ![thumbnail](./sims/thumbnails/{simID}.png)")

# currently in src, hence ../docs
gall_dir = '../docs/sims/'
img_dir = '../docs/sims/thumbnails/'
gallery_lines = []
gallery_content = ""

#get all contents of docs/sims/
sims = [os.path.join(gall_dir, subdir) for subdir in os.listdir(gall_dir)]
sims.sort()

#process only directories, and ones containing a index.md with title & associated thumbnail
[process_sim(sim,img_dir,gallery_lines) for sim in sims if os.path.isdir(sim)]


for i in range(0, len(gallery_lines), 4):
    row = gallery_lines[i:i+4]
    gallery_content += '| ' + ' | '.join(row) + ' |\n'

# Add the header row and column separators if there are any rows
if gallery_content:
    title = '# Gallery\n\n'
    header_row = '| ' + ' | '.join(['   ' for _ in range(4)]) + ' |\n'
    separator_row = '| ' + ' | '.join(['---' for _ in range(4)]) + ' |\n'
    gallery_content =  title + header_row + separator_row + gallery_content

(open("../docs/index.md", "w")).write(gallery_content)
