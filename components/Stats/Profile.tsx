export const Profile = (props: { userInfo: WCAUser }):JSX.Element => {
    
    return (
        <div className="-m-2 text-center min-h-1/2 w-1/3 overflow-x-contain overflow-y-contain flex fixed justify-evenly items-center">
            <span className="font-bold text-xl text-center">
                {props.userInfo.name}
            </span>
            <span>
                <img className="h-1/2 w-auto" src={props.userInfo.avatar.thumb_url} alt="Image of use"></img>
            </span>
            <span className="text-sm"> ({props.userInfo.wca_id})</span>
            {/* <img className="h-20" src={props.userInfo.avatar.url} alt={`Picture of ${props.userInfo.name}`}></img> */}
        </div>
    )
}