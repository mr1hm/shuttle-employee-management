"use strict";
import React from 'react';

function Table(props){
    const { order, headers, data } = props;

    return (
        <table className='table table-striped'>
            <thead>
                <tr>
                    {order.map(key => (
                        <th key={key} style={headers[key].style}>{headers[key].title}</th>
                    ))}
                </tr>
            </thead>
        </table>
    );
}

export default Table;
