import { Suspense, createContext, useCallback, useContext, useState, useEffect, useMemo, useReducer, Fragment, useRef } from "react";
import Icon from "../../Utilities/Icon";
import { BlockNoData, CardLoading, ImagePlaceholder, InlineLoading, TextLoading } from "../../Helper/Placholder";
import { useNavigate, useParams } from "react-router-dom";
import { ApiApplyNewCategory, ApiDeleteImage, ApiGetCategory, ApiGetCategoryPathTree, ApiGetImage, ApiGetPathSuggestion, ApiImageLink, ApiUpdateImageData, ApiUploadImageData } from "../../Helper/Api";
import { Gbl_Settings } from "../../GlobalSettings";
import Pageplate from "../../Utilities/Pageplate";
import { transformDate } from "../../Helper/Math";
import { getCatPathFlatData } from "../../Helper/RyouikiTenkai";
import {popDeleteImageWarning, popDeleteProcessing, popImage} from "../../Helper/PopModal";
import { Gbl_Modal } from "../../Modal";
export default (option)=>{
    //Global
    const [ModalCast, ModalUpcast] = useContext(Gbl_Modal);
    const { id } = useParams();
    const [v_data, e_data] = useState(undefined);
    const [c_editMode, s_editMode] = useState(false);
    useEffect(()=>{
        fetchImageData();
    }, []);
    const fetchImageData = useCallback(()=>{
        e_data(undefined);
        ApiGetImage(id).then((d)=>{
            if(d.status == "200"){
                const data = d.data.data;
                e_data({
                    id: data.id,
                    image: ApiImageLink(data.image),
                    title: data.title,
                    description: JSON.parse(data.description),
                    categoryPath: data.categoryPath,
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                });
                s_editMode(false);
            }
        });
    }, [e_data, s_editMode]);
    return <>
    <Pageplate container={true}>
        <main className="card my-5 w-100 shadow-sm">
            <div className="position-relative d-flex overflow-hidden my-pointer">
                {v_data ? <>
                    <img className="position-relative w-100 h-100 object-fit-contain bg-secondary" alt="imageFromGallery" style={{minHeight: "20rem"}} src={v_data.image} onClick={()=>popImage(ModalUpcast, v_data.image)} />
                </> :<>
                    <ImagePlaceholder height={500} />
                </>}
                
            </div>
            {v_data ? <>
                {c_editMode ? <>
                    <EditDescription v_data={v_data} c_editMode={[c_editMode, s_editMode]} fetchData={fetchImageData} />
                </> : <>
                    <DescriptionContainer v_data={v_data} c_editMode={[c_editMode, s_editMode]} />
                </>}
                
            </>: <div className="card-body">
                <InlineLoading rows={10}/>
            </div>}
            
            <div className="card-footer text-body-secondary">
                {v_data ? <>
                    <div className="d-flex flex-wrap gap-5">
                        <small>Uploaded: {transformDate(v_data.createdAt)}</small>
                        <small>Updated: {transformDate(v_data.createdAt)}</small>
                    </div>
                </>: <>
                    <InlineLoading rows={1}/>
                </>}
            </div>
        </main>
    </Pageplate>
    </>
}

function DescriptionContainer(option){
    //AboveComponents
    const v_data = option.v_data;
    const [c_editMode, s_editMode] = option.c_editMode;

    return <>
    <div className="card-body">
            {/** Title plus edit button */}
            <div className="d-flex flex-wrap">
                <h5 className="card-title me-auto">{v_data.title}</h5>
                <button className="btn btn-sm btn-outline-primary d-flex gap-1 align-items-center" onClick={()=>s_editMode(true)}>
                    <Icon name="edit" inClass="my-fill-primary" outClass="my-h-5 my-w-5" />
                    <span>Edit</span>
                </button>
            </div>
            
            {/** Description Field */}
            { v_data.description.map( (x, i)=><p key={i} className="card-text">{x}</p> ) }

            {/**Categories */}
            <ul className="list-group list-group-flush mx-0 mt-4">
                <li className="list-group-item px-0">
                    <h6 className="mb-0 text-body-tertiary">Category</h6>
                </li>
                {v_data.categoryPath.map((x,i)=>{//Map each main parent 
                    const categoryLinkedList = getCatPathFlatData([x]);//turn the tree into flats
                    return <Fragment key={i}>
                    <li  className="list-group-item d-flex flex-wrap gap-2 px-0">
                        {categoryLinkedList.map((y, j)=>{
                            return <Fragment key={j}>
                                {j!=0?"/":""}<button className="btn btn-sm btn-outline-secondary" style={{borderColor: y.color}}><span className="text-body">{y.name}</span></button>
                            </Fragment>
                        })}
                    </li>
                    </Fragment>
                })}
            </ul>
            
        
    </div>
    </>
}

