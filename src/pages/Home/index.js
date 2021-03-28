import React, { Component } from 'react';
import { connect } from 'react-redux';
import searchIcon from './search.png';
import './index.css';
import * as actions from './Store/action';
import cx from 'classnames';
import _ from 'lodash';
class HomePage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      query: '',
      result: [],
      page: 1
    }
    this.debounceTimer = null;
  }

  componentDidMount() {
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data && (this.props.hitsPerQuery === this.props.hitsPerPage || this.props.lastPage === true)) {
      this.searchFilter();
    }
    else if (!_.isEmpty(this.state.query) && !_.isEmpty(this.props.queryHitted) &&
      this.props.queryHitted === this.state.query) {
      if (this.props.data.length > 0 && this.props.hitsPerQuery === this.props.hitsPerPage && this.props.hitsPerPage > 0 && this.state.result.length < 10 && this.props.lastPage === false) {
        console.log("prevState.query ", prevState.query, this.state.query);

        console.log("true ", this.state.page, this.props.hitsPerQuery, this.state.result.length);
        let page = (this.state.page) + 1;
        const debouncer = this.debounceFunction(this.state.query, page, this.callAPI, 1000, true);
        debouncer();
      }
    }
  }

  intersectFunc = (a, b) => {
    return b.filter(function (e) {
      if (a.includes(e))
        return true;
    }).filter(function (e, i, c) { // extra step to remove duplicates
      return c.indexOf(e) === i;
    });

  }
  searchFilter = (query) => {


    let searchArray = [];
    if (_.isEmpty(query))
      query = this.state.query;
    console.log("query search filter", query);

    let thisPar = this;
    let resultArray = _.cloneDeep(this.props.data);
    if (_.isEmpty(query)) {
      searchArray = [];
    }
    else {
      searchArray = resultArray.filter(function (obj) {

        let keys = ['title', 'url', 'author', 'story_text', 'story_title']
        var intersectfunc = thisPar.intersectFunc;

        query = query.toLowerCase();
        let queryArray = query.split(" ");
        for (var objkey in obj) {
          if (obj.hasOwnProperty(objkey) && _.includes(keys, objkey) && !_.isEmpty(obj[objkey])) {
            let intersectedArray = intersectfunc(obj[objkey].toLowerCase(), queryArray);
            if (intersectedArray.length === queryArray.length) {
              return true;
            }

          }
        }

      });

    }

    if (searchArray.length > 10)
      searchArray = searchArray.slice(0, 10);

    this.setState({ result: searchArray });
    return searchArray;

  }

  callAPI = (query, page,changePage) =>{
    if (changePage === true)
      this.setState({ page });

      this.props.getData(query,page);
    
  }
  debounceFunction = (query, page, fn, td, changePage) => {

    let thisPar = this;
    return function () {
      const context = this;
      clearTimeout(thisPar.debounceTimer)
      thisPar.debounceTimer = setTimeout(() => fn.call(context, query, page,changePage), td);
    }

  }


  handleOnInputChange = (event) => {

    const query = event.target.value;
    let page = this.state.page;
    let searchArray = this.searchFilter(query)
    if (searchArray.length < 10) {
      const debouncer = this.debounceFunction(query, page, this.callAPI, 1000);
      debouncer();
    }

    console.log("query input change", query);

    this.setState({ query, page: 1 });


  }
  convertMS = (milliseconds) => {
    let day, hour, minute, seconds, week, month, year, time = "";
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    week = Math.floor(day / 7);
    hour = hour % 24;
    day = day % 7;
    month = Math.floor(day / 30);
    year = Math.floor(day / 365);

    if (year > 0) {
      time += year + ' year';
      if (year > 1)
        time += 's';
      time += ' ago';
    }

    else if (month > 0) {
      time += month + ' month';
      if (month > 1)
        time += 's';
      time += ' ago';
    }
    else if (week > 0) {
      time += week + ' week';
      if (week > 1)
        time += 's';
      time += ' ago';
    }
    else if (day > 0) {
      time += day + ' day';
      if (day > 1)
        time += 's';
      time += ' ago';
    }
    else if (hour > 0) {
      time += hour + ' hour';
      if (hour > 1)
        time += 's';
      time += ' ago';
    }
    else if (minute > 0) {
      time += minute + ' minute';
      if (minute > 1)
        time += 's';
      time += ' ago';
    }
    else if (seconds > 0) {
      time += seconds + ' seconds';
      if (seconds > 1)
        time += 's';
      time += ' ago';
    }
    return time;
  }
  postMessage = (postDate) => {
    let d = new Date();
    let n = d.getMilliseconds();

    let postAgeInMilSec = postDate - n;
    let postAage = this.convertMS(postAgeInMilSec);
    return postAage;

  }
  getText = (text, searchText) => {
    return searchText ? this.getTextWithHighlights(text, searchText) : text;
  }
  getTextWithHighlights = (text, searchText) => {
    searchText = searchText.split(" ");
    searchText.forEach(eachQuery => {
      const regex = new RegExp(eachQuery, 'gi');
      text = text.replaceAll(regex, `<mark class="highlight">$&</mark>`);

    });
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  }

  render() {
    let searchResults = [];
    let result = _.cloneDeep(this.state.result);
    let thisPar = this;
    var t;
    if (result.length > 0) {

      result.forEach(function (item, index) {
        searchResults.push(
          <div key={index} className="padding">

            {item.url || item.title ?
              <div className="subList">

                <span className="spanWithBlack" id={"spanDemo"} key={index} >{item.title ?
                  thisPar.getText(item.title, thisPar.state.query) : null} </span>
                <span className="storyUrl">{item.url ? '(' : null} {item.url ?
                  thisPar.getText(item.url, thisPar.state.query) : null} {item.url ? ')' : null} </span>

              </div>
              :
              null
            }
            {item.author || item.num_comments ?
              <div className="subList">
                {item.author ?
                  <span>
                    Author: {thisPar.getText(item.author, thisPar.state.query)}
                  </span>
                  :
                  null}
                {item.num_comments ?
                  <span>
                    {item.author ? <React.Fragment> | </React.Fragment> : null}
                    comments: {item.num_comments}
                  </span>
                  :
                  null}
                {item.created_at_i ?
                  <span>
                    {item.author || item.num_comments ? <React.Fragment> | </React.Fragment> : null}
                    {thisPar.postMessage(item.created_at_i)}
                  </span>
                  :
                  null}

              </div>
              : null}
            {item.story_text ? <div className="subList spanWithBlack">
              {thisPar.getText(item.story_text, thisPar.state.query)}
            </div> : null}

            <hr className="horizontalLine" />
          </div>
        )
      })
    }

    return (
      <div className="maindiv">
        <h2>
          Search Hacker News
        </h2>
        <div className="dropDown">
          <div className={cx("")} >
            <img src={searchIcon} alt="searchIcon" className="searchIcon" />
            <input className="searchBox"
              id="mySearchInput"
              placeholder="Type here to start searching"
              onKeyUp={(event) => this.handleOnInputChange(event)}
              autoComplete="off"
            />

            {this.props.getDataState === "LOADING" ? <div className="loader"></div> :
              _.isEmpty(this.state.query) || result.length > 0
                ? <div className="itemResults">
                  {searchResults}
                </div>
                : <div className="itemResults"> "NO DATA FOUND WITH THE SEARCH" </div>}
          </div>





        </div>


      </div>
    );
  }

}
const mapStateToProps = state => {
  return {
    data: state.data,
    lastPage: state.lastPage,
    getDataState: state.getDataState,
    hitsPerQuery: state.hitsPerQuery,
    hitsPerPage: state.hitsPerPage,
    queryHitted: state.queryHitted
  };
};



const mapDispatchToProps = dispatch => {
  return {
    getData: (query, page) => dispatch(actions.getData(query, page)),
  };
};

export default (connect(mapStateToProps, mapDispatchToProps)(HomePage));

