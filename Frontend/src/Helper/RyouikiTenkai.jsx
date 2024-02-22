
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