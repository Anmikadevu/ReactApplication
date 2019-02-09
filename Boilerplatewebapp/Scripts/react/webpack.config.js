﻿module.exports = {
    mode: 'development',
    context: __dirname,
    entry: {
        //index: __dirname + '/index.jsx'
        Home: "./index.jsx",
        Customers: "./Customer/Customer.jsx",
        Products: "./Products/Product.jsx",
        Stores: "./Store/Store.jsx",
        Sales: "./Sales/Sales.jsx"
    },
    output:
    {
        path: __dirname + "/dist",
        filename: "[name].bundle.js"
    },
    watch: true,
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"]
                    }
                }
            },
            {
                test: /\.css?$/,
                loaders: [
                    //require.resolve('style-loader'),
                    require.resolve('css-loader'),
                    require.resolve('sass-loader')
                ],
                include: __dirname
            }
        ]
    }
}