import React, {useState} from 'react';
import ToolButton from "./toolbutton/toolbutton";

function ToolBar(props) {

    const [itemList,setItemList] = useState({display:'none',items:[],left:0,top:0,width:100,height:100});
    return (
        <>
            <div className={"flex flex-row"}>
                <ToolButton setItemList={setItemList} index={1} />
                <ToolButton setItemList={setItemList} index={2} />
                <ToolButton setItemList={setItemList} index={3} />
                <ToolButton setItemList={setItemList} index={4} />

            </div>
            <div className={"absolute bg-gray-300"} style={{display:itemList.display,left:itemList.left+'px',top:itemList.top+'px',width:itemList.width+'px',height:itemList.height+'px'}}>
                <div className={"flex flex-col"}>
                    {itemList.items.map(x=>x)}
                </div>
            </div>


        </>
    );
}

export default ToolBar;