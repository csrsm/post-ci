---
category: csrsm
title: Websocket
header-title: true
header-image:
   - /img/background.jpg
   - /img/001.png
   - /img/0002.png
   - /img/0003.png
   - /img/0004.png
   - /img/0005.png
   - /img/0006.png
   - /img/0007.png
   - /img/0008.png
   - /img/0009.png
   - /img/0010.png
   - /img/0011.png
   - /img/0012.png
   - /img/0013.png
   - /img/0014.png
   - /img/0015.png
   - /img/0016.png
tags:
  - java
  - base
date: 2020-11-23
---

### springboot+shiro+vue+websocket

1. 建立websocket时，建议前端请求时，将用户id作为参数传到后台，方便session管理。

2. 前端开发时，使用代理时，需在proxyTable中加入属性(表示支持websocket通信)，

   ```
   ws: true
   ```

   且请求url需特殊处理

   ```
   "ws://"+ location.host+"/api/xx/xx"
   ```

3. 前端部署时，使用nginx代理时，需在代理中加入一下属性

   ```
   proxy_set_header Upgrade $http_upgrade;
   proxy_set_header Connection "upgrade"; 
   proxy_set_header Origin "";
   ```

   

## 代码样例

java

websocket在springboot中的一种实现，在java后台中，websocket是作为一种服务端配置，其配置如下

```java
@Configuration
public class WebSocketConfig {
    @Bean(name="serverEndpointExporter")
    public ServerEndpointExporter getServerEndpointExporterBean(){
        return new ServerEndpointExporter();
    }
}
```

自己的websocket实现类

```java
@Component
@ServerEndpoint(value = "/messageSocket/{userId}")
public class MessageWebSocket {

    private static final Logger logger = LoggerFactory.getLogger(MessageWebSocket.class);

    /**
     * 静态变量，用来记录当前在线连接数。应该把它设计成线程安全的。
     */
    private static int onlineCount = 0;

    /**
     * key: userId value: sessionIds
     */
    private static ConcurrentHashMap<Integer, ConcurrentLinkedQueue<String>> userSessionMap =  new ConcurrentHashMap<>();

    /**
     * concurrent包的线程安全Map，用来存放每个客户端对应的MyWebSocket对象。
     */
    private static ConcurrentHashMap<String, MessageWebSocket> websocketMap = new ConcurrentHashMap<>();

    /**
     * key: sessionId value: userId
     */
    private static ConcurrentHashMap<String, Integer> sessionUserMap = new ConcurrentHashMap<>();

    /**
     * 当前连接会话，需要通过它来给客户端发送数据
     */
    private Session session;

    /**
     * 连接建立成功调用的方法
     * */
    @OnOpen
    public void onOpen(Session session, @PathParam("userId") Integer userId) {
        System.out.println(applicationContext);
        try {
            this.session = session;
            String sessionId = session.getId();
            //建立userId和sessionId的关系
            if(userSessionMap.containsKey(userId)) {
                userSessionMap.get(userId).add(sessionId);
            }else{
                ConcurrentLinkedQueue<String> queue = new ConcurrentLinkedQueue<>();
                queue.add(sessionId);
                userSessionMap.put(userId, queue);
            }
            sessionUserMap.put(sessionId, userId);
            //建立sessionId和websocket引用的关系
            if(!websocketMap.containsKey(sessionId)){
                websocketMap.put(sessionId, this);
                addOnlineCount();           //在线数加1
            }
        }catch (Exception e){
            logger.error("连接失败");
            String es = ExceptionUtils.getFullStackTrace(e);
            logger.error(es);
        }
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose() {
        String sessionId = this.session.getId();
        //移除userId和sessionId的关系
        Integer userId = sessionUserMap.get(sessionId);
        sessionUserMap.remove(sessionId);
        if(userId != null) {
            ConcurrentLinkedQueue<String> sessionIds = userSessionMap.get(userId);
            if(sessionIds != null) {
                sessionIds.remove(sessionId);
                if (sessionIds.size() == 0) {
                    userSessionMap.remove(userId);
                }
            }
        }
        //移除sessionId和websocket的关系
        if (websocketMap.containsKey(sessionId)) {
            websocketMap.remove(sessionId);
            subOnlineCount();           //在线数减1
        }
    }

    /**
     * 收到客户端消息后调用的方法
     *
     * @param messageStr 客户端发送过来的消息
     **/
    @OnMessage
    public void onMessage(String messageStr, Session session, @PathParam("userId") Integer userId) throws IOException {
   
    }

    /**
     *
     * @param session
     * @param error 当连接发生错误时的回调
     */
    @OnError
    public void onError(Session session, Throwable error) {
        String es = ExceptionUtils.getFullStackTrace(error);
        logger.error(es);
    }


    /**
     * 实现服务器主动推送
     */
    public void sendMessage(String message, Integer toUserId) throws IOException {
        if(toUserId != null && !StringUtil.isEmpty(message.trim())){
            ConcurrentLinkedQueue<String> sessionIds = userSessionMap.get(toUserId);
            if(sessionIds != null) {
                for (String sessionId : sessionIds) {
                    MessageWebSocket socket = websocketMap.get(sessionId);
                    socket.session.getBasicRemote().sendText(message);
                }
            }
        }else{
            logger.error("未找到接收用户连接，该用户未连接或已断开");
        }
    }

    public void sendMessage(String message, Session session) throws IOException {
        session.getBasicRemote().sendText(message);
    }

     /**
    *获取在线人数
    */
    public static synchronized int getOnlineCount() {
        return onlineCount;
    }
     /**
    *在线人数加一
    */
    public static synchronized void addOnlineCount() {
        MessageWebSocket.onlineCount++;
    }
    /**
    *在线人数减一
    */
    public static synchronized void subOnlineCount() {
        MessageWebSocket.onlineCount--;
    }
}
```

vue中

```javascript
 init: function () {
            if(typeof(WebSocket) === "undefined"){
                alert("您的浏览器不支持socket")
            }else{
                // 实例化socket
                this.socket = new WebSocket(this.path)
                // 监听socket连接
                this.socket.onopen = this.open
                // 监听socket错误信息
                this.socket.onerror = this.error
                // 监听socket消息
                this.socket.onmessage = this.getMessage
            }
        },
        open: function () {
            console.log("socket连接成功")
        },
        error: function () {
            console.log("连接错误")
        },
        getMessage: function (msg) {
            console.log(msg.data)
        },
        send: function () {
            this.socket.send(params)
        },
        close: function () {
            console.log("socket已经关闭")
        }
    },
    destroyed () {
        // 销毁监听
        this.socket.onclose = this.close
    }
```

