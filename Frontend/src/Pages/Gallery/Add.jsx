import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef,useState } from "react"
import Pageplate from "../../Utilities/Pageplate"
import Icon from "../../Utilities/Icon";
import { randomizer } from "../../Helper/Math";
import { InlineLoading, TextLoading } from "../../Helper/Placholder";
import { ApiApplyNewCategory, ApiGetPathSuggestion, ApiLinkImageCategory, ApiUploadImageData } from "../../Helper/Api";
import { getCatPathFlat, getCatPathFlatData } from "../../Helper/RyouikiTenkai";
import { Link } from "react-router-dom";

const Gbl_AddImage = createContext();
const Gbl_AddInstance = createContext();

export const AddImage = (option)=>{
    //GLobal
    const [ ThisCast, ThisUpcast] = useReducer((state, action)=>{
        const refState = structuredClone(state);
        if(action.run === undefined){
            state[action.key] = action.val;
            return refState;
        }
        switch(action.run){
            case 'changeStatus':
                refState.totalInstance.forEach(e => {
                    if(e.id == action.val[0]){
                        e.status = action.val[1]
                    }
                });
            break;
            case 'addInstance':
                refState.incrementId+=1;
                refState.totalInstance.push( {id:refState.incrementId, status:"editing"} )
            break;
            case 'deleteInstance':
                if(refState.totalInstance.length > 1)
                    refState.totalInstance = refState.totalInstance.filter(e => (e.status == 'processing' || e.status == 'queue') || (e.id != action.val)   );
            break;
            case 'queueUpload':
                refState.totalInstance.forEach((x)=>{
                    if(x.status == 'queue' || x.status == 'success' || x.status == 'processing')
                        return;
                    x.status = 'queue';
                    refState.queueTurn.push(x.id);
                });
            break;
            case 'nextQueue':
                if(refState.queueTurn.length > 0)
                    refState.queueTurn = refState.queueTurn.filter((x,i)=>i!=0);
            break;
        }
        return refState;
    }, {
        incrementId: 1,
        totalInstance: [
            {id:1, status: "editing",}
        ],
        queueTurn: [],
    });


    return <Gbl_AddImage.Provider value={[ThisCast, ThisUpcast]}>
    <Pageplate container={true}>
        <div className="d-flex mt-4">
            <button className="btn btn-outline-primary" type="button" onClick={()=>ThisUpcast({run:'addInstance'})}>Create More</button>
        </div>
        { ThisCast.totalInstance.map((x, i)=>{
            return <AddInstance 
                key={x.id} 
                index={i} 
                id={x.id} 
                status={x.status} 
                updateStatus={ val=>ThisUpcast({run:"changeStatus", "val":[x.id, val]}) }
                deleteMe={ ()=>ThisUpcast({run:"deleteInstance",val:x.id}) } 
                queueList={ ThisCast.queueTurn }
                nextQueue={ ()=>ThisUpcast({run:"nextQueue"}) }
            />
        }) }
        <div className="d-flex mb-5">
            <button className="btn btn-primary d-flex gap-1" type="button" onClick={()=>ThisUpcast({run:'queueUpload'})}>
                <Icon name="save" inClass="my-fill-light text-emphasis" outClass="my-h-5 m-w-5"  />
                <div>Upload</div>
            </button>
        </div>
    </Pageplate>
    </Gbl_AddImage.Provider>
}

