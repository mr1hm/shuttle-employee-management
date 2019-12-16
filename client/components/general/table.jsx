"use strict";
import React from 'react';

const DEFAULT_ALIGN = 'center';

function Table(props){
    const { colOrder, columns, content } = props;

    return (
        <>
            <table className='table table-striped'>
                <thead>
                    <tr>
                        {colOrder.map(key => {
                            const { title } = columns[key];
                            const horizontalAlign = columns[key].align || DEFAULT_ALIGN;
                            const verticalAlign = 'bottom';
                            return (
                                <th key={key} className={`text-${horizontalAlign} align-${verticalAlign}`}>{title}</th>
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
                                    {colOrder.map(key => {
                                        const horizontalAlign = columns[key].align || DEFAULT_ALIGN;
                                        const verticalAlign = 'middle';
                                        const cellContent = rowContent[key];
                                        return (
                                            <td key={`${key}-${rowIndex}`} className={`text-${horizontalAlign} align-${verticalAlign}`}>{cellContent}</td>
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
