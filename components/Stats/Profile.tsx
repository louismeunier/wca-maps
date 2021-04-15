export const Profile = (props: { userInfo: WCAUser }):JSX.Element => {
    
    return (
        <div className="-m-2 text-center col-span-3 overflow-x-contain overflow-y-contain flex justify-evenly items-center">
            <span className="grid grid-rows-2 text-center">
                <a href={`https://www.worldcubeassociation.org/persons/${props.userInfo.wca_id}`} rel="noreferrer" target="_blank">
                    <h1 className="underline text-2xl font-bold">{props.userInfo.name}</h1>
                </a>
                <a href={`https://www.worldcubeassociation.org/persons/${props.userInfo.wca_id}`} rel="noreferrer" target="_blank">
                    <h2 className="text-sm"> ({props.userInfo.wca_id})</h2>
                </a>
            </span>
            <span>
                <img className="h-1/2 w-auto" src={props.userInfo.avatar.thumb_url} alt="Image of use"></img>
            </span>
            {/* <img className="h-20" src={props.userInfo.avatar.url} alt={`Picture of ${props.userInfo.name}`}></img> */}
        </div>
    )
}