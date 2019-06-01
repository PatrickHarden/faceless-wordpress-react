import * as types from './action-types';

export const appInit = (data) => {
    return {
        type: types.APP_INIT,
        data
    };
}