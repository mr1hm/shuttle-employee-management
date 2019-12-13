"use strict";
import React from 'react';

const DEFAULT_ALIGN = 'center';

function Table(props){
    const { order, headers, data } = props;

    return (
        <table className='table table-striped'>
            <thead>
                <tr>
                    {order.map(key => {
                        const { title } = headers[key];
                        const align = headers[key].align || DEFAULT_ALIGN;
                        return (
                            <th key={key} className={`text-${align}`}>{title}</th>
                        );
                    })}
                </tr>
            </thead>
        </table>
    );
}

export default Table;
