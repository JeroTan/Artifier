
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