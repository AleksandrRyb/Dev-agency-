import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCurrentProfile, deleteAccount } from '../../actions/profileActions';
import { Loading } from '../common/Loading';
import ProfileActions from './ProfileActions';
import Experience from './Experience';
import Education from './Education';



class Dashboard extends Component {
 componentDidMount(){
  this.props.getCurrentProfile();

}

onDeleteClick(event){
  if(this.props.deleteAccount()){
    this.setState({ profile: {}})
  }

  }

  render(){
    const { user } = this.props.auth;
    const { loading, profile } = this.props.profile;
    let dashboardContent;

      if(profile === null || loading){
        dashboardContent = <Loading />
      } else {
        //Check if user has profile
        if(Object.keys(profile).length > 0){
          dashboardContent = (
            <div>
              <h4>Welcome <Link to={`profile/${profile.handle}`}>{user.name}</Link></h4>
              <ProfileActions />
              <Experience experience={profile.experience}/>
              <Education education={profile.education}/>
              <div style={{ marginBottom: "60px"}} />
              <button className='btn btn-danger inline-block' onClick={this.onDeleteClick.bind(this)}>Delete My Account</button>
            </div>
          )
        } else {
          dashboardContent = (
            <div>
              <h4>Welcome {user.name}</h4>
              <p>You have not create you profile setup yet</p>
              <Link to='/create-profile' className='btn btn-info btn-lg'>Create Profile </Link>
            </div>
          )
        }
      }

    return (
      <div>
        {dashboardContent}
      </div>
    )
  }
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
})

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(withRouter(Dashboard));
