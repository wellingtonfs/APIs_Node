import numpy as np
import argparse
import cv2

parser = argparse.ArgumentParser()
parser.add_argument('width', type=int)
parser.add_argument('height', type=int)
parser.add_argument('--pose', nargs='+', type=float, required=True)
parser.add_argument('--face', nargs='+', type=float, required=True)
parser.add_argument('--hand_left', nargs='+', type=float, required=True)
parser.add_argument('--hand_right', nargs='+', type=float, required=True)
#parser.add_argument('--out', type=str, required=True)
parser.add_argument('--linewidth', type=int, default=10)
args = parser.parse_args()

max_cor_pose = 128
lineWidth = max(2, int(args.linewidth))
lineWidth = lineWidth if lineWidth % 2 == 0 else lineWidth + 1
c = 0.05
cc = 1e-12

# print("\n")
# print(args.width)
# print(args.height)
# print(args.pose)
# print(args.face)
# print(args.hand_left)
# print(args.hand_right)
# print(args.out)
# print("\n")

def rgb(b, g, r):
    return r, g, b

def ponto(ponto: np.ndarray):
    return (int(ponto[0].item()), int(ponto[1].item()))

def criarLinha(img, p1, p2, cor: tuple, width=lineWidth):
    #print(p1, p2)
    parcial = np.zeros_like(img)
    cv2.line(parcial, p1, p2, rgb(*cor), width)
    return np.clip(img + parcial, 0, 255)

# pontos da entrada

pose = np.array(args.pose).reshape((-1, 3))
face = np.array(args.face).reshape((-1, 3))
hand_left = np.array(args.hand_left).reshape((-1, 3))
hand_right = np.array(args.hand_right).reshape((-1, 3))

# criar imagem

img = np.ones((args.width, args.height, 3), dtype=np.uint8)
img.fill(0)

# -------------------------------- POSE --------------------------------- 

# definir caminhos das poses (linhas)

pl_face = [0, 1] #azul
pl_hand_right = [1, 2, 3, 4] #azul - vermelho
pl_hand_left = [1, 5, 6, 7] #azul - verde
pl_body = [1, 8] #azul

for i in range(1, len(pl_face)):
    p1 = pose[pl_face[i-1]]
    p2 = pose[pl_face[i]]

    if p1[2] >= c and p2[2] >= c:
        img = criarLinha(img, ponto(p1), ponto(p2), (0, 0, max_cor_pose))

cor = max_cor_pose
for i in range(1, len(pl_hand_right)):
    p1 = pose[pl_hand_right[i-1]]
    p2 = pose[pl_hand_right[i]]

    if p1[2] >= c and p2[2] >= c:
        img = criarLinha(img, ponto(p1), ponto(p2), (max_cor_pose-cor, 0, cor))

    cor -= max_cor_pose // (len(pl_hand_right) // 2)

cor = max_cor_pose
for i in range(1, len(pl_hand_left)):
    p1 = pose[pl_hand_left[i-1]]
    p2 = pose[pl_hand_left[i]]

    if p1[2] >= c and p2[2] >= c:
        img = criarLinha(img, ponto(p1), ponto(p2), (0, max_cor_pose-cor, cor))

    cor -= max_cor_pose // (len(pl_hand_left) // 2)

for i in range(1, len(pl_body)):
    p1 = pose[pl_body[i-1]]
    p2 = pose[pl_body[i]]

    if pl_body[i] == 8 and pose[pl_body[i], 2] < cc:
        p2[0] = p1[0]
        p2[1] = args.height - 1

    img = criarLinha(img, ponto(p1), ponto(p2), (0, 0, max_cor_pose))

# -------------------------------- Mãos --------------------------------- 

dedo_1 = [0, 17, 20]
dedo_2 = [0, 13, 16]
dedo_3 = [0, 9, 12]
dedo_4 = [0, 5, 8]
dedo_5 = [0, 2, 4]