function EditDescription(option){
    //Global
    const navigation = useNavigate();
    const [ModalCast, ModalUpcast] = useContext(Gbl_Modal);

    //AboveComponents
    const v_data = option.v_data;
    const ImageId = v_data.id;
    const [c_editMode, s_editMode] = option.c_editMode;
    const fetchDataAgain = option.fetchData;

    const [c_status, s_status] = useState("editing")
    const [InstCast, InstUpcast] = useReducer((state, action)=>{
        const refState = structuredClone(state);
        switch(action.run){
            case "updateTitle":
                refState.title = action.val;
                if(refState.e_title)
                    refState.e_title = undefined;
            break;
            case "updateDescription":
                refState.description = action.val.split("\n");
                if(refState.e_description)
                    refState.e_description = undefined;
            break;
            case "updateAllPath":
                refState.categoryPath = [];
                action.val.forEach((x, i)=>{
                    refState.categoryPath.push({id:refState.categoryPathIdIncrementor, list:x});
                    refState.categoryPathIdIncrementor+=1;
                });
                refState.e_categoryPath = [];
                refState.categoryPath.forEach((x, i)=>{
                    refState.e_categoryPath.push({id:x.id, message:undefined});
                });
            break;
            case "updateAPath":
                refState.categoryPath.forEach((x, i)=>{
                    if(x.id == action.val.id){
                        x.list = action.val.list;
                        refState.e_categoryPath[i].message = undefined;
                    }
                });
            break;
            case "addAPath":
                refState.categoryPathIdIncrementor+=1;
                refState.categoryPath.push({id:refState.categoryPathIdIncrementor, list:[]});
                refState.e_categoryPath.push({id:refState.categoryPathIdIncrementor, message:undefined});
            break;
            case "removeAPath":
                refState.categoryPath = refState.categoryPath.filter((x, i)=>x.id != action.val );
                refState.e_categoryPath = refState.e_categoryPath.filter((x, i)=>x.id != action.val );
            break;
            case 'addErrorPath':
                //This will accept index becasuse the field is just an arraylist to begin with.
                action.val.forEach(e => {
                    refState.e_categoryPath[e].message = "You have inputted an invalid category path.";
                });
            break;
            case 'addError':
                refState["e_"+action.val] = `There is something wrong with the ${action.val}.`;
            break;
        }
        return refState;
    }, {
        title: undefined,
        description: undefined,
        categoryPath: [],
        categoryPathIdIncrementor: 1,
        e_title: undefined,
        e_description: undefined,
        e_categoryPath: [],
    });

    //DomBinding
    const titleRef = useRef();
    const descriptionRef = useRef();
    
    //Initialize Inputs From AboveComponents
    useEffect(()=>{
        if(c_editMode){
            titleRef.current.value = v_data.title;
            descriptionRef.current.value = v_data.description.join('\n');

            InstUpcast( {run:"updateTitle", val:v_data.title} );
            InstUpcast( {run:"updateDescription", val:v_data.description.join('\n')} );
            const refinedCategoryPath = v_data.categoryPath.map((x, y)=>{
                return getCatPathFlatData([x]);
            });
            InstUpcast( {run:"updateAllPath", val:refinedCategoryPath} );
            s_status("editing");
            
        }
    }, [c_editMode, s_status]);

    const uploadData = useCallback((e)=>{
        if(c_status != "editing")
            return false;
        
        s_status("processing");
        runUpload();
        async function runUpload(){
            const d = await ApiApplyNewCategory(InstCast.categoryPath);
            let d2;
            if(d.status != '200'){
                fetchDataAgain();
            }else{
                const data = {
                    title: InstCast.title,
                    description: InstCast.description,
                    categoryPathId: JSON.stringify(d.data),
                    imageId: ImageId,
                }
                d2 = await ApiUpdateImageData( data, ImageId ); //Upload Image first  
            }
            if(d2){
                fetchDataAgain();
            }
        }
    }, [c_status, s_status,  s_editMode, InstCast, InstUpcast]);
    const deleteData = useCallback((e)=>{
        if(c_status != 'editing')
            return false;
        
        popDeleteImageWarning(ModalUpcast, v_data.title, (cast)=>{
            popDeleteProcessing(cast);
            ApiDeleteImage(v_data.id).then((d)=>{
                cast({run:'close'});
                if(d.status != "200"){
                    fetchDataAgain();
                }else{
                    navigation('/');
                }
            });
        });
    }, [c_status, s_status,  s_editMode, InstCast, InstUpcast]);

    return <>
    <div className="card-body">
        {c_status == "editing" ? <>
            <div className="mb-3">
                <label htmlFor="v_title" className="form-label">Title</label>
                <input ref={titleRef} type="text" className="form-control" id="v_title" placeholder="The title is gone :(" onInput={(e)=>{
                    InstUpcast({run:"updateTitle", val:e.target.value})
                }} />
                <small className="text-danger text-center">{InstCast.e_title}</small>
            </div>
            <div className="mb-3">
                <label htmlFor="v_description" className="form-label">Description</label>
                <textarea ref={descriptionRef} className="form-control" id="v_description" rows="3" placeholder="Lorem ipsum dolor sit amet consectetur . . ." onInput={(e)=>{
                    InstUpcast({run:"updateDescription", val:e.target.value});
                }} ></textarea>
                <small className="text-danger text-center">{InstCast.e_description}</small>
            </div>

            {/** Category */}
            <CategoryPathAddContainer Broadcast={[InstCast, InstUpcast]} />

            <div className="d-flex justify-content-end flex-wrap gap-2">
                <button className="btn btn-sm btn-primary" onClick={uploadData}> Save </button>
                <button className="btn btn-sm btn-secondary" onClick={()=>s_editMode(false)}> Cancel </button>
                <button className="btn btn-sm btn-outline-danger" onClick={deleteData}> Delete </button>
            </div>
        </> :<div className="my-4">
            <TextLoading title="Processing" subtitle="Please wait for a while, we are modifying your content." />
        </div> }
    </div>
    </>
}


