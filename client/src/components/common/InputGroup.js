import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';



const InputGroup = ({placeholder,value,name,onChange,errors,icon,type}) => {
  return (
    <div className="input-group mb-3">
      <div className='input-group-prepend'>
        <div className='input-group-text'>
          <i className={icon} />
        </div>
      </div>
      <textarea type={type}
             className={classnames("form-control form-control-lg" ,{"is-invalid": errors})}
             placeholder={placeholder}
             name={name}
             onChange={onChange}
             value={value}
      />
      {errors && (<div className="invalid-feedback">{errors}</div>)}
    </div>
  )
}

InputGroup.propsTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.string,
  icon: PropTypes.string,
  type: PropTypes.string.isRequired
}

InputGroup.defaultProps = {
  type: 'text'
}

export default InputGroup ;
