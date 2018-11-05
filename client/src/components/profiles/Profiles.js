import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Loading } from '../common/Loading';
import { getProfiles } from '../../actions/profileActions';
import ShowProfiles from './ShowProfiles';


class Profiles extends Component {
  componentDidMount(){
    this.props.getProfiles();
  }


  render(){

    const { profiles,  loading } = this.props.profile;

    let showProfiles;

      if(profiles === null || loading ) {
        showProfiles = <Loading />
      } else {
        if(profiles.length > 0){
          showProfiles = profiles.map(profile => (
            <ShowProfiles key={profile._id} profile={profile} />
          ))
        } else {
          showProfiles = <h4>Profiles not found</h4>
        }
      }

    return(
      <div className='profiles'>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <h1 className='text-center display-4'>Developer Profiles</h1>
              <p className='text-center lead'>Comunicate to developers with us</p>
              {showProfiles}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Profiles.propTypes = {
  profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile
})

export default connect(mapStateToProps, { getProfiles })(Profiles)
