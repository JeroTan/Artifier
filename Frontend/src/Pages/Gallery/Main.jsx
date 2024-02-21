import { Suspense, createContext, useCallback, useContext, useState, useEffect, useMemo, useReducer, Fragment } from "react";
import Icon from "../../Utilities/Icon";
import { BlockNoData, CardLoading, InlineLoading } from "../../Helper/Placholder";
import { useNavigate } from "react-router-dom";
import { ApiGetCategory, ApiGetCategoryPathTree, ApiGetImage } from "../../Helper/Api";
import { Gbl_Settings } from "../../GlobalSettings";
import { getCatPathFlat } from "../../Helper/RyouikiTenkai";

const galleryGlobal = {
    listView: "compact",
    filterView: false,
    filterQuery: '?',
    categoryList: [],
    categoryTree: false,
    cachedImage: '',
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
        case 'closeFilter':
            refState.filterView = false;
        break;
        case 'addCatTree':
            refState.categoryTree = action.val;
        break;
    }
    return refState;
}

const Gbl_Gallery = createContext();

///>>> MAIN <<<///|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|
export function Gallery(){
    const [thisCast, thisUpcast] = useReducer(galleryChanger, galleryGlobal);

    useEffect(()=>{
        ApiGetCategoryPathTree().then((d)=>{
            thisUpcast({run:"addCatTree", val:d.data});
        });
    }, []);

    return <Gbl_Gallery.Provider value={[thisCast, thisUpcast]}>
    <main className="my-5">

        {/** Navigation of list */}
        <nav className="mb-2">
            <ListNavigation />
            <div className="my-2"></div>
            <Filters />
        </nav>

        <hr />

        <main>
            {thisCast.categoryTree === false ? <InlineLoading rows={6} /> : (
                thisCast.categoryTree.length <= 0 ? <> <BlockNoData /> </> : (
                    thisCast.categoryTree.map( x=>{
                        return <ImageListContainer key={x.id} categories={x} />
                    })
                )
            )}    
        </main>

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
    const [v_category, e_category] = useState(false);

    useEffect(()=>{
        ApiGetCategory().then((d)=>{
            e_category(d.data.map((e)=>{
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

    //>Components
    const CategoryComp = useMemo(()=>{
        if(v_category === false)
            return <InlineLoading rows={3} />;
        
        return <>
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
        </>   
        
    }, [v_category, e_category]);
    //<Components
    
    return <>
    <div className={`${thisCast.filterView ? "d-flex" : "d-none"} flex-wrap my-gap-x-5 my-gap-y-4 rounded-1 shadow-sm bg-body-tertiary p-3`} >
        <div className="w-100">
            <h4>Category:</h4>
            {CategoryComp}
        </div>
        <div>
            <h4>Upload Date:</h4>
            <div className="d-flex gap-2">
                <div className="form-floating">
                    <input type="datetime-local" className="form-control" id="uploadFrom" />
                    <label htmlFor="floatingInput">From</label>
                </div>
                <div className="form-floating">
                    <input type="datetime-local" className="form-control" id="uploadTo" />
                    <label htmlFor="floatingInput">To</label>
                </div>
            </div>
        </div>
        <div>
            <h4>Modified Date:</h4>
            <div className="d-flex gap-2">
                <div className="form-floating">
                    <input type="datetime-local" className="form-control" id="modifiedFrom" />
                    <label htmlFor="floatingInput">From</label>
                </div>
                <div className="form-floating">
                    <input type="datetime-local" className="form-control" id="modifiedTo" />
                    <label htmlFor="floatingInput">To</label>
                </div>
            </div>
        </div>
        <div className="w-100 d-flex justify-content-end flex-wrap gap-2">
            <button className="btn btn-primary" >Save</button>
            <button className="btn btn-outline-primary" onClick={ ()=>thisUpcast({run:'closeFilter'}) }  >Cancel</button>
        </div>

    </div>
    </>
}

function ImageListContainer(option){
    const Category = option.categories.category;
    const CategoryChild = option.categories.child ?? false;
    const [imgCast, imgUpcast] = useReducer((state, action)=>{
        const refState = structuredClone(state);
        if(action.run === undefined){
            state[action.key] = action.val;
            return refState;
        }
        switch(action.run){
            case 'selectCat':
                refState.selectedTree = action.val;
            break;
            case 'selectCatFlats':
                refState.selectedFlatList = action.val;
            break;
        }
        return refState;
    }, {
        selectedTree: Category.id,
        selectedFlatList: getCatPathFlat([option.categories]),
    });
    const [ v_imageList, e_imageList ] = useState(false);
    

    //<Componets
    const ButtonIsSelectedColor = useMemo(()=>{
        return imgCast.selectedTree == Category.id ?"btn-primary":"btn-outline-primary";
    }, [imgCast.selectedTree]);

    useEffect(()=>{
        let query = "?";
        if(imgCast.selectedFlatList.length > 0){
            query = query+"category_path_id[match]="+imgCast.selectedFlatList.join(',');
        }
        ApiGetImage(query).then((d)=>{
            e_imageList(d.data.data);
        })
    }, [imgCast.selectedFlatList]);

    return <>
    <section className="mb-5">
        {/** Category Container */}
        <div className="d-flex flex-wrap gap-2">
            <button className={`btn ${ButtonIsSelectedColor}`} onClick={()=>{
                imgUpcast( {run:'selectCat', val:Category.id} );
                imgUpcast( {run:'selectCatFlats', val:getCatPathFlat([option.categories])} );
            }}>{Category.name}</button>
            {CategoryChild ? <CategoryContainer categories={CategoryChild} caster={[imgCast, imgUpcast]}  /> : ""  }
        </div>
        {/** Image Container */}
        <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
        { v_imageList == false ? <CardLoading />: 
        ( v_imageList.length <= 0 ? <BlockNoData title="Nothing To See Here Yet" message="Maybe add more images in this category." /> : v_imageList.map((x)=>{
            return <ImageCardContainer key={x.id} data={x} />
        }) )
        }
            {/** For Mainting Center Start */}
            <div style={{width: "18rem"}}></div>
            <div style={{width: "18rem"}}></div>
            <div style={{width: "18rem"}}></div>
            <div style={{width: "18rem"}}></div>
            <div style={{width: "18rem"}}></div>
        </div>
    </section>
    </> 
}
function CategoryContainer(option){
    const Categories = option.categories;
    const [ImgCast, ImgUpcast] = option.caster;
    const [c_selectedIndex, s_selectedIndex] = useState(-1); //When Selected id is not in this domain then use index 0 as ref or the pas state
    const [c_spreadTree, s_spreadTree] = useState(false); //For Buttons
    const [GblCast] = useContext(Gbl_Settings);

    useEffect(()=>{
        const certainMagicalIndex = Categories.findIndex(x=>x.id == ImgCast.selectedTree);
        if(certainMagicalIndex != -1){
            s_selectedIndex(certainMagicalIndex);
        }else{
            s_spreadTree(false);
        }
    }, [Categories, ImgCast.selectedTree]);

    //Componet
    const ButtonComp = useCallback((catData, pathData)=>{
        const buttonColorBootstrap = ImgCast.selectedTree == catData.id ? "btn-secondary" : "btn-outline-secondary";
        const revampStyle = ImgCast.selectedTree == catData.id ? {backgroundColor: catData.color, borderColor: catData.color} : { borderColor: catData.color };
        return <button className={`btn ${buttonColorBootstrap}`} type="button" onClick={()=>{
        
            s_spreadTree(prev=>!prev);
            ImgUpcast({run:'selectCat',val:pathData.id});
            ImgUpcast({run:'selectCatFlats', val:getCatPathFlat([pathData])});
        }} style={revampStyle}><span className={`my-emphasis text-light`} >{catData.name}</span></button>
    }, [c_selectedIndex, c_spreadTree, s_spreadTree, ImgCast, ImgUpcast]);

    return <>
        <div className="d-flex align-items-center">
            <span className="fw-lighter h3 p-0 m-0">\</span>
        </div>
        <div className="btn-group-vertical" role="group" aria-label="CategoryTree Buttons">
           
            {  c_spreadTree ? (
                Categories.map((x, i)=>{
                    return <Fragment key={x.id}>
                        {ButtonComp(x.category, x)}
                    </Fragment>
                })
            ) : (
                c_selectedIndex == -1 ? ButtonComp(Categories[0].category, Categories[0]) 
                : ButtonComp(Categories[c_selectedIndex].category, Categories[c_selectedIndex]) 
            )}
        </div>
        { c_selectedIndex == -1 ? "" : <>
            { !Categories[c_selectedIndex]?.child ? "" :<>
                <CategoryContainer categories={Categories[c_selectedIndex].child} caster={[ImgCast, ImgUpcast]}  />
            </> }
        </>
        }
    </>
}
function ImageCardContainer(option){
    const Title = option.data.title;
    const Id = option.data.id;
    const Image = option.data.image;
    const Uploaded = option.data.createdAt;
    const [thisCast, thisUpcast] = useContext(Gbl_Gallery);
    const navigation = useNavigate();

    const cardStyle = useMemo(()=>{
        if(thisCast.listView == "compact")
            return {width: "18rem"}
        return {width: "100%", height:"7rem"}
    }, [thisCast.listView]);
    const imageClass1 = useMemo(()=>{
        if(thisCast.listView == "compact")
            return "w-100"
        return "h-100"
    }, [thisCast.listView]);
    const insideContainer = useMemo(()=>{
        if(thisCast.listView == "compact")
            return ""
        return "d-flex"
    }, [thisCast.listView]);
    const content = useMemo(()=>{
        if(thisCast.listView == "compact")
            return Title;
        const dateMe = new Date(Uploaded);
        return <>
            <h4 className="text-break word-wrap">{Title}</h4>
            <small className="mb-0 ">Uploaded: <span className="text-secondary">{dateMe.getFullYear()}, {dateMe.getMonth()}-{dateMe.getDate()} | {dateMe.getHours()}:{dateMe.getMinutes()}</span> </small>
        </>
    }, [thisCast.listView, Title]);


    return <div className="card overflow-hidden" aria-hidden="true" style={cardStyle}>
        <div className={`position-relative ${insideContainer} w-100 h-100`}>
            <div className={`position-relative ${imageClass1} overflow-hidden my-pointer`}  style={{aspectRatio: "1/1"}}>
                <img src={Image} className="w-100 h-100 position-relative  object-fit-cover" style={{objectPosition: "top center"}} alt={`imageOf${Title}`}></img>
            </div>
            
            <div className="p-2">
                {content}
            </div>
        </div>
    </div>
}