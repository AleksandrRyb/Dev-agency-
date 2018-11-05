import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ProfileHeader from './ProfileHeader';
import ProfileGithub from './ProfileGithub';
import ProfileCreds from './ProfileCreds';
import ProfileAbout from './ProfileAbout';
import { Loading } from '../common/Loading';
import { getProfileByHandle } from '../../actions/profileActions';

class Profile extends Component {

componentDidMount(){
  if(this.props.match.params.handle){
    this.props.getProfileByHandle(this.props.match.params.handle)
  }
}

  render(){

    const { loading, profile } = this.props.profile;
    let profileContent;

    if(profile === null || loading){
      profileContent = <Loading />
    } else {
      profileContent = (
        <div>
          <div className='row'>
            <div className='col-md-6'>
              <Link className='btn btn-light mb-3 float-left' to='/profiles'>Back To profiles </Link>
            </div>
            <div className='col-md-6' />
          </div>
          <ProfileHeader profile={profile}/>
          <ProfileAbout profile={profile}/>
          <ProfileCreds education={profile.education} experience={profile.experience}/>
          <ProfileGithub />
        </div>
      )
    }

    return (
      <div>
        {profileContent}
      </div>
    )
  }
}

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  getProfileByHandle: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile
})

export default connect(mapStateToProps, { getProfileByHandle})(Profile)
