/*Makes an API call to the server and lists the N number of products*/

import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Pagination from 'react-js-pagination';
import {useAlert} from 'react-alert';

import MetaData from './layout/MetaData';
import Loader from './layout/Loader';
import Product from './product/Product';

import { clearErrors, getProducts } from '../actions/productsAction';


const Home = ( {match} ) => {

    const [currentPage, setCurrentPage] = useState(1);

    const dispatch = useDispatch();
    const { loading, products, error, productsCount, resPerPage } = useSelector(state => state.products);//similar to mapStateToProps
    
    const alert = useAlert();
    const  keyword = match.params.keyword;

    useEffect(() => {
        if(error){
            alert.error(error);
            return () => {
                dispatch(clearErrors());
            }
        }
        dispatch(getProducts(keyword, currentPage));
    }, [dispatch, alert, error, keyword, currentPage] )

    const setCurrentPageNo = (pageNumber) => {
        setCurrentPage(pageNumber);
    }

    return (
        <Fragment>
            {loading ? <Loader/> : (
                <Fragment>
                    <MetaData title="Buy Best Products Online" />
                    <h1 id="products_heading">Latest Products</h1>

                    <section id="products" className="container mt-5">
                        <div className="row">

                            {/* loops through all the products and prints the result */}

                            {products && products.map(product => {
                                return <Product key={product._id} product={product} />
                            })}


                        </div>
                    </section>
                    <div className="d-flex justify-content-center mt-5">
                            <Pagination 
                                activePage={currentPage} 
                                itemsCountPerPage = {resPerPage}
                                totalItemsCount = {productsCount}
                                onChange = {setCurrentPageNo}
                                nextPageText = {'Next'}
                                PrevPageText = {'Previous'}
                                lastPageText = {'Last'}
                                firstPageText = {'First'}
                                itemClass="page-item"
                                linkClass="page-link"/>
                    </div>
                </Fragment>
            )}

        </Fragment>
    )
}

export default Home
