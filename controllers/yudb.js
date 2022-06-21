exports.getIndex = (req, res, next) => {
    res.render('index', { 
       docTitle: 'Path to ASM file',
       jsFile: "index.js",
    });
};