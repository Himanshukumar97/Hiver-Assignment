import * as actionTypes from './actionTypes';
import _ from 'lodash';
const initialState = {
    getDataState: 'INIT',
    data:[],
    error:'',
    lastPage:false,
    hitsPerQuery:0,
    hitsPerPage:0,
    queryHitted:null
}

const initState = () => {
    return initialState;
}



const getDataLoading = (state) => {
    return {...state, 
        getDataState: 'LOADING'
    } ;
}

const getDataSuccess = (state, action) => {
    let allData = _.cloneDeep(state.data);
    let filteredData ; 
    let allDataObjId = [] ;
    _.forEach(allData, eachData =>{
        allDataObjId.push(eachData.objectID);
    });
    filteredData = action.data.hits.filter(obj =>
        !_.includes(allDataObjId, obj.objectID) ?
          true : false
      )

    
    allData = _.concat(allData,filteredData) ; 
    
    allData.forEach((eachData,index)=>{
        if(!eachData['relevancy_score'])
        {
            allData[index]['relevancy_score'] = Number.MIN_SAFE_INTEGER; 
        }
            
    })
    allData.sort(function(a, b) {
        if (a.relevancy_score < b.relevancy_score) return 1;
        else return -1 ;
      });

    let lastPage = false ; 
    if(action.data.hits.length <  action.data.hitsPerPage)
    {
        lastPage = true ; 
    }
    return {...state,
        getDataState: 'SUCCESS',
        data: allData,
        queryHitted:action.query,
        lastPage: lastPage,
        hitsPerQuery:action.data.hits.length,
        hitsPerPage:action.data.hitsPerPage,
        error: null
    }
    
    
};

const getDataError = (state, action) => {
    return {...state,
        getDataState: 'ERROR',
        error: action.error,
    };
};


const reducer = (state = initialState, action) => {
   
    switch (action.type) {

        case actionTypes.INIT_STATE: return initState();
        
        case actionTypes.GET_DATA_LOADING: return getDataLoading(state, action);
        case actionTypes.GET_DATA_SUCCESS: return getDataSuccess(state, action);
        case actionTypes.GET_DATA_ERROR: return getDataError(state, action);
       
        default: return state;
    }
};

export default reducer;