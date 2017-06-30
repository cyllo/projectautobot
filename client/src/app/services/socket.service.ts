import { propEq, prop, pathOr, path } from 'ramda';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Socket, Channel } from 'phoenix-ts';
import { camelizeKeys } from 'humps';

interface SocketMessage {
  <T>(arg: T|any): T|any;
  event: string;
  payload: any;
}

@Injectable()
export class SocketService {
  private _isConnected = false;
  private _socket = new Socket('ws://localhost:4000/socket', {});
  private _channels = {};

  public connect() {
    if (!this._isConnected) {
      this._socket.connect();
      this._isConnected = true;
    }
  }

  public join(channelName: string, params?: any): Observable<SocketMessage> {
    if (this._hasChannelObservable(channelName)) {
      return this._getChannelObservable(channelName);
    }

    this.connect();

    const channel = this._socket.channel(channelName, params);

    const observable = Observable.create((observer) => {
      const oldOnMessage = channel.onMessage.bind(channel);

      channel.onMessage = (event, payload, ref) => {
        console.log(event, camelizeKeys(payload));
        oldOnMessage(event, camelizeKeys(payload), ref);
        observer.next({ event, payload: camelizeKeys(payload) });

        return payload;
      };

      channel.onError((error) => observer.error(error));
      channel.onClose((closeMessage) => observer.complete(closeMessage));

      channel
        .join()
        .receive('ok', (resp) => observer.next({event: 'channel-join', payload: resp}))
        .receive('error', (resp) => observer.error(resp))
        .receive('timeout', () => observer.error('timeout'));

      return () => {
        this.leave(channelName);
      };
    }).share();

    this._channels[channelName] = { channel, observable };

    return observable;
  }

  public leave(channelName: string) {
    const channel: Channel = this._getChannel(channelName);

    Reflect.deleteProperty(this._channels, channelName);

    if (channel && channel.leave) {
      channel.leave();
    }
  }

  public filterEvent(eventName: string) {
    return (observable) => observable
      .filter(propEq('event', eventName))
      .map(prop('payload'));
  }

  public on(channelName: string, eventName: string): Observable<any> {
    if (!this._channels[channelName]) {
      return Observable.throw(`You cannot listen for ${eventName} as channel ${channelName} hasn't been joined`);
    }

    return this._channels[channelName].observable
      .let(this.filterEvent(eventName));
  }

  private _hasChannelObservable(channelName) {
    return !!path([channelName, 'observable'], this._channels);
  }

  private _getChannel(channelName) {
    return this._channels[channelName];
  }

  private _getChannelObservable(channelName) {
    return pathOr(null, [channelName, 'observable'], this._channels);
  }
}
