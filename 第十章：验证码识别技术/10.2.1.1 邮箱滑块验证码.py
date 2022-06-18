from selenium import webdriver
from io import BytesIO
import cv2,numpy as np, random, requests, time
from selenium.webdriver import ActionChains
import warnings
from PIL import Image
warnings.filterwarnings("ignore",category=DeprecationWarning)

'''识别缺口位置、计算偏移值'''
class SlideCrack(object):
    def __init__(self, gap, bg, out=None):
        """
        init code
        :param gap: 缺口图片
        :param bg: 背景图片
        :param out: 输出图片
        """
        self.gap = gap
        self.bg = bg
        self.out = out

    @staticmethod
    def clear_white(img):
        # 清除图片的空白区域，这里主要清除滑块的空白
        img = cv2.imdecode(np.frombuffer(img,np.uint8), cv2.IMREAD_UNCHANGED)
        rows, cols, channel = img.shape
        min_x = 255
        min_y = 255
        max_x = 0
        max_y = 0
        for x in range(1, rows):
            for y in range(1, cols):
                t = set(img[x, y])
                if len(t) >= 2:
                    if x <= min_x:
                        min_x = x
                    elif x >= max_x:
                        max_x = x

                    if y <= min_y:
                        min_y = y
                    elif y >= max_y:
                        max_y = y
        img1 = img[min_x:max_x, min_y: max_y]
        return img1

    def template_match(self, tpl, target):
        th, tw = tpl.shape[:2]
        result = cv2.matchTemplate(target, tpl, cv2.TM_CCOEFF_NORMED)
        # 寻找矩阵(一维数组当作向量,用Mat定义) 中最小值和最大值的位置
        min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
        tl = max_loc
        # br = (tl[0] + tw, tl[1] + th)
        # 绘制矩形边框，将匹配区域标注出来
        # target：目标图像
        # tl：矩形定点
        # br：矩形的宽高
        # (0,0,255)：矩形边框颜色
        # 1：矩形边框大小
        # cv2.rectangle(target, tl, br, (0, 0, 255), 2)
        # if self.out:
        #     cv2.imwrite(self.out, target)
        return tl[0]

    @staticmethod
    def image_edge_detection(img):
        edges = cv2.Canny(img, 100, 200)
        return edges

    def discern(self):
        img1 = self.clear_white(self.gap)
        img1 = cv2.cvtColor(img1, cv2.COLOR_RGB2GRAY)
        slide = self.image_edge_detection(img1)
        back = cv2.cvtColor(np.asarray(Image.open(BytesIO(self.bg))), cv2.COLOR_RGB2GRAY)
        back = self.image_edge_detection(back)
        slide_pic = cv2.cvtColor(slide, cv2.COLOR_GRAY2RGB)
        back_pic = cv2.cvtColor(back, cv2.COLOR_GRAY2RGB)
        x = self.template_match(slide_pic, back_pic) # 滑块偏移值
        # 输出横坐标, 即 滑块在图片上的位置
        return x


def get_distance(gap, bg):
    """
    计算滑动距离
    """
    with open(gap,'rb') as f:
        gap = f.read()
    with open(bg,'rb') as f:
        bg = f.read()
    sc = SlideCrack(gap, bg, "image/r.png")
    distance = int(sc.discern() // 2.4)
    return distance


'''模拟验证行为'''
def main():
    driver = webdriver.Chrome(executable_path=r'chromedriver.exe')
    driver.get('https://mail.qq.com')
    time.sleep(1)
    driver.switch_to.frame("login_frame")
    time.sleep(1)
    driver.find_element_by_id('switcher_plogin').click()

    username = '1234567{}@qq.com'.format(random.randint(0, 99))
    driver.find_element_by_id("u").send_keys(username)
    driver.find_element_by_id("p").send_keys('wwwwwwwww')
    time.sleep(1)
    driver.find_element_by_id("login_button").click()
    time.sleep(1)

    driver.switch_to.frame(driver.find_element_by_id('tcaptcha_iframe'))
    time.sleep(1)
    src_big = driver.find_element_by_id('slideBg').get_attribute('src')
    time.sleep(1)
    src_small = driver.find_element_by_id('slideBlock').get_attribute('src')
    img_big = requests.get(src_big).content
    img_small = requests.get(src_small).content
    with open('image/yanzhengtu.jpg', 'wb') as f:
        f.write(img_big)
    with open('image/huakuai.png', 'wb') as f:
        f.write(img_small)

    y = get_distance('image/huakuai.png','image/yanzhengtu.jpg')
    time.sleep(2)
    huakuai = driver.find_element_by_id('tcaptcha_drag_thumb')
    action = ActionChains(driver)
    action.click_and_hold(huakuai).perform()
    action.move_by_offset(y-30, 0).perform()
    action.release(on_element=huakuai).perform()
    time.sleep(3)
    driver.close()

if __name__ == '__main__':
    main()
