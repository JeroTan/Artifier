import { Suspense, createContext, useCallback, useContext, useState, useEffect, useMemo, useReducer, Fragment } from "react";
import Icon from "../../Utilities/Icon";
import { BlockNoData, CardLoading, ImagePlaceholder, InlineLoading } from "../../Helper/Placholder";
import { useNavigate, useParams } from "react-router-dom";
import { ApiGetCategory, ApiGetCategoryPathTree, ApiGetImage, ApiImageLink } from "../../Helper/Api";
import { Gbl_Settings } from "../../GlobalSettings";
import Pageplate from "../../Utilities/Pageplate";
import { transformDate } from "../../Helper/Math";
import { getCatPathFlatData } from "../../Helper/RyouikiTenkai";

export default (option)=>{
    const { id } = useParams();
    const [v_data, e_data] = useState(undefined);
    useEffect(()=>{
        ApiGetImage(id).then((d)=>{
            console.log(d);
            const data = d.data.data;
            e_data({
                image: ApiImageLink(data.image),
                title: data.title,
                description: JSON.parse(data.description),
                categoryPath: data.categoryPath,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
            });
        });
    }, []);
    return <>
    <Pageplate container={true}>
        <main className="card mt-5 w-100 shadow-sm">
            <div className="position-relative d-flex overflow-hidden my-pointer">
                {v_data ? <>
                    <img className="position-relative w-100 h-100 object-fit-contain bg-secondary" alt="imageFromGallery" style={{minHeight: "20rem"}} src={v_data.image} />
                </> :<>
                    <ImagePlaceholder height={500} />
                </>}
                
            </div>
            <div className="card-body">
                {v_data ? <>

                    <h5 className="card-title">{v_data.title}</h5>

                    { v_data.description.map( (x, i)=><p key={i} className="card-text">{x}</p> ) }

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
                    
                </> : <>
                    <InlineLoading rows={10}/>
                </>}
            </div>
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