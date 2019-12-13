import React from 'react';
import PropTypes from 'prop-types';

const EditableField = ({ className, displayValue, edit = false, error, name, onChange, options, type = 'text', value }) => {
  if (edit) {
    if (type === 'select') {
      return (
        <div className={`form-group ${className}`}>
          <select className="form-control" name={name} value={value || 'default'} onChange={onChange}>
            <option value="default" disabled>Select an Option</option>
            {options}
          </select>
        </div>
      );
    }

    return (
      <div className={`form-group ${className}`}>
        <input className="form-control" name={name} onChange={onChange} type={type} value={value} />
        <div className="text-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className={className}>{displayValue || value || <span className="text-danger">Not Set</span>}</div>
  );
};

EditableField.propTypes = {
  className: PropTypes.string,
  displayValue: PropTypes.string,
  edit: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array,
  type: PropTypes.oneOf(['date', 'email', 'number', 'password', 'select', 'tel', 'text']).isRequired
};

EditableField.defaultProps = {
  className: '',
  displayValue: '',
  edit: false,
  type: 'text'
};

export default EditableField;