const AddInstance = (option)=>{
    //Global
    const Index = option.index;
    const Id = option.id;
    const Status = option.status;
    const UpdateStatus = option.updateStatus;
    const DeleteMe = option.deleteMe;
    const QueueList = option.queueList;
    const NextQueue = option.nextQueue;
    //Global
    const [ InstCast, InstUpcast] = useReducer((state, action)=>{
        const refState = structuredClone(state);
        if(action.run === undefined){
            state[action.key] = action.val;
            return refState;
        }
        switch(action.run){
            case 'openPreview':
                refState.preview = action.val;
            break;
            case 'closePreview':
                refState.preview = false;
            break;
            case 'addImage':
                refState.v_data.image = action.val;
            break;
            case 'closeImage':
                refState.v_data.image = "";
            break;
            case 'updateTitle':
                refState.v_data.title = action.val;
            break;
            case 'updateDescription':
                refState.v_data.description = action.val;
            break;
            case 'addCatPathInstance':
                refState.catPathIncrementId+=1;
                refState.v_data.categoryPaths.push( {id:refState.catPathIncrementId, list:[]} );
                refState.v_error.categoryPaths.push( {id:refState.catPathIncrementId, message:undefined } );
            break;
            case 'removeCathPathInstance':
                if(refState.v_data.categoryPaths.length > 1){
                    refState.v_data.categoryPaths = refState.v_data.categoryPaths.filter(e =>e.id !== action.val);
                    refState.v_error.categoryPaths = refState.v_error.categoryPaths.filter(e=>e.id !== action.val)
                }
            break;
            case 'updatePath':
                refState.v_data.categoryPaths.forEach((e)=>{
                    if(action.val.id === e.id){
                        e.list = action.val.list;
                    }
                });
            break;
            case 'addErrorPath':
                action.val.forEach(e => {
                    refState.v_error.categoryPaths[e].message = "You have inputted an invalid category path.";
                });
            break;
            case 'addError':
                refState.v_error[action.val] = `There is something wrong with the ${action.val}.`;
            break;
            case 'removeErrorPath':
                if(refState.v_error.categoryPaths[action.val].message)
                    refState.v_error.categoryPaths[action.val].message = undefined;
            break;
            case 'removeError':
                if(refState.v_error[action.val])
                    refState.v_error[action.val] = undefined;
            break;
            
        }
        return refState;
    }, {
        preview: false,
        v_data: {
            image:"",
            title:"",
            description:"",
            categoryPaths:[
                {id:1, list:[]}
            ]
        },
        v_error: {
            image:undefined,
            title:undefined,
            description:undefined,
            categoryPathId:undefined,
            categoryPaths:[
                {id:1, message:undefined}
            ]
        },
        catPathIncrementId: 1,
    });

    //UPLOADING QUEUE
    useEffect(()=>{
        if(QueueList[0] == Id && Status == 'queue'){
            UpdateStatus("processing");
            runUpload();
            async function runUpload(){
                const d = await ApiApplyNewCategory(InstCast.v_data.categoryPaths);
                let d2;
                if(d.status != '200'){
                    UpdateStatus("error");
                    NextQueue();
                    if(d.status == "422"){
                        const errorList  = Object.keys(d.data.errors).map((x)=>{
                            return x.split('.')[0];
                        });
                        InstUpcast({run:'addErrorPath', val:errorList});
                    }
                    return false;
                }else{
                    const formData = new FormData();
                    formData.append("image", InstCast.v_data.image);
                    formData.append("title", InstCast.v_data.title);
                    formData.append("description", InstCast.v_data.description);
                    formData.append("categoryPathId", JSON.stringify(d.data) );
                    d2 = await ApiUploadImageData( formData ); //Upload Image first   
                }
                
                if(d2.status != '200'){
                    UpdateStatus("error");
                    NextQueue();
                    if(d2.status == "422"){
                        Object.keys(d2.data.errors).forEach((e)=>{
                            const field = e.split('.')[0];
                            InstUpcast({run:'addError', val:field});
                        });
                    }
                }else{
                    UpdateStatus("success");
                    NextQueue();
                }
            }
        }

    }, [QueueList, NextQueue]);


    //Components
    const TextStatusClass = useMemo(()=>{
        const bootstrapClass = {
            "editing":"text-body-secondary",
            "error":"text-danger",
            "queue":"text-warning",
            "processing":"text-info",
            "success":"text-success",
        };
        return bootstrapClass[Status];
    }, [Status]);

    return <>
    <Gbl_AddInstance.Provider value={[InstCast, InstUpcast]}>
    <main className={`card w-full mt-2 mb-4 overflow-hidden shadow-sm `}>
        <div className="card-header d-flex">
            <div className="me-auto"> <span className="fw-bolder">#{Index+1}</span>  <span className={TextStatusClass}>{Status} . . .</span> </div>
            <button type="button" className="btn-close" aria-label="Close" onClick={DeleteMe} ></button>
        </div>
        <div className={`${Status=='processing' || Status=='success' ? "d-none" :""}`}>
            <ImageAddContainer />
            <DescriptionAddContainer />
            <CategoryPathAddContainer />
        </div>
        <div className={`${Status=='processing' ? "" :"d-none"} py-5`}>
            <TextLoading title="Processing" subtitle="Please wait for a while, we are uploading your content." />
        </div>
        <div className={`${Status=='success'? "" : "d-none" }`}>
            <div className="my-5 d-flex flex-column align-items-center">
                <h3 className="text-center mb-0">
                    Image was added to the gallery.
                </h3>
                <small className="text-secondary text-center"> Back to the <Link to={`/`}>homepage</Link>. </small>
            </div>
            
        </div>
        
    </main>
    </Gbl_AddInstance.Provider>
    </>
}
//The Actual Container of image like input files and preview of the image
function ImageAddContainer(option){
    //Global
    const [ InstCast, InstUpcast ] = useContext(Gbl_AddInstance);
    const UploadButtonRef = useRef();


    return <>
    <div className="d-flex bg-body-secondary justify-content-center">
        <input ref={UploadButtonRef} type="file" className="d-none" accept="image/*" onChange={(e)=>{
            const imageFile = e.target.files[0];
            if(imageFile){
                const urlOfImageFile = URL.createObjectURL(imageFile);
                InstUpcast({run:"addImage", val:imageFile})
                InstUpcast({run:"openPreview", val:urlOfImageFile});
            }else{
                InstUpcast({run:"closeImage"})
                InstUpcast({run:"closePreview"});
            }
            InstUpcast({run:'removeError', val:'image'});
        }}  />
        { InstCast.preview ? <>
        <div className="position-relative d-flex overflow-hidden my-pointer" style={{minWidth: "25rem"}} onClick={()=>{
            UploadButtonRef.current.click();
        }} >
            <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center">
                <div className="d-flex flex-column align-items-center">
                    <Icon name="upload" inClass="my-fill-primary" outClass="my-w-20 my-h-20" />
                    <h5 className="text-center">Replace Image</h5>
                </div>
            </div>
            <img src={InstCast.preview} className="w-100 h-100 position-relative  object-fit-contain my-opacity-hover-50" alt={`previewImage`}></img>
        </div>
        </> : <>
        <div className="position-relative d-flex overflow-hidden my-pointer my-opacity-hover-50" style={{minWidth: "25rem", aspectRatio:"5/4"}} onClick={()=>{
            UploadButtonRef.current.click();
        }} > 
            <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center bg-body-tertiary ">
                <div className="d-flex flex-column align-items-center">
                    <Icon name="upload" inClass="my-fill-primary" outClass="my-w-20 my-h-20" />
                    <h5 className="text-center">Insert Image</h5>
                </div>
            </div>
        </div>
        </>}
        
    </div>
    <div className="d-flex justify-content-center">
        <small className="text-danger text-center">{InstCast.v_error.image}</small>
    </div>
    
    </>
}

