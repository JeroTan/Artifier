import { createContext, useContext, useReducer, useRef } from "react"
import Pageplate from "../../Utilities/Pageplate"
import Icon from "../../Utilities/Icon";

const Gbl_AddImage = createContext();
const Gbl_AddInstance = createContext();

export const AddImage = (option)=>{
    const [ ThisCast, ThisUpcast] = useReducer((state, action)=>{
        const refState = structuredClone(state);
        if(action.run === undefined){
            state[action.key] = action.val;
            return refState;
        }
        
    }, {
        totalInstance: [],
    });

    return <Gbl_AddImage.Provider value={[ThisCast, ThisUpcast]}>
    <Pageplate container={true}>
        <AddInstance />
    </Pageplate>
    </Gbl_AddImage.Provider>
}

const AddInstance = (option)=>{
    //Global
    const [ InstCast, InstUpcast] = useReducer((state, action)=>{
        const refState = structuredClone(state);
        if(action.run === undefined){
            state[action.key] = action.val;
            return refState;
        }
        switch(action.run){
            case 'openPreview':
                refState.preview = true;
            break;
            case 'closePreview':
                refState.preview = false;
            break;
            case 'addImage':
                refState.v_data.image = action.val;
            break;
        }
        return refState;
    }, {
        preview: false,
        v_data: {},
        v_error: {},
    });

    return <>
    <Gbl_AddInstance.Provider value={[InstCast, InstUpcast]}>
    <main className="card w-full mt-4 overflow-hidden">
        <ImageAddContainer />
    </main>
    </Gbl_AddInstance.Provider>
    </>
}

function ImageAddContainer(option){
    //Global
    const [ InstCast, InstUpcast ] = useContext(Gbl_AddInstance);
    const UploadButtonRef = useRef();

    return <>
    <div className="d-flex bg-body-secondary justify-content-center">
        <input ref={UploadButtonRef} type="file" className="d-none" onChange={(e)=>{
            
        }}  />
        { InstCast.preview ? <>
        <div className="position-relative d-flex overflow-hidden my-pointer" style={{minWidth: "25rem"}}>
            <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center">
                <div className="d-flex flex-column align-items-center">
                    <Icon name="upload" inClass="my-fill-primary" outClass="my-w-20 my-h-20" />
                    <h5 className="text-center">Replace Image</h5>
                </div>
            </div>
            <img src={"https://beebom.com/wp-content/uploads/2023/12/sparkle-honkai-star-rail.jpg?quality=100"} className="w-100 h-100 position-relative  object-fit-contain my-opacity-hover-50" alt={`previewImage`}></img>
        </div>
        </> : <>
        <div className="position-relative d-flex overflow-hidden my-pointer my-opacity-hover-50" style={{minWidth: "25rem", aspectRatio:"5/4"}}>
            <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center bg-body-tertiary ">
                <div className="d-flex flex-column align-items-center">
                    <Icon name="upload" inClass="my-fill-primary" outClass="my-w-20 my-h-20" />
                    <h5 className="text-center">Replace Image</h5>
                </div>
            </div>
        </div>
        </>}
        
    </div>
    </>
}