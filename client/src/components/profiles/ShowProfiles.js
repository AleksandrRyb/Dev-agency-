import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import isEmpty from '../../validation/isEmpty';



class ShowProfiles extends Component {
  render(){
    const { profile } = this.props;
    return (
      <div className='card card-body col-8 bg-light mb-3'>
        <div className='row'>
          <div className='col-2'>
            <img src={profile.user.avatar} alt='' className='rounded-circle' />
            <Link to={`/profile/${profile.handle}`} className='btn btn-info mt-5'>View Profile</Link>
          </div>
          <div className='col-8 col-lg-6 col-md-4'>
            <h3>{profile.user.name}</h3>
            <p>{profile.status} {isEmpty(profile.company) ? null : (<span>at {profile.company}</span>)}</p>
            <p>{isEmpty(profile.location) ? null : (<span>at {profile.location}</span>)}</p>

          </div>
            <div className='col-md-4 d-md-block d-none'>
              <h4>Skill Set</h4>
              <ul className='list-group'>
                {profile.skills.slice(0, 4).map((skill, index) => (
                  <li className='list-group-item' key={index}><i className='fa fa-check pr-1'/>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
    )
  }
}

ShowProfiles.propTypes = {
  profile: PropTypes.object.isRequired
}

export default ShowProfiles;
