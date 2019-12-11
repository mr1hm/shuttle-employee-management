import React from 'react';
import PropTypes from 'prop-types';

const EditableField = ({ edit = false, onChange, type = 'text', value }) => {
  if (edit) {
    return (
      <div>{value}</div>
    );
  }

  return (
    <input type={type} onChange={onChange} value={value} />
  );
};

EditableField.propTypes = {
  edit: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['date', 'email', 'number', 'password', 'tel', 'text']).isRequired
};

EditableField.defaultProps = {
  edit: false,
  type: 'text'
};

export default EditableField;
