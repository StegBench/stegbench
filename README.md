# Methodology
## Overview
StegBench consists of a variety of benchmarks which score a steganographic algorithm on a scale of 0 to 100. The score is broken down as follows:

- 20%: Speed = evaluates the efficiency of the steganographic algorithm
- 20%: Subtlety - evaluates how perceptible the image changes are
- 20%: Correctness - evaluates the accuracy of the steganographic algorithm
- 40%: Resilience - evaluates the algorithm's ability to tolerate image manipulations

Speed, Subtlety, and Correctness together comprise the Stage 1 testing metrics and account for 60% of the overall StegBench score. In this stage, ten different images are put through the steganographic algorithm being tested, and the speed, correctness, and subtlety of the results are evaluated. The remaining 40% of the overall StegBench score is from Stage 2, which evaluates resilience to image changes.

The correct way to report a StegBench score is as follows:
  Variant: Score (Speed, Subtlety, Correctness, Resilience)

For example, the highest possible StegBench32s score would be reported like so:
  StegBench32s: 100 (20, 20, 20, 40)

Note that the overall StegBench score is not necessarily the sum of the component scores, as portions the subtlety and correctness may not contribute to the overall score in certain scenarios (see subtlety and correctness sections below for more details).

## Variants
The available variants of the StegBench benchmark and their differences are as follows:

| Variant       | Data Size | Stateful* | Smallest Image** |
|---------------|-----------|-----------|------------------|
| StegBench32   | 4 B       | No        | 21x21            |
| StegBench32s  | 4 B       | Yes       | 21x21            |
| StegBench128  | 16 B      | No        | 240x426          |
| StegBench128s | 16 B      | Yes       | 240x426          |

While one can easily create their own StegBench variant by modifying the above parameters to their choosing, variants other than those specified in the table above are not officially supported and the resulting scores cannot be validated. Other variants may be added in the future if the need arises.

\* In stateful variants, algorithms can compare the original image to the modified image to retrieve the embedded data. These variants are intended to reflect digital watermarking/fingerprinting scenarios.\
\*\* Smaller images are excluded from variants with more data to ensure sufficient entropy is available.

## Stage 1 Testing
### Overview
Stage 1 is scored out of 60 points (20 each for speed, subtlety, and correctness) and accounts for 60% of the overall StegBench score. It consists of 10 images (see Image 1-10 in the "Test Images" section below), each of which are scored out of 6 points (2 each for speed, subtlety, and correctness). Only 10 evaluations (encode and decode cycles) are performed in total; speed, subtlety, and correctness are evaluated simultaneously for each image. The speed, subtlety, and correctness characteristics are segmented into a separate stage from the resilience characteristic, which accounts for the remaining 40% of the StegBench score, for a few reasons: firstly, because the evaluations use separate images (resilience only uses Image 0); secondly, because ; and lastly, because the speed, subtlety, and correctness characteristics are scored as a group, and the correctness score can impact how speed and subtlety points are counted as described below.

### Speed
Speed is scored out of 2 points for each image for a total of 20 points. If the algorithm does not return an image (e.g., throws an error), 0 points are awarded. If the algorithm returns an image, points are awarded according to the following formula:

