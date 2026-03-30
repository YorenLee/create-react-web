import React, { useState, Suspense, useEffect } from 'react';
import jsCookie from 'js-cookie';
import { AppRoutes } from './router/routes';
import axios from '@service/Axios';
import { BrowserRouter } from 'react-router-dom';

import RichRoute from '@router/rich-route';
const APP = () => {
    return (
        <BrowserRouter>
            <RichRoute route={AppRoutes}></RichRoute>
        </BrowserRouter>
    );
};
export default APP;
