import numpy as np
import cv2

#img = cv2.imread('teste.png')
# '.jpg'means that the img of the current picture is encoded in jpg format, and the result of encoding in different formats is different.
#img_encode = cv2.imencode('.png', img)[1]
# imgg = cv2.imencode('.png', img)

# data_encode = np.array(img_encode)
#a = img_encode.tobytes()
# str_encode = data_encode

a = eval("bytes(" + input() + ")")
b = np.frombuffer(a, dtype=np.uint8)

# print(b[:30])
# print(type(b))

# print(data_encode[:50])
# print(type(data_encode))

# print(str_encode[:50])
# print(type(str_encode))

# # Cached data is saved locally and in txt format
# with open('img_encode.txt', 'w') as f:
#     f.write(str_encode)
#     f.flush

# with open('img_encode.txt', 'r') as f:
#     str_encode = f.read()

img_decode = cv2.imdecode(b, cv2.IMREAD_COLOR)

cv2.imshow("img_decode", img_decode)
cv2.waitKey()