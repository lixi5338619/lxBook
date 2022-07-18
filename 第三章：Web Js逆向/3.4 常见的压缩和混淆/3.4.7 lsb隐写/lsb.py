from PIL import Image

def plus(str):
    # 返回指定长度的字符串，原字符串右对齐，前面填充0。
    return str.zfill(8)

def get_key(strr):
    str_ = ""
    for i in range(len(strr)):
        # 将要隐藏的文件内容转换为二进制并拼接起来
        str_ = str_ + plus(bin(ord(strr[i])).replace('0b', ''))
    return str_

def mod(x, y):
    return x % y

def func(old_img, str2, new_img):
    # str1为载体图片路径，str2为隐写文件，str3为加密图片保存的路径
    im = Image.open(old_img)
    # 获取图片的宽和高
    width = im.size[0]
    height = im.size[1]
    count = 0
    key = get_key(str2)
    keylen = len(key)
    for h in range(0, height):
        for w in range(0, width):
            pixel = im.getpixel((w, h))
            a = pixel[0]
            b = pixel[1]
            c = pixel[2]
            if count == keylen:
                break
            # 信息隐藏：分别将每个像素点的RGB值余2，去掉最低位的值
            # 再从需要隐藏的信息中取出一位，转换为整型，两值相加
            a = a - mod(a, 2) + int(key[count])
            count += 1
            if count == keylen:
                im.putpixel((w, h), (a, b, c))
                break
            b = b - mod(b, 2) + int(key[count])
            count += 1
            if count == keylen:
                im.putpixel((w, h), (a, b, c))
                break
            c = c - mod(c, 2) + int(key[count])
            count += 1
            if count == keylen:
                im.putpixel((w, h), (a, b, c))
                break
            if count % 3 == 0:
                im.putpixel((w, h), (a, b, c))
    im.save(new_img)

# 原图
old_img = r"timg.jpg"
new_img = r"timg2.jpg"
func(old_img,"Lx Is Good Man",new_img)