import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CommentItem from './CommentItem';



class CommentFeed extends Component {
  render(){
    const { postId, comments } = this.props;
    return comments.map(comment => (
      <CommentItem key={comment._id} postId={postId} comment={comment} />)
    )
  }
}

CommentFeed.propTypes = {
  postId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired
}

export default CommentFeed;
