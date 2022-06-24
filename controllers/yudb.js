const fs = require("fs");
const { execSync } = require("child_process");

let OUTPUT = null;
let DEBUG_INFO = null;
let PTR = 0;

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
    command = "yamini tmp -d";
    OUTPUT = execSync(command).toString();

    return res.send(JSON.stringify({
        "icon": "success",
        "title": "Success",
        "text": "Debugging information generated successfully!",
        "url": "/debug",
    }));
};

exports.getDebug = (req, res, next) => {
    res.render('debug', { 
       docTitle: 'Debug Mode',
       jsFile: "debug.js",
    });
};

readDebuggingInfo = () => {
    try {
        const debugInfo = fs.readFileSync("debug/debugging.json", "utf8");
        return JSON.parse(debugInfo);
    } catch (err) {
        return {
            "icon": "error",
            "title": "Error",
            "text": err,
        };
    }
}

exports.postRunDebug = (req, res, next) => {
    const result = readDebuggingInfo();

    if (res.icon == "error") {
        return res.send(JSON.stringify(result));
    }

    DEBUG_INFO = result;
    let currentDebuggingDict = DEBUG_INFO[PTR];

    let code = "<pre>";

    let i = 0;
    for (debugDict of DEBUG_INFO) {
        if (i == currentDebuggingDict.pc) {
            code += "<span style='background-color: black; color: white'>" + debugDict.instruction + "</span><br>";
        } else {
            code += debugDict.instruction + "<br>";
        }
        i++;
    }

    code += "</pre>";

    PTR += 1;

    return res.send(JSON.stringify({
        icon: "success",
        title: "Success",
        text: "Loaded debugging information!",
        code: code,
        pc: currentDebuggingDict.pc,
        register: currentDebuggingDict.b_registers,
    }));
}