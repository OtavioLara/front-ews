import { http } from './config';

export default {
    registryAccount: (account) => {
        return http.post('/accounts', account)
    }
}