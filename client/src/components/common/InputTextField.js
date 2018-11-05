import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';



const InputTextField = ({type,disabled,label,placeholder,value,name,onChange,errors,info}) => {
  return (
    <div className="form-group">
      <input type={type}
             className={classnames("form-control form-control-lg" ,{"is-invalid": errors})}
             placeholder={placeholder}
             name={name}
             onChange={onChange}
             value={value}
             disabled={disabled}
      />
      {info && (<small className='text-muted form-text'>{info}</small>)}
      {errors && (<div className="invalid-feedback">{errors}</div>)}
    </div>
  )
}

InputTextField.propsTypes = {
  type: PropTypes.string.isRequired,
  disabled: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.string,
  info: PropTypes.string
}

InputTextField.defaultProps = {
  type: 'text'
}

export default InputTextField;
