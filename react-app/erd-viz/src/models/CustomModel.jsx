import * as go from 'gojs';

const generateCustomKey = () => {
    const uuid = 'xxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    return uuid.substring(0, 4);
}
class CustomModel extends go.GraphLinksModel {
    constructor() {
        super({
            linkKeyProperty: 'key',
            copiesKey: false,
            makeUniqueKeyFunction: generateCustomKey
        });
    }
}

export default CustomModel;
