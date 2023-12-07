
const fs = require('node:fs');

let data;
try {
    data = fs.readFileSync('../../Public/Local-Prakash/Tasks/weekassesments/application.properties', 'utf8');
} catch (err) {
    console.error(err);
}

let output;

if (data) {
    output = convertPropertiesToJson(data);
    console.log(JSON.stringify(output, null, 2));
}

function convertPropertiesToJson(store) {
    const lines = store.split('\n');
    const output = [];

    let currentObj = {};
    lines.forEach(line => {
        let property = line.split('=');
        let key = property[0];
        let value = property[1];
        if (key) {
            let keyArr = key.split(".");
            let temp = currentObj;

            keyArr.forEach((itemKey, itemKeyIdx) => {
                if (itemKey.includes('-')) {
                    itemKey = hyphenToCamelCase(itemKey);
                }
                if (itemKeyIdx === keyArr.length - 1) {
                    if (!isNaN(value)) {
                        temp[itemKey] = value ? Number(value) : value;
                    } else if (["true", "false"].indexOf(value) >= 0) {
                        temp[itemKey] = (value.toLowerCase() === "true");
                    } else {
                        temp[itemKey] = value;
                    }
                } else {
                    temp[itemKey] = temp[itemKey] || {};
                    temp = temp[itemKey];
                }
            })
        } else {
            Object.keys(currentObj).forEach(key => {
                output.push({ [key]: currentObj[key] })
            })
        }
    });

    return output;
}

function hyphenToCamelCase(input) {
    let words = input.split('-');
    let camelWords = [words[0]].concat(words.slice(1).map(item => (item.substr(0, 1).toUpperCase()) + (item.substr(1)))).join('');
    return camelWords;
}


let cloneOutput = JSON.parse(JSON.stringify(output));

const store = [];

cloneOutput.forEach(obj => {
    convertObjectToPath(obj, "", store)
})

function convertObjectToPath(value, opPath, storeOp) {
    if (!Array.isArray(value) && typeof value === 'object') {
        Object.keys(value).forEach(valueItem => {
            console.log(valueItem, typeof value[valueItem])
            if (['string', 'number', 'boolean'].indexOf(typeof value[valueItem]) >= 0) {
                storeOp.push(opPath + '.' + valueItem + "=" + value[valueItem])
            } else {
                convertObjectToPath(value[valueItem], opPath + '.' + valueItem, storeOp)
            }
        })
    }
}

let finalOp = store.map(item => (item.substr(1)));

console.log("finalOp", finalOp)
