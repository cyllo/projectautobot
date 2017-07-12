import { createNetworkInterface } from 'apollo-client';
import { pathOr } from 'ramda';

export const httpInterceptor = createNetworkInterface({
  uri: '/graphql'
});

httpInterceptor.use([{
  applyMiddleware(req, next) {
    req.options.headers = !req.options.headers ? {} : req.options.headers;
    const session = JSON.parse(window.localStorage.getItem('session'));
    const token = pathOr(null, ['sessionInfo', 'token'], session);
    req.options.headers.authorization =  `Bearer ${token}`;
    next();
  }
}]);
