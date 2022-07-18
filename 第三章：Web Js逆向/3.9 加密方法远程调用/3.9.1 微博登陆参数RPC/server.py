import asyncio
import websockets
import time

async def check_permit(websocket):
    # 账号列表
    for send_text in [
        '11111111111,111',
        '11111111112,112',
        '11111111113,113',
        '11111111114,114'
    ]:
        await websocket.send(send_text)
    return True

async def recv_msg(websocket):
    while 1:
        recv_text = await websocket.recv()
        print(recv_text)

async def main_logic(websocket, path):
    await check_permit(websocket)
    await recv_msg(websocket)

start_server = websockets.serve(main_logic, '127.0.0.1', 9999)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
