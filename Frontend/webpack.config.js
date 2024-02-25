const path = require("path");                           //From Node JS use to define the path compatible to all version
const webpack = require("webpack");                     //From webpack installed using node npm

module.exports = {
	entry: "./src/index.jsx",                           //Where your js files located and where the files should get to bundled it

  	mode: "development",                                //Development or production, So you don't to add "npm run dev"(vite) --mode development(webpack) or build in the cli

	module: {                                           //Use to define the transformer of the files or which files to transform
        rules: [                                        
            {
                test: /\.(js|jsx)$/,                        //Test is the regex to check what files to add
                exclude: /(node_modules|bower_components|dist)/, //What file or folders to exclude
                loader: "babel-loader",                     //Tranformer or transcriber of file need to use specifically
                options: { presets: ["@babel/env"] }        //IDk this one just add it or its like another layer of layer to specifically transform stuff
            },
            {
                test: /\.(css|scss|sass)$/,                         //Same but with css and be sure to add a css loader
                exclude: /(dist)/,
                use: [{loader:"style-loader"}, {loader:"css-loader"},{
                    loader: 'postcss-loader',
                    options: {
                        postcssOptions: {
                            plugins: () => [
                            require('autoprefixer')
                            ]
                        }
                    }
                },
                {
                    loader: 'sass-loader'
                }] 
            },
            {
                test: /\.(png|jpg|gif|ico|svg)$/i,          // For files
                exclude: /(node_modules|bower_components|dist)/,
                use: [
                    {
                    loader: 'file-loader',
                    },
                ],
            },
       ]
    },
    resolve: { extensions: [".js", ".jsx"] },      // When importing so you do not need to add react.js or index.js i mean extensions like .js .jsx

    output: {                                           // Where to put the bundled file after all your works
        path: path.resolve(__dirname, "dist/"),         // This is where they use path chu chu to resolve the path
        publicPath: "/dist/",                           // Tell where all the files will go well literall same as above idk
        filename: "bundle.js",
        // mimetype: 'application/javascript'
    },

    devServer: {
        static:{
            directory: path.join(__dirname, "public/"),  //Where to locate the index file incase we need to 
        },
        port: 8001,
        server: 'http',
        liveReload: true,
        historyApiFallback: true, //To allow self-routing on development
    },
};