import React from 'react';
import { Router, Route, Link, browserHistory } from 'react-router';

import {getTopicList} from '../lib/client';

export default class TopicList extends React.Component {

  constructor(pros){
    super(pros);
    this.state = {};
  }

  componentDidMount() {
    this.updateList({
      tags: this.props.location.query.tags,
      pageNo: this.props.location.query.pageNo
    });
  }

  // 参数变化时调用
  componentWillReceiveProps(nextProps) {
    this.updateList({
      tags: nextProps.location.query.tags,
      pageNo: nextProps.location.query.pageNo
    });
  }

  updateList(query) {
    getTopicList(query)
      .then(ret => this.setState(ret))
      .catch(err => console.log(err));
  }

  render() {
    const list = Array.isArray(this.state.list) ? this.state.list : [];

    // 当前的页码
    let pageNo = parseInt(this.state.pageNo, 10);
    if(!(pageNo > 1)) pageNo = 1;

    let prevPage = pageNo - 1;
    if(prevPage < 1) prevPage = 1;

    let nextPage = pageNo + 1;

    return (
      <div>
        <ul className="list-group">
          {list.map((item, i) => {
            return (
              <Link to={`/topic/${item._id}`} className="list-group-item" key={i}>
                {item.title}
                <span className="pull-right">
                  {item.author && item.author.nickname || '佚名'} 发表于 {item.createdAt}
                </span>
              </Link>
            );
          })}
        </ul>
        <nav>
        <ul className="pagination">
          <li>
            <Link to={`/?pageNo=${prevPage}`} aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </Link>
          </li>
          <li>
            <Link to={`/?pageNo=${nextPage}`} aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
    );
  }
}
