
export function getCatPathFlat(tree){
    let flats = [];
    tree.forEach(e => {
        flats[flats.length] = e.id;
        if(e?.child){
            flats = flats.concat(getCatPathFlat(e.child));
        }
    });
    return flats;
}

export function getCatPathFlatData(tree){
    let flats = [];
    tree.forEach(e => {
        
        flats[flats.length] = {name:e.category.name, color:e.category.color, id:e.id, category_id:e.category.id};
        if(e?.child){
            flats = flats.concat(getCatPathFlatData(e.child));
        }
    });
    return flats;
}

export function compareStrings(string1, string2){
    if(typeof string1 === 'string')
        string1 =JSON.stringify(string1);
    if(typeof string2 === 'string')
        string2 =JSON.stringify(string2);
    string1 = btoa(string1);
    string2 = btoa(string2);

    if(string1.length != string2.length)
        return false;
    
    if(string1 != string2)
        return false;
    return true;
}