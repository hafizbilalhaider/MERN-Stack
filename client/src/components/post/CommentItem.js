import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import Moment from 'react-moment';

import { deleteComment } from '../../actions/post';

const CommentItem = ({
    postId,
    comment: {_id, text, name, avatar, user, date},
    auth,
    deleteComment
}) =>   <div class="post bg-white p-1 my-1">
            <div>
                <Link to={`profile/${user}`}>
                    <img
                        class="round-img"
                        src={avatar}
                        alt=""
                    />
                    <h4>{name}</h4>
                </Link>
            </div>
            <div>
                <p class="my-1">{text}</p>
                <p class="post-date">
                    Posted on <Moment format='YYYY/MM/DD'>{date}</Moment>
                </p>
                {!auth.loading && user === auth.user._id && (
                    <button 
                        onClick={e => deleteComment(postId, _id)} 
                        className="btn btn-danger"
                        type="button"    
                    >
                        <i className="fas fa-times" />
                    </button>
                )}
            </div>
        </div>

CommentItem.propTypes = {
    deleteComment: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    postId: PropTypes.number.isRequired,
    comment: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
})

export default connect(mapStateToProps, {deleteComment})(CommentItem);
