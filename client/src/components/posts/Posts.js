import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PostForm from './PostForm';
import PostFeed from './PostFeed';
import { getPosts } from '../../actions/postActions';
import { Loading } from '../common/Loading';


class Posts extends Component {

  componentDidMount() {
    this.props.getPosts();
  }

  render(){
    const { posts, loading } = this.props.post;

    let postItems;

    if(posts === null || loading){
      postItems = <Loading />
    } else {
      postItems = <PostFeed posts={posts} />
    }

    return(
      <div className='feed'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <PostForm />
              {postItems}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post
});


export default connect(mapStateToProps, { getPosts })(Posts);
