require('@babel/register')({ extensions: ['.js', '.jsx', '.ts', '.tsx'] });

require('ignore-styles');

require('./src/server/server');
