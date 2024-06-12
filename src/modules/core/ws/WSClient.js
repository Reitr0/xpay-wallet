import {Client} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {applicationProperties} from '@src/application.properties';
import ReduxStore from '@modules/redux/ReduxStore';
import {PriceAction} from '@persistence/price/PriceAction';

let client = null;
const connect = async ({header, callback}) => {
    if (client != null) {
        await client.deactivate();
    }
    client = new Client({
        brokerURL: applicationProperties.endpoints.app.wssUrl,
        connectHeaders: header,
        debug: function (str) {
           //console.log(str);
        },
        reconnectDelay: 5000,
    });
    client.webSocketFactory = function () {
        return new SockJS(applicationProperties.endpoints.app.wssUrl);
    };
    client.onConnect = function (frame) {
        subscribe({destination: '/topic/price', callback: onPrice});
        if (callback) {
            callback();
        }
    };
    client.onStompError = function (frame) {
        // Will be invoked in case of error encountered at Broker
        // Bad login/passcode typically will cause an error
        // Complaint brokers will set `message` header with a brief message. Body may contain details.
        // Compliant brokers will terminate the connection after any error
        console.log('Broker reported error: ' + frame.headers.message);
        console.log('Additional details: ' + frame.body);
    };
    try {
        client.activate();
    } catch (e) {
        console.log(e);
    }
};
const activate = () => {
    client.activate();
};
const deactivate = () => {
    client.deactivate();
};
const subscribe = ({destination, callback, header}) => {
    client.subscribe(destination, callback, header);
};

const unsubscribe = id => {
    client.unsubscribe(id);
};
const onPrice = async ({body}) => {
    ReduxStore.dispatch(PriceAction.getPrices(JSON.parse(body)));
};
const WSSClient = {
    connect,
};
export default WSSClient;
