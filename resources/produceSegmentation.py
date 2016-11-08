import os
from scipy.io import loadmat
import os
from PIL import Image
import numpy as np

dirs = os.listdir(".")

for dir in dirs:
    produce_dir = os.path.join(dir, "probmaps")
    if not os.path.isdir(produce_dir):
        continue
    # video_dir = os.path.join(dir, "segmentation", "visuals", "segmentations")
    for model in ["coco", "pascal"]:
        file = os.path.join(produce_dir, "model_%s_obj0.mat" % model)
        print(file)
        data = loadmat(file)["segmentations"].ravel()
        for i in range(data.size):
            image_data = data[i].astype(np.uint8)*255;
            image = Image.fromarray(image_data)
            image.putalpha(Image.fromarray(image_data, mode="L"))
            image.save(os.path.join(produce_dir, "seg_%s_%i.png" % (model, i)))
            # Image.fromarray(data[i].astype(
            #     np.uint8) * 255).save(os.path.join(produce_dir, "seg_%s_%i.png" % (model, i)))