function DescriptionAddContainer(option){
    //Global
    const [ InstCast, InstUpcast ] = useContext(Gbl_AddInstance);
    const RandSearchPlaceholder = useMemo(()=>{
        const text = [
            "Pikachu with Gun",
            "Ganyu on the Mountain",
            "Minato Akua",
            "Miku Dayo",
            "Sparkle Sleeping",
            "Suispin Kururinmachi",
            "Scaramouth with Hat",
            "Go Jojo Saturo",
            "SSSS Rulerman",
        ];
        return text[randomizer(0, text.length)];
    }, []);

    return <>
    <div className="card-body">
        <div className="mb-3">
            <label htmlFor="v_title" className="form-label">Title</label>
            <input type="text" className="form-control" id="v_title" placeholder={RandSearchPlaceholder} onInput={(e)=>{
                InstUpcast({run:"updateTitle", val:e.target.value});
                InstUpcast({run:'removeError', val:'title'});
            }} />
            <small className="text-danger text-center">{InstCast.v_error.title}</small>
        </div>
        <div className="mb-3">
            <label htmlFor="v_description" className="form-label">Description</label>
            <textarea className="form-control" id="v_description" rows="3" placeholder="Lorem ipsum dolor sit amet consectetur . . ." onInput={(e)=>{
                InstUpcast(  {run:"updateDescription", val: JSON.stringify(e.target.value.split('\n')) }  );
                InstUpcast({run:'removeError', val:'description'});
            }} ></textarea>
            <small className="text-danger text-center">{InstCast.v_error.description}</small>
        </div>
    </div>
    </>
}

function CategoryPathAddContainer(option){
    //Global
    const [ InstCast, InstUpcast ] = useContext(Gbl_AddInstance);


    return <div className="card-body">
        <div className="d-flex gap-2 align-items-center flex-wrap mb-2">
            <h6>Category Pathing</h6> <button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>{
                InstUpcast({run:"addCatPathInstance"});
            }}>Add More Path</button>
        </div>
        {InstCast.v_data.categoryPaths.map((x,i)=>{
            return <CategoryPathAddInstance key={x.id} index={i} id={x.id} />
        })}
    </div>
}

function CategoryPathAddInstance(option){
    //Global
    const [ InstCast, InstUpcast ] = useContext(Gbl_AddInstance);
    const Index = option.index;
    const Id = option.id;
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
        pathList: []
    });

    useEffect(()=>{
        InstUpcast( {run:'updatePath', val:{id:Id, list:CatCast.pathList }} );
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
                }else if( (e.key === 'Backspace' ||  e.key === "Delete") && e.target.value == "" ){
                    CatUpcast({run:'popPath'});
                }
            }}
            onInput={(e)=>{
                QuerySuggestions(e.target.value);
                InstUpcast({run:'removeErrorPath', val:Index});
            }}
            />
        <button type="button" className="btn btn-outline-secondary" aria-label="Close" onClick={()=>{
            InstUpcast({run:"removeCathPathInstance", val:Id})
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
    <small className="text-danger text-center">{InstCast.v_error.categoryPaths[Index].message}</small>
    </div>
}