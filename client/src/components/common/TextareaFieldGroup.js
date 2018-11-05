import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';



const TextareaFieldGroup = ({placeholder,value,name,onChange,errors,info,disabled}) => {
  return (
    <div className="form-group">
      <textarea
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

TextareaFieldGroup.propsTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.string,
  info: PropTypes.string
}


export default TextareaFieldGroup ;
