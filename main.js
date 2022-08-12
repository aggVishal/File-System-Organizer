let path = require("path");
let fs = require("fs");

let types = {
    Media: ["mp4", "mkv", 'jpeg', 'png', 'jpg'],
    Archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    Documents: ['docx', 'pptx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex', 'csv', 'json', 'ipynb', 'ps1', 'xlsm', 'postman_collection'],
    App: ['exe', 'dmg', 'pkg', "deb", 'htm', 'html', 'rdp', 'application', 'msi']
}

let input = process.argv.slice(2);

// node main.js tree "dirPath"
// node main.js organize "dirPath"
// node main.js help

let command = input[0];
let dirPath = input[1];

switch (command) {
    case "tree":
        treeFn(dirPath);
        break;

    case "organize":
        organizeFn(dirPath);
        break;

    case "help":
        helpFn();
        break;
    default:
        console.log("Please enter correct command!");
        console.log("");
        break;
}

function treeFn(dirPath) {
    console.log("Tree", dirPath);
}

function organizeFn(dirPath) {
    // 1. Get the directory.
    // 2. Create new directory folder "Organized Files" in same directory.
    // 3. Read all the files from dirPath.
    // 3. Get the category of all the files.
    // 4. Create directories as per the categories of the files and copy paste the files on those respective directories.

    console.log("");
    console.log("Organizing", dirPath, "started...");
    console.log("");
    let destFolder;
    if (dirPath == undefined) {
        console.log("Please enter the directory!");
        console.log("");
        return;
    } else {
        if (!fs.existsSync(dirPath)) {
            console.log("Please enter valid directory!");
            console.log("");
            return;
        } else {
            destFolder = path.join(dirPath, "Organized Files")
            if (!fs.existsSync(destFolder)) {
                fs.mkdirSync(destFolder);
            }
        }
    }
    console.log("New Folder created successfully. Organizing the files in progress...")
    console.log("");

    organizeHelper(dirPath, destFolder);

    console.log("");
    console.log("Organizing", dirPath, "is completed. Congratulations!");
    console.log("");
}

function organizeHelper(src, dest) {
    let files = fs.readdirSync(src);

    for (let i = 0; i < files.length; i++) {
        let fileAddress = path.join(src, files[i]);
        let isFile = fs.lstatSync(fileAddress).isFile();
        if (isFile) {
            let category = getCategory(files[i]);
            let categoryDir = path.join(dest, category);
            let categoryFile = path.join(categoryDir, files[i]);
            if (!fs.existsSync(categoryDir)) {
                fs.mkdirSync(categoryDir);
            }
            fs.copyFileSync(fileAddress, categoryFile);
        }
    }
}

function getCategory(file) {
    let ext = path.extname(file);

    ext = ext.slice(1).toLowerCase();

    for (let type in types) {
        let category = types[type];
        for (let c = 0; c < category.length; c++) {
            if (ext == category[c]) {
                return type;
            }
        }
    }
    return "Others";
}

function helpFn() {
    console.log(`
    Following are the commands:
        node main.js tree "dirPath"
        node main.js organize "dirPath"
        node main.js help    
    `);
}