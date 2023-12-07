const input = [
    'spring.jpa.hibernate.ddl.auto=update',
    'spring.datasource.schema=schema-export.sql',
    'spring.datasource.driver-class-name=org.postgresql.Driver',
    'spring.datasource.url=jdbc:postgresql://localhost:5432/DigitalDots',
    'spring.datasource.username=test',
    'spring.datasource.password=test',
    'spring.datasource.hikari.maximum-pool-size=10',
    'spring.datasource.hikari.schema=batch',
    'spring.datasource.name=batchDs',
    'spring.jpa.hibernate.dialect=update',
    'spring.datasource.initialization-mode=always',
    'spring.datasource.hikari.idle-timeout=100000',
    'spring.datasource.hikari.connection-timeout=20000',
    'app.name=abc',
    'app.no-value=',
    'version=V1',
    'spring.datasource.hikari.minimum-pool-size=10',
    'spring.datasource.hikari.maximum-pool-size=10',
    'spring.datasource.hikari.max-life-time=1800000',
    'spring.datasource.hikari.leak-detection-threshold=10000',
    'spring.jpa.open-in-view=false',
    'spring.datasource.hikari.minimum-idle=2',
    'spring.jpa.generate-ddl=true',
    'spring.jpa.show-sql=true',
    'spring.jpa.properties.hibernate.default.schema=batch',
    'spring.batch.initialize-schema=always',
];

const getKeyValues = (property) => {
    const [path, value] = property.split('=');
    const keys = path.split('.');
    const formattedKeys = keys.map((key) => {
        let keys = key.split('-');
        return [keys[0]]
            .concat(
                keys.slice(1).map((key) => `${key[0].toUpperCase()}${key.substring(1)}`)
            )
            .join('');
    });
    return { keys: formattedKeys, value };
};

const fomattedValue = (value) => {
    if (!value) {
        return undefined;
    } else if (!isNaN(value)) {
        return Number(value);
    } else if (['true', 'false'].includes(value)) {
        return Boolean(value);
    } else {
        return value;
    }
};

const formattedOutput = input.reduce((acc, property) => {
    const { keys, value } = getKeyValues(property);

    keys.reduce((nestedAcc, key, index, array) => {
        if (!nestedAcc[key]) {
            nestedAcc[key] = index === array.length - 1 ? fomattedValue(value) : {};
        }
        return nestedAcc[key];
    }, acc);

    return acc;
}, {});

console.log('input-output', formattedOutput);

function transformData(obj, parentKey = '', separator = '.') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        const newKey = parentKey ? `${parentKey}${separator}${key}` : key;
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            return [...acc, ...transformData(value, newKey, separator)];
        } else {
            return [...acc, `${[newKey]}=${value}`];
        }
    }, []);
}

let formattedInput = transformData(formattedOutput);

console.log('output-input', formattedInput);