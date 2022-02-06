# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print(text_data_json)
        message = text_data_json['message']
        user_name = text_data_json['user_name']
        cur_user_id = text_data_json['cur_user_id']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'user_name': user_name,
                'cur_user_id': cur_user_id,
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        print(event)
        message = event['message']
        user_name = event['user_name']
        cur_user_id = event['cur_user_id']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'user_name': user_name,
            'cur_user_id': cur_user_id,
        }))



class ChatEachConsumer(AsyncWebsocketConsumer):
    users = [] #存储在线列表，所有用户共享的变量
    history = []#存储历史记录，也可存在数据库。
    async def connect(self):
        print(self.scope)
        # 获取用户名
        room_name = self.scope['url_route']['kwargs']['room_name']
        #添加进在线用户列表。添加之前，可以做一系列操作，例如查看用户是否合法访问等
        self.users.append({'room_name':room_name,'channel_name':self.channel_name})
        print(room_name)
        print(self.channel_name)
        # 同意连接
        await self.accept()


        # 检查是否有历史未读消息，若有，则发送给用户(还可以从数据库读取）
        message = []
        send_user = None
        print(self.history)
        if len(self.history)>0:
            for item in self.history:
                #如果历史消息里这条记录是发送给刚登录的用户的，添加进用户历史信息列表
                if item['To_ID']==room_name:
                    message.append(item['message'])
                    send_user = item['send_user']
        # 如果message长度大于零，表示有历史记录，
        if len(message)>0:
            # for item in message:
            #     self.history.remove(item)
            await self.send(text_data=json.dumps({
                'message': message,
                'send_user': send_user,
            }))


    async def disconnect(self, close_code):
        #从在线列表中移除后退出
        self.users.remove({'room_name':self.scope['url_route']['kwargs']['room_name'],'channel_name':self.channel_name})
        await self.close()

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        send_user = text_data_json["send_user"]
        print(text_data_json)
        # 存入数据库
        # await self.savemsg(text_data_json)

        # 往特定channel发消息，这边是写死的，前端传过来的To_ID是test01
        To_ID = text_data_json['To_ID']

        # 若已经登录，则直接发送
        channel_name = ''
        print(self.users)
        for item in self.users:
            if item['room_name'] == To_ID:
                channel_name = item['channel_name']
                break

        # 判断是否在已登录记录中
        if channel_name != '':
            # Send message to room
            await self.channel_layer.send(
                channel_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'send_user': send_user,
                }
            )
            print("发送成功")
        else:
            # 否则，存储到历史记录
            self.history.append({'message':message,'To_ID':To_ID,'send_user':send_user})
            print(self.history)
        for item in self.users:
            if item['room_name'] == send_user:
                channel_name = item['channel_name']
                break
        await self.channel_layer.send(
            channel_name,
            {
                'type': 'chat_message',
                'message': message,
                'send_user': send_user,
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        print(event)
        message = event['message']
        send_user = event['send_user']
        # Send message to WebSocket。发送到前端
        print(message)
        await self.send(text_data=json.dumps({
            'message': [message],
            'send_user': send_user,
        }))


    # @database_sync_to_async
    # def savemsg(self, text_data_json):
    #     print("save to database")
    #     From_ID = text_data_json['From_ID']
    #     To_ID = text_data_json['To_ID']
    #     Content = text_data_json['Content']
    #     Time = text_data_json['Time']
    #     MSg = Messages.objects.create(From_ID=From_ID, To_ID=To_ID, Content=Content, Time=Time)
    #     MSg.save()
    #
    # @database_sync_to_async
    # def readhistorymsg(self, From_ID, UID):
    #     Msg = Messages.objects.filter(From_ID=From_ID,To_ID=UID)
    #     return Msg