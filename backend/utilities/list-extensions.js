const path = require("path");
const fs = require("fs");

/**
 * Lists all extensions in a directory (recusively)
 * @param {string} directory_path 
 * @returns {Promise<string[]>}
 */
async function listExtensions(directory_path) {
    let extensions = [...(await listAllExtensions(directory_path))];

    if (extensions.length === 0) { return [ "*" ]; }
    extensions = extensions.map((ext) => ext.length === 0 ? "*" : ext.substring(1)); // Puts * for empty extension and removes leading '.'
    extensions.sort((a, b) => (a).localeCompare(b));

    return extensions;
}

async function listAllExtensions(directory_path) {
    extensions = new Set();

    for (const file of (await fs.promises.readdir(directory_path))) {
        if ([".git"].includes(file)) { continue; }

        const full_path = path.join(directory_path, file);

        if ( (await fs.promises.stat(full_path)).isDirectory() ) {
            extensions = new Set([...extensions, ...(await listAllExtensions(full_path))]);
        }
        else {
            extensions.add( path.extname(file) );
        }
    }

    return extensions;
}


module.exports = {
    listExtensions
}