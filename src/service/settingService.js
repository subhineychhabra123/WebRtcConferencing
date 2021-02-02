import { getDataAction, postDataAction } from './dataAction';
import { SETTING, URLS } from '../const/urls';
import toast from '../component/common/toast';
import createAction from './createAction';
import setting from '../setting/index';

const ENDPOINT = setting.load().apiUrl;

const getSettings = (userId) => {
  const params = { userId };
  const url = ENDPOINT + `${URLS.GET_SETTINGS}`;
  return (dispatch) =>
    getDataAction(url, params)
      .then((res) => {
        if (res.data) {
          dispatch(createAction(SETTING.GET_SETTING, res.data));
        }

        return res;
      })
      .catch((err) => {
        toast(err, 'error');
      });
};

const saveUpdateSettings = (settings) => {
  const url = ENDPOINT + `${URLS.UPSERT_SETTINGS}`;
  return (dispatch) =>
    postDataAction(url, settings)
      .then((res) => {
        if (res.data) {
          dispatch(createAction(SETTING.UPSERT_SETTING, res.data));
          toast('Setting updated successfully', 'success');
        }

        return res;
      })
      .catch((err) => {
        toast(err, 'error');
      });
};

export { getSettings, saveUpdateSettings };
