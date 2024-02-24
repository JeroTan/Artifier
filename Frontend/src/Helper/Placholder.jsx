import { randomizer } from "./Math";

export function InlineLoading(option){
    const Rows = option.rows;

    return <div className="">
        <p className="placeholder-glow">
        { [...Array(Rows)].map((x, i)=>{
            return <span key={i} className={`placeholder mx-1 col-${randomizer(1,12)}`}></span>
        })}
        </p>
    </div>
}

export function CardLoading(option){
    
    return <div className="card" aria-hidden="true" style={{width: "18rem"}}>
        <ImagePlaceholder />
        <div className="card-body">
            <span className="placeholder col-6"></span>
        </div>
    </div>
        
    
}

export function TextLoading(option){
    const Title = option.title;
    const Subtitle = option.subtitle;

    return <div className="d-flex flex-column align-items-center">
        <div className="d-flex align-items-center justify-content-center mb-2">
            <div className="spinner-border" aria-hidden="true"></div>
        </div>
        <h3 className="">{Title}</h3>
        <p className="text-secondary">{Subtitle}</p>
    </div>
}


export function BlockNoData(option){
    const Title = option.title ?? "It's empty here!";
    const Messasge = option.message ?? "We cannot find your item, maybe it is deleted or does not exist in the first place."
    return <div className="text-center">
        <h3>{Title}</h3>
        <p className="text-secondary">{Messasge}</p>
    </div>
}

export function ImagePlaceholder(option){
    const Height = option.height ?? 180;
    return <svg className="bd-placeholder-img card-img-top" width="100%" height={Height} xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Loading Image</title><rect width="100%" height="100%" fill="#868e96"></rect></svg>
}