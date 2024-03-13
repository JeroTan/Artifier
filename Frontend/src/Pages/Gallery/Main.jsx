import { Gbl_Settings } from "../../GlobalSettings";
import { Suspense, createContext, useCallback, useContext, useState, useEffect, useMemo, useReducer, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../../Utilities/Icon";
import { BlockNoData, CardLoading, InlineLoading, TextLoading } from "../../Helper/Placholder";
import { ApiGetCategory, ApiGetCategoryPathTree, ApiGetImage, ApiImageLink, ApiImageThumbLink } from "../../Helper/Api";
import { compareStrings, getCatPathFlat } from "../../Helper/RyouikiTenkai";
import { transformDate } from "../../Helper/Math";

const galleryGlobal = {
    listView: "compact",
    filterView: false,
    filterQuery: undefined,
    f_category: [],
    f_upload: [],
    f_modified: [],
    f_search: "",
    
    categoryList: [],
    categoryTree: false,
    categoryTreeQueue: 0,
    
    sortArrayData: { "title":"ASC" },
    sortQueryData: "title[sort]=ASC",
};

const galleryChanger = (state, action)=>{
    const refState = structuredClone(state);
    if(action.run === undefined){
        state[action.key] = action.val;
        return refState;
    }

    function reOrderSort(criteria){
        const tempNewOrder = refState.sortArrayData[criteria] == "ASC" ? "DESC" : "ASC";
        delete refState.sortArrayData[criteria];

        const newSort = {};
        newSort[criteria] = tempNewOrder;
        Object.keys(refState.sortArrayData).forEach((x,y)=>{
            newSort[x] = refState.sortArrayData[x];
        });
        const newQuerySort = [];
        Object.keys(newSort).forEach((x,y)=>{
            newQuerySort.push(`${x}[sort]=${newSort[x]}`);
        })

        refState.sortArrayData = newSort;
        refState.sortQueryData = newQuerySort.join("&");
    }

    function makeQueryFilter(){
        let query = [];
        if(refState.f_category.length > 0){
            query.push("category_id="+refState.f_category.join(","));
        }
        
        if(refState.f_upload.length > 0){
            query.push( `created_at[${refState.f_upload[0]}]=`+encodeURIComponent(refState.f_upload[1].join(",")) );
        }

        if(refState.f_modified.length > 0){
            query.push( `updated_at[${refState.f_modified[0]}]=`+encodeURIComponent(refState.f_modified[1].join(",")) );
        }

        if(refState.f_search != ""){
            query.push(`search=`+encodeURIComponent(refState.f_search));
        }

        refState.filterQuery = query.length > 0 ? query.join("&") : undefined;
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
            refState.categoryTreeQueue = 0;
        break;
        case 'loadNextCategoryPath':
            refState.categoryTreeQueue+=1;
        break;
        case 'toggleTitleSort':
            reOrderSort("title");
        break;
        case 'update':
            refState.filterQuery = action.val;
        break;
        case 'updateCategoryFilter':
            refState.f_category = action.val;
            makeQueryFilter();
        break;
        case 'updateUploadFilter':
            refState.f_upload = action.val;
            makeQueryFilter();
        break;
        case 'updateModifiedFilter':
            refState.f_modified = action.val;
            makeQueryFilter();
        break;
        case 'updateSearchFilter':
            refState.f_search = action.val;
            makeQueryFilter();
        break;

    }
    return refState;
}

const Gbl_Gallery = createContext();

///>>> MAIN <<<///|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|
export function Gallery(){

    //>Global
    const [GblCast, GblUpcast] = useContext(Gbl_Settings);
    const Search = GblCast.search;

    const [thisCast, thisUpcast] = useReducer(galleryChanger, galleryGlobal);

    useEffect(()=>{
        ApiGetCategoryPathTree().then((d)=>{
            thisUpcast({run:"addCatTree", val:d.data});
        });
    }, []);

    //If search actually exist then update the list into a free flowing list
    useEffect(() => {
        thisUpcast({run:"updateSearchFilter", val:Search});
    }, [Search])
    

    return <Gbl_Gallery.Provider value={[thisCast, thisUpcast]}>
    <main className="my-5">

        {/** Navigation of list */}
        <nav className="mb-2">
            <ListNavigation />
            <div className="my-2"></div>
            <Filters />
        </nav>

        <hr />

        <nav className="mt-2 mb-4">
            <Sorters />
        </nav>

        <main className="">
            {thisCast.filterQuery === undefined ? <>
                {thisCast.categoryTree === false ? <InlineLoading rows={6} /> : (
                    thisCast.categoryTree.length <= 0 ? <> <BlockNoData /> </> : <>
                        {thisCast.categoryTree.map( (x,i)=>{
                            ///Make a loader for this one so that it will load the image one by one
                            return ( i <= thisCast.categoryTreeQueue ? <ImageListContainer 
                                key={x.id} 
                                id={x.id} 
                                categories={x} 
                                sorter={thisCast.sortQueryData} 
                                nextCategory={ ()=>thisUpcast({run:"loadNextCategoryPath"}) } 
                            /> : "")
                        })}
                        {thisCast.categoryTree.length > thisCast.categoryTreeQueue ? <>
                            <TextLoading subtitle="Fetching Resources. . ." />
                        </> : ""}
                    </>
                )}   
            </> : <>
                <ImageListContainerAlternate filterQuery={thisCast.filterQuery} sorter={thisCast.sortQueryData} />
            </>}
             
        </main>

    </main>
    </Gbl_Gallery.Provider>
}
///>>> MAIN <<<///|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|_|

///>Other Components
//-This is for changing the view of list either compact or spread
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
//-Use for changing the filters like selecting what category to use
function Filters(){
    const [thisCast, thisUpcast] = useContext(Gbl_Gallery);
    const navigation = useNavigate();

    //>Filter Data
    const [v_category, e_category] = useState(false);
    const [v_upload, e_upload] = useState({
        start: "",
        end: "",
    });
    const [v_modified, e_modified] = useState({
        start: "",
        end: "",
    });

    useEffect(()=>{//Get the category List
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
    const updateFilter = (e)=>{
        const checkedCategory = v_category.filter(x=>x.checked);
        if(checkedCategory.length > 0){
            const checkedCategoryIdOnly = checkedCategory.map(x=>x.id);
            thisUpcast({run:"updateCategoryFilter", val:checkedCategoryIdOnly});
        }else{
            thisUpcast({run:"updateCategoryFilter", val:[]}); 
        }

        if(v_upload.start && v_upload.end){
            thisUpcast({run:"updateUploadFilter", val:["between", [v_upload.start, v_upload.end]]});
        }else if(v_upload.start){
            thisUpcast({run:"updateUploadFilter", val:["gte", [v_upload.start]]});
        }else if(v_upload.end){
            thisUpcast({run:"updateUploadFilter", val:["lte", [v_upload.end]]});
        }else{
            thisUpcast({run:"updateUploadFilter", val:[]});
        }

        if(v_modified.start && v_modified.end){
            thisUpcast({run:"updateModifiedFilter", val:["between", [v_modified.start, v_modified.end]]});
        }else if(v_modified.start){
            thisUpcast({run:"updateModifiedFilter", val:["gte", [v_modified.start]]});
        }else if(v_modified.end){
            thisUpcast({run:"updateModifiedFilter", val:["lte", [v_modified.end]]});
        }else{
            thisUpcast({run:"updateModifiedFilter", val:[]});
        }
    };

    //<Changer/Updater

    //>Components
    const CategoryComp = useMemo(()=>{
        if(v_category === false)
            return <InlineLoading rows={3} />;
        
        return <>
        <div className="container">
            <div className="row gx-5 gy-3">
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
            <div className="d-flex flex-wrap gap-2">
                <div className="form-floating">
                    <input value={v_upload.start} type="datetime-local" className="form-control" id="uploadFrom" 
                        onInput={(e)=>e_upload(prev=>{
                            const ref = structuredClone(prev);
                            ref.start = e.target.value;
                            return ref;
                        })}
                    />
                    <label htmlFor="floatingInput">From</label>
                </div>
                <div className="form-floating">
                    <input value={v_upload.end} type="datetime-local" className="form-control" id="uploadTo" 
                        onInput={(e)=>e_upload(prev=>{
                            const ref = structuredClone(prev);
                            ref.end = e.target.value;
                            return ref;
                        })}
                    />
                    <label htmlFor="floatingInput">To</label>
                </div>
            </div>
        </div>
        <div>
            <h4>Modified Date:</h4>
            <div className="d-flex flex-wrap gap-2">
                <div className="form-floating">
                    <input value={v_modified.start} type="datetime-local" className="form-control" id="modifiedFrom" 
                        onInput={(e)=>e_modified(prev=>{
                            const ref = structuredClone(prev);
                            ref.start = e.target.value;
                            return ref;
                        })}
                    />
                    <label htmlFor="floatingInput">From</label>
                </div>
                <div className="form-floating">
                    <input value={v_modified.end} type="datetime-local" className="form-control" id="modifiedTo" 
                        onInput={(e)=>e_modified(prev=>{
                            const ref = structuredClone(prev);
                            ref.end = e.target.value;
                            return ref;
                        })}
                    />
                    <label htmlFor="floatingInput">To</label>
                </div>
            </div>
        </div>
        <div className="w-100 d-flex justify-content-end flex-wrap gap-2">
            <button className="btn btn-primary" onClick={updateFilter} >Save</button>
            <button className="btn btn-outline-primary" onClick={ ()=>thisUpcast({run:'closeFilter'}) }  >Cancel</button>
        </div>

    </div>
    </>
}
//-Use to sort the list of items in gallery
function Sorters(){
    //Global
    const [thisCast, thisUpcast] = useContext(Gbl_Gallery);
    const navigation = useNavigate();

    return <>
        <nav>
            <button className="btn btn-sm btn-outline-secondary d-flex align-items-center" onClick={()=>thisUpcast({run:"toggleTitleSort"})}>
                <span className="text-body">Title</span>
                <Icon name={ thisCast.sortArrayData.title == "ASC" ? "up" : "down" } inClass="my-fill-light my-emphasis" outClass="my-w-5 my-h-5" />
            </button>
        </nav>
    </>
}

///Use to List Images with the image cards and category path list itself
function ImageListContainer(option){
    //Above Value
    const Category = option.categories.category;
    const CategoryChild = option.categories.child ?? false;
    const Id = option.id;
    const Sorter = "&"+(option.sorter ?? "");
    const NextCategory = option.nextCategory;
    
    //To Reduce
    const [imgCast, imgUpcast] = useReducer((state, action)=>{//Global data that will be you to select what category is selected
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
    //Use State
    const [ v_imageList, e_imageList ] = useState(false); //Data of Images
    const [ v_fetching, e_fetching ] = useState(false); //Use as state to show a loading thing if image is fetching
    const [ v_lastImageListCount, e_lastImageListCount ] = useState(1); //Use to make a placeholder of image list base on the last image list
    const [ c_loadMore, s_loadMore ]= useState(null);

    //<Componets
    const ButtonIsSelectedColor = useMemo(()=>{
        return imgCast.selectedTree == Category.id ?"btn-primary":"btn-outline-primary";
    }, [imgCast.selectedTree]);

    useEffect(()=>{
        let query = "?";
        if(imgCast.selectedFlatList.length > 0)
            query = query+"category_path_id="+imgCast.selectedFlatList.join(',')+Sorter;
        
        if(!v_fetching){
            e_fetching(true);
            ApiGetImage(query).then((d)=>{
                sessionStorage.setItem('cachedImage_'+Id, JSON.stringify(d.data.data));
                e_imageList(d.data.data);
                e_lastImageListCount(d.data.data.length > 0 ? d.data.data.length%3 : 1);
                s_loadMore(d.data.meta.next_cursor);
                e_fetching(false);
                NextCategory();//This is only available at initial load of this container
            });
        }
    }, [imgCast.selectedFlatList, Sorter]);

    const fetchMore = useCallback(()=>{
        let query = "?";
        if(imgCast.selectedFlatList.length > 0)
            query = query+"category_path_id="+imgCast.selectedFlatList.join(',')+Sorter+"&cursor="+c_loadMore;

        if(!v_fetching){
            e_fetching(true);
            ApiGetImage(query).then((d)=>{
                let cachedImage = sessionStorage.getItem('cachedImage_'+Id);
                cachedImage = JSON.parse(cachedImage);
                cachedImage = [...cachedImage, ...d.data.data];
                e_imageList(cachedImage);
                e_lastImageListCount(cachedImage.length>0 ? cachedImage.length%3 : 1);
                sessionStorage.setItem('cachedImage_'+Id, JSON.stringify(cachedImage));
                s_loadMore(d.data.meta.next_cursor);
                e_fetching(false);
            });
        }
        
    }, [imgCast.selectedFlatList, Sorter, c_loadMore, v_fetching]);
    

    return <>
    <section className="mb-5">
        {/** Category Container */}
        <div className="d-flex flex-wrap gap-2">
            <div className="">
                <button className={`btn ${ButtonIsSelectedColor}`} onClick={()=>{
                    imgUpcast( {run:'selectCat', val:Category.id} );
                    imgUpcast( {run:'selectCatFlats', val:getCatPathFlat([option.categories])} );
                }}>{Category.name}</button>
            </div>
            {CategoryChild ? <CategoryContainer categories={CategoryChild} caster={[imgCast, imgUpcast]}  /> : ""  }
        </div>
        {/** Image Container */}
        <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
            { v_imageList === false ? <></> : 
                ( v_imageList.length <= 0 ? <>
                    <div className="w-100">
                        <BlockNoData title="Nothing To See Here Yet" message="Maybe add more images in this category." />    
                    </div>
                </> : v_imageList.map((x)=>{
                    return <ImageCardContainer key={x.id} data={x} />
                }) )
            }
            { v_fetching ? [...Array(v_lastImageListCount)].map((x,i)=><CardLoading key={i} />) : <></>}
            {/** For Mainting Center Start */}
            <div style={{width: "18rem"}}></div>
            <div style={{width: "18rem"}}></div>
            <div style={{width: "18rem"}}></div>
            <div style={{width: "18rem"}}></div>
            <div style={{width: "18rem"}}></div>
        </div>
        <div className="d-flex justify-content-center">
            {c_loadMore === null ?<></>:<>
                <button className="btn btn-outline-primary" onClick={fetchMore}>Load More</button>
            </>}
        </div>
    </section>
    </> 
}

//Use To list Image alternatively when there is a fitler used
function ImageListContainerAlternate(option){
    //Above Data
    const FilterQuery = (option.filterQuery?? false) ? "&"+option.filterQuery : "" ;
    const Sorter = (option.sorter ?? false) ? "&"+option.sorter : "";

    const [ v_imageList, e_imageList ] = useState(false); //Data of Images
    const [ v_fetching, e_fetching ] = useState(false); //Use as state to show a loading thing if image is fetching
    const [ v_lastImageListCount, e_lastImageListCount ] = useState(1); //Use to make a placeholder of image list base on the last image list
    const [ c_loadMore, s_loadMore ]= useState(null); //Use to Identify if there still image left to load;

    //Fetch the Image Hear
    useEffect(()=>{
        const query = "?"+FilterQuery+Sorter;
        
        if(!v_fetching){
            e_fetching(true);
            ApiGetImage(query).then((d)=>{
                e_imageList(d.data.data);
                e_lastImageListCount(d.data.data.length > 0 ? d.data.data.length%3 : 1);
                e_fetching(false);
                sessionStorage.setItem('cachedImage_filtered', JSON.stringify(d.data.data));
                s_loadMore(d.data.meta.next_cursor);
            })
        }
    }, [ FilterQuery, Sorter]);

    const fetchMore = useCallback(()=>{
        const query = "?"+FilterQuery+Sorter+"&cursor="+c_loadMore;
        if(!v_fetching){
            e_fetching(true);
            ApiGetImage(query).then((d)=>{
                let cachedImage = sessionStorage.getItem('cachedImage_filtered');
                cachedImage = JSON.parse(cachedImage);
                cachedImage = [...cachedImage, ...d.data.data];
                e_imageList(cachedImage);
                e_lastImageListCount(cachedImage.length>0 ? cachedImage.length%3 : 1);
                sessionStorage.setItem('cachedImage_filtered', JSON.stringify(cachedImage));
                s_loadMore(d.data.meta.next_cursor);
                e_fetching(false);
            });
        }
        
    }, [ FilterQuery, Sorter, c_loadMore, v_fetching ]);

    return <>
    <section className="mb-5">
        {/** Image Container */}
        <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
            { v_imageList === false ? <></> : 
                ( v_imageList.length <= 0 ? <>
                    <div className="w-100">
                        <BlockNoData title="Nothing To See Here Yet" message="Maybe add more images in this category." />    
                    </div>
                </> : v_imageList.map((x)=>{
                    return <ImageCardContainer key={x.id} data={x} />
                }) )
            }
            { v_fetching ? [...Array(v_lastImageListCount)].map((x,i)=><CardLoading key={i} />) : <></>}
                {/** For Mainting Center Start */}
                <div style={{width: "18rem"}}></div>
                <div style={{width: "18rem"}}></div>
                <div style={{width: "18rem"}}></div>
                <div style={{width: "18rem"}}></div>
                <div style={{width: "18rem"}}></div>
        </div>
        <div className="d-flex justify-content-center">
            {c_loadMore === null ?<></>:<>
                <button className="btn btn-outline-primary" onClick={fetchMore}>Load More</button>
            </>}
        </div>
    </section>
    </>
}

//This will hold a recursive function to iterate the its neighboring tree of category buttons
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
        const buttonColorBootstrap = ImgCast.selectedTree == pathData.id ? "btn-secondary" : "btn-outline-secondary"; ////THE ERROR IS HERE
        const revampStyle = ImgCast.selectedTree == pathData.id ? {backgroundColor: catData.color, borderColor: catData.color} : { borderColor: catData.color };
        return <button className={`btn ${buttonColorBootstrap}`} type="button" onClick={()=>{
            s_spreadTree(prev=>!prev);
            ImgUpcast({run:'selectCat',val:pathData.id});
            ImgUpcast({run:'selectCatFlats', val:getCatPathFlat([pathData])});
        }} style={revampStyle}><span className={`my-emphasis text-light`} >{catData.name}</span></button>
    }, [c_selectedIndex, c_spreadTree, s_spreadTree, ImgCast, ImgUpcast]);

    return <>
        <div className="d-flex">
            <span className="fw-lighter h3 p-0 m-0">\</span>
        </div>
        <div className="">
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
        return <>
            <h4 className="text-break word-wrap">{Title}</h4>
            <small className="mb-0 ">Uploaded: <span className="text-secondary">{transformDate(Uploaded)}</span> </small>
        </>
    }, [thisCast.listView, Title]);
    
    return <Link className="card overflow-hidden" aria-hidden="true" style={cardStyle} to={`view_image/${Id}`}>
        <div className={`position-relative ${insideContainer} w-100 h-100`}>
            <div className={`position-relative ${imageClass1} overflow-hidden my-pointer`}  style={{aspectRatio: "1/1"}} onClick={()=>navigation(`view_image/${Id}`)} >
                <img src={ApiImageThumbLink(Image)} className="w-100 h-100 position-relative object-fit-cover bg-secondary" style={{objectPosition: "top center", minHeight: "200px"}} alt={`imageOf${Title}`}></img>
            </div>
            
            <div className="p-2 ">
                {content}
            </div>
        </div>
    </Link>
}