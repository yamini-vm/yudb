const fs = require("fs");
const { execSync } = require("child_process");

let OUTPUT = null;

exports.getIndex = (req, res, next) => {
    res.render('index', { 
       docTitle: 'Path to ASM file',
       jsFile: "index.js",
    });
};

let check_correct_extension = (file_path, extension) => {
    if (!file_path.endsWith("." + extension)) {
        return {
            "icon": "error",
            "title": "Error",
            "text": "File is not a " + extension + " file!",
        };
    }

    return {
        "icon": "success",
    };
}

let check_file_exists = (file_path) => {
    if (!fs.existsSync(file_path)) {
        return {
            "icon": "error",
            "title": "Error",
            "text": "File path does not exist!",
        };
    }

    return {
        "icon": "success",
    };
};

let perform_file_checks = (file_path) => {
    let result;

    result = check_correct_extension(file_path, "yas");
    if (result['icon'] == 'error') {
        return result;
    }

    result = check_file_exists(file_path);
    if (result['icon'] == 'error') {
        return result;
    }

    return {
        "icon": "success",
    }
}

exports.postDebug = (req, res, next) => {
    const file_path = req.body.path;

    const result = perform_file_checks(file_path);
    if (result['icon'] == 'error') {
        return result;
    }

    let command = `yamasm ${file_path} -o tmp`;
    execSync(command);
    command = "yamini tmp";
    OUTPUT = execSync(command).toString();

    return res.send(JSON.stringify({
        "icon": "success",
        "title": "Success",
        "text": "Debugging information generated successfully!",
        "url": "/debug",
    }));
};

exports.getDebug = (req, res, next) => {
    console.log(OUTPUT);

    res.render('debug', { 
       docTitle: 'Debug Mode',
       jsFile: "debug.js",
    });
};