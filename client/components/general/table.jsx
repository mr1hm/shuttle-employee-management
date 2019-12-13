"use strict";
import React from 'react';

const DEFAULT_ALIGN = 'center';

function Table(props){
    const { order, headers, content } = props;

    return (
        <>
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
                <tbody>
                    {
                        Array.isArray(content) && content.length > 0
                        ? (
                            content.map((rowContent, rowIndex) => (
                                <tr key={`row-${rowIndex}`}>
                                    {order.map(key => {
                                        const align = headers[key].align || DEFAULT_ALIGN;
                                        const cellContent = rowContent[key];
                                        return (
                                            <td key={`${key}-${rowIndex}`} className={`text-${align} align-middle`}>{cellContent}</td>
                                        );
                                    })}
                                </tr>
                            ))
                        )
                        : null
                    }
                </tbody>
            </table>
            {
                content == null
                ? (<h2>Loading Table...</h2>)
                : !Array.isArray(content)
                ? (<h2>{content || 'No Data Available'}</h2>)
                : content.length === 0
                ? (<h2>{'No Data Available'}</h2>)
                : null
            }
        </>
    );
}

export default Table;
