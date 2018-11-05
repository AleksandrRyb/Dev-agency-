import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';



const SelectListGroup = ({options,value,name,onChange,errors,info}) => {
  const selectOptions = options.map(option =>(
    <option key={option.label} value={option.value}>
      {option.label}
    </option>
  ))
  return (
    <div className="form-group">
      <select
             className={classnames("form-control form-control-lg" ,{"is-invalid": errors})}
             name={name}
             onChange={onChange}
             value={value}
             >
              {selectOptions}
             </select>
      {info && (<small className='text-muted form-text'>{info}</small>)}
      {errors && (<div className="invalid-feedback">{errors}</div>)}
    </div>
  )
}

SelectListGroup.propsTypes = {
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.string,
  info: PropTypes.string,
  options: PropTypes.array.isRequired
}



export default SelectListGroup;
