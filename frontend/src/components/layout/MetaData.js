/*Helment package is imported here and title for each and every page is set here*/

import React from 'react'
import {Helmet} from 'react-helmet'

const MetaData = ({ title }) => {
    return (
        <Helmet>
            <title>{`${title} - ShopIT`}</title>
        </Helmet>
    )
}

export default MetaData
