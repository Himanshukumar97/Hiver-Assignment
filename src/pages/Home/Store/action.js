import * as actionTypes from './actionTypes';
import axios from 'axios';

export const initState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.INIT_STATE
        })
    };
};


export const getData = (query,page) => (dispatch,state) => {
    dispatch({
        type: actionTypes.GET_DATA_LOADING,
      });
      let url = "http://hn.algolia.com/api/v1/search?query=" + query + "&page=" + page;
      axios.get(url)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            dispatch({
              type: actionTypes.GET_DATA_SUCCESS,
              data: response.data,
              query:query
            });
          }
        })
        .catch((error) => {
          let errMsg = error;
          
          dispatch({
            type: actionTypes.GET_DATA_ERROR,
            error: errMsg,
          });
        });
};
