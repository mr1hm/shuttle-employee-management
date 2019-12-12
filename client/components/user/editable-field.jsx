import React from 'react';
import PropTypes from 'prop-types';

const EditableField = ({ className, displayValue, edit = false, name, onChange, options, type = 'text', value }) => {
  if (edit) {
    if (type === 'select') {
      console.log('Is Array:', Array.isArray(options));
      return (
        <select className={className} name={name} value={value || 'default'} onChange={onChange}>
          <option value="default" disabled>Select an Option</option>
          {options}
        </select>
      );
    }

    return (
      <input className={className} name={name} onChange={onChange} type={type} value={value} />
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
