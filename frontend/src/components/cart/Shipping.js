import React, { Fragment, useState } from 'react';
import { countries } from 'countries-list';

import MetaData from '../layout/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingInfo } from '../../actions/cartActions';
import CheckoutSteps from './CheckoutSteps';

const Shipping = ({ history }) => {

    const countriesList = Object.values(countries);

    const { shippingInfo } = useSelector(state => state.cart);
    const [address, setAddress] = useState(shippingInfo.address);
    const [city, setCity] = useState(shippingInfo.city);
    const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
    const [country, setCountry] = useState(shippingInfo.country);
    const [state, setState] = useState(shippingInfo.state);

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingInfo({ address, city, phoneNo, postalCode, country, state }));
        history.push('/confirm');
    }
    return (
        <Fragment>
            <MetaData title="Shipping Info" />
            <CheckoutSteps shipping/>
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                <p className="mb-4">Please use US test address for smooth completion of payment</p>
                    <form className="shadow-lg" onSubmit = {submitHandler}>
                        <h1 className="mb-4">Shipping Info</h1>
                        <div className="form-group">
                            <label htmlFor="address_field">Address</label>
                            <input
                                type="text"
                                id="address_field"
                                className="form-control"
                                value={address}
                                required
                                onChange = {(e) => setAddress(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="city_field">City</label>
                            <input
                                type="text"
                                id="city_field"
                                className="form-control"
                                value={city}
                                required
                                onChange = {(e) => setCity(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="state_field">State</label>
                            <input
                                type="text"
                                id="state_field"
                                className="form-control"
                                value={state}
                                required
                                onChange = {(e) => setState(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlhtmlFor="phone_field">Phone No</label>
                            <input
                                type="phone"
                                id="phone_field"
                                className="form-control"
                                value={phoneNo}
                                required
                                onChange = {(e)=>setPhoneNo(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="postal_code_field">Postal Code</label>
                            <input
                                type="number"
                                id="postal_code_field"
                                className="form-control"
                                value={postalCode}
                                required
                                onChange = {(e)=>setPostalCode(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="country_field">Country</label>
                            <select
                                id="country_field"
                                className="form-control"
                                value={country}
                                required
                                onChange={(e)=>setCountry(e.target.value)}
                            >
                                {countriesList.map((country) => (
                                    <option key={country.name}>
                                        {country.name}
                                    </option>
                                ))}


                            </select>
                        </div>

                        <button
                            id="shipping_btn"
                            type="submit"
                            className="btn btn-block py-3"
                        >
                            CONTINUE
                            </button>
                    </form>
                    <p className="mt-4">Please use US test address for smooth completion of payment</p>
                </div>
            </div>
        </Fragment>
    )
}

export default Shipping
