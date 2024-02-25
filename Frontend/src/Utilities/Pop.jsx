import { useContext, useEffect, useMemo, useRef } from "react"
import { Gbl_Modal } from "../Modal"
import './Pop.css';
import Icon from "./Icon";

export function PopTemplate(option){
    // Global
    const [Broadcast, Upcast] = useContext(Gbl_Modal);
    const Ref = useRef();
    const {Content, Button} = option.data;
    const IsOpen = Broadcast.isOpen;
    const CanClose = Broadcast.canClose;
    const AllowButton = Broadcast.allowButton;
    const Width = Broadcast.width ?? "34rem";

    //Components
    //>>>>>>>>>>TEMPLATE
    const CloseButton = useMemo(()=>{
        if(!CanClose){
            return <></>;
        }
        return <>
            <div className="d-flex justify-content-end">
                <button type="button" className="btn-close" aria-label="Close" onClick={()=>{
                    Upcast({run:'close'});
                }} ></button>
            </div>
        </>
    }, [CanClose]);
    
    //UseEffect
    useEffect(()=>{
        if(IsOpen){
            Ref.current.showModal();
        }else{
            Ref.current.close();
        }
    }, [IsOpen]);

    return <dialog ref={Ref} className="my-dialog border rounded-3" style={{width: Width}} onClick={(e)=>{
        if (e.target === Ref.current && CanClose) {
            Upcast({run:'close'});
        }
    }}>
        {CloseButton}
        {Content}
        {AllowButton ? Button : ""}
    </dialog>
}
//<<<<<<<<<<<TEMPLATE

function PopSuccess(option){
    // Global
    const [Broadcast, Upcast] = useContext(Gbl_Modal);
    const Title = Broadcast.title;
    const Data = Broadcast.data;

    const Content = useMemo(()=>{
        return <div className="w-100">
            <div className="d-flex justify-content-center">
                <Icon name="check" outClass="my-w-10 my-h-10" inClass="my-fill-success" />
            </div>
            <h3 className="text-center">{Title}</h3>
            <p className="text-center text-break text-secondary">{Data}</p>
        </div>
    }, [Title, Data]);

    const Button = useMemo(()=>{
        return <div className="d-flex justify-content-center">
            <button type="button" className="btn btn-success" onClick={()=>{
                Upcast({run:'close'});
            }}>Okay</button>
        </div>
    }, []);

    return <PopTemplate data={{
        Content: Content,
        Button: Button,
    }} />
}

function PopError(option){
    // Global
    const [Broadcast, Upcast] = useContext(Gbl_Modal);
    const Title = Broadcast.title;
    const Data = Broadcast.data;

    const Content = useMemo(()=>{
        return <div className="w-100">
            <div className="d-flex justify-content-center">
                <Icon name="cross" outClass="my-w-10 my-h-10" inClass="my-fill-danger" />
            </div>
            <h3 className="text-center">{Title}</h3>
            <p className="text-center text-break text-secondary">{Data}</p>
        </div>
    }, [Title, Data]);

    const Button = useMemo(()=>{
        return <div className="d-flex justify-content-center">
            <button type="button" className="btn btn-danger" onClick={()=>{
                Upcast({run:'close'});
            }}>Okay</button>
        </div>
    }, []);

    return <PopTemplate data={{
        Content: Content,
        Button: Button,
    }} />
}

function PopWarning(option){
    // Global
    const [Broadcast, Upcast] = useContext(Gbl_Modal);
    const Title = Broadcast.title;
    const Data = Broadcast.data;
    const ConfirmCallback = Broadcast.confirmCallback;
    const CloseCallback = Broadcast.closeCallback;

    const Content = useMemo(()=>{
        return <div className="w-100">
            <div className="d-flex justify-content-center">
                <Icon name="cross" outClass="my-w-10 my-h-10" inClass="my-fill-danger" />
            </div>
            <h3 className="text-center">{Title}</h3>
            <p className="text-center text-break text-secondary">{Data}</p>
        </div>
    }, [Title, Data]);

    const Button = useMemo(()=>{
        return <div className="d-flex justify-content-center gap-2">
            <button type="button" className="btn btn-danger" onClick={()=>{
                ConfirmCallback();
            }}>
                Yes
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={()=>{
                CloseCallback();
                Upcast({run:'close'});
            }}>No</button>
        </div>
    }, []);

    return <PopTemplate data={{
        Content: Content,
        Button: Button,
    }} />
}

function PopLoading(option){
    // Global
    const [Broadcast, Upcast] = useContext(Gbl_Modal);
    const Title = Broadcast.title ?? "Loading. . .";
    const Data = Broadcast.data ?? "Please wait for a while.";

    const Content = useMemo(()=>{
        return <div className="w-100">
            <div className="d-flex align-items-center  justify-content-center mb-2">
                <div className="spinner-border" aria-hidden="true"></div>
            </div>
            <h3 role="status" className="text-center">{Title}</h3>
            <p className="text-center text-break text-secondary">{Data}</p>
        </div>
    }, [Title, Data]);

    return <PopTemplate data={{
        Content: Content,
        Button: "",
    }} />
}

function PopImageDisplay(option){
    // Global
    const [Broadcast, Upcast] = useContext(Gbl_Modal);
    const Data = Broadcast.data ?? "#";
    const Content = useMemo(()=>{
        return <>
            <div className="position-relative w-100 mt-2">
                <img className="position-relative w-100 h-100 object-fit-contain bg-secondary my-pointer" alt="imageFromGallery" style={{minHeight: "30rem"}} src={Data} 
                    onClick={()=>{
                        window.open(Data, '_blank').focus();
                    }}
                />
            </div>
        </>
    })
    return <PopTemplate data={{
        Content: Content,
        Button: "",
    }} />
}

function PopBlank(option){
    // Global
    const [Broadcast, Upcast] = useContext(Gbl_Modal);

    return <PopTemplate data={{
        Content: Broadcast.data,
        Button: <></>
    }} /> 
}

export function PopEntryPoint(){
    // Global
    const [Broadcast, Upcast] = useContext(Gbl_Modal);
    // Data
    const Type = Broadcast.type;
    

    const ReleaseThePop = useMemo(()=>{
        switch(Type){
            case 'success':
                return <PopSuccess />
            case 'error':
                return <PopError />
            case 'warning':
                return <PopWarning />
            case 'loading':
                return <PopLoading />
            case 'imageDisplay':
                return <PopImageDisplay />
            case 'blank':
                return <PopBlank />
            
            default:
                return <PopBlank />
        }
    }, [Broadcast]);

    return <>
        {ReleaseThePop}
    </>
}