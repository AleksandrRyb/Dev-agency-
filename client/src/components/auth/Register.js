import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';
import InputTextField from '../common/InputTextField';

class Register extends Component {
  constructor(){
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      password2: '',
      errors: {}
    }

    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)

  }

  componentWillReceiveProps(nextProps){
    if(nextProps.errors){
      this.setState({ errors: nextProps.errors })
    }
  }

  onChange(event){
    this.setState({[event.target.name]: event.target.value})
  }

  onSubmit(event){
    event.preventDefault()

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    }
    

    this.props.registerUser(newUser, this.props.history)


  }

  render(){

    const { errors } = this.state;
    const { user } = this.props.auth;

    return(
      <div className="register">
        <div className="container">
        {user ? user.name :  null }
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">Create your DevConnector account</p>
              <form onSubmit={this.onSubmit}>
              <InputTextField
                              type='name'
                              placeholder='Name'
                              name='name'
                              onChange={this.onChange}
                              value={this.state.name}
                              errors={errors.name}

              />
              <InputTextField
                              type='email'
                              placeholder='Email address'
                              name='email'
                              onChange={this.onChange}
                              value={this.state.email}
                              errors={errors.email}

              />
              <InputTextField
                              type='password'
                              placeholder='Password'
                              name='password'
                              onChange={this.onChange}
                              value={this.state.password}
                              errors={errors.password}

              />
              <InputTextField
                              type='password'
                              placeholder='Confirm Password'
                              name='password2'
                              onChange={this.onChange}
                              value={this.state.password2}
                              errors={errors.password2}

              />
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
})


export default connect(mapStateToProps, { registerUser })(withRouter(Register));
