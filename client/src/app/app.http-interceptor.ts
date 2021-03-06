import { createNetworkInterface } from 'apollo-client';
import * as Cookies from 'js-cookie';
export const httpInterceptor = createNetworkInterface({
  uri: '/graphql'
});

httpInterceptor.use([{
  applyMiddleware(req, next) {
    req.options.headers = !req.options.headers ? {} : req.options.headers;
    req.options.headers.authorization =  `Bearer ${Cookies.get('ow-auth-token')}`;
    next();
  }
}]);