function CategoryPathAddContainer(option){
    //AboveData
    const [ InstCast, InstUpcast ] = option.Broadcast;

    return <div className="">
        <div className="d-flex gap-2 align-items-center flex-wrap mb-2">
            <h6>Category Pathing</h6> 
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>{
                InstUpcast({run:"addAPath"});
            }}>Add More Path</button>
        </div>
        {InstCast.categoryPath.map((x,i)=>{
            return <CategoryPathAddInstance key={x.id} index={i} id={x.id} initialPath={x.list} Broadcast={[InstCast, InstUpcast]} />
        })}
    </div>
}

function CategoryPathAddInstance(option){
    //AboveData
    const [ InstCast, InstUpcast ] = option.Broadcast;
    const Index = option.index;
    const Id = option.id;
    const InitialPath = option.initialPath ?? [];

    const [c_queryingSuggestion, s_queryingSuggestion] = useState();
    const [v_queries, e_queries] = useState([]);
    const ThisTextBox = useRef();
    const [CatCast, CatUpcast] = useReducer((state, action)=>{
        const refState = structuredClone(state);
        switch(action.run){
            case 'appendPath':
                refState.pathList.push( {id:null, category_id:null, name:action.val});
            break;
            case 'bulkpendPath':
                refState.pathList = action.val;
            break;
            case 'popPath':
                refState.pathList.pop();
            break;
            case 'offpendPath':
                refState.pathList = refState.pathList.filter((x,i)=>i != action.val);
            break;
        }
        return refState;
    }, {
        pathList: InitialPath,
    });

    useEffect(()=>{
        InstUpcast( {run:'updateAPath', val:{id:Id, list:CatCast.pathList }} );
    }, [CatCast.pathList]);


    const ButtonComp = useCallback((catData, thisIndex)=>{
        return <button key={thisIndex} className="btn btn-outline-secondary d-flex align-items-center px-2 gap-1 text-body" type="button" onClick={()=>{
            CatUpcast({run:'offpendPath', val:thisIndex})
        }}>
            <div>{catData.name}</div> <Icon name="close" inClass="my-fill-secondary" outClass="my-h-2 my-w-2 d-flex align-items-center"/>
        </button>
    }, []);

    const QuerySuggestions = useCallback((value)=>{
        if(value && !c_queryingSuggestion){
            s_queryingSuggestion(true);
            ApiGetPathSuggestion(value).then((d)=>{ 
                e_queries(d.data);
                s_queryingSuggestion(false);
            });
        }
        if(!value){
            e_queries([]);
        }
    }, [v_queries, e_queries, c_queryingSuggestion, s_queryingSuggestion]);

    return <div className="mb-3">
    <div className="input-group">
        <span className="input-group-text" id="basic-addon1">{Index+1}</span>
        { CatCast.pathList.map((x, i)=>{
            return ButtonComp(x, i);
        }) }
        <input ref={ThisTextBox} type="text" className="form-control" placeholder=". . ." aria-label="CategoryPathField" 
            onKeyDown={(e)=>{
                if(e.key === 'Enter' && e.target.value != ""){ //Append new path name once user hits enter
                    CatUpcast({run:'appendPath', val:e.target.value});
                    ThisTextBox.current.value = '';
                    e_queries([]);
                }else if( (e.key === 'Backspace' ||  e.key === "Delete") && e.target.value == "" ){
                    CatUpcast({run:'popPath'});
                }
            }}
            onInput={(e)=>{
                QuerySuggestions(e.target.value);
            }}
            />
        <button type="button" className="btn btn-outline-secondary" aria-label="Close" onClick={()=>{
            InstUpcast({run:"removeAPath", val:Id})
        }}><Icon name="close" inClass="my-fill-secondary" outClass="my-h-5 my-w-5 d-flex align-items-center"/></button>
    </div>
   
    {/** This is use to show a a suggestion from inputted text. It will not be seen in UI once there is no data receive or already click the selected path */}
    { (v_queries && v_queries.length > 0) || c_queryingSuggestion ? <>
    <div className="d-flex flex-column border rounded-2 bg-body-tertiary">
        {c_queryingSuggestion ? <div className="w-100">
                <InlineLoading rows={2} />
        </div> : v_queries.map((x, i)=>{
            return <button key={i} className="btn btn-outline-secondary rounded-0 w-100 text-start text-body" onClick={()=>{
                let list = [{id: x.id, category_id: x.category.id , name: x.category.name} ];
                if(x.child){
                    list = list.concat( getCatPathFlatData(x.child).map((x)=>{
                        return {id:x.id, category_id: x.category_id, name:x.name};
                    }) );
                }
                CatUpcast( {run:'bulkpendPath', val:list} );
                e_queries([]);
                ThisTextBox.current.value = '';
            }}>
                {x.category.name}
                {(typeof x.child  === "object" && x.child.length > 0) ? <>
                     {getCatPathFlatData(x.child).map(x=>` \\ ${x.name}`)}
                </> :""}
            </button>
        })  }
    </div>
    
    </> :""}
    <small className="text-danger text-center">{InstCast.e_categoryPath[Index].message}</small>
    </div>
}