# mão direita (baseado em vermelho e azul)

cor = 5
for i in range(1, 6):
    dedo = globals()['dedo_%d' %i]

    for i in range(1, len(dedo)):
        p1 = hand_right[dedo[i-1]]
        p2 = hand_right[dedo[i]]

        if p1[2] >= c and p2[2] >= c:
            img = criarLinha(img, ponto(p1), ponto(p2), (255, 0, cor), lineWidth//2)
    
    cor += 50

# mão esquerda (baseado em verde e azul)

cor = 5
for i in range(1, 6):
    dedo = globals()['dedo_%d' %i]

    for i in range(1, len(dedo)):
        p1 = hand_left[dedo[i-1]]
        p2 = hand_left[dedo[i]]

        if p1[2] >= c and p2[2] >= c:
            img = criarLinha(img, ponto(p1), ponto(p2), (0, 255, cor), lineWidth//2)
    
    cor += 50

# face

# olho direito

if face[36, 2] >= c and face[39, 2] >= c and face[38, 2] >= c and face[40, 2] >= c:
    largura = int(face[39][0] - face[36][0]) // 2
    altura = int(face[40][1] - face[38][1]) // 2
    center_x = int(largura + face[36][0])
    center_y = int(altura + face[38][1])

    img = cv2.ellipse(
        img,
        (center_x, center_y),
        (largura, altura),
        0, 0, 360, (255, 0, 0), lineWidth // 2
    )

# olho esquerdo

if face[42, 2] >= c and face[45, 2] >= c and face[43, 2] >= c and face[47, 2] >= c:
    largura = int(face[45][0] - face[42][0]) // 2
    altura = int(face[47][1] - face[43][1]) // 2
    center_x = int(largura + face[42][0])
    center_y = int(altura + face[43][1])

    img = cv2.ellipse(
        img,
        (center_x, center_y),
        (largura, altura),
        0, 0, 360, (255, 0, 0), lineWidth // 2
    )

# boca

if face[54, 2] >= c and face[60, 2] >= c and face[62, 2] >= c and face[66, 2] >= c:
    largura = int(face[54][0] - face[60][0]) // 2
    altura = int(face[66][1] - face[62][1]) // 2
    center_x = int(largura + face[60][0])
    center_y = int(altura + face[62][1])

    img = cv2.ellipse(
        img,
        (center_x, center_y),
        (largura, altura),
        0, 0, 360, (255, 0, 0), lineWidth // 2
    )

#img = criarLinha(img, ponto(face[54]), ponto(face[60]), (255,0,0))

# img = criarLinha(img, (128, 128), (200, 128), (255, 0, 0))
# img = criarLinha(img, (160, 100), (160, 160), (0, 255, 0))

#cv2.line(img[:, :, 0], (128, 128), (200, 128), rgb(255, 0, 0), 5)
#cv2.line(img, (160, 100), (160, 160), rgb(0, 255, 0), 5)

#cv2.imshow("pose", img)

#cv2.imwrite("teste.png", img)

#exit()

enc = cv2.imencode(".png", img)[1]
enc = enc.tobytes()


# def getData(data, chunk_size=256):
#     alldata = "linewidth=15&keypoints=" + json.dumps(data)

#     for i in range(len(alldata) // chunk_size):
#         yield alldata[i*chunk_size:(i+1)*chunk_size]

#     if len(alldata) % chunk_size != 0:
#         yield alldata[-(len(alldata) % chunk_size):]

print(enc)

# chunk_size = 1000

# for i in range(len(enc) // chunk_size):
#     print(enc[i*chunk_size:(i+1)*chunk_size], flush=True)

# if len(enc) % chunk_size != 0:
#     print(enc[-(len(enc) % chunk_size):], flush=True)

# print(enc[-10:])

# print(len(enc[-10:]))
#cv2.imwrite(args.out, img)

#print("python diz: ok")
# cv2.waitKey(0)
# cv2.destroyAllWindows()