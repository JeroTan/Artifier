import { useCallback, useEffect, useMemo, useState } from "react"

export default (Option)=>{
    //Parameter
    /*
    Name
    InClass
    OutClass
    InStyle
    */
    //** STRUCT */
    const Name = Option.name;
    const InClass = Option.inClass;
    const OutClass = Option.outClass;
    const InStyle = Option.inStyle;
    const Ref = Option.Ref;
    //0 = Only 1 Path Color; 1 = ViewBox Is Different; 2 = Custom Path inside SVG; 3 = All custom
    const IconList = {
        'person':[0, "M12 12q-1.65 0-2.825-1.175T8 8q0-1.65 1.175-2.825T12 4q1.65 0 2.825 1.175T16 8q0 1.65-1.175 2.825T12 12Zm-8 8v-2.8q0-.85.438-1.563T5.6 14.55q1.55-.775 3.15-1.163T12 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20H4Z" ],

        'close':[1, {d:"M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504L738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512L828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496L285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512L195.2 285.696a64 64 0 0 1 0-90.496z",viewBox:"0 0 1024 1024"}],

        'person_star':[1, {d:"M13 20.5c0 2.098.862 3.995 2.25 5.357c-.717.094-1.469.143-2.25.143c-5.79 0-10-2.567-10-6.285V19a3 3 0 0 1 3-3h8.5a7.466 7.466 0 0 0-1.5 4.5ZM13 2a6 6 0 1 1 0 12a6 6 0 0 1 0-12Zm14 18.5a6.5 6.5 0 1 1-13 0a6.5 6.5 0 0 1 13 0Zm-5.786-3.96a.742.742 0 0 0-1.428 0l-.716 2.298h-2.318c-.727 0-1.03.97-.441 1.416l1.875 1.42l-.716 2.298c-.225.721.567 1.32 1.155.875l1.875-1.42l1.875 1.42c.588.446 1.38-.154 1.155-.875l-.716-2.298l1.875-1.42c.588-.445.286-1.416-.441-1.416H21.93l-.716-2.297Z", viewBox:"0 0 28 28"}],

        'wizard_hat':[1, {d:"M496 448H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h480c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zm-304-64l-64-32l64-32l32-64l32 64l64 32l-64 32l-16 32h208l-86.41-201.63a63.955 63.955 0 0 1-1.89-45.45L416 0L228.42 107.19a127.989 127.989 0 0 0-53.46 59.15L64 416h144l-16-32zm64-224l16-32l16 32l32 16l-32 16l-16 32l-16-32l-32-16l32-16z", viewBox:"0 0 512 512"}],

        'book_person':[0, "M12 8a3 3 0 0 0 3-3a3 3 0 0 0-3-3a3 3 0 0 0-3 3a3 3 0 0 0 3 3m0 3.54C9.64 9.35 6.5 8 3 8v11c3.5 0 6.64 1.35 9 3.54c2.36-2.19 5.5-3.54 9-3.54V8c-3.5 0-6.64 1.35-9 3.54Z" ],

        'w': [0, "M9 17h6a2 2 0 0 0 2-2V7h-2v8h-2V8h-2v7H9V7H7v8a2 2 0 0 0 2 2M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"],

        'star':[1, {d:"m234.5 114.38l-45.1 39.36l13.51 58.6a16 16 0 0 1-23.84 17.34l-51.11-31l-51 31a16 16 0 0 1-23.84-17.34l13.49-58.54l-45.11-39.42a16 16 0 0 1 9.11-28.06l59.46-5.15l23.21-55.36a15.95 15.95 0 0 1 29.44 0L166 81.17l59.44 5.15a16 16 0 0 1 9.11 28.06Z", viewBox:"0 0 256 256"}],

        'sticky_sword':[1, {d:"M159.977 20.63c78.967 153.842 60.076 197.813-140.143 27.124v71.185C48.22 134 72.317 147.707 92.607 160.23c-23.095.797-27.865 26.2 6.827 50.518c34.105 23.908 59.087 13.718 54.964-6.256c75.656 67.92-15.78 85.644-134.564 105.58v62.512c125.702-58.524 142.942-36.168 37.998 123.324h58.27c100.945-258.564 155.41-177.483 125.953 0h33.115c8.185-107.59 37.76-129.26 60.62 0h45.493c-141.196-219.314-28.308-204.87 113.828-140.215V309.8c-239.157-11.635-236.9-101.798 0-133.443V85.813c-72.386 39.545-74.392 15.146-7.327-65.182h-30.396c-141.87 206.317-167.428 173.33-114.166 0H297.82c-26.108 98.248-72.014 80.678-90.902 0h-46.94zm-21.49 55.854c-12.85-.12-17.734 15.212-.45 35.832c27.02 32.236 54.07 12.942 27.088-19.246c-9.712-11.586-19.428-16.518-26.637-16.586zM293.226 90.48c2.17.067 4.405.65 6.636 1.866c17.85 9.735-.25 40.7-18.1 30.963c-15.646-8.534-3.72-33.294 11.465-32.83zm-52.766 12.207c9.52 0 17.24 7.72 17.24 17.24c0 5.46-2.544 10.315-6.5 13.473l5.82 41.4l49.345-6.94l6.96 49.476l-18.51 2.6l-4.354-30.967l-20.23 2.844c14.463 68.143 18.467 141.156 9.012 201.95c-25.853-55.827-42.906-127.008-47.84-196.49l-19.964 2.808l4.355 30.97l-18.506 2.602l-6.96-49.478l48.19-6.776l-5.93-42.144c-5.558-2.86-9.368-8.644-9.368-15.328c0-9.523 7.718-17.24 17.24-17.24zm202.01 23.862c.564.007 1.116.028 1.655.057c8.632.48 13.786 3.577 15.94 6.46c2.156 2.882 2.776 5.828-.133 11.367c-2.91 5.538-10.27 12.996-23.912 19.81c-13.666 6.827-25.43 9.032-34.06 8.553c-8.63-.48-13.785-3.578-15.94-6.46c-2.156-2.884-2.775-5.834.134-11.372c2.91-5.538 10.27-12.995 23.91-19.807c12.81-6.4 23.952-8.736 32.407-8.61zM182.167 293.11c.517.002 1.022.02 1.518.05c4.754.292 8.485 1.81 10.763 3.774c3.038 2.62 4.42 5.677 3.496 10.87c-.923 5.194-4.94 12.75-14.824 21.057c-19.795 16.637-35.19 14.16-40.83 8.855c-2.822-2.653-4.21-6.063-3.21-11.46c1-5.395 4.96-12.846 14.28-20.775c10.906-9.276 21.052-12.416 28.806-12.37zm186.98 47.52c-25.603.182-26.42 26.004 20.002 60.106c72.344 53.145 114.972 20.073 42.516-33.146c-25.997-19.098-48.157-27.064-62.52-26.96z", viewBox:"0 0 512 512"}],

        'add':[1, {d:"M11 9V5H9v4H5v2h4v4h2v-4h4V9h-4zm-1 11a10 10 0 1 1 0-20a10 10 0 0 1 0 20z", viewBox:"0 0 20 20"}],

        'search':[0, "M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14z"],

        'filter':[0, "M14 12v7.88c.04.3-.06.62-.29.83a.996.996 0 0 1-1.41 0l-2.01-2.01a.989.989 0 0 1-.29-.83V12h-.03L4.21 4.62a1 1 0 0 1 .17-1.4c.19-.14.4-.22.62-.22h14c.22 0 .43.08.62.22a1 1 0 0 1 .17 1.4L14.03 12H14Z"],

        'edit':[0, "M19 19V5H5v14h14m0-16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-2.3 6.35l-1 1l-2.05-2.05l1-1c.21-.22.56-.22.77 0l1.28 1.28c.22.21.22.56 0 .77M7 14.94l6.06-6.06l2.06 2.06L9.06 17H7v-2.06Z"],

        'delete':[0, "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12l1.41 1.41L13.41 14l2.12 2.12l-1.41 1.41L12 15.41l-2.12 2.12l-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"],

        'back':[0, "M12 9.059V6.5a1.001 1.001 0 0 0-1.707-.708L4 12l6.293 6.207a.997.997 0 0 0 1.414 0A.999.999 0 0 0 12 17.5v-2.489c2.75.068 5.755.566 8 3.989v-1c0-4.633-3.5-8.443-8-8.941z"],

        'check':[0, "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9Z"],

        'cross':[0, "M19.1 4.9C15.2 1 8.8 1 4.9 4.9S1 15.2 4.9 19.1s10.2 3.9 14.1 0s4-10.3.1-14.2zm-4.3 11.3L12 13.4l-2.8 2.8l-1.4-1.4l2.8-2.8l-2.8-2.8l1.4-1.4l2.8 2.8l2.8-2.8l1.4 1.4l-2.8 2.8l2.8 2.8l-1.4 1.4z"],

        'warning':[0, "M1 21L12 2l11 19H1Zm3.45-2h15.1L12 6L4.45 19ZM12 18q.425 0 .713-.288T13 17q0-.425-.288-.712T12 16q-.425 0-.712.288T11 17q0 .425.288.713T12 18Zm-1-3h2v-5h-2v5Zm1-2.5Z"],

        'i':[0, "M12 4c4.411 0 8 3.589 8 8s-3.589 8-8 8s-8-3.589-8-8s3.589-8 8-8m0-2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2zm1 13h-2v2h2v-2zm-2-2h2l.5-6h-3l.5 6z"],

        'crown':[0, "M14 5c0 .53-.206 1.012-.543 1.37l2.624 3.28a.25.25 0 0 0 .307.068l2.65-1.326A2.004 2.004 0 0 1 21 6a2 2 0 0 1 .444 3.95l-1.804 9.623A1.75 1.75 0 0 1 17.92 21H6.08a1.75 1.75 0 0 1-1.72-1.427L2.556 9.95a2 2 0 1 1 2.406-1.559l2.65 1.326a.25.25 0 0 0 .307-.068l2.624-3.28A2 2 0 1 1 14 5Zm-2 12a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z"],

        'up':[0, "m12 8l7 8H5z"],

        'down':[0, "m5 8l7 8l7-8"],

        'upload':[0, "M11 16V7.85l-2.6 2.6L7 9l5-5l5 5l-1.4 1.45l-2.6-2.6V16zm-5 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"],

        'eye':[0, "M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"],

        'right':[0, "M5.536 21.886a1.004 1.004 0 0 0 1.033-.064l13-9a1 1 0 0 0 0-1.644l-13-9A1 1 0 0 0 5 3v18a1 1 0 0 0 .536.886"],

        'last_next':[0, "M3 4.753c0-1.408 1.578-2.24 2.74-1.444l10.498 7.194a1.75 1.75 0 0 1 .01 2.88L5.749 20.685C4.59 21.492 3 20.66 3 19.248zM21 3.75a.75.75 0 0 0-1.5 0v16.5a.75.75 0 0 0 1.5 0z"],

        'first_prev':[0, "M3 3.75a.75.75 0 0 1 1.5 0v16.5a.75.75 0 0 1-1.5 0zm18 1.003c0-1.408-1.578-2.24-2.74-1.444L7.763 10.503a1.75 1.75 0 0 0-.01 2.88l10.499 7.302c1.16.807 2.749-.024 2.749-1.437z"],

        'next':[1, {d:"m184.49 136.49l-80 80a12 12 0 0 1-17-17L159 128L87.51 56.49a12 12 0 1 1 17-17l80 80a12 12 0 0 1-.02 17", viewBox:"0 0 256 256"}],

        'prev':[1, {d:"M168.49 199.51a12 12 0 0 1-17 17l-80-80a12 12 0 0 1 0-17l80-80a12 12 0 0 1 17 17L97 128Z", viewBox:"0 0 256 256"}],

        'facebook':[0, 'M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95'],

        'twitter':[0, 'M22.46 6c-.77.35-1.6.58-2.46.69c.88-.53 1.56-1.37 1.88-2.38c-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29c0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15c0 1.49.75 2.81 1.91 3.56c-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07a4.28 4.28 0 0 0 4 2.98a8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56c.84-.6 1.56-1.36 2.14-2.23'],

        'youtube':[0, 'm10 15l5.19-3L10 9zm11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73'],

        'compact_view':[0, 'M3 11V3h8v8zm0 10v-8h8v8zm10-10V3h8v8zm0 10v-8h8v8z'],

        'wide_view':[0, 'M9 20h13v-4H9zM2 8h5V4H2zm0 6h5v-4H2zm0 6h5v-4H2zm7-6h13v-4H9zm0-6h13V4H9z']

    }
/*
Temporary Holder

*/

    // Store the Icon Data from icons parameter; Check if use state or not
    const iconData = useMemo(()=>{
        if(useState.isPrototypeOf(Name)){
            return IconList[Name[0]];
        }else{
            return IconList[Name];
        }
    }, [ Name[0] ]);

    //** Functionality */
    //Create a function that will templated the svg format
    const svgFrame = useCallback((frame, content)=>{
        switch(frame){
            case 0:
                return <><svg xmlns="http://www.w3.org/2000/svg" width='100%' height='100%' viewBox="0 0 24 24"><path className={InClass} style={InStyle} d={content}></path></svg></>
            break;
            case 1:
                return <><svg xmlns="http://www.w3.org/2000/svg" width='100%' height='100%' viewBox={content.viewBox}><path className={InClass} style={InStyle} d={content.d}></path></svg></>
            break;
            case 2:
                return <><svg xmlns="http://www.w3.org/2000/svg" width='100%' height='100%' viewBox={content.viewBox}>{content.d}</svg></>
            break;
            case 3:
                return <>{content}</>
            default:
                return <></>
            break;
        };
    }, []);

    //** RETURN */
    return <>
        <div className={OutClass ?? "w-4 h-4"} ref={Ref ? Ref : undefined}>
            {svgFrame( iconData[0], iconData[1] )}
        </div>
    </>
}
