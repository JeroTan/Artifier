import { Suspense, createContext, useCallback, useContext, useState, useEffect, useMemo, useReducer } from "react";
import Icon from "../../Utilities/Icon";
import { InlineLoading } from "../../Helper/Placholder";
import { useNavigate } from "react-router-dom";
import { ApiGetCategory } from "../../Helper/Api";

const galleryGlobal = {
    listView: "compact",
    filterView: false,
}

const galleryChanger = (state, action)=>{
    const refState = structuredClone(state);
    if(action.run === undefined){
        state[action.key] = action.val;
        return refState;
    }
    
    switch(action.run){
        case 'listCompact':
            refState.listView  = "compact";
        break;
        case 'listWide':
            refState.listView = "wide";
        break;
        case 'toggleFilter':
            refState.filterView = !refState.filterView;
        break;
    }
    return refState;
}

const Gbl_Gallery = createContext();

///>>> MAIN <<<///|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|
export function Gallery(){
    const [thisCast, thisUpcast] = useReducer(galleryChanger, galleryGlobal);

    return <Gbl_Gallery.Provider value={[thisCast, thisUpcast]}>
    <main className="my-5">

        {/** Navigation of list */}
        <nav className="mb-2">
            <ListNavigation />
            <div className="my-2"></div>
            <Filters />
        </nav>

        <hr />


    </main>
    </Gbl_Gallery.Provider>
}
///>>> MAIN <<<///|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|

///>Other Components
function ListNavigation(){
    const [thisCast, thisUpcast] = useContext(Gbl_Gallery);

    const listBtnCls = useCallback((d)=>thisCast.listView==d ? "btn-primary" : "btn-outline-primary", [thisCast.listView]);
    const listBtnClsIcon = useCallback((d)=>thisCast.listView==d ? "my-fill-light" : "my-fill-primary", [thisCast.listView]);

    const filterBtnCls = useMemo(()=>thisCast.filterView?"btn-primary":"btn-outline-primary", [thisCast.filterView]);
    const filterBtnClsIcon = useMemo(()=>thisCast.filterView?"my-fill-light" : "my-fill-primary", [thisCast.filterView]);

    return <>
    <div className="d-flex flex-wrap justify-content-end gap-2">
        <div className="btn-group" role="group" aria-label="Change List View">
            <button className={`btn d-flex  ${listBtnCls("compact")}`} onClick={()=>thisUpcast({run:'listCompact'})} >
                <Icon name="compact_view" outClass="my-w-5 my-h-5" inClass={listBtnClsIcon("compact")} />
            </button>
            <button className={`btn d-flex  ${listBtnCls("wide")}`} onClick={()=>thisUpcast({run:'listWide'})} >
                <Icon name="wide_view" outClass="my-w-5 my-h-5" inClass={listBtnClsIcon("wide")} />
            </button>
        </div>
        <button type="button" className={`btn ${filterBtnCls} p-2`} onClick={ ()=>thisUpcast({run:"toggleFilter"}) }>
            <Icon name="filter" outClass="my-w-5 my-h-5" inClass={filterBtnClsIcon} />
        </button>
        
    </div>
    </>
}

function Filters(){
    const [thisCast, thisUpcast] = useContext(Gbl_Gallery);
    const navigation = useNavigate();

    //>Filter Data
    const [v_category, e_category] = useState([]);

    useEffect(()=>{
        ApiGetCategory().then((d)=>{
            
            e_category(d.data.category.map((e)=>{
                const ref = structuredClone(e);
                ref.checked = false;
                return ref;
            }));
        });
    }, []);

    //>Changer/Updater
    const checkCategory = useCallback((id)=>{
        e_category(prev=>{
            const ref = structuredClone(prev);
            ref.forEach((e, i) => {
                if(e.id == id){
                    e.checked = !e.checked;
                }
            });
            return ref;
        });
    }, [v_category, e_category]);

    //<Changer/Updater
    
    return <>
    <div className={`${thisCast.filterView ? "d-flex" : "d-none"} flex-wrap gap-5 rounded-1 shadow-sm bg-body-tertiary p-3`}>
        <div className="w-100">
            <h4>Category:</h4>
            <Suspense fallback={<InlineLoading rows={3} />}>
                <div className="container">
                    <div className="row">
                    {v_category.map((x, i)=>{
                        return <div key={x.id} className="form-check col">
                            <input className="form-check-input" type="checkbox" id={`categoryCheck${i}`} checked={x.checked} onChange={()=>checkCategory(x.id)} />
                            <label className="form-check-label" htmlFor={`categoryCheck${i}`}>{x.name}</label>
                        </div>
                    })}
                    </div>
                </div>
            </Suspense>
        </div>
        <div>
            <h4>Upload Date:</h4>
            
        </div>
        <div>
            <h4>Modified Date:</h4>
            
        </div>
    </div>
    </>
}
