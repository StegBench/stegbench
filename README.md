# Methodology
## Stage 1 (SSC) Testing
### Overview
### Speed
### Subtlety
### Correctness

## Stage 2 (R) Testing
### Overview
### Resilience

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
