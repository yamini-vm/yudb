exports.getIndex = (req, res, next) => {
    res.render('index', { 
       docTitle: 'Path to ASM file',
       jsFile: "index.js",
    });
};

exports.getDebug = (req, res, next) => {
    res.render('debug', { 
       docTitle: 'Debug Mode',
       jsFile: "debug.js",
    });
};