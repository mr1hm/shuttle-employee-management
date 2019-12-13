"use strict";
import React from 'react';

const DEFAULT_ALIGN = 'center';

function Table(props){
    const { order, headers, content } = props;

    return (
        <table className='table table-striped'>
            <thead>
                <tr>
                    {order.map(key => {
                        const { title } = headers[key];
                        const align = headers[key].align || DEFAULT_ALIGN;
                        return (
                            <th key className={`text-${align}`}>{title}</th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
                {
                    !Array.isArray(content)
                    ? (<h2>Loading Table...</h2>)
                    : content.length === 0
                    ? (<h2>No Data Available</h2>)
                    : (
                        content.map((rowContent, rowIndex) => (
                            <tr key={`row-${rowIndex}`}>
                                {order.map(key => {
                                    const align = headers[key].align || DEFAULT_ALIGN;
                                    const cellContent = rowContent[key];
                                    return (
                                        <td key={`${key}-${rowIndex}`} className={`text-${align}`}>{cellContent}</td>
                                    );
                                })}
                            </tr>
                        ))
                    )
                }
            </tbody>
        </table>
    );
}

export default Table;
