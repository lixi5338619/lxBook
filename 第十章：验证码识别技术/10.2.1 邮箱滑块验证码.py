# -*- coding: utf-8 -*-
from selenium import webdriver
import cv2, numpy as np, random, requests, time
from selenium.webdriver import ActionChains

'''识别缺口位置、计算偏移值'''


def shibie():
    otemp = 'huakuai.png'
    oblk = 'yanzhengtu.jpg'
    target = cv2.imread(otemp, 0)
    template = cv2.imread(oblk, 0)
    w, h = target.shape[::-1]
    temp = 'temp.jpg'
    targ = 'targ.jpg'
    cv2.imwrite(temp, template)
    cv2.imwrite(targ, target)
    target = cv2.imread(targ)
    target = cv2.cvtColor(target, cv2.COLOR_BGR2GRAY)
    target = abs(255 - target)
    cv2.imwrite(targ, target)
    target = cv2.imread(targ)
    template = cv2.imread(temp)
    result = cv2.matchTemplate(target, template, cv2.TM_CCOEFF_NORMED)
    x, y = np.unravel_index(result.argmax(), result.shape)
    cv2.rectangle(template, (y, x), (y + w, x + h), (7, 249, 151), 3)
    return y


'''selenium模拟登陆 获取滑块'''


def main():
    driver = webdriver.Chrome(executable_path=r'填写你的驱动文件地址')
    driver.get('https://mail.qq.com')
    time.sleep(2)
    driver.switch_to.frame("login_frame")
    try:
        driver.find_element_by_id('switcher_plogin').click()
    except:
        pass
    username = '1234567{}@qq.com'.format(random.randint(0, 99))
    driver.find_element_by_id("u").send_keys(username)
    driver.find_element_by_id("p").send_keys('wwwwwwwww')
    driver.find_element_by_id("login_button").click()

    driver.switch_to.frame("tcaptcha_iframe")
    time.sleep(1)
    if driver.find_element_by_id('slideBgWrap'):
        time.sleep(0.5)
    src_big = driver.find_element_by_xpath('//div[@id="slideBgWrap"]/img').get_attribute('src')
    src_small = driver.find_element_by_xpath('//div[@id="slideBlockWrap"]/img').get_attribute('src')
    img_big = requests.get(src_big).content
    img_small = requests.get(src_small).content
    with open('yanzhengtu.jpg', 'wb') as f:
        f.write(img_big)
    with open('huakuai.png', 'wb') as f:
        f.write(img_small)
    y = shibie()
    time.sleep(2)
    huakuai = driver.find_element_by_id('tcaptcha_drag_thumb')
    action = ActionChains(driver)
    action.click_and_hold(huakuai).perform()
    y = (y + 20) / (680 / 280) - 27  # 根据电脑的分辨率，此处计算参数可能需要微调
    action.move_by_offset(y, 0).perform()
    action.release(on_element=huakuai).perform()
    time.sleep(3)
    driver.close()


if __name__ == '__main__':
    main()