![](https://latex.codecogs.com/svg.latex?points%3Dclamp%282.05-%5Cfrac%7B1000%28e%20&plus;%20d%29%7D%7Bs%7D%2C%200%2C%202%29)

Where e is the image encoding time in milliseconds, d is the image decoding time in milliseconds, and s is the number of pixels in the image being tested.

Speed points are awarded even if the algorithm ultimately returns the wrong result to ensure that the speed and correctness scores can be used independently when comparing steganograpic algorithms. However, if the algorithm does not return the correct result, the speed points will not be added to the overall StegBench score to avoid rewarding fast computation of invalid results.

### Subtlety
Subtlety is scored out of 2 points for each image for a total of 20 points. If the algorithm does not return an image (e.g., throws an error), 0 points are awarded. If the algorithm returns an image, points are awarded according to the following formula:

![](https://latex.codecogs.com/svg.image?points%20=%20%20%5Cmax(0,%20%5Cfrac%7B30%25%20-%20h%20-%20p%7D%7B15%25%7D))

Where h is the hamming distance (represented as a percentage) between the perceptual hashes of the original and transformed images based on the [pHash](http://phash.org/) algorithm, and p is the percentage of pixels differing by >= 0.5% between the two images (excluding anti-aliasing) using [PixelMatch](https://github.com/mapbox/pixelmatch), which in turn is based on the following papers:

- [Measuring perceived color difference using YIQ NTSC transmission color space in mobile applications](http://www.progmat.uaem.mx:8080/artVol2Num2/Articulo3Vol2Num2.pdf) (2010, Yuriy Kotsarenko, Fernando Ramos)
- [Anti-aliased pixel and intensity slope detector](https://www.researchgate.net/publication/234126755_Anti-aliased_Pixel_and_Intensity_Slope_Detector) (2009, Vytautas Vyšniauskas)

The focus of this methodology is on penalizing differences that are more easily perceivable by the human eye, accounting for relative differences in color and gradient perception depending on pixel brightness and neighboring colors. As such, algorithms that produce images with no human-perceivable differences can receive full points in this category.

Subtlety points are awarded even if the algorithm ultimately returns the wrong result to ensure that the subtlety and correctness scores can be used independently when comparing steganograpic algorithms. However, if the algorithm does not return the correct result, the subtlety points will not be added to the overall StegBench score to avoid rewarding subtle but invalid results.

### Correctness
Correctness is scored out of 2 points for each image for a total of 20 points. For each image:

- If the algorithm returns the correct result, 2 points are awarded
- If the algorithm returns no result (e.g. throws an error), 0.5 points are awarded
- If the algorithm returns the wrong result, 0 points are awarded

The slight preference for no result over incorrect results reflects the fact that algorithms returning the wrong result may cause an incorrect action to be taken (e.g., falsely attributing an image to the wrong user). In practice, this favors algorithms which use safety mechanisms like checksums to prevent false results. Note, however, that since speed and subtlety points do not contribute to the overall score for invalid results, the overall penalty is closer to 5.5 or 6.0 points.

## Stage 2 Testing
### Overview
Stage 2 consists of 16 tests, each of which encode a random value into a test image, manipulate the resulting image in some way, and then attempt to decode the result to see if the algorithm is resilient to that type of manipulation. All of the Stage 2 tests use Image 0 ([image0.png](https://github.com/StegBench/stegbench/blob/main/src/images/image0.png)), a 1280x720 px composite image.

### Resilience
Resilience is scored out of 2.5 points for each test for a total of 40 points. For each test:

- If the algorithm returns the correct result, 2.5 points are awarded
- If the algorithm returns no result (e.g. throws an error), 0.5 points are awarded
- If the algorithm returns the wrong result, 0 points are awarded

Once again, the slight preference for no result over incorrect results reflects the fact that algorithms returning the wrong result may cause an incorrect action to be taken, favoring algorithms that use safety mechanisms like checksums to prevent false results.

Specifically, the tests manipulate the results in the following ways:
- Test 1: Scale result to 852x480 px.
- Test 2: Scale result to 320x240 px (does not preserve aspect ratio).
- Test 3: Scale result to 256x144 px.
- Test 4: Scale result to 2560x1440 px.
- Test 5: Convert result to JPEG with 98% quality.
- Test 6: Convert result to JPEG with 75% quality.
- Test 7: Add 1% random noise to result.
- Test 8: Add 10% random noise to result.
- Test 9: Rotate result 90 degrees counterclockwise (720x1280 output).
- Test 10: Mirror result horizontally (across y axis).
- Test 11: Mirror result vertically (across x axis).
- Test 12: Crop result to 640x360 (bottom left corner).
- Test 13: Crop result to 320x180 (center).
- Test 14: Add overlay to result (see [overlay.png](https://github.com/StegBench/stegbench/blob/main/src/images/overlay.png)).
- Test 15: Increase image brightness by 1%.
- Test 16: Decrease image contrast by 15%.

## Test Images
Below is a summary of the test images used by the benchmark, all of which are licensed for free use, whereby images 1-10 are used for Stage 1 (speed, subtlety, and correctness) testing and image 0 is used for Stage 2 (resilience) testing.

| # | File | Size | Format | Resolution | Quality | Description | Colors | Source |
|---|------|------|--------|------------|---------|-------------|--------|--------|
| 0 | [image0.png](https://github.com/StegBench/stegbench/blob/main/src/images/image0.png) | 1.77 MB | png | 1280x720 (16:9 720p) | 100 | Composite | All | Multiple |
| 1 | [image1.jpg](https://github.com/StegBench/stegbench/blob/main/src/images/image1.jpg) | 4.01 MB | jpg | 3840x2160 (16:9 4K) | 90 | Astronomy | Reds | [NASA](https://images.nasa.gov/details-PIA03654) |
| 2 | [image2.jpg](https://github.com/StegBench/stegbench/blob/main/src/images/image2.jpg) | 1.84 MB | jpg | 1920x1080 (16:9 1080p) | 100 | Nature | Greens, Blues | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Seljalandsfoss,_Su%C3%B0urland,_Islandia,_2014-08-16,_DD_201-203_HDR.JPG) |
| 3 | [image3.gif](https://github.com/StegBench/stegbench/blob/main/src/images/image3.gif) | 186 KB | gif | 480x858 (9:16 480p) | 100 | Portrait | Reds | [USAP](https://nair.me/antarctica/USAP20211217_075108.jpg) |
| 4 | [image4.jpg](https://github.com/StegBench/stegbench/blob/main/src/images/image4.jpg) | 29.9 KB | jpg | 240x426 (9:16 240p) | 85 | Space | Blues, Black | [NASA](https://images.nasa.gov/details-PIA00342) |
| 5 | [image5.gif](https://github.com/StegBench/stegbench/blob/main/src/images/image5.gif) | 392 B | gif | 21x21 (1:1 21px) | 100 | QR code | Black, White | Programmatic |
| 6 | [image6.png](https://github.com/StegBench/stegbench/blob/main/src/images/image6.png) | 617 KB | png | 512x512 (1:1 512px) | 100 | Benchmark | All | Programmatic |
| 7 | [image7.png](https://github.com/StegBench/stegbench/blob/main/src/images/image7.png) | 22.6 MB | png | 4032x3024 (4:3 4K) | 100 | Wildlife | Greys, Blues, Browns | [USAP](https://nair.me/antarctica/USAP20211215_174435.png) |
| 8 | [image8.webp](https://github.com/StegBench/stegbench/blob/main/src/images/image8.webp) | 83.6 KB | webp | 450x600 (3:4 600px) | 95 | Digital Art | Greys, Reds, Greens | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Simply_Red,_desaturated.jpg) |
| 9 | [image9.webp](https://github.com/StegBench/stegbench/blob/main/src/images/image9.webp) | 36.2 KB | webp | 1128x752 (3:2 1128p) | 80 | Diagram | Black, White | [USPTO](https://nair.me/US63266610.pdf#page=54) |
| 10 | [image10.png](https://github.com/StegBench/stegbench/blob/main/src/images/image10.png) | 162 KB | png | 300x450 (2:3 450px) | 100 | 3D Render | Greys | [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Bearing_render.png) |

The images were chosen to test a diverse range of possible inputs while limiting the total number of test cases so as to reduce overall test completion time. Specifically, the test cases represent a variety of file formats, including PNG (4), JPG (3), GIF (2), and WEBP (2); orientations, including landscape (5), portrait (4), and square (2); aspect ratios, including 16:9 (5), 3:2 (2), 4:3 (2), and 1:1 (2); image types, including artificial (6) and natural (5); and sources, including Wikimedia Commons (3), NASA (2), USAP (2), and Programmatic (4). They were chosen to represent a variety of color profiles such as black & white (2), reds (3), greens (2), blues (2), browns (1), greys (1), and multicolor (2). Furthermore, they include resolutions ranging from 21x21 to 4032x3024, file sizes ranging from 392 B to 22.6 MB, and image quality settings ranging from 80% to 100%.

Image 0 is a digital composition of image 5, image 6, image 7, and image 9 designed to represent a balanced mix of the properties provided by each image type.
